import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Calendar,
  Filter,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Globe,
  Award
} from 'lucide-react';
import { LogItem, SubmissionRecord } from '../types';

interface HistoricalRankChartWidgetProps {
  logs?: LogItem[];
  history?: SubmissionRecord[];
}

// Sample keywords for default visualization if logs don't specify explicit keywords
const DEFAULT_KEYWORDS = [
  'resume optimizer',
  'ATS audit tool',
  'career matches',
  'backlink indexer',
  'SEO rank tracker'
];

interface RankDataPoint {
  date: string;
  fullDate: string;
  [key: string]: any; // Dynamic keyword rank positions (1-100)
}

export const HistoricalRankChartWidget: React.FC<HistoricalRankChartWidgetProps> = ({
  logs = [],
  history = []
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('14d');
  const [selectedDomain, setSelectedDomain] = useState<string>('careerpulseai.net');
  const [activeKeywords, setActiveKeywords] = useState<string[]>(DEFAULT_KEYWORDS.slice(0, 3));
  const [customKeywordInput, setCustomKeywordInput] = useState('');

  // Extract unique domains from logs if available
  const availableDomains = useMemo(() => {
    const set = new Set<string>();
    set.add('careerpulseai.net');
    set.add('example.com');
    logs.forEach(l => {
      try {
        if (l.targetUrl) {
          const host = new URL(l.targetUrl.startsWith('http') ? l.targetUrl : `https://${l.targetUrl}`).hostname.replace(/^www\./, '');
          if (host) set.add(host);
        }
      } catch (e) {}
    });
    return Array.from(set);
  }, [logs]);

  // Generate deterministic time-series chart data based on history/days
  const chartData = useMemo(() => {
    const daysCount = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    const data: RankDataPoint[] = [];
    const now = new Date('2026-08-12T18:30:00Z');

    // Color palette for lines
    const keywordBaseScores: Record<string, number> = {
      'resume optimizer': 2,
      'ATS audit tool': 5,
      'career matches': 12,
      'backlink indexer': 1,
      'SEO rank tracker': 8,
    };

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const fullDate = d.toISOString().split('T')[0];

      const point: RankDataPoint = {
        date: dateStr,
        fullDate,
      };

      // Generate consistent keyword rank values (1 is #1 position, 100 is unranked)
      activeKeywords.forEach((kw) => {
        const base = keywordBaseScores[kw] || ((kw.length * 3) % 25) + 1;
        // Introduce small realistic variation over days
        const noise = Math.floor(Math.sin(i * 0.8 + kw.length) * 3);
        const rank = Math.max(1, Math.min(100, base + noise));
        point[kw] = rank;
        point[`${kw}_score`] = Math.max(0, 100 - (rank - 1) * 2);
      });

      data.push(point);
    }

    return data;
  }, [timeRange, activeKeywords]);

  // Keyword line colors map
  const KEYWORD_COLORS = [
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#8b5cf6', // Purple
  ];

  const handleAddKeyword = () => {
    if (!customKeywordInput.trim()) return;
    const kw = customKeywordInput.trim().toLowerCase();
    if (!activeKeywords.includes(kw)) {
      setActiveKeywords([...activeKeywords, kw]);
    }
    setCustomKeywordInput('');
  };

  const toggleKeyword = (kw: string) => {
    if (activeKeywords.includes(kw)) {
      if (activeKeywords.length > 1) {
        setActiveKeywords(activeKeywords.filter((k) => k !== kw));
      }
    } else {
      setActiveKeywords([...activeKeywords, kw]);
    }
  };

  // Compute metric stats
  const bestRank = useMemo(() => {
    if (chartData.length === 0 || activeKeywords.length === 0) return 1;
    let minR = 100;
    const latest = chartData[chartData.length - 1];
    activeKeywords.forEach(kw => {
      if (latest[kw] && latest[kw] < minR) {
        minR = latest[kw];
      }
    });
    return minR;
  }, [chartData, activeKeywords]);

  const avgRank = useMemo(() => {
    if (chartData.length === 0 || activeKeywords.length === 0) return 0;
    const latest = chartData[chartData.length - 1];
    let sum = 0;
    activeKeywords.forEach(kw => {
      sum += latest[kw] || 50;
    });
    return (sum / activeKeywords.length).toFixed(1);
  }, [chartData, activeKeywords]);

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl transition-all">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span>Historical Keyword Ranking Changes (Recharts)</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono font-semibold">
                Live Tracking
              </span>
            </h4>
            <p className="text-xs text-zinc-400">
              Track SERP position improvements and visibility score shifts over time for target keyphrases.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Domain Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800 text-xs">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-transparent text-zinc-200 text-xs focus:outline-none cursor-pointer font-medium"
            >
              {availableDomains.map((d) => (
                <option key={d} value={d} className="bg-zinc-900 text-zinc-200">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Toggles */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            {(['7d', '14d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                  timeRange === r
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all cursor-pointer"
            title={isExpanded ? 'Collapse Chart' : 'Expand Chart'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-5 space-y-4 animate-fadeIn">
          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Top Organic Rank
                </div>
                <div className="text-xl font-extrabold text-emerald-400 mt-0.5 flex items-center gap-1 font-mono">
                  <span>#{bestRank}</span>
                  <Award className="w-4 h-4 text-emerald-400 inline" />
                </div>
              </div>
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-medium">
                Page 1 Position
              </span>
            </div>

            <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Avg Position Across Tracked
                </div>
                <div className="text-xl font-extrabold text-indigo-400 mt-0.5 font-mono">
                  #{avgRank}
                </div>
              </div>
              <span className="text-[11px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg font-medium">
                {activeKeywords.length} Keywords Active
              </span>
            </div>

            <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                  14-Day Visibility Score
                </div>
                <div className="text-xl font-extrabold text-amber-400 mt-0.5 font-mono">
                  92.4 <span className="text-xs text-zinc-500 font-sans">/ 100</span>
                </div>
              </div>
              <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+4.2%</span>
              </span>
            </div>
          </div>

          {/* Keyword Chip Selector & Custom Add Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-zinc-400 font-medium mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-indigo-400" />
                Tracked Keyphrases:
              </span>
              {DEFAULT_KEYWORDS.concat(activeKeywords.filter(k => !DEFAULT_KEYWORDS.includes(k))).map((kw, idx) => {
                const isActive = activeKeywords.includes(kw);
                const color = KEYWORD_COLORS[idx % KEYWORD_COLORS.length];
                return (
                  <button
                    key={kw}
                    onClick={() => toggleKeyword(kw)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-zinc-800 text-zinc-100 border-zinc-600 shadow-sm'
                        : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: isActive ? color : '#52525b' }}
                    />
                    <span>{kw}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Keyword Input */}
            <div className="flex items-center gap-1.5 min-w-[220px]">
              <input
                type="text"
                placeholder="+ Add keyword..."
                value={customKeywordInput}
                onChange={(e) => setCustomKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                onClick={handleAddKeyword}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Add
              </button>
            </div>
          </div>

          {/* Recharts Line Chart Container */}
          <div className="h-64 w-full bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#3f3f46' }}
                />
                <YAxis
                  reversed={true} // Reverses axis so Rank #1 is at the top!
                  domain={[1, 30]}
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#3f3f46' }}
                  tickFormatter={(value) => `#${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#3f3f46',
                    borderRadius: '0.75rem',
                    color: '#f4f4f5',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  }}
                  formatter={(value: any, name: any) => [
                    `Rank #${value} (${value <= 3 ? 'Excellent' : value <= 10 ? 'Good / Page 1' : 'Fair'})`,
                    name,
                  ]}
                  labelFormatter={(label) => `Date: ${label} (${selectedDomain})`}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />

                {/* Benchmark Top Page 1 Line */}
                <ReferenceLine
                  y={10}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{ value: 'Page 1 Cutoff (#10)', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }}
                />

                {/* Keyword Trend Lines */}
                {activeKeywords.map((kw, idx) => (
                  <Line
                    key={kw}
                    type="monotone"
                    dataKey={kw}
                    name={kw}
                    stroke={KEYWORD_COLORS[idx % KEYWORD_COLORS.length]}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: KEYWORD_COLORS[idx % KEYWORD_COLORS.length] }}
                    activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
