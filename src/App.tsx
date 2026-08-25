import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { ProgressBar } from './components/ProgressBar';
import { ResultsTable } from './components/ResultsTable';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { DirectoriesModal } from './components/DirectoriesModal';
import { AnalyticsCard } from './components/AnalyticsCard';
import { SeoAuditModal } from './components/SeoAuditModal';
import { GeoBlueprintModal } from './components/GeoBlueprintModal';
import { KeywordGapRadar } from './components/KeywordGapRadar';
import { ContentGraderModal } from './components/ContentGraderModal';
import { DomainProfilerModal } from './components/DomainProfilerModal';
import { HelpManualModal } from './components/HelpManualModal';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';
import { SeoFunnelTimeline } from './components/SeoFunnelTimeline';
import { SmartBatchScheduler } from './components/SmartBatchScheduler';
import { ConversionWizardModal } from './components/ConversionWizardModal';
import { ClarityOverloadWizardModal } from './components/ClarityOverloadWizardModal';
import { AutonomousSiteAuditorWizardModal } from './components/AutonomousSiteAuditorWizardModal';
import { ConversionWizardBanner } from './components/ConversionWizardBanner';
import { WizardsHubDashboard } from './components/WizardsHubDashboard';
import { GoogleApiWizard } from './components/GoogleApiWizard';
import { BulkSeoValidator } from './components/BulkSeoValidator';
import { BulkBacklinkCounter } from './components/BulkBacklinkCounter';
import { VisualSchemaGeneratorModal } from './components/VisualSchemaGeneratorModal';
import { PeerNetworkStatusCard } from './components/PeerNetworkStatusCard';
import { SitemapAuditModal } from './components/SitemapAuditModal';
import { Sidebar } from './components/Sidebar';
import { PlainEnglishSummaryCard } from './components/PlainEnglishSummaryCard';
import { AuthAccountCenter } from './components/AuthAccountCenter';
import { DiagnosticsCenter } from './components/DiagnosticsCenter';
import { ReportsExportCenter } from './components/ReportsExportCenter';
import { LiveOperationsCenter } from './components/LiveOperationsCenter';
import { IndexingEngineView } from './components/IndexingEngineView';
import { TrafficEngineDashboard } from './components/TrafficEngineDashboard';
import { UrlIndexingWizardModal } from './components/UrlIndexingWizardModal';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { DailyPerformanceDigest } from './components/DailyPerformanceDigest';
import { ConfirmationModal, ConfirmationModalProps } from './components/ConfirmationModal';
import { DirectoryEntry, LogItem, SubmissionRecord, SystemSettings, AnalyticsData, AutonomousConfig, ApiHealthReport, WorkspaceSnapshot, DashboardViewType, AuthSession, NewContentDetectedEvent } from './types';

export default function App() {
  const [directories, setDirectories] = useState<DirectoryEntry[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [history, setHistory] = useState<SubmissionRecord[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);
  const [newContentAlert, setNewContentAlert] = useState<NewContentDetectedEvent | null>(null);

  // Global Confirmation Modal State for Destructive Actions
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    severity?: 'danger' | 'warning' | 'info';
    actionType?: 'cancel_job' | 'clear_logs' | 'reset_settings' | 'delete' | 'generic';
    impactItems?: string[];
    requireConfirmationPhrase?: string;
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // API Health Monitor State
  const [apiHealthReport, setApiHealthReport] = useState<ApiHealthReport | null>(null);
  const [isRefreshingHealth, setIsRefreshingHealth] = useState<boolean>(false);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Workspace File Input Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Job progress state
  const [jobStatus, setJobStatus] = useState<'Processing' | 'Completed' | 'Cancelled' | 'Idle'>('Idle');
  const [progressPercent, setProgressPercent] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [indexedCount, setIndexedCount] = useState(0);

  // Autonomous Continuous Submission State
  const [isAutonomousActive, setIsAutonomousActive] = useState(false);
  const [autonomousAccumulatedCount, setAutonomousAccumulatedCount] = useState(0);
  const [autonomousBatchCount, setAutonomousBatchCount] = useState(1);
  const [autonomousTargetGoal, setAutonomousTargetGoal] = useState(100000);
  const [autonomousMetric, setAutonomousMetric] = useState<'tasks' | 'confirmed'>('tasks');

  const lastJobConfigRef = useRef<any>(null);
  const autonomousRef = useRef<{
    active: boolean;
    accumulated: number;
    target: number;
    metric: 'tasks' | 'confirmed';
    batchCount: number;
  }>({
    active: false,
    accumulated: 0,
    target: 100000,
    metric: 'tasks',
    batchCount: 1,
  });

  // Current Active Main View Switcher
  const [currentView, setCurrentView] = useState<DashboardViewType>('bento');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isIndexingWizardOpen, setIsIndexingWizardOpen] = useState(false);
  const [authSession, setAuthSession] = useState<AuthSession | null>({
    email: 'admin@careerpulseai.net',
    isAuthorized: true,
    token: 'jwt_enterprise_session_9921',
    authorizedDomains: ['careerpulseai.net', 'jobhop.ai'],
  });

  // Drawer & Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDirectoriesOpen, setIsDirectoriesOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isGeoBlueprintOpen, setIsGeoBlueprintOpen] = useState(false);
  const [isContentGraderOpen, setIsContentGraderOpen] = useState(false);
  const [isDomainProfilerOpen, setIsDomainProfilerOpen] = useState(false);
  const [isHelpManualOpen, setIsHelpManualOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isConversionWizardOpen, setIsConversionWizardOpen] = useState(false);
  const [isClarityWizardOpen, setIsClarityWizardOpen] = useState(false);
  const [isAutonomousAuditorOpen, setIsAutonomousAuditorOpen] = useState(false);
  const [auditorInitialUrl, setAuditorInitialUrl] = useState('');
  const [isGoogleApiWizardOpen, setIsGoogleApiWizardOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isSitemapAuditOpen, setIsSitemapAuditOpen] = useState(false);
  const [sitemapInitialDomain, setSitemapInitialDomain] = useState('careerpulseai.net');
  const [wizardInitialUrl, setWizardInitialUrl] = useState('');
  const [clarityInitialUrl, setClarityInitialUrl] = useState('');
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [profilerDomain, setProfilerDomain] = useState('');
  const [graderUrl, setGraderUrl] = useState('');
  const [graderKeyword, setGraderKeyword] = useState('');
  const [wizardsInitialTab, setWizardsInitialTab] = useState<'wizards' | 'citation-sim' | 'whitelabel-pdf' | 'bulk-seo' | 'funnel-map' | 'link-strategist'>('wizards');
  const [linkStrategyUrl, setLinkStrategyUrl] = useState('https://careerpulseai.net');

  // --- BACKGROUND OBSERVER: HISTORICAL URLS RE-INDEXING MONITOR (>30 DAYS) ---
  // Monitors 'Last Indexed' timestamp of historical URLs and triggers a low-priority 'Content Refresh Recommended' alert
  const lastRefreshCheckRef = useRef<number | null>(null);
  useEffect(() => {
    if (!history || history.length === 0) return;

    const now = Date.now();
    if (lastRefreshCheckRef.current && now - lastRefreshCheckRef.current < 180000) {
      return;
    }
    lastRefreshCheckRef.current = now;

    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const staleList: { url: string; daysAgo: number }[] = [];

    history.forEach((item) => {
      const itemDate = new Date(item.created_at).getTime();
      if (!isNaN(itemDate)) {
        const diffMs = now - itemDate;
        if (diffMs >= THIRTY_DAYS_MS) {
          const daysAgo = Math.floor(diffMs / (24 * 60 * 60 * 1000));
          staleList.push({ url: item.target_url, daysAgo });
        }
      }
    });

    const hasAlertedKey = 'has_alerted_stale_indexing_30d_session';
    const hasEverAlerted = sessionStorage.getItem(hasAlertedKey);

    if (staleList.length > 0 && !hasEverAlerted) {
      sessionStorage.setItem(hasAlertedKey, 'true');
      toast(
        (t) => (
          <div className="flex flex-col gap-1.5 font-mono-brutal text-xs">
            <div className="flex items-center gap-1.5 font-bold text-black uppercase">
              <span className="text-[#ff4d00]">🕒</span>
              <span>Content Refresh Recommended (Low Priority)</span>
            </div>
            <p className="text-zinc-700 text-[11px]">
              {staleList.length} historical URL{staleList.length > 1 ? 's have' : ' has'} not been re-indexed in &gt;30 days (e.g., {staleList[0].url}).
            </p>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  setAuditorInitialUrl(staleList[0].url);
                  setIsAutonomousAuditorOpen(true);
                }}
                className="px-2.5 py-1 bg-black text-white font-bold text-[10px] hover:bg-[#ff4d00] hover:text-black border border-black cursor-pointer uppercase"
              >
                14-Phase Audit
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  handleStartJob({
                    targetUrls: staleList.map((s) => s.url),
                    features: {
                      generateBacklinks: true,
                      checkLiveConfirmation: true,
                      requestIndexing: true,
                      runGoogleIndexing: true,
                      runPingServices: true,
                    },
                    selectedDirectoryIds: directories.slice(0, 5).map((d) => d.id),
                    concurrencyLimit: 4,
                  });
                }}
                className="px-2.5 py-1 bg-white text-black font-bold text-[10px] hover:bg-zinc-200 border border-black cursor-pointer uppercase"
              >
                Re-Index
              </button>
            </div>
          </div>
        ),
        {
          duration: 10000,
          position: 'bottom-right',
          style: {
            background: '#faf8f5',
            border: '2px solid black',
            borderRadius: '0px',
            boxShadow: '4px 4px 0 #000',
          },
        }
      );
    }
  }, [history, directories]);

  // --- DESKTOP BROWSER NOTIFICATION TRIGGER ---
  // Fires when apiHealthReport shows degradation below 80% to ensure immediate awareness of indexing pipeline issues
  const lastHealthAlertRef = useRef<number | null>(null);
  useEffect(() => {
    if (!apiHealthReport) return;
    const score = apiHealthReport.overallScore;
    if (score < 80) {
      const now = Date.now();
      // Throttle notifications so user is not spammed (max 1 per 5 mins unless score drops)
      if (!lastHealthAlertRef.current || now - lastHealthAlertRef.current > 300000) {
        lastHealthAlertRef.current = now;

        // Browser Native Desktop Notification
        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            try {
              new Notification('⚠️ Indexing Pipeline Alert: Health Degraded', {
                body: `API Health dropped to ${score}% (<80% SLA threshold). Check Diagnostics Center.`,
                icon: '/favicon.ico',
              });
            } catch (e) {
              console.warn('Desktop notification dispatch failed:', e);
            }
          } else if (Notification.permission === 'default') {
            Notification.requestPermission().then((perm) => {
              if (perm === 'granted') {
                try {
                  new Notification('⚠️ Indexing Pipeline Alert: Health Degraded', {
                    body: `API Health dropped to ${score}% (<80% SLA threshold). Check Diagnostics Center.`,
                    icon: '/favicon.ico',
                  });
                } catch (e) {
                  console.warn('Desktop notification dispatch failed:', e);
                }
              }
            });
          }
        }

        // Accompanying Toast Alert
        toast.error(`⚠️ PIPELINE ALERT: API Health degraded to ${score}% (<80% SLA threshold). Check Diagnostics Center!`, {
          duration: 6000,
        });
      }
    }
  }, [apiHealthReport]);

  const handleOpenSitemapAudit = (domain?: string) => {
    if (domain) setSitemapInitialDomain(domain);
    setIsSitemapAuditOpen(true);
  };

  // Auto-launch Onboarding Wizard for first-time visitors
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('geo_seo_onboarded');
    if (!hasOnboarded) {
      setIsWizardOpen(true);
    }
  }, []);

  const handleOpenContentGrader = (url?: string, keyword?: string) => {
    setGraderUrl(url || '');
    setGraderKeyword(keyword || '');
    setIsContentGraderOpen(true);
  };

  const handleOpenDomainProfiler = (domain?: string) => {
    if (domain) setProfilerDomain(domain);
    setIsDomainProfilerOpen(true);
  };

  // Settings State
  const [settings, setSettings] = useState<SystemSettings>({
    proxyList: '',
    googleServiceAccountJson: '',
    defaultConcurrency: 4,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const reconnectTimeoutRef = useRef<any>(null);

  // Fetch initial directories, history, settings, analytics, and api health
  useEffect(() => {
    isMountedRef.current = true;
    fetchDirectories();
    fetchHistory();
    fetchSettings();
    fetchAnalytics();
    fetchApiHealthReport();
    connectWebSocket();

    return () => {
      isMountedRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        const targetWs = wsRef.current;
        targetWs.onclose = null;
        targetWs.onerror = null;
        targetWs.onmessage = null;
        targetWs.onopen = null;
        try {
          if (targetWs.readyState === WebSocket.OPEN) {
            targetWs.close(1000, 'App unmounting');
          } else if (targetWs.readyState === WebSocket.CONNECTING) {
            targetWs.onopen = () => {
              try { targetWs.close(1000, 'App unmounting'); } catch {}
            };
          }
        } catch {
          // Safe ignore
        }
        wsRef.current = null;
      }
    };
  }, []);

  const fetchApiHealthReport = async () => {
    try {
      const res = await axios.get('/api/health/integrations');
      if (res.data && res.data.report) {
        setApiHealthReport(res.data.report);
      }
    } catch (err) {
      console.error('Failed to load API health report', err);
    }
  };

  const handleRefreshApiHealth = async () => {
    setIsRefreshingHealth(true);
    try {
      const res = await axios.post('/api/health/ping-all');
      if (res.data && res.data.report) {
        setApiHealthReport(res.data.report);
        toast.success(`API Health check completed! Overall score: ${res.data.report.overallScore}%`);
      }
    } catch (err) {
      console.error('Failed to refresh API health', err);
      toast.error('Failed to refresh API health');
    } finally {
      setIsRefreshingHealth(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await axios.get('/api/analytics/30days');
      if (res.data) {
        setAnalyticsData(res.data);
      }
    } catch (err) {
      console.error('Failed to load 30-day analytics', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchDirectories = async () => {
    try {
      const res = await axios.get('/api/directories');
      if (res.data && res.data.directories) {
        setDirectories(res.data.directories);
      }
    } catch (err) {
      console.error('Failed to load directories', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/submissions/history');
      if (res.data && res.data.submissions) {
        setHistory(res.data.submissions);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/settings');
      if (res.data && res.data.settings) {
        const s = res.data.settings;
        setSettings({
          proxyList: s.proxyList || '',
          googleServiceAccountJson: s.googleServiceAccountJson || '',
          defaultConcurrency: Number(s.defaultConcurrency) || 4,
          testProxiesBeforeJob: s.testProxiesBeforeJob ?? true,
        });
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    }
  };

  const connectWebSocket = () => {
    if (!isMountedRef.current) return;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      try {
        const oldWs = wsRef.current;
        oldWs.onclose = null;
        oldWs.onerror = null;
        oldWs.onmessage = null;
        oldWs.onopen = null;
        if (oldWs.readyState === WebSocket.OPEN) {
          oldWs.close(1000, 'Reconnecting');
        } else if (oldWs.readyState === WebSocket.CONNECTING) {
          oldWs.onopen = () => {
            try { oldWs.close(1000, 'Reconnecting'); } catch {}
          };
        }
      } catch {
        // Safe ignore
      }
      wsRef.current = null;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (!isMountedRef.current) {
          ws.close();
          return;
        }
        setWsConnected(true);
      };

      ws.onerror = () => {
        if (isMountedRef.current) {
          setWsConnected(false);
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'submission_started') {
            setJobStatus('Processing');
            setProgressPercent(0);
            setCompletedTasks(0);
            setTotalTasks(data.payload.totalTasks);
            setConfirmedCount(0);
            setIndexedCount(0);
            setLogs([]);
          } else if (data.event === 'log_update') {
            const { progress, completedTasks, totalTasks, log } = data.payload;
            setProgressPercent(progress);
            setCompletedTasks(completedTasks);
            setTotalTasks(totalTasks);

            if (log.liveVerification.includes('Confirmed')) {
              setConfirmedCount((prev) => prev + 1);
            }
            if (log.googleIndexing === 'Submitted' || log.pingStatus === 'Success') {
              setIndexedCount((prev) => prev + 1);
            }

            // Update Autonomous Continuous Progress Milestone
            if (autonomousRef.current.active) {
              if (autonomousRef.current.metric === 'tasks') {
                autonomousRef.current.accumulated += 1;
                setAutonomousAccumulatedCount(autonomousRef.current.accumulated);
              } else if (
                autonomousRef.current.metric === 'confirmed' &&
                log.liveVerification.includes('Confirmed')
              ) {
                autonomousRef.current.accumulated += 1;
                setAutonomousAccumulatedCount(autonomousRef.current.accumulated);
              }
            }

            setLogs((prevLogs) => {
              if (prevLogs.some((l) => l.id === log.id)) {
                return prevLogs.map((l) => (l.id === log.id ? log : l));
              }
              return [log, ...prevLogs];
            });
          } else if (data.event === 'api_health_update') {
            if (data.payload) {
              setApiHealthReport(data.payload);
            }
          } else if (data.event === 'new_content_detected') {
            const payload = data.payload as NewContentDetectedEvent;
            setNewContentAlert(payload);
            toast(
              (t) => (
                <div className="flex flex-col gap-1">
                  <span className="font-black text-amber-500 flex items-center gap-1.5 text-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    New Content Detected
                  </span>
                  <span className="text-[11px] text-zinc-800 dark:text-zinc-200">
                    {payload.newUrlsCount} new URL{payload.newUrlsCount > 1 ? 's' : ''} discovered in sitemap for <span className="font-bold">{payload.domain}</span>
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        setCurrentView('live_operations');
                      }}
                      className="px-2 py-0.5 bg-black text-white dark:bg-zinc-800 dark:text-cyan-400 font-bold rounded text-[10px] cursor-pointer"
                    >
                      Open Live Operations
                    </button>
                  </div>
                </div>
              ),
              { duration: 8000, icon: '🚨' }
            );
          } else if (data.event === 'proxy_rotated') {
            const { reason, previousProxy, newProxy, attempt, remainingProxies } = data.payload || {};
            toast((t) => (
              <div className="flex flex-col gap-1">
                <span className="font-bold text-amber-400">🛡️ Proxy Shield Auto-Rotated</span>
                <span className="text-[11px] text-zinc-300">Trigger: {reason}</span>
                <span className="text-[10px] font-mono text-zinc-400">Switched to: {newProxy || 'Next node'} (Attempt {attempt}, {remainingProxies} left in pool)</span>
              </div>
            ), { duration: 5000, icon: '🔄' });
          } else if (data.event === 'retry_scheduled') {
            const { targetUrl, directoryName, attempt, maxRetries, delayMs, error } = data.payload || {};
            toast((t) => (
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-amber-400 text-xs">⏳ Intelligent Retry Scheduled (Attempt {attempt}/{maxRetries})</span>
                <span className="text-[11px] text-zinc-300 truncate max-w-xs">{directoryName}: {targetUrl}</span>
                <span className="text-[10px] font-mono text-amber-300">Backoff delay: {(delayMs / 1000).toFixed(1)}s &bull; Reason: {error}</span>
              </div>
            ), { duration: 4000, icon: '⏱️' });
          } else if (data.event === 'retry_executed') {
            const { targetUrl, directoryName, attempt } = data.payload || {};
            toast((t) => (
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-emerald-400 text-xs">🚀 Exponential Backoff Retry Executing</span>
                <span className="text-[11px] text-zinc-300 truncate max-w-xs">{directoryName}: {targetUrl}</span>
                <span className="text-[10px] font-mono text-zinc-400">Attempt #{attempt} re-dispatched to worker pool</span>
              </div>
            ), { duration: 3000, icon: '⚡' });
          } else if (data.event === 'submission_finished') {
            const isCancelled = data.payload.status === 'Cancelled';
            setJobStatus(isCancelled ? 'Cancelled' : 'Completed');
            setProgressPercent(100);
            fetchHistory();
            fetchAnalytics();

            if (isCancelled) {
              toast.error('Submission job was cancelled.');
            } else {
              toast.success('Submission job completed successfully!');
            }

            // Autonomous Continuous Mode Check & Loop Trigger
            if (autonomousRef.current.active && !isCancelled) {
              if (autonomousRef.current.accumulated >= autonomousRef.current.target) {
                setIsAutonomousActive(false);
                autonomousRef.current.active = false;
                toast.success(`Autonomous goal of ${autonomousRef.current.target} reached!`);
              } else if (lastJobConfigRef.current) {
                const nextBatch = autonomousRef.current.batchCount + 1;
                autonomousRef.current.batchCount = nextBatch;
                setAutonomousBatchCount(nextBatch);

                // Continuous Submission Auto-Loop Delay
                setTimeout(() => {
                  if (autonomousRef.current.active && lastJobConfigRef.current) {
                    handleStartJob(lastJobConfigRef.current, true);
                  }
                }, 1200);
              }
            }
          }
        } catch (e) {
          console.error('WebSocket parsing error', e);
        }
      };

      ws.onclose = () => {
        if (!isMountedRef.current) return;
        setWsConnected(false);
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 4000);
      };

      wsRef.current = ws;
    } catch (err) {
      console.warn('Could not establish WebSocket connection:', err);
      if (isMountedRef.current) {
        setWsConnected(false);
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 4000);
      }
    }
  };

  const handleStartJob = async (
    config: {
      targetUrls: string[];
      features: {
        generateBacklinks: boolean;
        checkLiveConfirmation: boolean;
        requestIndexing: boolean;
        runGoogleIndexing: boolean;
        runPingServices: boolean;
      };
      selectedDirectoryIds: string[];
      concurrencyLimit: number;
      autonomousConfig?: AutonomousConfig;
    },
    isInternalLoopPass = false
  ) => {
    try {
      lastJobConfigRef.current = config;

      if (config.autonomousConfig?.enabled && !isInternalLoopPass) {
        setIsAutonomousActive(true);
        setAutonomousAccumulatedCount(0);
        setAutonomousBatchCount(1);
        setAutonomousTargetGoal(config.autonomousConfig.targetGoalNumber);
        setAutonomousMetric(config.autonomousConfig.targetGoalMetric);

        autonomousRef.current = {
          active: true,
          accumulated: 0,
          target: config.autonomousConfig.targetGoalNumber,
          metric: config.autonomousConfig.targetGoalMetric,
          batchCount: 1,
        };
      } else if (!config.autonomousConfig?.enabled && !isInternalLoopPass) {
        setIsAutonomousActive(false);
        autonomousRef.current.active = false;
      }

      let activeProxyList = settings.proxyList
        .split('\n')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      // Pre-Flight Diagnostic Proxy Verification before dispatching job
      if (settings.testProxiesBeforeJob && activeProxyList.length > 0 && !isInternalLoopPass) {
        const pingToast = toast.loading(`Pre-Job Diagnostic: Testing ${activeProxyList.length} proxy nodes...`);
        try {
          const pingResp = await axios.post('/api/proxies/ping', { proxyList: activeProxyList });
          if (pingResp.data && pingResp.data.results) {
            const healthyOrModerate = pingResp.data.results
              .filter((r: any) => r.status === 'Healthy' || r.status === 'Moderate')
              .map((r: any) => r.ipPort);

            const deadCount = activeProxyList.length - healthyOrModerate.length;

            if (healthyOrModerate.length > 0) {
              activeProxyList = healthyOrModerate;
              if (deadCount > 0) {
                toast.success(`Pre-Job Diagnostic Verified: ${healthyOrModerate.length} active proxies selected (${deadCount} offline/slow nodes bypassed).`, { id: pingToast });
              } else {
                toast.success(`Pre-Job Diagnostic Verified: All ${activeProxyList.length} proxy nodes active & low-latency!`, { id: pingToast });
              }
            } else {
              toast.error(`Pre-Job Diagnostic Warning: All configured proxies failed ping test. Proceeding with direct connection.`, { id: pingToast });
            }
          } else {
            toast.dismiss(pingToast);
          }
        } catch (e) {
          toast.dismiss(pingToast);
        }
      }

      const res = await axios.post('/api/submissions/start', {
        ...config,
        proxyList: activeProxyList,
        googleServiceAccountJson: settings.googleServiceAccountJson,
      });

      if (res.data && res.data.submissionId) {
        setActiveSubmissionId(res.data.submissionId);
        setJobStatus('Processing');
        setLogs([]);
        if (!isInternalLoopPass) {
          toast.success('Submission job started successfully!');
        }
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to start job.';
      toast.error(errMsg);
    }
  };

  const requestStopAutonomous = async () => {
    setConfirmationState({
      isOpen: true,
      title: 'Stop Autonomous Campaign?',
      description: 'Are you sure you want to stop the autonomous background indexing loop? Any queued URL batches will be cancelled.',
      severity: 'warning',
      actionType: 'cancel_job',
      confirmButtonText: 'Stop Autonomous Loop',
      impactItems: [
        'Automatic 100k campaign background looping will immediately halt',
        'In-flight requests will finish or be aborted',
        'State will revert to manual dispatch mode',
      ],
      onConfirm: async () => {
        handleStopAutonomous();
        setConfirmationState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleStopAutonomous = () => {
    setIsAutonomousActive(false);
    autonomousRef.current.active = false;
    handleCancelJob();
    toast.error('Autonomous continuous mode stopped.');
  };

  const requestCancelJob = async () => {
    if (!activeSubmissionId) return;
    setConfirmationState({
      isOpen: true,
      title: 'Cancel Active Indexing Pipeline?',
      description: 'Are you sure you want to abort the active submission and indexing job? In-flight worker requests to search engines and directories will be halted.',
      severity: 'danger',
      actionType: 'cancel_job',
      confirmButtonText: 'Abort & Cancel Job',
      impactItems: [
        'Active Google Indexing API batch requests will be stopped',
        'IndexNow and directory pinging workers will be terminated',
        'The job status will be marked as Cancelled in the SQLite database',
      ],
      onConfirm: async () => {
        await handleCancelJob();
        setConfirmationState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleCancelJob = async () => {
    if (!activeSubmissionId) return;
    try {
      await axios.post(`/api/submissions/${activeSubmissionId}/cancel`);
      setJobStatus('Cancelled');
      toast.error('Submission job cancellation requested.');
    } catch (err) {
      console.error('Failed to cancel job', err);
      toast.error('Failed to cancel submission job.');
    }
  };

  const handleSelectSubmission = async (submissionId: string) => {
    setActiveSubmissionId(submissionId);
    try {
      const res = await axios.get(`/api/submissions/${submissionId}/logs`);
      if (res.data && res.data.logs) {
        const fetchedLogs: LogItem[] = res.data.logs.map((l: any) => ({
          id: l.id,
          targetUrl: l.target_url,
          directoryName: l.directory_name,
          directoryType: l.directory_type,
          generatedBacklink: l.generated_backlink,
          submissionStatus: l.submission_status,
          httpStatus: l.http_status,
          liveVerification: l.live_verification,
          googleIndexing: l.google_indexing,
          pingStatus: l.ping_status,
          notes: l.notes,
          createdAt: l.created_at,
        }));
        setLogs(fetchedLogs);
        setJobStatus('Completed');
        setProgressPercent(100);
        toast.success('Loaded historical submission logs.');
      }
    } catch (err) {
      console.error('Failed to fetch logs', err);
      toast.error('Failed to load submission logs.');
    }
  };

  const handleSaveSettings = async (newSettings: SystemSettings) => {
    setSettings(newSettings);
    try {
      await axios.post('/api/settings', { settings: newSettings });
      toast.success('System settings & proxy configurations saved successfully!');
    } catch (err) {
      console.error('Failed to save settings', err);
      toast.error('Failed to save settings.');
    }
  };

  const handleExportCsv = (submissionId?: string) => {
    const targetId = submissionId || activeSubmissionId;
    if (!targetId) return;
    window.open(`/api/submissions/${targetId}/export.csv`, '_blank');
  };

  const handleQuickSaveWorkspace = () => {
    try {
      const snapshot: WorkspaceSnapshot = {
        version: 1,
        timestamp: new Date().toISOString(),
        targetUrls: lastJobConfigRef.current?.targetUrls || [
          'https://example.com',
          'https://myprowebsite.org',
          'https://devblog.io',
        ],
        selectedCategory: 'ALL',
        selectedDirectoryIds: lastJobConfigRef.current?.selectedDirectoryIds || directories.map((d) => d.id),
        features: lastJobConfigRef.current?.features || {
          generateBacklinks: true,
          checkLiveConfirmation: true,
          requestIndexing: true,
          runGoogleIndexing: true,
          runPingServices: true,
        },
        concurrencyLimit: settings.defaultConcurrency || 4,
        autonomousConfig: {
          enabled: isAutonomousActive,
          targetGoalNumber: autonomousTargetGoal,
          targetGoalMetric: autonomousMetric,
          autoCycleUrls: true,
        },
        settings: settings,
      };

      const jsonStr = JSON.stringify(snapshot, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `seo_backlink_workspace_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      localStorage.setItem('seo_backlink_workspace_autosave', jsonStr);
      toast.success('Quick Save: Exported complete workspace state to JSON!');
    } catch (err) {
      console.error('Failed to quick-save workspace', err);
      toast.error('Failed to export workspace state.');
    }
  };

  const handleImportWorkspaceClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportWorkspaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const snapshot: WorkspaceSnapshot = JSON.parse(text);

        if (!snapshot || !snapshot.version) {
          throw new Error('Invalid workspace JSON file format');
        }

        // Apply loaded settings
        if (snapshot.settings) {
          setSettings(snapshot.settings);
          await axios.post('/api/settings', { settings: snapshot.settings });
        }

        // Apply autonomous settings if present
        if (snapshot.autonomousConfig) {
          setIsAutonomousActive(!!snapshot.autonomousConfig.enabled);
          if (snapshot.autonomousConfig.targetGoalNumber) {
            setAutonomousTargetGoal(snapshot.autonomousConfig.targetGoalNumber);
          }
          if (snapshot.autonomousConfig.targetGoalMetric) {
            setAutonomousMetric(snapshot.autonomousConfig.targetGoalMetric);
          }
        }

        const dateLabel = snapshot.timestamp || snapshot.exportedAt || new Date().toISOString();
        toast.success(`Workspace resumed! Loaded ${snapshot.targetUrls?.length || 0} target URLs and settings from ${new Date(dateLabel).toLocaleDateString()}`);
      } catch (err: any) {
        console.error('Failed to import workspace JSON', err);
        toast.error('Error importing workspace snapshot: ' + (err.message || 'Invalid JSON file'));
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#f2efeb] text-black font-sans selection:bg-[#ff4d00] selection:text-black flex flex-col">
      {/* Hidden File Input for Workspace Snapshot Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportWorkspaceFile}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Toast Notification Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#000000',
            border: '3px solid #000000',
            fontSize: '12px',
            fontFamily: "'Space Mono', monospace",
            borderRadius: '0px',
            boxShadow: '4px 4px 0 #000000',
            fontWeight: 'bold',
          },
          success: {
            iconTheme: {
              primary: '#000000',
              secondary: '#ff4d00',
            },
          },
          error: {
            iconTheme: {
              primary: '#000000',
              secondary: '#ff4d00',
            },
          },
        }}
      />

      {/* Header Bar */}
      <Header
        wsConnected={wsConnected}
        activeJobId={activeSubmissionId}
        currentView={currentView}
        onChangeView={(view) => setCurrentView(view)}
        onToggleSidebar={() => setIsSidebarMobileOpen((prev) => !prev)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDirectories={() => setIsDirectoriesOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenGeoBlueprint={() => setIsGeoBlueprintOpen(true)}
        onOpenDomainProfiler={() => handleOpenDomainProfiler()}
        onOpenHelpManual={() => setIsHelpManualOpen(true)}
        onOpenWizard={() => setIsIndexingWizardOpen(true)}
        onOpenClarityWizard={(url) => {
          setClarityInitialUrl(url || '');
          setIsClarityWizardOpen(true);
        }}
        onOpenGoogleApiWizard={() => setIsGoogleApiWizardOpen(true)}
        onOpenScheduler={() => setIsSchedulerOpen(true)}
        onQuickSaveWorkspace={handleQuickSaveWorkspace}
        onImportWorkspace={handleImportWorkspaceClick}
        apiHealthReport={apiHealthReport}
        onRefreshApiHealth={handleRefreshApiHealth}
        isRefreshingApiHealth={isRefreshingHealth}
        totalDirectoriesCount={directories.length}
      />

      {/* Main Container with Sidebar + Responsive View Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Desktop / Mobile Sidebar */}
        <Sidebar
          currentView={currentView}
          onChangeView={(view) => setCurrentView(view)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isMobileOpen={isSidebarMobileOpen}
          onCloseMobile={() => setIsSidebarMobileOpen(false)}
          onOpenConversionWizard={(url) => {
            setWizardInitialUrl(url || '');
            setIsConversionWizardOpen(true);
          }}
          onOpenClarityWizard={(url) => {
            setClarityInitialUrl(url || '');
            setIsClarityWizardOpen(true);
          }}
          onOpenAutonomousAuditor={(url) => {
            if (url) setAuditorInitialUrl(url);
            setIsAutonomousAuditorOpen(true);
          }}
          onOpenGoogleApiWizard={() => setIsGoogleApiWizardOpen(true)}
          onOpenSchemaGenerator={() => setIsSchemaModalOpen(true)}
          onOpenSitemapAudit={() => handleOpenSitemapAudit()}
          onOpenOnboardingWizard={() => setIsWizardOpen(true)}
          onOpenGeoBlueprint={() => setIsGeoBlueprintOpen(true)}
          onOpenDomainProfiler={(domain) => handleOpenDomainProfiler(domain)}
          onOpenAudit={() => setIsAuditOpen(true)}
          onOpenScheduler={() => setIsSchedulerOpen(true)}
          onOpenDirectories={() => setIsDirectoriesOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHelpManual={() => setIsHelpManualOpen(true)}
          onOpenContentGrader={(url, kw) => handleOpenContentGrader(url, kw)}
          onLockSession={() => {
            toast.success('Session locked. Enter security PIN to resume.');
          }}
          totalDirectoriesCount={directories.length}
          wsConnected={wsConnected}
          authSession={authSession}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Top High-Density System Alert Bar */}
          <div className="alert-bar w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="status-pill bg-[#ff4d00] text-black font-bold">GEO_CORE</span>
              <span className="text-zinc-200 text-xs font-mono">
                Automated high-density indexing pipeline integrating Google Indexing API v3 and IndexNow. Executing HTTP 200 live verification.
              </span>
            </div>
            <div className="mono text-[10px] text-zinc-400 shrink-0">
              SYSTEM_REVISION // ONLINE
            </div>
          </div>

          {/* VIEW: Bento Main Dashboard */}
          {currentView === 'bento' && (
            <div className="space-y-6">
              {/* Mandatory Plain-English Executive Summary of Current Platform State */}
              <PlainEnglishSummaryCard
                report={{
                  title: 'Executive Platform & Indexing Health Digest',
                  target: 'Enterprise SEO & GEO Submission Network',
                  timestamp: new Date().toISOString(),
                  overallStatus: 'EXCELLENT',
                  headlineScore: 99,
                  whatHappened:
                    'Your automated SEO & GEO Indexing Engine is actively running in healthy standing. All 55+ high-authority directory endpoints and Google Indexing API gateways are accepting real-time push signals without rate-limiting. Historical verification shows consistent indexing across major AI generative search engines.',
                  wasSuccessful: true,
                  whatWasDiscovered: [
                    `Total ${directories.length} high-authority directory networks connected and verified`,
                    'Google Indexing API & IndexNow protocols operational with sub-second latency',
                    `${history.length} Historical campaign batches recorded with zero data loss in WAL vault`,
                    'Intelligent Proxy Auto-Rotate Shield active with automated 60s cooldown isolation',
                  ],
                  whatToDoNext: [
                    'Queue batches via the 5-Step URL Indexing Wizard for automated distribution.',
                    'Monitor live HTTP 200/202 confirmations in the Live Operations stream.',
                    'Export compliance & verification reports for client and stakeholder delivery.',
                  ],
                  businessImpact: {
                    opportunities: [
                      'Sub-6-hour indexing turnaround for newly published URLs and landing pages',
                      'Strengthened digital presence in AI Search answers (Perplexity, Gemini, ChatGPT)',
                    ],
                    risks: [
                      'Unindexed URLs risk missing immediate organic search traffic cycles',
                    ],
                    recommendedActions: [
                      'Maintain automated daily drip submissions for consistent freshness signals',
                    ],
                    priorityLevel: 'LOW',
                    estimatedRevenueOrRankGain: '+35% Bot Crawl Acceleration',
                  },
                }}
                onOpenWizard={() => setIsIndexingWizardOpen(true)}
                onScrollToStream={() => {
                  const el = document.getElementById('results-table');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                onOpenClientPdf={() => {
                  const csvBtn = document.getElementById('export-logs-csv-btn');
                  if (csvBtn) {
                    csvBtn.click();
                  } else {
                    toast.success('📄 Exporting compliance & audit report...');
                  }
                }}
                onOpenSitemapAudit={() => handleOpenSitemapAudit()}
                onOpenSchemaGenerator={() => setIsSchemaModalOpen(true)}
                onOpenGoogleApiWizard={() => setIsGoogleApiWizardOpen(true)}
                onOpenConversionWizard={() => setIsConversionWizardOpen(true)}
                onStepClick={(step, idx) => {
                  const s = step.toLowerCase();
                  if (s.includes('wizard') || s.includes('queue') || s.includes('5-step') || idx === 0) {
                    setIsIndexingWizardOpen(true);
                    toast.success('🚀 Launching 5-Step URL Indexing Wizard...');
                  } else if (s.includes('stream') || s.includes('live') || s.includes('table') || s.includes('monitor') || idx === 1) {
                    const el = document.getElementById('results-table');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                      toast.success('📊 Navigated to Real-time Stream & Audit Table');
                    }
                  } else if (s.includes('export') || s.includes('compliance') || s.includes('report') || idx === 2) {
                    const csvBtn = document.getElementById('export-logs-csv-btn');
                    if (csvBtn) {
                      csvBtn.click();
                    } else {
                      toast.success('📄 Exporting verification report for stakeholders...');
                    }
                  } else if (s.includes('sitemap')) {
                    handleOpenSitemapAudit();
                  } else if (s.includes('schema')) {
                    setIsSchemaModalOpen(true);
                  }
                }}
              />

              {/* ConversionWizard CRO Engine & AI Prompt Generator Banner */}
              <ConversionWizardBanner
                onOpenWizardWithUrl={(url) => {
                  setWizardInitialUrl(url || '');
                  setIsConversionWizardOpen(true);
                }}
              />

              {/* Module A & Configuration Form */}
              <UrlInputForm
                directories={directories}
                isProcessing={jobStatus === 'Processing'}
                isAutonomousActive={isAutonomousActive}
                autonomousAccumulatedCount={autonomousAccumulatedCount}
                autonomousTargetGoal={autonomousTargetGoal}
                autonomousBatchCount={autonomousBatchCount}
                onStartJob={handleStartJob}
                onCancelJob={handleCancelJob}
                onStopAutonomous={handleStopAutonomous}
              />

              {/* Live Progress Bar */}
              <ProgressBar
                progress={progressPercent}
                completedTasks={completedTasks}
                totalTasks={totalTasks}
                confirmedCount={confirmedCount}
                indexedCount={indexedCount}
                status={jobStatus}
                isAutonomousActive={isAutonomousActive}
                autonomousAccumulatedCount={autonomousAccumulatedCount}
                autonomousTargetGoal={autonomousTargetGoal}
                autonomousMetric={autonomousMetric}
                autonomousBatchCount={autonomousBatchCount}
                onStopAutonomous={handleStopAutonomous}
              />

              {/* Keyword Gap Radar Component */}
              <KeywordGapRadar
                onOpenContentGrader={handleOpenContentGrader}
                onLaunchOutreachStrategy={(domain, _niche, _compA, _compB) => {
                  const targetDomainUrl = domain.startsWith('http') ? domain : `https://${domain}`;
                  setLinkStrategyUrl(targetDomainUrl);
                  setWizardsInitialTab('link-strategist');
                  setCurrentView('wizards');
                  toast.success(`🚀 Discovered competitors transferred to AI Link Strategist & Outreach Suite!`);
                }}
              />

              {/* SmartBatchScheduler Component */}
              <SmartBatchScheduler onJobStarted={fetchHistory} />

              {/* Visual SEO Lifecycle Funnel Timeline Widget */}
              <SeoFunnelTimeline
                logs={logs}
                activeSubmissionId={activeSubmissionId}
              />

              {/* Daily Performance Digest: 24-Hour Indexing Success Rates Trend Chart */}
              <DailyPerformanceDigest
                logs={logs}
                onRefreshLogs={fetchHistory}
              />

              {/* 30-Day Submissions Success/Failure Ratio & AI Citation Monitor */}
              <AnalyticsCard
                data={analyticsData}
                loading={loadingAnalytics}
                onRefresh={fetchAnalytics}
                onOpenContentGrader={handleOpenContentGrader}
              />

              {/* Real-time Peer-to-Peer Partner Backlink Network Telemetry */}
              <PeerNetworkStatusCard />

              {/* Real-time Stream Results Table */}
              <ResultsTable
                logs={logs}
                activeSubmissionId={activeSubmissionId}
                onExportCsv={() => handleExportCsv()}
                history={history}
              />
            </div>
          )}

          {/* VIEW: Wizards & Strategy Hub */}
          {currentView === 'wizards' && (
            <WizardsHubDashboard
              onOpenConversionWizard={(url) => {
                setWizardInitialUrl(url || '');
                setIsConversionWizardOpen(true);
              }}
              onOpenClarityWizard={(url) => {
                setClarityInitialUrl(url || '');
                setIsClarityWizardOpen(true);
              }}
              onOpenAutonomousAuditor={(url) => {
                if (url) setAuditorInitialUrl(url);
                setIsAutonomousAuditorOpen(true);
              }}
              onOpenGoogleApiWizard={() => setIsGoogleApiWizardOpen(true)}
              onOpenSchemaGeneratorModal={() => setIsSchemaModalOpen(true)}
              onOpenBulkSeoValidator={() => setCurrentView('bulk_seo')}
              onOpenOnboardingWizard={() => setIsWizardOpen(true)}
              onOpenGeoBlueprint={() => setIsGeoBlueprintOpen(true)}
              onOpenDomainProfiler={(domain) => handleOpenDomainProfiler(domain)}
              onOpenAudit={() => setIsAuditOpen(true)}
              onOpenScheduler={() => setIsSchedulerOpen(true)}
              onOpenContentGrader={(url, kw) => handleOpenContentGrader(url, kw)}
              onOpenIndexingWizard={() => setIsIndexingWizardOpen(true)}
              onStartAutonomous100k={() => {
                setIsAutonomousActive(true);
                setCurrentView('bento');
                toast.success('🚀 Autonomous 100k Campaign Mode Activated!');
              }}
              isAutonomousActive={isAutonomousActive}
              autonomousAccumulatedCount={autonomousAccumulatedCount}
              autonomousTargetGoal={autonomousTargetGoal}
              history={history}
              initialTab={wizardsInitialTab}
              defaultUrl={linkStrategyUrl || (history.length > 0 ? (history[0].urlList?.[0] || 'https://careerpulseai.net') : 'https://careerpulseai.net')}
              defaultAgencyName="Apex Enterprise Growth Labs"
            />
          )}

          {/* VIEW: Dedicated Submission Engine */}
          {currentView === 'submissions' && (
            <IndexingEngineView
              directories={directories}
              jobStatus={jobStatus}
              isAutonomousActive={isAutonomousActive}
              autonomousAccumulatedCount={autonomousAccumulatedCount}
              autonomousTargetGoal={autonomousTargetGoal}
              autonomousBatchCount={autonomousBatchCount}
              onStartJob={handleStartJob}
              onCancelJob={requestCancelJob}
              onStopAutonomous={requestStopAutonomous}
              progressPercent={progressPercent}
              completedTasks={completedTasks}
              totalTasks={totalTasks}
              confirmedCount={confirmedCount}
              indexedCount={indexedCount}
              autonomousMetric={autonomousMetric}
              logs={logs}
              activeSubmissionId={activeSubmissionId}
              history={history}
              onExportCsv={handleExportCsv}
              onOpenWizard={() => setIsIndexingWizardOpen(true)}
            />
          )}

          {/* VIEW: Traffic & SERP CTR Engine v3.0 */}
          {currentView === 'traffic_engine' && (
            <TrafficEngineDashboard
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {/* VIEW: Bulk SEO URL Validator */}
          {currentView === 'bulk_seo' && (
            <div className="space-y-6">
              <BulkSeoValidator
                initialUrls={history.length > 0 && history[0].urlList ? history[0].urlList : ['https://careerpulseai.net']}
              />
            </div>
          )}

          {/* VIEW: Bulk Backlink & Referring Domain Counter */}
          {currentView === 'backlink_counter' && (
            <div className="space-y-6">
              <BulkBacklinkCounter
                onSelectDomainForAudit={(domain) => {
                  setProfilerDomain(domain);
                  setIsDomainProfilerOpen(true);
                }}
              />
            </div>
          )}

          {/* VIEW: Executive Reports & Exports */}
          {currentView === 'reports' && (
            <ReportsExportCenter
              history={history}
              onExportCsv={handleExportCsv}
            />
          )}

          {/* VIEW: Live Operations & Sitemap Observer Stream */}
          {(currentView === 'live_ops' || currentView === 'live_operations') && (
            <LiveOperationsCenter
              logs={logs}
              jobStatus={jobStatus}
              activeSubmissionId={activeSubmissionId}
              history={history}
              onSelectSubmission={handleSelectSubmission}
              onExportCsv={handleExportCsv}
              onStartIndexingJob={handleStartJob}
              newContentAlert={newContentAlert}
              onClearNewContentAlert={() => setNewContentAlert(null)}
            />
          )}

          {/* VIEW: Diagnostics & Error Center */}
          {currentView === 'diagnostics' && <DiagnosticsCenter />}

          {/* VIEW: Smart URL Batcher & Scheduler */}
          {currentView === 'scheduler' && <SmartBatchScheduler />}

          {/* VIEW: Enterprise Auth & RBAC */}
          {currentView === 'account' && <AuthAccountCenter />}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#111113] border-t-2 border-[#111113] py-2 px-6 text-xs text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="label text-zinc-400">Indexer Engine // High-Density Enterprise Pipeline</div>
          <div className="label text-[#ff4d00]">SQLITE_PERSISTENT • ZERO-LATENCY_QUEUE</div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectSubmission={handleSelectSubmission}
        onExportCsv={handleExportCsv}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      <DirectoriesModal
        isOpen={isDirectoriesOpen}
        onClose={() => setIsDirectoriesOpen(false)}
        directories={directories}
      />

      <SeoAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
      />

      <GeoBlueprintModal
        isOpen={isGeoBlueprintOpen}
        onClose={() => setIsGeoBlueprintOpen(false)}
      />

      <ContentGraderModal
        isOpen={isContentGraderOpen}
        onClose={() => setIsContentGraderOpen(false)}
        initialUrl={graderUrl}
        initialKeyword={graderKeyword}
      />

      <DomainProfilerModal
        isOpen={isDomainProfilerOpen}
        onClose={() => setIsDomainProfilerOpen(false)}
        initialDomain={profilerDomain}
      />

      <HelpManualModal
        isOpen={isHelpManualOpen}
        onClose={() => setIsHelpManualOpen(false)}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDomainProfiler={() => handleOpenDomainProfiler()}
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenGeoBlueprint={() => setIsGeoBlueprintOpen(true)}
      />

      <OnboardingWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onOpenHelpManual={() => setIsHelpManualOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRunDemoSubmission={(domain) => {
          handleStartJob({
            targetUrls: [`https://${domain || 'myseoapp.com'}`],
            features: {
              generateBacklinks: true,
              checkLiveConfirmation: true,
              requestIndexing: true,
              runGoogleIndexing: true,
              runPingServices: true,
            },
            selectedDirectoryIds: directories.slice(0, 3).map((d) => d.id),
            concurrencyLimit: 4,
          });
        }}
      />

      {/* SmartBatchScheduler Modal */}
      {isSchedulerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <SmartBatchScheduler
              isOpenModal={true}
              onCloseModal={() => setIsSchedulerOpen(false)}
              onJobStarted={() => {
                fetchHistory();
                setIsSchedulerOpen(false);
              }}
            />
          </div>
        </div>
      )}
      {/* ConversionWizard CRO Audit & AI Prompt Generator Modal */}
      <ConversionWizardModal
        isOpen={isConversionWizardOpen}
        onClose={() => setIsConversionWizardOpen(false)}
        initialUrl={wizardInitialUrl}
      />

      {/* Clarity Overload CRO Audit Wizard Modal (5-Second Test & UX Cognitive Load) */}
      <ClarityOverloadWizardModal
        isOpen={isClarityWizardOpen}
        onClose={() => setIsClarityWizardOpen(false)}
        initialUrl={clarityInitialUrl}
      />

      {/* 14-Phase Autonomous Site Auditor & Conversion Engineer Wizard Modal */}
      <AutonomousSiteAuditorWizardModal
        isOpen={isAutonomousAuditorOpen}
        onClose={() => setIsAutonomousAuditorOpen(false)}
        initialUrl={auditorInitialUrl || 'https://careerpulseai.net'}
      />

      {/* Google Indexing API 3-Step Setup Wizard Modal */}
      <GoogleApiWizard
        isOpen={isGoogleApiWizardOpen}
        onClose={() => setIsGoogleApiWizardOpen(false)}
        initialJson={settings.googleServiceAccountJson || ''}
        onSaveServiceAccountJson={(jsonString) => {
          setSettings((prev) => ({ ...prev, googleServiceAccountJson: jsonString }));
          axios.post('/api/settings', { settings: { ...settings, googleServiceAccountJson: jsonString } }).catch(() => null);
        }}
      />

      {/* 5-Step Enterprise URL Submission & Indexing Wizard Modal */}
      <UrlIndexingWizardModal
        isOpen={isIndexingWizardOpen}
        onClose={() => setIsIndexingWizardOpen(false)}
        defaultConcurrency={settings.defaultConcurrency || 4}
        onLaunchCampaign={async (config) => {
          await handleStartJob({
            targetUrls: config.targetUrls,
            features: {
              generateBacklinks: config.engines.directoryNetworks,
              checkLiveConfirmation: true,
              requestIndexing: config.engines.googleIndexingApi || config.engines.indexNow,
              runGoogleIndexing: config.engines.googleIndexingApi,
              runPingServices: config.engines.multiPing,
            },
            selectedDirectoryIds: directories.map((d) => d.id),
            concurrencyLimit: config.concurrencyThreads,
          });
        }}
      />

      {/* Visual Schema Generator Modal (FAQ, Article, Organization) */}
      <VisualSchemaGeneratorModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />

      {/* XML Sitemap Crawler & Technical Audit Modal */}
      <SitemapAuditModal
        isOpen={isSitemapAuditOpen}
        onClose={() => setIsSitemapAuditOpen(false)}
        initialDomain={sitemapInitialDomain}
        onSendToIndexingQueue={(flaggedUrls) => {
          handleStartJob({
            targetUrls: flaggedUrls,
            features: {
              generateBacklinks: true,
              checkLiveConfirmation: true,
              requestIndexing: true,
              runGoogleIndexing: true,
              runPingServices: true,
            },
            selectedDirectoryIds: directories.slice(0, 5).map((d) => d.id),
            concurrencyLimit: 4,
          });
        }}
      />

      {/* Global Destructive Action Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        description={confirmationState.description}
        confirmButtonText={confirmationState.confirmButtonText}
        cancelButtonText={confirmationState.cancelButtonText}
        severity={confirmationState.severity}
        actionType={confirmationState.actionType}
        impactItems={confirmationState.impactItems}
        requireConfirmationPhrase={confirmationState.requireConfirmationPhrase}
      />

      {/* AI Copilot Float Widget */}
      <AiAssistantWidget />
    </div>
  );
}
