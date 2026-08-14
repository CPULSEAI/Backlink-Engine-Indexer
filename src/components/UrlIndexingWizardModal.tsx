import React, { useState } from 'react';
import {
  Send,
  Upload,
  Globe,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Shield,
  Layers,
  HelpCircle,
  Brain,
  Info,
} from 'lucide-react';
import { IndexingCampaignConfig } from '../types';
import toast from 'react-hot-toast';

interface UrlIndexingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchCampaign: (config: IndexingCampaignConfig) => Promise<void>;
  defaultConcurrency?: number;
}

export const UrlIndexingWizardModal: React.FC<UrlIndexingWizardModalProps> = ({
  isOpen,
  onClose,
  onLaunchCampaign,
  defaultConcurrency = 4,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [campaignName, setCampaignName] = useState<string>(
    `Campaign_GEO_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`
  );
  const [rawUrlInput, setRawUrlInput] = useState<string>('');
  const [parsedUrls, setParsedUrls] = useState<string[]>([]);
  const [engineConfig, setEngineConfig] = useState({
    googleIndexingApi: true,
    indexNow: true,
    multiPing: true,
    directoryNetworks: true,
  });
  const [concurrency, setConcurrency] = useState<number>(defaultConcurrency);
  const [retryStrategy, setRetryStrategy] = useState<'AGGRESSIVE' | 'STANDARD' | 'CONSERVATIVE'>('STANDARD');
  const [proxyMode, setProxyMode] = useState<'AUTO_ROTATE' | 'RESIDENTIAL_ONLY' | 'DIRECT'>('AUTO_ROTATE');
  const [dripIntervalMinutes, setDripIntervalMinutes] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleProcessUrlText = (text: string) => {
    setRawUrlInput(text);
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('http://') || l.startsWith('https://'));
    setParsedUrls(Array.from(new Set(lines)));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleProcessUrlText(content);
      toast.success(`Loaded file with detected URLs!`);
    };
    reader.readAsText(file);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (parsedUrls.length === 0) {
        toast.error('Please input or upload at least one valid HTTP/HTTPS URL.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleExecute = async () => {
    setIsSubmitting(true);
    try {
      const config: IndexingCampaignConfig = {
        campaignName: campaignName.trim() || 'Untitled Campaign',
        targetUrls: parsedUrls,
        engines: engineConfig,
        concurrencyThreads: concurrency,
        retryStrategy,
        maxRetries: retryStrategy === 'AGGRESSIVE' ? 5 : retryStrategy === 'STANDARD' ? 3 : 1,
        proxyRoutingMode: proxyMode,
        scheduledDripIntervalMinutes: dripIntervalMinutes > 0 ? dripIntervalMinutes : undefined,
      };

      await onLaunchCampaign(config);
      toast.success(`🚀 Indexing Campaign "${config.campaignName}" successfully dispatched!`);
      onClose();
    } catch (err: any) {
      toast.error('Failed to launch indexing campaign: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-sans">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#111] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-100 to-white dark:from-zinc-950 dark:to-zinc-900 border-b-4 border-black dark:border-zinc-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-[#ff4d00] dark:bg-zinc-800 dark:text-cyan-400 border-2 border-black dark:border-zinc-600 rounded-xl flex items-center justify-center font-black shadow-[2px_2px_0_#000]">
              <Zap className="w-5 h-5 fill-[#ff4d00]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase text-black dark:text-zinc-100 font-mono-brutal">
                5-Step Enterprise URL Submission &amp; Indexing Wizard
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono-brutal">
                Step {currentStep} of 5: {
                  currentStep === 1 ? 'Target URLs & Data Sources' :
                  currentStep === 2 ? 'Engine Selection & Gateways' :
                  currentStep === 3 ? 'Concurrency & Proxy Shield' :
                  currentStep === 4 ? 'Plain-English Pre-Flight Review' :
                  'Execute & Background Stream'
                }
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-zinc-700 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-600 rounded-lg text-xs font-bold uppercase font-mono-brutal shadow-[2px_2px_0_#000] cursor-pointer"
          >
            ✕ ESC
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="bg-zinc-100 dark:bg-zinc-950 border-b-2 border-black dark:border-zinc-800 px-4 py-2 flex items-center justify-between font-mono-brutal text-xs overflow-x-auto gap-2">
          {[
            { num: 1, label: '1. URLs' },
            { num: 2, label: '2. Engines' },
            { num: 3, label: '3. Routing & Shield' },
            { num: 4, label: '4. Review' },
            { num: 5, label: '5. Launch' },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 whitespace-nowrap ${
                currentStep === s.num
                  ? 'bg-[#ff4d00] text-black border-black font-extrabold shadow-[2px_2px_0_#000]'
                  : currentStep > s.num
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40 font-bold'
                  : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-300 dark:border-zinc-800'
              }`}
            >
              <span>{s.label}</span>
              {currentStep > s.num && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
            </div>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 font-mono-brutal">
          {/* STEP 1: Target URLs */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-[#f8f6f0] dark:bg-zinc-950 border-2 border-black/20 dark:border-zinc-800 rounded-xl space-y-2">
                <label className="block text-xs font-bold uppercase text-black dark:text-zinc-100">
                  Campaign Identifier / Name
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-lg text-xs font-bold font-mono-brutal"
                  placeholder="e.g. Q3 Product Launch Indexing"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase text-black dark:text-zinc-100">
                    Paste Target URLs (One per line)
                  </label>
                  <span className="text-xs font-bold text-[#ff4d00]">
                    {parsedUrls.length} Valid URLs Detected
                  </span>
                </div>
                <textarea
                  value={rawUrlInput}
                  onChange={(e) => handleProcessUrlText(e.target.value)}
                  rows={8}
                  placeholder="https://yourdomain.com/landing-page&#10;https://yourdomain.com/blog/ai-search-guide&#10;https://yourdomain.com/products/geo-suite"
                  className="w-full p-3 bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 rounded-xl text-xs font-mono-brutal focus:ring-2 focus:ring-[#ff4d00]"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-zinc-100 dark:bg-zinc-950 border-2 border-black/20 dark:border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 text-xs">
                  <Upload className="w-4 h-4 text-[#ff4d00]" />
                  <span className="font-bold text-black dark:text-zinc-200">Or import from CSV / TXT sitemap file:</span>
                </div>
                <label className="px-3 py-1.5 bg-white dark:bg-zinc-800 hover:bg-black hover:text-white text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-600 rounded-lg text-xs font-bold uppercase shadow-[2px_2px_0_#000] cursor-pointer transition-all">
                  Browse File
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* STEP 2: Engine Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase text-black dark:text-zinc-100 mb-1">
                  Select Indexing Gateways &amp; Push Protocols
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Enable high-speed push APIs to notify Google, Bing, Yandex, and AI bot crawlers simultaneously.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: 'googleIndexingApi',
                    title: 'Google Indexing API (Service Account)',
                    desc: 'Direct JSON-RPC calls to Google API gateway for instant bot crawl dispatch (< 2 hours).',
                    active: engineConfig.googleIndexingApi,
                    badge: 'FASTEST BOT TRIGGER',
                  },
                  {
                    id: 'indexNow',
                    title: 'IndexNow Protocol (Bing / Yandex)',
                    desc: 'Standardized ping protocol syncing with Microsoft Bing, Seznam, Naver, and Yandex.',
                    active: engineConfig.indexNow,
                    badge: 'BING & CO-PARTNERS',
                  },
                  {
                    id: 'multiPing',
                    title: 'Multi-Ping SERP Aggregator',
                    desc: 'Broadcast XML-RPC pings to 25+ RSS/SERP notification endpoints simultaneously.',
                    active: engineConfig.multiPing,
                    badge: 'WIDE BROADCAST',
                  },
                  {
                    id: 'directoryNetworks',
                    title: 'High-Authority Backlink Directories',
                    desc: 'Submit verified link signals to high-traffic authority profile indexes.',
                    active: engineConfig.directoryNetworks,
                    badge: 'AUTHORITY SIGNALS',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      setEngineConfig((prev: any) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }))
                    }
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      item.active
                        ? 'bg-white dark:bg-zinc-900 border-black dark:border-zinc-600 shadow-[3px_3px_0_#ff4d00]'
                        : 'bg-zinc-100 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-black text-[#ff4d00] rounded uppercase">
                        {item.badge}
                      </span>
                      <input
                        type="checkbox"
                        checked={item.active}
                        readOnly
                        className="w-4 h-4 accent-[#ff4d00]"
                      />
                    </div>
                    <h4 className="text-xs font-black uppercase text-black dark:text-zinc-100">{item.title}</h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Concurrency & Proxy Routing */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="p-4 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-black dark:text-zinc-100">
                    Concurrency Thread Count
                  </label>
                  <span className="px-2 py-0.5 bg-[#ff4d00] text-black font-extrabold text-xs border border-black rounded">
                    {concurrency} Concurrent Workers
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={concurrency}
                  onChange={(e) => setConcurrency(Number(e.target.value))}
                  className="w-full accent-[#ff4d00]"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>1 Worker (Gentle)</span>
                  <span>4 Workers (Balanced)</span>
                  <span>12 Workers (Max Throughput)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-xl space-y-2">
                  <label className="text-xs font-bold uppercase text-black dark:text-zinc-100">
                    Intelligent Retry Policy
                  </label>
                  <select
                    value={retryStrategy}
                    onChange={(e: any) => setRetryStrategy(e.target.value)}
                    className="w-full p-2 bg-[#f8f6f0] dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 rounded-lg text-xs font-bold"
                  >
                    <option value="STANDARD">Standard (3 Retries with Exponential Backoff)</option>
                    <option value="AGGRESSIVE">Aggressive (5 Retries with Auto-Proxy Switch)</option>
                    <option value="CONSERVATIVE">Conservative (1 Retry, Fail-Fast)</option>
                  </select>
                </div>

                <div className="p-4 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-xl space-y-2">
                  <label className="text-xs font-bold uppercase text-black dark:text-zinc-100">
                    Proxy Routing Shield
                  </label>
                  <select
                    value={proxyMode}
                    onChange={(e: any) => setProxyMode(e.target.value)}
                    className="w-full p-2 bg-[#f8f6f0] dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 rounded-lg text-xs font-bold"
                  >
                    <option value="AUTO_ROTATE">Auto-Rotate on 403 / 429 / WAF Block (Recommended)</option>
                    <option value="RESIDENTIAL_ONLY">Residential Proxies Only</option>
                    <option value="DIRECT">Direct Ingestion (No Proxy)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-[#f8f6f0] dark:bg-zinc-950 border-2 border-black/20 dark:border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-black dark:text-zinc-100 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#ff4d00]" />
                    <span>Drip Campaign Scheduling (Optional)</span>
                  </label>
                  <span className="text-xs font-bold text-black dark:text-zinc-200">
                    {dripIntervalMinutes === 0 ? 'Instant Batch Fire' : `Drip every ${dripIntervalMinutes} mins`}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="1440"
                  step="5"
                  value={dripIntervalMinutes}
                  onChange={(e) => setDripIntervalMinutes(Number(e.target.value))}
                  placeholder="0 = Submit all immediately"
                  className="w-full p-2 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-lg text-xs font-mono-brutal"
                />
                <p className="text-[10px] text-zinc-500">
                  Enter minutes between sub-batches to simulate natural organic crawl patterns. Set to 0 for instant processing.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Plain-English Review */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-zinc-950 dark:to-zinc-900 border-3 border-black dark:border-zinc-700 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-[#ff4d00]">
                  <Brain className="w-5 h-5" />
                  <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100">
                    Executive Plain-English Pre-Flight Summary
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-zinc-800 dark:text-zinc-300 font-sans">
                  <p>
                    • You are preparing to submit <strong>{parsedUrls.length} distinct URLs</strong> under campaign <strong>"{campaignName}"</strong>.
                  </p>
                  <p>
                    • We will broadcast these URLs across <strong>{Object.values(engineConfig).filter(Boolean).length} configured push engines</strong> (Google API, IndexNow, and SERP Aggregators).
                  </p>
                  <p>
                    • Submissions will be executed using <strong>{concurrency} parallel worker threads</strong> protected by our <strong>{proxyMode} Auto-Rotate Shield</strong> to prevent IP rate-limiting.
                  </p>
                  <p>
                    • Expected full crawl verification feedback: <strong>&lt; 5 minutes</strong> from launch.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-zinc-100 dark:bg-zinc-950 border-2 border-black/20 dark:border-zinc-800 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-black dark:text-zinc-200 uppercase">Target Preview (First 3 URLs):</div>
                {parsedUrls.slice(0, 3).map((url, i) => (
                  <div key={i} className="p-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded text-zinc-700 dark:text-zinc-300 truncate">
                    {i + 1}. {url}
                  </div>
                ))}
                {parsedUrls.length > 3 && (
                  <div className="text-[11px] text-zinc-500 font-bold">
                    ...and {parsedUrls.length - 3} more URLs ready for execution.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Launch */}
          {currentStep === 5 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-[#ff4d00] text-black border-4 border-black mx-auto rounded-2xl flex items-center justify-center shadow-[4px_4px_0_#000] animate-pulse">
                <Rocket className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black uppercase text-black dark:text-zinc-100">
                Ready to Dispatch Background Ingestion Pipeline!
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                Click below to launch workers. You will be able to watch real-time HTTP 200/202 responses and live SERP confirmation streaming.
              </p>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="p-4 bg-zinc-100 dark:bg-zinc-950 border-t-4 border-black dark:border-zinc-700 flex items-center justify-between font-mono-brutal">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className="px-4 py-2 bg-white dark:bg-zinc-800 hover:bg-zinc-200 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-600 rounded-lg text-xs font-bold uppercase shadow-[2px_2px_0_#000] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Previous
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-black hover:bg-[#ff4d00] text-white hover:text-black border-2 border-black rounded-lg text-xs font-bold uppercase shadow-[2px_2px_0_#000] cursor-pointer transition-all"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleExecute}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#ff4d00] hover:bg-black text-black hover:text-white border-2 border-black rounded-lg text-xs font-black uppercase shadow-[3px_3px_0_#000] cursor-pointer transition-all flex items-center gap-2"
            >
              {isSubmitting ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isSubmitting ? 'DISPATCHING WORKERS...' : 'EXECUTE CAMPAIGN NOW'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function Rocket(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
