import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import {
  Target,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  BarChart2,
  Users,
  CheckCircle2,
  Zap,
  Copy,
  Check,
  Lightbulb,
  Sliders
} from 'lucide-react';

interface ClusterData {
  cluster: string;
  userDomainScore: number;
  competitorAScore: number;
  competitorBScore: number;
  industryAvgScore: number;
  intent: 'Commercial' | 'Informational' | 'Transactional' | 'GEO Focus';
  gapLevel: 'High Gap' | 'Moderate' | 'Lead';
}

interface KeywordGapRadarProps {
  onOpenContentGrader?: (url?: string, keyword?: string) => void;
}

export interface CompetitorAnalysisResult {
  compA: string;
  compAUrl: string;
  compAJustification: string;
  compB: string;
  compBUrl: string;
  compBJustification: string;
  nicheLabel: string;
}

export function deriveCompetitorsAndPriorityUrls(domainInput: string): CompetitorAnalysisResult {
  const clean = (domainInput || '').trim().toLowerCase().replace(/^(https?:\/\/)+/i, '').replace(/\/+$/, '');

  if (
    clean.includes('skincare') ||
    clean.includes('organic') ||
    clean.includes('beauty') ||
    clean.includes('skin') ||
    clean.includes('cosmetic') ||
    clean.includes('glow')
  ) {
    return {
      compA: 'gloworganics.com',
      compAUrl: 'https://gloworganics.com/collections/best-sellers',
      compAJustification:
        'High-volume organic search landing page capturing 45% of non-branded commercial intent queries for natural skincare with prime revenue potential.',
      compB: 'purebotanicals.com',
      compBUrl: 'https://purebotanicals.com/products/anti-aging-serum',
      compBJustification:
        'Top revenue-generating hero product URL with high transaction conversion rate and dominant AI search entity citations.',
      nicheLabel: 'Organic Skincare & E-Commerce Store',
    };
  }

  if (
    clean.includes('seo') ||
    clean.includes('rank') ||
    clean.includes('index') ||
    clean.includes('serp') ||
    clean.includes('backlink') ||
    clean.includes('keyword')
  ) {
    return {
      compA: 'serpflow.io',
      compAUrl: 'https://serpflow.io/features/auto-indexing',
      compAJustification:
        'Primary direct competitor URL driving high-volume organic search traffic for automated directory submission pipelines.',
      compB: 'indexerpro.com',
      compBUrl: 'https://indexerpro.com/pricing',
      compBJustification:
        'High-converting commercial intent landing page targeting enterprise backlink indexing queries with high customer lifetime value.',
      nicheLabel: 'SEO & Web Indexing Automation',
    };
  }

  if (
    clean.includes('crypto') ||
    clean.includes('pay') ||
    clean.includes('fin') ||
    clean.includes('bank') ||
    clean.includes('money')
  ) {
    return {
      compA: 'finflow.io',
      compAUrl: 'https://finflow.io/products/payment-gateway',
      compAJustification:
        'Leading commercial gateway URL capturing massive organic traffic for developer API payment integrations and cross-border settlement.',
      compB: 'paystack.com',
      compBUrl: 'https://paystack.com/developer-docs',
      compBJustification:
        'Core developer documentation portal commanding top domain authority and high brand search trust across organic search engines.',
      nicheLabel: 'FinTech & Payment Infrastructure',
    };
  }

  if (
    clean.includes('fit') ||
    clean.includes('gym') ||
    clean.includes('health') ||
    clean.includes('workout') ||
    clean.includes('nutri')
  ) {
    return {
      compA: 'fitpulse.com',
      compAUrl: 'https://fitpulse.com/programs/hiit-workout',
      compAJustification:
        'Top organic search destination URL driving over 120k monthly visits for transactional fitness program signups.',
      compB: 'peaknutrition.io',
      compBUrl: 'https://peaknutrition.io/supplements/protein',
      compBJustification:
        'Highest revenue-producing e-commerce URL commanding strong brand trust and top position for high-volume commercial intent queries.',
      nicheLabel: 'Fitness & Health Nutrition',
    };
  }

  // General fallback based on domain input
  const name = clean.split('.')[0] || 'brand';
  const prefix = name.length > 2 ? name : 'market';
  return {
    compA: `${prefix}flow.io`,
    compAUrl: `https://${prefix}flow.io/solutions/enterprise-platform`,
    compAJustification: `High-volume organic search landing page for ${clean || 'target domain'} competitors, capturing top non-branded commercial intent and driving core revenue growth.`,
    compB: `${prefix}pro.com`,
    compBUrl: `https://${prefix}pro.com/pricing-plans`,
    compBJustification: `Top converting transaction URL commanding maximum brand value, high search traffic potential, and strong AI answer engine authority.`,
    nicheLabel: `${prefix.charAt(0).toUpperCase() + prefix.slice(1)} Industry Sector`,
  };
}

export const KeywordGapRadar: React.FC<KeywordGapRadarProps> = ({ onOpenContentGrader }) => {
  const [userDomain, setUserDomain] = useState<string>('organic-skincare.com');
  const [compA, setCompA] = useState<string>('gloworganics.com');
  const [compB, setCompB] = useState<string>('purebotanicals.com');
  const [selectedCluster, setSelectedCluster] = useState<ClusterData | null>(null);
  const [isCompetitorAnalysisOpen, setIsCompetitorAnalysisOpen] = useState<boolean>(true);
  const [benchmarkMode, setBenchmarkMode] = useState<'comparative' | 'solo'>('comparative');
  const [appliedFixes, setAppliedFixes] = useState<Record<string, boolean>>({});

  const cleanUserDomain = userDomain.trim().replace(/^(https?:\/\/)+/i, '').replace(/\/+$/, '') || 'organic-skincare.com';
  const competitorAnalysis = deriveCompetitorsAndPriorityUrls(userDomain);

  // Automatically update Competitor A and Competitor B when userDomain changes
  const handleUserDomainChange = (newDomain: string) => {
    setUserDomain(newDomain);
    const derived = deriveCompetitorsAndPriorityUrls(newDomain);
    setCompA(derived.compA);
    setCompB(derived.compB);
  };

  const handleSyncCompetitors = () => {
    const derived = deriveCompetitorsAndPriorityUrls(userDomain);
    setCompA(derived.compA);
    setCompB(derived.compB);
    toast.success(`Synced Top 2 Competitors for ${userDomain}: ${derived.compA} & ${derived.compB}`);
  };

  const [clusterData, setClusterData] = useState<ClusterData[]>([
    {
      cluster: 'AI Search & GEO',
      userDomainScore: 42,
      competitorAScore: 88,
      competitorBScore: 75,
      industryAvgScore: 54,
      intent: 'GEO Focus',
      gapLevel: 'High Gap',
    },
    {
      cluster: 'Directory Indexing',
      userDomainScore: 85,
      competitorAScore: 70,
      competitorBScore: 65,
      industryAvgScore: 60,
      intent: 'Transactional',
      gapLevel: 'Lead',
    },
    {
      cluster: 'Technical Crawlability',
      userDomainScore: 68,
      competitorAScore: 92,
      competitorBScore: 80,
      industryAvgScore: 64,
      intent: 'Informational',
      gapLevel: 'High Gap',
    },
    {
      cluster: 'Commercial Prompts',
      userDomainScore: 50,
      competitorAScore: 85,
      competitorBScore: 90,
      industryAvgScore: 58,
      intent: 'Commercial',
      gapLevel: 'High Gap',
    },
    {
      cluster: 'Schema & Entities',
      userDomainScore: 60,
      competitorAScore: 82,
      competitorBScore: 78,
      industryAvgScore: 52,
      intent: 'GEO Focus',
      gapLevel: 'Moderate',
    },
    {
      cluster: 'Backlink Velocity',
      userDomainScore: 90,
      competitorAScore: 65,
      competitorBScore: 72,
      industryAvgScore: 62,
      intent: 'Transactional',
      gapLevel: 'Lead',
    },
  ]);

  const handleRecalculate = () => {
    // Generate domain-specific deterministic variance
    let hash = 0;
    const str = `${userDomain}-${compA}-${compB}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    setClusterData((prev) =>
      prev.map((item, idx) => {
        const var1 = (Math.abs(hash + idx * 13) % 45) + 40;
        const var2 = (Math.abs(hash + idx * 29) % 35) + 60;
        const var3 = (Math.abs(hash + idx * 47) % 35) + 55;
        const avg = Math.round((var1 + var2 + var3) / 3);

        const maxComp = Math.max(var2, var3);
        let gapLevel: 'High Gap' | 'Moderate' | 'Lead' = 'Lead';
        if (maxComp - var1 > 25) gapLevel = 'High Gap';
        else if (maxComp - var1 > 10) gapLevel = 'Moderate';

        return {
          ...item,
          userDomainScore: var1,
          competitorAScore: var2,
          competitorBScore: var3,
          industryAvgScore: avg,
          gapLevel,
        };
      })
    );
  };

  const highGapClusters = clusterData.filter((c) => c.gapLevel === 'High Gap' || c.gapLevel === 'Moderate');

  const avgUserScore = Math.round(
    clusterData.reduce((acc, curr) => acc + curr.userDomainScore, 0) / clusterData.length
  );
  const avgCompetitorScore = Math.round(
    clusterData.reduce(
      (acc, curr) => acc + Math.max(curr.competitorAScore, curr.competitorBScore),
      0
    ) / clusterData.length
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ClusterData;
      return (
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl shadow-xl text-xs font-mono space-y-1">
          <p className="font-bold text-indigo-300 uppercase">{data.cluster}</p>
          <div className="text-emerald-400 font-bold">{userDomain}: {data.userDomainScore}% Visibility</div>
          {benchmarkMode === 'comparative' ? (
            <>
              <div className="text-cyan-400">{compA}: {data.competitorAScore}% Visibility</div>
              <div className="text-amber-400">{compB}: {data.competitorBScore}% Visibility</div>
            </>
          ) : (
            <div className="text-indigo-400">Industry Avg Benchmark: {data.industryAvgScore}% Visibility</div>
          )}
          <div className="text-zinc-400 text-[10px] mt-1 pt-1 border-t border-zinc-800">
            Intent Type: <span className="text-zinc-200">{data.intent}</span> | Gap: <span className="text-rose-400 font-bold">{data.gapLevel}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400 animate-pulse" />
            <h2 className="text-base font-bold text-zinc-100">
              Keyword Gap Radar (SERP &amp; GEO Overlap)
            </h2>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
              Competitive Intelligence
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Visualize keyword cluster overlap against top competitors to spot critical AI visibility and ranking gaps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Competitive Benchmarking Mode Toggle */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 font-mono text-xs shadow-inner">
            <button
              type="button"
              onClick={() => setBenchmarkMode('solo')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all text-xs font-bold ${
                benchmarkMode === 'solo'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Focus purely on your domain metrics & baseline benchmark gap"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>My Domain Focus</span>
            </button>
            <button
              type="button"
              onClick={() => setBenchmarkMode('comparative')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all text-xs font-bold ${
                benchmarkMode === 'comparative'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Compare side-by-side against Top 3 Direct Competitors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>3-Way Competitor Benchmark</span>
            </button>
          </div>

          <button
            onClick={() => setIsCompetitorAnalysisOpen(!isCompetitorAnalysisOpen)}
            className="px-3 py-1.5 bg-gradient-to-r from-cyan-950 to-indigo-950 hover:from-cyan-900 hover:to-indigo-900 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Competitor Strategy</span>
          </button>

          <button
            onClick={handleRecalculate}
            className="px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/80 text-indigo-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Recalculate Overlap</span>
          </button>
        </div>
      </div>

      {/* Domain Configuration Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Your Domain</label>
            <button
              type="button"
              onClick={handleSyncCompetitors}
              className="text-[9px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              title="Auto-detect top 2 competitors based on your domain"
            >
              Auto-Detect Top 2
            </button>
          </div>
          <input
            type="text"
            value={userDomain}
            onChange={(e) => handleUserDomainChange(e.target.value)}
            className="w-full bg-zinc-950/90 border border-emerald-500/40 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-300 font-bold focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all shadow-inner hover:border-emerald-500/60"
            placeholder="organic-skincare.com"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-cyan-400 mb-1 tracking-wider">Competitor A</label>
          <input
            type="text"
            value={compA}
            onChange={(e) => setCompA(e.target.value)}
            className="w-full bg-zinc-950/90 border border-cyan-500/40 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all shadow-inner hover:border-cyan-500/60"
            placeholder="gloworganics.com"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-amber-400 mb-1 tracking-wider">Competitor B</label>
          <input
            type="text"
            value={compB}
            onChange={(e) => setCompB(e.target.value)}
            className="w-full bg-zinc-950/90 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs font-mono text-amber-300 font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner hover:border-amber-500/60"
            placeholder="purebotanicals.com"
          />
        </div>
      </div>

      {/* Mode Indicator & Summary KPIs */}
      <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Active Benchmark View:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            benchmarkMode === 'solo'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
          }`}>
            {benchmarkMode === 'solo' ? 'My Domain Metrics Focus' : '3-Way Comparative Benchmark'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div>
            <span className="text-zinc-500">Avg Visibility:</span>{' '}
            <strong className="text-emerald-400">{avgUserScore}%</strong>
          </div>
          <div>
            <span className="text-zinc-500">{benchmarkMode === 'solo' ? 'Benchmark Target:' : 'Top Competitor Avg:'}</span>{' '}
            <strong className="text-cyan-400">{avgCompetitorScore}%</strong>
          </div>
          <div>
            <span className="text-zinc-500">Gap Delta:</span>{' '}
            <strong className={avgUserScore < avgCompetitorScore ? 'text-rose-400' : 'text-emerald-400'}>
              {avgUserScore >= avgCompetitorScore ? '+' : ''}{avgUserScore - avgCompetitorScore}%
            </strong>
          </div>
        </div>
      </div>

      {/* Collapsible AI Competitor & Market Research Panel */}
      {isCompetitorAnalysisOpen && (
        <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-300 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider font-mono">
                AI Market Research &amp; Enterprise SEO Competitor Strategy
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                Target: {userDomain || 'mybrand.com'}
              </span>
            </div>
            <button
              onClick={() => setIsCompetitorAnalysisOpen(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300 font-mono"
            >
              Hide Strategy
            </button>
          </div>

          {/* Top 2 Selected Priority URLs Analysis Card */}
          <div className="bg-zinc-950/90 border border-cyan-500/30 p-4 rounded-xl space-y-3 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-zinc-800 gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider">
                  Top 2 Competitor Priority URLs Analysis for <span className="text-emerald-400 font-bold">{userDomain}</span>
                </h4>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                Industry Niche: <span className="text-indigo-300 font-bold">{competitorAnalysis.nicheLabel}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Competitor A Priority URL */}
              <div className="bg-zinc-900/90 border border-cyan-500/20 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Priority Competitor 1 ({compA})</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 font-bold">
                    Top Revenue & Traffic Potential
                  </span>
                </div>
                <div className="bg-zinc-950 p-2 rounded-lg font-mono text-xs text-cyan-200 select-all overflow-x-auto border border-zinc-800/80">
                  {competitorAnalysis.compAUrl}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  <strong className="text-zinc-200 font-medium">Justification:</strong> {competitorAnalysis.compAJustification}
                </p>
              </div>

              {/* Competitor B Priority URL */}
              <div className="bg-zinc-900/90 border border-amber-500/20 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Priority Competitor 2 ({compB})</span>
                  </span>
                  <span className="text-[9px] font-mono text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800 font-bold">
                    High Search Intent & Brand Value
                  </span>
                </div>
                <div className="bg-zinc-950 p-2 rounded-lg font-mono text-xs text-amber-200 select-all overflow-x-auto border border-zinc-800/80">
                  {competitorAnalysis.compBUrl}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  <strong className="text-zinc-200 font-medium">Justification:</strong> {competitorAnalysis.compBJustification}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            
            {/* Section 1: Top 3 Direct Competitors */}
            <div className="bg-zinc-900/80 border border-zinc-800/90 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-indigo-300 font-bold font-mono text-[11px] uppercase">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-400" />
                  1. Top 3 Direct Competitors
                </span>
                <span className="text-[10px] text-zinc-500">Same Core Solution</span>
              </div>
              <ul className="space-y-2 text-zinc-300 text-[11px] leading-relaxed">
                <li className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                  <strong className="text-indigo-300 font-mono">Ahrefs / Semrush (SaaS Analytics Ensembles):</strong> High threat due to massive historical backlink indexes (30B+ pages) and established brand search trust.
                </li>
                <li className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                  <strong className="text-cyan-300 font-mono">Serpstat / Indexification Platforms ({compA}):</strong> Direct threat in directory submission velocity and automated link indexing guarantees.
                </li>
                <li className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                  <strong className="text-amber-300 font-mono">RankMath / Yoast Enterprise ({compB}):</strong> Direct threat for CMS site owners capturing early search intent with automated schema markup.
                </li>
              </ul>
            </div>

            {/* Section 2: Top 2 Indirect Competitors */}
            <div className="bg-zinc-900/80 border border-zinc-800/90 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-cyan-300 font-bold font-mono text-[11px] uppercase">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  2. Top 2 Indirect Competitors
                </span>
                <span className="text-[10px] text-zinc-500">Alternate Solutions</span>
              </div>
              <ul className="space-y-2 text-zinc-300 text-[11px] leading-relaxed">
                <li className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                  <strong className="text-cyan-300 font-mono">Custom In-House Growth Agencies:</strong> Solve the problem via manual PR outreach &amp; white-glove directory submissions instead of automated SaaS tooling.
                </li>
                <li className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                  <strong className="text-emerald-300 font-mono">Programmatic SEO Frameworks (Next.js / Astro):</strong> Developers building custom static pages locally to capture long-tail keywords without third-party indexing services.
                </li>
              </ul>
            </div>

            {/* Section 3: Organic Search & AI Publishers */}
            <div className="bg-zinc-900/80 border border-zinc-800/90 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-amber-300 font-bold font-mono text-[11px] uppercase">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  3. Organic &amp; AI Search Publishers
                </span>
                <span className="text-[10px] text-zinc-500">LLM &amp; SERP Citation</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Search engines and LLM engines (ChatGPT, Perplexity, Gemini) heavily cite <strong>G2, Capterra, ProductHunt, GitHub repositories</strong>, and technical engineering blogs (Dev.to, Medium) over vendor sales pages for high-intent keywords.
              </p>
            </div>

            {/* Section 4: Competitive Gap & Content Moat */}
            <div className="bg-zinc-900/80 border border-zinc-800/90 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-emerald-300 font-bold font-mono text-[11px] uppercase">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                  4. Competitive Gap &amp; Content Moat
                </span>
                <span className="text-[10px] text-zinc-500">Growth Playbook</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                <strong className="text-emerald-300 font-mono">The Biggest Advantage Rivals Have:</strong> Established domain age and backlink depth.
                <br />
                <strong className="text-indigo-300 font-mono">Your Recommended Content Moat:</strong> Build "Answer-First" structured data blocks with live benchmark calculators, JSON-LD FAQ schema, and direct GEO entity tables to bypass legacy SERP competitors in AI summaries.
              </p>
            </div>

            {/* Section 5: Recommended Fixes to Gain Competitive Advantages */}
            <div className="md:col-span-2 bg-zinc-950/90 border border-indigo-500/40 p-4 rounded-xl space-y-3 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-zinc-800 gap-2">
                <div className="flex items-center gap-2 text-indigo-300 font-bold font-mono text-[12px] uppercase">
                  <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                  <span>5. Recommended Fixes for Immediate Competitive Advantage</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  5 High-Impact Actions Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Recommended Fix 1 */}
                <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2 flex flex-col justify-between hover:border-indigo-500/50 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>GEO JSON-LD Schema Fix</span>
                      </strong>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded font-bold border border-emerald-800">
                        +35% Citation
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Deploy Organization, FAQ &amp; Dataset schemas. Forces ChatGPT &amp; Perplexity to cite your brand over legacy directories.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
                    <button
                      onClick={() => {
                        const code = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How does ${userDomain} compare to legacy competitors?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "${userDomain} provides zero-latency IndexNow submission and AI Content Grading."
    }
  }]
}
</script>`;
                        navigator.clipboard.writeText(code);
                        setAppliedFixes((prev) => ({ ...prev, fix1: true }));
                        toast.success('GEO Schema code copied to clipboard!');
                      }}
                      className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 rounded-lg text-[10px] font-bold flex items-center gap-1 font-mono transition-all"
                    >
                      {appliedFixes.fix1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-indigo-400" />}
                      <span>{appliedFixes.fix1 ? 'Schema Copied' : 'Copy GEO Schema'}</span>
                    </button>
                    {onOpenContentGrader && (
                      <button
                        onClick={() => onOpenContentGrader(`https://${cleanUserDomain}`, 'GEO Schema')}
                        className="text-emerald-400 hover:text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1"
                      >
                        <span>Grade Page</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Recommended Fix 2 */}
                <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2 flex flex-col justify-between hover:border-indigo-500/50 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Answer-First 150-Word Hook</span>
                      </strong>
                      <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded font-bold border border-cyan-800">
                        Gemini AI Overview
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Reformat top 150 words into quantitative summary tables &amp; direct factual definitions to dominate Gemini AI Overviews.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
                    <button
                      onClick={() => {
                        setAppliedFixes((prev) => ({ ...prev, fix2: true }));
                        toast.success('Answer-First Hook strategy marked as active!');
                        if (onOpenContentGrader) {
                          onOpenContentGrader(`https://${cleanUserDomain}`, 'AI Overview Hook');
                        }
                      }}
                      className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 rounded-lg text-[10px] font-bold flex items-center gap-1 font-mono transition-all"
                    >
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>Optimize Page Hook</span>
                    </button>
                  </div>
                </div>

                {/* Recommended Fix 3 */}
                <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2 flex flex-col justify-between hover:border-indigo-500/50 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Zero-Latency IndexNow Ping</span>
                      </strong>
                      <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950 px-1.5 py-0.5 rounded font-bold border border-indigo-800">
                        &lt; 3s Crawl Moat
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Automate IndexNow protocol pings upon page publication. Outpace slow rivals relying on traditional 14-day bot crawls.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
                    <button
                      onClick={() => {
                        setAppliedFixes((prev) => ({ ...prev, fix3: true }));
                        toast.success('Zero-Latency IndexNow ping strategy activated!');
                      }}
                      className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 rounded-lg text-[10px] font-bold flex items-center gap-1 font-mono transition-all"
                    >
                      {appliedFixes.fix3 ? <Check className="w-3 h-3 text-emerald-400" /> : <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      <span>{appliedFixes.fix3 ? 'Ping Active' : 'Enable Auto-Ping'}</span>
                    </button>
                  </div>
                </div>

                {/* Recommended Fix 4 */}
                <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2 flex flex-col justify-between hover:border-indigo-500/50 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-rose-400" />
                        <span>Competitor Alternative Pages</span>
                      </strong>
                      <span className="text-[9px] font-mono text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded font-bold border border-rose-800">
                        +28% Conversion
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Deploy programmatic "vs {compA || 'Competitor'}" landing pages with live benchmark tables and pricing calculators.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
                    <button
                      onClick={() => {
                        setAppliedFixes((prev) => ({ ...prev, fix4: true }));
                        toast.success(`Competitor interception page for vs ${compA} generated!`);
                      }}
                      className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700/50 rounded-lg text-[10px] font-bold flex items-center gap-1 font-mono transition-all"
                    >
                      <Target className="w-3 h-3 text-rose-400" />
                      <span>Intercept vs {compA || 'Rival'}</span>
                    </button>
                  </div>
                </div>

                {/* Recommended Fix 5 */}
                <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2 flex flex-col justify-between hover:border-indigo-500/50 transition-all md:col-span-2 lg:col-span-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span>Tier-1 Directory &amp; Co-Citation Moat</span>
                      </strong>
                      <span className="text-[9px] font-mono text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded font-bold border border-purple-800">
                        LLM Training Weight
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Distribute brand entity profile across ProductHunt, GitHub Repos, G2 Badges, and High-DA Directories to elevate entity weighting in AI training corpuses.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
                    <span className="text-[10px] font-mono text-zinc-400">
                      Network Target: <strong className="text-purple-300">High-DA Authority Hubs</strong>
                    </span>
                    <button
                      onClick={() => {
                        setAppliedFixes((prev) => ({ ...prev, fix5: true }));
                        toast.success('Directory co-citation distribution task queued!');
                      }}
                      className="px-2.5 py-1 bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-700/50 rounded-lg text-[10px] font-bold flex items-center gap-1 font-mono transition-all"
                    >
                      {appliedFixes.fix5 ? <Check className="w-3 h-3 text-purple-400" /> : <BarChart2 className="w-3 h-3 text-purple-400" />}
                      <span>{appliedFixes.fix5 ? 'Queued for Submission' : 'Queue Directory Batch'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Grid Layout: Radar Chart + Gap Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Radar Chart Column */}
        <div className="lg:col-span-7 bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 h-72 sm:h-80 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={clusterData}>
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis dataKey="cluster" stroke="#a1a1aa" fontSize={10} tickLine={false} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#52525b" fontSize={9} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }}
                formatter={(value) => <span className="text-zinc-300 font-medium">{value}</span>}
              />
              <Radar
                name={userDomain}
                dataKey="userDomainScore"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.4}
                strokeWidth={2.5}
              />
              {benchmarkMode === 'comparative' ? (
                <>
                  <Radar
                    name={compA}
                    dataKey="competitorAScore"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.15}
                    strokeWidth={1.5}
                  />
                  <Radar
                    name={compB}
                    dataKey="competitorBScore"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.15}
                    strokeWidth={1.5}
                  />
                </>
              ) : (
                <Radar
                  name="Industry Benchmark Target"
                  dataKey="industryAvgScore"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* High-Intent Gap Alerts & Action Items */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{benchmarkMode === 'solo' ? 'Your Critical Visibility Gaps' : '3-Way Competitive Gaps'}</span>
            </h3>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-bold">
              {highGapClusters.length} Gaps Detected
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {clusterData.map((cluster, idx) => {
              const topRivalScore = Math.max(cluster.competitorAScore, cluster.competitorBScore);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedCluster(cluster)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    cluster.gapLevel === 'High Gap'
                      ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                      : cluster.gapLevel === 'Moderate'
                      ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                      : 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-100 flex items-center gap-1.5">
                      {cluster.cluster}
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {cluster.intent}
                      </span>
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        cluster.gapLevel === 'High Gap'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : cluster.gapLevel === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {benchmarkMode === 'solo'
                        ? `${cluster.userDomainScore}% vs ${cluster.industryAvgScore}% Target`
                        : (cluster.gapLevel === 'Lead' ? 'Leading (+)' : `${cluster.userDomainScore}% vs ${topRivalScore}%`)}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    {benchmarkMode === 'comparative' ? (
                      <span>
                        Rivals: <span className="text-cyan-300">{cluster.competitorAScore}%</span> | <span className="text-amber-300">{cluster.competitorBScore}%</span>
                      </span>
                    ) : (
                      <span>
                        Delta: <strong className={cluster.userDomainScore >= cluster.industryAvgScore ? 'text-emerald-400' : 'text-rose-400'}>
                          {cluster.userDomainScore >= cluster.industryAvgScore ? '+' : ''}{cluster.userDomainScore - cluster.industryAvgScore}%
                        </strong>
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenContentGrader) {
                          onOpenContentGrader(`https://${userDomain}`, cluster.cluster);
                        }
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 text-[10px]"
                    >
                      <span>Grade &amp; Optimize</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
