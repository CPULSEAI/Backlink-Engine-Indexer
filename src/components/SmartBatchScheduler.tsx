import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Play,
  Pause,
  Trash2,
  Zap,
  Plus,
  RotateCw,
  Sparkles,
  Layers,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Globe,
  Sliders,
  ChevronRight,
  TrendingUp,
  Info,
  Timer,
  X,
  FileText,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

import { BillingInfo } from '../types';

export interface ScheduledJob {
  id: string;
  name: string;
  target_urls: string[];
  schedule_type: 'ONCE' | 'INTERVAL' | 'DAILY';
  scheduled_at: string;
  interval_minutes: number;
  batch_size: number;
  status: 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  total_batches: number;
  completed_batches: number;
  created_at: string;
  last_run_at: string | null;
  next_run_at: string;
  config: {
    features: {
      generateBacklinks: boolean;
      checkLiveConfirmation: boolean;
      requestIndexing: boolean;
      runGoogleIndexing: boolean;
      runPingServices: boolean;
    };
    concurrencyLimit: number;
  };
}

interface SmartBatchSchedulerProps {
  onJobStarted?: () => void;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
  billing?: BillingInfo | null;
  onOpenSubscription?: () => void;
}

export const SmartBatchScheduler: React.FC<SmartBatchSchedulerProps> = ({
  onJobStarted,
  isOpenModal = false,
  onCloseModal,
  billing,
  onOpenSubscription,
}) => {
  const [jobs, setJobs] = useState<ScheduledJob[]>([]);
  const [loading, setLoading] = useState(false);

  // New Job Form State
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [jobName, setJobName] = useState('');
  const [urlsInput, setUrlsInput] = useState('');
  const [scheduleType, setScheduleType] = useState<'ONCE' | 'INTERVAL' | 'DAILY'>('INTERVAL');
  const [scheduledAtDate, setScheduledAtDate] = useState('');
  const [intervalMinutes, setIntervalMinutes] = useState(30);
  const [batchSize, setBatchSize] = useState(10);
  const [runGoogleIndexing, setRunGoogleIndexing] = useState(true);
  const [runPingServices, setRunPingServices] = useState(true);
  const [checkLiveConfirmation, setCheckLiveConfirmation] = useState(true);

  // Countdown refresher trigger
  const [nowTimestamp, setNowTimestamp] = useState(Date.now());

  useEffect(() => {
    fetchScheduledJobs();
    const interval = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchScheduledJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/scheduler/jobs');
      if (res.data && res.data.jobs) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch scheduled jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply Preset Strategies
  const applyPreset = (preset: 'drip' | 'googlebot' | 'staggered') => {
    setIsCreatingNew(true);
    if (preset === 'drip') {
      setJobName('Organic Backlink Drip Feed');
      setScheduleType('INTERVAL');
      setIntervalMinutes(30);
      setBatchSize(5);
      toast.success('Applied "Organic Drip-Feed" preset (5 URLs / 30m)');
    } else if (preset === 'googlebot') {
      setJobName('Peak Googlebot Crawler Window');
      setScheduleType('DAILY');
      // Set to tonight 03:00 AM UTC
      const tonight = new Date();
      tonight.setHours(3, 0, 0, 0);
      if (tonight.getTime() < Date.now()) {
        tonight.setDate(tonight.getDate() + 1);
      }
      setScheduledAtDate(tonight.toISOString().slice(0, 16));
      setBatchSize(15);
      toast.success('Applied "Peak Googlebot Crawler Window" preset (Nightly 03:00 UTC)');
    } else if (preset === 'staggered') {
      setJobName('Staggered Indexing Buffer Queue');
      setScheduleType('INTERVAL');
      setIntervalMinutes(60);
      setBatchSize(10);
      toast.success('Applied "Staggered Indexing Buffer" preset (10 URLs / 1h)');
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const urls = urlsInput
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && !u.startsWith('#'));

    if (urls.length === 0) {
      toast.error('Please enter at least one target URL');
      return;
    }

    const payload = {
      name: jobName.trim() || `Batch Queue (${urls.length} URLs)`,
      target_urls: urls,
      schedule_type: scheduleType,
      scheduled_at: scheduledAtDate ? new Date(scheduledAtDate).toISOString() : new Date().toISOString(),
      interval_minutes: Number(intervalMinutes) || 30,
      batch_size: Number(batchSize) || 10,
      config: {
        features: {
          generateBacklinks: true,
          checkLiveConfirmation,
          requestIndexing: true,
          runGoogleIndexing,
          runPingServices,
        },
        concurrencyLimit: 3,
      },
    };

    const toastId = toast.loading('Scheduling batch submission job...');
    try {
      const res = await axios.post('/api/scheduler/jobs', payload);
      if (res.data && res.data.success) {
        toast.success(`Successfully scheduled "${res.data.job.name}"!`, { id: toastId });
        setIsCreatingNew(false);
        setJobName('');
        setUrlsInput('');
        fetchScheduledJobs();
        if (onJobStarted) onJobStarted();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to schedule batch job', { id: toastId });
    }
  };

  const handlePauseJob = async (id: string) => {
    try {
      await axios.post(`/api/scheduler/jobs/${id}/pause`);
      toast.success('Scheduled job paused');
      fetchScheduledJobs();
    } catch (e) {
      toast.error('Failed to pause job');
    }
  };

  const handleResumeJob = async (id: string) => {
    try {
      await axios.post(`/api/scheduler/jobs/${id}/resume`);
      toast.success('Scheduled job resumed');
      fetchScheduledJobs();
    } catch (e) {
      toast.error('Failed to resume job');
    }
  };

  const handleRunNow = async (id: string) => {
    const toastId = toast.loading('Triggering batch execution immediately...');
    try {
      await axios.post(`/api/scheduler/jobs/${id}/run-now`);
      toast.success('Batch job triggered immediately!', { id: toastId });
      fetchScheduledJobs();
      if (onJobStarted) onJobStarted();
    } catch (e) {
      toast.error('Failed to trigger job', { id: toastId });
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scheduled batch queue?')) return;
    try {
      await axios.delete(`/api/scheduler/jobs/${id}`);
      toast.success('Scheduled job deleted');
      fetchScheduledJobs();
    } catch (e) {
      toast.error('Failed to delete job');
    }
  };

  // Format Countdown Timer
  const formatCountdown = (nextRunIso: string, status: string) => {
    if (status === 'PAUSED') return 'Paused';
    if (status === 'COMPLETED') return 'Finished';
    if (status === 'CANCELLED') return 'Cancelled';

    const diffMs = new Date(nextRunIso).getTime() - nowTimestamp;
    if (diffMs <= 0) return 'Executing now...';

    const totalSecs = Math.floor(diffMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 shadow-2xl space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl text-amber-400">
            <Timer className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span>SmartBatchScheduler Engine</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono font-bold">
                Automated Indexation Drip Feed
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Queue batch submission jobs across custom intervals or peak Googlebot crawl windows to ensure steady, natural indexation velocity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {billing && (
            <button
              onClick={onOpenSubscription}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 border border-amber-500/30 rounded-xl text-amber-300 font-mono text-xs font-bold hover:bg-zinc-900 transition-all cursor-pointer"
              title="View credit quota balance"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{billing.credits_remaining} / {billing.credits_total} Credits</span>
            </button>
          )}

          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingNew ? 'Close Form' : 'Schedule New Batch'}</span>
          </button>

          <button
            onClick={fetchScheduledJobs}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl border border-zinc-700 transition-all"
            title="Refresh active schedules"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {isOpenModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-xl transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Preset Strategy Quick-Selector Cards */}
      {!isCreatingNew && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Preset 1 */}
          <button
            onClick={() => applyPreset('drip')}
            className="bg-zinc-950/80 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-amber-500/40 p-3.5 rounded-xl text-left transition-all group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1 font-mono">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Organic Drip-Feed</span>
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                5 URLs / 30m
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Distribute backlink submissions gradually to mimic organic site growth and avoid search spam flags.
            </p>
          </button>

          {/* Preset 2 */}
          <button
            onClick={() => applyPreset('googlebot')}
            className="bg-zinc-950/80 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-purple-500/40 p-3.5 rounded-xl text-left transition-all group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Peak Googlebot Window</span>
              </span>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded font-mono">
                Nightly 03:00 UTC
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Fire batches during high search crawler density windows for maximum instant discovery.
            </p>
          </button>

          {/* Preset 3 */}
          <button
            onClick={() => applyPreset('staggered')}
            className="bg-zinc-950/80 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-cyan-500/40 p-3.5 rounded-xl text-left transition-all group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Staggered Index Buffer</span>
              </span>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-mono">
                10 URLs / 1h
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Paces indexing requests smoothly across ping networks and Google Indexing API quotas.
            </p>
          </button>
        </div>
      )}

      {/* New Scheduled Job Creator Form */}
      {isCreatingNew && (
        <form onSubmit={handleCreateJob} className="bg-zinc-950 p-4 rounded-xl border border-amber-500/30 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Configure Batch Schedule Queue</span>
            </span>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Title */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Schedule Batch Name</label>
              <input
                type="text"
                placeholder="e.g. Weekly Blog Backlinks Drip"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Schedule Type */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Execution Schedule Strategy</label>
              <select
                value={scheduleType}
                onChange={(e: any) => setScheduleType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono cursor-pointer"
              >
                <option value="INTERVAL">Interval Drip Feed (Run X URLs every Y minutes)</option>
                <option value="DAILY">Daily Recurring (Run batch every day at set time)</option>
                <option value="ONCE">Scheduled One-Off Time (Run batch once at future time)</option>
              </select>
            </div>
          </div>

          {/* Target URLs Multi-Line Entry */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Target URLs List (One URL per line)
            </label>
            <textarea
              rows={4}
              placeholder="https://example.com/blog/page-1&#10;https://example.com/features&#10;https://example.com/pricing"
              value={urlsInput}
              onChange={(e) => setUrlsInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500 placeholder-zinc-600"
            />
          </div>

          {/* Batch & Timing Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Batch Size (URLs / Run)</label>
              <input
                type="number"
                min={1}
                max={50}
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Drip Interval (Minutes)</label>
              <input
                type="number"
                min={5}
                max={1440}
                value={intervalMinutes}
                onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Scheduled Start Date/Time</label>
              <input
                type="datetime-local"
                value={scheduledAtDate}
                onChange={(e) => setScheduledAtDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:border-amber-500"
              />
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-300">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checkLiveConfirmation}
                onChange={(e) => setCheckLiveConfirmation(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-amber-500 accent-amber-500"
              />
              <span>Live HTTP 200 Scan</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={runGoogleIndexing}
                onChange={(e) => setRunGoogleIndexing(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-amber-500 accent-amber-500"
              />
              <span>Google Indexing API</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={runPingServices}
                onChange={(e) => setRunPingServices(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-amber-500 accent-amber-500"
              />
              <span>Multi-Ping Broadcast</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Save &amp; Activate Schedule
            </button>
          </div>
        </form>
      )}

      {/* Active & Scheduled Jobs Table/List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-300 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Active &amp; Queued Scheduled Batches ({jobs.length})</span>
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-10 bg-zinc-950/60 rounded-xl border border-zinc-800 text-zinc-500 text-xs font-sans">
            No scheduled batch jobs active. Click "Schedule New Batch" above or pick a preset strategy to queue automated indexation drip feeds.
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => {
              const countdown = formatCountdown(job.next_run_at, job.status);
              const isPaused = job.status === 'PAUSED';
              const isCompleted = job.status === 'COMPLETED';

              return (
                <div
                  key={job.id}
                  className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-100 font-mono">{job.name}</span>
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isPaused
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse'
                        }`}
                      >
                        {job.status}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                        {job.schedule_type}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-zinc-400">
                      <span>Total URLs: <strong className="text-zinc-200">{job.target_urls.length}</strong></span>
                      <span>Batch Size: <strong className="text-amber-300">{job.batch_size}</strong></span>
                      <span>Drip Interval: <strong className="text-cyan-300">{job.interval_minutes}m</strong></span>
                      <span>Progress: <strong className="text-purple-300">{job.completed_batches} / {job.total_batches} Batches</strong></span>
                    </div>
                  </div>

                  {/* Countdown Timer Widget Pill */}
                  <div className="flex items-center gap-3">
                    <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl font-mono text-xs text-center">
                      <span className="text-[10px] uppercase text-zinc-500 font-bold block">Next Fire Window</span>
                      <span className="font-bold text-amber-400 text-sm">{countdown}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRunNow(job.id)}
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                        title="Force run batch right now"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">Run Now</span>
                      </button>

                      {isPaused ? (
                        <button
                          onClick={() => handleResumeJob(job.id)}
                          className="p-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg text-xs transition-all"
                          title="Resume schedule"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePauseJob(job.id)}
                          className="p-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 rounded-lg text-xs transition-all"
                          title="Pause schedule"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs transition-all"
                        title="Delete schedule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
