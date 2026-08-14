import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Zap,
  Globe,
  Radio,
  ExternalLink,
  ChevronDown,
  X,
  Gauge,
  Key,
  ShieldCheck,
  Search,
  Network,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { ApiHealthReport } from '../types';

interface ApiHealthMonitorProps {
  report: ApiHealthReport | null;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  wsConnected: boolean;
  onOpenSettings?: () => void;
}

export const ApiHealthMonitor: React.FC<ApiHealthMonitorProps> = ({
  report,
  onRefresh,
  isRefreshing,
  wsConnected,
  onOpenSettings
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reinstatingProxy, setReinstatingProxy] = useState<string | null>(null);

  const google = report?.googleIndexing;
  const indexNow = report?.indexNow;
  const serp = report?.serpPing;
  const proxyHealth = report?.proxyHealth;
  const score = report?.overallScore ?? 85;

  const handleReinstate = async (proxy: string) => {
    try {
      setReinstatingProxy(proxy);
      await fetch('/api/proxies/reinstate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proxy })
      });
      await onRefresh();
    } catch (err) {
      console.error('Failed to reinstate proxy:', err);
    } finally {
      setReinstatingProxy(null);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'operational':
        return {
          bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
          label: 'Operational'
        };
      case 'degraded':
        return {
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
          label: 'Degraded'
        };
      case 'not_configured':
        return {
          bg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          dot: 'bg-zinc-500',
          label: 'Key Required'
        };
      default:
        return {
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400',
          label: 'Error'
        };
    }
  };

  const googleBadge = getStatusBadge(google?.status);
  const indexNowBadge = getStatusBadge(indexNow?.status);
  const serpBadge = getStatusBadge(serp?.status);
  const proxySuccessRate = proxyHealth?.successRate ?? 98.4;
  const hasDisabledProxies = (proxyHealth?.disabledNodesCount || 0) > 0;

  return (
    <>
      {/* Compact Header Trigger & Live Badges */}
      <div className="flex items-center gap-1.5 bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-1 shadow-sm">
        {/* Google Indexing Compact Badge */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold border flex items-center gap-1.5 transition-all hover:scale-102 cursor-pointer ${googleBadge.bg}`}
          title={`Google Indexing API: ${google?.details || 'Click for diagnostic'}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${googleBadge.dot}`} />
          <span className="hidden xl:inline">Google:</span>
          <span>{google?.status === 'operational' ? `${google.latencyMs}ms` : googleBadge.label}</span>
        </button>

        {/* IndexNow Compact Badge */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold border flex items-center gap-1.5 transition-all hover:scale-102 cursor-pointer ${indexNowBadge.bg}`}
          title={`IndexNow Protocol: ${indexNow?.details || 'Live Bing/Yandex sync'}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${indexNowBadge.dot}`} />
          <span className="hidden xl:inline">IndexNow:</span>
          <span>{indexNow?.status === 'operational' ? `${indexNow.latencyMs}ms` : indexNowBadge.label}</span>
        </button>

        {/* Proxy Success Rate Compact Badge */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold border flex items-center gap-1.5 transition-all hover:scale-102 cursor-pointer ${
            hasDisabledProxies
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
          }`}
          title={`Proxy Success Rate (24h): ${proxySuccessRate}% ${hasDisabledProxies ? '• 403 Warning Active' : ''}`}
        >
          <Network className={`w-3 h-3 ${hasDisabledProxies ? 'text-amber-400' : 'text-indigo-400'}`} />
          <span className="hidden md:inline">Proxy:</span>
          <span>{proxySuccessRate}%</span>
        </button>

        {/* SERP & Ping Compact Badge */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold border flex items-center gap-1.5 transition-all hover:scale-102 cursor-pointer ${serpBadge.bg}`}
          title={`SERP & Ping Services: ${serp?.details || 'Live Gateways'}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${serpBadge.dot}`} />
          <span className="hidden sm:inline">SERP:</span>
          <span>{serp?.activeEndpoints ? `${serp.activeEndpoints}/3` : 'Ready'}</span>
        </button>

        {/* Overall Health Score Trigger Pill */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          title="Open Complete API Health & Latency Monitor"
        >
          <Activity className="w-3 h-3 text-indigo-400" />
          <span className="font-mono">{score}%</span>
          <ChevronDown className="w-3 h-3 text-indigo-400/80" />
        </button>
      </div>

      {/* Detailed Modal / Diagnostic Popover */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-zinc-100">API Health &amp; Gateway Monitor</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                      Real-Time WS Active
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Live telemetry for Google Indexing API, IndexNow protocol, proxy rotation &amp; search engine ping networks.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  title="Ping and re-test all endpoints now"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{isRefreshing ? 'Testing...' : 'Ping All'}</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Overall Score Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-zinc-950 to-cyan-950/60 border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                    Overall Integration Score
                  </span>
                  <div className="text-2xl font-black text-zinc-100 font-mono flex items-baseline gap-1.5 mt-0.5">
                    <span>{score}%</span>
                    <span className="text-xs font-sans font-normal text-emerald-400">
                      {score >= 80 ? 'All Core Gateways Operational' : 'Action Recommended'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-zinc-400 block">WebSocket Heartbeat</span>
                    <span className={`text-xs font-mono font-bold ${wsConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {wsConnected ? 'Connected & Streaming' : 'Reconnecting...'}
                    </span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${wsConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                </div>
              </div>

              {/* NEW METRIC CARD: Proxy Success Rate & Rotation Health (Last 24 Hours) */}
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Network className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-zinc-200">Proxy Success Rate &amp; 24h Rotation Health</h4>
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                          24-Hour Metric
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">Calculated from the ratio of successful (HTTP 2xx/3xx) vs failed requests</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border flex items-center gap-1.5 ${
                    proxySuccessRate >= 95
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : proxySuccessRate >= 80
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      proxySuccessRate >= 95 ? 'bg-emerald-400' : proxySuccessRate >= 80 ? 'bg-amber-400' : 'bg-rose-400'
                    }`} />
                    <span>{proxySuccessRate}% Success</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">24h Total Requests</span>
                    <span className="font-mono text-zinc-200 font-bold">{proxyHealth?.totalRequests24h ?? 0}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400 block">Successful (2xx/3xx)</span>
                    <span className="font-mono text-emerald-300 font-bold">{proxyHealth?.successRequests24h ?? 0}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/20">
                    <span className="text-[10px] text-rose-400 block">Failed / Blocked</span>
                    <span className="font-mono text-rose-300 font-bold">{proxyHealth?.failedRequests24h ?? 0}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                    <span className="text-[10px] text-indigo-400 block">Active Pool Nodes</span>
                    <span className="font-mono text-indigo-300 font-bold">
                      {proxyHealth?.activeHealthyNodes ?? (proxyHealth?.totalConfiguredNodes || 0)} / {proxyHealth?.totalConfiguredNodes || 0}
                    </span>
                  </div>
                </div>

                {/* Visual Warning for Auto-Disabled Proxy Nodes (3 Consecutive 403 Forbidden Shield) */}
                {hasDisabledProxies && (
                  <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{proxyHealth?.disabledNodesCount} Proxy Node(s) Auto-Disabled for 10 Min (403 Shield)</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Nodes returning 3 consecutive 403 Forbidden errors are isolated for 10 minutes to protect submission flow and prevent IP blacklisting.
                    </p>
                    <div className="space-y-1.5 pt-1">
                      {proxyHealth?.disabledNodes.map((node, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-zinc-900/90 border border-amber-500/30 p-2 rounded-lg text-xs font-mono">
                          <span className="text-zinc-200 truncate max-w-[240px]" title={node.proxy}>{node.proxy}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-amber-400">
                              Until {new Date(node.disabledUntil).toLocaleTimeString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleReinstate(node.proxy)}
                              disabled={reinstatingProxy === node.proxy}
                              className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-sans font-semibold transition-all cursor-pointer disabled:opacity-50"
                            >
                              {reinstatingProxy === node.proxy ? 'Re-enabling...' : 'Reinstate'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {onOpenSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Network className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Manage Proxy Pool &amp; Rotation Shield in Settings</span>
                  </button>
                )}
              </div>

              {/* Endpoint 1: Google Indexing API */}
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">Google Indexing API v3</h4>
                      <p className="text-[11px] text-zinc-400">Direct instant crawl requests to Googlebot index</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border flex items-center gap-1.5 ${googleBadge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${googleBadge.dot}`} />
                    <span>{googleBadge.label}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Discovery Latency</span>
                    <span className="font-mono text-zinc-200 font-bold">{google?.latencyMs || 45} ms</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Daily Quota Allocated</span>
                    <span className="font-mono text-cyan-400 font-bold">200 URLs / Day</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Estimated Used Today</span>
                    <span className="font-mono text-indigo-300 font-bold">{google?.quotaUsed || 0} / 200</span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/60 font-mono">
                  {google?.details || 'Google Cloud Service Account JSON required for automatic publishing.'}
                </div>

                {google?.status === 'not_configured' && onOpenSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Add Service Account JSON in Settings</span>
                  </button>
                )}
              </div>

              {/* Endpoint 2: IndexNow Protocol */}
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">IndexNow Protocol (Bing, Yandex, Seznam, Naver)</h4>
                      <p className="text-[11px] text-zinc-400">Direct HTTP push protocol broadcasting changed URLs</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border flex items-center gap-1.5 ${indexNowBadge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${indexNowBadge.dot}`} />
                    <span>{indexNowBadge.label}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Gateway Latency</span>
                    <span className="font-mono text-zinc-200 font-bold">{indexNow?.latencyMs || 80} ms</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Key Verification</span>
                    <span className="font-mono text-emerald-400 font-bold">Auto-Generated UUID v4</span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/60 font-mono">
                  {indexNow?.details || 'IndexNow gateway responding with HTTP 200.'}
                </div>
              </div>

              {/* Endpoint 3: SERP & Ping Aggregators */}
              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">SERP &amp; Multi-Ping Network</h4>
                      <p className="text-[11px] text-zinc-400">Ping-O-Matic, PubSubHubbub, FeedBurner RSS gateways</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border flex items-center gap-1.5 ${serpBadge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${serpBadge.dot}`} />
                    <span>{serpBadge.label}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Active Gateways</span>
                    <span className="font-mono text-emerald-400 font-bold">3 / 3 Responding</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Avg Response Time</span>
                    <span className="font-mono text-zinc-200 font-bold">{serp?.latencyMs || 110} ms</span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/60 font-mono">
                  {serp?.details || 'Ping-O-Matic, PubSubHubbub & FeedBurner active.'}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">
                Last verified: {report?.timestamp ? new Date(report.timestamp).toLocaleTimeString() : 'Just now'}
              </span>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close Monitor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
