import React from 'react';
import { X, History, FileSpreadsheet, CheckCircle2, Clock, Play } from 'lucide-react';
import { SubmissionRecord } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SubmissionRecord[];
  onSelectSubmission: (submissionId: string) => void;
  onExportCsv: (submissionId: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectSubmission,
  onExportCsv,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/80 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full flex flex-col shadow-2xl p-6">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-zinc-100">Submission History Logs</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              No historical submission records found in SQLite database.
            </div>
          ) : (
            history.map((record) => (
              <div
                key={record.id}
                className="bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono text-indigo-400 font-semibold">
                    ID: {record.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      record.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>

                <div className="text-xs text-zinc-100 font-semibold truncate mb-2" title={record.target_url}>
                  {record.target_url}
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-zinc-400 bg-zinc-900/80 p-2 rounded-lg mb-3 border border-zinc-800/50">
                  <div>
                    <span className="block text-[9px] uppercase text-zinc-500">Total Tasks</span>
                    <strong className="text-zinc-200">{record.total_directories}</strong>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase text-zinc-500">Confirmed</span>
                    <strong className="text-emerald-400">{record.confirmed_count}</strong>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase text-zinc-500">Indexed</span>
                    <strong className="text-cyan-400">{record.indexed_count}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(record.created_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectSubmission(record.id);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold rounded-lg border border-zinc-700/80 transition-colors"
                    >
                      View Logs
                    </button>
                    <button
                      onClick={() => onExportCsv(record.id)}
                      className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <FileSpreadsheet className="w-3 h-3" />
                      <span>CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
