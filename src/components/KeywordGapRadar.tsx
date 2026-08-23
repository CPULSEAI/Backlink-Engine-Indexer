import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
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
  Sliders,
  Layers,
  Search,
  PieChart,
  ArrowUpRight,
  Filter,
  Send
} from 'lucide-react';

interface ClusterData {
  cluster: string;
  userDomainScore: number;
  competitorAScore: number;
  competitorBScore: number;
  industryAvgScore: number;
  intent: 'Commercial' | 'Informational' | 'Transactional' | 'GEO Focus';
  gapLevel: 'High Gap' | 'Moderate' | 'Lead';
  monthlyVolume: number;
  trafficOpportunity: number;
  keywordCount: number;
}

export interface OrganicKeywordGapItem {
  id: string;
  keyword: string;
  cluster: string;
  intent: 'Commercial' | 'Informational' | 'Transactional' | 'GEO Focus';
  searchVolume: number;
  keywordDifficulty: number; // 0 - 100%
  userRank: number | null; // null = Not ranking in top 100
  compARank: number;
  compBRank: number;
  estimatedTrafficGain: number;
  actionPriority: 'HIGH' | 'MEDIUM' | 'OPPORTUNITY';
}

interface KeywordGapRadarProps {
  initialUserDomain?: string;
  initialCompA?: string;
  initialCompB?: string;
  onOpenContentGrader?: (url?: string, keyword?: string) => void;
  onLaunchOutreachStrategy?: (userDomain: string, compA: string, compB: string, niche?: string) => void;
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

export function deriveCompetitorsAndPriorityUrls(
  domainInput: string,
  customCompA?: string,
  customCompB?: string
): CompetitorAnalysisResult {
  const cleanUser = (domainInput || '').trim().toLowerCase().replace(/^(https?:\/\/)+/i, '').replace(/\/+$/, '');
  const cleanCompA = (customCompA || '').trim().toLowerCase().replace(/^(https?:\/\/)+/i, '').replace(/\/+$/, '');
  const cleanCompB = (customCompB || '').trim().toLowerCase().replace(/^(https?:\/\/)+/i, '').replace(/\/+$/, '');

  let baseNiche = 'AI Resume & Career Automation SaaS';
  let defaultA = 'jobscan.co';
  let defaultB = 'tealhq.com';
  let defaultAUrl = 'https://jobscan.co/resume-scanner';
  let defaultBUrl = 'https://tealhq.com/tools/ai-resume-builder';
  let defaultAJust =
    'Leading organic traffic magnet URL capturing high-volume queries for ATS resume optimization, keyword match analysis, and job score benchmarks.';
  let defaultBJust =
    'High-converting commercial landing page dominating organic search rankings for AI resume builders, job application trackers, and career trajectory tools.';

  if (
    cleanUser.includes('career') ||
    cleanUser.includes('resume') ||
    cleanUser.includes('job') ||
    cleanUser.includes('talent') ||
    cleanUser.includes('hire') ||
    cleanUser.includes('pulse') ||
    cleanUser.includes('interview') ||
    cleanUser.includes('work')
  ) {
    baseNiche = 'AI Resume & Career Automation SaaS';
    defaultA = 'jobscan.co';
    defaultB = 'tealhq.com';
    defaultAUrl = 'https://jobscan.co/resume-scanner';
    defaultBUrl = 'https://tealhq.com/tools/ai-resume-builder';
    defaultAJust =
      'Leading organic traffic magnet URL capturing high-volume queries for ATS resume optimization, keyword match analysis, and job score benchmarks.';
    defaultBJust =
      'High-converting commercial landing page dominating organic search rankings for AI resume builders, job application trackers, and career trajectory tools.';
  } else if (
    cleanUser.includes('skincare') ||
    cleanUser.includes('organic') ||
    cleanUser.includes('beauty') ||
    cleanUser.includes('skin') ||
    cleanUser.includes('cosmetic') ||
    cleanUser.includes('glow')
  ) {
    baseNiche = 'Organic Skincare & E-Commerce Store';
    defaultA = 'gloworganics.com';
    defaultB = 'purebotanicals.com';
    defaultAUrl = 'https://gloworganics.com/collections/best-sellers';
    defaultBUrl = 'https://purebotanicals.com/products/anti-aging-serum';
    defaultAJust =
      'High-volume organic search landing page capturing 45% of non-branded commercial intent queries for natural skincare with prime revenue potential.';
    defaultBJust =
      'Top revenue-generating hero product URL with high transaction conversion rate and dominant AI search entity citations.';
  } else if (
    cleanUser.includes('seo') ||
    cleanUser.includes('rank') ||
    cleanUser.includes('index') ||
    cleanUser.includes('serp') ||
    cleanUser.includes('backlink') ||
    cleanUser.includes('keyword') ||
    cleanUser.includes('autosubmit')
  ) {
    baseNiche = 'SEO & Web Indexing Automation';
    defaultA = 'serpflow.io';
    defaultB = 'indexerpro.com';
    defaultAUrl = 'https://serpflow.io/features/auto-indexing';
    defaultBUrl = 'https://indexerpro.com/pricing';
    defaultAJust =
      'Primary direct competitor URL driving high-volume organic search traffic for automated directory submission pipelines.';
    defaultBJust =
      'High-converting commercial intent landing page targeting enterprise backlink indexing queries with high customer lifetime value.';
  } else if (
    cleanUser.includes('crypto') ||
    cleanUser.includes('pay') ||
    cleanUser.includes('fin') ||
    cleanUser.includes('bank') ||
    cleanUser.includes('money') ||
    cleanUser.includes('wealth')
  ) {
    baseNiche = 'FinTech & Payment Infrastructure';
    defaultA = 'finflow.io';
    defaultB = 'wealthpulse.io';
    defaultAUrl = 'https://finflow.io/products/payment-gateway';
    defaultBUrl = 'https://wealthpulse.io/cashflow-engine';
    defaultAJust =
      'Leading commercial gateway URL capturing massive organic traffic for developer API payment integrations and cross-border settlement.';
    defaultBJust =
      'High-converting B2B treasury and cash flow management URL with dominant entity trust.';
  } else if (
    cleanUser.includes('fit') ||
    cleanUser.includes('gym') ||
    cleanUser.includes('health') ||
    cleanUser.includes('workout') ||
    cleanUser.includes('nutri')
  ) {
    baseNiche = 'Fitness & Health Nutrition';
    defaultA = 'fitpulse.com';
    defaultB = 'peaknutrition.io';
    defaultAUrl = 'https://fitpulse.com/programs/hiit-workout';
    defaultBUrl = 'https://peaknutrition.io/supplements/protein';
    defaultAJust =
      'Top organic search destination URL driving over 120k monthly visits for transactional fitness program signups.';
    defaultBJust =
      'Highest revenue-producing e-commerce URL commanding strong brand trust and top position for high-volume commercial intent queries.';
  } else if (
    cleanUser.includes('api') ||
    cleanUser.includes('dev') ||
    cleanUser.includes('code') ||
    cleanUser.includes('cloud') ||
    cleanUser.includes('test')
  ) {
    baseNiche = 'Developer Tools & API Infrastructure';
    defaultA = 'postman.com';
    defaultB = 'apiflow.dev';
    defaultAUrl = 'https://postman.com/api-platform/api-testing';
    defaultBUrl = 'https://apiflow.dev/features/mock-servers';
    defaultAJust =
      'Authoritative industry standard URL capturing developer search queries for automated API testing and schema validation.';
    defaultBJust =
      'Fast-growing developer tools page capturing commercial intent for schema testing and mock endpoints.';
  } else {
    const name = cleanUser.split('.')[0] || 'market';
    const prefix = name.length > 2 ? name : 'industry';
    baseNiche = `${prefix.charAt(0).toUpperCase() + prefix.slice(1)} Platform & Solutions`;
    defaultA = `${prefix}flow.io`;
    defaultB = `${prefix}pro.com`;
    defaultAUrl = `https://${prefix}flow.io/solutions/enterprise-platform`;
    defaultBUrl = `https://${prefix}pro.com/pricing-plans`;
    defaultAJust = `High-volume organic search landing page for ${cleanUser || 'target domain'} competitors, capturing top commercial intent.`;
    defaultBJust = `Top converting transaction URL commanding maximum brand value and strong search traffic potential.`;
  }

  // Determine final Comp A & Comp B domains
  const finalCompA = cleanCompA || defaultA;
  const finalCompB = cleanCompB || defaultB;

  // Determine matching Priority URLs & Justifications for finalCompA and finalCompB
  let compAUrl = defaultAUrl;
  let compAJustification = defaultAJust;
  if (cleanCompA && cleanCompA !== defaultA) {
    const rootName = cleanUser.split('.')[0] || 'platform';
    compAUrl = `https://${cleanCompA}/solutions/${rootName}-alternative`;
    compAJustification = `Primary organic competitor URL for ${cleanCompA}, driving targeted search traffic and commercial conversions in the ${baseNiche} sector.`;
  }

  let compBUrl = defaultBUrl;
  let compBJustification = defaultBJust;
  if (cleanCompB && cleanCompB !== defaultB) {
    compBUrl = `https://${cleanCompB}/pricing-plans`;
    compBJustification = `Top revenue-generating conversion and pricing URL for ${cleanCompB}, commanding strong domain trust and organic ranking equity.`;
  }

  return {
    compA: finalCompA,
    compAUrl,
    compAJustification,
    compB: finalCompB,
    compBUrl,
    compBJustification,
    nicheLabel: baseNiche,
  };
}

export const KeywordGapRadar: React.FC<KeywordGapRadarProps> = ({
  initialUserDomain = 'careerpulseai.net',
  initialCompA,
  initialCompB,
  onOpenContentGrader,
  onLaunchOutreachStrategy,
}) => {
  const initialDerived = deriveCompetitorsAndPriorityUrls(initialUserDomain);
  const [userDomain, setUserDomain] = useState<string>(initialUserDomain);
  const [compA, setCompA] = useState<string>(initialCompA || initialDerived.compA);
  const [compB, setCompB] = useState<string>(initialCompB || initialDerived.compB);
  const [selectedCluster, setSelectedCluster] = useState<ClusterData | null>(null);
  const [isCompetitorAnalysisOpen, setIsCompetitorAnalysisOpen] = useState<boolean>(true);
  const [benchmarkMode, setBenchmarkMode] = useState<'comparative' | 'solo'>('comparative');
  const [viewLayer, setViewLayer] = useState<'gap_overlap' | 'scatter_map' | 'radar'>('gap_overlap');
  const [keywordSearchQuery, setKeywordSearchQuery] = useState<string>('');
  const [intentFilter, setIntentFilter] = useState<string>('ALL');

  const cleanUserDomain = userDomain.trim().replace(/^(https?:\/\/)+/i, '').replace(/\/+$/, '') || 'careerpulseai.net';

  // Compute competitor analysis dynamically using userDomain, compA, and compB so they ALWAYS match!
  const competitorAnalysis = useMemo(() => {
    return deriveCompetitorsAndPriorityUrls(userDomain, compA, compB);
  }, [userDomain, compA, compB]);

  // Automatically update Competitor A and Competitor B defaults when userDomain changes
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

  const handleTransferToOutreach = () => {
    if (onLaunchOutreachStrategy) {
      onLaunchOutreachStrategy(cleanUserDomain, compA, compB, competitorAnalysis.nicheLabel);
    } else {
      toast.success(`Prepared Outreach Campaign for ${userDomain} vs ${compA} & ${compB}!`);
    }
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
      monthlyVolume: 38500,
      trafficOpportunity: 14200,
      keywordCount: 142,
    },
    {
      cluster: 'Directory Indexing',
      userDomainScore: 85,
      competitorAScore: 70,
      competitorBScore: 65,
      industryAvgScore: 60,
      intent: 'Transactional',
      gapLevel: 'Lead',
      monthlyVolume: 22000,
      trafficOpportunity: 3400,
      keywordCount: 88,
    },
    {
      cluster: 'Technical Crawlability',
      userDomainScore: 68,
      competitorAScore: 92,
      competitorBScore: 80,
      industryAvgScore: 64,
      intent: 'Informational',
      gapLevel: 'High Gap',
      monthlyVolume: 19400,
      trafficOpportunity: 8600,
      keywordCount: 64,
    },
    {
      cluster: 'Commercial Prompts',
      userDomainScore: 50,
      competitorAScore: 85,
      competitorBScore: 90,
      industryAvgScore: 58,
      intent: 'Commercial',
      gapLevel: 'High Gap',
      monthlyVolume: 49000,
      trafficOpportunity: 21500,
      keywordCount: 210,
    },
    {
      cluster: 'Schema & Entities',
      userDomainScore: 60,
      competitorAScore: 82,
      competitorBScore: 78,
      industryAvgScore: 52,
      intent: 'GEO Focus',
      gapLevel: 'Moderate',
      monthlyVolume: 16800,
      trafficOpportunity: 6200,
      keywordCount: 52,
    },
    {
      cluster: 'Backlink Velocity',
      userDomainScore: 90,
      competitorAScore: 65,
      competitorBScore: 72,
      industryAvgScore: 62,
      intent: 'Transactional',
      gapLevel: 'Lead',
      monthlyVolume: 28000,
      trafficOpportunity: 4100,
      keywordCount: 115,
    },
  ]);

  const handleRecalculate = () => {
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

        const vol = 12000 + (Math.abs(hash + idx * 37) % 38000);
        const opp = gapLevel === 'High Gap' ? Math.round(vol * 0.42) : gapLevel === 'Moderate' ? Math.round(vol * 0.22) : Math.round(vol * 0.08);

        return {
          ...item,
          userDomainScore: var1,
          competitorAScore: var2,
          competitorBScore: var3,
          industryAvgScore: avg,
          gapLevel,
          monthlyVolume: vol,
          trafficOpportunity: opp,
        };
      })
    );
    toast.success('Recalculated organic keyword overlap matrix & traffic opportunities!');
  };

  // Generate granular individual organic keyword opportunities based on the detected niche and target domain
  const organicKeywords: OrganicKeywordGapItem[] = useMemo(() => {
    const root = cleanUserDomain.split('.')[0] || 'brand';
    const nicheLower = competitorAnalysis.nicheLabel.toLowerCase();

    if (nicheLower.includes('career') || nicheLower.includes('resume') || nicheLower.includes('job')) {
      return [
        {
          id: 'kw-1',
          keyword: `best ai resume builder for tech jobs`,
          cluster: 'Commercial Prompts',
          intent: 'Commercial',
          searchVolume: 18500,
          keywordDifficulty: 42,
          userRank: 16,
          compARank: 2,
          compBRank: 4,
          estimatedTrafficGain: 5600,
          actionPriority: 'HIGH',
        },
        {
          id: 'kw-2',
          keyword: `ats resume keyword match optimizer`,
          cluster: 'Directory Indexing',
          intent: 'Transactional',
          searchVolume: 12200,
          keywordDifficulty: 35,
          userRank: null,
          compARank: 1,
          compBRank: 3,
          estimatedTrafficGain: 4800,
          actionPriority: 'HIGH',
        },
        {
          id: 'kw-3',
          keyword: `${root} vs jobscan comparison review`,
          cluster: 'AI Search & GEO',
          intent: 'GEO Focus',
          searchVolume: 9400,
          keywordDifficulty: 28,
          userRank: 8,
          compARank: 2,
          compBRank: 5,
          estimatedTrafficGain: 3100,
          actionPriority: 'OPPORTUNITY',
        },
        {
          id: 'kw-4',
          keyword: `how to pass greenhouse ats resume scanner`,
          cluster: 'Technical Crawlability',
          intent: 'Informational',
          searchVolume: 14100,
          keywordDifficulty: 38,
          userRank: 22,
          compARank: 3,
          compBRank: 6,
          estimatedTrafficGain: 4200,
          actionPriority: 'MEDIUM',
        },
        {
          id: 'kw-5',
          keyword: `ai career trajectory forecast tool`,
          cluster: 'Commercial Prompts',
          intent: 'Commercial',
          searchVolume: 7800,
          keywordDifficulty: 29,
          userRank: null,
          compARank: 4,
          compBRank: 2,
          estimatedTrafficGain: 2900,
          actionPriority: 'HIGH',
        },
        {
          id: 'kw-6',
          keyword: `structured schema for job seeker portfolio`,
          cluster: 'Schema & Entities',
          intent: 'GEO Focus',
          searchVolume: 4600,
          keywordDifficulty: 22,
          userRank: 12,
          compARank: 5,
          compBRank: 7,
          estimatedTrafficGain: 1400,
          actionPriority: 'MEDIUM',
        },
        {
          id: 'kw-7',
          keyword: `high authority career coach backlink directories`,
          cluster: 'Backlink Velocity',
          intent: 'Transactional',
          searchVolume: 6700,
          keywordDifficulty: 31,
          userRank: 5,
          compARank: 9,
          compBRank: 10,
          estimatedTrafficGain: 1950,
          actionPriority: 'OPPORTUNITY',
        },
        {
          id: 'kw-8',
          keyword: `llm entity citations for tech career coaches`,
          cluster: 'AI Search & GEO',
          intent: 'GEO Focus',
          searchVolume: 8900,
          keywordDifficulty: 34,
          userRank: null,
          compARank: 2,
          compBRank: 3,
          estimatedTrafficGain: 3600,
          actionPriority: 'HIGH',
        },
      ];
    }

    if (nicheLower.includes('seo') || nicheLower.includes('index')) {
      return [
        {
          id: 'kw-1',
          keyword: `automated google indexing api submitter`,
          cluster: 'Commercial Prompts',
          intent: 'Commercial',
          searchVolume: 16200,
          keywordDifficulty: 40,
          userRank: 14,
          compARank: 1,
          compBRank: 3,
          estimatedTrafficGain: 5100,
          actionPriority: 'HIGH',
        },
        {
          id: 'kw-2',
          keyword: `bulk backlink validator high da directories`,
          cluster: 'Directory Indexing',
          intent: 'Transactional',
          searchVolume: 11400,
          keywordDifficulty: 33,
          userRank: 6,
          compARank: 2,
          compBRank: 5,
          estimatedTrafficGain: 3800,
          actionPriority: 'OPPORTUNITY',
        },
        {
          id: 'kw-3',
          keyword: `${root} vs serpflow indexing speed benchmark`,
          cluster: 'AI Search & GEO',
          intent: 'GEO Focus',
          searchVolume: 8100,
          keywordDifficulty: 26,
          userRank: null,
          compARank: 1,
          compBRank: 4,
          estimatedTrafficGain: 3400,
          actionPriority: 'HIGH',
        },
        {
          id: 'kw-4',
          keyword: `how to index new backlinks in 24 hours`,
          cluster: 'Technical Crawlability',
          intent: 'Informational',
          searchVolume: 13900,
          keywordDifficulty: 36,
          userRank: 19,
          compARank: 3,
          compBRank: 6,
          estimatedTrafficGain: 4100,
          actionPriority: 'MEDIUM',
        },
        {
          id: 'kw-5',
          keyword: `geo citation network for local enterprise seo`,
          cluster: 'Commercial Prompts',
          intent: 'Commercial',
          searchVolume: 9200,
          keywordDifficulty: 38,
          userRank: 9,
          compARank: 2,
          compBRank: 1,
          estimatedTrafficGain: 3600,
          actionPriority: 'HIGH',
        },
        {
          id: 'kw-6',
          keyword: `json ld schema generator for saas landing pages`,
          cluster: 'Schema & Entities',
          intent: 'GEO Focus',
          searchVolume: 6500,
          keywordDifficulty: 24,
          userRank: 8,
          compARank: 4,
          compBRank: 7,
          estimatedTrafficGain: 1900,
          actionPriority: 'MEDIUM',
        },
        {
          id: 'kw-7',
          keyword: `dofollow directory submission list 2026`,
          cluster: 'Backlink Velocity',
          intent: 'Transactional',
          searchVolume: 14800,
          keywordDifficulty: 44,
          userRank: 3,
          compARank: 8,
          compBRank: 9,
          estimatedTrafficGain: 4600,
          actionPriority: 'OPPORTUNITY',
        },
        {
          id: 'kw-8',
          keyword: `ai search citations chatgpt perplexity seo`,
          cluster: 'AI Search & GEO',
          intent: 'GEO Focus',
          searchVolume: 11000,
          keywordDifficulty: 32,
          userRank: null,
          compARank: 2,
          compBRank: 4,
          estimatedTrafficGain: 4200,
          actionPriority: 'HIGH',
        },
      ];
    }

    if (nicheLower.includes('skincare') || nicheLower.includes('beauty')) {
      return [
        {
          id: 'kw-1',
          keyword: `best natural organic skincare routine`,
          cluster: 'Commercial Prompts',
          intent: 'Commercial',
          searchVolume: 24500,
          keywordDifficulty: 48,
          userRank: 18,
          compARank: 2,
          compBRank: 4,
          estimatedTrafficGain: 7200,
          actionPriority: 'HIGH',
        },
        {
          id: 'kw-2',
          keyword: `organic beauty brand certification directory`,
          cluster: 'Directory Indexing',
          intent: 'Transactional',
          searchVolume: 8200,
          keywordDifficulty: 24,
          userRank: 6,
          compARank: 8,
          compBRank: 12,
          estimatedTrafficGain: 1850,
          actionPriority: 'OPPORTUNITY',
        },
        {
          id: 'kw-3',
          keyword: `anti aging serum with clean botanicals`,
          cluster: 'AI Search & GEO',
          intent: 'GEO Focus',
          searchVolume: 22400,
          keywordDifficulty: 44,
          userRank: null,
          compARank: 1,
          compBRank: 3,
          estimatedTrafficGain: 7800,
          actionPriority: 'HIGH',
        },
        {
          id: 'kw-4',
          keyword: `how to verify cruelty free skincare ingredients`,
          cluster: 'Technical Crawlability',
          intent: 'Informational',
          searchVolume: 6100,
          keywordDifficulty: 32,
          userRank: 24,
          compARank: 3,
          compBRank: 7,
          estimatedTrafficGain: 2100,
          actionPriority: 'MEDIUM',
        },
        {
          id: 'kw-5',
          keyword: `pure botanicals vs ${root} product comparison`,
          cluster: 'Commercial Prompts',
          intent: 'Commercial',
          searchVolume: 11900,
          keywordDifficulty: 36,
          userRank: 11,
          compARank: 2,
          compBRank: 1,
          estimatedTrafficGain: 3900,
          actionPriority: 'HIGH',
        },
        {
          id: 'kw-6',
          keyword: `structured product schema for e commerce skincare`,
          cluster: 'Schema & Entities',
          intent: 'GEO Focus',
          searchVolume: 5400,
          keywordDifficulty: 28,
          userRank: 14,
          compARank: 4,
          compBRank: 5,
          estimatedTrafficGain: 1600,
          actionPriority: 'MEDIUM',
        },
        {
          id: 'kw-7',
          keyword: `high authority beauty blog guest post opportunities`,
          cluster: 'Backlink Velocity',
          intent: 'Transactional',
          searchVolume: 9600,
          keywordDifficulty: 41,
          userRank: 4,
          compARank: 9,
          compBRank: 11,
          estimatedTrafficGain: 2800,
          actionPriority: 'OPPORTUNITY',
        },
        {
          id: 'kw-8',
          keyword: `ai entity citations for dermatologist recommended serums`,
          cluster: 'AI Search & GEO',
          intent: 'GEO Focus',
          searchVolume: 12100,
          keywordDifficulty: 35,
          userRank: null,
          compARank: 3,
          compBRank: 2,
          estimatedTrafficGain: 5100,
          actionPriority: 'HIGH',
        },
      ];
    }

    // Default domain keyword template
    return [
      {
        id: 'kw-1',
        keyword: `best ${root} solutions for enterprise`,
        cluster: 'Commercial Prompts',
        intent: 'Commercial',
        searchVolume: 15400,
        keywordDifficulty: 39,
        userRank: 17,
        compARank: 2,
        compBRank: 4,
        estimatedTrafficGain: 4800,
        actionPriority: 'HIGH',
      },
      {
        id: 'kw-2',
        keyword: `${root} certified partner directory`,
        cluster: 'Directory Indexing',
        intent: 'Transactional',
        searchVolume: 8900,
        keywordDifficulty: 28,
        userRank: 6,
        compARank: 8,
        compBRank: 12,
        estimatedTrafficGain: 2200,
        actionPriority: 'OPPORTUNITY',
      },
      {
        id: 'kw-3',
        keyword: `${root} vs ${compA} feature comparison`,
        cluster: 'AI Search & GEO',
        intent: 'GEO Focus',
        searchVolume: 19800,
        keywordDifficulty: 42,
        userRank: null,
        compARank: 1,
        compBRank: 3,
        estimatedTrafficGain: 6900,
        actionPriority: 'HIGH',
      },
      {
        id: 'kw-4',
        keyword: `how to integrate ${root} api endpoints`,
        cluster: 'Technical Crawlability',
        intent: 'Informational',
        searchVolume: 7400,
        keywordDifficulty: 31,
        userRank: 21,
        compARank: 3,
        compBRank: 7,
        estimatedTrafficGain: 2400,
        actionPriority: 'MEDIUM',
      },
      {
        id: 'kw-5',
        keyword: `top rated ${root} pricing plans and roi`,
        cluster: 'Commercial Prompts',
        intent: 'Commercial',
        searchVolume: 16500,
        keywordDifficulty: 46,
        userRank: 28,
        compARank: 2,
        compBRank: 1,
        estimatedTrafficGain: 5800,
        actionPriority: 'HIGH',
      },
      {
        id: 'kw-6',
        keyword: `structured software schema for ${root}`,
        cluster: 'Schema & Entities',
        intent: 'GEO Focus',
        searchVolume: 5100,
        keywordDifficulty: 25,
        userRank: 11,
        compARank: 4,
        compBRank: 5,
        estimatedTrafficGain: 1550,
        actionPriority: 'MEDIUM',
      },
      {
        id: 'kw-7',
        keyword: `high authority resource backlink sources for ${root}`,
        cluster: 'Backlink Velocity',
        intent: 'Transactional',
        searchVolume: 9200,
        keywordDifficulty: 38,
        userRank: 5,
        compARank: 9,
        compBRank: 11,
        estimatedTrafficGain: 2700,
        actionPriority: 'OPPORTUNITY',
      },
      {
        id: 'kw-8',
        keyword: `ai entity citations for ${root} platform`,
        cluster: 'AI Search & GEO',
        intent: 'GEO Focus',
        searchVolume: 11800,
        keywordDifficulty: 34,
        userRank: null,
        compARank: 3,
        compBRank: 2,
        estimatedTrafficGain: 4900,
        actionPriority: 'HIGH',
      },
    ];
  }, [cleanUserDomain, competitorAnalysis.nicheLabel, compA, compB]);

  const filteredKeywords = useMemo(() => {
    return organicKeywords.filter((item) => {
      const matchesSearch = item.keyword.toLowerCase().includes(keywordSearchQuery.toLowerCase()) ||
        item.cluster.toLowerCase().includes(keywordSearchQuery.toLowerCase());
      const matchesIntent = intentFilter === 'ALL' || item.intent === intentFilter;
      return matchesSearch && matchesIntent;
    });
  }, [organicKeywords, keywordSearchQuery, intentFilter]);

  const totalTrafficOpportunity = useMemo(() => {
    return clusterData.reduce((acc, curr) => acc + curr.trafficOpportunity, 0);
  }, [clusterData]);

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

  const CustomRadarTooltip = ({ active, payload }: any) => {
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
            Traffic Opportunity: <strong className="text-emerald-600">+{data.trafficOpportunity.toLocaleString()} visits/mo</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomComposedTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0_#000] text-xs font-mono-brutal space-y-1.5 min-w-[220px] text-black">
          <div className="font-black uppercase text-[#ff4d00] border-b border-black pb-1">
            {label}
          </div>
          {payload.map((entry: any, index: number) => {
            const isTraffic = entry.name.includes('Traffic');
            return (
              <div key={index} className="flex items-center justify-between gap-3 text-[11px]">
                <span style={{ color: entry.color }} className="font-bold">
                  {entry.name}:
                </span>
                <span className="font-extrabold text-black">
                  {entry.value} {isTraffic ? 'visits/mo' : '%'}
                </span>
              </div>
            );
          })}
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
          {/* View Layer Selector */}
          <div className="flex items-center bg-[#f2efeb] p-1 border-2 border-black shadow-[2px_2px_0_#000]">
            <button
              type="button"
              onClick={() => setViewLayer('gap_overlap')}
              className={`flex items-center gap-1.5 px-3 py-1 uppercase text-xs font-bold transition-all ${
                viewLayer === 'gap_overlap'
                  ? 'bg-[#ff4d00] text-black shadow-[1px_1px_0_#000]'
                  : 'text-black hover:bg-white'
              }`}
              title="Recharts Organic Keyword Overlap & Traffic Opportunity Matrix"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>GAP MATRIX</span>
            </button>
            <button
              type="button"
              onClick={() => setViewLayer('scatter_map')}
              className={`flex items-center gap-1.5 px-3 py-1 uppercase text-xs font-bold transition-all ${
                viewLayer === 'scatter_map'
                  ? 'bg-black text-white shadow-[1px_1px_0_#000]'
                  : 'text-black hover:bg-white'
              }`}
              title="Keyword Difficulty vs Search Volume Opportunity Scatter"
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>OPPORTUNITY SCATTER</span>
            </button>
            <button
              type="button"
              onClick={() => setViewLayer('radar')}
              className={`flex items-center gap-1.5 px-3 py-1 uppercase text-xs font-bold transition-all ${
                viewLayer === 'radar'
                  ? 'bg-black text-white shadow-[1px_1px_0_#000]'
                  : 'text-black hover:bg-white'
              }`}
              title="6-Axis SERP & GEO Cluster Radar"
            >
              <Target className="w-3.5 h-3.5" />
              <span>RADAR POLYGON</span>
            </button>
          </div>

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
              <span>MY DOMAIN</span>
            </button>
            <button
              type="button"
              onClick={() => setBenchmarkMode('comparative')}
              className={`flex items-center gap-1.5 px-3 py-1 uppercase text-xs font-bold transition-all ${
                benchmarkMode === 'comparative'
                  ? 'bg-black text-white shadow-[1px_1px_0_#000]'
                  : 'text-black hover:bg-white'
              }`}
              title="Compare side-by-side against Top 3 Direct Competitors"
            >
              <span>3-WAY BENCHMARK</span>
            </button>
          </div>

          <button
            onClick={handleTransferToOutreach}
            className="px-3 py-1.5 bg-[#ff4d00] hover:bg-black text-black hover:text-white border-2 border-black text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 shadow-[2px_2px_0_#000] cursor-pointer"
            title="Transfer discovered competitors to Outreach Email & Link Strategist Engine"
          >
            <Send className="w-3.5 h-3.5" />
            <span>OUTREACH ENGINE</span>
          </button>

          <button
            onClick={() => setIsCompetitorAnalysisOpen(!isCompetitorAnalysisOpen)}
            className="px-3 py-1.5 bg-black text-white hover:bg-zinc-800 border-2 border-black text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 shadow-[2px_2px_0_#ff4d00] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff4d00]" />
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
      <div className="bg-[#f2efeb] border-2 border-black p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-brutal shadow-[2px_2px_0_#000]">
        <div className="flex items-center gap-2">
          <span className="text-zinc-600 uppercase">ACTIVE LAYER:</span>
          <span className="px-2 py-0.5 bg-[#ff4d00] text-black text-[11px] font-black uppercase border border-black">
            {viewLayer === 'gap_overlap'
              ? 'RECHARTS ORGANIC OVERLAP & TRAFFIC GAP'
              : viewLayer === 'scatter_map'
              ? 'KD% VS SEARCH VOLUME SCATTER'
              : 'SERP & GEO RADAR POLYGON'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div>
            <span className="text-zinc-600 uppercase">EST. TRAFFIC GAP:</span>{' '}
            <strong className="text-emerald-700 font-extrabold">+{totalTrafficOpportunity.toLocaleString()} visits/mo</strong>
          </div>
          <div>
            <span className="text-zinc-600 uppercase">YOUR VISIBILITY:</span>{' '}
            <strong className="text-black font-bold">{avgUserScore}%</strong>
          </div>
          <div>
            <span className="text-zinc-600 uppercase">RIVAL AVG:</span>{' '}
            <strong className="text-black font-bold">{avgCompetitorScore}%</strong>
          </div>
          <div>
            <span className="text-zinc-600 uppercase">NET DELTA:</span>{' '}
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
                        <ExternalLink className="w-3.5 h-3.5 text-[#ff4d00]" />
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
                        <ExternalLink className="w-3.5 h-3.5 text-[#ff4d00]" />
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

            {/* Seamless Transition to Outreach Execution Suite Callout */}
            <div className="bg-[#fff5eb] border-2 border-black p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[2px_2px_0_#000]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff4d00]" />
                  <span className="font-bold text-black text-xs uppercase font-mono-brutal">
                    READY TO OUTRANK {compA} &amp; {compB}?
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#ff4d00] text-black font-bold border border-black uppercase">
                    SEAMLESS PIPELINE
                  </span>
                </div>
                <p className="text-[11px] text-zinc-700 font-mono-brutal">
                  Transfer these priority competitors into the AI Link Strategist to extract linkable assets, search operators (Google Dorks), and personalized outreach pitches.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTransferToOutreach}
                className="px-4 py-2 bg-black hover:bg-[#ff4d00] text-white hover:text-black font-mono-brutal text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0_#ff4d00] hover:shadow-[2px_2px_0_#000] transition-all cursor-pointer inline-flex items-center justify-center gap-2 shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-[#ff4d00]" />
                <span>LAUNCH OUTREACH PIPELINE &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 1: Recharts Organic Overlap & Traffic Opportunity Matrix */}
      {viewLayer === 'gap_overlap' && (
        <div className="space-y-4">
          <div className="bg-[#f2efeb] border-2 border-black p-4 rounded-xl shadow-[3px_3px_0_#000]">
            <div className="flex items-center justify-between pb-2 border-b border-black mb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#ff4d00]" />
                <h3 className="text-xs font-black uppercase text-black font-mono-brutal">
                  ORGANIC KEYWORD OVERLAP &amp; TRAFFIC POTENTIAL ({userDomain} vs {compA} &amp; {compB})
                </h3>
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase">
                BARS: VISIBILITY % | LINE: EST. TRAFFIC GAIN (VISITS/MO)
              </span>
            </div>

            <div className="h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={clusterData} margin={{ top: 15, right: 30, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" opacity={0.6} />
                  <XAxis
                    dataKey="cluster"
                    stroke="#000000"
                    fontSize={10}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    fontFamily="'Space Mono', monospace"
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#000000"
                    fontSize={10}
                    unit="%"
                    domain={[0, 100]}
                    tickLine={false}
                    fontFamily="'Space Mono', monospace"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#10b981"
                    fontSize={10}
                    tickLine={false}
                    unit=" visits"
                    fontFamily="'Space Mono', monospace"
                  />
                  <Tooltip content={<CustomComposedTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontFamily: "'Space Mono', monospace" }}
                    formatter={(value) => <span className="text-black font-bold">{value}</span>}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="userDomainScore"
                    name={`${userDomain} (Your Domain)`}
                    fill="#ff4d00"
                    radius={[3, 3, 0, 0]}
                  />
                  {benchmarkMode === 'comparative' ? (
                    <>
                      <Bar
                        yAxisId="left"
                        dataKey="competitorAScore"
                        name={`${compA} (Competitor A)`}
                        fill="#18181b"
                        radius={[3, 3, 0, 0]}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="competitorBScore"
                        name={`${compB} (Competitor B)`}
                        fill="#71717a"
                        radius={[3, 3, 0, 0]}
                      />
                    </>
                  ) : (
                    <Bar
                      yAxisId="left"
                      dataKey="industryAvgScore"
                      name="Industry Benchmark"
                      fill="#71717a"
                      radius={[3, 3, 0, 0]}
                    />
                  )}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="trafficOpportunity"
                    name="Potential Monthly Traffic Opportunity"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5, stroke: '#000', strokeWidth: 1.5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 2: KD% vs Search Volume Scatter Map */}
      {viewLayer === 'scatter_map' && (
        <div className="space-y-4">
          <div className="bg-[#f2efeb] border-2 border-black p-4 rounded-xl shadow-[3px_3px_0_#000]">
            <div className="flex items-center justify-between pb-2 border-b border-black mb-3">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#ff4d00]" />
                <h3 className="text-xs font-black uppercase text-black font-mono-brutal">
                  KEYWORD DIFFICULTY (KD%) VS. SEARCH VOLUME OPPORTUNITY DISTRIBUTION
                </h3>
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase">
                X: KD (0-100%) | Y: MONTHLY VOLUME | BUBBLE: TRAFFIC GAIN
              </span>
            </div>

            <div className="h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" opacity={0.6} />
                  <XAxis
                    type="number"
                    dataKey="keywordDifficulty"
                    name="Keyword Difficulty"
                    unit="%"
                    domain={[10, 80]}
                    stroke="#000000"
                    fontSize={10}
                    fontFamily="'Space Mono', monospace"
                  />
                  <YAxis
                    type="number"
                    dataKey="searchVolume"
                    name="Search Volume"
                    unit=" /mo"
                    stroke="#000000"
                    fontSize={10}
                    fontFamily="'Space Mono', monospace"
                  />
                  <ZAxis type="number" dataKey="estimatedTrafficGain" range={[100, 600]} name="Est. Traffic Gain" />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as OrganicKeywordGapItem;
                        return (
                          <div className="bg-white border-2 border-black p-3 shadow-[3px_3px_0_#000] text-xs font-mono-brutal space-y-1 text-black">
                            <p className="font-black uppercase text-[#ff4d00]">{data.keyword}</p>
                            <div className="text-zinc-700">Cluster: <strong className="text-black">{data.cluster}</strong></div>
                            <div className="text-zinc-700">Search Volume: <strong className="text-black">{data.searchVolume.toLocaleString()}/mo</strong></div>
                            <div className="text-zinc-700">Keyword Difficulty: <strong className="text-black">{data.keywordDifficulty}%</strong></div>
                            <div className="text-emerald-700 font-bold">Est. Traffic Gain: +{data.estimatedTrafficGain.toLocaleString()} visits/mo</div>
                            <div className="text-[10px] text-zinc-500 pt-1 border-t border-black">
                              Your Rank: {data.userRank ? `#${data.userRank}` : 'Unranked (>100)'} vs Rival Rank #{data.compARank}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="High Opportunity Keywords" data={organicKeywords}>
                    {organicKeywords.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.actionPriority === 'HIGH' ? '#ff4d00' : entry.actionPriority === 'MEDIUM' ? '#18181b' : '#10b981'}
                        stroke="#000000"
                        strokeWidth={1.5}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 3: Classic 6-Axis SERP & GEO Polygon Radar */}
      {viewLayer === 'radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Radar Chart Column */}
          <div className="lg:col-span-7 bg-[#f2efeb] border-2 border-black p-3 h-72 sm:h-80 relative flex items-center justify-center shadow-[3px_3px_0_#000]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={clusterData}>
                <PolarGrid stroke="#000000" strokeWidth={1} />
                <PolarAngleAxis dataKey="cluster" stroke="#000000" fontSize={10} tickLine={false} fontFamily="'Space Mono', monospace" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#000000" fontSize={9} />
                <Tooltip content={<CustomRadarTooltip />} />
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
      )}

      {/* Actionable Organic Keyword Opportunity Drilldown Table */}
      <div className="bg-white border-2 border-black p-4 space-y-3 shadow-[3px_3px_0_#000]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#ff4d00]" />
            <h3 className="text-xs font-black uppercase text-black font-mono-brutal">
              ORGANIC KEYWORD OPPORTUNITY DRILLDOWN &amp; ACTION MATRIX
            </h3>
            <span className="text-[10px] font-bold bg-[#ff4d00] text-black px-2 py-0.5 border border-black uppercase">
              {filteredKeywords.length} KEYWORDS
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={keywordSearchQuery}
              onChange={(e) => setKeywordSearchQuery(e.target.value)}
              placeholder="Search keyword or cluster..."
              className="bg-[#f2efeb] border border-black px-2.5 py-1 text-xs text-black font-bold focus:outline-none focus:bg-white"
            />

            <select
              value={intentFilter}
              onChange={(e) => setIntentFilter(e.target.value)}
              className="bg-[#f2efeb] border border-black px-2 py-1 text-xs text-black font-bold focus:outline-none uppercase"
            >
              <option value="ALL">ALL INTENTS</option>
              <option value="Commercial">COMMERCIAL</option>
              <option value="GEO Focus">GEO FOCUS</option>
              <option value="Transactional">TRANSACTIONAL</option>
              <option value="Informational">INFORMATIONAL</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border-2 border-black">
          <table className="w-full text-left border-collapse text-xs font-mono-brutal">
            <thead className="bg-black text-white font-mono-brutal text-[11px] uppercase">
              <tr className="border-b-2 border-black">
                <th scope="col" className="p-2.5 border-r border-zinc-700 font-bold">ORGANIC KEYWORD</th>
                <th scope="col" className="p-2.5 border-r border-zinc-700 font-bold">CLUSTER</th>
                <th scope="col" className="p-2.5 border-r border-zinc-700 font-bold text-right">SEARCH VOL</th>
                <th scope="col" className="p-2.5 border-r border-zinc-700 font-bold text-center">KD%</th>
                <th scope="col" className="p-2.5 border-r border-zinc-700 font-bold text-center">YOUR RANK</th>
                <th scope="col" className="p-2.5 border-r border-zinc-700 font-bold text-center">RIVAL RANKS</th>
                <th scope="col" className="p-2.5 border-r border-zinc-700 font-bold text-right">TRAFFIC GAIN</th>
                <th scope="col" className="p-2.5 font-bold text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black bg-white">
              {filteredKeywords.map((item) => (
                <tr key={item.id} className="hover:bg-[#f2efeb] transition-colors">
                  <td className="p-2.5 border-r-2 border-black font-bold text-zinc-900 select-all">
                    {item.keyword}
                  </td>
                  <td className="p-2.5 border-r-2 border-black text-zinc-700 whitespace-nowrap">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#f2efeb] border border-black rounded">
                      {item.cluster}
                    </span>
                  </td>
                  <td className="p-2.5 border-r-2 border-black text-right font-bold text-zinc-900">
                    {item.searchVolume.toLocaleString()}
                  </td>
                  <td className="p-2.5 border-r-2 border-black text-center font-bold">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 border border-black rounded ${
                        item.keywordDifficulty > 45 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {item.keywordDifficulty}%
                    </span>
                  </td>
                  <td className="p-2.5 border-r-2 border-black text-center font-bold">
                    {item.userRank ? (
                      <span className="text-zinc-800">#{item.userRank}</span>
                    ) : (
                      <span className="text-rose-600 font-extrabold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-300">
                        NOT RANKING
                      </span>
                    )}
                  </td>
                  <td className="p-2.5 border-r-2 border-black text-center font-bold text-zinc-800 whitespace-nowrap">
                    #{item.compARank} <span className="text-zinc-400">|</span> #{item.compBRank}
                  </td>
                  <td className="p-2.5 border-r-2 border-black text-right font-extrabold text-emerald-700">
                    +{item.estimatedTrafficGain.toLocaleString()} /mo
                  </td>
                  <td className="p-2.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (onOpenContentGrader) {
                          onOpenContentGrader(`https://${userDomain}`, item.keyword);
                        } else {
                          toast.success(`Targeting opportunity: ${item.keyword}`);
                        }
                      }}
                      className="px-2.5 py-1 bg-[#ff4d00] hover:bg-black text-black hover:text-white font-bold uppercase text-[10px] border border-black rounded shadow-[1px_1px_0_#000] cursor-pointer transition-all inline-flex items-center gap-1"
                    >
                      <span>OPTIMIZE</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
