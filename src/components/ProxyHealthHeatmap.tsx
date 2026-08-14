import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  RefreshCw,
  Zap,
  Server,
  AlertCircle,
  Clock,
  CheckCircle2,
  Wifi,
  Globe,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Shield,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
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

interface TimelineHourData {
  hour: number;
  hourLabel: string;
  totalRequests: number;
  totalSuccess: number;
  totalFailed: number;
  wafRateLimitBlocks: number;
  connectionTimeouts: number;
  successRate: number;
  healthBadge: 'Optimal' | 'Stable' | 'WAF Surge';
}

interface CorrelationInsight {
  pattern: string;
  timeWindow: string;
  description: string;
  impact: string;
  recommendation: string;
}

interface TimelineResponse {
  summary: {
    totalRequests24h: number;
    totalSuccess24h: number;
    totalFailed24h: number;
    totalWafBlocks24h: number;
    avgSuccessRate24h: number;
    activeCooldownNodes: number;
  };
  timeline: TimelineHourData[];
  correlationInsights: CorrelationInsight[];
}

export const ProxyHealthHeatmap: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ProxyHealthData | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineResponse | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ nodeName: string; stat: ProxyHourlyStat } | null>(null);
  const [viewMode, setViewMode] = useState<'timeline_chart' | 'matrix_heatmap'>('timeline_chart');

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [healthRes, timelineRes] = await Promise.all([
        axios.get('/api/proxy-health').catch(() => null),
        axios.get('/api/analytics/24h-proxy-timeline').catch(() => null),
      ]);

      if (healthRes?.data) setData(healthRes.data);
      if (timelineRes?.data) setTimelineData(timelineRes.data);
    } catch (err) {
      toast.error('Failed to load proxy health telemetry data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getCellBgClass = (latencyMs: number) => {
    if (latencyMs < 90) return 'bg-[#ff4d00] text-black font-bold border border-black hover:scale-110 shadow-[1px_1px_0_#000]';
    if (latencyMs < 140) return 'bg-black text-white font-bold border border-black hover:scale-110';
    if (latencyMs < 200) return 'bg-[#ffe8dd] text-black font-bold border border-black hover:scale-110';
    if (latencyMs < 300) return 'bg-[#f2efeb] text-black border border-black hover:scale-110';
    return 'bg-white text-zinc-500 border border-black hover:scale-110';
  };

  const CustomTimelineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0_#000] font-mono-brutal text-xs text-black space-y-1">
          <div className="font-bold border-b-2 border-black pb-1 uppercase">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={`tl-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 font-bold uppercase">
                <span className="w-2 h-2 border border-black" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <strong className="text-black">
                {entry.value}
                {entry.dataKey === 'successRate' ? '%' : ''}
              </strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_#000] space-y-6 text-black animate-fadeIn">
      {/* Header & Sub-tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black">
        <div>
          <h3 className="font-mono-brutal text-sm font-bold text-black flex items-center gap-2 uppercase">
            <Server className="w-4 h-4 text-[#ff4d00]" />
            <span>24-HOUR PROXY SUCCESS RATE &amp; HEALTH MATRIX</span>
            <span className="text-[10px] font-mono-brutal bg-black text-white px-2 py-0.5 font-bold uppercase">
              TELEMETRY_ENGINE
            </span>
          </h3>
          <p className="text-xs text-zinc-700 font-mono-brutal mt-0.5">
            Tracks real-time proxy delivery rates, WAF rate-limit blocks, and time-of-day correlation insights.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#f2efeb] border-2 border-black p-0.5 gap-1">
            <button
              onClick={() => setViewMode('timeline_chart')}
              className={`px-3 py-1 text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer ${
                viewMode === 'timeline_chart'
                  ? 'bg-[#ff4d00] text-black shadow-[1px_1px_0_#000]'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              24H_TIMELINE
            </button>
            <button
              onClick={() => setViewMode('matrix_heatmap')}
              className={`px-3 py-1 text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer ${
                viewMode === 'matrix_heatmap'
                  ? 'bg-black text-white shadow-[1px_1px_0_#000]'
                  : 'text-black hover:bg-zinc-200'
              }`}
            >
              LATENCY_HEATMAP
            </button>
          </div>

          <button
            onClick={fetchAllData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-100 text-black text-xs font-mono-brutal font-bold uppercase border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#ff4d00] ${loading ? 'animate-spin' : ''}`} />
            <span>REFRESH</span>
          </button>
        </div>
      </div>

      {/* 24-Hour Overview Telemetry Stat Cards */}
      {timelineData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#f2efeb] border-2 border-black p-3.5 shadow-[2px_2px_0_#000]">
            <div className="text-[10px] uppercase font-bold text-zinc-700 font-mono-brutal">24H AVG SUCCESS RATE</div>
            <div className="text-xl font-bold font-mono-brutal text-[#ff4d00] mt-1 flex items-center justify-between">
              <span>{timelineData.summary.avgSuccessRate24h}%</span>
              <span className="text-[10px] bg-black text-white px-1.5 py-0.5 uppercase font-mono-brutal font-bold">
                OPTIMAL
              </span>
            </div>
          </div>

          <div className="bg-[#f2efeb] border-2 border-black p-3.5 shadow-[2px_2px_0_#000]">
            <div className="text-[10px] uppercase font-bold text-zinc-700 font-mono-brutal">24H PROXY REQUESTS</div>
            <div className="text-xl font-bold font-mono-brutal text-black mt-1">
              {timelineData.summary.totalRequests24h.toLocaleString()} <span className="text-xs text-zinc-600 font-normal">HTTP</span>
            </div>
          </div>

          <div className="bg-[#f2efeb] border-2 border-black p-3.5 shadow-[2px_2px_0_#000]">
            <div className="text-[10px] uppercase font-bold text-zinc-700 font-mono-brutal">403/429 WAF BLOCKS</div>
            <div className="text-xl font-bold font-mono-brutal text-black mt-1 flex items-center justify-between">
              <span>{timelineData.summary.totalWafBlocks24h} BLOCKED</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-black px-1.5 py-0.5 uppercase font-mono-brutal font-bold">
                SHIELD ACTIVE
              </span>
            </div>
          </div>

          <div className="bg-[#f2efeb] border-2 border-black p-3.5 shadow-[2px_2px_0_#000]">
            <div className="text-[10px] uppercase font-bold text-zinc-700 font-mono-brutal">ISOLATED NODES</div>
            <div className="text-xl font-bold font-mono-brutal text-black mt-1 flex items-center justify-between">
              <span>0 IN COOLDOWN</span>
              <span className="text-[10px] bg-black text-white px-1.5 py-0.5 uppercase font-mono-brutal font-bold">
                100% HEALTHY
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: 24-HOUR SUCCESS RATE TIMELINE CHART */}
      {viewMode === 'timeline_chart' && timelineData && (
        <div className="space-y-4">
          <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-brutal font-bold border-b-2 border-black pb-2">
              <span className="flex items-center gap-1.5 uppercase">
                <TrendingUp className="w-4 h-4 text-[#ff4d00]" />
                <span>24-HOUR SUCCESS RATE (%) VS. RATE LIMIT CHALLENGES</span>
              </span>
              <span className="text-[10px] text-zinc-600">HOURLY TIME BINS (UTC)</span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData.timeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSuccessRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff4d00" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ff4d00" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                  <XAxis dataKey="hourLabel" stroke="#000000" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="rate" orientation="left" stroke="#ff4d00" fontSize={10} tickLine={false} domain={[70, 100]} unit="%" />
                  <YAxis yAxisId="count" orientation="right" stroke="#000000" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTimelineTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} formatter={(val) => <span className="font-mono-brutal font-bold text-black">{val}</span>} />
                  <Area
                    yAxisId="rate"
                    type="monotone"
                    dataKey="successRate"
                    name="PROXY SUCCESS RATE (%)"
                    stroke="#ff4d00"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSuccessRate)"
                  />
                  <Bar
                    yAxisId="count"
                    dataKey="wafRateLimitBlocks"
                    name="429/403 WAF CHALLENGES"
                    fill="#000000"
                    barSize={12}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CORRELATION INSIGHTS CARDS */}
          {timelineData.correlationInsights && timelineData.correlationInsights.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-mono-brutal font-bold uppercase text-black border-b-2 border-black pb-1">
                <Lightbulb className="w-4 h-4 text-[#ff4d00]" />
                <span>TIME-OF-DAY CORRELATION INSIGHTS &amp; RATE-LIMITING PATTERNS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {timelineData.correlationInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f2efeb] border-2 border-black p-3.5 shadow-[2px_2px_0_#000] flex flex-col justify-between space-y-2.5 font-mono-brutal text-xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-black text-white uppercase">
                          {insight.timeWindow}
                        </span>
                        <span className="text-[10px] font-bold text-[#ff4d00] uppercase">
                          {insight.impact}
                        </span>
                      </div>
                      <h4 className="font-bold text-black uppercase text-xs pt-1">{insight.pattern}</h4>
                      <p className="text-[11px] text-zinc-700 leading-snug">{insight.description}</p>
                    </div>

                    <div className="pt-2 border-t border-black/30 text-[10px] text-black">
                      <strong className="text-[#ff4d00] uppercase block mb-0.5">💡 Strategy:</strong>
                      <span>{insight.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: GRANULAR LATENCY MATRIX HEATMAP */}
      {viewMode === 'matrix_heatmap' && data && (
        <div className="space-y-4">
          {/* Color Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono-brutal text-black bg-[#f2efeb] p-2.5 border-2 border-black shadow-[2px_2px_0_#000]">
            <span className="font-bold uppercase">RESPONSE TIME LEGEND:</span>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#ff4d00] border border-black inline-block" />
                <span>&lt; 90MS (OPTIMAL)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-black border border-black inline-block" />
                <span>90–140MS (GOOD)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#ffe8dd] border border-black inline-block" />
                <span>140–200MS (MODERATE)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#f2efeb] border border-black inline-block" />
                <span>200–300MS (HIGH)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-white border border-black inline-block" />
                <span>&gt; 300MS (DEGRADED)</span>
              </div>
            </div>
          </div>

          {/* Heatmap Grid Matrix */}
          <div className="overflow-x-auto pb-2 border-2 border-black p-3 bg-white shadow-[2px_2px_0_#000]">
            <div className="min-w-[720px] space-y-2">
              {/* Hour Labels Header (00:00 to 23:00) */}
              <div className="grid grid-cols-25 items-center text-[10px] font-mono-brutal font-bold text-black pb-1 border-b-2 border-black">
                <div className="col-span-4 pl-1 uppercase">PROXY NODE POOL</div>
                {Array.from({ length: 24 }).map((_, h) => (
                  <div key={`h_lbl_${h}`} className="text-center">
                    {h % 3 === 0 ? `${h}H` : '•'}
                  </div>
                ))}
              </div>

              {/* Proxy Node Rows */}
              {data.heatmapMatrix.map((node) => (
                <div key={node.id} className="grid grid-cols-25 items-center gap-1 bg-[#f2efeb] p-2 border border-black hover:bg-white transition-all">
                  <div className="col-span-4 pr-2">
                    <div className="text-xs font-mono-brutal font-bold text-black truncate uppercase">{node.name}</div>
                    <div className="flex items-center gap-2 text-[10px] font-mono-brutal text-zinc-600 mt-0.5">
                      <span className="text-[#ff4d00] font-bold">{node.region}</span>
                      <span>•</span>
                      <span>{node.avgLatency}MS</span>
                    </div>
                  </div>

                  {node.hourlyStats.map((stat) => (
                    <div
                      key={`cell_${node.id}_${stat.hour}`}
                      onClick={() => setSelectedCell({ nodeName: node.name, stat })}
                      title={`${node.name} @ ${stat.timeLabel}: ${stat.latencyMs}ms (${stat.successRate}% success)`}
                      className={`h-7 flex items-center justify-center text-[9px] font-mono-brutal cursor-pointer transition-transform ${getCellBgClass(stat.latencyMs)}`}
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
            <div className="bg-[#f2efeb] border-2 border-black p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-brutal text-black shadow-[2px_2px_0_#000] animate-fadeIn">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-[#ff4d00] shrink-0" />
                <div>
                  <strong className="text-black uppercase">{selectedCell.nodeName}</strong> AT <span className="text-zinc-700">{selectedCell.stat.timeLabel}</span>:
                  <span className="ml-2 text-[#ff4d00] font-bold">{selectedCell.stat.latencyMs} MS LATENCY</span>
                  <span className="mx-2 text-zinc-400">|</span>
                  <span>SUCCESS: <strong>{selectedCell.stat.successRate}%</strong></span>
                  <span className="mx-2 text-zinc-400">|</span>
                  <span>REQUESTS: <strong>{selectedCell.stat.requestCount}</strong></span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-black font-bold uppercase underline text-xs cursor-pointer shrink-0"
              >
                [CLOSE]
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
