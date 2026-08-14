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
}

export const SmartBatchScheduler: React.FC<SmartBatchSchedulerProps> = ({
  onJobStarted,
  isOpenModal = false,
  onCloseModal,
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
    <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_#000] mb-8 space-y-6 text-black">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#ff4d00] border-2 border-black text-black shadow-[2px_2px_0_#000]">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-black font-mono-brutal flex items-center gap-2 uppercase">
              <span>SMART BATCH SCHEDULER ENGINE</span>
              <span className="text-[10px] bg-black text-white px-2 py-0.5 font-bold">
                DRIP_FEED
              </span>
            </h3>
            <p className="text-xs text-zinc-700 font-mono-brutal mt-0.5">
              Queue batch submission jobs across custom intervals or peak Googlebot windows for natural indexation velocity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap font-mono-brutal">
          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ff4d00] hover:bg-[#ff5c14] text-black font-bold text-xs border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingNew ? 'CLOSE FORM' : 'SCHEDULE NEW BATCH'}</span>
          </button>

          <button
            onClick={fetchScheduledJobs}
            className="p-1.5 bg-[#f2efeb] hover:bg-white text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0_#000]"
            title="Refresh active schedules"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {isOpenModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-1.5 bg-[#f2efeb] hover:bg-white text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0_#000]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Preset Strategy Quick-Selector Cards */}
      {!isCreatingNew && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono-brutal">
          {/* Preset 1 */}
          <button
            onClick={() => applyPreset('drip')}
            className="bg-[#f2efeb] hover:bg-white border-2 border-black p-3.5 text-left transition-all group space-y-1 shadow-[2px_2px_0_#000] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-black flex items-center gap-1 uppercase">
                <Zap className="w-3.5 h-3.5 text-[#ff4d00]" />
                <span>ORGANIC DRIP-FEED</span>
              </span>
              <span className="text-[10px] bg-black text-white px-1.5 py-0.5 font-bold">
                5 URLS / 30M
              </span>
            </div>
            <p className="text-[11px] text-zinc-700 font-sans">
              Distribute backlink submissions gradually to mimic organic site growth.
            </p>
          </button>

          {/* Preset 2 */}
          <button
            onClick={() => applyPreset('googlebot')}
            className="bg-[#f2efeb] hover:bg-white border-2 border-black p-3.5 text-left transition-all group space-y-1 shadow-[2px_2px_0_#000] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-black flex items-center gap-1 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#ff4d00]" />
                <span>PEAK GOOGLEBOT</span>
              </span>
              <span className="text-[10px] bg-[#ff4d00] text-black border border-black px-1.5 py-0.5 font-bold">
                03:00 UTC
              </span>
            </div>
            <p className="text-[11px] text-zinc-700 font-sans">
              Fire batches during high search crawler density windows for maximum discovery.
            </p>
          </button>

          {/* Preset 3 */}
          <button
            onClick={() => applyPreset('staggered')}
            className="bg-[#f2efeb] hover:bg-white border-2 border-black p-3.5 text-left transition-all group space-y-1 shadow-[2px_2px_0_#000] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-black flex items-center gap-1 uppercase">
                <Clock className="w-3.5 h-3.5 text-[#ff4d00]" />
                <span>STAGGERED BUFFER</span>
              </span>
              <span className="text-[10px] bg-white text-black border border-black px-1.5 py-0.5 font-bold">
                10 URLS / 1H
              </span>
            </div>
            <p className="text-[11px] text-zinc-700 font-sans">
              Paces indexing requests smoothly across ping networks and API quotas.
            </p>
          </button>
        </div>
      )}

      {/* New Scheduled Job Creator Form */}
      {isCreatingNew && (
        <form onSubmit={handleCreateJob} className="bg-[#f2efeb] p-4 border-2 border-black space-y-4 shadow-[3px_3px_0_#000] font-mono-brutal">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <span className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-4 h-4 text-[#ff4d00]" />
              <span>CONFIGURE BATCH SCHEDULE QUEUE</span>
            </span>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="text-xs text-black font-bold uppercase underline cursor-pointer"
            >
              [CANCEL]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Title */}
            <div>
              <label className="block text-xs font-bold text-black uppercase mb-1">SCHEDULE BATCH NAME</label>
              <input
                type="text"
                placeholder="e.g. Weekly Blog Backlinks Drip"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs text-black font-bold focus:outline-none shadow-[2px_2px_0_#000]"
              />
            </div>

            {/* Schedule Type */}
            <div>
              <label className="block text-xs font-bold text-black uppercase mb-1">EXECUTION STRATEGY</label>
              <select
                value={scheduleType}
                onChange={(e: any) => setScheduleType(e.target.value)}
                className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs text-black font-bold focus:outline-none shadow-[2px_2px_0_#000] cursor-pointer"
              >
                <option value="INTERVAL">INTERVAL DRIP FEED (RUN X URLS EVERY Y MINS)</option>
                <option value="DAILY">DAILY RECURRING (RUN BATCH AT SET TIME)</option>
                <option value="ONCE">SCHEDULED ONE-OFF TIME</option>
              </select>
            </div>
          </div>

          {/* Target URLs Multi-Line Entry */}
          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">
              TARGET URLS LIST (ONE PER LINE)
            </label>
            <textarea
              rows={4}
              placeholder="https://example.com/blog/page-1&#10;https://example.com/features"
              value={urlsInput}
              onChange={(e) => setUrlsInput(e.target.value)}
              className="w-full bg-white border-2 border-black p-3 text-xs text-black font-bold focus:outline-none shadow-[2px_2px_0_#000] placeholder-zinc-400"
            />
          </div>

          {/* Batch & Timing Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 border-2 border-black shadow-[2px_2px_0_#000]">
            <div>
              <label className="block text-[11px] font-bold text-black uppercase mb-1">BATCH SIZE (URLS/RUN)</label>
              <input
                type="number"
                min={1}
                max={50}
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full bg-[#f2efeb] border-2 border-black px-2.5 py-1 text-xs text-black font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-black uppercase mb-1">INTERVAL (MINS)</label>
              <input
                type="number"
                min={5}
                max={1440}
                value={intervalMinutes}
                onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                className="w-full bg-[#f2efeb] border-2 border-black px-2.5 py-1 text-xs text-black font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-black uppercase mb-1">START DATE/TIME</label>
              <input
                type="datetime-local"
                value={scheduledAtDate}
                onChange={(e) => setScheduledAtDate(e.target.value)}
                className="w-full bg-[#f2efeb] border-2 border-black px-2.5 py-1 text-xs text-black font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-brutal text-black">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checkLiveConfirmation}
                onChange={(e) => setCheckLiveConfirmation(e.target.checked)}
                className="w-4 h-4 border-2 border-black text-black accent-black"
              />
              <span className="font-bold">LIVE HTTP 200 SCAN</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={runGoogleIndexing}
                onChange={(e) => setRunGoogleIndexing(e.target.checked)}
                className="w-4 h-4 border-2 border-black text-black accent-black"
              />
              <span className="font-bold">GOOGLE INDEXING API</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={runPingServices}
                onChange={(e) => setRunPingServices(e.target.checked)}
                className="w-4 h-4 border-2 border-black text-black accent-black"
              />
              <span className="font-bold">MULTI-PING BROADCAST</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t-2 border-black">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-3 py-1.5 bg-white hover:bg-black hover:text-white text-black text-xs font-bold border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#ff4d00] hover:bg-[#ff5c14] text-black font-bold text-xs border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer"
            >
              SAVE &amp; ACTIVATE SCHEDULE
            </button>
          </div>
        </form>
      )}

      {/* Active & Scheduled Jobs Table/List */}
      <div className="space-y-3 font-mono-brutal">
        <div className="flex items-center justify-between text-xs font-bold text-black uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#ff4d00]" />
            <span>ACTIVE &amp; QUEUED SCHEDULED BATCHES ({jobs.length})</span>
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-10 bg-[#f2efeb] border-2 border-black text-black text-xs font-bold uppercase shadow-[2px_2px_0_#000]">
            NO SCHEDULED BATCH JOBS ACTIVE. CLICK "SCHEDULE NEW BATCH" ABOVE TO QUEUE AUTOMATED INDEXATION.
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
                  className="bg-[#f2efeb] border-2 border-black p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white transition-all shadow-[3px_3px_0_#000]"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-black uppercase">{job.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 border border-black uppercase ${
                          isCompleted
                            ? 'bg-black text-white'
                            : isPaused
                            ? 'bg-[#ff4d00] text-black'
                            : 'bg-white text-black'
                        }`}
                      >
                        {job.status}
                      </span>
                      <span className="text-[10px] text-black bg-white px-1.5 py-0.5 border border-black font-bold uppercase">
                        {job.schedule_type}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-700">
                      <span>TOTAL URLS: <strong className="text-black">{job.target_urls.length}</strong></span>
                      <span>BATCH: <strong className="text-black">{job.batch_size}</strong></span>
                      <span>INTERVAL: <strong className="text-black">{job.interval_minutes}M</strong></span>
                      <span>PROGRESS: <strong className="text-black">{job.completed_batches} / {job.total_batches} BATCHES</strong></span>
                    </div>
                  </div>

                  {/* Countdown Timer Widget Pill */}
                  <div className="flex items-center gap-3">
                    <div className="bg-white border-2 border-black px-3 py-1.5 text-xs text-center shadow-[2px_2px_0_#000]">
                      <span className="text-[9px] uppercase text-zinc-600 font-bold block">NEXT FIRE</span>
                      <span className="font-bold text-[#ff4d00] text-sm">{countdown}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRunNow(job.id)}
                        className="px-2.5 py-1.5 bg-black hover:bg-zinc-800 text-white border-2 border-black text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-[2px_2px_0_#000]"
                        title="Force run batch right now"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">RUN NOW</span>
                      </button>

                      {isPaused ? (
                        <button
                          onClick={() => handleResumeJob(job.id)}
                          className="p-1.5 bg-white hover:bg-[#f2efeb] text-black border-2 border-black text-xs transition-all cursor-pointer shadow-[2px_2px_0_#000]"
                          title="Resume schedule"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePauseJob(job.id)}
                          className="p-1.5 bg-[#ff4d00] hover:bg-[#ff5c14] text-black border-2 border-black text-xs transition-all cursor-pointer shadow-[2px_2px_0_#000]"
                          title="Pause schedule"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-1.5 bg-white hover:bg-black hover:text-white text-black border-2 border-black text-xs transition-all cursor-pointer shadow-[2px_2px_0_#000]"
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
