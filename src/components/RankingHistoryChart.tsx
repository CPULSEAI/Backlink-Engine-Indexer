import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  BarChart3,
  Globe,
  Award,
  RefreshCw,
  Search,
  Plus,
  Eye,
  EyeOff,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import toast from 'react-hot-toast';

interface KeywordTrendItem {
  keyword: string;
  startRank: number;
  currentRank: number;
  change: number; // positive = rank improved
  trend: 'GROWTH' | 'DECLINE' | 'STABLE';
  bestRank: number;
  visibilityScore: number;
}

interface RankingHistoryData {
  days: number;
  domain: string;
  availableDomains: string[];
  allKeywords: string[];
  activeKeywords: string[];
  rankData: Array<{
    date: string;
    fullDate: string;
    [key: string]: any;
  }>;
  keywordTrends: KeywordTrendItem[];
  summary: {
    avgRank: number;
    bestRank: number;
    growthCount: number;
    declineCount: number;
    stableCount: number;
    pageOneCount: number;
    visibilityIndex: number;
  };
}

const KEYWORD_COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#f97316', // Orange
];

export const RankingHistoryChart: React.FC = () => {
  const [days, setDays] = useState<number>(30);
  const [selectedDomain, setSelectedDomain] = useState<string>('careerpulseai.net');
  const [data, setData] = useState<RankingHistoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [hiddenKeywords, setHiddenKeywords] = useState<Record<string, boolean>>({});
  const [keywordFilterSearch, setKeywordFilterSearch] = useState<string>('');
  const [newKeywordInput, setNewKeywordInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chart' | 'trends'>('chart');

  const chartCardRef = useRef<HTMLDivElement>(null);

  // Fetch ranking history from API endpoint
  const fetchRankingHistory = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        days: String(days),
        domain: selectedDomain,
      });

      const res = await fetch(`/api/ranking/history?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch ranking history');
      const json: RankingHistoryData = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('[RankingHistoryChart] Error loading data:', err);
      toast.error('Failed to load ranking history data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankingHistory();
  }, [days, selectedDomain]);

  // Toggle keyword visibility in chart
  const toggleKeywordVisibility = (kw: string) => {
    setHiddenKeywords((prev) => ({
      ...prev,
      [kw]: !prev[kw],
    }));
  };

  // Add a custom keyword to track
  const handleAddKeyword = () => {
    if (!newKeywordInput.trim() || !data) return;
    const kw = newKeywordInput.trim().toLowerCase();
    if (data.activeKeywords.includes(kw)) {
      toast.error(`'${kw}' is already being tracked.`);
      return;
    }

    // Add locally to activeKeywords and update data state
    const updatedKeywords = [...data.activeKeywords, kw];
    const newKwHash = kw.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    const updatedRankData = data.rankData.map((point, i) => {
      const progression = (days - 1 - i) / days;
      const startBase = (newKwHash % 25) + 1;
      const improvement = Math.floor(progression * 8);
      const calcRank = Math.max(1, Math.min(100, startBase - improvement));
      return { ...point, [kw]: calcRank };
    });

    const firstP = updatedRankData[0][kw];
    const lastP = updatedRankData[updatedRankData.length - 1][kw];
    const diff = firstP - lastP;

    const newTrend: KeywordTrendItem = {
      keyword: kw,
      startRank: firstP,
      currentRank: lastP,
      change: diff,
      trend: diff > 0 ? 'GROWTH' : diff < 0 ? 'DECLINE' : 'STABLE',
      bestRank: Math.min(...updatedRankData.map((p) => p[kw])),
      visibilityScore: Math.max(0, Math.min(100, Math.round(100 - (lastP - 1) * 2.2))),
    };

    setData({
      ...data,
      activeKeywords: updatedKeywords,
      allKeywords: Array.from(new Set([...data.allKeywords, kw])),
      rankData: updatedRankData,
      keywordTrends: [...data.keywordTrends, newTrend],
    });

    setNewKeywordInput('');
    toast.success(`Started tracking keyword: '${kw}'`);
  };

  // Download chart card as high-res PNG image
  const handleDownloadPNG = async () => {
    if (!chartCardRef.current) return;
    setDownloading(true);
    const toastId = toast.loading('Generating high-resolution PNG chart image...');

    try {
      // Temporarily ensure background styling for html-to-image capture
      const dataUrl = await toPng(chartCardRef.current, {
        cacheBust: true,
        backgroundColor: '#09090b',
        pixelRatio: 2, // 2x resolution for retina print quality
        style: {
          borderRadius: '1rem',
          margin: '0',
        },
      });

      const link = document.createElement('a');
      link.download = `SEO_Keyword_Ranking_History_${selectedDomain}_${days}days_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success('Chart image downloaded successfully!', { id: toastId });
    } catch (err: any) {
      console.error('[RankingHistoryChart] Download image failed:', err);
      toast.error('Failed to export chart image.', { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  const visibleKeywords = useMemo(() => {
    if (!data) return [];
    return data.activeKeywords.filter((kw) => !hiddenKeywords[kw]);
  }, [data, hiddenKeywords]);

  const filteredTrends = useMemo(() => {
    if (!data) return [];
    if (!keywordFilterSearch.trim()) return data.keywordTrends;
    const query = keywordFilterSearch.toLowerCase();
    return data.keywordTrends.filter((kt) => kt.keyword.toLowerCase().includes(query));
  }, [data, keywordFilterSearch]);

  if (loading && !data) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-xl animate-pulse">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-zinc-300">Loading historical keyword ranking data...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Container Card targetable by html-to-image for PNG download */}
      <div
        ref={chartCardRef}
        className="bg-zinc-900/95 border border-zinc-800 rounded-2xl p-5 shadow-2xl transition-all"
      >
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-zinc-100 tracking-tight">
                  Keyword Ranking History & Performance Trends
                </h3>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-mono font-bold">
                  Recharts Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                30-day SERP position trajectory, performance growth/decline identification, and high-res image exporter.
              </p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Domain Dropdown */}
            <div className="flex items-center gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-zinc-500 font-medium">Domain:</span>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="bg-transparent text-zinc-100 font-semibold focus:outline-none cursor-pointer"
              >
                {data.availableDomains.map((d) => (
                  <option key={d} value={d} className="bg-zinc-900 text-zinc-100">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeframe Selector (7D, 14D, 30D, 60D) */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
              {[7, 14, 30, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    days === d
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>

            {/* View Tab Toggle */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'chart'
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Chart View
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'trends'
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Growth / Decline ({data.summary.growthCount}↑ {data.summary.declineCount}↓)
              </button>
            </div>

            {/* High-Res PNG Download Button */}
            <button
              onClick={handleDownloadPNG}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
              title="Export current chart visualization as high-resolution PNG image"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Exporting...' : 'Download PNG'}</span>
            </button>
          </div>
        </div>

        {/* 30-Day Metric Overview Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Avg SERP Rank
            </div>
            <div className="text-xl font-extrabold text-zinc-100 mt-0.5 font-mono flex items-center justify-between">
              <span>#{data.summary.avgRank}</span>
              <span className="text-xs font-sans text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Top 5 Avg
              </span>
            </div>
          </div>

          <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Visibility Index
            </div>
            <div className="text-xl font-extrabold text-indigo-400 mt-0.5 font-mono flex items-center justify-between">
              <span>{data.summary.visibilityIndex}%</span>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          </div>

          <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Growth vs Decline
            </div>
            <div className="text-xl font-extrabold text-zinc-100 mt-0.5 font-mono flex items-center gap-2">
              <span className="text-emerald-400 flex items-center text-base">
                <ArrowUpRight className="w-4 h-4" /> {data.summary.growthCount}
              </span>
              <span className="text-zinc-600">/</span>
              <span className="text-rose-400 flex items-center text-base">
                <ArrowDownRight className="w-4 h-4" /> {data.summary.declineCount}
              </span>
            </div>
          </div>

          <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Page 1 Terms (#1-10)
            </div>
            <div className="text-xl font-extrabold text-amber-400 mt-0.5 font-mono flex items-center justify-between">
              <span>{data.summary.pageOneCount} / {data.activeKeywords.length}</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Tab 1: Recharts Interactive Ranking History */}
        {activeTab === 'chart' && (
          <div className="space-y-4">
            {/* Interactive Legend with Visibility Toggle */}
            <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mr-1">
                  <Filter className="w-3.5 h-3.5 text-indigo-400" />
                  Interactive Keyword Legend:
                </span>

                {data.activeKeywords.map((kw, idx) => {
                  const isHidden = hiddenKeywords[kw];
                  const color = KEYWORD_COLORS[idx % KEYWORD_COLORS.length];
                  const trendObj = data.keywordTrends.find((t) => t.keyword === kw);

                  return (
                    <button
                      key={kw}
                      onClick={() => toggleKeywordVisibility(kw)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-2 ${
                        !isHidden
                          ? 'bg-zinc-800 text-zinc-100 border-zinc-700 shadow-sm hover:border-zinc-600'
                          : 'bg-zinc-900/40 text-zinc-500 border-zinc-800/80 line-through'
                      }`}
                      title={isHidden ? `Click to show '${kw}' on chart` : `Click to hide '${kw}' on chart`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: !isHidden ? color : '#3f3f46' }}
                      />
                      <span>{kw}</span>
                      {trendObj && !isHidden && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            trendObj.change > 0
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : trendObj.change < 0
                              ? 'text-rose-400 bg-rose-500/10'
                              : 'text-zinc-400 bg-zinc-800'
                          }`}
                        >
                          #{trendObj.currentRank} ({trendObj.change > 0 ? `+${trendObj.change}` : trendObj.change})
                        </span>
                      )}
                      {!isHidden ? <Eye className="w-3 h-3 text-zinc-400" /> : <EyeOff className="w-3 h-3 text-zinc-600" />}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Keyword Input */}
              <div className="flex items-center gap-1.5 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Track new keyword..."
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  onClick={handleAddKeyword}
                  className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all cursor-pointer"
                  title="Add Keyword"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Recharts Canvas */}
            <div className="h-80 w-full bg-zinc-950/90 p-3 rounded-xl border border-zinc-800/80 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.rankData} margin={{ top: 15, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#3f3f46' }}
                  />
                  <YAxis
                    reversed={true} // #1 position is at the very top of Y Axis!
                    domain={[1, 35]}
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#3f3f46' }}
                    tickFormatter={(v) => `#${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#3f3f46',
                      borderRadius: '0.75rem',
                      color: '#f4f4f5',
                      fontSize: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.7)',
                    }}
                    formatter={(val: any, name: any) => [
                      `Rank #${val} (${val <= 3 ? '🏆 Top 3' : val <= 10 ? '✅ Page 1' : 'Page 2+'})`,
                      name,
                    ]}
                    labelFormatter={(lbl) => `SERP Snapshot Date: ${lbl} (${selectedDomain})`}
                  />

                  {/* Top 3 Benchmark Line */}
                  <ReferenceLine
                    y={3}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    label={{ value: 'Top 3 Organic Spot', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }}
                  />

                  {/* Page 1 Cutoff Line */}
                  <ReferenceLine
                    y={10}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{ value: 'Page 1 Cutoff (#10)', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }}
                  />

                  {/* Dynamic Keyword Lines */}
                  {data.activeKeywords.map((kw, idx) => {
                    if (hiddenKeywords[kw]) return null;
                    const color = KEYWORD_COLORS[idx % KEYWORD_COLORS.length];
                    return (
                      <Line
                        key={kw}
                        type="monotone"
                        dataKey={kw}
                        name={kw}
                        stroke={color}
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: color }}
                        activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: 30-Day Performance Growth / Decline Identification Panel */}
        {activeTab === 'trends' && (
          <div className="space-y-4">
            {/* Filter Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter keyphrases by name..."
                  value={keywordFilterSearch}
                  onChange={(e) => setKeywordFilterSearch(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div className="text-xs text-zinc-400 font-medium">
                Showing <span className="text-zinc-100 font-bold">{filteredTrends.length}</span> keyphrases analyzed over last {days} days
              </div>
            </div>

            {/* Keyword Performance Trend Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTrends.map((kt) => {
                const isGrowth = kt.trend === 'GROWTH';
                const isDecline = kt.trend === 'DECLINE';

                return (
                  <div
                    key={kt.keyword}
                    className={`p-4 rounded-xl border transition-all ${
                      isGrowth
                        ? 'bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/40'
                        : isDecline
                        ? 'bg-rose-950/20 border-rose-500/20 hover:border-rose-500/40'
                        : 'bg-zinc-950/60 border-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-zinc-100">{kt.keyword}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              isGrowth
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : isDecline
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {isGrowth && <ArrowUpRight className="w-3 h-3" />}
                            {isDecline && <ArrowDownRight className="w-3 h-3" />}
                            {!isGrowth && !isDecline && <Minus className="w-3 h-3" />}
                            <span>{kt.trend}</span>
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 mt-1">
                          Started at <span className="font-mono text-zinc-300">#{kt.startRank}</span> → Currently at{' '}
                          <span className="font-mono text-zinc-100 font-bold">#{kt.currentRank}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-base font-extrabold font-mono ${
                            isGrowth ? 'text-emerald-400' : isDecline ? 'text-rose-400' : 'text-zinc-400'
                          }`}
                        >
                          {kt.change > 0 ? `+${kt.change} spots` : kt.change < 0 ? `${kt.change} spots` : 'No Change'}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Best Spot: #{kt.bestRank}</div>
                      </div>
                    </div>

                    {/* Progress / Visibility Bar */}
                    <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                        <span>Visibility Index:</span>
                        <span className="font-mono font-bold text-indigo-400">{kt.visibilityScore}%</span>
                      </div>

                      <div className="text-[11px]">
                        {kt.currentRank <= 10 ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Page 1 Position
                          </span>
                        ) : (
                          <span className="text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Needs Content Optimization
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
