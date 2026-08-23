import axios from 'axios';
import { WebSocket } from 'ws';
import { getDb, saveDb } from './db.js';
import { DIRECTORY_LIST, USER_AGENTS, extractUrlDetails, formatDirectoryUrl } from './directories.js';
import { verifyLiveBacklink, triggerIndexingWorkflow, parseProxyString } from './indexer.js';

export interface RetryPolicyConfig {
  enabled: boolean;
  maxRetries: number;
  initialBackoffMs: number;
  maxBackoffMs: number;
  transientCodes: number[];
}

export interface TaskJobConfig {
  submissionId: string;
  targetUrls: string[];
  priority?: 'High' | 'Medium' | 'Low' | string;
  urlPriorities?: Record<string, string>;
  features: {
    generateBacklinks: boolean;
    checkLiveConfirmation: boolean;
    requestIndexing: boolean;
    runGoogleIndexing: boolean;
    runPingServices: boolean;
  };
  selectedDirectoryIds?: string[];
  concurrencyLimit: number; // 1 to 10
  proxyList: string[];
  googleServiceAccountJson?: string;
  autoRotateProxies?: boolean;
  autoRotatePatterns?: string[];
  maxRetriesPerProxy?: number;
  proxyCooldownSeconds?: number;
  retryPolicy?: Partial<RetryPolicyConfig>;
}

export interface DisabledProxyEntry {
  proxy: string;
  disabledUntil: number; // ms timestamp
  reason: string;
  disabledAt: number;
}

export class SubmissionJobManager {
  private activeJobs = new Map<string, boolean>();
  private wsClients = new Set<WebSocket>();
  private consecutive403Counts = new Map<string, number>();
  private disabledProxies = new Map<string, DisabledProxyEntry>();

  public registerClient(ws: WebSocket) {
    this.wsClients.add(ws);
    ws.on('close', () => this.wsClients.delete(ws));
  }

  public broadcast(event: string, payload: any) {
    const data = JSON.stringify({ event, payload });
    for (const client of this.wsClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  }

  public cancelJob(submissionId: string) {
    this.activeJobs.set(submissionId, false);
  }

  public getDisabledProxies(): DisabledProxyEntry[] {
    const now = Date.now();
    const list: DisabledProxyEntry[] = [];
    for (const [proxy, entry] of this.disabledProxies.entries()) {
      if (entry.disabledUntil > now) {
        list.push(entry);
      } else {
        this.disabledProxies.delete(proxy);
        this.consecutive403Counts.delete(proxy);
      }
    }
    return list;
  }

  public reinstateProxy(proxy: string) {
    this.disabledProxies.delete(proxy);
    this.consecutive403Counts.delete(proxy);
    this.broadcast('proxy_reinstated', { proxy, timestamp: new Date().toISOString() });
  }

  public recordProxyResult(proxy: string | undefined, statusCode: number) {
    if (!proxy) return;
    if (statusCode === 403) {
      const count = (this.consecutive403Counts.get(proxy) || 0) + 1;
      this.consecutive403Counts.set(proxy, count);
      if (count >= 3) {
        const disabledUntil = Date.now() + 10 * 60 * 1000; // 10 minutes
        const entry: DisabledProxyEntry = {
          proxy,
          disabledUntil,
          disabledAt: Date.now(),
          reason: '3 consecutive 403 Forbidden errors detected (Cloudflare/WAF block)'
        };
        this.disabledProxies.set(proxy, entry);
        this.broadcast('proxy_auto_disabled', {
          proxy,
          disabledUntil: new Date(disabledUntil).toISOString(),
          reason: entry.reason,
          durationMinutes: 10
        });
      }
    } else if (statusCode >= 200 && statusCode < 400) {
      this.consecutive403Counts.set(proxy, 0);
    }
  }

  public getAvailableProxies(proxyList: string[]): string[] {
    const now = Date.now();
    return proxyList.filter(p => {
      const entry = this.disabledProxies.get(p);
      if (entry && entry.disabledUntil > now) {
        return false;
      }
      if (entry && entry.disabledUntil <= now) {
        this.disabledProxies.delete(p);
        this.consecutive403Counts.delete(p);
      }
      return true;
    });
  }

  /**
   * Evaluates if HTTP response or error message matches configured error triggers for rotation
   */
  private matchErrorPattern(
    status: number,
    errorMsg: string,
    patterns: string[]
  ): string | null {
    const defaultPatterns = ['429', '403', '503', 'rate limit', 'forbidden', 'blocked', 'timeout', 'econnreset'];
    const activePatterns = patterns && patterns.length > 0 ? patterns : defaultPatterns;

    const lowerMsg = (errorMsg || '').toLowerCase();
    const strStatus = status.toString();

    for (const pat of activePatterns) {
      const cleanPat = pat.trim().toLowerCase();
      if (!cleanPat) continue;

      if (cleanPat === '429' && status === 429) {
        return '429 Rate Limited / Too Many Requests';
      }
      if (cleanPat === '403' && status === 403) {
        return '403 Forbidden / WAF Protection Blocked';
      }
      if (cleanPat === '503' && status === 503) {
        return '503 Service Unavailable';
      }
      if (cleanPat === strStatus) {
        return `HTTP ${status} Detected`;
      }
      if (lowerMsg.includes(cleanPat)) {
        return `Pattern match: "${pat}" (${errorMsg || `HTTP ${status}`})`;
      }
    }

    return null;
  }

  public async startJob(config: TaskJobConfig) {
    const db = await getDb();
    const {
      submissionId,
      targetUrls,
      features,
      selectedDirectoryIds,
      concurrencyLimit,
      proxyList,
      googleServiceAccountJson,
      autoRotateProxies = true,
      autoRotatePatterns = ['429', '403', '503', 'rate limit', 'timeout', 'blocked', 'forbidden'],
      maxRetriesPerProxy = 2
    } = config;

    this.activeJobs.set(submissionId, true);

    // Filter directories to use
    const directoriesToRun = selectedDirectoryIds && selectedDirectoryIds.length > 0
      ? DIRECTORY_LIST.filter(d => selectedDirectoryIds.includes(d.id))
      : DIRECTORY_LIST;

    const totalTasks = targetUrls.length * directoriesToRun.length;

    const jobPriority = config.priority || 'Medium';

    // Record initial submission in DB
    db.run(
      `INSERT INTO submissions (id, created_at, target_url, status, total_directories, completed_directories, confirmed_count, indexed_count, priority)
       VALUES (?, ?, ?, ?, ?, 0, 0, 0, ?)`,
      [submissionId, new Date().toISOString(), targetUrls.join(', '), 'Processing', totalTasks, jobPriority]
    );
    saveDb();

    this.broadcast('submission_started', {
      submissionId,
      totalTasks,
      targetUrlsCount: targetUrls.length,
      directoriesCount: directoriesToRun.length,
      priority: jobPriority,
      autoRotateEnabled: autoRotateProxies && proxyList.length > 1
    });

    // Configuration for Intelligent Retry Policy
    const retryPolicyConfig: RetryPolicyConfig = {
      enabled: config.retryPolicy?.enabled !== false,
      maxRetries: typeof config.retryPolicy?.maxRetries === 'number' ? config.retryPolicy.maxRetries : 3,
      initialBackoffMs: config.retryPolicy?.initialBackoffMs || 1000,
      maxBackoffMs: config.retryPolicy?.maxBackoffMs || 15000,
      transientCodes: config.retryPolicy?.transientCodes || [408, 429, 500, 502, 503, 504],
    };

    // Generate queue of individual directory submissions
    interface WorkUnit {
      targetUrl: string;
      directory: typeof DIRECTORY_LIST[0];
      retryAttempt?: number;
    }

    const workQueue: WorkUnit[] = [];
    for (const url of targetUrls) {
      for (const dir of directoriesToRun) {
        workQueue.push({ targetUrl: url, directory: dir, retryAttempt: 0 });
      }
    }

    let completedTasks = 0;
    let totalConfirmed = 0;
    let totalIndexed = 0;

    // Helper to evaluate transient network/HTTP errors for backoff
    const isTransientError = (status: number, msg: string): boolean => {
      if (retryPolicyConfig.transientCodes.includes(status)) return true;
      const lower = (msg || '').toLowerCase();
      return (
        lower.includes('econnreset') ||
        lower.includes('etimedout') ||
        lower.includes('socket hang up') ||
        lower.includes('timeout') ||
        lower.includes('too many requests') ||
        lower.includes('service unavailable') ||
        lower.includes('gateway timeout')
      );
    };

    // Concurrency worker implementation with Auto-Rotate Shield & Intelligent Backoff Retry
    const worker = async (workerId: number) => {
      let currentProxyIndex = workerId % Math.max(proxyList.length, 1);

      while (workQueue.length > 0) {
        if (this.activeJobs.get(submissionId) === false) {
          break; // Job cancelled
        }

        const unit = workQueue.shift();
        if (!unit) break;

        const { targetUrl, directory, retryAttempt = 0 } = unit;
        const generatedBacklink = formatDirectoryUrl(directory, targetUrl);
        const { domain } = extractUrlDetails(targetUrl);

        if (retryAttempt > 0) {
          this.broadcast('retry_executed', {
            submissionId,
            targetUrl,
            directoryName: directory.name,
            attemptNumber: retryAttempt,
            maxRetries: retryPolicyConfig.maxRetries,
            timestamp: new Date().toISOString(),
          });
        }

        let userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
        const availableProxies = this.getAvailableProxies(proxyList);
        let currentProxy = availableProxies.length > 0 ? availableProxies[currentProxyIndex % availableProxies.length] : (proxyList[0] || undefined);

        // Random jitter delay (800ms - 2000ms)
        const randomDelay = Math.floor(800 + Math.random() * 1200);
        await new Promise(resolve => setTimeout(resolve, randomDelay));

        let submissionStatus = 'Generated';
        let httpStatus = 0;
        let liveVerification = 'Pending';
        let googleIndexing = 'Pending';
        let pingStatus = 'Pending';
        let notes = '';

        let attempt = 0;
        let success = false;

        // Step 1: Submit / Trigger directory page with auto-rotate retry loop
        while (attempt <= (autoRotateProxies && proxyList.length > 1 ? maxRetriesPerProxy : 0) && !success) {
          attempt++;
          const livePool = this.getAvailableProxies(proxyList);
          currentProxy = livePool.length > 0 ? livePool[currentProxyIndex % livePool.length] : undefined;
          userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

          try {
            const configAxios: any = {
              timeout: 7000,
              headers: { 'User-Agent': userAgent },
              validateStatus: () => true
            };
            if (currentProxy) {
              const parsedP = parseProxyString(currentProxy);
              if (parsedP) configAxios.proxy = parsedP;
            }

            const res = await axios.get(generatedBacklink, configAxios);
            httpStatus = res.status;

            // Track proxy consecutive status (auto-disables on 3 consecutive 403s)
            this.recordProxyResult(currentProxy, res.status);

            // Check for rotation triggers (429, 403, 503, or pattern matches)
            const matchedPattern = this.matchErrorPattern(res.status, res.statusText || '', autoRotatePatterns);

            if (matchedPattern && autoRotateProxies && proxyList.length > 1) {
              const oldProxy = currentProxy || 'Direct Gateway';
              const nextPool = this.getAvailableProxies(proxyList);
              currentProxyIndex = (currentProxyIndex + 1) % Math.max(nextPool.length, 1);
              const newProxy = nextPool[currentProxyIndex] || 'Direct Gateway';

              const rotationPayload = {
                id: `rot_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                submissionId,
                oldProxy,
                newProxy,
                triggerPattern: matchedPattern,
                statusCode: res.status,
                reason: `Auto-Rotate Shield triggered on ${directory.name}: ${matchedPattern}`,
                timestamp: new Date().toISOString()
              };

              this.broadcast('proxy_rotated', rotationPayload);
              notes = `[Auto-Rotated to ${newProxy.split('@')[0]} due to ${matchedPattern}]`;

              // Brief backoff before retry with new proxy
              await new Promise(r => setTimeout(r, 600));
              continue;
            }

            httpStatus = res.status;
            submissionStatus = res.status < 400 ? 'Submitted' : `Failed (${res.status})`;
            success = res.status < 400;
          } catch (err: any) {
            httpStatus = err.response?.status || 0;
            this.recordProxyResult(currentProxy, httpStatus);

            const matchedPattern = this.matchErrorPattern(httpStatus, err.message || '', autoRotatePatterns);

            if (matchedPattern && autoRotateProxies && proxyList.length > 1 && attempt <= maxRetriesPerProxy) {
              const oldProxy = currentProxy || 'Direct Gateway';
              const nextPool = this.getAvailableProxies(proxyList);
              currentProxyIndex = (currentProxyIndex + 1) % Math.max(nextPool.length, 1);
              const newProxy = nextPool[currentProxyIndex] || 'Direct Gateway';

              const rotationPayload = {
                id: `rot_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                submissionId,
                oldProxy,
                newProxy,
                triggerPattern: matchedPattern,
                statusCode: httpStatus,
                reason: `Auto-Rotate Shield triggered on ${directory.name}: ${matchedPattern}`,
                timestamp: new Date().toISOString()
              };

              this.broadcast('proxy_rotated', rotationPayload);
              notes = `[Auto-Rotated to ${newProxy.split('@')[0]} due to ${matchedPattern}]`;

              await new Promise(r => setTimeout(r, 600));
              continue;
            }

            submissionStatus = 'Submission Error';
            notes = err.message || 'Timeout / Connection failed';
            break;
          }
        }

        // Check if failed due to transient HTTP error and eligible for intelligent exponential backoff re-queue
        if (
          !success &&
          retryPolicyConfig.enabled &&
          retryAttempt < retryPolicyConfig.maxRetries &&
          isTransientError(httpStatus, notes)
        ) {
          const nextAttempt = retryAttempt + 1;
          const baseBackoff = retryPolicyConfig.initialBackoffMs * Math.pow(2, nextAttempt - 1);
          const jitter = Math.floor(Math.random() * 500);
          const backoffDelayMs = Math.min(baseBackoff + jitter, retryPolicyConfig.maxBackoffMs);
          const nextAttemptAt = new Date(Date.now() + backoffDelayMs).toISOString();

          this.broadcast('retry_scheduled', {
            id: `retry_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            submissionId,
            targetUrl,
            directoryName: directory.name,
            attemptNumber: nextAttempt,
            maxRetries: retryPolicyConfig.maxRetries,
            triggerStatus: httpStatus,
            triggerReason: notes || `Transient HTTP ${httpStatus} Error`,
            backoffDelayMs,
            nextAttemptAt,
            timestamp: new Date().toISOString(),
          });

          // Re-queue work unit with incremented attempt
          workQueue.push({
            targetUrl,
            directory,
            retryAttempt: nextAttempt,
          });

          // Sleep for exponential backoff duration before proceeding with next work unit
          await new Promise(r => setTimeout(r, Math.min(backoffDelayMs, 3000)));
          continue;
        }

        // Step 2: Live Confirmation Verification
        if (features.checkLiveConfirmation) {
          const verifyResult = await verifyLiveBacklink(generatedBacklink, domain, userAgent, currentProxy);
          if (verifyResult.isConfirmed) {
            liveVerification = 'Success (Confirmed)';
            totalConfirmed++;
          } else {
            liveVerification = 'Failed';
          }
          if (!notes) notes = verifyResult.reason;
        } else {
          liveVerification = 'Skipped';
        }

        // Step 3: Indexing Workflow (Google Indexing API & Ping)
        if (features.requestIndexing) {
          const isEligibleForIndexing = liveVerification === 'Success (Confirmed)' || !features.checkLiveConfirmation;
          if (isEligibleForIndexing) {
            const indexResult = await triggerIndexingWorkflow(generatedBacklink, targetUrl, {
              runGoogleIndexing: features.runGoogleIndexing,
              googleServiceAccountJson,
              runPingServices: features.runPingServices
            });
            googleIndexing = indexResult.googleStatus;
            pingStatus = indexResult.pingStatus;
            if (googleIndexing === 'Submitted' || pingStatus === 'Success') {
              totalIndexed++;
            }
          } else {
            googleIndexing = 'Skipped (Unconfirmed)';
            pingStatus = 'Skipped (Unconfirmed)';
          }
        } else {
          googleIndexing = 'Skipped';
          pingStatus = 'Skipped';
        }

        completedTasks++;

        // Save log in SQLite DB
        const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const logPriority = config.urlPriorities?.[targetUrl] || jobPriority;
        db.run(
          `INSERT INTO logs (
            id, submission_id, created_at, target_url, directory_name, directory_type,
            generated_backlink, submission_status, http_status, live_verification,
            google_indexing, ping_status, notes, priority
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            logId, submissionId, new Date().toISOString(), targetUrl, directory.name, directory.type,
            generatedBacklink, submissionStatus, httpStatus, liveVerification,
            googleIndexing, pingStatus, notes, logPriority
          ]
        );

        // Update submission progress in DB
        db.run(
          `UPDATE submissions SET 
            completed_directories = ?,
            confirmed_count = ?,
            indexed_count = ?
           WHERE id = ?`,
          [completedTasks, totalConfirmed, totalIndexed, submissionId]
        );
        saveDb();

        // Broadcast real-time log event to WebSocket clients
        this.broadcast('log_update', {
          submissionId,
          progress: Math.min(100, Math.round((completedTasks / totalTasks) * 100)),
          completedTasks,
          totalTasks,
          log: {
            id: logId,
            targetUrl,
            directoryName: directory.name,
            directoryType: directory.type,
            generatedBacklink,
            submissionStatus,
            httpStatus,
            liveVerification,
            googleIndexing,
            pingStatus,
            notes,
            priority: logPriority,
            createdAt: new Date().toISOString()
          }
        });
      }
    };

    // Run parallel workers up to concurrencyLimit
    const workerPromises = [];
    const actualConcurrency = Math.min(concurrencyLimit, 10);
    for (let i = 0; i < actualConcurrency; i++) {
      workerPromises.push(worker(i));
    }

    await Promise.all(workerPromises);

    const isCancelled = this.activeJobs.get(submissionId) === false;
    const finalStatus = isCancelled ? 'Cancelled' : 'Completed';

    db.run(`UPDATE submissions SET status = ? WHERE id = ?`, [finalStatus, submissionId]);
    saveDb();

    this.broadcast('submission_finished', {
      submissionId,
      status: finalStatus,
      completedTasks,
      totalConfirmed,
      totalIndexed
    });

    this.activeJobs.delete(submissionId);
  }
}

export const jobManager = new SubmissionJobManager();
