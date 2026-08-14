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
      <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000] mb-8 flex items-center justify-center min-h-[220px]">
        <div className="flex items-center gap-2 text-black text-xs font-mono-brutal font-bold uppercase">
          <RefreshCw className={`w-4 h-4 text-[#ff4d00] ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'LOADING 30-DAY INDEXING AUDIT & PERFORMANCE MATRIX...' : 'ANALYTICS DATA CURRENTLY UNAVAILABLE.'}</span>
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
    if (total === 0 || successCount === 0) return 'bg-white border-black text-zinc-500';
    const rate = (successCount / total) * 100;
    if (successCount >= 10 && rate >= 85) return 'bg-[#ff4d00] text-black font-bold border-black shadow-[2px_2px_0_#000]';
    if (successCount >= 5 || rate >= 70) return 'bg-black text-white font-bold border-black';
    if (successCount >= 1 || rate >= 50) return 'bg-[#ffe8dd] text-black font-bold border-black';
    return 'bg-[#f2efeb] text-black border-black';
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
        <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0_#000] font-mono-brutal text-xs text-black">
          <div className="font-bold border-b-2 border-black pb-1 mb-2 uppercase">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 font-bold uppercase">
                <span className="w-2 h-2 border border-black" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <strong className="text-black">
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
    <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000] mb-8 space-y-6">
      {/* Top Header & Main Section Tab Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-4 border-black">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-black text-white font-mono-brutal text-xs font-bold uppercase">
              [03] METRIC_NODE
            </span>
            <span className="font-mono-brutal text-xs text-[#ff4d00] font-bold">
              // TELEMETRY_MATRIX
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-black uppercase tracking-tight mt-1">
            INTELLIGENCE &amp; PERFORMANCE CONTROL CENTER
          </h2>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-[#f2efeb] border-2 border-black p-1 shrink-0 gap-1 shadow-[2px_2px_0_#000]">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-brutal font-bold uppercase transition-all ${
              activeTab === 'analytics'
                ? 'bg-black text-white shadow-[2px_2px_0_#ff4d00]'
                : 'text-black hover:bg-zinc-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>30-DAY_INDEXING</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_citations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-brutal font-bold uppercase transition-all ${
              activeTab === 'ai_citations'
                ? 'bg-[#ff4d00] text-black shadow-[2px_2px_0_#000]'
                : 'text-black hover:bg-zinc-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI_CITATIONS</span>
          </button>

          <button
            onClick={() => setActiveTab('proxy_health')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-brutal font-bold uppercase transition-all ${
              activeTab === 'proxy_health'
                ? 'bg-black text-[#ff4d00] shadow-[2px_2px_0_#000]'
                : 'text-black hover:bg-zinc-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>PROXY_HEALTH</span>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f2efeb] p-3 border-2 border-black shadow-[2px_2px_0_#000]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-brutal font-bold text-black uppercase">VIEW_MODE:</span>
              <div className="flex items-center bg-white border-2 border-black p-0.5 gap-1">
                <button
                  onClick={() => setChartType('line')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono-brutal font-bold uppercase transition-all ${
                    chartType === 'line'
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-zinc-200'
                  }`}
                  title="30-Day Confirmed Backlinks Success Rate Line Chart"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#ff4d00]" />
                  <span className="hidden md:inline">LINE</span>
                </button>
                <button
                  onClick={() => setChartType('heatmap')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono-brutal font-bold uppercase transition-all ${
                    chartType === 'heatmap'
                      ? 'bg-[#ff4d00] text-black'
                      : 'text-black hover:bg-zinc-200'
                  }`}
                  title="30-Day Success Matrix Heatmap"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">HEATMAP</span>
                </button>
                <button
                  onClick={() => setChartType('area')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono-brutal font-bold uppercase transition-all ${
                    chartType === 'area'
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-zinc-200'
                  }`}
                  title="30-Day Stacked Area Trend"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">AREA</span>
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono-brutal font-bold uppercase transition-all ${
                    chartType === 'bar'
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-zinc-200'
                  }`}
                  title="Daily Bar Comparison"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">BAR</span>
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono-brutal font-bold uppercase transition-all ${
                    chartType === 'pie'
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-zinc-200'
                  }`}
                  title="Overall Ratio Donut"
                >
                  <PieChartIcon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">RATIO</span>
                </button>
              </div>
            </div>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 bg-white hover:bg-zinc-100 text-black border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer"
              title="Refresh 30-Day Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#ff4d00]' : ''}`} />
            </button>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#f2efeb] border-2 border-black p-4 shadow-[3px_3px_0_#000]">
              <span className="block text-[10px] font-mono-brutal font-bold uppercase text-zinc-700">TOTAL SUBMISSIONS</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-mono-brutal font-bold text-black">{summary.totalLogs.toLocaleString()}</span>
                <span className="text-xs font-mono-brutal text-zinc-600">30 DAYS</span>
              </div>
            </div>

            <div className="bg-[#f2efeb] border-2 border-black p-4 shadow-[3px_3px_0_#000]">
              <span className="block text-[10px] font-mono-brutal font-bold uppercase text-zinc-700">SUCCESS RATE</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-mono-brutal font-bold text-[#ff4d00]">{summary.successRate}%</span>
                <span className="text-[10px] font-mono-brutal font-bold px-1.5 py-0.5 bg-black text-white uppercase">
                  VERIFIED
                </span>
              </div>
            </div>

            <div className="bg-[#f2efeb] border-2 border-black p-4 shadow-[3px_3px_0_#000]">
              <span className="block text-[10px] font-mono-brutal font-bold uppercase text-zinc-700">LIVE 200 OK BACKLINKS</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-mono-brutal font-bold text-black flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ff4d00]" />
                  {summary.successCount.toLocaleString()}
                </span>
                <span className="text-xs text-zinc-600 font-mono-brutal font-bold">
                  {((summary.successCount / (summary.totalLogs || 1)) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="bg-[#f2efeb] border-2 border-black p-4 shadow-[3px_3px_0_#000]">
              <span className="block text-[10px] font-mono-brutal font-bold uppercase text-zinc-700">PEAK DAY</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-mono-brutal font-bold text-black flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-[#ff4d00]" />
                  {peakDay ? peakDay.date : 'N/A'}
                </span>
                <span className="text-xs font-mono-brutal font-bold text-[#ff4d00]">
                  {peakDay ? `${peakDay.success} OK` : '0'}
                </span>
              </div>
            </div>
          </div>

          {/* Render Heatmap or Recharts */}
          {chartType === 'heatmap' ? (
            <div className="bg-white border-4 border-black p-5 space-y-4 shadow-[4px_4px_0_#000]">
              <div className="flex items-center justify-between text-xs font-mono-brutal font-bold text-black border-b-2 border-black pb-2">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#ff4d00]" />
                  30-DAY INDEXING VELOCITY MATRIX
                </span>
                <div className="flex items-center gap-2 text-[10px]">
                  <span>LESS</span>
                  <span className="w-3 h-3 bg-white border border-black inline-block" />
                  <span className="w-3 h-3 bg-[#ffe8dd] border border-black inline-block" />
                  <span className="w-3 h-3 bg-black border border-black inline-block" />
                  <span className="w-3 h-3 bg-[#ff4d00] border border-black inline-block" />
                  <span>MORE</span>
                </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
                {dailyTrend.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedTile(item)}
                    className={`p-2 border-2 border-black flex flex-col justify-between h-16 cursor-pointer transition-all hover:scale-105 ${getHeatmapColor(
                      item.success,
                      item.total
                    )}`}
                  >
                    <span className="text-[9px] font-mono-brutal font-bold">{item.date}</span>
                    <div className="text-right">
                      <span className="text-sm font-mono-brutal font-bold">{item.success}</span>
                      <span className="text-[9px] block font-mono-brutal">{item.rate}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTile && (
                <div className="p-3 bg-[#f2efeb] border-2 border-black text-xs font-mono-brutal font-bold flex items-center justify-between text-black animate-fadeIn">
                  <span>
                    SELECTED: <strong className="text-[#ff4d00]">{selectedTile.fullDate}</strong> ({selectedTile.date})
                  </span>
                  <div className="flex items-center gap-3">
                    <span>SUCCESS: <strong>{selectedTile.success}</strong></span>
                    <span>FAILURES: <strong>{selectedTile.failure}</strong></span>
                    <span>RATE: <strong className="text-[#ff4d00]">{selectedTile.rate}%</strong></span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 sm:h-72 w-full pt-2 bg-white border-4 border-black p-4 shadow-[4px_4px_0_#000]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={dailyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis dataKey="date" stroke="#000000" fontSize={10} tickLine={false} />
                    <YAxis yAxisId="rate" orientation="left" stroke="#ff4d00" fontSize={10} tickLine={false} unit="%" domain={[0, 100]} />
                    <YAxis yAxisId="count" orientation="right" stroke="#000000" fontSize={10} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} formatter={(val) => <span className="font-mono-brutal font-bold text-black">{val}</span>} />
                    <Line
                      yAxisId="rate"
                      type="monotone"
                      dataKey="rate"
                      name="SUCCESS RATE (%)"
                      stroke="#ff4d00"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#ff4d00', strokeWidth: 2, stroke: '#000' }}
                      activeDot={{ r: 7, fill: '#ff4d00', stroke: '#000', strokeWidth: 2 }}
                    />
                    <Line
                      yAxisId="count"
                      type="monotone"
                      dataKey="success"
                      name="CONFIRMED BACKLINKS"
                      stroke="#000000"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: '#000000' }}
                    />
                  </LineChart>
                ) : chartType === 'area' ? (
                  <AreaChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis dataKey="date" stroke="#000000" fontSize={10} tickLine={false} />
                    <YAxis stroke="#000000" fontSize={10} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} formatter={(val) => <span className="font-mono-brutal font-bold text-black uppercase">{val}</span>} />
                    <Area type="monotone" dataKey="success" name="Success" stroke="#000000" strokeWidth={2} fill="#ff4d00" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="failure" name="Failure" stroke="#000000" strokeWidth={2} fill="#000000" fillOpacity={0.2} />
                  </AreaChart>
                ) : chartType === 'bar' ? (
                  <BarChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis dataKey="date" stroke="#000000" fontSize={10} tickLine={false} />
                    <YAxis stroke="#000000" fontSize={10} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} formatter={(val) => <span className="font-mono-brutal font-bold text-black uppercase">{val}</span>} />
                    <Bar dataKey="success" name="Success" fill="#ff4d00" stroke="#000" strokeWidth={1.5} />
                    <Bar dataKey="failure" name="Failure" fill="#000000" stroke="#000" strokeWidth={1.5} />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} formatter={(val, entry: any) => <span className="font-mono-brutal font-bold text-black uppercase">{val} ({entry.payload.value.toLocaleString()})</span>} />
                    <Pie data={ratioBreakdown} cx="50%" cy="45%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                      {ratioBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ff4d00' : '#000000'} stroke="#000000" strokeWidth={2} />
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
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#f2efeb] p-4 border-4 border-black shadow-[4px_4px_0_#000]">
            <div className="sm:col-span-4">
              <label className="block text-[10px] font-mono-brutal font-bold uppercase text-black mb-1">TARGET BRAND NAME</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono-brutal text-black font-bold focus:outline-none"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-[10px] font-mono-brutal font-bold uppercase text-black mb-1">TARGET KEYWORDS (COMMA SEPARATED)</label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-mono-brutal text-black focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                onClick={handleRunCitationCrawl}
                disabled={isCrawlingCitations}
                className="w-full py-2 bg-[#ff4d00] hover:bg-[#ff5c14] text-black font-mono-brutal font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCrawlingCitations ? 'animate-spin' : ''}`} />
                <span>CRAWL_AI</span>
              </button>
            </div>
          </div>

          {/* AI Platform Citation Rate Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#f2efeb] border-2 border-black p-4 shadow-[2px_2px_0_#000]">
              <div className="flex items-center justify-between text-black text-[10px] font-mono-brutal font-bold uppercase">
                <span>CHATGPT SEARCH RATE</span>
                <Bot className="w-3.5 h-3.5 text-[#ff4d00]" />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-mono-brutal font-bold text-black">{chatGptRate}%</span>
                <span className="text-[10px] font-mono-brutal text-zinc-600">{chatGptCitations}/{chatGptTotal} PROMPTS</span>
              </div>
            </div>

            <div className="bg-[#f2efeb] border-2 border-black p-4 shadow-[2px_2px_0_#000]">
              <div className="flex items-center justify-between text-black text-[10px] font-mono-brutal font-bold uppercase">
                <span>PERPLEXITY AI RATE</span>
                <Sparkles className="w-3.5 h-3.5 text-[#ff4d00]" />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-mono-brutal font-bold text-black">{perplexityRate}%</span>
                <span className="text-[10px] font-mono-brutal text-zinc-600">{perplexityCitations}/{perplexityTotal} PROMPTS</span>
              </div>
            </div>

            <div className="bg-[#f2efeb] border-2 border-black p-4 shadow-[2px_2px_0_#000]">
              <div className="flex items-center justify-between text-black text-[10px] font-mono-brutal font-bold uppercase">
                <span>CLAUDE &amp; OVERVIEWS</span>
                <Globe className="w-3.5 h-3.5 text-black" />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-mono-brutal font-bold text-black">75%</span>
                <span className="text-[10px] font-mono-brutal text-zinc-600">CITED SHARE</span>
              </div>
            </div>

            <div className="bg-[#f2efeb] border-2 border-black p-4 shadow-[2px_2px_0_#000]">
              <div className="flex items-center justify-between text-black text-[10px] font-mono-brutal font-bold uppercase">
                <span>OVERALL GEO CONSENSUS</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff4d00]" />
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-mono-brutal font-bold text-[#ff4d00]">{overallCitationRate}%</span>
                <span className="text-[10px] font-mono-brutal font-bold px-1.5 py-0.5 bg-black text-white uppercase">
                  HIGH_SHARE
                </span>
              </div>
            </div>
          </div>

          {/* Table Filters */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono-brutal font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#ff4d00]" />
              <span>TARGET KEYWORD PROMPT SEARCH RESULTS CRAWL</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-brutal font-bold text-black uppercase">PLATFORM:</span>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-white border-2 border-black px-2 py-1 text-xs font-mono-brutal font-bold text-black focus:outline-none"
              >
                <option value="all">ALL AI PLATFORMS</option>
                <option value="chatgpt">CHATGPT SEARCH</option>
                <option value="perplexity">PERPLEXITY AI</option>
                <option value="claude">CLAUDE 3.5</option>
                <option value="google">GOOGLE AI OVERVIEWS</option>
              </select>
            </div>
          </div>

          {/* Citation Results Table */}
          <div className="overflow-x-auto border-4 border-black bg-white shadow-[4px_4px_0_#000]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-black text-white font-mono-brutal text-[10px] uppercase border-b-4 border-black">
                <tr>
                  <th className="p-3 border-r-2 border-zinc-800">KEYWORD PROMPT</th>
                  <th className="p-3 border-r-2 border-zinc-800">AI ENGINE</th>
                  <th className="p-3 border-r-2 border-zinc-800">CITATION STATUS</th>
                  <th className="p-3 border-r-2 border-zinc-800">SNIPPET QUOTE</th>
                  <th className="p-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black font-mono-brutal text-black">
                {filteredCitations.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f2efeb] transition-colors">
                    <td className="p-3 font-bold text-black max-w-xs truncate border-r-2 border-black">
                      "{item.keyword}"
                    </td>
                    <td className="p-3 border-r-2 border-black">
                      <span className="px-2 py-0.5 bg-[#f2efeb] border border-black text-[10px] font-bold text-black uppercase">
                        {item.platform}
                      </span>
                    </td>
                    <td className="p-3 border-r-2 border-black">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase border border-black ${
                          item.citationType === 'Direct Primary Citation'
                            ? 'bg-[#ff4d00] text-black shadow-[1px_1px_0_#000]'
                            : item.citationType === 'Contextual Mention'
                            ? 'bg-[#f2efeb] text-black'
                            : 'bg-black text-[#ff4d00]'
                        }`}
                      >
                        {item.citationType === 'Direct Primary Citation' && <CheckCircle2 className="w-3 h-3" />}
                        {item.citationType}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-800 text-[11px] max-w-md italic border-r-2 border-black">
                      "{item.snippet}"
                    </td>
                    <td className="p-3 text-right">
                      {onOpenContentGrader && (
                        <button
                          onClick={() => onOpenContentGrader(`https://${brandName.toLowerCase().replace(/\s+/g, '')}.com`, item.keyword)}
                          className="px-2.5 py-1 bg-black text-white hover:bg-zinc-800 text-[10px] font-bold uppercase border border-black transition-all inline-flex items-center gap-1 shadow-[1px_1px_0_#ff4d00]"
                        >
                          <span>GRADE_PAGE</span>
                          <ArrowRight className="w-3 h-3 text-[#ff4d00]" />
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


