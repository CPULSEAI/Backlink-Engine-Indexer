import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, Sliders, Globe, ShieldCheck, Zap, AlertCircle, RefreshCw, Bot, Target, Repeat, StopCircle, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { DirectoryEntry, AutonomousConfig, BillingInfo } from '../types';
import { SmartUrlBatcherModal } from './SmartUrlBatcherModal';

interface UrlInputFormProps {
  directories: DirectoryEntry[];
  isProcessing: boolean;
  isAutonomousActive?: boolean;
  autonomousAccumulatedCount?: number;
  autonomousTargetGoal?: number;
  autonomousBatchCount?: number;
  billing?: BillingInfo | null;
  onOpenSubscription?: () => void;
  onStartJob: (config: {
    targetUrls: string[];
    features: {
      generateBacklinks: boolean;
      checkLiveConfirmation: boolean;
      requestIndexing: boolean;
      runGoogleIndexing: boolean;
      runPingServices: boolean;
    };
    selectedDirectoryIds: string[];
    concurrencyLimit: number;
    autonomousConfig?: AutonomousConfig;
  }) => void;
  onCancelJob: () => void;
  onStopAutonomous?: () => void;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({
  directories,
  isProcessing,
  isAutonomousActive = false,
  autonomousAccumulatedCount = 0,
  autonomousTargetGoal = 100,
  autonomousBatchCount = 1,
  billing,
  onOpenSubscription,
  onStartJob,
  onCancelJob,
  onStopAutonomous,
}) => {
  const [isBatcherModalOpen, setIsBatcherModalOpen] = useState<boolean>(false);
  const [rawInput, setRawInput] = useState<string>(
    'https://example.com\nhttps://myprowebsite.org\nhttps://devblog.io'
  );
  const [features, setFeatures] = useState({
    generateBacklinks: true,
    checkLiveConfirmation: true,
    requestIndexing: true,
    runGoogleIndexing: true,
    runPingServices: true,
  });
  const [concurrency, setConcurrency] = useState<number>(4);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  // Autonomous Continuous Mode States
  const [isAutonomousEnabled, setIsAutonomousEnabled] = useState<boolean>(false);
  const [targetGoalNumber, setTargetGoalNumber] = useState<number>(250);
  const [targetGoalMetric, setTargetGoalMetric] = useState<'tasks' | 'confirmed'>('tasks');
  const [autoCycleUrls, setAutoCycleUrls] = useState<boolean>(true);

  // Regex check for domain/URL validity
  const URL_REGEX = /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,24}(:\d{1,5})?(\/[^\s]*)?$/i;

  // Helper to extract clean URLs
  const getCleanedUrls = (): string[] => {
    return rawInput
      .split(/[\n,;]+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#') && !line.startsWith('//'));
  };

  const cleanedUrls = getCleanedUrls();
  const uniqueUrls = Array.from(new Set(cleanedUrls));

  const handleCleanInput = () => {
    let fixedCount = 0;
    let invalidCount = 0;
    const validSet = new Set<string>();

    uniqueUrls.forEach((u) => {
      let candidate = u;
      if (!candidate.startsWith('http://') && !candidate.startsWith('https://')) {
        candidate = 'https://' + candidate;
        fixedCount++;
      }
      if (URL_REGEX.test(candidate)) {
        validSet.add(candidate);
      } else {
        invalidCount++;
      }
    });

    const validArray = Array.from(validSet);
    setRawInput(validArray.join('\n'));

    if (invalidCount > 0) {
      toast.error(`Cleaned! ${validArray.length} valid URLs retained (${invalidCount} malformed URLs dropped).`);
    } else {
      toast.success(`Cleaned & validated! ${validArray.length} unique URLs formatted with https://.`);
    }

    setValidationMsg(`Cleaned & validated! ${validArray.length} unique URLs ready.`);
    setTimeout(() => setValidationMsg(null), 4000);
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-run regex batcher before dispatch
    const validatedUrls: string[] = [];
    let malformedDropped = 0;

    uniqueUrls.forEach((u) => {
      let candidate = u;
      if (!candidate.startsWith('http://') && !candidate.startsWith('https://')) {
        candidate = 'https://' + candidate;
      }
      if (URL_REGEX.test(candidate)) {
        if (!validatedUrls.includes(candidate)) {
          validatedUrls.push(candidate);
        }
      } else {
        malformedDropped++;
      }
    });

    if (validatedUrls.length === 0) {
      toast.error('Error: Please enter at least one valid target URL.');
      setValidationMsg('Error: Please enter at least one valid target URL.');
      return;
    }

    if (malformedDropped > 0) {
      toast.error(`Smart URL Batcher: Filtered out ${malformedDropped} malformed URLs before sending to backend.`);
    }

    const filteredDirs =
      selectedCategory === 'ALL'
        ? directories
        : directories.filter((d) => d.type.toUpperCase().includes(selectedCategory));

    onStartJob({
      targetUrls: validatedUrls,
      features,
      selectedDirectoryIds: filteredDirs.map((d) => d.id),
      concurrencyLimit: concurrency,
      autonomousConfig: isAutonomousEnabled
        ? {
            enabled: true,
            targetGoalNumber,
            targetGoalMetric,
            autoCycleUrls,
          }
        : undefined,
    });
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl mb-8">
      <form onSubmit={handleStart} className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Bulk Target URLs &amp; Pipeline Configuration</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Input website URLs to generate dynamic profile backlinks, verify live rendering, and trigger ping/indexing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBatcherModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-xl border border-cyan-500/30 transition-all shadow-sm"
              title="Launch Smart URL Batcher & Regex Validator"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart URL Batcher</span>
            </button>

            <button
              type="button"
              onClick={handleCleanInput}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium rounded-xl border border-zinc-700/60 transition-all shadow-sm"
              title="Strip whitespace, remove duplicates, format protocol"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Quick Clean ({uniqueUrls.length})</span>
            </button>
          </div>
        </div>

        {/* Textarea Input */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Target Websites List <span className="text-zinc-500 font-normal">(One URL per line)</span>
          </label>
          <textarea
            rows={5}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            disabled={isProcessing}
            placeholder="https://example.com&#10;https://mybrand.org&#10;https://techstartup.io"
            className="w-full bg-zinc-950/80 border border-zinc-800/90 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 font-mono transition-all disabled:opacity-50"
          />
          <div className="flex items-center justify-between mt-2 text-xs text-zinc-400">
            <span>
              Total URLs: <strong className="text-indigo-400">{uniqueUrls.length}</strong> unique lines
            </span>
            {validationMsg && (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {validationMsg}
              </span>
            )}
          </div>
        </div>

        {/* Pipeline Modules Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80">
          {/* Module A/B: Generate Backlinks */}
          <div className="flex items-start gap-3 p-2">
            <input
              type="checkbox"
              id="feature_backlinks"
              checked={features.generateBacklinks}
              onChange={(e) => setFeatures({ ...features, generateBacklinks: e.target.checked })}
              disabled={isProcessing}
              className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/50"
            />
            <div>
              <label htmlFor="feature_backlinks" className="text-xs font-bold text-zinc-200 cursor-pointer block">
                Module B: Automated Backlink Generator
              </label>
              <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                Submit to 55+ high-authority WHOIS, SEO analysis &amp; directory platforms.
              </p>
            </div>
          </div>

          {/* Module C: Live Confirmation */}
          <div className="flex items-start gap-3 p-2">
            <input
              type="checkbox"
              id="feature_confirm"
              checked={features.checkLiveConfirmation}
              onChange={(e) => setFeatures({ ...features, checkLiveConfirmation: e.target.checked })}
              disabled={isProcessing}
              className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/50"
            />
            <div>
              <label htmlFor="feature_confirm" className="text-xs font-bold text-zinc-200 cursor-pointer block">
                Module C: Live Confirmation Engine
              </label>
              <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                Perform follow-up HTTP GET to verify status code 200 &amp; page creation.
              </p>
            </div>
          </div>

          {/* Module D: Indexing Request */}
          <div className="flex items-start gap-3 p-2">
            <input
              type="checkbox"
              id="feature_indexing"
              checked={features.requestIndexing}
              onChange={(e) => setFeatures({ ...features, requestIndexing: e.target.checked })}
              disabled={isProcessing}
              className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/50"
            />
            <div>
              <label htmlFor="feature_indexing" className="text-xs font-bold text-zinc-200 cursor-pointer block">
                Module D: Indexing Request Engine
              </label>
              <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                Submit to Google Indexing API &amp; ping XML-RPC services (Ping-O-Matic, FeedBurner).
              </p>
            </div>
          </div>
        </div>

        {/* Directory Categories & Concurrency Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Directory Network Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-zinc-950/80 border border-zinc-800/90 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Networks (55+ High-DA Directories)</option>
              <option value="WHOIS">WHOIS Lookup Platforms Only</option>
              <option value="SEO">SEO Audit &amp; Performance Analyzers</option>
              <option value="SITE">Site Traffic &amp; Valuation Stats</option>
              <option value="PING">Ping Platforms &amp; Indexers</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Async Concurrency Threads: <span className="text-cyan-400 font-bold">{concurrency} Worker Threads</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              disabled={isProcessing}
              className="w-full accent-indigo-500 bg-zinc-950 rounded-lg cursor-pointer h-2 mt-2"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>1 Thread (Safe / Delays)</span>
              <span>5 Threads (Recommended)</span>
              <span>10 Threads (High Speed)</span>
            </div>
          </div>
        </div>

        {/* Autonomous Continuous Submission Mode Panel */}
        <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-zinc-950/60 border border-indigo-500/30 rounded-xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-500/20 border border-indigo-500/40 rounded-lg text-indigo-400">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-indigo-200 flex items-center gap-2 uppercase tracking-wide">
                  Autonomous Continuous Submission Engine
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-mono">
                    Auto-Loop
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Continuously submits and cycles batches until real-time progress reaches your target goal.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isAutonomousEnabled}
                onChange={(e) => setIsAutonomousEnabled(e.target.checked)}
                disabled={isProcessing || isAutonomousActive}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-2 text-xs font-bold text-zinc-200">
                {isAutonomousEnabled ? 'Autonomous ON' : 'Enable Autonomous Mode'}
              </span>
            </label>
          </div>

          {/* Autonomous Configuration Controls when Enabled */}
          {isAutonomousEnabled && (
            <div className="mt-3 pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Target Milestone Number */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Target Milestone Goal:</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={10}
                    max={10000}
                    step={10}
                    value={targetGoalNumber}
                    onChange={(e) => setTargetGoalNumber(Math.max(1, Number(e.target.value)))}
                    disabled={isProcessing || isAutonomousActive}
                    className="w-full bg-zinc-950 border border-indigo-500/40 rounded-lg px-3 py-1.5 text-xs text-indigo-200 font-mono font-bold focus:outline-none focus:border-indigo-400"
                  />
                </div>
                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {[50, 100, 250, 500, 1000, 2500].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTargetGoalNumber(num)}
                      disabled={isProcessing || isAutonomousActive}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                        targetGoalNumber === num
                          ? 'bg-indigo-600 text-white'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Goal Metric */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">
                  Progress Metric to Track:
                </label>
                <select
                  value={targetGoalMetric}
                  onChange={(e) => setTargetGoalMetric(e.target.value as 'tasks' | 'confirmed')}
                  disabled={isProcessing || isAutonomousActive}
                  className="w-full bg-zinc-950 border border-indigo-500/40 rounded-lg px-3 py-1.5 text-xs text-indigo-200 focus:outline-none focus:border-indigo-400"
                >
                  <option value="tasks">Total Tasks Completed (Every submission)</option>
                  <option value="confirmed">Live Confirmed Backlinks Only (Verified 200 OK)</option>
                </select>
                <p className="text-[10px] text-zinc-500 mt-1">
                  App auto-loops submissions until this exact number is reached.
                </p>
              </div>

              {/* Auto Cycle URLs & Status */}
              <div className="flex flex-col justify-between">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Repeat className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Auto-Cycle Options:</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={autoCycleUrls}
                      onChange={(e) => setAutoCycleUrls(e.target.checked)}
                      disabled={isProcessing || isAutonomousActive}
                      className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-950 text-indigo-500"
                    />
                    <span className="text-xs text-zinc-300">Continuous URL rotation across batch passes</span>
                  </label>
                </div>

                {isAutonomousActive && (
                  <div className="mt-2 p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-xs text-indigo-300 font-mono flex items-center justify-between">
                    <span>
                      Pass #{autonomousBatchCount}: {autonomousAccumulatedCount} / {autonomousTargetGoal} ({Math.round(Math.min(100, (autonomousAccumulatedCount / Math.max(1, autonomousTargetGoal)) * 100))}%)
                    </span>
                    <button
                      type="button"
                      onClick={onStopAutonomous}
                      className="ml-2 text-rose-400 hover:text-rose-300 font-bold underline text-[10px]"
                    >
                      Stop Auto-Loop
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quota Insufficient Alert Banner */}
        {billing && uniqueUrls.length > billing.credits_remaining && (
          <div className="bg-amber-950/60 border border-amber-500/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <span>
                <strong>Quota Warning:</strong> This submission requires <strong>{uniqueUrls.length} Credits</strong>, but you only have <strong>{billing.credits_remaining} Credits</strong> remaining.
              </span>
            </div>
            {onOpenSubscription && (
              <button
                type="button"
                onClick={onOpenSubscription}
                className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-lg text-xs shrink-0 cursor-pointer shadow-md"
              >
                Upgrade Plan / Get Credits
              </button>
            )}
          </div>
        )}

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Cost: <strong className="text-amber-300">{uniqueUrls.length} Credits</strong></span>
            <span className="text-zinc-600">|</span>
            <span>Available: <strong className="text-zinc-200">{billing?.credits_remaining ?? 15} Credits</strong></span>
          </div>

          {isAutonomousActive && onStopAutonomous && (
            <button
              type="button"
              onClick={onStopAutonomous}
              className="px-4 py-2.5 bg-rose-950/80 hover:bg-rose-900/90 text-rose-200 text-xs font-bold rounded-xl border border-rose-800 transition-all flex items-center gap-2"
            >
              <StopCircle className="w-4 h-4 text-rose-400" />
              <span>Disengage Autonomous Mode</span>
            </button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {isProcessing ? (
              <button
                type="button"
                onClick={onCancelJob}
                className="px-6 py-2.5 bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 animate-bounce" />
                <span>Cancel Active Job</span>
              </button>
            ) : (
              <button
                type="submit"
                className={`px-8 py-3 text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 transform active:scale-95 ${
                  isAutonomousEnabled
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-purple-600/30 ring-2 ring-purple-500/50'
                    : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-indigo-600/25'
                }`}
              >
                {isAutonomousEnabled ? (
                  <>
                    <Bot className="w-4 h-4 text-cyan-300 animate-bounce" />
                    <span>Launch Autonomous Loop (Target: {targetGoalNumber})</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Launch Multi-Site Backlink &amp; Indexing Job</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      <SmartUrlBatcherModal
        isOpen={isBatcherModalOpen}
        onClose={() => setIsBatcherModalOpen(false)}
        rawText={rawInput}
        onApplyCleanedUrls={(cleanedText) => setRawInput(cleanedText)}
      />
    </div>
  );
};
