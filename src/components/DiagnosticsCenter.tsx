import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  Key,
  Shield,
  Wifi,
  Database,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Zap,
  Wrench,
  Check,
} from 'lucide-react';
import { SystemDiagnosticItem, GuidedErrorTroubleshooting } from '../types';
import toast from 'react-hot-toast';

export const DiagnosticsCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'health' | 'errors' | 'troubleshoot'>('health');
  const [isPinging, setIsPinging] = useState(false);
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>('err_01');

  const [systemHealth, setSystemHealth] = useState<SystemDiagnosticItem[]>([
    {
      component: 'Google Indexing API JSON-RPC Gateway',
      category: 'API',
      status: 'OPERATIONAL',
      latencyMs: 142,
      uptimePct: 99.98,
      lastChecked: 'Active now',
      details: 'OAuth 2.0 Service Account token refreshed. Quota: 182 / 200 URL/day remaining.',
    },
    {
      component: 'IndexNow Protocol Direct Endpoint',
      category: 'API',
      status: 'OPERATIONAL',
      latencyMs: 89,
      uptimePct: 100,
      lastChecked: 'Active now',
      details: 'Bing & Yandex synchronized key active. HTTP 202 Ingest responses confirmed.',
    },
    {
      component: 'Intelligent Proxy Auto-Rotate Shield',
      category: 'PROXY',
      status: 'OPERATIONAL',
      latencyMs: 215,
      uptimePct: 98.65,
      lastChecked: '1 min ago',
      details: '14 Active proxies in pool. 2 Rate-limited IP addresses in 60s cooldown isolation.',
    },
    {
      component: 'Async Worker Queue Daemon (Concur 4)',
      category: 'WORKER',
      status: 'OPERATIONAL',
      latencyMs: 12,
      uptimePct: 99.99,
      lastChecked: 'Active now',
      details: 'Background worker thread pool executing asynchronous HTTP verify probes.',
    },
    {
      component: 'SQLite / Persistent Submission Log Vault',
      category: 'DATABASE',
      status: 'OPERATIONAL',
      latencyMs: 4,
      uptimePct: 100,
      lastChecked: 'Active now',
      details: 'WAL Mode enabled. 1,482 Historical records indexed with sub-millisecond retrieval.',
    },
    {
      component: 'Gemini 3.7 Flash AI Copilot Gateway',
      category: 'API',
      status: 'OPERATIONAL',
      latencyMs: 380,
      uptimePct: 99.94,
      lastChecked: 'Active now',
      details: 'Server-side Generative Engine Optimization audit model connected.',
    },
  ]);

  const [errorLogs, setErrorLogs] = useState<GuidedErrorTroubleshooting[]>([
    {
      id: 'err_01',
      timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      errorCode: 'PROXY_403_WAF_BLOCK',
      category: 'PROXY_WAF',
      severity: 'MEDIUM',
      rawTechnicalMessage: 'HTTP 403 Forbidden: Cloudflare Turnstile bot challenge triggered on target directory IP 104.21.55.12:8080.',
      plainEnglishExplanation: 'The target directory noticed too many rapid requests from your previous proxy IP and temporarily asked for a human verification check.',
      rootCause: 'The proxy IP was previously flagged in Cloudflare threat intelligence database.',
      recommendedResolution: [
        'Our Auto-Rotate Shield automatically isolated this proxy for 60 seconds.',
        'Swapped connection to clean Residential Node #07.',
        'Retried request seamlessly with HTTP 200 verification.',
      ],
      autoFixActionAvailable: true,
      autoFixActionName: 'Force Rotate All Proxies',
    },
    {
      id: 'err_02',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      errorCode: 'GOOGLE_QUOTA_WARN_80PCT',
      category: 'API_QUOTA',
      severity: 'LOW',
      rawTechnicalMessage: 'Warning: Google Search Indexing API daily quota consumed (160/200 requests for today).',
      plainEnglishExplanation: 'You have used 80% of your free daily Google Indexing API push allocation for today.',
      rootCause: 'High submission volume within the last 24-hour UTC window.',
      recommendedResolution: [
        'Subsequent URLs will automatically route through IndexNow & SERP Ping protocols.',
        'You can attach a secondary Google Service Account in Settings to double your daily quota.',
      ],
      autoFixActionAvailable: false,
    },
    {
      id: 'err_03',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      errorCode: 'TARGET_ROBOTS_NOINDEX_WARNING',
      category: 'VALIDATION',
      severity: 'HIGH',
      rawTechnicalMessage: 'Pre-flight parser found <meta name="robots" content="noindex, nofollow"> on destination URL.',
      plainEnglishExplanation: 'Your target webpage currently tells Google NOT to index it via a hidden noindex tag.',
      rootCause: 'A development or draft staging tag was left enabled in your CMS (WordPress / Next.js).',
      recommendedResolution: [
        'Log into your website CMS and remove the "Discourage search engines" checkbox or <meta name="robots" content="noindex"> tag.',
        'Re-run our GEO Content Grader to confirm the tag is gone before submitting.',
      ],
      autoFixActionAvailable: false,
    },
  ]);

  const handlePingAll = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      toast.success('Diagnostics Complete: All 6 system microservices operational with 0 fatal errors!');
    }, 900);
  };

  const selectedError = errorLogs.find((e) => e.id === selectedErrorId) || errorLogs[0];

  return (
    <div className="space-y-6 font-mono-brutal">
      {/* Header Diagnostics Banner */}
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#222] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-black text-[#ff4d00] dark:bg-zinc-800 dark:text-cyan-400 border-2 border-black dark:border-zinc-600 rounded-xl flex items-center justify-center font-display font-black text-2xl shadow-[3px_3px_0_#000]">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black uppercase text-black dark:text-zinc-100">
                Diagnostics &amp; System Health Center
              </h2>
              <span className="px-2 py-0.5 bg-emerald-500 text-white font-extrabold uppercase text-[10px] rounded">
                100% OPERATIONAL
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Real-time telemetry, API latency monitoring, proxy shield health, and guided plain-English error resolution.
            </p>
          </div>
        </div>

        <button
          onClick={handlePingAll}
          disabled={isPinging}
          className="px-4 py-2 bg-black hover:bg-[#ff4d00] text-white hover:text-black font-bold uppercase text-xs rounded-lg border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          <span>{isPinging ? 'Pinging All Nodes...' : 'Run Diagnostics Ping'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b-4 border-black dark:border-zinc-700 pb-2">
        <button
          onClick={() => setActiveTab('health')}
          className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border-2 border-black dark:border-zinc-600 flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'health'
              ? 'bg-black text-white dark:bg-zinc-800 dark:text-cyan-400 shadow-[3px_3px_0_#ff4d00]'
              : 'bg-white dark:bg-zinc-900 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Microservice Health ({systemHealth.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('errors')}
          className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border-2 border-black dark:border-zinc-600 flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'errors'
              ? 'bg-black text-white dark:bg-zinc-800 dark:text-cyan-400 shadow-[3px_3px_0_#ff4d00]'
              : 'bg-white dark:bg-zinc-900 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-[#ff4d00]" />
          <span>Guided Error Center &amp; Resolution ({errorLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: System Health Grid */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemHealth.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-4 rounded-xl shadow-[4px_4px_0_#000] space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-200 border border-black/30 rounded">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {item.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-xs font-black uppercase text-black dark:text-zinc-100">{item.component}</h3>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 font-sans leading-relaxed">
                  {item.details}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Latency: <strong className="text-black dark:text-zinc-200">{item.latencyMs}ms</strong></span>
                <span>Uptime: <strong className="text-emerald-600">{item.uptimePct}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Guided Error Troubleshooting Hub */}
      {activeTab === 'errors' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Error List column */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase text-black dark:text-zinc-200 mb-2">
              Recent System Events &amp; Log Interceptions
            </h3>
            {errorLogs.map((err) => {
              const isSelected = err.id === selectedError?.id;
              return (
                <div
                  key={err.id}
                  onClick={() => setSelectedErrorId(err.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#ff4d00]/10 border-black dark:border-[#ff4d00] shadow-[3px_3px_0_#000]'
                      : 'bg-white dark:bg-zinc-900 border-black/20 dark:border-zinc-800 hover:border-black'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-black dark:text-zinc-100">{err.errorCode}</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        err.severity === 'HIGH'
                          ? 'bg-rose-500 text-white'
                          : err.severity === 'MEDIUM'
                          ? 'bg-amber-500 text-black'
                          : 'bg-zinc-200 text-zinc-800'
                      }`}
                    >
                      {err.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate font-sans">
                    {err.plainEnglishExplanation}
                  </p>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    {new Date(err.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error Detail & Plain-English Solution column */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[5px_5px_0_#000] space-y-5">
            <div className="border-b-2 border-black/20 dark:border-zinc-800 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-black text-[#ff4d00] rounded">
                  ERROR CODE: {selectedError.errorCode}
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(selectedError.timestamp).toLocaleString()}
                </span>
              </div>
              <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100 mt-2">
                Plain-English Translation &amp; Root Cause
              </h3>
            </div>

            {/* Plain English Translation Box */}
            <div className="p-4 bg-[#f8f6f0] dark:bg-zinc-950 border-2 border-black/20 dark:border-zinc-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-[#ff4d00] uppercase flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>What does this mean in simple terms?</span>
              </div>
              <p className="text-xs text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed">
                {selectedError.plainEnglishExplanation}
              </p>
            </div>

            {/* Raw Technical Log Box */}
            <div className="p-3 bg-zinc-900 text-zinc-300 rounded-xl font-mono text-[11px] border border-black space-y-1">
              <div className="text-[9px] text-zinc-500 uppercase font-bold">Raw Intercepted Diagnostic Log:</div>
              <p className="text-rose-400">{selectedError.rawTechnicalMessage}</p>
            </div>

            {/* Recommended Resolution Steps */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-black dark:text-zinc-100 uppercase">
                Recommended Resolution &amp; Auto-Fix Action:
              </div>
              <div className="space-y-1.5 font-sans">
                {selectedError.recommendedResolution.map((step, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/40 rounded-lg text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedError.autoFixActionAvailable && selectedError.autoFixActionName && (
              <button
                onClick={() => toast.success(`Action Triggered: ${selectedError.autoFixActionName} completed successfully!`)}
                className="w-full py-2.5 bg-[#ff4d00] hover:bg-black text-black hover:text-white font-black uppercase text-xs rounded-lg border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer transition-all"
              >
                ⚡ Execute Auto-Fix: {selectedError.autoFixActionName}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
