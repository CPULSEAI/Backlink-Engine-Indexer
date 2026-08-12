import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, RefreshCw, Zap, Server, AlertCircle, Clock, CheckCircle2, Wifi, Globe } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface ProxyHourlyStat {
  hour: number;
  timeLabel: string;
  latencyMs: number;
  successRate: number;
  status: 'healthy' | 'degraded' | 'high_latency';
  requestCount: number;
}

export interface ProxyNodeHealth {
  id: string;
  name: string;
  ip: string;
  region: string;
  type: string;
  avgLatency: number;
  avgSuccessRate: number;
  status: 'OPTIMAL' | 'STABLE' | 'DEGRADED';
  hourlyStats: ProxyHourlyStat[];
}

export interface ProxyHealthData {
  summary: {
    totalProxies: number;
    overallAvgLatency: number;
    overallSuccessRate: number;
    overallHealthScore: number;
    activePoolStatus: string;
    lastUpdated: string;
  };
  heatmapMatrix: ProxyNodeHealth[];
}

export const ProxyHealthHeatmap: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ProxyHealthData | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ nodeName: string; stat: ProxyHourlyStat } | null>(null);

  const fetchProxyHealth = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/proxy-health');
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load proxy health heatmap data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProxyHealth();
  }, []);

  const getCellBgClass = (latencyMs: number) => {
    if (latencyMs < 90) return 'bg-emerald-500 text-zinc-950 font-bold hover:scale-110 shadow-sm shadow-emerald-500/30';
    if (latencyMs < 140) return 'bg-emerald-600/80 text-emerald-100 hover:scale-110';
    if (latencyMs < 200) return 'bg-amber-500/80 text-amber-950 font-bold hover:scale-110';
    if (latencyMs < 300) return 'bg-orange-500/80 text-orange-950 font-bold hover:scale-110';
    return 'bg-rose-600 text-white font-bold hover:scale-110';
  };

  if (loading && !data) {
    return (
      <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-400 font-mono text-xs flex items-center justify-center min-h-[220px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Benchmarking 24-hour proxy node response distribution...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-5 shadow-2xl space-y-5 text-zinc-100 animate-fadeIn">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>24-Hour Proxy Network Health Heatmap</span>
            <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
              Live Latency Distribution
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Visualizes average response times (ms) and success rates across configured proxies over the last 24 hours.
          </p>
        </div>

        <button
          onClick={fetchProxyHealth}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Ping Proxies</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Overall Health Score</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1 flex items-center gap-2">
            <span>{data.summary.overallHealthScore}%</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase font-sans">
              {data.summary.activePoolStatus}
            </span>
          </div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Avg Latency (24h)</div>
          <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
            {data.summary.overallAvgLatency} <span className="text-xs text-zinc-500 font-normal">ms</span>
          </div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Success Rate</div>
          <div className="text-xl font-bold font-mono text-indigo-300 mt-1">
            {data.summary.overallSuccessRate}%
          </div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Configured Nodes</div>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">
            {data.summary.totalProxies} <span className="text-xs text-zinc-500 font-normal">Active Pools</span>
          </div>
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-zinc-400 bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/60">
        <span className="font-bold text-zinc-300">Response Time Legend:</span>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-400 inline-block" />
            <span>&lt; 90ms (Optimal)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600/80 inline-block" />
            <span>90–140ms (Good)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/80 inline-block" />
            <span>140–200ms (Moderate)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-orange-500/80 inline-block" />
            <span>200–300ms (High)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-600 inline-block" />
            <span>&gt; 300ms (Degraded)</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Matrix */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[720px] space-y-2">
          {/* Hour Labels Header (00:00 to 23:00) */}
          <div className="grid grid-cols-25 items-center text-[10px] font-mono text-zinc-500 pb-1 border-b border-zinc-800">
            <div className="col-span-4 font-bold text-zinc-400 pl-1">Proxy Node Pool</div>
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={`h_lbl_${h}`} className="text-center">
                {h % 3 === 0 ? `${h}h` : '•'}
              </div>
            ))}
          </div>

          {/* Proxy Node Rows */}
          {data.heatmapMatrix.map((node) => (
            <div key={node.id} className="grid grid-cols-25 items-center gap-1 bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition-all">
              {/* Proxy Node Info Column */}
              <div className="col-span-4 pr-2">
                <div className="text-xs font-bold text-zinc-200 truncate">{node.name}</div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mt-0.5">
                  <span className="text-cyan-400 font-semibold">{node.region}</span>
                  <span>•</span>
                  <span>{node.avgLatency}ms</span>
                </div>
              </div>

              {/* 24 Hour Heat Cells */}
              {node.hourlyStats.map((stat) => (
                <div
                  key={`cell_${node.id}_${stat.hour}`}
                  onClick={() => setSelectedCell({ nodeName: node.name, stat })}
                  title={`${node.name} @ ${stat.timeLabel}: ${stat.latencyMs}ms (${stat.successRate}% success)`}
                  className={`h-7 rounded-md flex items-center justify-center text-[9px] font-mono cursor-pointer transition-transform ${getCellBgClass(stat.latencyMs)}`}
                >
                  {stat.latencyMs}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Hour Details Callout */}
      {selectedCell && (
        <div className="bg-zinc-900 border border-cyan-500/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-200 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <strong className="text-cyan-300">{selectedCell.nodeName}</strong> at <span className="font-mono text-zinc-300">{selectedCell.stat.timeLabel}</span>:
              <span className="ml-2 font-mono text-emerald-400 font-bold">{selectedCell.stat.latencyMs} ms latency</span>
              <span className="mx-2 text-zinc-600">|</span>
              <span>Success: <strong className="text-indigo-300">{selectedCell.stat.successRate}%</strong></span>
              <span className="mx-2 text-zinc-600">|</span>
              <span>Requests: <strong className="text-amber-300">{selectedCell.stat.requestCount}</strong></span>
            </div>
          </div>
          <button
            onClick={() => setSelectedCell(null)}
            className="text-zinc-500 hover:text-zinc-300 text-xs font-mono shrink-0"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
