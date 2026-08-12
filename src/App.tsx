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
import { DirectoryEntry, LogItem, SubmissionRecord, SystemSettings, AnalyticsData, AutonomousConfig } from './types';

export default function App() {
  const [directories, setDirectories] = useState<DirectoryEntry[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [history, setHistory] = useState<SubmissionRecord[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

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
  const [autonomousTargetGoal, setAutonomousTargetGoal] = useState(100);
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
    target: 100,
    metric: 'tasks',
    batchCount: 1,
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
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [profilerDomain, setProfilerDomain] = useState('');
  const [graderUrl, setGraderUrl] = useState('');
  const [graderKeyword, setGraderKeyword] = useState('');

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

  // Fetch initial directories, history, settings, and analytics
  useEffect(() => {
    fetchDirectories();
    fetchHistory();
    fetchSettings();
    fetchAnalytics();
    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

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
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsConnected(true);
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
      setWsConnected(false);
      setTimeout(connectWebSocket, 3000);
    };

    wsRef.current = ws;
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

  const handleStopAutonomous = () => {
    setIsAutonomousActive(false);
    autonomousRef.current.active = false;
    handleCancelJob();
    toast.error('Autonomous continuous mode stopped.');
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

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col">
      {/* Toast Notification Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#09090b',
            color: '#f4f4f5',
            border: '1px solid #27272a',
            fontSize: '12px',
            fontFamily: 'monospace',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#09090b',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#09090b',
            },
          },
        }}
      />

      {/* Header Bar */}
      <Header
        wsConnected={wsConnected}
        activeJobId={activeSubmissionId}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDirectories={() => setIsDirectoriesOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenGeoBlueprint={() => setIsGeoBlueprintOpen(true)}
        onOpenDomainProfiler={() => handleOpenDomainProfiler()}
        onOpenHelpManual={() => setIsHelpManualOpen(true)}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenScheduler={() => setIsSchedulerOpen(true)}
        totalDirectoriesCount={directories.length}
      />

      {/* Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
        <KeywordGapRadar onOpenContentGrader={handleOpenContentGrader} />

        {/* SmartBatchScheduler Component */}
        <SmartBatchScheduler onJobStarted={fetchHistory} />

        {/* Visual SEO Lifecycle Funnel Timeline Widget */}
        <SeoFunnelTimeline
          logs={logs}
          activeSubmissionId={activeSubmissionId}
        />

        {/* 30-Day Submissions Success/Failure Ratio & AI Citation Monitor */}
        <AnalyticsCard
          data={analyticsData}
          loading={loadingAnalytics}
          onRefresh={fetchAnalytics}
          onOpenContentGrader={handleOpenContentGrader}
        />

        {/* Real-time Stream Results Table */}
        <ResultsTable
          logs={logs}
          activeSubmissionId={activeSubmissionId}
          onExportCsv={() => handleExportCsv()}
          history={history}
        />
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800/80 py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Backlink Engine &amp; SEO Indexer • Enterprise Multi-Site Submission Bento Dashboard</span>
          <span className="font-mono text-[11px] text-zinc-600">SQLite Persistent • Async Queue Engine</span>
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
    </div>
  );
}
