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
  autonomousTargetGoal = 100000,
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
    <div className="bg-white border-4 border-black p-6 mb-8 shadow-[6px_6px_0_#000] space-y-5 transition-all duration-300">
      {/* Autonomous Continuous Loop Milestone Tracker Banner */}
      {isAutonomousActive && (
        <div className="p-4 bg-[#f2efeb] border-4 border-black space-y-3 shadow-[4px_4px_0_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-black text-[#ff4d00]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono-brutal font-bold text-black uppercase tracking-wider flex items-center gap-2">
                  <span>AUTONOMOUS MODE [PASS #{autonomousBatchCount}]</span>
                  <span className="bg-[#ff4d00] text-black text-[10px] px-2 py-0.5 font-bold uppercase">
                    ACTIVE
                  </span>
                </h4>
                <p className="text-[11px] font-mono-brutal text-zinc-700">
                  GOAL: <strong className="text-black">{autonomousTargetGoal}</strong> {autonomousMetric === 'confirmed' ? 'LIVE CONFIRMED' : 'TOTAL SUBMISSIONS'}
                </p>
              </div>
            </div>

            {onStopAutonomous && (
              <button
                onClick={onStopAutonomous}
                className="px-3 py-1.5 bg-black text-[#ff4d00] border-2 border-black font-mono-brutal text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 shadow-[2px_2px_0_#000]"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>DISENGAGE</span>
              </button>
            )}
          </div>

          {/* Autonomous Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono-brutal font-bold text-black">
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-[#ff4d00]" />
                <span>MILESTONE: {autonomousAccumulatedCount} / {autonomousTargetGoal}</span>
              </span>
              <span>{autoProgressPct}% REACHED</span>
            </div>
            <div className="relative w-full bg-white h-4 border-2 border-black">
              <div
                className="h-full bg-[#ff4d00] border-r-2 border-black transition-all duration-300"
                style={{ width: `${autoProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Batch Level Progress Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#ff4d00]" />
            <h3 className="font-display text-xl sm:text-2xl font-bold text-black uppercase tracking-tight">
              REAL-TIME BATCH PIPELINE PROGRESS
            </h3>
            <span
              className={`text-xs font-mono-brutal font-bold uppercase px-2.5 py-0.5 border-2 border-black ${
                status === 'Processing'
                  ? 'bg-[#ff4d00] text-black shadow-[2px_2px_0_#000]'
                  : status === 'Completed'
                  ? 'bg-black text-white shadow-[2px_2px_0_#ff4d00]'
                  : 'bg-zinc-200 text-black shadow-[2px_2px_0_#000]'
              }`}
            >
              [{status}]
            </span>
          </div>
          <p className="text-xs font-mono-brutal text-zinc-700 mt-1">
            // EXECUTING MULTI-SITE BACKLINK INGESTION, LIVE 200 OK AUDIT &amp; SERP PINGS
          </p>
        </div>

        {/* Live Metrics Grid with Brutalist Feedback */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {/* Batch Tasks Counter */}
          <div className="px-3 py-2 bg-[#f2efeb] border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="block text-[10px] font-mono-brutal font-bold uppercase text-zinc-700">BATCH TASKS</span>
            <span className="text-sm font-mono-brutal font-bold text-black inline-block">
              {completedTasks} / {totalTasks}
            </span>
          </div>

          {/* Live Confirmed Counter */}
          <div className="px-3 py-2 bg-[#f2efeb] border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="block text-[10px] font-mono-brutal font-bold uppercase text-zinc-700 flex items-center justify-center gap-1">
              <span>LIVE 200 OK</span>
              {isConfirmedFlashing && <Sparkles className="w-2.5 h-2.5 text-[#ff4d00]" />}
            </span>
            <span className="text-sm font-mono-brutal font-bold text-[#ff4d00] flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ff4d00]" />
              <span>{confirmedCount}</span>
            </span>
          </div>

          {/* Indexed / Pinged Counter */}
          <div className="px-3 py-2 bg-[#f2efeb] border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="block text-[10px] font-mono-brutal font-bold uppercase text-zinc-700">INDEXED / PING</span>
            <span className="text-sm font-mono-brutal font-bold text-black flex items-center justify-center gap-1">
              <Send className="w-3.5 h-3.5 text-black" />
              <span>{indexedCount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container with Brutalist Hard Outline */}
      <div className="relative w-full bg-[#f2efeb] h-5 border-4 border-black shadow-[3px_3px_0_#000]">
        <div
          className="h-full bg-[#ff4d00] border-r-2 border-black transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs font-mono-brutal font-bold text-black">
        <span className="flex items-center gap-1.5">
          <span>BATCH STATUS:</span>
          <strong className="text-[#ff4d00]">
            {progress}% COMPLETE
          </strong>
        </span>
        <span className="flex items-center gap-1">
          {isConfirmedFlashing && (
            <span className="text-[10px] bg-black text-[#ff4d00] px-1.5 py-0.5 font-bold border border-black">
              +1 VERIFIED!
            </span>
          )}
          <span>{totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% FINISHED` : '0%'}</span>
        </span>
      </div>
    </div>
  );
};

