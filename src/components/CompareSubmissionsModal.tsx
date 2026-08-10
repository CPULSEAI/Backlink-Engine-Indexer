import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeftRight,
  GitCompare,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  Search,
  Clock,
  Globe,
  ExternalLink,
  Layers,
  Sparkles,
  Download,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LogItem, SubmissionRecord } from '../types';

interface CompareSubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogs: LogItem[];
  currentSubmissionId: string | null;
  history: SubmissionRecord[];
}

export const CompareSubmissionsModal: React.FC<CompareSubmissionsModalProps> = ({
  isOpen,
  onClose,
  currentLogs,
  currentSubmissionId,
  history,
}) => {
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>('');
  const [historicalLogs, setHistoricalLogs] = useState<LogItem[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);
  const [diffFilter, setDiffFilter] = useState<'ALL' | 'DIFF_ONLY' | 'IMPROVED' | 'REGRESSED'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Available history options (excluding active submission if needed)
  const availableHistory = history.filter((h) => h.id !== currentSubmissionId);

  // Initialize selected history ID when modal opens or history changes
  useEffect(() => {
    if (isOpen) {
      if (availableHistory.length > 0 && !selectedHistoryId) {
        setSelectedHistoryId(availableHistory[0].id);
      } else if (history.length > 0 && !selectedHistoryId) {
        setSelectedHistoryId(history[0].id);
      }
    }
  }, [isOpen, history, currentSubmissionId]);

  // Fetch historical logs whenever selectedHistoryId changes
  useEffect(() => {
    if (!selectedHistoryId || !isOpen) return;

    const fetchHistoricalLogs = async () => {
      setLoadingLogs(true);
      try {
        const res = await axios.get(`/api/submissions/${selectedHistoryId}/logs`);
        if (res.data && res.data.logs) {
          const fetched: LogItem[] = res.data.logs.map((l: any) => ({
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
          setHistoricalLogs(fetched);
        }
      } catch (err) {
        console.error('Failed to load historical submission logs', err);
        toast.error('Failed to load comparison historical logs.');
      } finally {
        setLoadingLogs(false);
      }
    };

    fetchHistoricalLogs();
  }, [selectedHistoryId, isOpen]);

  if (!isOpen) return null;

  const selectedHistoryRecord = history.find((h) => h.id === selectedHistoryId);

  // Helper check functions
  const isConfirmed = (log?: LogItem) => {
    if (!log) return false;
    const lv = (log.liveVerification || '').toLowerCase();
    const st = (log.submissionStatus || '').toLowerCase();
    return lv.includes('confirmed') || lv.includes('success') || st.includes('submitted');
  };

  const isFailed = (log?: LogItem) => {
    if (!log) return false;
    const lv = (log.liveVerification || '').toLowerCase();
    const st = (log.submissionStatus || '').toLowerCase();
    return lv.includes('failed') || st.includes('failed') || st.includes('error');
  };

  // Build mapped comparison list
  const historicalMap = new Map<string, LogItem>();
  historicalLogs.forEach((hLog) => {
    const key = `${hLog.directoryName.toLowerCase()}::${hLog.targetUrl.toLowerCase()}`;
    historicalMap.set(key, hLog);
  });

  interface ComparisonItem {
    key: string;
    directoryName: string;
    directoryType: string;
    targetUrl: string;
    currentLog?: LogItem;
    historicalLog?: LogItem;
    diffType: 'IMPROVED' | 'REGRESSED' | 'UNCHANGED_SUCCESS' | 'UNCHANGED_FAILED' | 'NEW';
  }

  const comparisonItems: ComparisonItem[] = [];
  const processedHistKeys = new Set<string>();

  currentLogs.forEach((cLog) => {
    const key = `${cLog.directoryName.toLowerCase()}::${cLog.targetUrl.toLowerCase()}`;
    const hLog = historicalMap.get(key) || historicalLogs.find((h) => h.directoryName.toLowerCase() === cLog.directoryName.toLowerCase());

    if (hLog) {
      processedHistKeys.add(`${hLog.directoryName.toLowerCase()}::${hLog.targetUrl.toLowerCase()}`);
    }

    const cConfirmed = isConfirmed(cLog);
    const hConfirmed = isConfirmed(hLog);
    const cFailed = isFailed(cLog);
    const hFailed = isFailed(hLog);

    let diffType: ComparisonItem['diffType'] = 'NEW';
    if (hLog) {
      if (!hConfirmed && cConfirmed) {
        diffType = 'IMPROVED';
      } else if (hConfirmed && (cFailed || !cConfirmed)) {
        diffType = 'REGRESSED';
      } else if (cConfirmed && hConfirmed) {
        diffType = 'UNCHANGED_SUCCESS';
      } else {
        diffType = 'UNCHANGED_FAILED';
      }
    }

    comparisonItems.push({
      key: cLog.id,
      directoryName: cLog.directoryName,
      directoryType: cLog.directoryType,
      targetUrl: cLog.targetUrl,
      currentLog: cLog,
      historicalLog: hLog,
      diffType,
    });
  });

  // Add historical logs that weren't in current
  historicalLogs.forEach((hLog) => {
    const key = `${hLog.directoryName.toLowerCase()}::${hLog.targetUrl.toLowerCase()}`;
    if (!processedHistKeys.has(key) && !comparisonItems.some((ci) => ci.directoryName.toLowerCase() === hLog.directoryName.toLowerCase())) {
      comparisonItems.push({
        key: hLog.id,
        directoryName: hLog.directoryName,
        directoryType: hLog.directoryType,
        targetUrl: hLog.targetUrl,
        currentLog: undefined,
        historicalLog: hLog,
        diffType: 'REGRESSED',
      });
    }
  });

  // Compute Metrics
  const currentTotal = currentLogs.length;
  const currentConfirmed = currentLogs.filter(isConfirmed).length;
  const currentSuccessRate = currentTotal > 0 ? Math.round((currentConfirmed / currentTotal) * 100) : 0;

  const historicalTotal = historicalLogs.length;
  const historicalConfirmed = historicalLogs.filter(isConfirmed).length;
  const historicalSuccessRate = historicalTotal > 0 ? Math.round((historicalConfirmed / historicalTotal) * 100) : 0;

  const confirmedDiff = currentConfirmed - historicalConfirmed;
  const rateDiff = currentSuccessRate - historicalSuccessRate;

  const improvedCount = comparisonItems.filter((item) => item.diffType === 'IMPROVED').length;
  const regressedCount = comparisonItems.filter((item) => item.diffType === 'REGRESSED').length;

  // Filtering
  const filteredItems = comparisonItems.filter((item) => {
    const matchesSearch =
      item.directoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.targetUrl.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (diffFilter === 'DIFF_ONLY') {
      return item.diffType === 'IMPROVED' || item.diffType === 'REGRESSED' || item.diffType === 'NEW';
    }
    if (diffFilter === 'IMPROVED') {
      return item.diffType === 'IMPROVED';
    }
    if (diffFilter === 'REGRESSED') {
      return item.diffType === 'REGRESSED';
    }
    return true;
  });

  // Export comparison as CSV
  const handleExportComparisonCsv = () => {
    const headers = [
      'Directory Name',
      'Directory Type',
      'Target URL',
      'Current Status',
      'Current Live Verification',
      'Historical Status',
      'Historical Live Verification',
      'Comparison Diff',
    ];

    const rows = filteredItems.map((item) => [
      `"${item.directoryName.replace(/"/g, '""')}"`,
      `"${item.directoryType.replace(/"/g, '""')}"`,
      `"${item.targetUrl.replace(/"/g, '""')}"`,
      `"${item.currentLog?.submissionStatus || 'N/A'}"`,
      `"${item.currentLog?.liveVerification || 'N/A'}"`,
      `"${item.historicalLog?.submissionStatus || 'N/A'}"`,
      `"${item.historicalLog?.liveVerification || 'N/A'}"`,
      `"${item.diffType}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `submission_comparison_${currentSubmissionId || 'current'}_vs_${selectedHistoryId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Comparison diff exported to CSV!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl relative my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-zinc-950 border-b border-zinc-800 p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <GitCompare className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Side-by-Side Run Comparison</h2>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-mono">
                  Audit Diff Analysis
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Compare indexation yield, HTTP live verifications, and delivery improvements between current and previous submissions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Historical Record Selector Banner */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Select Historical Record:</span>
              </span>

              {availableHistory.length === 0 ? (
                <span className="text-xs text-amber-400 font-mono">
                  No previous historical runs available for comparison yet. Run more submissions to enable historical comparison.
                </span>
              ) : (
                <select
                  value={selectedHistoryId}
                  onChange={(e) => setSelectedHistoryId(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-indigo-500 flex-1 max-w-lg cursor-pointer"
                >
                  {availableHistory.map((h) => (
                    <option key={h.id} value={h.id}>
                      {new Date(h.created_at).toLocaleString()} • {h.target_url} ({h.confirmed_count}/{h.total_directories} Confirmed 200 OK)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportComparisonCsv}
                disabled={filteredItems.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Diff CSV</span>
              </button>
            </div>
          </div>

          {/* Comparison Scorecard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Run Yield */}
            <div className="bg-zinc-950 border border-indigo-500/30 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider font-mono">
                Current Submission Run
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{currentConfirmed}</span>
                <span className="text-xs text-zinc-400 font-mono">/ {currentTotal} Confirmed</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono pt-1 border-t border-zinc-900 flex justify-between">
                <span>Success Rate:</span>
                <span className="text-emerald-400 font-bold">{currentSuccessRate}%</span>
              </div>
            </div>

            {/* Historical Run Yield */}
            <div className="bg-zinc-950 border border-purple-500/30 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider font-mono">
                Historical Benchmark Run
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{historicalConfirmed}</span>
                <span className="text-xs text-zinc-400 font-mono">/ {historicalTotal} Confirmed</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono pt-1 border-t border-zinc-900 flex justify-between">
                <span>Success Rate:</span>
                <span className="text-purple-300 font-bold">{historicalSuccessRate}%</span>
              </div>
            </div>

            {/* Confirmed Net Difference */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Net Confirmed Diff
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xl font-black font-mono ${
                    confirmedDiff > 0 ? 'text-emerald-400' : confirmedDiff < 0 ? 'text-rose-400' : 'text-zinc-400'
                  }`}
                >
                  {confirmedDiff > 0 ? `+${confirmedDiff}` : confirmedDiff}
                </span>
                {confirmedDiff > 0 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                ) : confirmedDiff < 0 ? (
                  <TrendingDown className="w-5 h-5 text-rose-400" />
                ) : (
                  <Minus className="w-5 h-5 text-zinc-500" />
                )}
              </div>
              <div className="text-[11px] text-zinc-400 font-mono pt-1 border-t border-zinc-900 flex justify-between">
                <span>Rate Shift:</span>
                <span className={rateDiff >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {rateDiff >= 0 ? `+${rateDiff}%` : `${rateDiff}%`}
                </span>
              </div>
            </div>

            {/* Improved vs Regressed Breakdown */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Directory Shift Summary
              </span>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold font-mono">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{improvedCount} Improved</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold font-mono">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{regressedCount} Regressed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            {/* Search filter */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search directory name or target URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setDiffFilter('ALL')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  diffFilter === 'ALL' ? 'bg-zinc-800 text-zinc-100 shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All ({comparisonItems.length})
              </button>
              <button
                onClick={() => setDiffFilter('DIFF_ONLY')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  diffFilter === 'DIFF_ONLY'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/40 shadow'
                    : 'text-zinc-400 hover:text-amber-400'
                }`}
              >
                Differences Only ({improvedCount + regressedCount})
              </button>
              <button
                onClick={() => setDiffFilter('IMPROVED')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  diffFilter === 'IMPROVED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow'
                    : 'text-zinc-400 hover:text-emerald-400'
                }`}
              >
                Improved ({improvedCount})
              </button>
              <button
                onClick={() => setDiffFilter('REGRESSED')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  diffFilter === 'REGRESSED'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/40 shadow'
                    : 'text-zinc-400 hover:text-rose-400'
                }`}
              >
                Regressed ({regressedCount})
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/40">
            {loadingLogs ? (
              <div className="p-12 text-center text-zinc-400 space-y-2 font-mono text-xs">
                <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin mx-auto" />
                <p>Loading historical run data for comparison...</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 font-semibold uppercase tracking-wider border-b border-zinc-800">
                    <th className="py-3 px-4">Directory Network</th>
                    <th className="py-3 px-4">Current Run Result</th>
                    <th className="py-3 px-4">Historical Run Result</th>
                    <th className="py-3 px-4 text-center">Comparison Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono text-zinc-300">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-zinc-500 font-sans">
                        No directory results match your current comparison search or filter.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, idx) => {
                      const cConfirmed = isConfirmed(item.currentLog);
                      const hConfirmed = isConfirmed(item.historicalLog);

                      return (
                        <tr key={`${item.key}_${idx}`} className="hover:bg-zinc-800/30 transition-colors">
                          {/* Directory & Target */}
                          <td className="py-3 px-4">
                            <div className="font-sans font-medium text-zinc-200">{item.directoryName}</div>
                            <div className="text-[10px] text-zinc-500 uppercase font-mono">{item.directoryType}</div>
                          </td>

                          {/* Current Result */}
                          <td className="py-3 px-4">
                            {item.currentLog ? (
                              <div className="space-y-1">
                                {cConfirmed ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Confirmed (200 OK)</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>{item.currentLog.submissionStatus || 'Failed'}</span>
                                  </span>
                                )}
                                <div className="text-[10px] text-zinc-500 font-mono">
                                  Indexing: {item.currentLog.googleIndexing || 'Pending'} • Ping: {item.currentLog.pingStatus || 'Pending'}
                                </div>
                              </div>
                            ) : (
                              <span className="text-zinc-600 text-xs italic">Not included in current run</span>
                            )}
                          </td>

                          {/* Historical Result */}
                          <td className="py-3 px-4">
                            {item.historicalLog ? (
                              <div className="space-y-1">
                                {hConfirmed ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Confirmed (200 OK)</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>{item.historicalLog.submissionStatus || 'Failed'}</span>
                                  </span>
                                )}
                                <div className="text-[10px] text-zinc-500 font-mono">
                                  Indexing: {item.historicalLog.googleIndexing || 'Pending'} • Ping: {item.historicalLog.pingStatus || 'Pending'}
                                </div>
                              </div>
                            ) : (
                              <span className="text-zinc-600 text-xs italic">Not in historical benchmark</span>
                            )}
                          </td>

                          {/* Comparison Shift Badge */}
                          <td className="py-3 px-4 text-center font-sans">
                            {item.diffType === 'IMPROVED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Improved</span>
                              </span>
                            )}
                            {item.diffType === 'REGRESSED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40">
                                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                                <span>Regressed</span>
                              </span>
                            )}
                            {item.diffType === 'UNCHANGED_SUCCESS' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-zinc-800 text-zinc-400">
                                <Minus className="w-3 h-3 text-zinc-500" />
                                <span>Maintained Confirmed</span>
                              </span>
                            )}
                            {item.diffType === 'UNCHANGED_FAILED' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-zinc-900 text-zinc-500">
                                <Minus className="w-3 h-3" />
                                <span>Maintained Failed</span>
                              </span>
                            )}
                            {item.diffType === 'NEW' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                <span>New Target</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
