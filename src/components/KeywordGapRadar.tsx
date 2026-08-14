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
        <div className="bg-white border-2 border-black p-3 shadow-[3px_3px_0_#000] text-xs font-mono-brutal space-y-1 text-black">
          <p className="font-bold uppercase text-[#ff4d00]">{data.cluster}</p>
          <div className="text-black font-bold">{userDomain}: {data.userDomainScore}% Visibility</div>
          {benchmarkMode === 'comparative' ? (
            <>
              <div className="text-zinc-700">{compA}: {data.competitorAScore}% Visibility</div>
              <div className="text-zinc-700">{compB}: {data.competitorBScore}% Visibility</div>
            </>
          ) : (
            <div className="text-zinc-700">Industry Avg Benchmark: {data.industryAvgScore}% Visibility</div>
          )}
          <div className="text-zinc-500 text-[10px] mt-1 pt-1 border-t border-black">
            Intent Type: <span className="text-black font-bold">{data.intent}</span> | Gap: <span className="text-[#ff4d00] font-bold">{data.gapLevel}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[4px_4px_0_#000] space-y-5 text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-black">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#ff4d00]" />
            <h2 className="font-mono-brutal text-sm font-bold text-black uppercase">
              KEYWORD GAP RADAR (SERP &amp; GEO OVERLAP)
            </h2>
            <span className="text-[10px] uppercase font-mono-brutal px-2 py-0.5 bg-[#ff4d00] text-black border border-black font-bold shadow-[1px_1px_0_#000]">
              COMPETITIVE_INTEL
            </span>
          </div>
          <p className="text-xs text-zinc-700 font-mono-brutal mt-0.5">
            Visualize keyword cluster overlap against top competitors to spot critical AI visibility and ranking gaps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono-brutal text-xs">
          {/* Competitive Benchmarking Mode Toggle */}
          <div className="flex items-center bg-[#f2efeb] p-1 border-2 border-black shadow-[2px_2px_0_#000]">
            <button
              type="button"
              onClick={() => setBenchmarkMode('solo')}
              className={`flex items-center gap-1.5 px-3 py-1 uppercase text-xs font-bold transition-all ${
                benchmarkMode === 'solo'
                  ? 'bg-black text-white shadow-[1px_1px_0_#000]'
                  : 'text-black hover:bg-white'
              }`}
              title="Focus purely on your domain metrics & baseline benchmark gap"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>MY DOMAIN</span>
            </button>
            <button
              type="button"
              onClick={() => setBenchmarkMode('comparative')}
              className={`flex items-center gap-1.5 px-3 py-1 uppercase text-xs font-bold transition-all ${
                benchmarkMode === 'comparative'
                  ? 'bg-[#ff4d00] text-black shadow-[1px_1px_0_#000]'
                  : 'text-black hover:bg-white'
              }`}
              title="Compare side-by-side against Top 3 Direct Competitors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>3-WAY BENCHMARK</span>
            </button>
          </div>

          <button
            onClick={() => setIsCompetitorAnalysisOpen(!isCompetitorAnalysisOpen)}
            className="px-3 py-1.5 bg-[#ff4d00] hover:bg-[#ff5c14] border-2 border-black text-black text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 shadow-[2px_2px_0_#000] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>AI STRATEGY</span>
          </button>

          <button
            onClick={handleRecalculate}
            className="px-3 py-1.5 bg-[#f2efeb] hover:bg-white border-2 border-black text-black text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 shadow-[2px_2px_0_#000] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-black" />
            <span>RECALCULATE</span>
          </button>
        </div>
      </div>

      {/* Domain Configuration Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-brutal">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[10px] uppercase font-bold text-black tracking-wider">YOUR DOMAIN</label>
            <button
              type="button"
              onClick={handleSyncCompetitors}
              className="text-[9px] text-[#ff4d00] font-bold hover:underline cursor-pointer uppercase"
              title="Auto-detect top 2 competitors based on your domain"
            >
              [AUTO-DETECT]
            </button>
          </div>
          <input
            type="text"
            value={userDomain}
            onChange={(e) => handleUserDomainChange(e.target.value)}
            className="w-full bg-[#f2efeb] border-2 border-black px-3 py-1.5 text-xs text-black font-bold focus:outline-none focus:bg-white shadow-[2px_2px_0_#000]"
            placeholder="organic-skincare.com"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-black mb-1 tracking-wider">COMPETITOR A</label>
          <input
            type="text"
            value={compA}
            onChange={(e) => setCompA(e.target.value)}
            className="w-full bg-[#f2efeb] border-2 border-black px-3 py-1.5 text-xs text-black font-bold focus:outline-none focus:bg-white shadow-[2px_2px_0_#000]"
            placeholder="gloworganics.com"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-black mb-1 tracking-wider">COMPETITOR B</label>
          <input
            type="text"
            value={compB}
            onChange={(e) => setCompB(e.target.value)}
            className="w-full bg-[#f2efeb] border-2 border-black px-3 py-1.5 text-xs text-black font-bold focus:outline-none focus:bg-white shadow-[2px_2px_0_#000]"
            placeholder="purebotanicals.com"
          />
        </div>
      </div>

      {/* Mode Indicator & Summary KPIs */}
      <div className="bg-[#f2efeb] border-2 border-black p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-brutal shadow-[2px_2px_0_#000]">
        <div className="flex items-center gap-2">
          <span className="text-zinc-600 uppercase">ACTIVE BENCHMARK VIEW:</span>
          <span className="px-2 py-0.5 bg-black text-white text-[11px] font-bold uppercase">
            {benchmarkMode === 'solo' ? 'MY DOMAIN METRICS' : '3-WAY COMPARATIVE'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div>
            <span className="text-zinc-600 uppercase">AVG VISIBILITY:</span>{' '}
            <strong className="text-black font-bold">{avgUserScore}%</strong>
          </div>
          <div>
            <span className="text-zinc-600 uppercase">{benchmarkMode === 'solo' ? 'BENCHMARK:' : 'TOP RIVAL AVG:'}</span>{' '}
            <strong className="text-black font-bold">{avgCompetitorScore}%</strong>
          </div>
          <div>
            <span className="text-zinc-600 uppercase">GAP DELTA:</span>{' '}
            <strong className={avgUserScore < avgCompetitorScore ? 'text-[#ff4d00]' : 'text-black'}>
              {avgUserScore >= avgCompetitorScore ? '+' : ''}{avgUserScore - avgCompetitorScore}%
            </strong>
          </div>
        </div>
      </div>

      {/* Collapsible AI Competitor & Market Research Panel */}
      {isCompetitorAnalysisOpen && (
        <div className="bg-[#f2efeb] border-2 border-black p-4 sm:p-5 space-y-4 shadow-[3px_3px_0_#000]">
          <div className="flex items-center justify-between pb-3 border-b-2 border-black">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff4d00]" />
              <h3 className="text-xs font-bold text-black uppercase font-mono-brutal">
                AI MARKET RESEARCH &amp; COMPETITOR STRATEGY
              </h3>
              <span className="px-2 py-0.5 bg-black text-white text-[10px] font-mono-brutal font-bold">
                TARGET: {userDomain || 'MYBRAND.COM'}
              </span>
            </div>
            <button
              onClick={() => setIsCompetitorAnalysisOpen(false)}
              className="text-xs text-black font-bold uppercase underline font-mono-brutal cursor-pointer"
            >
              [HIDE_STRATEGY]
            </button>
          </div>

          {/* Top 2 Selected Priority URLs Analysis Table */}
          <div className="bg-white border-2 border-black p-4 space-y-3 shadow-[2px_2px_0_#000]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b-2 border-black gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#ff4d00]" />
                <h4 className="text-xs font-bold text-black font-mono-brutal uppercase">
                  TOP 2 PRIORITY COMPETITOR URLS FOR <span className="text-[#ff4d00]">{userDomain}</span>
                </h4>
              </div>
              <span className="text-[10px] font-mono-brutal text-black bg-[#f2efeb] px-2 py-0.5 border border-black font-bold uppercase">
                NICHE: {competitorAnalysis.nicheLabel}
              </span>
            </div>

            {/* High-Density Clean HTML Table for LLM & SERP Parsing */}
            <div className="overflow-x-auto border-2 border-black">
              <table data-llm-parse="true" data-table-type="priority-urls-comparison" className="w-full text-left border-collapse text-xs font-mono-brutal">
                <thead className="bg-black text-white font-mono-brutal text-[11px] uppercase">
                  <tr className="border-b-2 border-black">
                    <th scope="col" className="p-2.5 border-r border-zinc-700 font-bold">COMPETITOR</th>
                    <th scope="col" className="p-2.5 border-r border-zinc-700 font-bold">EXACT PRIORITY URL</th>
                    <th scope="col" className="p-2.5 border-r border-zinc-700 font-bold">STRATEGIC JUSTIFICATION</th>
                    <th scope="col" className="p-2.5 font-bold">CATEGORY</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black bg-white">
                  <tr className="hover:bg-[#f2efeb] transition-colors">
                    <td className="p-2.5 border-r-2 border-black font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-[#ff4d00] shrink-0" />
                        <span>{compA}</span>
                      </div>
                    </td>
                    <td className="p-2.5 border-r-2 border-black text-xs select-all break-all text-zinc-800">
                      {competitorAnalysis.compAUrl}
                    </td>
                    <td className="p-2.5 border-r-2 border-black text-zinc-800 leading-relaxed font-sans text-xs">
                      {competitorAnalysis.compAJustification}
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-[#ff4d00] text-black font-bold text-[10px] uppercase border border-black">
                        TOP ORGANIC POTENTIAL
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#f2efeb] transition-colors">
                    <td className="p-2.5 border-r-2 border-black font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-[#ff4d00] shrink-0" />
                        <span>{compB}</span>
                      </div>
                    </td>
                    <td className="p-2.5 border-r-2 border-black text-xs select-all break-all text-zinc-800">
                      {competitorAnalysis.compBUrl}
                    </td>
                    <td className="p-2.5 border-r-2 border-black text-zinc-800 leading-relaxed font-sans text-xs">
                      {competitorAnalysis.compBJustification}
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-black text-white font-bold text-[10px] uppercase border border-black">
                        HIGH INTENT VALUE
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-brutal">
            {/* Section 1: Top 3 Direct Competitors */}
            <div className="bg-white border-2 border-black p-3.5 shadow-[2px_2px_0_#000] space-y-2">
              <div className="flex items-center justify-between text-black font-bold text-[11px] uppercase border-b border-black pb-1">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#ff4d00]" />
                  1. DIRECT COMPETITORS
                </span>
                <span className="text-[10px] text-zinc-600 font-bold">SAME SOLUTION</span>
              </div>
              <ul className="space-y-2 text-zinc-800 text-[11px] leading-relaxed font-sans">
                <li className="bg-[#f2efeb] p-2 border border-black">
                  <strong className="font-mono-brutal text-black">Ahrefs / Semrush:</strong> High historical backlink index depth (30B+ pages) and established domain trust.
                </li>
                <li className="bg-[#f2efeb] p-2 border border-black">
                  <strong className="font-mono-brutal text-black">Serpstat / {compA}:</strong> Direct rival in directory submission velocity and automated link indexing.
                </li>
              </ul>
            </div>

            {/* Section 2: Top 2 Indirect Competitors */}
            <div className="bg-white border-2 border-black p-3.5 shadow-[2px_2px_0_#000] space-y-2">
              <div className="flex items-center justify-between text-black font-bold text-[11px] uppercase border-b border-black pb-1">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#ff4d00]" />
                  2. INDIRECT COMPETITORS
                </span>
                <span className="text-[10px] text-zinc-600 font-bold">ALTERNATE</span>
              </div>
              <ul className="space-y-2 text-zinc-800 text-[11px] leading-relaxed font-sans">
                <li className="bg-[#f2efeb] p-2 border border-black">
                  <strong className="font-mono-brutal text-black">Manual PR Growth Agencies:</strong> Manual outreach and white-glove directory submissions.
                </li>
                <li className="bg-[#f2efeb] p-2 border border-black">
                  <strong className="font-mono-brutal text-black">Programmatic SEO Frameworks:</strong> Static generated pages to capture long-tail search traffic.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout: Radar Chart + Gap Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Radar Chart Column */}
        <div className="lg:col-span-7 bg-[#f2efeb] border-2 border-black p-3 h-72 sm:h-80 relative flex items-center justify-center shadow-[3px_3px_0_#000]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={clusterData}>
              <PolarGrid stroke="#000000" strokeWidth={1} />
              <PolarAngleAxis dataKey="cluster" stroke="#000000" fontSize={10} tickLine={false} fontFamily="'Space Mono', monospace" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#000000" fontSize={9} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '5px', fontFamily: "'Space Mono', monospace" }}
                formatter={(value) => <span className="text-black font-bold">{value}</span>}
              />
              <Radar
                name={userDomain}
                dataKey="userDomainScore"
                stroke="#ff4d00"
                fill="#ff4d00"
                fillOpacity={0.5}
                strokeWidth={2.5}
              />
              {benchmarkMode === 'comparative' ? (
                <>
                  <Radar
                    name={compA}
                    dataKey="competitorAScore"
                    stroke="#000000"
                    fill="#000000"
                    fillOpacity={0.2}
                    strokeWidth={1.5}
                  />
                  <Radar
                    name={compB}
                    dataKey="competitorBScore"
                    stroke="#71717a"
                    fill="#71717a"
                    fillOpacity={0.2}
                    strokeWidth={1.5}
                  />
                </>
              ) : (
                <Radar
                  name="Industry Benchmark Target"
                  dataKey="industryAvgScore"
                  stroke="#000000"
                  fill="#000000"
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* High-Intent Gap Alerts & Action Items */}
        <div className="lg:col-span-5 space-y-3 font-mono-brutal">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#ff4d00]" />
              <span>{benchmarkMode === 'solo' ? 'VISIBILITY GAPS' : 'COMPETITIVE GAPS'}</span>
            </h3>
            <span className="text-[10px] text-black bg-[#ff4d00] px-2 py-0.5 font-bold uppercase border border-black">
              {highGapClusters.length} GAPS DETECTED
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {clusterData.map((cluster, idx) => {
              const topRivalScore = Math.max(cluster.competitorAScore, cluster.competitorBScore);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedCluster(cluster)}
                  className={`p-3 border-2 border-black text-xs cursor-pointer transition-all shadow-[2px_2px_0_#000] ${
                    cluster.gapLevel === 'High Gap'
                      ? 'bg-[#ffe8dd] hover:bg-white'
                      : cluster.gapLevel === 'Moderate'
                      ? 'bg-[#fff5eb] hover:bg-white'
                      : 'bg-[#f2efeb] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black flex items-center gap-1.5 uppercase">
                      {cluster.cluster}
                      <span className="text-[9px] px-1.5 py-0.2 bg-black text-white font-bold">
                        {cluster.intent}
                      </span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 uppercase border border-black ${
                        cluster.gapLevel === 'High Gap'
                          ? 'bg-[#ff4d00] text-black'
                          : cluster.gapLevel === 'Moderate'
                          ? 'bg-black text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      {benchmarkMode === 'solo'
                        ? `${cluster.userDomainScore}% vs ${cluster.industryAvgScore}%`
                        : (cluster.gapLevel === 'Lead' ? 'LEADING (+)' : `${cluster.userDomainScore}% vs ${topRivalScore}%`)}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-700">
                    {benchmarkMode === 'comparative' ? (
                      <span>
                        RIVALS: <span className="font-bold text-black">{cluster.competitorAScore}%</span> | <span className="font-bold text-black">{cluster.competitorBScore}%</span>
                      </span>
                    ) : (
                      <span>
                        DELTA: <strong className="text-black">
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
                      className="text-[#ff4d00] hover:text-black font-bold flex items-center gap-1 text-[10px] uppercase underline cursor-pointer"
                    >
                      <span>OPTIMIZE</span>
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
