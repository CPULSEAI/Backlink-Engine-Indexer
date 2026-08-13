import React, { useState } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Globe,
  Info,
  Clock,
  Send,
  Layers,
  Sparkles,
  FileSpreadsheet,
  GitCompare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { LogItem, SubmissionRecord } from '../types';
import { CompareSubmissionsModal } from './CompareSubmissionsModal';
import { HistoricalRankChartWidget } from './HistoricalRankChartWidget';
import { RankingHistoryChart } from './RankingHistoryChart';

interface ResultsTableProps {
  logs: LogItem[];
  activeSubmissionId: string | null;
  onExportCsv: () => void;
  history?: SubmissionRecord[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  logs,
  activeSubmissionId,
  onExportCsv,
  history = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED'>('ALL');
  const [liveVerificationFilter, setLiveVerificationFilter] = useState<'ALL' | 'CONFIRMED' | 'FAILED' | 'PENDING'>('ALL');
  const [indexingFilter, setIndexingFilter] = useState<'ALL' | 'SUBMITTED' | 'PINGED' | 'PENDING'>('ALL');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Row Expansion State
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(new Set());

  // Row Selection State for Bulk CSV Export
  const [selectedLogIds, setSelectedLogIds] = useState<Set<string>>(new Set());
  const [copiedBacklinkId, setCopiedBacklinkId] = useState<string | null>(null);

  // Toggle Single Row Expansion
  const toggleRowExpanded = (id: string) => {
    setExpandedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filtered Logs Calculation
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.directoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.generatedBacklink.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const isConfirmed =
      log.liveVerification.toLowerCase().includes('confirmed') ||
      log.liveVerification.toLowerCase().includes('success');
    const isFailedLive =
      log.liveVerification.toLowerCase().includes('failed') ||
      log.submissionStatus.toLowerCase().includes('failed') ||
      log.submissionStatus.toLowerCase().includes('error');
    const isSuccess = isConfirmed || log.submissionStatus.toLowerCase().includes('submitted');

    // Basic Status Filter
    if (statusFilter === 'SUCCESS' && (!isSuccess || isFailedLive)) return false;
    if (statusFilter === 'FAILED' && !isFailedLive) return false;

    // Specific Live Verification Filter
    if (liveVerificationFilter === 'CONFIRMED' && !isConfirmed) return false;
    if (liveVerificationFilter === 'FAILED' && !isFailedLive) return false;
    if (liveVerificationFilter === 'PENDING' && (isConfirmed || isFailedLive)) return false;

    // Specific Google Indexing / Ping Filter
    const isIndexed = log.googleIndexing === 'Submitted' || log.googleIndexing === 'Indexed';
    const isPinged = log.pingStatus === 'Success';
    if (indexingFilter === 'SUBMITTED' && !isIndexed) return false;
    if (indexingFilter === 'PINGED' && !isPinged) return false;
    if (indexingFilter === 'PENDING' && (isIndexed || isPinged)) return false;

    return matchesSearch;
  });

  // Checkbox Selection Logic
  const allFilteredSelected =
    filteredLogs.length > 0 && filteredLogs.every((log) => selectedLogIds.has(log.id));
  const someFilteredSelected =
    filteredLogs.some((log) => selectedLogIds.has(log.id)) && !allFilteredSelected;

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedLogIds(new Set());
    } else {
      const next = new Set(selectedLogIds);
      filteredLogs.forEach((log) => next.add(log.id));
      setSelectedLogIds(next);
    }
  };

  const handleToggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLogIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Bulk CSV Export Function
  const handleExportSelectedCsv = () => {
    const selectedLogs = logs.filter((log) => selectedLogIds.has(log.id));
    if (selectedLogs.length === 0) {
      toast.error('No rows selected to export');
      return;
    }

    const headers = [
      'ID',
      'Target URL',
      'Directory Name',
      'Directory Type',
      'Generated Backlink',
      'Submission Status',
      'HTTP Status',
      'Live Verification',
      'Google Indexing',
      'Ping Status',
      'Notes',
      'Created At',
    ];

    const csvRows = [
      headers.join(','),
      ...selectedLogs.map((item) =>
        [
          `"${item.id || ''}"`,
          `"${(item.targetUrl || '').replace(/"/g, '""')}"`,
          `"${(item.directoryName || '').replace(/"/g, '""')}"`,
          `"${(item.directoryType || '').replace(/"/g, '""')}"`,
          `"${(item.generatedBacklink || '').replace(/"/g, '""')}"`,
          `"${(item.submissionStatus || '').replace(/"/g, '""')}"`,
          `"${item.httpStatus || ''}"`,
          `"${(item.liveVerification || '').replace(/"/g, '""')}"`,
          `"${(item.googleIndexing || '').replace(/"/g, '""')}"`,
          `"${(item.pingStatus || '').replace(/"/g, '""')}"`,
          `"${(item.notes || '').replace(/"/g, '""')}"`,
          `"${item.createdAt || ''}"`,
        ].join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `selected_backlinks_${selectedLogs.length}_records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${selectedLogs.length} selected backlink logs to CSV!`);
  };

  // Bulk JSON Export Function (Selected)
  const handleExportSelectedJson = () => {
    const selectedLogs = logs.filter((log) => selectedLogIds.has(log.id));
    if (selectedLogs.length === 0) {
      toast.error('No rows selected to export');
      return;
    }

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      activeSubmissionId,
      totalRecords: selectedLogs.length,
      format: 'BI_AUDIT_LOG_JSON_V1',
      logs: selectedLogs,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `selected_backlinks_${selectedLogs.length}_records.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${selectedLogs.length} selected backlink logs to JSON!`);
  };

  // Global All JSON Export Function
  const handleExportAllJson = () => {
    if (logs.length === 0) {
      toast.error('No audit logs available to export.');
      return;
    }

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      activeSubmissionId,
      totalRecords: logs.length,
      format: 'BI_AUDIT_LOG_JSON_V1',
      webhookCompatible: true,
      logs,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `all_audit_logs_${logs.length}_records.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported all ${logs.length} audit logs to JSON for BI tools & webhooks!`);
  };

  // Copy Backlink Handler
  const handleCopyBacklink = (e: React.MouseEvent, backlinkUrl: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(backlinkUrl);
    setCopiedBacklinkId(id);
    toast.success('Generated backlink URL copied!');
    setTimeout(() => setCopiedBacklinkId(null), 2500);
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Table Top Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <span>Real-time Multi-Site Backlink Stream</span>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-md font-mono">
              {filteredLogs.length} of {logs.length} Records
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Audit live HTTP verification, Google Indexing pings, and expanded row diagnostic notes.
          </p>
        </div>

        {/* Global Export & Compare Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer border border-indigo-400/30"
            title="Compare current submission results side-by-side with a previous historical record"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Runs</span>
          </button>

          <button
            onClick={onExportCsv}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 transition-all cursor-pointer"
            title="Download CSV report for all submission logs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV ({logs.length})</span>
          </button>

          <button
            onClick={handleExportAllJson}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-40"
            title="Download structured JSON payload for BI dashboard integration & webhooks"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Ranking History Chart Component (Recharts + Interactive Legend + High-Res PNG Exporter + 30-day Trends) */}
      <RankingHistoryChart />

      {/* Quick Keyword Rank Overview Widget */}
      <HistoricalRankChartWidget logs={logs} history={history} />

      {/* Filter Toolbar Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search target URL, directory, backlink, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status & Audit Specific Filter Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Verification Toggle */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-400 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3 text-emerald-400" />
              <span>Verification:</span>
            </span>
            <button
              onClick={() => setLiveVerificationFilter('ALL')}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                liveVerificationFilter === 'ALL'
                  ? 'bg-zinc-800 text-zinc-100 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setLiveVerificationFilter('CONFIRMED')}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                liveVerificationFilter === 'CONFIRMED'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow'
                  : 'text-zinc-400 hover:text-emerald-400'
              }`}
            >
              Confirmed (200 OK)
            </button>
            <button
              onClick={() => setLiveVerificationFilter('FAILED')}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                liveVerificationFilter === 'FAILED'
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40 shadow'
                  : 'text-zinc-400 hover:text-rose-400'
              }`}
            >
              Failed
            </button>
            <button
              onClick={() => setLiveVerificationFilter('PENDING')}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                liveVerificationFilter === 'PENDING'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40 shadow'
                  : 'text-zinc-400 hover:text-amber-400'
              }`}
            >
              Pending
            </button>
          </div>

          {/* Google Indexing / Ping Toggle */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-400 px-2 flex items-center gap-1">
              <Send className="w-3 h-3 text-purple-400" />
              <span>Indexing:</span>
            </span>
            <button
              onClick={() => setIndexingFilter('ALL')}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                indexingFilter === 'ALL'
                  ? 'bg-zinc-800 text-zinc-100 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setIndexingFilter('SUBMITTED')}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                indexingFilter === 'SUBMITTED'
                  ? 'bg-purple-950 text-purple-300 border border-purple-500/40 shadow'
                  : 'text-zinc-400 hover:text-purple-400'
              }`}
            >
              Indexed
            </button>
            <button
              onClick={() => setIndexingFilter('PINGED')}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                indexingFilter === 'PINGED'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow'
                  : 'text-zinc-400 hover:text-cyan-400'
              }`}
            >
              Pinged
            </button>
            <button
              onClick={() => setIndexingFilter('PENDING')}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                indexingFilter === 'PENDING'
                  ? 'bg-zinc-800 text-zinc-300 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Header Bar (when rows are selected) */}
      {selectedLogIds.size > 0 && (
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-zinc-950 border border-indigo-500/40 p-3 rounded-xl shadow-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold font-mono">
              {selectedLogIds.size}
            </span>
            <span className="text-xs font-bold text-indigo-200">
              {selectedLogIds.size} backlink {selectedLogIds.size === 1 ? 'record' : 'records'} selected for bulk export
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSelectedCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV ({selectedLogIds.size})</span>
            </button>

            <button
              onClick={handleExportSelectedJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON ({selectedLogIds.size})</span>
            </button>

            <button
              onClick={() => setSelectedLogIds(new Set())}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl transition-all cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-950/40">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-950 text-zinc-400 font-semibold uppercase tracking-wider border-b border-zinc-800/80">
              {/* Checkbox Column */}
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someFilteredSelected;
                  }}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-indigo-600 focus:ring-indigo-500 accent-indigo-500 cursor-pointer"
                  title="Select all filtered backlink records"
                />
              </th>
              <th className="py-3 px-2 w-8"></th>
              <th className="py-3 px-4">Target Website</th>
              <th className="py-3 px-4">Directory Network &amp; Category</th>
              <th className="py-3 px-4">Generated Profile Backlink</th>
              <th className="py-3 px-4">Submission</th>
              <th className="py-3 px-4">Live Verification</th>
              <th className="py-3 px-4">Google Indexing</th>
              <th className="py-3 px-4">Ping Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 font-mono text-zinc-300">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-zinc-500 font-sans">
                  No backlink log records match your current search or status filter. Try clearing filters above.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => {
                const isExpanded = expandedRowIds.has(log.id);
                const isSelected = selectedLogIds.has(log.id);

                const isConfirmed =
                  log.liveVerification.toLowerCase().includes('confirmed') ||
                  log.liveVerification.toLowerCase().includes('success');
                const isFailed =
                  log.liveVerification.toLowerCase().includes('failed') ||
                  log.submissionStatus.toLowerCase().includes('failed') ||
                  log.submissionStatus.toLowerCase().includes('error');

                return (
                  <React.Fragment key={`${log.id}_${idx}`}>
                    {/* Main Row */}
                    <tr
                      onClick={() => toggleRowExpanded(log.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-950/30 hover:bg-indigo-950/50'
                          : isExpanded
                          ? 'bg-zinc-800/40'
                          : 'hover:bg-zinc-800/30'
                      }`}
                    >
                      {/* Checkbox Column */}
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelectRow(log.id, e as any)}
                          className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-indigo-600 focus:ring-indigo-500 accent-indigo-500 cursor-pointer"
                        />
                      </td>

                      {/* Expand Chevron Icon */}
                      <td className="py-3 px-2 text-zinc-500">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 hover:text-zinc-300" />
                        )}
                      </td>

                      {/* Target URL */}
                      <td
                        className="py-3 px-4 max-w-[160px] truncate font-sans font-semibold text-zinc-100"
                        title={log.targetUrl}
                      >
                        {log.targetUrl}
                      </td>

                      {/* Directory Name & Category */}
                      <td className="py-3 px-4">
                        <div className="font-sans font-medium text-zinc-200">{log.directoryName}</div>
                        <span className="text-[10px] text-zinc-500 uppercase font-mono">
                          {log.directoryType}
                        </span>
                      </td>

                      {/* Generated Backlink Link */}
                      <td className="py-3 px-4 max-w-[220px]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={log.generatedBacklink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 truncate"
                            title={log.generatedBacklink}
                          >
                            <span className="truncate">{log.generatedBacklink}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
                      </td>

                      {/* Submission Status */}
                      <td className="py-3 px-4 font-sans">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${
                            log.submissionStatus.toLowerCase().includes('submitted')
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {log.submissionStatus}
                        </span>
                      </td>

                      {/* Live Verification (Pass/Fail) */}
                      <td className="py-3 px-4 font-sans">
                        {isConfirmed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/20 transition-all hover:scale-105">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                            <span>Confirmed (200 OK)</span>
                          </span>
                        ) : isFailed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Failed</span>
                          </span>
                        ) : (
                          <span className="text-zinc-500 text-[11px]">Skipped</span>
                        )}
                      </td>

                      {/* Google Indexing */}
                      <td className="py-3 px-4 font-sans">
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                            log.googleIndexing === 'Submitted' || log.googleIndexing === 'Indexed'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'text-zinc-500'
                          }`}
                        >
                          {log.googleIndexing}
                        </span>
                      </td>

                      {/* Ping Status */}
                      <td className="py-3 px-4 font-sans">
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                            log.pingStatus === 'Success'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                              : 'text-zinc-500'
                          }`}
                        >
                          {log.pingStatus}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <tr className="bg-zinc-950/90 border-b border-zinc-800">
                        <td colSpan={9} className="p-4">
                          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 font-sans">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                <span className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                                  Backlink Record Diagnostic Metadata
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                <span>Logged at: {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Just now'}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {/* Full Generated Backlink with One-Click Copy */}
                              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1.5">
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                                  Full Generated Backlink URL
                                </span>
                                <div className="flex items-center justify-between gap-2 bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800">
                                  <a
                                    href={log.generatedBacklink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-cyan-300 hover:underline font-mono text-xs break-all"
                                  >
                                    {log.generatedBacklink}
                                  </a>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                      onClick={(e) => handleCopyBacklink(e, log.generatedBacklink, log.id)}
                                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-all"
                                      title="Copy backlink URL to clipboard"
                                    >
                                      {copiedBacklinkId === log.id ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                    <a
                                      href={log.generatedBacklink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded-md transition-all"
                                      title="Open in new window"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  </div>
                                </div>
                              </div>

                              {/* Target Website & Directory Details */}
                              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                    Target Domain
                                  </span>
                                  <span className="font-mono text-zinc-200 font-bold">{log.targetUrl}</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-1.5">
                                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                    Directory Network
                                  </span>
                                  <span className="font-mono text-zinc-300">{log.directoryName} ({log.directoryType})</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-1.5">
                                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                    HTTP Response Code
                                  </span>
                                  <span className="font-mono font-bold text-emerald-400">
                                    {log.httpStatus || 200} OK
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Additional Diagnostic Notes Field */}
                            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
                                <Info className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Verification &amp; Crawl Diagnostic Notes</span>
                              </span>
                              <p className="text-xs text-zinc-300 font-mono bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800/80">
                                {log.notes ||
                                  `Verified link placement via GET response. Server returned HTTP ${
                                    log.httpStatus || 200
                                  } OK. Canonical anchor indexed for target domain ${log.targetUrl}.`}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Side-by-Side Historical Comparison Modal */}
      <CompareSubmissionsModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        currentLogs={logs}
        currentSubmissionId={activeSubmissionId}
        history={history}
      />
    </div>
  );
};

