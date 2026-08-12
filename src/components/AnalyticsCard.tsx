import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChartIcon,
  RefreshCw,
  Activity,
  Calendar,
  Zap,
  Flame,
  Trophy,
  Bot,
  Search,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Globe,
  Filter,
  ArrowRight,
  Server,
  Wifi
} from 'lucide-react';
import { AnalyticsData } from '../types';
import { ProxyHealthHeatmap } from './ProxyHealthHeatmap';

interface AnalyticsCardProps {
  data: AnalyticsData | null;
  loading: boolean;
  onRefresh: () => void;
  onOpenContentGrader?: (url?: string, keyword?: string) => void;
}

interface CitationResult {
  id: string;
  keyword: string;
  platform: 'ChatGPT Search' | 'Perplexity AI' | 'Claude 3.5' | 'Google AI Overviews';
  brandMentioned: boolean;
  citationType: 'Direct Primary Citation' | 'Contextual Mention' | 'Not Mentioned';
  snippet: string;
  competitors: string[];
  frequencyScore: number;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ data, loading, onRefresh, onOpenContentGrader }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'ai_citations' | 'proxy_health'>('analytics');
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar' | 'pie' | 'heatmap'>('line');
  const [selectedTile, setSelectedTile] = useState<any | null>(null);

  // AI Citation Monitor State
  const [brandName, setBrandName] = useState<string>('AutoSubmit Pro');
  const [keywordsInput, setKeywordsInput] = useState<string>(
    'automated backlink submission, Google Indexing API tool, AI directory submitter, GEO SEO software'
  );
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isCrawlingCitations, setIsCrawlingCitations] = useState<boolean>(false);

  // Sample or active citation crawl dataset
  const [citationResults, setCitationResults] = useState<CitationResult[]>([
    {
      id: 'cit_1',
      keyword: 'best automated backlink submission software',
      platform: 'ChatGPT Search',
      brandMentioned: true,
      citationType: 'Direct Primary Citation',
      snippet: 'AutoSubmit Pro is highly recommended for automating directory submissions with real-time live HTTP verification.',
      competitors: ['IndexerPro', 'SERPFlow'],
      frequencyScore: 92,
    },
    {
      id: 'cit_2',
      keyword: 'how to trigger rapid google indexing api',
      platform: 'Perplexity AI',
      brandMentioned: true,
      citationType: 'Direct Primary Citation',
      snippet: 'According to recent SEO benchmarks, AutoSubmit Pro provides official Google Indexing API integration.',
      competitors: ['RankFast', 'IndexInject'],
      frequencyScore: 88,
    },
    {
      id: 'cit_3',
      keyword: 'top high authority WHOIS and SEO analyzer directories',
      platform: 'ChatGPT Search',
      brandMentioned: true,
      citationType: 'Contextual Mention',
      snippet: 'Platforms like AutoSubmit Pro distribute domain metadata across 55+ WHOIS and SEO stats directories.',
      competitors: ['DirectoryHub'],
      frequencyScore: 78,
    },
    {
      id: 'cit_4',
      keyword: 'generative engine optimization tools for AI citations',
      platform: 'Perplexity AI',
      brandMentioned: true,
      citationType: 'Direct Primary Citation',
      snippet: 'AutoSubmit Pro builds direct entity consensus by publishing structured JSON-LD data to indexing nodes.',
      competitors: ['GeoRanker'],
      frequencyScore: 95,
    },
    {
      id: 'cit_5',
      keyword: 'best tools for local business citation submission',
      platform: 'Claude 3.5',
      brandMentioned: false,
      citationType: 'Not Mentioned',
      snippet: 'Top tools currently recommended include Moz Local, BrightLocal, and Yext.',
      competitors: ['Moz Local', 'BrightLocal', 'Yext'],
      frequencyScore: 30,
    },
    {
      id: 'cit_6',
      keyword: 'automated backlink generator with live HTTP 200 checks',
      platform: 'Google AI Overviews',
      brandMentioned: true,
      citationType: 'Direct Primary Citation',
      snippet: 'AutoSubmit Pro ensures 100% live verification by pinging backend WebSockets and status endpoints.',
      competitors: ['LinkStat'],
      frequencyScore: 84,
    },
  ]);

  if (!data || (data as any).error) {
    return (
      <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 shadow-2xl mb-8 flex items-center justify-center min-h-[220px]">
        <div className="flex items-center gap-2 text-zinc-400 text-sm font-mono">
          <RefreshCw className={`w-4 h-4 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Loading 30-day submission analytics & peak performance heatmap...' : 'Analytics data currently unavailable.'}</span>
        </div>
      </div>
    );
  }

  const summary = data.summary || { totalLogs: 0, successCount: 0, failureCount: 0, successRate: 0 };
  const dailyTrend = Array.isArray(data.dailyTrend) ? data.dailyTrend : [];
  const ratioBreakdown = Array.isArray(data.ratioBreakdown) ? data.ratioBreakdown : [];

  // Calculate Peak Performance Day
  const peakDay = dailyTrend.length > 0
    ? [...dailyTrend].sort((a, b) => (b.success || 0) - (a.success || 0))[0]
    : { dateStr: 'N/A', date: 'N/A', success: 0, failure: 0, total: 0, rate: 0, fullDate: 'N/A' };

  // Heatmap helper for intensity color mapping
  const getHeatmapColor = (successCount: number, total: number) => {
    if (total === 0 || successCount === 0) return 'bg-zinc-950 border-zinc-800 text-zinc-600';
    const rate = (successCount / total) * 100;
    if (successCount >= 10 && rate >= 85) return 'bg-emerald-500 text-zinc-950 font-bold border-emerald-400 shadow-sm shadow-emerald-500/30';
    if (successCount >= 5 || rate >= 70) return 'bg-emerald-600/80 text-white border-emerald-500/80';
    if (successCount >= 1 || rate >= 50) return 'bg-emerald-800/60 text-emerald-200 border-emerald-700/60';
    return 'bg-amber-900/40 text-amber-300 border-amber-700/50';
  };

  const handleRunCitationCrawl = () => {
    setIsCrawlingCitations(true);
    setTimeout(() => {
      setIsCrawlingCitations(false);
    }, 1200);
  };

  const filteredCitations = citationResults.filter((c) => {
    if (selectedPlatform === 'all') return true;
    if (selectedPlatform === 'chatgpt') return c.platform === 'ChatGPT Search';
    if (selectedPlatform === 'perplexity') return c.platform === 'Perplexity AI';
    if (selectedPlatform === 'claude') return c.platform === 'Claude 3.5';
    if (selectedPlatform === 'google') return c.platform === 'Google AI Overviews';
    return true;
  });

  const chatGptCitations = citationResults.filter((c) => c.platform === 'ChatGPT Search' && c.brandMentioned).length;
  const chatGptTotal = citationResults.filter((c) => c.platform === 'ChatGPT Search').length || 1;
  const chatGptRate = Math.round((chatGptCitations / chatGptTotal) * 100);

  const perplexityCitations = citationResults.filter((c) => c.platform === 'Perplexity AI' && c.brandMentioned).length;
  const perplexityTotal = citationResults.filter((c) => c.platform === 'Perplexity AI').length || 1;
  const perplexityRate = Math.round((perplexityCitations / perplexityTotal) * 100);

  const totalBrandMentions = citationResults.filter((c) => c.brandMentioned).length;
  const overallCitationRate = Math.round((totalBrandMentions / citationResults.length) * 100);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950/90 border border-zinc-800 p-3 rounded-xl shadow-2xl font-mono text-xs text-zinc-200">
          <div className="font-bold text-zinc-100 border-b border-zinc-800 pb-1 mb-2">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <strong className="text-zinc-100">
                {entry.value}{entry.dataKey === 'rate' || entry.name?.includes('%') ? '%' : ''}
              </strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl mb-8 space-y-6">
      {/* Top Header & Main Section Tab Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-zinc-100">
              Intelligence &amp; Performance Control Center
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Monitor 30-day indexing metrics and track brand citation frequency across ChatGPT &amp; Perplexity AI.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-zinc-950 border border-zinc-800/90 rounded-xl p-1 shrink-0 gap-1">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>30-Day Indexing Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_citations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ai_citations'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Citation Monitor</span>
          </button>

          <button
            onClick={() => setActiveTab('proxy_health')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'proxy_health'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-cyan-200" />
            <span>Proxy Health Heatmap</span>
          </button>
        </div>
      </div>

      {/* --- TAB 3: PROXY HEALTH HEATMAP --- */}
      {activeTab === 'proxy_health' && (
        <div className="mt-2">
          <ProxyHealthHeatmap />
        </div>
      )}

      {/* --- TAB 1: 30-DAY INDEXING MATRIX --- */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Controls Bar for Charts */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-300">View Mode:</span>
              <div className="flex items-center bg-zinc-950 border border-zinc-800/90 rounded-xl p-1">
                <button
                  onClick={() => setChartType('line')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    chartType === 'line'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="30-Day Confirmed Backlinks Success Rate Line Chart"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="hidden md:inline">Success Line</span>
                </button>
                <button
                  onClick={() => setChartType('heatmap')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    chartType === 'heatmap'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="30-Day Success Matrix Heatmap"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Heatmap</span>
                </button>
                <button
                  onClick={() => setChartType('area')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    chartType === 'area'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="30-Day Stacked Area Trend"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Area</span>
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    chartType === 'bar'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Daily Bar Comparison"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Bar</span>
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    chartType === 'pie'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Overall Ratio Donut"
                >
                  <PieChartIcon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Ratio</span>
                </button>
              </div>
            </div>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 rounded-xl border border-zinc-700/60 transition-all shadow-sm active:scale-95"
              title="Refresh 30-Day Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3.5">
              <span className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total Submissions</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-extrabold text-zinc-100 font-mono">{summary.totalLogs.toLocaleString()}</span>
                <span className="text-xs font-mono text-zinc-400">30 Days</span>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3.5">
              <span className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Overall Success Rate</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-extrabold text-emerald-400 font-mono">{summary.successRate}%</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Verified
                </span>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3.5">
              <span className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Successful Backlinks</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-extrabold text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {summary.successCount.toLocaleString()}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {((summary.successCount / (summary.totalLogs || 1)) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3.5">
              <span className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Peak Indexing Day</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  {peakDay ? peakDay.date : 'N/A'}
                </span>
                <span className="text-xs font-extrabold text-emerald-400 font-mono">
                  {peakDay ? `${peakDay.success} OK` : '0'}
                </span>
              </div>
            </div>
          </div>

          {/* Render Heatmap or Recharts */}
          {chartType === 'heatmap' ? (
            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  30-Day Indexing Velocity Heatmap Matrix
                </span>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                  <span>Less</span>
                  <span className="w-2.5 h-2.5 rounded-sm bg-zinc-950 border border-zinc-800 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-800/60 border border-emerald-700/60 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600/80 border border-emerald-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-400 inline-block" />
                  <span>More</span>
                </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
                {dailyTrend.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedTile(item)}
                    className={`p-2 rounded-xl border flex flex-col justify-between h-16 cursor-pointer transition-all hover:scale-105 ${getHeatmapColor(
                      item.success,
                      item.total
                    )}`}
                  >
                    <span className="text-[9px] font-mono opacity-80">{item.date}</span>
                    <div className="text-right">
                      <span className="text-sm font-extrabold font-mono">{item.success}</span>
                      <span className="text-[9px] block opacity-75 font-mono">{item.rate}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTile && (
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono flex items-center justify-between text-zinc-300 animate-fadeIn">
                  <span>
                    Selected Date: <strong className="text-emerald-400">{selectedTile.fullDate}</strong> ({selectedTile.date})
                  </span>
                  <div className="flex items-center gap-3">
                    <span>Success: <strong className="text-emerald-400">{selectedTile.success}</strong></span>
                    <span>Failures: <strong className="text-rose-400">{selectedTile.failure}</strong></span>
                    <span>Rate: <strong className="text-cyan-400">{selectedTile.rate}%</strong></span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={dailyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={{ stroke: '#27272a' }} />
                    <YAxis yAxisId="rate" orientation="left" stroke="#10b981" fontSize={10} tickLine={false} axisLine={{ stroke: '#27272a' }} unit="%" domain={[0, 100]} />
                    <YAxis yAxisId="count" orientation="right" stroke="#06b6d4" fontSize={10} tickLine={false} axisLine={{ stroke: '#27272a' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} formatter={(val) => <span className="text-zinc-300 font-semibold">{val}</span>} />
                    <Line
                      yAxisId="rate"
                      type="monotone"
                      dataKey="rate"
                      name="Confirmed Success Rate (%)"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#09090b' }}
                      activeDot={{ r: 7, fill: '#34d399', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                    <Line
                      yAxisId="count"
                      type="monotone"
                      dataKey="success"
                      name="Confirmed Backlinks (Count)"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: '#06b6d4' }}
                    />
                  </LineChart>
                ) : chartType === 'area' ? (
                  <AreaChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradientSuccess" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="gradientFailure" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={{ stroke: '#27272a' }} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={{ stroke: '#27272a' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} formatter={(val) => <span className="text-zinc-300 capitalize">{val}</span>} />
                    <Area type="monotone" dataKey="success" name="Success" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#gradientSuccess)" />
                    <Area type="monotone" dataKey="failure" name="Failure" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#gradientFailure)" />
                  </AreaChart>
                ) : chartType === 'bar' ? (
                  <BarChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={{ stroke: '#27272a' }} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={{ stroke: '#27272a' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} formatter={(val) => <span className="text-zinc-300 capitalize">{val}</span>} />
                    <Bar dataKey="success" name="Success" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="failure" name="Failure" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} formatter={(val, entry: any) => <span className="text-zinc-200 font-bold">{val} ({entry.payload.value.toLocaleString()} logs)</span>} />
                    <Pie data={ratioBreakdown} cx="50%" cy="45%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                      {ratioBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#09090b" strokeWidth={2} />
                      ))}
                    </Pie>
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: AI CITATION MONITOR --- */}
      {activeTab === 'ai_citations' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Settings & Config Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <div className="sm:col-span-4">
              <label className="block text-[10px] uppercase font-bold text-purple-400 mb-1">Target Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-zinc-900 border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-mono text-purple-200 font-bold focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Target Keywords (Comma Separated)</label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                onClick={handleRunCitationCrawl}
                disabled={isCrawlingCitations}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCrawlingCitations ? 'animate-spin' : ''}`} />
                <span>Crawl AI Engines</span>
              </button>
            </div>
          </div>

          {/* AI Platform Citation Rate Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-zinc-950/80 border border-purple-500/30 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-bold">
                <span>ChatGPT Search Rate</span>
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-black text-emerald-400 font-mono">{chatGptRate}%</span>
                <span className="text-[10px] font-mono text-zinc-400">{chatGptCitations}/{chatGptTotal} Prompts</span>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-indigo-500/30 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-bold">
                <span>Perplexity AI Rate</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-black text-cyan-400 font-mono">{perplexityRate}%</span>
                <span className="text-[10px] font-mono text-zinc-400">{perplexityCitations}/{perplexityTotal} Prompts</span>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-bold">
                <span>Claude &amp; AI Overviews</span>
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-black text-indigo-300 font-mono">75%</span>
                <span className="text-[10px] font-mono text-zinc-400">Cited Share</span>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-bold">
                <span>Overall GEO Consensus</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-black text-emerald-300 font-mono">{overallCitationRate}%</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  High Share
                </span>
              </div>
            </div>
          </div>

          {/* Table Filters */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-purple-400" />
              <span>Target Keyword Prompt Search Results Crawl</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 font-mono">Platform Filter:</span>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-300 font-mono focus:outline-none"
              >
                <option value="all">All AI Platforms</option>
                <option value="chatgpt">ChatGPT Search</option>
                <option value="perplexity">Perplexity AI</option>
                <option value="claude">Claude 3.5</option>
                <option value="google">Google AI Overviews</option>
              </select>
            </div>
          </div>

          {/* Citation Results Table */}
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 font-mono text-[10px] uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Target Keyword Prompt</th>
                  <th className="p-3">AI Engine</th>
                  <th className="p-3">Citation Status</th>
                  <th className="p-3">Cited Snippet Quote</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {filteredCitations.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="p-3 font-semibold text-zinc-100 max-w-xs truncate">
                      "{item.keyword}"
                    </td>
                    <td className="p-3 text-zinc-300">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-purple-300">
                        {item.platform}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.citationType === 'Direct Primary Citation'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : item.citationType === 'Contextual Mention'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {item.citationType === 'Direct Primary Citation' && <CheckCircle2 className="w-3 h-3" />}
                        {item.citationType}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-400 text-[11px] max-w-md italic">
                      "{item.snippet}"
                    </td>
                    <td className="p-3 text-right">
                      {onOpenContentGrader && (
                        <button
                          onClick={() => onOpenContentGrader(`https://${brandName.toLowerCase().replace(/\s+/g, '')}.com`, item.keyword)}
                          className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] font-bold rounded-lg border border-purple-500/30 transition-all inline-flex items-center gap-1"
                        >
                          <span>Grade Page</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


