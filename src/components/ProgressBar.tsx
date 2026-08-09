import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ShieldCheck, Activity, Send, Clock, Layers, Bot, Target, StopCircle, Sparkles } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  completedTasks: number;
  totalTasks: number;
  confirmedCount: number;
  indexedCount: number;
  status: 'Processing' | 'Completed' | 'Cancelled' | 'Idle';
  isAutonomousActive?: boolean;
  autonomousAccumulatedCount?: number;
  autonomousTargetGoal?: number;
  autonomousMetric?: 'tasks' | 'confirmed';
  autonomousBatchCount?: number;
  onStopAutonomous?: () => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  completedTasks,
  totalTasks,
  confirmedCount,
  indexedCount,
  status,
  isAutonomousActive = false,
  autonomousAccumulatedCount = 0,
  autonomousTargetGoal = 100,
  autonomousMetric = 'tasks',
  autonomousBatchCount = 1,
  onStopAutonomous,
}) => {
  const [isConfirmedFlashing, setIsConfirmedFlashing] = useState(false);
  const [isIndexedFlashing, setIsIndexedFlashing] = useState(false);
  const [isTasksFlashing, setIsTasksFlashing] = useState(false);
  const [isProgressUpdating, setIsProgressUpdating] = useState(false);

  const prevConfirmedRef = useRef(confirmedCount);
  const prevIndexedRef = useRef(indexedCount);
  const prevTasksRef = useRef(completedTasks);
  const prevProgressRef = useRef(progress);

  // Trigger subtle flash/pop animations when live verified counters increment
  useEffect(() => {
    if (confirmedCount > prevConfirmedRef.current) {
      setIsConfirmedFlashing(true);
      const timer = setTimeout(() => setIsConfirmedFlashing(false), 800);
      prevConfirmedRef.current = confirmedCount;
      return () => clearTimeout(timer);
    }
    prevConfirmedRef.current = confirmedCount;
  }, [confirmedCount]);

  useEffect(() => {
    if (indexedCount > prevIndexedRef.current) {
      setIsIndexedFlashing(true);
      const timer = setTimeout(() => setIsIndexedFlashing(false), 800);
      prevIndexedRef.current = indexedCount;
      return () => clearTimeout(timer);
    }
    prevIndexedRef.current = indexedCount;
  }, [indexedCount]);

  useEffect(() => {
    if (completedTasks > prevTasksRef.current) {
      setIsTasksFlashing(true);
      const timer = setTimeout(() => setIsTasksFlashing(false), 800);
      prevTasksRef.current = completedTasks;
      return () => clearTimeout(timer);
    }
    prevTasksRef.current = completedTasks;
  }, [completedTasks]);

  useEffect(() => {
    if (progress > prevProgressRef.current) {
      setIsProgressUpdating(true);
      const timer = setTimeout(() => setIsProgressUpdating(false), 800);
      prevProgressRef.current = progress;
      return () => clearTimeout(timer);
    }
    prevProgressRef.current = progress;
  }, [progress]);

  if (status === 'Idle' && completedTasks === 0 && !isAutonomousActive) return null;

  const autoProgressPct = Math.min(
    100,
    Math.round((autonomousAccumulatedCount / Math.max(1, autonomousTargetGoal)) * 100)
  );

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 mb-8 shadow-2xl space-y-4 relative overflow-hidden transition-all duration-300">
      {/* Subtle background ambient glow when new live tasks are confirmed */}
      <div
        className={`absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          isConfirmedFlashing ? 'opacity-100 scale-125' : 'opacity-20 scale-100'
        }`}
      />

      {/* Autonomous Continuous Loop Milestone Tracker Banner */}
      {isAutonomousActive && (
        <div className="p-4 bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-zinc-950/80 border border-purple-500/40 rounded-xl space-y-3 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-300">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-2">
                  <span>Autonomous Continuous Mode (Pass #{autonomousBatchCount})</span>
                  <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-purple-500/30">
                    Active
                  </span>
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Target Goal: Reaching <strong className="text-purple-300">{autonomousTargetGoal}</strong> {autonomousMetric === 'confirmed' ? 'Live Confirmed Backlinks' : 'Completed Submissions'}.
                </p>
              </div>
            </div>

            {onStopAutonomous && (
              <button
                onClick={onStopAutonomous}
                className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/80 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0"
              >
                <StopCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Disengage Autonomous Mode</span>
              </button>
            )}
          </div>

          {/* Autonomous Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-300 font-bold flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-purple-400" />
                <span>Milestone Progress: {autonomousAccumulatedCount} / {autonomousTargetGoal}</span>
              </span>
              <span className="text-purple-300 font-bold">{autoProgressPct}% Reached</span>
            </div>
            <div className="relative w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-purple-500/30">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-500 rounded-full relative shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                style={{ width: `${autoProgressPct}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-progress-shimmer" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Batch Level Progress Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
              Real-time Batch Pipeline Progress
            </h3>
            <span
              className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md font-mono transition-all duration-300 ${
                status === 'Processing'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                  : status === 'Completed'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {status}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Executing multi-site backlink generation, live confirmation HTTP check &amp; ping indexing.
          </p>
        </div>

        {/* Live Metrics Grid with CSS Animation Feedback */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {/* Batch Tasks Counter */}
          <div
            className={`px-3 py-2 rounded-xl border transition-all duration-300 ${
              isTasksFlashing
                ? 'bg-zinc-900 border-zinc-700 shadow-md scale-105'
                : 'bg-zinc-950/80 border-zinc-800/80'
            }`}
          >
            <span className="block text-[10px] uppercase font-semibold text-zinc-400">Batch Tasks</span>
            <span
              className={`text-sm font-bold text-zinc-100 font-mono inline-block transition-transform ${
                isTasksFlashing ? 'animate-count-pop text-cyan-300' : ''
              }`}
            >
              {completedTasks} / {totalTasks}
            </span>
          </div>

          {/* Live Confirmed Counter - Enhanced with Glow & Pop */}
          <div
            className={`px-3 py-2 rounded-xl border transition-all duration-500 relative overflow-hidden ${
              isConfirmedFlashing
                ? 'bg-emerald-950/80 border-emerald-500/80 shadow-lg shadow-emerald-500/30 scale-105 animate-live-glow'
                : confirmedCount > 0
                ? 'bg-emerald-950/30 border-emerald-500/30'
                : 'bg-zinc-950/80 border-zinc-800/80'
            }`}
          >
            {/* Live Verified Ping Indicator */}
            {isConfirmedFlashing && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}

            <span className="block text-[10px] uppercase font-semibold text-zinc-400 flex items-center justify-center gap-1">
              <span>Live Confirmed</span>
              {isConfirmedFlashing && <Sparkles className="w-2.5 h-2.5 text-emerald-300 animate-spin" />}
            </span>
            <span
              className={`text-sm font-bold font-mono flex items-center justify-center gap-1 transition-all ${
                isConfirmedFlashing
                  ? 'text-emerald-300 animate-count-pop scale-110 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : 'text-emerald-400'
              }`}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 transition-transform ${
                  isConfirmedFlashing ? 'scale-125 text-emerald-300' : ''
                }`}
              />
              <span>{confirmedCount}</span>
            </span>
          </div>

          {/* Indexed / Pinged Counter */}
          <div
            className={`px-3 py-2 rounded-xl border transition-all duration-300 ${
              isIndexedFlashing
                ? 'bg-cyan-950/80 border-cyan-500/80 shadow-md shadow-cyan-500/20 scale-105'
                : 'bg-zinc-950/80 border-zinc-800/80'
            }`}
          >
            <span className="block text-[10px] uppercase font-semibold text-zinc-400">Indexed / Pinged</span>
            <span
              className={`text-sm font-bold font-mono flex items-center justify-center gap-1 transition-all ${
                isIndexedFlashing
                  ? 'text-cyan-200 animate-count-pop scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                  : 'text-cyan-400'
              }`}
            >
              <Send
                className={`w-3.5 h-3.5 transition-transform ${
                  isIndexedFlashing ? 'scale-125 text-cyan-200' : ''
                }`}
              />
              <span>{indexedCount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container with Glowing Edge & Shimmer overlay */}
      <div className="relative w-full bg-zinc-950 h-3.5 rounded-full overflow-hidden border border-zinc-800/80 shadow-inner">
        <div
          className={`h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full relative ${
            isConfirmedFlashing
              ? 'shadow-[0_0_16px_rgba(52,211,153,0.9)]'
              : 'shadow-[0_0_8px_rgba(6,182,212,0.4)]'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          {/* Animated Light Sweep Shimmer overlay when processing or updating */}
          {(status === 'Processing' || isProgressUpdating || isConfirmedFlashing) && (
            <div className="absolute inset-0 bg-white/30 animate-progress-shimmer" />
          )}

          {/* Leading edge highlight bulb */}
          <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/70 rounded-r-full blur-[1px] shadow-[0_0_6px_#ffffff]" />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 font-mono">
        <span className="flex items-center gap-1.5">
          <span>Batch Completion:</span>
          <strong className={`transition-colors ${isProgressUpdating ? 'text-cyan-300' : 'text-zinc-200'}`}>
            {progress}%
          </strong>
        </span>
        <span className="flex items-center gap-1">
          {isConfirmedFlashing && (
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40 animate-pulse">
              +1 Verified Live!
            </span>
          )}
          <span>{totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% Finished` : '0%'}</span>
        </span>
      </div>
    </div>
  );
};

