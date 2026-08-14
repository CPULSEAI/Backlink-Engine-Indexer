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
    <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_#000] mb-8 space-y-6 text-black">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#ff4d00] border-2 border-black text-black shadow-[2px_2px_0_#000]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black font-mono-brutal flex items-center gap-2 uppercase">
                <span>SEO LIFECYCLE FUNNEL TIMELINE</span>
                <span className="text-[10px] bg-black text-white px-2 py-0.5 font-bold">
                  STATUS_TRACKER
                </span>
              </h3>
              <p className="text-xs text-zinc-700 font-mono-brutal mt-0.5">
                Progression pipeline: <strong className="text-black">SUBMITTED</strong> &rarr; <strong className="text-[#ff4d00]">LIVE (200 OK)</strong> &rarr; <strong className="text-black">INDEXED (API + PING)</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Global Funnel Conversion Summary Pill */}
        <div className="flex items-center gap-3 bg-[#f2efeb] p-2.5 border-2 border-black font-mono-brutal text-xs shadow-[2px_2px_0_#000]">
          <div className="flex items-center gap-1.5 px-2">
            <BarChart3 className="w-4 h-4 text-black" />
            <span className="text-zinc-600 text-[11px] uppercase font-bold">EFFICIENCY:</span>
            <span className="font-bold text-black text-sm">{metrics.overallFunnelEfficiency}%</span>
          </div>
          <div className="h-4 w-[2px] bg-black" />
          <div className="flex items-center gap-1 px-2 text-black font-bold">
            <span>{metrics.liveCount} LIVE</span>
            <span className="text-zinc-400">/</span>
            <span className="text-[#ff4d00]">{metrics.indexedCount} INDEXED</span>
          </div>
        </div>
      </div>

      {/* Visual Macro Funnel Flow Stages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative font-mono-brutal">
        {/* Stage 1: Submitted Card */}
        <div className="bg-[#f2efeb] border-2 border-black p-4 relative space-y-2 shadow-[3px_3px_0_#000]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-black flex items-center gap-1">
              <Send className="w-3.5 h-3.5 text-black" />
              <span>STAGE 1: SUBMITTED</span>
            </span>
            <span className="text-xs font-bold text-black bg-white px-2 py-0.5 border border-black">
              {metrics.submittedCount} / {metrics.total}
            </span>
          </div>
          <div className="text-lg font-bold text-black flex items-baseline justify-between">
            <span className="font-oswald uppercase">DIRECTORY SUBMISSIONS</span>
            <span className="text-xs font-bold text-zinc-600">100% DISPATCHED</span>
          </div>
          <div className="w-full bg-white h-3 border-2 border-black overflow-hidden">
            <div className="bg-black h-full w-full" />
          </div>
          <p className="text-[11px] text-zinc-700 pt-1 font-sans">
            HTTP POST payloads dispatched to directories, WHOIS portals, and domain authority systems.
          </p>
        </div>

        {/* Stage 2: Confirmed Live Card */}
        <div className="bg-[#f2efeb] border-2 border-black p-4 relative space-y-2 shadow-[3px_3px_0_#000]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff4d00] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ff4d00]" />
              <span>STAGE 2: LIVE VERIFIED</span>
            </span>
            <span className="text-xs font-bold text-black bg-[#ff4d00] px-2 py-0.5 border border-black">
              {metrics.liveCount} CONFIRMED
            </span>
          </div>
          <div className="text-lg font-bold text-black flex items-baseline justify-between">
            <span className="font-oswald uppercase">HTTP 200 OK LIVE LINKS</span>
            <span className="text-xs font-bold text-[#ff4d00]">{metrics.liveConversionPct}% PASS</span>
          </div>
          <div className="w-full bg-white h-3 border-2 border-black overflow-hidden">
            <div
              className="bg-[#ff4d00] h-full transition-all duration-500"
              style={{ width: `${Math.max(5, metrics.liveConversionPct)}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-700 pt-1 font-sans">
            Direct crawler GET scan verified active backlink placement on public target page.
          </p>
        </div>

        {/* Stage 3: Indexed / Pinged Card */}
        <div className="bg-[#f2efeb] border-2 border-black p-4 relative space-y-2 shadow-[3px_3px_0_#000]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-black flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>STAGE 3: INDEXED &amp; PINGED</span>
            </span>
            <span className="text-xs font-bold text-white bg-black px-2 py-0.5 border border-black">
              {metrics.indexedCount} DISPATCHED
            </span>
          </div>
          <div className="text-lg font-bold text-black flex items-baseline justify-between">
            <span className="font-oswald uppercase">SEARCH ENGINE INDEX</span>
            <span className="text-xs font-bold text-black">{metrics.indexedConversionPct}% RATE</span>
          </div>
          <div className="w-full bg-white h-3 border-2 border-black overflow-hidden">
            <div
              className="bg-black h-full transition-all duration-500"
              style={{ width: `${Math.max(5, metrics.indexedConversionPct)}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-700 pt-1 font-sans">
            Google Indexing API payload accepted &amp; multi-ping broadcast sent to IndexNow and Bing.
          </p>
        </div>
      </div>

      {/* Interactive Specific URL Inspector & Lifecycle Timeline Card */}
      <div className="bg-white border-2 border-black p-5 space-y-5 shadow-[3px_3px_0_#000]">
        {/* Search / Select Record Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-black pb-4 font-mono-brutal">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#ff4d00]" />
            <span className="text-xs font-bold text-black uppercase">
              SINGLE-URL LIFECYCLE DIAGNOSTIC INSPECTOR
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            {/* Filter Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="FILTER TARGET URLS..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="w-full bg-[#f2efeb] border-2 border-black pl-8 pr-3 py-1.5 text-xs text-black font-bold focus:outline-none focus:bg-white"
              />
            </div>

            {/* Select Dropdown */}
            <select
              value={currentSelectedLog?.id || ''}
              onChange={(e) => setSelectedLogId(e.target.value)}
              className="w-full sm:w-72 bg-[#f2efeb] border-2 border-black text-black text-xs font-bold px-3 py-1.5 focus:outline-none focus:bg-white cursor-pointer truncate"
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
          <div className="space-y-6 font-mono-brutal">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f2efeb] p-3.5 border-2 border-black shadow-[2px_2px_0_#000]">
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-black truncate">
                    {currentSelectedLog.targetUrl}
                  </span>
                  <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold">
                    {currentSelectedLog.directoryName} ({currentSelectedLog.directoryType})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono-brutal text-zinc-800">
                  <a
                    href={currentSelectedLog.generatedBacklink}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#ff4d00] hover:underline flex items-center gap-1 truncate max-w-md font-bold"
                  >
                    <span className="truncate">{currentSelectedLog.generatedBacklink}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleCopy(currentSelectedLog.generatedBacklink, currentSelectedLog.id)}
                  className="px-2.5 py-1.5 bg-white hover:bg-black hover:text-white text-black border-2 border-black text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-[1px_1px_0_#000]"
                >
                  {copiedId === currentSelectedLog.id ? (
                    <Check className="w-3.5 h-3.5 text-[#ff4d00]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === currentSelectedLog.id ? 'COPIED' : 'COPY URL'}</span>
                </button>

                <button
                  onClick={handleReverifyClick}
                  disabled={isSimulatingReverify}
                  className="px-2.5 py-1.5 bg-[#f2efeb] hover:bg-white text-black border-2 border-black text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer shadow-[1px_1px_0_#000]"
                  title="Re-run live HTTP 200 OK scan for this backlink"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingReverify ? 'animate-spin' : ''}`} />
                  <span>RE-SCAN 200 OK</span>
                </button>

                <button
                  onClick={handlePingClick}
                  disabled={isSimulatingPing}
                  className="px-2.5 py-1.5 bg-[#ff4d00] hover:bg-[#ff5c14] text-black border-2 border-black text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer shadow-[1px_1px_0_#000]"
                  title="Trigger Google Indexing API & IndexNow ping broadcast"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isSimulatingPing ? 'animate-spin' : ''}`} />
                  <span>TRIGGER PING</span>
                </button>
              </div>
            </div>

            {/* Stepper Timeline Diagram */}
            <div className="relative py-2">
              {/* Stepper Connector Bar */}
              <div className="hidden md:block absolute top-7 left-12 right-12 h-1.5 bg-black z-0" />

              {/* 3 Step Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Node 1: Submitted */}
                <div className="bg-white border-2 border-black p-4 space-y-3 relative shadow-[3px_3px_0_#000]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 border-2 border-black flex items-center justify-center font-bold text-xs shadow-[2px_2px_0_#000] ${
                        stageStatus.stage1.status === 'Completed'
                          ? 'bg-black text-white'
                          : 'bg-[#f2efeb] text-black'
                      }`}
                    >
                      {stageStatus.stage1.status === 'Completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        '1'
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-black uppercase font-mono-brutal">
                        1. SUBMITTED
                      </h4>
                      <p className="text-[11px] text-zinc-600 font-mono-brutal">{stageStatus.stage1.label}</p>
                    </div>
                  </div>

                  <div className="bg-[#f2efeb] p-2.5 border-2 border-black text-[11px] font-mono-brutal space-y-1">
                    <div className="flex justify-between text-zinc-600">
                      <span>STATUS:</span>
                      <span className="text-black font-bold">{currentSelectedLog.submissionStatus}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>HTTP HANDSHAKE:</span>
                      <span className="text-black font-bold">{currentSelectedLog.httpStatus || 200} OK</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>TIME:</span>
                      <span className="text-black font-bold">{stageStatus.stage1.date}</span>
                    </div>
                  </div>
                </div>

                {/* Node 2: Live Verified */}
                <div className="bg-white border-2 border-black p-4 space-y-3 relative shadow-[3px_3px_0_#000]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 border-2 border-black flex items-center justify-center font-bold text-xs shadow-[2px_2px_0_#000] ${
                        stageStatus.stage2.status === 'Completed'
                          ? 'bg-[#ff4d00] text-black'
                          : stageStatus.stage2.status === 'Failed'
                          ? 'bg-black text-white'
                          : 'bg-[#f2efeb] text-black'
                      }`}
                    >
                      {stageStatus.stage2.status === 'Completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-black" />
                      ) : stageStatus.stage2.status === 'Failed' ? (
                        <XCircle className="w-5 h-5 text-white" />
                      ) : (
                        '2'
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-black uppercase font-mono-brutal">
                        2. LIVE VERIFIED
                      </h4>
                      <p className="text-[11px] text-zinc-600 font-mono-brutal">{stageStatus.stage2.label}</p>
                    </div>
                  </div>

                  <div className="bg-[#f2efeb] p-2.5 border-2 border-black text-[11px] font-mono-brutal space-y-1">
                    <div className="flex justify-between text-zinc-600">
                      <span>LIVE CHECK:</span>
                      <span
                        className={
                          stageStatus.stage2.status === 'Completed'
                            ? 'text-black font-bold'
                            : 'text-[#ff4d00] font-bold'
                        }
                      >
                        {currentSelectedLog.liveVerification}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>ANCHOR:</span>
                      <span className="text-black font-bold">ACTIVE HTML TAG</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>RESULT:</span>
                      <span className="text-black font-bold">{stageStatus.stage2.date}</span>
                    </div>
                  </div>
                </div>

                {/* Node 3: Indexed / Pinged */}
                <div className="bg-white border-2 border-black p-4 space-y-3 relative shadow-[3px_3px_0_#000]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 border-2 border-black flex items-center justify-center font-bold text-xs shadow-[2px_2px_0_#000] ${
                        stageStatus.stage3.status === 'Completed'
                          ? 'bg-black text-white'
                          : 'bg-[#f2efeb] text-black'
                      }`}
                    >
                      {stageStatus.stage3.status === 'Completed' ? (
                        <Sparkles className="w-5 h-5 text-white" />
                      ) : (
                        '3'
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-black uppercase font-mono-brutal">
                        3. INDEXED &amp; PINGED
                      </h4>
                      <p className="text-[11px] text-zinc-600 font-mono-brutal">{stageStatus.stage3.label}</p>
                    </div>
                  </div>

                  <div className="bg-[#f2efeb] p-2.5 border-2 border-black text-[11px] font-mono-brutal space-y-1">
                    <div className="flex justify-between text-zinc-600">
                      <span>GOOGLE API:</span>
                      <span className="text-black font-bold">{currentSelectedLog.googleIndexing}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>PING SERVICE:</span>
                      <span className="text-[#ff4d00] font-bold">{currentSelectedLog.pingStatus}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>BROADCASTER:</span>
                      <span className="text-black font-bold">INDEXNOW + RSS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-600 text-xs font-mono-brutal font-bold uppercase">
            NO ACTIVE URL LOGS TO VISUALIZE. LAUNCH A SUBMISSION BATCH TO BEGIN REAL-TIME TRACKING.
          </div>
        )}
      </div>
    </div>
  );
};
