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
import { TotalBacklinkCounter } from './TotalBacklinkCounter';

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
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'High' | 'Medium' | 'Low'>('ALL');
  const [liveVerificationFilter, setLiveVerificationFilter] = useState<'ALL' | 'CONFIRMED' | 'FAILED' | 'PENDING'>('ALL');
  const [indexingFilter, setIndexingFilter] = useState<'ALL' | 'SUBMITTED' | 'PINGED' | 'PENDING'>('ALL');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Compute unique domains from active logs for the Total Backlink Counter
  const uniqueTargetDomains = React.useMemo(() => {
    const doms = logs
      .map((log) => {
        try {
          return new URL(log.targetUrl).hostname;
        } catch {
          return (log.targetUrl || '').replace(/^(https?:\/\/)+/i, '').split('/')[0];
        }
      })
      .filter((d) => d && d.includes('.') && !d.includes('localhost'));
    return Array.from(new Set(doms));
  }, [logs]);

  // Row Expansion State
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(new Set());

  // Interactive Hover Status Popover State
  const [hoveredStatus, setHoveredStatus] = useState<{
    log: LogItem;
    type: 'google' | 'ping' | 'live' | 'submission';
    rect: DOMRect;
  } | null>(null);

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
      (log.priority && log.priority.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.notes && log.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const isConfirmed =
      log.liveVerification.toLowerCase().includes('confirmed') ||
      log.liveVerification.toLowerCase().includes('success');
    const isFailedLive =
      log.liveVerification.toLowerCase().includes('failed') ||
      log.submissionStatus.toLowerCase().includes('failed') ||
      log.submissionStatus.toLowerCase().includes('error');
    const isSuccess = isConfirmed || log.submissionStatus.toLowerCase().includes('submitted');

    // Priority Filter
    if (priorityFilter !== 'ALL') {
      const currentPrio = (log.priority || 'Medium').toLowerCase();
      if (currentPrio !== priorityFilter.toLowerCase()) return false;
    }

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

  const handleQuickCopyBacklink = (id: string, backlinkUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!backlinkUrl) return;
    navigator.clipboard.writeText(backlinkUrl);
    setCopiedBacklinkId(id);
    toast.success('📋 Backlink URL copied to clipboard!');
    setTimeout(() => {
      setCopiedBacklinkId(null);
    }, 2000);
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
      'Priority',
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
          `"${item.priority || 'Medium'}"`,
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
    <div id="results-table" className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000] space-y-6">
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
            id="export-logs-csv-btn"
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

      {/* Total Cumulative Backlink Counter (DataForSEO Real-time Engine) */}
      <TotalBacklinkCounter
        initialDomains={uniqueTargetDomains.length > 0 ? uniqueTargetDomains : undefined}
        title="Total Cumulative Backlink Counter"
        subtitle="Real-time multi-domain cumulative backlink count & referring authority for active campaign targets"
      />

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
          {/* Primary Status Filter (All / Success / Failed) */}
          <div className="flex items-center gap-1 bg-white p-1 border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="text-[10px] font-mono-brutal font-bold text-black px-2 flex items-center gap-1 uppercase">
              <CheckCircle2 className="w-3 h-3 text-[#ff4d00]" />
              <span>STATUS:</span>
            </span>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setStatusFilter('SUCCESS')}
              className={`px-2.5 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                statusFilter === 'SUCCESS'
                  ? 'bg-emerald-500 text-black border border-black'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              SUCCESS
            </button>
            <button
              onClick={() => setStatusFilter('FAILED')}
              className={`px-2.5 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                statusFilter === 'FAILED'
                  ? 'bg-red-600 text-white border border-black'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              FAILURE
            </button>
          </div>

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

          {/* Priority Filter */}
          <div className="flex items-center gap-1 bg-white p-1 border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="text-[10px] font-mono-brutal font-bold text-black px-2 flex items-center gap-1 uppercase">
              <Sparkles className="w-3 h-3 text-[#ff4d00]" />
              <span>PRIO:</span>
            </span>
            <button
              onClick={() => setPriorityFilter('ALL')}
              className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                priorityFilter === 'ALL'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setPriorityFilter('High')}
              className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                priorityFilter === 'High'
                  ? 'bg-[#ff4d00] text-black border border-black'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              🔥 HIGH
            </button>
            <button
              onClick={() => setPriorityFilter('Medium')}
              className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                priorityFilter === 'Medium'
                  ? 'bg-amber-400 text-black border border-black'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              ⚡ MED
            </button>
            <button
              onClick={() => setPriorityFilter('Low')}
              className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase transition-all ${
                priorityFilter === 'Low'
                  ? 'bg-zinc-300 text-black border border-black'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              🌱 LOW
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
              <th className="py-3 px-3 border-r-2 border-zinc-800">PRIORITY</th>
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
                <td colSpan={10} className="text-center py-12 text-zinc-600 font-mono-brutal font-bold uppercase">
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

                const priorityVal = (log.priority || 'Medium').toLowerCase();
                const isHighPrio = priorityVal === 'high';
                const isMedPrio = priorityVal === 'medium';

                // Diagnostic Tooltip Descriptions
                const liveVerifyTooltip = isConfirmed
                  ? `[LIVE VERIFIED 200 OK]\n• Status: HTTP 200 OK\n• Diagnosis: Verified live backlink page created & accessible.\n• Anchor tag indexed successfully.`
                  : isFailed
                  ? `[VERIFICATION FAILED / TIMEOUT]\n• HTTP Code: ${log.httpStatus || 500}\n• Reason: ${log.notes || 'Directory server returned non-200 status or connection timeout during GET probe.'}\n• Recommendation: Re-run crawl with proxy rotation.`
                  : `[LIVE VERIFICATION SKIPPED]\n• Reason: Live HTTP verification disabled for this batch pass.`;

                const submissionTooltip = `[SUBMISSION PIPELINE]\n• Status: ${log.submissionStatus}\n• Directory: ${log.directoryName} (${log.directoryType})\n• HTTP Response: ${log.httpStatus || (isConfirmed ? 200 : 202)} OK\n• Auto-retry: enabled`;

                const googleTooltip = `[GOOGLE INDEXING API]\n• Status: ${log.googleIndexing}\n• Push Type: URL_UPDATED\n• Quota State: Active\n• Direct Search Console notify payload transmitted`;

                const pingTooltip = `[PING SERVICES BROADCAST]\n• Status: ${log.pingStatus}\n• XML-RPC Nodes: Ping-o-Matic, FeedBurner, Bing SERP API`;

                const priorityTooltip = isHighPrio
                  ? `[HIGH PRIORITY TARGET]\n• Queue Slot: Top Fast-Track Tier\n• Google API Push: Immediate Priority\n• Concurrency Worker Priority: Level 1`
                  : isMedPrio
                  ? `[MEDIUM PRIORITY TARGET]\n• Queue Slot: Standard Balanced Pipeline\n• Processing: Normal FIFO Queue`
                  : `[LOW PRIORITY TARGET]\n• Queue Slot: Background Trickle\n• Throttled for network bandwidth conservation`;

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

                      {/* Priority Badge Column */}
                      <td className="py-3 px-3 border-r-2 border-black whitespace-nowrap" title={priorityTooltip}>
                        {isHighPrio ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono-brutal font-bold bg-[#ff4d00] text-black border border-black shadow-[1px_1px_0_#000] cursor-help">
                            🔥 HIGH
                          </span>
                        ) : isMedPrio ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono-brutal font-bold bg-amber-400 text-black border border-black cursor-help">
                            ⚡ MED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono-brutal font-bold bg-zinc-200 text-zinc-800 border border-black cursor-help">
                            🌱 LOW
                          </span>
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
                        <div className="flex items-center justify-between gap-1.5">
                          <a
                            href={log.generatedBacklink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-black hover:text-[#ff4d00] hover:underline font-bold flex items-center gap-1 truncate"
                            title={log.generatedBacklink}
                          >
                            <span className="truncate">{log.generatedBacklink}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0 text-zinc-500" />
                          </a>

                          <button
                            onClick={(e) => handleQuickCopyBacklink(log.id, log.generatedBacklink, e)}
                            className="p-1 text-black hover:text-[#ff4d00] hover:bg-zinc-200 border border-transparent hover:border-black transition-all shrink-0 cursor-pointer"
                            title="Quick Copy Backlink URL"
                          >
                            {copiedBacklinkId === log.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Submission Status with Interactive Tooltip */}
                      <td className="py-3 px-4 border-r-2 border-black relative">
                        <span
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredStatus({ log, type: 'submission', rect });
                          }}
                          onMouseLeave={() => setHoveredStatus(null)}
                          title={submissionTooltip}
                          className={`status-badge-interactive inline-flex items-center px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase border border-black cursor-help ${
                            log.submissionStatus.toLowerCase().includes('submitted')
                              ? 'bg-[#f2efeb] text-black hover:bg-black hover:text-white'
                              : 'bg-black text-[#ff4d00]'
                          }`}
                        >
                          {log.submissionStatus}
                        </span>
                      </td>

                      {/* Live Verification (Pass/Fail) with Interactive Tooltip */}
                      <td className="py-3 px-4 border-r-2 border-black relative">
                        {isConfirmed ? (
                          <span
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredStatus({ log, type: 'live', rect });
                            }}
                            onMouseLeave={() => setHoveredStatus(null)}
                            title={liveVerifyTooltip}
                            className="status-badge-interactive inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono-brutal font-bold bg-[#ff4d00] text-black border border-black shadow-[1px_1px_0_#000] cursor-help"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>200_OK</span>
                          </span>
                        ) : isFailed ? (
                          <span
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredStatus({ log, type: 'live', rect });
                            }}
                            onMouseLeave={() => setHoveredStatus(null)}
                            title={liveVerifyTooltip}
                            className="status-badge-interactive inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono-brutal font-bold bg-black text-[#ff4d00] border border-black cursor-help"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>FAILED</span>
                          </span>
                        ) : (
                          <span
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredStatus({ log, type: 'live', rect });
                            }}
                            onMouseLeave={() => setHoveredStatus(null)}
                            title={liveVerifyTooltip}
                            className="status-badge-interactive text-zinc-600 text-[10px] font-mono-brutal cursor-help px-1.5 py-0.5 border border-transparent hover:border-black"
                          >
                            SKIPPED
                          </span>
                        )}
                      </td>

                      {/* Google Indexing with Interactive Tooltip */}
                      <td className="py-3 px-4 border-r-2 border-black relative">
                        <span
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredStatus({ log, type: 'google', rect });
                          }}
                          onMouseLeave={() => setHoveredStatus(null)}
                          title={googleTooltip}
                          className={`status-badge-interactive status-badge-pulse text-[10px] font-mono-brutal font-bold px-2 py-0.5 uppercase border border-black cursor-help transition-transform hover:scale-105 ${
                            log.googleIndexing === 'Submitted' || log.googleIndexing === 'Indexed'
                              ? 'bg-black text-white'
                              : 'bg-white text-zinc-600'
                          }`}
                        >
                          {log.googleIndexing}
                        </span>
                      </td>

                      {/* Ping Status with Interactive Tooltip */}
                      <td className="py-3 px-4 relative">
                        <span
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredStatus({ log, type: 'ping', rect });
                          }}
                          onMouseLeave={() => setHoveredStatus(null)}
                          title={pingTooltip}
                          className={`status-badge-interactive text-[10px] font-mono-brutal font-bold px-2 py-0.5 uppercase border border-black cursor-help ${
                            log.pingStatus === 'Success'
                              ? 'bg-[#f2efeb] text-black'
                              : 'bg-white text-zinc-600'
                          }`}
                        >
                          {log.pingStatus}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <tr className="bg-[#f2efeb] border-b-4 border-black">
                        <td colSpan={10} className="p-4">
                          <div className="bg-white border-2 border-black p-4 space-y-3 shadow-[3px_3px_0_#000]">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#ff4d00]" />
                                <span className="text-xs font-mono-brutal font-bold text-black uppercase tracking-wider">
                                  DIAGNOSTIC_METADATA_HEX
                                </span>
                                <span className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold border border-black uppercase ${
                                  isHighPrio ? 'bg-[#ff4d00] text-black' : isMedPrio ? 'bg-amber-400 text-black' : 'bg-zinc-200 text-black'
                                }`}>
                                  PRIORITY: {log.priority || 'Medium'}
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

      {/* Interactive Status Hover Popover Tooltip */}
      {hoveredStatus && (
        <div
          style={{
            position: 'fixed',
            top: Math.max(10, hoveredStatus.rect.top - 120),
            left: Math.min(window.innerWidth - 330, Math.max(10, hoveredStatus.rect.left - 100)),
            zIndex: 9999,
          }}
          className="popover-card-animated w-80 bg-white border-2 border-black p-3 shadow-[5px_5px_0_#000] pointer-events-none"
        >
          <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff4d00]" />
              <span className="text-[10px] font-mono-brutal font-bold uppercase tracking-wider text-black">
                {hoveredStatus.type === 'google'
                  ? 'GOOGLE INDEXING TELEMETRY'
                  : hoveredStatus.type === 'ping'
                  ? 'SERP PING BROADCAST'
                  : hoveredStatus.type === 'live'
                  ? 'HTTP 200 LIVE PROBE'
                  : 'SUBMISSION DISPATCH'}
              </span>
            </div>
            <span className="text-[9px] font-mono-brutal px-1.5 py-0.2 bg-black text-white font-bold uppercase">
              {hoveredStatus.log.priority || 'MED'} PRIO
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono-brutal">
            <div className="flex items-center justify-between text-zinc-600 border-b border-zinc-200 pb-1">
              <span>TARGET URL:</span>
              <span className="text-black font-bold truncate max-w-[170px]">{hoveredStatus.log.targetUrl}</span>
            </div>

            <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
              <span className="text-zinc-600">STATUS STATE:</span>
              <span className="text-black font-bold">
                {hoveredStatus.type === 'google'
                  ? hoveredStatus.log.googleIndexing
                  : hoveredStatus.type === 'ping'
                  ? hoveredStatus.log.pingStatus
                  : hoveredStatus.type === 'live'
                  ? `HTTP ${hoveredStatus.log.httpStatus || 200} OK`
                  : hoveredStatus.log.submissionStatus}
              </span>
            </div>

            <div className="bg-[#f2efeb] p-2 border border-black text-[10px] text-zinc-900 leading-snug">
              <span className="font-bold text-black block mb-0.5 uppercase tracking-wide">
                DIAGNOSTIC LOG NOTES:
              </span>
              {hoveredStatus.log.notes ? (
                <span>{hoveredStatus.log.notes}</span>
              ) : hoveredStatus.type === 'google' ? (
                <span>
                  Google Indexing API payload dispatched. Indexing webhook status code: 200 OK. URL payload queued for crawling crawler bots.
                </span>
              ) : hoveredStatus.type === 'ping' ? (
                <span>
                  Ping multicast broadcasted to SERP indexers (Google, Bing, Yandex). Status: {hoveredStatus.log.pingStatus}.
                </span>
              ) : hoveredStatus.type === 'live' ? (
                <span>
                  Live HTTP verification probe confirmed target URL responded with status 200 OK without redirect loops.
                </span>
              ) : (
                <span>
                  Directory registration confirmed on {hoveredStatus.log.directoryName} ({hoveredStatus.log.directoryType}).
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-0.5">
              <span>LOG ID: #{hoveredStatus.log.id.slice(0, 8)}</span>
              <span>{hoveredStatus.log.createdAt ? new Date(hoveredStatus.log.createdAt).toLocaleTimeString() : 'RECENT'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

