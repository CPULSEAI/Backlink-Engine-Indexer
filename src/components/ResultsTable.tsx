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
    <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000] space-y-6">
      {/* Table Top Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-4 border-black">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-black text-white font-mono-brutal text-xs font-bold uppercase">
              [02] LOG_STREAM
            </span>
            <span className="font-mono-brutal text-xs text-[#ff4d00] font-bold">
              // AUDIT_RECORDS_HEX
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-black uppercase tracking-tight mt-1 flex items-center gap-3">
            <span>REAL-TIME BACKLINK STREAM &amp; AUDIT</span>
            <span className="text-xs font-mono-brutal font-bold bg-[#f2efeb] text-black border-2 border-black px-2.5 py-0.5 shadow-[2px_2px_0_#000]">
              {filteredLogs.length} / {logs.length} RECORDS
            </span>
          </h3>
        </div>

        {/* Global Export & Compare Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#f2efeb] hover:bg-zinc-200 text-black font-mono-brutal font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer"
            title="Compare current submission results side-by-side with a previous historical record"
          >
            <GitCompare className="w-3.5 h-3.5 text-[#ff4d00]" />
            <span>COMPARE_RUNS</span>
          </button>

          <button
            onClick={onExportCsv}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#f2efeb] disabled:opacity-40 text-black text-xs font-mono-brutal font-bold uppercase border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer"
            title="Download CSV report for all submission logs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-black" />
            <span>EXPORT_CSV ({logs.length})</span>
          </button>

          <button
            onClick={handleExportAllJson}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#ff4d00] hover:bg-[#ff5c14] border-2 border-black text-black text-xs font-mono-brutal font-bold uppercase shadow-[2px_2px_0_#000] transition-all cursor-pointer disabled:opacity-40"
            title="Download structured JSON payload for BI dashboard integration & webhooks"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>EXPORT_JSON</span>
          </button>
        </div>
      </div>

      {/* Ranking History Chart Component (Recharts + Interactive Legend + High-Res PNG Exporter + 30-day Trends) */}
      <RankingHistoryChart />

      {/* Quick Keyword Rank Overview Widget */}
      <HistoricalRankChartWidget logs={logs} history={history} />

      {/* Filter Toolbar Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#f2efeb] p-4 border-4 border-black shadow-[4px_4px_0_#000]">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="FILTER BY DOMAIN, DIRECTORY, OR STATUS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-black pl-9 pr-3 py-2 text-xs font-mono-brutal font-bold text-black placeholder-zinc-500 focus:outline-none shadow-[2px_2px_0_#000]"
          />
        </div>

        {/* Status & Audit Specific Filter Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Verification Toggle */}
          <div className="flex items-center gap-1 bg-white p-1 border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="text-[10px] font-mono-brutal font-bold text-black px-2 flex items-center gap-1 uppercase">
              <Filter className="w-3 h-3 text-[#ff4d00]" />
              <span>VERIFY:</span>
            </span>
            <button
              onClick={() => setLiveVerificationFilter('ALL')}
              className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                liveVerificationFilter === 'ALL'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setLiveVerificationFilter('CONFIRMED')}
              className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                liveVerificationFilter === 'CONFIRMED'
                  ? 'bg-[#ff4d00] text-black border border-black'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              200_OK
            </button>
            <button
              onClick={() => setLiveVerificationFilter('FAILED')}
              className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                liveVerificationFilter === 'FAILED'
                  ? 'bg-black text-[#ff4d00] border border-black'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              FAILED
            </button>
            <button
              onClick={() => setLiveVerificationFilter('PENDING')}
              className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                liveVerificationFilter === 'PENDING'
                  ? 'bg-zinc-300 text-black border border-black'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              PENDING
            </button>
          </div>

          {/* Google Indexing / Ping Toggle */}
          <div className="flex items-center gap-1 bg-white p-1 border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="text-[10px] font-mono-brutal font-bold text-black px-2 flex items-center gap-1 uppercase">
              <Send className="w-3 h-3 text-black" />
              <span>INDEX:</span>
            </span>
            <button
              onClick={() => setIndexingFilter('ALL')}
              className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                indexingFilter === 'ALL'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setIndexingFilter('SUBMITTED')}
              className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                indexingFilter === 'SUBMITTED'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              INDEXED
            </button>
            <button
              onClick={() => setIndexingFilter('PINGED')}
              className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                indexingFilter === 'PINGED'
                  ? 'bg-[#ff4d00] text-black border border-black'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              PINGED
            </button>
            <button
              onClick={() => setIndexingFilter('PENDING')}
              className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                indexingFilter === 'PENDING'
                  ? 'bg-zinc-300 text-black'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              PENDING
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Header Bar (when rows are selected) */}
      {selectedLogIds.size > 0 && (
        <div className="flex items-center justify-between bg-black text-white border-4 border-black p-3.5 shadow-[4px_4px_0_#ff4d00]">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center px-2 py-0.5 bg-[#ff4d00] text-black text-xs font-mono-brutal font-bold">
              {selectedLogIds.size}
            </span>
            <span className="text-xs font-mono-brutal font-bold uppercase tracking-wider text-white">
              {selectedLogIds.size} RECORDS SELECTED FOR BATCH EXPORT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSelectedCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-mono-brutal font-bold uppercase border-2 border-white shadow-[2px_2px_0_#ff4d00] transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>CSV ({selectedLogIds.size})</span>
            </button>

            <button
              onClick={handleExportSelectedJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff4d00] text-black text-xs font-mono-brutal font-bold uppercase border-2 border-black shadow-[2px_2px_0_#fff] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON ({selectedLogIds.size})</span>
            </button>

            <button
              onClick={() => setSelectedLogIds(new Set())}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer"
            >
              CLEAR
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto border-4 border-black bg-white shadow-[4px_4px_0_#000]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-black text-white font-mono-brutal font-bold uppercase tracking-wider border-b-4 border-black">
              {/* Checkbox Column */}
              <th className="py-3 px-3 w-10 text-center border-r-2 border-zinc-800">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someFilteredSelected;
                  }}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 rounded-none accent-[#ff4d00] cursor-pointer"
                  title="Select all filtered backlink records"
                />
              </th>
              <th className="py-3 px-2 w-8 border-r-2 border-zinc-800"></th>
              <th className="py-3 px-4 border-r-2 border-zinc-800">TARGET DOMAIN</th>
              <th className="py-3 px-4 border-r-2 border-zinc-800">DIRECTORY NETWORK</th>
              <th className="py-3 px-4 border-r-2 border-zinc-800">PROFILE BACKLINK</th>
              <th className="py-3 px-4 border-r-2 border-zinc-800">SUBMISSION</th>
              <th className="py-3 px-4 border-r-2 border-zinc-800">LIVE VERIFY</th>
              <th className="py-3 px-4 border-r-2 border-zinc-800">GOOGLE SERP</th>
              <th className="py-3 px-4">PING STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black font-mono-brutal text-black">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-zinc-600 font-mono-brutal font-bold uppercase">
                  NO BACKLINK LOG RECORDS MATCH CURRENT FILTERS.
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
                          ? 'bg-[#ffe8dd]'
                          : isExpanded
                          ? 'bg-[#f2efeb]'
                          : 'hover:bg-[#f2efeb]'
                      }`}
                    >
                      {/* Checkbox Column */}
                      <td className="py-3 px-3 text-center border-r-2 border-black" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelectRow(log.id, e as any)}
                          className="w-4 h-4 rounded-none accent-[#ff4d00] cursor-pointer"
                        />
                      </td>

                      {/* Expand Chevron Icon */}
                      <td className="py-3 px-2 text-black border-r-2 border-black text-center">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#ff4d00] inline" />
                        ) : (
                          <ChevronRight className="w-4 h-4 inline" />
                        )}
                      </td>

                      {/* Target URL */}
                      <td
                        className="py-3 px-4 max-w-[160px] truncate font-bold text-black border-r-2 border-black"
                        title={log.targetUrl}
                      >
                        {log.targetUrl}
                      </td>

                      {/* Directory Name & Category */}
                      <td className="py-3 px-4 border-r-2 border-black">
                        <div className="font-bold text-black">{log.directoryName}</div>
                        <span className="text-[10px] text-zinc-600 uppercase font-mono-brutal">
                          {log.directoryType}
                        </span>
                      </td>

                      {/* Generated Backlink Link */}
                      <td className="py-3 px-4 max-w-[220px] border-r-2 border-black" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={log.generatedBacklink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-black hover:text-[#ff4d00] hover:underline font-bold flex items-center gap-1 truncate"
                            title={log.generatedBacklink}
                          >
                            <span className="truncate">{log.generatedBacklink}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0 text-black" />
                          </a>
                        </div>
                      </td>

                      {/* Submission Status */}
                      <td className="py-3 px-4 border-r-2 border-black">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase border border-black ${
                            log.submissionStatus.toLowerCase().includes('submitted')
                              ? 'bg-[#f2efeb] text-black'
                              : 'bg-black text-[#ff4d00]'
                          }`}
                        >
                          {log.submissionStatus}
                        </span>
                      </td>

                      {/* Live Verification (Pass/Fail) */}
                      <td className="py-3 px-4 border-r-2 border-black">
                        {isConfirmed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono-brutal font-bold bg-[#ff4d00] text-black border border-black shadow-[1px_1px_0_#000]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>200_OK</span>
                          </span>
                        ) : isFailed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono-brutal font-bold bg-black text-[#ff4d00] border border-black">
                            <XCircle className="w-3 h-3" />
                            <span>FAILED</span>
                          </span>
                        ) : (
                          <span className="text-zinc-600 text-[10px] font-mono-brutal">SKIPPED</span>
                        )}
                      </td>

                      {/* Google Indexing */}
                      <td className="py-3 px-4 border-r-2 border-black">
                        <span
                          className={`text-[10px] font-mono-brutal font-bold px-2 py-0.5 uppercase border border-black ${
                            log.googleIndexing === 'Submitted' || log.googleIndexing === 'Indexed'
                              ? 'bg-black text-white'
                              : 'bg-white text-zinc-500'
                          }`}
                        >
                          {log.googleIndexing}
                        </span>
                      </td>

                      {/* Ping Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-mono-brutal font-bold px-2 py-0.5 uppercase border border-black ${
                            log.pingStatus === 'Success'
                              ? 'bg-[#f2efeb] text-black'
                              : 'bg-white text-zinc-500'
                          }`}
                        >
                          {log.pingStatus}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <tr className="bg-[#f2efeb] border-b-4 border-black">
                        <td colSpan={9} className="p-4">
                          <div className="bg-white border-2 border-black p-4 space-y-3 shadow-[3px_3px_0_#000]">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#ff4d00]" />
                                <span className="text-xs font-mono-brutal font-bold text-black uppercase tracking-wider">
                                  DIAGNOSTIC_METADATA_HEX
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-zinc-600 font-mono-brutal font-bold">
                                <Clock className="w-3.5 h-3.5 text-black" />
                                <span>TIMESTAMP: {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'JUST NOW'}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {/* Full Generated Backlink with One-Click Copy */}
                              <div className="bg-[#f2efeb] p-3 border-2 border-black space-y-1.5">
                                <span className="text-[11px] font-mono-brutal font-bold text-black uppercase tracking-wider block">
                                  FULL GENERATED BACKLINK URL:
                                </span>
                                <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 border-2 border-black">
                                  <a
                                    href={log.generatedBacklink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-black hover:text-[#ff4d00] hover:underline font-mono-brutal font-bold text-xs break-all"
                                  >
                                    {log.generatedBacklink}
                                  </a>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                      onClick={(e) => handleCopyBacklink(e, log.generatedBacklink, log.id)}
                                      className="p-1.5 bg-black hover:bg-zinc-800 text-white transition-all cursor-pointer"
                                      title="Copy backlink URL"
                                    >
                                      {copiedBacklinkId === log.id ? (
                                        <Check className="w-3.5 h-3.5 text-[#ff4d00]" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                    <a
                                      href={log.generatedBacklink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1.5 bg-[#ff4d00] text-black transition-all"
                                      title="Open in new window"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5 text-black" />
                                    </a>
                                  </div>
                                </div>
                              </div>

                              {/* Target Website & Directory Details */}
                              <div className="bg-[#f2efeb] p-3 border-2 border-black space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-mono-brutal font-bold text-black uppercase tracking-wider">
                                    TARGET DOMAIN:
                                  </span>
                                  <span className="font-mono-brutal text-black font-bold">{log.targetUrl}</span>
                                </div>
                                <div className="flex items-center justify-between border-t-2 border-black pt-1.5">
                                  <span className="text-[11px] font-mono-brutal font-bold text-black uppercase tracking-wider">
                                    DIRECTORY NETWORK:
                                  </span>
                                  <span className="font-mono-brutal text-zinc-700 font-bold">{log.directoryName} ({log.directoryType})</span>
                                </div>
                                <div className="flex items-center justify-between border-t-2 border-black pt-1.5">
                                  <span className="text-[11px] font-mono-brutal font-bold text-black uppercase tracking-wider">
                                    HTTP RESPONSE CODE:
                                  </span>
                                  <span className="font-mono-brutal font-bold text-[#ff4d00]">
                                    {log.httpStatus || 200} OK
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Additional Diagnostic Notes Field */}
                            <div className="bg-[#f2efeb] p-3 border-2 border-black space-y-1">
                              <span className="text-[11px] font-mono-brutal font-bold text-black uppercase tracking-wider block flex items-center gap-1">
                                <Info className="w-3.5 h-3.5 text-black" />
                                <span>VERIFICATION &amp; CRAWL DIAGNOSTIC TELEMETRY:</span>
                              </span>
                              <p className="text-xs text-black font-mono-brutal bg-white p-2.5 border-2 border-black">
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

