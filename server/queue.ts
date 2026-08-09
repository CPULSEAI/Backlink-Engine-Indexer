import axios from 'axios';
import { WebSocket } from 'ws';
import { getDb, saveDb } from './db.js';
import { DIRECTORY_LIST, USER_AGENTS, extractUrlDetails, formatDirectoryUrl } from './directories.js';
import { verifyLiveBacklink, triggerIndexingWorkflow } from './indexer.js';

export interface TaskJobConfig {
  submissionId: string;
  targetUrls: string[];
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
}

export class SubmissionJobManager {
  private activeJobs = new Map<string, boolean>();
  private wsClients = new Set<WebSocket>();

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

  public async startJob(config: TaskJobConfig) {
    const db = await getDb();
    const {
      submissionId,
      targetUrls,
      features,
      selectedDirectoryIds,
      concurrencyLimit,
      proxyList,
      googleServiceAccountJson
    } = config;

    this.activeJobs.set(submissionId, true);

    // Filter directories to use
    const directoriesToRun = selectedDirectoryIds && selectedDirectoryIds.length > 0
      ? DIRECTORY_LIST.filter(d => selectedDirectoryIds.includes(d.id))
      : DIRECTORY_LIST;

    const totalTasks = targetUrls.length * directoriesToRun.length;

    // Record initial submission in DB
    db.run(
      `INSERT INTO submissions (id, created_at, target_url, status, total_directories, completed_directories, confirmed_count, indexed_count)
       VALUES (?, ?, ?, ?, ?, 0, 0, 0)`,
      [submissionId, new Date().toISOString(), targetUrls.join(', '), 'Processing', totalTasks]
    );
    saveDb();

    this.broadcast('submission_started', {
      submissionId,
      totalTasks,
      targetUrlsCount: targetUrls.length,
      directoriesCount: directoriesToRun.length
    });

    // Generate queue of individual directory submissions
    interface WorkUnit {
      targetUrl: string;
      directory: typeof DIRECTORY_LIST[0];
    }

    const workQueue: WorkUnit[] = [];
    for (const url of targetUrls) {
      for (const dir of directoriesToRun) {
        workQueue.push({ targetUrl: url, directory: dir });
      }
    }

    let completedTasks = 0;
    let totalConfirmed = 0;
    let totalIndexed = 0;

    // Concurrency worker implementation
    const worker = async (proxyIndex: number) => {
      while (workQueue.length > 0) {
        if (this.activeJobs.get(submissionId) === false) {
          break; // Job cancelled
        }

        const unit = workQueue.shift();
        if (!unit) break;

        const { targetUrl, directory } = unit;
        const generatedBacklink = formatDirectoryUrl(directory, targetUrl);
        const { domain } = extractUrlDetails(targetUrl);

        // Pick user agent & optional proxy
        const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
        const currentProxy = proxyList.length > 0 ? proxyList[proxyIndex % proxyList.length] : undefined;

        // Random delay (1 to 2.5 seconds) to prevent rate-limiting
        const randomDelay = Math.floor(1000 + Math.random() * 1500);
        await new Promise(resolve => setTimeout(resolve, randomDelay));

        let submissionStatus = 'Generated';
        let httpStatus = 0;
        let liveVerification = 'Pending';
        let googleIndexing = 'Pending';
        let pingStatus = 'Pending';
        let notes = '';

        // Step 1: Submit / Trigger directory page
        try {
          const configAxios: any = {
            timeout: 7000,
            headers: { 'User-Agent': userAgent },
            validateStatus: () => true
          };
          const res = await axios.get(generatedBacklink, configAxios);
          httpStatus = res.status;
          submissionStatus = res.status < 400 ? 'Submitted' : `Failed (${res.status})`;
        } catch (err: any) {
          submissionStatus = 'Submission Error';
          httpStatus = err.response?.status || 0;
          notes = err.message || 'Timeout / Connection failed';
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
        db.run(
          `INSERT INTO logs (
            id, submission_id, created_at, target_url, directory_name, directory_type,
            generated_backlink, submission_status, http_status, live_verification,
            google_indexing, ping_status, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            logId, submissionId, new Date().toISOString(), targetUrl, directory.name, directory.type,
            generatedBacklink, submissionStatus, httpStatus, liveVerification,
            googleIndexing, pingStatus, notes
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
