import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Zap,
  Filter,
  Download,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  Shield,
  Eye,
  Globe,
  Plus,
  RefreshCw,
  Trash2,
  ExternalLink,
  Sparkles,
  Send,
  Bell,
  Check,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LogItem, SubmissionHistoryItem, MonitoredSitemapTarget, DiscoveredSitemapUrl, NewContentDetectedEvent } from '../types';

interface LiveOperationsCenterProps {
  logs: LogItem[];
  jobStatus: string;
  activeSubmissionId: string | null;
  history: SubmissionHistoryItem[];
  onSelectSubmission?: (id: string) => void;
  onExportCsv: (submissionId?: string) => void;
  onStartIndexingJob?: (config: any) => Promise<void>;
  newContentAlert?: NewContentDetectedEvent | null;
  onClearNewContentAlert?: () => void;
}

export const LiveOperationsCenter: React.FC<LiveOperationsCenterProps> = ({
  logs,
  jobStatus,
  activeSubmissionId,
  history,
  onSelectSubmission,
  onExportCsv,
  onStartIndexingJob,
  newContentAlert,
  onClearNewContentAlert,
}) => {
  const [activeTab, setActiveTab] = useState<'STREAM' | 'SITEMAP_OBSERVER'>('STREAM');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CONFIRMED' | 'SUBMITTED' | 'SITEMAP' | 'FAILED'>('ALL');

  // Sitemap Observer State
  const [targets, setTargets] = useState<MonitoredSitemapTarget[]>([]);
  const [discoveredUrls, setDiscoveredUrls] = useState<DiscoveredSitemapUrl[]>([]);
  const [isLoadingTargets, setIsLoadingTargets] = useState(false);
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [isAutoIndexing, setIsAutoIndexing] = useState(false);
  const [scanningTargetId, setScanningTargetId] = useState<string | null>(null);

  // Add Target Form State
  const [newDomainInput, setNewDomainInput] = useState('');
  const [newIntervalInput, setNewIntervalInput] = useState('15');
  const [isAddingTarget, setIsAddingTarget] = useState(false);
  const [selectedTargetFilter, setSelectedTargetFilter] = useState<string>('ALL');

  // Load Monitored Targets
  const fetchSitemapObserverData = async () => {
    setIsLoadingTargets(true);
    try {
      const res = await axios.get('/api/sitemap-observer/targets');
      if (res.data.success) {
        setTargets(res.data.targets || []);
        setDiscoveredUrls(res.data.discoveredUrls || []);
      }
    } catch (err) {
      console.error('Failed to fetch sitemap targets:', err);
    } finally {
      setIsLoadingTargets(false);
    }
  };

  useEffect(() => {
    fetchSitemapObserverData();
    const interval = setInterval(fetchSitemapObserverData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handle Add New Monitored Target
  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput.trim()) {
      toast.error('Please enter a target domain or XML sitemap URL.');
      return;
    }

    setIsAddingTarget(true);
    try {
      const res = await axios.post('/api/sitemap-observer/targets', {
        domainOrUrl: newDomainInput.trim(),
        checkIntervalMinutes: parseInt(newIntervalInput, 10) || 15,
      });

      if (res.data.success) {
        toast.success(`Now monitoring XML sitemap for ${res.data.target.domain}!`);
        setNewDomainInput('');
        fetchSitemapObserverData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add sitemap target');
    } finally {
      setIsAddingTarget(false);
    }
  };

  // Handle Delete Target
  const handleDeleteTarget = async (id: string, domain: string) => {
    if (!confirm(`Are you sure you want to stop monitoring sitemap for ${domain}?`)) return;
    try {
      await axios.delete(`/api/sitemap-observer/targets/${id}`);
      toast.success(`Removed ${domain} from sitemap observer.`);
      fetchSitemapObserverData();
    } catch (err) {
      toast.error('Failed to delete monitored target');
    }
  };

  // Handle Toggle Active
  const handleToggleActive = async (target: MonitoredSitemapTarget) => {
    try {
      const newActive = target.is_active ? 0 : 1;
      await axios.put(`/api/sitemap-observer/targets/${target.id}`, {
        is_active: newActive === 1,
      });
      toast.success(`${target.domain} observer ${newActive === 1 ? 'activated' : 'paused'}.`);
      fetchSitemapObserverData();
    } catch (err) {
      toast.error('Failed to update target status');
    }
  };

  // Manual Check Now
  const handleCheckTargetNow = async (targetId?: string) => {
    if (targetId) {
      setScanningTargetId(targetId);
    } else {
      setIsScanningAll(true);
    }

    try {
      const res = await axios.post('/api/sitemap-observer/check-now', { targetId });
      if (res.data.success) {
        if (targetId) {
          const count = res.data.result?.newUrlsCount || 0;
          if (count > 0) {
            toast.success(`🚨 ${count} new URLs discovered!`);
          } else {
            toast.success('Sitemap check complete: No new URLs found.');
          }
        } else {
          const totalNew = res.data.result?.totalNewUrls || 0;
          toast.success(`Scan complete: ${totalNew} new URLs found across all monitored domains.`);
        }
        fetchSitemapObserverData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Sitemap audit failed');
    } finally {
      setScanningTargetId(null);
      setIsScanningAll(false);
    }
  };

  // Auto-Index Newly Discovered Content
  const handleAutoIndexNewUrls = async (targetId?: string) => {
    setIsAutoIndexing(true);
    toast.loading('Dispatching new sitemap URLs to Google & Directory indexing engine...', { id: 'sitemap-index' });
    try {
      const res = await axios.post('/api/sitemap-observer/auto-index-new', { targetId });
      if (res.data.success) {
        if (res.data.urlsIndexedCount > 0) {
          toast.success(
            `🚀 Queued ${res.data.urlsIndexedCount} new sitemap URLs for instant indexation!`,
            { id: 'sitemap-index' }
          );
        } else {
          toast.success('All current sitemap URLs are already indexed.', { id: 'sitemap-index' });
        }
        if (onClearNewContentAlert) onClearNewContentAlert();
        fetchSitemapObserverData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to auto-index new URLs', { id: 'sitemap-index' });
    } finally {
      setIsAutoIndexing(false);
    }
  };

  // Filter logs for stream
  const filteredLogs = logs.filter((log) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'CONFIRMED') return log.liveVerification?.includes('Confirmed');
    if (filterStatus === 'SUBMITTED') return log.googleIndexing === 'Submitted' || log.pingStatus === 'Success';
    if (filterStatus === 'SITEMAP') return log.directoryName === 'XML Sitemap Observer' || log.notes?.includes('sitemap');
    if (filterStatus === 'FAILED') return log.submissionStatus === 'Failed' || log.httpStatus >= 400;
    return true;
  });

  const confirmedCount = logs.filter((l) => l.liveVerification?.includes('Confirmed')).length;
  const submittedCount = logs.filter((l) => l.googleIndexing === 'Submitted' || logGoogleOrPing(l)).length;
  const sitemapEventCount = logs.filter((l) => l.directoryName === 'XML Sitemap Observer').length;
  const failedCount = logs.filter((l) => l.submissionStatus === 'Failed' || (l.httpStatus && l.httpStatus >= 400)).length;

  const totalPendingNewUrls = targets.reduce((sum, t) => sum + (t.new_urls_pending_count || 0), 0);
  const totalDiscoveredCount = discoveredUrls.length;

  function logGoogleOrPing(l: LogItem) {
    return l.googleIndexing === 'CRAWL_SIGNAL_PENDING' || l.pingStatus === 'Success';
  }

  return (
    <div className="space-y-6 font-mono-brutal">
      {/* 🚨 NEW CONTENT DETECTED ALERT BANNER */}
      {(newContentAlert || totalPendingNewUrls > 0) && (
        <div className="bg-amber-500/10 border-4 border-amber-500 p-5 rounded-2xl shadow-[6px_6px_0_#d97706] dark:shadow-[6px_6px_0_#92400e] animate-pulse-slow">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 text-black border-2 border-black rounded-xl flex items-center justify-center font-black shadow-[2px_2px_0_#000]">
                <Radio className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-amber-500 text-black font-black text-xs uppercase rounded">
                    NEW CONTENT DETECTED
                  </span>
                  <span className="text-xs text-amber-700 dark:text-amber-300 font-bold">
                    {newContentAlert
                      ? `${newContentAlert.newUrlsCount} new URLs discovered on ${newContentAlert.domain}`
                      : `${totalPendingNewUrls} un-indexed URLs detected across monitored sitemaps`}
                  </span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1 font-sans">
                  The background XML sitemap observer discovered new URLs. Push them directly to Google Indexing API and high-authority directory gateways.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('SITEMAP_OBSERVER');
                  handleAutoIndexNewUrls(newContentAlert?.targetId);
                }}
                disabled={isAutoIndexing}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded-lg border-2 border-black shadow-[3px_3px_0_#000] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isAutoIndexing ? 'Pushing to Index...' : '⚡ Auto-Index New Content'}</span>
              </button>
              {onClearNewContentAlert && (
                <button
                  onClick={onClearNewContentAlert}
                  className="px-3 py-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 text-black dark:text-zinc-200 font-bold text-xs uppercase rounded-lg border-2 border-black dark:border-zinc-700 shadow-[2px_2px_0_#000] cursor-pointer"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Header & Tab Navigation */}
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#222] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-black text-[#ff4d00] dark:bg-zinc-800 dark:text-cyan-400 border-2 border-black dark:border-zinc-600 rounded-xl flex items-center justify-center font-display font-black text-2xl shadow-[3px_3px_0_#000]">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black uppercase text-black dark:text-zinc-100">
                Live Operations &amp; Sitemap Observer
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  jobStatus === 'Processing'
                    ? 'bg-[#ff4d00] text-black border border-black animate-pulse'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {jobStatus === 'Processing' ? 'ENGINE STREAM ACTIVE' : 'OBSERVER RUNNING'}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-sans">
              Real-time WebSocket telemetry, background XML sitemap change detection, HTTP probes, and instant Google push indexation.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-xl border-2 border-black dark:border-zinc-700">
          <button
            onClick={() => setActiveTab('STREAM')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'STREAM'
                ? 'bg-black text-white dark:bg-zinc-950 dark:text-cyan-400 shadow-[2px_2px_0_#ff4d00]'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Event Stream ({logs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('SITEMAP_OBSERVER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 relative ${
              activeTab === 'SITEMAP_OBSERVER'
                ? 'bg-black text-white dark:bg-zinc-950 dark:text-cyan-400 shadow-[2px_2px_0_#ff4d00]'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Sitemap Observer ({targets.length})</span>
            {totalPendingNewUrls > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-4 rounded-xl shadow-[3px_3px_0_#000]">
          <div className="text-[10px] font-bold text-zinc-500 uppercase">Stream Events Processed</div>
          <div className="text-xl font-black text-black dark:text-zinc-100 mt-1">{logs.length}</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-4 rounded-xl shadow-[3px_3px_0_#000]">
          <div className="text-[10px] font-bold text-zinc-500 uppercase">Live Confirmed (HTTP 200)</div>
          <div className="text-xl font-black text-emerald-600 mt-1">{confirmedCount}</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-4 rounded-xl shadow-[3px_3px_0_#000]">
          <div className="text-[10px] font-bold text-zinc-500 uppercase">Monitored Sitemaps</div>
          <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{targets.length} Domains</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-4 rounded-xl shadow-[3px_3px_0_#000]">
          <div className="text-[10px] font-bold text-zinc-500 uppercase">Discovered Sitemap URLs</div>
          <div className="text-xl font-black text-[#ff4d00] mt-1">{totalDiscoveredCount} URLs</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: REAL-TIME STREAM FEED                                              */}
      {/* ========================================================================= */}
      {activeTab === 'STREAM' && (
        <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 rounded-2xl shadow-[4px_4px_0_#000] overflow-hidden">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-950 border-b-2 border-black dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-[#ff4d00]" />
              <span className="text-xs font-bold uppercase text-black dark:text-zinc-200">Filter Stream:</span>
              {(['ALL', 'CONFIRMED', 'SUBMITTED', 'SITEMAP', 'FAILED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer border ${
                    filterStatus === st
                      ? 'bg-black text-white dark:bg-zinc-800 dark:text-cyan-400 border-black'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-800'
                  }`}
                >
                  {st} {st === 'SITEMAP' && `(${sitemapEventCount})`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 font-bold">
                Showing {filteredLogs.length} of {logs.length} events
              </span>
              <button
                onClick={() => onExportCsv(activeSubmissionId || undefined)}
                className="px-2.5 py-1 bg-white dark:bg-zinc-800 hover:bg-zinc-100 text-black dark:text-zinc-200 border border-black dark:border-zinc-600 rounded text-xs font-bold uppercase shadow-[1px_1px_0_#000] flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Stream Table */}
          <div className="overflow-x-auto max-h-[500px]">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 font-mono-brutal space-y-2">
                <Terminal className="w-8 h-8 mx-auto text-zinc-400" />
                <div className="text-xs font-bold uppercase">No Live Stream Events Yet</div>
                <p className="text-[11px] font-sans text-zinc-400 max-w-sm mx-auto">
                  Launch a submission campaign or run a sitemap audit to watch real-time verification and discovery logs.
                </p>
              </div>
            ) : (
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-zinc-50 dark:bg-zinc-950 border-b-2 border-black dark:border-zinc-700 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 font-bold uppercase">Target URL</th>
                    <th className="p-3 font-bold uppercase">Directory / Observer</th>
                    <th className="p-3 font-bold uppercase">HTTP Status</th>
                    <th className="p-3 font-bold uppercase">Live Verification</th>
                    <th className="p-3 font-bold uppercase">Push Signal</th>
                    <th className="p-3 font-bold uppercase">Context / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredLogs.map((log, idx) => {
                    const isSitemapLog = log.directoryName === 'XML Sitemap Observer' || log.liveVerification?.includes('New Content');
                    return (
                      <tr
                        key={log.id || idx}
                        className={`hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition-colors ${
                          isSitemapLog ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''
                        }`}
                      >
                        <td className="p-3 font-bold text-black dark:text-zinc-200 max-w-[220px] truncate">
                          <div className="flex items-center gap-1.5">
                            {isSitemapLog && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Sitemap Discovery" />
                            )}
                            <span className="truncate">{log.targetUrl}</span>
                          </div>
                        </td>
                        <td className="p-3 text-zinc-700 dark:text-zinc-300">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                              isSitemapLog
                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
                            }`}
                          >
                            {log.directoryName}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.httpStatus === 200 || log.httpStatus === 202
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {log.httpStatus || 200} OK
                          </span>
                        </td>
                        <td className="p-3 font-bold">
                          {log.liveVerification?.includes('New Content') ? (
                            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>NEW CONTENT DETECTED</span>
                            </span>
                          ) : log.liveVerification?.includes('Confirmed') ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>CONFIRMED</span>
                            </span>
                          ) : (
                            <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>PROBING...</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 bg-black text-[#ff4d00] dark:bg-zinc-800 dark:text-cyan-400 rounded text-[10px] font-bold">
                            {log.googleIndexing || 'SYNCED'}
                          </span>
                        </td>
                        <td className="p-3 text-zinc-500 max-w-[200px] truncate">
                          {log.notes || log.generatedBacklink || 'Ready'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: XML SITEMAP BACKGROUND OBSERVER MANAGEMENT                         */}
      {/* ========================================================================= */}
      {activeTab === 'SITEMAP_OBSERVER' && (
        <div className="space-y-6">
          {/* Action Bar & Add Target Form */}
          <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[4px_4px_0_#000]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#ff4d00]" />
                  <span>Monitored Domain Targets &amp; XML Sitemaps</span>
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 font-sans">
                  The background observer automatically scans sitemap XML endpoints at your scheduled frequency and alerts in real-time when new URLs appear.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCheckTargetNow()}
                  disabled={isScanningAll}
                  className="px-3 py-1.5 bg-black dark:bg-zinc-800 hover:bg-zinc-800 text-white dark:text-cyan-400 border-2 border-black dark:border-zinc-600 rounded-lg text-xs font-bold uppercase shadow-[2px_2px_0_#000] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanningAll ? 'animate-spin' : ''}`} />
                  <span>{isScanningAll ? 'Scanning All...' : 'Scan All Sitemaps Now'}</span>
                </button>
                <button
                  onClick={() => handleAutoIndexNewUrls()}
                  disabled={isAutoIndexing}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-black rounded-lg text-xs font-bold uppercase shadow-[2px_2px_0_#000] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Auto-Index All Discovered</span>
                </button>
              </div>
            </div>

            {/* Quick Add Monitored Target Form */}
            <form onSubmit={handleAddTarget} className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex-1">
                <input
                  type="text"
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  placeholder="Enter domain or sitemap URL (e.g. careerpulseai.net or https://domain.com/sitemap.xml)"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 rounded-lg text-xs font-mono text-black dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#ff4d00]"
                />
              </div>

              <div className="w-full sm:w-44">
                <select
                  value={newIntervalInput}
                  onChange={(e) => setNewIntervalInput(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 rounded-lg text-xs font-mono text-black dark:text-zinc-100 focus:outline-none focus:border-[#ff4d00]"
                >
                  <option value="5">Every 5 Minutes</option>
                  <option value="15">Every 15 Minutes</option>
                  <option value="30">Every 30 Minutes</option>
                  <option value="60">Every 1 Hour</option>
                  <option value="360">Every 6 Hours</option>
                  <option value="1440">Daily (24 Hours)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isAddingTarget}
                className="px-4 py-2 bg-[#ff4d00] hover:bg-[#e04400] text-black font-extrabold text-xs uppercase border-2 border-black rounded-lg shadow-[2px_2px_0_#000] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingTarget ? 'Adding...' : 'Add Monitor'}</span>
              </button>
            </form>
          </div>

          {/* Monitored Target Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targets.map((target) => {
              const isCheckingThis = scanningTargetId === target.id;
              return (
                <div
                  key={target.id}
                  className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-4 rounded-xl shadow-[3px_3px_0_#000] flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-black dark:border-zinc-700 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-black dark:text-zinc-100">{target.domain}</div>
                          <div className="text-[10px] text-zinc-500 font-mono truncate max-w-[200px]">
                            {target.sitemap_url}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          target.is_active
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                            : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/30'
                        }`}
                      >
                        {target.is_active ? 'ACTIVE' : 'PAUSED'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-center">
                      <div className="bg-zinc-50 dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                        <div className="text-[9px] text-zinc-500 uppercase font-bold">Total URLs</div>
                        <div className="text-xs font-black text-black dark:text-zinc-200 mt-0.5">
                          {target.discovered_urls_count}
                        </div>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                        <div className="text-[9px] text-zinc-500 uppercase font-bold">Pending New</div>
                        <div className="text-xs font-black text-amber-500 mt-0.5">
                          {target.new_urls_pending_count}
                        </div>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                        <div className="text-[9px] text-zinc-500 uppercase font-bold">Frequency</div>
                        <div className="text-xs font-black text-zinc-700 dark:text-zinc-300 mt-0.5">
                          {target.check_interval_minutes}m
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] text-zinc-500 flex items-center justify-between">
                      <span>
                        Last Check:{' '}
                        {target.last_checked_at
                          ? new Date(target.last_checked_at).toLocaleTimeString()
                          : 'Pending initial scan'}
                      </span>
                      <span className="font-semibold text-zinc-600 dark:text-zinc-400">
                        {target.last_status || 'IDLE'}
                      </span>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCheckTargetNow(target.id)}
                        disabled={isCheckingThis}
                        className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-black dark:text-zinc-200 rounded text-[10px] font-bold uppercase border border-zinc-300 dark:border-zinc-700 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${isCheckingThis ? 'animate-spin' : ''}`} />
                        <span>{isCheckingThis ? 'Scanning...' : 'Scan Now'}</span>
                      </button>
                      <button
                        onClick={() => handleToggleActive(target)}
                        className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded text-[10px] font-bold uppercase border border-zinc-300 dark:border-zinc-700 cursor-pointer"
                      >
                        {target.is_active ? 'Pause' : 'Resume'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {target.new_urls_pending_count > 0 && (
                        <button
                          onClick={() => handleAutoIndexNewUrls(target.id)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Index ({target.new_urls_pending_count})</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTarget(target.id, target.domain)}
                        className="p-1 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete monitored domain"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Discovered URLs Table */}
          <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 rounded-2xl shadow-[4px_4px_0_#000] overflow-hidden">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-950 border-b-2 border-black dark:border-zinc-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-black dark:text-zinc-200">
                  Discovered Sitemap URL Log ({discoveredUrls.length})
                </span>
              </div>
              <div className="text-xs text-zinc-500 font-bold">
                {discoveredUrls.filter((d) => d.is_new === 1).length} pending indexation
              </div>
            </div>

            <div className="overflow-x-auto max-h-[400px]">
              {discoveredUrls.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 text-xs">
                  No URLs discovered yet. Add a monitored domain target and trigger a scan.
                </div>
              ) : (
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-zinc-50 dark:bg-zinc-950 border-b-2 border-black dark:border-zinc-700 sticky top-0">
                    <tr>
                      <th className="p-3 font-bold uppercase">Discovered URL</th>
                      <th className="p-3 font-bold uppercase">Domain Target</th>
                      <th className="p-3 font-bold uppercase">Discovery State</th>
                      <th className="p-3 font-bold uppercase">Discovered Timestamp</th>
                      <th className="p-3 font-bold uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {discoveredUrls.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40">
                        <td className="p-3 font-bold text-black dark:text-zinc-200 max-w-[280px] truncate">
                          <div className="flex items-center gap-1.5">
                            {item.is_new === 1 && (
                              <span className="px-1.5 py-0.2 bg-amber-500 text-black text-[9px] font-black rounded uppercase">
                                NEW
                              </span>
                            )}
                            <span className="truncate">{item.url}</span>
                          </div>
                        </td>
                        <td className="p-3 text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">
                          {item.domain}
                        </td>
                        <td className="p-3">
                          {item.is_new === 1 ? (
                            <span className="inline-flex items-center gap-1 text-amber-500 font-bold text-[10px]">
                              <Clock className="w-3 h-3" />
                              <span>PENDING CRAWL / INDEX</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-500 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>INDEXED / SUBMITTED</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-zinc-500 text-[11px]">
                          {new Date(item.discovered_at).toLocaleString()}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleAutoIndexNewUrls(item.target_id)}
                            className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Index Now
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
