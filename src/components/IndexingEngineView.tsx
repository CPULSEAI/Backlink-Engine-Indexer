import React from 'react';
import {
  Send,
  Zap,
  Radio,
  FileSpreadsheet,
  Globe,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { UrlInputForm } from './UrlInputForm';
import { ProgressBar } from './ProgressBar';
import { ResultsTable } from './ResultsTable';
import { DirectoryItem, LogItem, SubmissionHistoryItem } from '../types';

interface IndexingEngineViewProps {
  directories: DirectoryItem[];
  jobStatus: string;
  isAutonomousActive: boolean;
  autonomousAccumulatedCount: number;
  autonomousTargetGoal: number;
  autonomousBatchCount: number;
  onStartJob: (config: any) => Promise<void>;
  onCancelJob: () => Promise<void>;
  onStopAutonomous: () => void;
  progressPercent: number;
  completedTasks: number;
  totalTasks: number;
  confirmedCount: number;
  indexedCount: number;
  autonomousMetric: string;
  logs: LogItem[];
  activeSubmissionId: string | null;
  history: SubmissionHistoryItem[];
  onExportCsv: (submissionId?: string) => void;
  onOpenWizard: () => void;
}

export const IndexingEngineView: React.FC<IndexingEngineViewProps> = ({
  directories,
  jobStatus,
  isAutonomousActive,
  autonomousAccumulatedCount,
  autonomousTargetGoal,
  autonomousBatchCount,
  onStartJob,
  onCancelJob,
  onStopAutonomous,
  progressPercent,
  completedTasks,
  totalTasks,
  confirmedCount,
  indexedCount,
  autonomousMetric,
  logs,
  activeSubmissionId,
  history,
  onExportCsv,
  onOpenWizard,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner with Wizard Trigger */}
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#222] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono-brutal">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-black text-[#ff4d00] dark:bg-zinc-800 dark:text-cyan-400 border-2 border-black dark:border-zinc-600 rounded-xl flex items-center justify-center font-display font-black text-2xl shadow-[3px_3px_0_#000]">
            <Send className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black uppercase text-black dark:text-zinc-100">
                URL Submission &amp; Indexing Engine
              </h2>
              <span className="px-2 py-0.5 bg-[#ff4d00] text-black font-extrabold text-[10px] uppercase rounded">
                MULTI-PING / JSON-RPC ACTIVE
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-sans">
              Deploy high-volume URL batches to Google Indexing API, IndexNow, and 55+ verified directory networks.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenWizard}
          className="px-4 py-2.5 bg-[#ff4d00] hover:bg-black text-black hover:text-white font-black uppercase text-xs rounded-lg border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch 5-Step Campaign Wizard</span>
        </button>
      </div>

      {/* Input Form Module */}
      <UrlInputForm
        directories={directories}
        isProcessing={jobStatus === 'Processing'}
        isAutonomousActive={isAutonomousActive}
        autonomousAccumulatedCount={autonomousAccumulatedCount}
        autonomousTargetGoal={autonomousTargetGoal}
        autonomousBatchCount={autonomousBatchCount}
        onStartJob={onStartJob}
        onCancelJob={onCancelJob}
        onStopAutonomous={onStopAutonomous}
      />

      {/* Live Progress Bar */}
      <ProgressBar
        progress={progressPercent}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
        confirmedCount={confirmedCount}
        indexedCount={indexedCount}
        status={(jobStatus === 'Processing' || jobStatus === 'Completed' || jobStatus === 'Cancelled') ? jobStatus : 'Idle'}
        isAutonomousActive={isAutonomousActive}
        autonomousAccumulatedCount={autonomousAccumulatedCount}
        autonomousTargetGoal={autonomousTargetGoal}
        autonomousMetric={autonomousMetric === 'confirmed' ? 'confirmed' : 'tasks'}
        autonomousBatchCount={autonomousBatchCount}
        onStopAutonomous={onStopAutonomous}
      />

      {/* Real-time Stream Results Table */}
      <ResultsTable
        logs={logs}
        activeSubmissionId={activeSubmissionId}
        onExportCsv={() => onExportCsv()}
        history={history}
      />
    </div>
  );
};
