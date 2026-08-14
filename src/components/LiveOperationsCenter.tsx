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
} from 'lucide-react';
import { LogItem, SubmissionHistoryItem } from '../types';
import toast from 'react-hot-toast';

interface LiveOperationsCenterProps {
  logs: LogItem[];
  jobStatus: string;
  activeSubmissionId: string | null;
  history: SubmissionHistoryItem[];
  onSelectSubmission: (id: string) => void;
  onExportCsv: (submissionId?: string) => void;
}

export const LiveOperationsCenter: React.FC<LiveOperationsCenterProps> = ({
  logs,
  jobStatus,
  activeSubmissionId,
  history,
  onSelectSubmission,
  onExportCsv,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CONFIRMED' | 'SUBMITTED' | 'FAILED'>('ALL');
  const [autoScroll, setAutoScroll] = useState(true);

  const filteredLogs = logs.filter((log) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'CONFIRMED') return log.liveVerification?.includes('Confirmed');
    if (filterStatus === 'SUBMITTED') return log.googleIndexing === 'Submitted' || log.pingStatus === 'Success';
    if (filterStatus === 'FAILED') return log.submissionStatus === 'Failed' || log.httpStatus >= 400;
    return true;
  });

  const confirmedCount = logs.filter((l) => l.liveVerification?.includes('Confirmed')).length;
  const submittedCount = logs.filter((l) => l.googleIndexing === 'Submitted' || l.pingStatus === 'Success').length;
  const failedCount = logs.filter((l) => l.submissionStatus === 'Failed' || (l.httpStatus && l.httpStatus >= 400)).length;

  return (
    <div className="space-y-6 font-mono-brutal">
      {/* Telemetry Header Card */}
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#222] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-black text-[#ff4d00] dark:bg-zinc-800 dark:text-cyan-400 border-2 border-black dark:border-zinc-600 rounded-xl flex items-center justify-center font-display font-black text-2xl shadow-[3px_3px_0_#000]">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black uppercase text-black dark:text-zinc-100">
                Live Operations &amp; Verification Stream
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  jobStatus === 'Processing'
                    ? 'bg-[#ff4d00] text-black border border-black animate-pulse'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {jobStatus === 'Processing' ? 'STREAM ACTIVE' : 'STREAM STANDBY'}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-sans">
              Real-time WebSocket event ingestion, HTTP probe verification, and proxy rotate response monitoring.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onExportCsv(activeSubmissionId || undefined)}
            className="px-3 py-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-600 rounded-lg text-xs font-bold uppercase shadow-[2px_2px_0_#000] flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Stream</span>
          </button>
        </div>
      </div>

      {/* Real-time KPI Stats row */}
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
          <div className="text-[10px] font-bold text-zinc-500 uppercase">Push API Broadcasts</div>
          <div className="text-xl font-black text-[#ff4d00] mt-1">{submittedCount}</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-4 rounded-xl shadow-[3px_3px_0_#000]">
          <div className="text-[10px] font-bold text-zinc-500 uppercase">Bypassed / Retried</div>
          <div className="text-xl font-black text-zinc-700 dark:text-zinc-400 mt-1">{failedCount}</div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 rounded-2xl shadow-[4px_4px_0_#000] overflow-hidden">
        <div className="p-4 bg-zinc-100 dark:bg-zinc-950 border-b-2 border-black dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#ff4d00]" />
            <span className="text-xs font-bold uppercase text-black dark:text-zinc-200">Filter Event Feed:</span>
            {['ALL', 'CONFIRMED', 'SUBMITTED', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st as any)}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer border ${
                  filterStatus === st
                    ? 'bg-black text-white dark:bg-zinc-800 dark:text-cyan-400 border-black'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="text-xs text-zinc-500 font-bold">
            Showing {filteredLogs.length} of {logs.length} events
          </div>
        </div>

        {/* Stream Table */}
        <div className="overflow-x-auto max-h-[500px]">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-mono-brutal space-y-2">
              <Terminal className="w-8 h-8 mx-auto text-zinc-400" />
              <div className="text-xs font-bold uppercase">No Live Stream Events Yet</div>
              <p className="text-[11px] font-sans text-zinc-400 max-w-sm mx-auto">
                Launch a submission campaign from the URL Input form or Indexing Wizard to watch real-time verification logs.
              </p>
            </div>
          ) : (
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-zinc-50 dark:bg-zinc-950 border-b-2 border-black dark:border-zinc-700 sticky top-0 z-10">
                <tr>
                  <th className="p-3 font-bold uppercase">Target URL</th>
                  <th className="p-3 font-bold uppercase">Directory / Gateway</th>
                  <th className="p-3 font-bold uppercase">HTTP Status</th>
                  <th className="p-3 font-bold uppercase">Live Verification</th>
                  <th className="p-3 font-bold uppercase">Google Push</th>
                  <th className="p-3 font-bold uppercase">Generated Anchor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40">
                    <td className="p-3 font-bold text-black dark:text-zinc-200 max-w-[200px] truncate">
                      {log.targetUrl}
                    </td>
                    <td className="p-3 text-zinc-700 dark:text-zinc-300">
                      <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold border border-zinc-300 dark:border-zinc-700">
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
                      {log.liveVerification?.includes('Confirmed') ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>CONFIRMED</span>
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>PROBING...</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 bg-black text-[#ff4d00] rounded text-[10px] font-bold">
                        {log.googleIndexing || 'SYNCED'}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-500 max-w-[180px] truncate">
                      {log.generatedBacklink || 'Auto-generated context anchor'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
