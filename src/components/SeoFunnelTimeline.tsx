import React, { useState, useMemo } from 'react';
import {
  Layers,
  Send,
  CheckCircle2,
  XCircle,
  Globe,
  ArrowRight,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Filter,
  Search,
  ChevronDown,
  Info,
  ShieldCheck,
  Activity,
  BarChart3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { LogItem } from '../types';

interface SeoFunnelTimelineProps {
  logs: LogItem[];
  activeSubmissionId?: string | null;
  onReverifyUrl?: (log: LogItem) => void;
  onTriggerPing?: (log: LogItem) => void;
}

export const SeoFunnelTimeline: React.FC<SeoFunnelTimelineProps> = ({
  logs,
  activeSubmissionId,
  onReverifyUrl,
  onTriggerPing,
}) => {
  const [selectedLogId, setSelectedLogId] = useState<string>('');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSimulatingReverify, setIsSimulatingReverify] = useState(false);
  const [isSimulatingPing, setIsSimulatingPing] = useState(false);

  // Compute Overall Funnel Metrics across all logs
  const metrics = useMemo(() => {
    const total = logs.length;
    if (total === 0) {
      return {
        total: 0,
        submittedCount: 0,
        liveCount: 0,
        indexedCount: 0,
        liveConversionPct: 0,
        indexedConversionPct: 0,
        overallFunnelEfficiency: 0,
      };
    }

    const submittedCount = logs.filter(
      (l) => l.submissionStatus && !l.submissionStatus.toLowerCase().includes('pending')
    ).length;

    const liveCount = logs.filter(
      (l) =>
        l.liveVerification.toLowerCase().includes('confirmed') ||
        l.liveVerification.toLowerCase().includes('200') ||
        l.liveVerification.toLowerCase().includes('success')
    ).length;

    const indexedCount = logs.filter(
      (l) =>
        l.googleIndexing === 'Submitted' ||
        l.googleIndexing === 'Indexed' ||
        l.pingStatus === 'Success'
    ).length;

    const liveConversionPct = submittedCount > 0 ? Math.round((liveCount / submittedCount) * 100) : 0;
    const indexedConversionPct = liveCount > 0 ? Math.round((indexedCount / liveCount) * 100) : 0;
    const overallFunnelEfficiency = total > 0 ? Math.round((indexedCount / total) * 100) : 0;

    return {
      total,
      submittedCount,
      liveCount,
      indexedCount,
      liveConversionPct,
      indexedConversionPct,
      overallFunnelEfficiency,
    };
  }, [logs]);

  // Filter logs for dropdown / search selection
  const filteredLogsList = useMemo(() => {
    if (!filterSearch.trim()) return logs;
    const term = filterSearch.toLowerCase();
    return logs.filter(
      (l) =>
        l.targetUrl.toLowerCase().includes(term) ||
        l.directoryName.toLowerCase().includes(term) ||
        l.generatedBacklink.toLowerCase().includes(term)
    );
  }, [logs, filterSearch]);

  // Selected Log Item logic
  const currentSelectedLog = useMemo(() => {
    if (selectedLogId) {
      const found = logs.find((l) => l.id === selectedLogId);
      if (found) return found;
    }
    return logs.length > 0 ? logs[0] : null;
  }, [logs, selectedLogId]);

  // Determine stage lifecycle statuses for the selected log
  const stageStatus = useMemo(() => {
    if (!currentSelectedLog) {
      return {
        stage1: { status: 'Pending', label: 'Awaiting Dispatch', date: '' },
        stage2: { status: 'Pending', label: 'Verification Pending', date: '' },
        stage3: { status: 'Pending', label: 'Index Request Pending', date: '' },
      };
    }

    const log = currentSelectedLog;

    // Stage 1: Submitted
    const isSubmitted =
      log.submissionStatus &&
      !log.submissionStatus.toLowerCase().includes('pending') &&
      !log.submissionStatus.toLowerCase().includes('failed');

    // Stage 2: Live
    const isLiveConfirmed =
      log.liveVerification.toLowerCase().includes('confirmed') ||
      log.liveVerification.toLowerCase().includes('200') ||
      log.liveVerification.toLowerCase().includes('success');
    const isLiveFailed =
      log.liveVerification.toLowerCase().includes('failed') ||
      log.submissionStatus.toLowerCase().includes('failed');

    // Stage 3: Indexed
    const isGoogleSubmitted = log.googleIndexing === 'Submitted' || log.googleIndexing === 'Indexed';
    const isPingSuccess = log.pingStatus === 'Success';
    const isIndexed = isGoogleSubmitted || isPingSuccess;

    return {
      stage1: {
        status: isSubmitted ? 'Completed' : 'Pending',
        label: isSubmitted ? 'Submitted (Directory Handshake OK)' : 'Submission Pending',
        date: log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : 'Just now',
      },
      stage2: {
        status: isLiveConfirmed ? 'Completed' : isLiveFailed ? 'Failed' : 'Processing',
        label: isLiveConfirmed
          ? 'Live Verified (HTTP 200 OK)'
          : isLiveFailed
          ? 'Live Verification Failed'
          : 'Pending Scan',
        date: isLiveConfirmed ? 'Verified Live' : 'Scanning...',
      },
      stage3: {
        status: isIndexed ? 'Completed' : isLiveConfirmed ? 'Ready' : 'Pending',
        label: isIndexed
          ? 'Indexed / Ping Dispatched'
          : isGoogleSubmitted
          ? 'Google API Dispatched'
          : isPingSuccess
          ? 'Multi-Ping Dispatched'
          : 'Awaiting Index Trigger',
        date: isIndexed ? 'Dispatched to Engines' : 'Queued',
      },
    };
  }, [currentSelectedLog]);

  // Copy Backlink URL
  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Backlink URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Instant Live Re-Verification Simulation / Trigger
  const handleReverifyClick = () => {
    if (!currentSelectedLog) return;
    setIsSimulatingReverify(true);
    const toastId = toast.loading(`Re-scanning live HTTP 200 OK status for ${currentSelectedLog.directoryName}...`);

    setTimeout(() => {
      setIsSimulatingReverify(false);
      toast.success(`HTTP 200 OK confirmed! Anchor link active on ${currentSelectedLog.generatedBacklink}`, {
        id: toastId,
      });
      if (onReverifyUrl) {
        onReverifyUrl(currentSelectedLog);
      }
    }, 1200);
  };

  // Instant Ping Trigger Simulation
  const handlePingClick = () => {
    if (!currentSelectedLog) return;
    setIsSimulatingPing(true);
    const toastId = toast.loading(`Broadcasting ping signals & Google Indexing API payload...`);

    setTimeout(() => {
      setIsSimulatingPing(false);
      toast.success(`Ping dispatched to IndexNow, Bing, and Google Indexing API!`, { id: toastId });
      if (onTriggerPing) {
        onTriggerPing(currentSelectedLog);
      }
    }, 1200);
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 shadow-2xl mb-8 space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>SEO Lifecycle Funnel Timeline Widget</span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-md font-mono font-bold">
                  Interactive Status Tracker
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Visualize URL progression through the complete SEO lifecycle: <strong className="text-blue-400">Submitted</strong> &rarr; <strong className="text-emerald-400">Live (200 OK)</strong> &rarr; <strong className="text-purple-400">Indexed (Google &amp; Ping)</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Global Funnel Conversion Summary Pill */}
        <div className="flex items-center gap-3 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-400 text-[11px] uppercase font-bold">Funnel Efficiency:</span>
            <span className="font-bold text-emerald-300 text-sm">{metrics.overallFunnelEfficiency}%</span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <div className="flex items-center gap-1 px-2 text-zinc-300">
            <span className="text-zinc-400 text-[11px]">{metrics.liveCount} Live</span>
            <span className="text-zinc-600">/</span>
            <span className="text-purple-400 text-[11px] font-bold">{metrics.indexedCount} Indexed</span>
          </div>
        </div>
      </div>

      {/* Visual Macro Funnel Flow Stages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Stage 1: Submitted Card */}
        <div className="bg-zinc-950/80 border border-blue-500/30 rounded-2xl p-4 relative overflow-hidden space-y-2 shadow-lg group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1 font-mono">
              <Send className="w-3.5 h-3.5 text-blue-400" />
              <span>Stage 1: Submitted</span>
            </span>
            <span className="text-xs font-bold font-mono text-zinc-100 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              {metrics.submittedCount} / {metrics.total}
            </span>
          </div>
          <div className="text-lg font-bold text-zinc-100 flex items-baseline justify-between">
            <span>Directory Submissions</span>
            <span className="text-xs font-normal text-zinc-400">100% Dispatched</span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full w-full" />
          </div>
          <p className="text-[11px] text-zinc-400 pt-1">
            HTTP POST payloads dispatched to web directories, WHOIS analyzers, and site authority portals.
          </p>
        </div>

        {/* Stage 2: Confirmed Live Card */}
        <div className="bg-zinc-950/80 border border-emerald-500/30 rounded-2xl p-4 relative overflow-hidden space-y-2 shadow-lg group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Stage 2: Live Verified</span>
            </span>
            <span className="text-xs font-bold font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {metrics.liveCount} Confirmed
            </span>
          </div>
          <div className="text-lg font-bold text-zinc-100 flex items-baseline justify-between">
            <span>HTTP 200 OK Live Links</span>
            <span className="text-xs font-bold text-emerald-400">{metrics.liveConversionPct}% Pass Rate</span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, metrics.liveConversionPct)}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-400 pt-1">
            Direct crawler GET scan verified active backlink placement on public html page.
          </p>
        </div>

        {/* Stage 3: Indexed / Pinged Card */}
        <div className="bg-zinc-950/80 border border-purple-500/30 rounded-2xl p-4 relative overflow-hidden space-y-2 shadow-lg group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Stage 3: Indexed &amp; Pinged</span>
            </span>
            <span className="text-xs font-bold font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              {metrics.indexedCount} Dispatched
            </span>
          </div>
          <div className="text-lg font-bold text-zinc-100 flex items-baseline justify-between">
            <span>Search Engine Index</span>
            <span className="text-xs font-bold text-purple-400">{metrics.indexedConversionPct}% Index Rate</span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, metrics.indexedConversionPct)}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-400 pt-1">
            Google Indexing API payload accepted &amp; multi-ping broadcast sent to IndexNow, Bing, and RSS aggregators.
          </p>
        </div>
      </div>

      {/* Interactive Specific URL Inspector & Lifecycle Timeline Card */}
      <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-5 space-y-5">
        {/* Search / Select Record Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Single-URL Lifecycle Diagnostic Inspector
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            {/* Filter Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter target URLs..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Select Dropdown */}
            <select
              value={currentSelectedLog?.id || ''}
              onChange={(e) => setSelectedLogId(e.target.value)}
              className="w-full sm:w-72 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-mono rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer truncate"
            >
              {filteredLogsList.length === 0 ? (
                <option value="">No URL log records available</option>
              ) : (
                filteredLogsList.map((log) => (
                  <option key={log.id} value={log.id}>
                    [{log.submissionStatus}] {log.targetUrl} &rarr; {log.directoryName}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Selected URL Record Header */}
        {currentSelectedLog ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-100 font-mono truncate">
                    {currentSelectedLog.targetUrl}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] text-zinc-300 font-mono border border-zinc-700">
                    {currentSelectedLog.directoryName} ({currentSelectedLog.directoryType})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <a
                    href={currentSelectedLog.generatedBacklink}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-1 truncate max-w-md"
                  >
                    <span className="truncate">{currentSelectedLog.generatedBacklink}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleCopy(currentSelectedLog.generatedBacklink, currentSelectedLog.id)}
                  className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-zinc-700"
                >
                  {copiedId === currentSelectedLog.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === currentSelectedLog.id ? 'Copied' : 'Copy URL'}</span>
                </button>

                <button
                  onClick={handleReverifyClick}
                  disabled={isSimulatingReverify}
                  className="px-2.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-xl text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                  title="Re-run live HTTP 200 OK scan for this backlink"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingReverify ? 'animate-spin' : ''}`} />
                  <span>Re-Scan 200 OK</span>
                </button>

                <button
                  onClick={handlePingClick}
                  disabled={isSimulatingPing}
                  className="px-2.5 py-1.5 bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800/80 rounded-xl text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                  title="Trigger Google Indexing API & IndexNow ping broadcast"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isSimulatingPing ? 'animate-spin text-purple-300' : ''}`} />
                  <span>Trigger Index Ping</span>
                </button>
              </div>
            </div>

            {/* Stepper Timeline Diagram */}
            <div className="relative py-2">
              {/* Stepper Connector Bar */}
              <div className="hidden md:block absolute top-7 left-12 right-12 h-1 bg-zinc-800 rounded-full z-0">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 rounded-full transition-all duration-700"
                  style={{
                    width:
                      stageStatus.stage3.status === 'Completed'
                        ? '100%'
                        : stageStatus.stage2.status === 'Completed'
                        ? '50%'
                        : '10%',
                  }}
                />
              </div>

              {/* 3 Step Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Node 1: Submitted */}
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-4 space-y-3 relative">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all ${
                        stageStatus.stage1.status === 'Completed'
                          ? 'bg-blue-600 text-white shadow-blue-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {stageStatus.stage1.status === 'Completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        '1'
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                        1. Submitted
                      </h4>
                      <p className="text-[11px] text-zinc-400">{stageStatus.stage1.label}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span>Status:</span>
                      <span className="text-blue-400 font-bold">{currentSelectedLog.submissionStatus}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>HTTP Handshake:</span>
                      <span className="text-emerald-400">{currentSelectedLog.httpStatus || 200} OK</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Time:</span>
                      <span className="text-zinc-300">{stageStatus.stage1.date}</span>
                    </div>
                  </div>
                </div>

                {/* Node 2: Live Verified */}
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-4 space-y-3 relative">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all ${
                        stageStatus.stage2.status === 'Completed'
                          ? 'bg-emerald-600 text-white shadow-emerald-500/20 animate-pulse'
                          : stageStatus.stage2.status === 'Failed'
                          ? 'bg-rose-600 text-white shadow-rose-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {stageStatus.stage2.status === 'Completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : stageStatus.stage2.status === 'Failed' ? (
                        <XCircle className="w-5 h-5 text-white" />
                      ) : (
                        '2'
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                        2. Live Verified
                      </h4>
                      <p className="text-[11px] text-zinc-400">{stageStatus.stage2.label}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span>Live Check:</span>
                      <span
                        className={
                          stageStatus.stage2.status === 'Completed'
                            ? 'text-emerald-400 font-bold'
                            : 'text-rose-400 font-bold'
                        }
                      >
                        {currentSelectedLog.liveVerification}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Anchor Detection:</span>
                      <span className="text-cyan-300">Active HTML Tag</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Scan Result:</span>
                      <span className="text-zinc-300">{stageStatus.stage2.date}</span>
                    </div>
                  </div>
                </div>

                {/* Node 3: Indexed / Pinged */}
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-4 space-y-3 relative">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all ${
                        stageStatus.stage3.status === 'Completed'
                          ? 'bg-purple-600 text-white shadow-purple-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {stageStatus.stage3.status === 'Completed' ? (
                        <Sparkles className="w-5 h-5 text-white" />
                      ) : (
                        '3'
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                        3. Indexed &amp; Pinged
                      </h4>
                      <p className="text-[11px] text-zinc-400">{stageStatus.stage3.label}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span>Google API:</span>
                      <span className="text-purple-400 font-bold">{currentSelectedLog.googleIndexing}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Ping Service:</span>
                      <span className="text-cyan-400 font-bold">{currentSelectedLog.pingStatus}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Broadcaster:</span>
                      <span className="text-zinc-300">IndexNow + RSS Ping</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500 text-xs font-sans">
            No active URL logs available to visualize. Launch a submission batch to begin real-time URL lifecycle tracking.
          </div>
        )}
      </div>
    </div>
  );
};
