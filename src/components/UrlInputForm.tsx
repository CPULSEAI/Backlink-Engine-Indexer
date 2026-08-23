import React, { useState, useMemo } from 'react';
import { Play, Sparkles, CheckCircle2, Sliders, Globe, ShieldCheck, Zap, AlertCircle, RefreshCw, Bot, Target, Repeat, StopCircle, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { DirectoryEntry, AutonomousConfig } from '../types';
import { SmartUrlBatcherModal } from './SmartUrlBatcherModal';
import { SeoReadinessScorecard } from './SeoReadinessScorecard';

interface UrlInputFormProps {
  directories: DirectoryEntry[];
  isProcessing: boolean;
  isAutonomousActive?: boolean;
  autonomousAccumulatedCount?: number;
  autonomousTargetGoal?: number;
  autonomousBatchCount?: number;
  onStartJob: (config: {
    targetUrls: string[];
    priority?: 'High' | 'Medium' | 'Low' | string;
    urlPriorities?: Record<string, string>;
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
  autonomousTargetGoal = 100000,
  autonomousBatchCount = 1,
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
  const [targetGoalNumber, setTargetGoalNumber] = useState<number>(100000);
  const [targetGoalMetric, setTargetGoalMetric] = useState<'tasks' | 'confirmed'>('tasks');
  const [autoCycleUrls, setAutoCycleUrls] = useState<boolean>(true);

  const [showSeoScorecard, setShowSeoScorecard] = useState<boolean>(false);

  const [batchPriority, setBatchPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [customUrlPriorities, setCustomUrlPriorities] = useState<Record<string, 'High' | 'Medium' | 'Low'>>({});
  const [showPriorityManager, setShowPriorityManager] = useState<boolean>(true);

  // Regex check for domain/URL validity
  const URL_REGEX = /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,24}(:\d{1,5})?(\/[^\s]*)?$/i;

  // Memoize clean unique URLs from raw input
  const parsedUrlEntries = useMemo(() => {
    const lines = rawInput
      .split(/[\n,;]+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#') && !line.startsWith('//'));

    const entries: { url: string; inlinePriority?: 'High' | 'Medium' | 'Low' }[] = [];
    const seenUrls = new Set<string>();

    lines.forEach((line) => {
      // Check for inline priority tags e.g. "https://example.com [High]" or "https://example.com #priority=High"
      let cleanUrl = line;
      let inlinePrio: 'High' | 'Medium' | 'Low' | undefined = undefined;

      const prioMatch = line.match(/\[(high|medium|low)\]|\b(high|medium|low)\b/i);
      if (prioMatch) {
        const found = (prioMatch[1] || prioMatch[2]).toLowerCase();
        if (found === 'high') inlinePrio = 'High';
        else if (found === 'medium') inlinePrio = 'Medium';
        else if (found === 'low') inlinePrio = 'Low';
        cleanUrl = line.replace(/\[(high|medium|low)\]/gi, '').trim();
      }

      if (cleanUrl && !seenUrls.has(cleanUrl)) {
        seenUrls.add(cleanUrl);
        entries.push({ url: cleanUrl, inlinePriority: inlinePrio });
      }
    });

    return entries;
  }, [rawInput]);

  const uniqueUrls = useMemo(() => {
    return parsedUrlEntries.map((e) => e.url);
  }, [parsedUrlEntries]);

  // Compute effective priority for each URL
  const getEffectivePriority = (url: string): 'High' | 'Medium' | 'Low' => {
    if (customUrlPriorities[url]) return customUrlPriorities[url];
    const foundEntry = parsedUrlEntries.find((e) => e.url === url);
    if (foundEntry?.inlinePriority) return foundEntry.inlinePriority;
    return batchPriority;
  };

  const handleSetAllPriorities = (prio: 'High' | 'Medium' | 'Low') => {
    const updated: Record<string, 'High' | 'Medium' | 'Low'> = {};
    uniqueUrls.forEach((u) => {
      updated[u] = prio;
    });
    setBatchPriority(prio);
    setCustomUrlPriorities(updated);
    toast.success(`Updated all ${uniqueUrls.length} targets to ${prio.toUpperCase()} Priority`);
  };

  const handleToggleUrlPriority = (url: string) => {
    const curr = getEffectivePriority(url);
    const next: 'High' | 'Medium' | 'Low' = curr === 'High' ? 'Medium' : curr === 'Medium' ? 'Low' : 'High';
    setCustomUrlPriorities((prev) => ({ ...prev, [url]: next }));
  };

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

    const resolvedUrlPriorities: Record<string, string> = {};
    validatedUrls.forEach((u) => {
      resolvedUrlPriorities[u] = getEffectivePriority(u);
    });

    onStartJob({
      targetUrls: validatedUrls,
      priority: batchPriority,
      urlPriorities: resolvedUrlPriorities,
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
    <div id="url-input-form" className="bg-white border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0_#000] space-y-6 mb-8">
      <form onSubmit={handleStart} className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-4 border-black">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-black text-white font-mono-brutal text-xs font-bold uppercase">
                [01] BATCH HANDLER
              </span>
              <span className="font-mono-brutal text-xs text-[#ff4d00] font-bold">
                // TARGET_BUFFER_HEX
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-black uppercase tracking-tight mt-1">
              BULK TARGET URLS &amp; PIPELINE
            </h2>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowSeoScorecard(!showSeoScorecard)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-brutal font-bold uppercase border-2 border-black transition-all shadow-[2px_2px_0_#000] ${
                showSeoScorecard
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-[#f2efeb] text-black'
              }`}
              title="Inspect technical SEO elements before submitting"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{showSeoScorecard ? 'HIDE_SCORECARD' : 'SEO_SCORECARD'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBatcherModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f2efeb] hover:bg-zinc-200 text-black text-xs font-mono-brutal font-bold uppercase border-2 border-black shadow-[2px_2px_0_#000] transition-all"
              title="Launch Smart URL Batcher & Regex Validator"
            >
              <Zap className="w-3.5 h-3.5 text-[#ff4d00]" />
              <span>SMART_BATCHER</span>
            </button>

            <button
              type="button"
              onClick={handleCleanInput}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#f2efeb] text-black text-xs font-mono-brutal font-bold uppercase border-2 border-black shadow-[2px_2px_0_#000] transition-all"
              title="Strip whitespace, remove duplicates, format protocol"
            >
              <RefreshCw className="w-3.5 h-3.5 text-black" />
              <span>CLEAN ({uniqueUrls.length})</span>
            </button>
          </div>
        </div>

        {/* Textarea Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono-brutal font-bold text-black uppercase tracking-wider">
              TARGET_WEBSITES_LIST <span className="text-zinc-600 font-normal">[ONE_PER_LINE]</span>
            </label>
            <span className="text-[11px] font-mono-brutal text-zinc-500">
              Tip: Append <code className="bg-zinc-100 px-1 border border-zinc-300 text-black font-bold">[High]</code>, <code className="bg-zinc-100 px-1 border border-zinc-300 text-black font-bold">[Medium]</code>, or <code className="bg-zinc-100 px-1 border border-zinc-300 text-black font-bold">[Low]</code> to custom tag
            </span>
          </div>
          <textarea
            rows={4}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            disabled={isProcessing}
            placeholder="https://example.com [High]&#10;https://mybrand.org [Medium]&#10;https://techstartup.io [Low]"
            className="w-full bg-white border-4 border-black px-4 py-3 text-xs sm:text-sm text-black placeholder-zinc-400 focus:outline-none focus:border-black font-mono-brutal font-bold shadow-[4px_4px_0_#000] transition-all disabled:opacity-50"
          />
          <div className="flex items-center justify-between mt-2 text-xs font-mono-brutal font-bold">
            <span className="text-black">
              PARSED_TARGETS: <strong className="text-[#ff4d00]">{uniqueUrls.length}</strong> UNIQUE
            </span>
            {validationMsg && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {validationMsg}
              </span>
            )}
          </div>
        </div>

        {/* Priority Assignment & Tagging Module */}
        <div className="bg-[#f2efeb] border-4 border-black p-4 shadow-[4px_4px_0_#000] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-black text-white font-mono-brutal text-[10px] font-bold uppercase">
                [PRIORITY ROUTING]
              </span>
              <span className="text-xs font-mono-brutal font-bold text-black uppercase tracking-wider">
                SUBMISSION PRIORITY &amp; CRAWLER ALLOCATION
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono-brutal font-bold text-zinc-600 uppercase">SET ALL:</span>
              <button
                type="button"
                onClick={() => handleSetAllPriorities('High')}
                className="px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase bg-[#ff4d00] text-black border border-black hover:opacity-90 transition-all cursor-pointer"
                title="Set all URLs to High Priority"
              >
                🔥 HIGH
              </button>
              <button
                type="button"
                onClick={() => handleSetAllPriorities('Medium')}
                className="px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase bg-amber-400 text-black border border-black hover:opacity-90 transition-all cursor-pointer"
                title="Set all URLs to Medium Priority"
              >
                ⚡ MED
              </button>
              <button
                type="button"
                onClick={() => handleSetAllPriorities('Low')}
                className="px-2 py-0.5 text-[10px] font-mono-brutal font-bold uppercase bg-zinc-300 text-black border border-black hover:opacity-90 transition-all cursor-pointer"
                title="Set all URLs to Low Priority"
              >
                🌱 LOW
              </button>
            </div>
          </div>

          {/* Global Batch Priority Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => {
                setBatchPriority('High');
                handleSetAllPriorities('High');
              }}
              className={`p-2.5 border-2 border-black cursor-pointer transition-all ${
                batchPriority === 'High'
                  ? 'bg-black text-white shadow-[3px_3px_0_#ff4d00]'
                  : 'bg-white text-black hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-brutal font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff4d00] border border-black" />
                  HIGH PRIORITY
                </span>
                <span className={`text-[10px] font-mono-brutal font-bold px-1.5 py-0.5 border ${
                  batchPriority === 'High' ? 'bg-[#ff4d00] text-black border-black' : 'bg-zinc-200 text-black border-black'
                }`}>
                  FAST-TRACK
                </span>
              </div>
              <p className={`text-[10px] mt-1 leading-tight ${batchPriority === 'High' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                Top worker slot. Immediate Google API push &amp; high-tier directories first.
              </p>
            </div>

            <div
              onClick={() => {
                setBatchPriority('Medium');
                handleSetAllPriorities('Medium');
              }}
              className={`p-2.5 border-2 border-black cursor-pointer transition-all ${
                batchPriority === 'Medium'
                  ? 'bg-black text-white shadow-[3px_3px_0_#ffb703]'
                  : 'bg-white text-black hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-brutal font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black" />
                  MEDIUM PRIORITY
                </span>
                <span className={`text-[10px] font-mono-brutal font-bold px-1.5 py-0.5 border ${
                  batchPriority === 'Medium' ? 'bg-amber-400 text-black border-black' : 'bg-zinc-200 text-black border-black'
                }`}>
                  STANDARD
                </span>
              </div>
              <p className={`text-[10px] mt-1 leading-tight ${batchPriority === 'Medium' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                Balanced queue distribution across all directory types and IndexNow nodes.
              </p>
            </div>

            <div
              onClick={() => {
                setBatchPriority('Low');
                handleSetAllPriorities('Low');
              }}
              className={`p-2.5 border-2 border-black cursor-pointer transition-all ${
                batchPriority === 'Low'
                  ? 'bg-black text-white shadow-[3px_3px_0_#94a3b8]'
                  : 'bg-white text-black hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-brutal font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 border border-black" />
                  LOW PRIORITY
                </span>
                <span className={`text-[10px] font-mono-brutal font-bold px-1.5 py-0.5 border ${
                  batchPriority === 'Low' ? 'bg-zinc-400 text-black border-black' : 'bg-zinc-200 text-black border-black'
                }`}>
                  BACKGROUND
                </span>
              </div>
              <p className={`text-[10px] mt-1 leading-tight ${batchPriority === 'Low' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                Background trickle mode with low concurrency impact and throttled pinging.
              </p>
            </div>
          </div>

          {/* Per-URL Priority Quick Tagger Preview */}
          {uniqueUrls.length > 0 && (
            <div className="bg-white border-2 border-black p-2.5">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-zinc-200">
                <span className="text-[10px] font-mono-brutal font-bold text-black uppercase">
                  ACTIVE URL TARGET TAGS ({uniqueUrls.length}): <span className="text-zinc-500 font-normal">Click any badge to toggle (High → Med → Low)</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {uniqueUrls.slice(0, 12).map((url) => {
                  const prio = getEffectivePriority(url);
                  return (
                    <button
                      key={url}
                      type="button"
                      onClick={() => handleToggleUrlPriority(url)}
                      className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono-brutal font-bold border border-black transition-all cursor-pointer ${
                        prio === 'High'
                          ? 'bg-[#ffe8dd] text-black border-[#ff4d00]'
                          : prio === 'Medium'
                          ? 'bg-[#fffbeb] text-black border-amber-500'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-400'
                      }`}
                      title={`Click to change priority for ${url}`}
                    >
                      <span className="max-w-[140px] truncate">{url.replace(/^https?:\/\//, '')}</span>
                      <span
                        className={`px-1 py-0.2 text-[9px] font-mono-brutal font-bold uppercase border ${
                          prio === 'High'
                            ? 'bg-[#ff4d00] text-black border-black'
                            : prio === 'Medium'
                            ? 'bg-amber-400 text-black border-black'
                            : 'bg-zinc-300 text-black border-black'
                        }`}
                      >
                        {prio}
                      </span>
                    </button>
                  );
                })}
                {uniqueUrls.length > 12 && (
                  <span className="px-2 py-1 text-[10px] font-mono-brutal text-zinc-500 self-center">
                    +{uniqueUrls.length - 12} more targets tagged
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Technical SEO Readiness Pre-flight Scorecard */}
        {showSeoScorecard && (
          <div className="border-4 border-black p-4 bg-[#f2efeb] shadow-[4px_4px_0_#000]">
            <SeoReadinessScorecard
              targetUrl={uniqueUrls[0] || 'https://example.com'}
              onClose={() => setShowSeoScorecard(false)}
            />
          </div>
        )}

        {/* Pipeline Modules Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#f2efeb] p-4 border-4 border-black shadow-[4px_4px_0_#000]">
          {/* Module A/B: Generate Backlinks */}
          <div className="flex items-start gap-3 p-2 bg-white border-2 border-black shadow-[2px_2px_0_#000]">
            <input
              type="checkbox"
              id="feature_backlinks"
              checked={features.generateBacklinks}
              onChange={(e) => setFeatures({ ...features, generateBacklinks: e.target.checked })}
              disabled={isProcessing}
              className="mt-1 w-4 h-4 rounded-none border-2 border-black accent-[#ff4d00]"
            />
            <div>
              <label htmlFor="feature_backlinks" className="text-xs font-mono-brutal font-bold text-black cursor-pointer block uppercase">
                [MOD_B] BACKLINK GENERATOR
              </label>
              <p className="text-[11px] text-zinc-700 font-sans leading-snug mt-0.5">
                Submit to 55+ high-authority WHOIS, SEO analysis &amp; directory platforms.
              </p>
            </div>
          </div>

          {/* Module C: Live Confirmation */}
          <div className="flex items-start gap-3 p-2 bg-white border-2 border-black shadow-[2px_2px_0_#000]">
            <input
              type="checkbox"
              id="feature_confirm"
              checked={features.checkLiveConfirmation}
              onChange={(e) => setFeatures({ ...features, checkLiveConfirmation: e.target.checked })}
              disabled={isProcessing}
              className="mt-1 w-4 h-4 rounded-none border-2 border-black accent-[#ff4d00]"
            />
            <div>
              <label htmlFor="feature_confirm" className="text-xs font-mono-brutal font-bold text-black cursor-pointer block uppercase">
                [MOD_C] LIVE CONFIRMATION
              </label>
              <p className="text-[11px] text-zinc-700 font-sans leading-snug mt-0.5">
                Perform follow-up HTTP GET to verify status code 200 &amp; page creation.
              </p>
            </div>
          </div>

          {/* Module D: Indexing Request */}
          <div className="flex items-start gap-3 p-2 bg-white border-2 border-black shadow-[2px_2px_0_#000]">
            <input
              type="checkbox"
              id="feature_indexing"
              checked={features.requestIndexing}
              onChange={(e) => setFeatures({ ...features, requestIndexing: e.target.checked })}
              disabled={isProcessing}
              className="mt-1 w-4 h-4 rounded-none border-2 border-black accent-[#ff4d00]"
            />
            <div>
              <label htmlFor="feature_indexing" className="text-xs font-mono-brutal font-bold text-black cursor-pointer block uppercase">
                [MOD_D] GOOGLE &amp; INDEXNOW
              </label>
              <p className="text-[11px] text-zinc-700 font-sans leading-snug mt-0.5">
                Submit to Google Indexing API &amp; ping XML-RPC services.
              </p>
            </div>
          </div>
        </div>

        {/* Directory Categories & Concurrency Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0_#000]">
            <label className="block text-xs font-mono-brutal font-bold text-black uppercase tracking-wider mb-2">
              DIRECTORY_NETWORK_SCOPE
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-[#f2efeb] border-2 border-black px-3 py-2 text-xs font-mono-brutal font-bold text-black focus:outline-none shadow-[2px_2px_0_#000]"
            >
              <option value="ALL">ALL_NETWORKS (55+ High-DA Directories)</option>
              <option value="WHOIS">WHOIS_PLATFORMS_ONLY</option>
              <option value="SEO">SEO_AUDIT_ANALYZERS</option>
              <option value="SITE">SITE_TRAFFIC_VALUATION</option>
              <option value="PING">PING_SERP_INDEXERS</option>
            </select>
          </div>

          <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0_#000]">
            <label className="block text-xs font-mono-brutal font-bold text-black uppercase tracking-wider mb-2">
              THREAD_CONCURRENCY: <span className="text-[#ff4d00]">{concurrency} WORKERS</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              disabled={isProcessing}
              className="w-full accent-[#ff4d00] bg-black h-3 border border-black cursor-pointer mt-1"
            />
            <div className="flex justify-between text-[10px] font-mono-brutal font-bold text-zinc-600 mt-1">
              <span>01_SAFE</span>
              <span>05_OPTIMAL</span>
              <span>10_TURBO</span>
            </div>
          </div>
        </div>

        {/* Autonomous Continuous Submission Mode Panel */}
        <div className="bg-[#f2efeb] border-4 border-black p-4 sm:p-5 shadow-[4px_4px_0_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-black text-[#ff4d00] border-2 border-black">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-mono-brutal font-bold text-black uppercase tracking-wider">
                  AUTONOMOUS_CONTINUOUS_LOOP
                </h3>
                <p className="text-[11px] text-zinc-700 font-sans mt-0.5">
                  Continuously submit and cycle URL passes until reaching your target indexation goal.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer shrink-0 font-mono-brutal text-xs font-bold uppercase">
              <input
                type="checkbox"
                checked={isAutonomousEnabled}
                onChange={(e) => setIsAutonomousEnabled(e.target.checked)}
                disabled={isProcessing || isAutonomousActive}
                className="w-4 h-4 accent-[#ff4d00] border-2 border-black"
              />
              <span>{isAutonomousEnabled ? '[ AUTONOMOUS: ACTIVE ]' : '[ ENABLE AUTO-LOOP ]'}</span>
            </label>
          </div>

          {/* Autonomous Configuration Controls when Enabled */}
          {isAutonomousEnabled && (
            <div className="mt-3 pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Target Milestone Number */}
              <div>
                <label className="block text-[11px] font-mono-brutal font-bold text-black uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-[#ff4d00]" />
                  <span>TARGET_GOAL_METRIC:</span>
                </label>
                <input
                  type="number"
                  min={10}
                  max={1000000}
                  step={100}
                  value={targetGoalNumber}
                  onChange={(e) => setTargetGoalNumber(Math.max(1, Number(e.target.value)))}
                  disabled={isProcessing || isAutonomousActive}
                  className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs text-black font-mono-brutal font-bold focus:outline-none shadow-[2px_2px_0_#000]"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {[100, 500, 1000, 5000, 25000, 100000].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTargetGoalNumber(num)}
                      disabled={isProcessing || isAutonomousActive}
                      className={`px-2 py-0.5 text-[10px] font-mono-brutal font-bold border border-black uppercase transition-all ${
                        targetGoalNumber === num
                          ? 'bg-black text-white'
                          : 'bg-white hover:bg-zinc-200 text-black'
                      }`}
                    >
                      {num.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Goal Metric */}
              <div>
                <label className="block text-[11px] font-mono-brutal font-bold text-black uppercase tracking-wider mb-1">
                  METRIC_TARGET:
                </label>
                <select
                  value={targetGoalMetric}
                  onChange={(e) => setTargetGoalMetric(e.target.value as 'tasks' | 'confirmed')}
                  disabled={isProcessing || isAutonomousActive}
                  className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs font-mono-brutal font-bold text-black focus:outline-none shadow-[2px_2px_0_#000]"
                >
                  <option value="tasks">TOTAL TASKS COMPLETED</option>
                  <option value="confirmed">LIVE CONFIRMED (200 OK)</option>
                </select>
                <p className="text-[10px] font-mono-brutal text-zinc-600 mt-1">
                  Auto-loops until milestone threshold is hit.
                </p>
              </div>

              {/* Auto Cycle URLs & Status */}
              <div className="flex flex-col justify-between">
                <div>
                  <label className="block text-[11px] font-mono-brutal font-bold text-black uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Repeat className="w-3.5 h-3.5 text-black" />
                    <span>ROTATION_RULE:</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={autoCycleUrls}
                      onChange={(e) => setAutoCycleUrls(e.target.checked)}
                      disabled={isProcessing || isAutonomousActive}
                      className="w-3.5 h-3.5 border-2 border-black accent-[#ff4d00]"
                    />
                    <span className="text-xs font-mono-brutal font-bold text-black">CONTINUOUS URL ROTATION</span>
                  </label>
                </div>

                {isAutonomousActive && (
                  <div className="mt-2 p-2 bg-white border-2 border-black text-xs font-mono-brutal font-bold text-black flex items-center justify-between shadow-[2px_2px_0_#000]">
                    <span>
                      PASS #{autonomousBatchCount}: {autonomousAccumulatedCount}/{autonomousTargetGoal}
                    </span>
                    <button
                      type="button"
                      onClick={onStopAutonomous}
                      className="ml-2 text-[#ff4d00] hover:underline uppercase text-[10px]"
                    >
                      STOP
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono-brutal font-bold text-black">
            <Globe className="w-4 h-4 text-black" />
            <span>SELECTED_BUFFER: <strong className="text-[#ff4d00]">{uniqueUrls.length} TARGETS</strong></span>
          </div>

          {isAutonomousActive && onStopAutonomous && (
            <button
              type="button"
              onClick={onStopAutonomous}
              className="px-5 py-3 bg-black hover:bg-zinc-800 text-white font-mono-brutal font-bold text-xs uppercase border-4 border-black shadow-[4px_4px_0_#ff4d00] transition-all flex items-center gap-2 cursor-pointer"
            >
              <StopCircle className="w-4 h-4 text-[#ff4d00]" />
              <span>DISENGAGE_AUTONOMOUS</span>
            </button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {isProcessing ? (
              <button
                type="button"
                onClick={onCancelJob}
                className="px-6 py-3 bg-black hover:bg-zinc-800 text-[#ff4d00] font-mono-brutal font-bold text-xs uppercase border-4 border-black shadow-[4px_4px_0_#000] flex items-center gap-2 cursor-pointer"
              >
                <AlertCircle className="w-4 h-4 text-[#ff4d00]" />
                <span>CANCEL_ACTIVE_JOB</span>
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#ff4d00] hover:bg-[#ff5c14] text-black font-mono-brutal font-bold text-sm uppercase border-4 border-black shadow-[4px_4px_0_#000] flex items-center gap-2 transition-all cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0_#000]"
              >
                {isAutonomousEnabled ? (
                  <>
                    <Bot className="w-4 h-4 text-black" />
                    <span>LAUNCH_AUTONOMOUS_LOOP (GOAL: {targetGoalNumber})</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black text-black" />
                    <span>RUN_BATCH_INDEX_JOB</span>
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
