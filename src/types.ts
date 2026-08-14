export interface DirectoryEntry {
  id: string;
  name: string;
  type: 'WHOIS' | 'SEO Analyzer' | 'Site Stats' | 'Archiver' | 'Directory' | 'Ping Platform';
  urlPattern: string;
  authorityScore: number;
}

export interface LogItem {
  id: string;
  targetUrl: string;
  directoryName: string;
  directoryType: string;
  generatedBacklink: string;
  submissionStatus: string;
  httpStatus: number;
  liveVerification: string;
  googleIndexing: string;
  pingStatus: string;
  notes?: string;
  createdAt: string;
}

export interface SubmissionRecord {
  id: string;
  created_at: string;
  target_url: string;
  status: 'Processing' | 'Completed' | 'Cancelled' | 'Failed';
  total_directories: number;
  completed_directories: number;
  confirmed_count: number;
  indexed_count: number;
}

export interface SystemSettings {
  proxyList: string;
  googleServiceAccountJson: string;
  defaultConcurrency: number;
  testProxiesBeforeJob?: boolean;
}

export interface AutonomousConfig {
  enabled: boolean;
  targetGoalNumber: number;
  targetGoalMetric: 'tasks' | 'confirmed';
  autoCycleUrls: boolean;
}

export interface AnalyticsDayItem {
  date: string;
  fullDate: string;
  success: number;
  failure: number;
  total: number;
  rate: number;
}

export interface AnalyticsData {
  timeRangeDays: number;
  summary: {
    totalLogs: number;
    successCount: number;
    failureCount: number;
    successRate: number;
  };
  dailyTrend: AnalyticsDayItem[];
  ratioBreakdown: {
    name: string;
    value: number;
    color: string;
  }[];
}

export interface CroGapItem {
  id: string;
  category: 'TRUST' | 'FRICTION' | 'CLARITY';
  title: string;
  description: string;
  severity: 'CRITICAL' | 'MODERATE' | 'MINOR';
  recommendation: string;
  visualIndicator?: string;
}

export interface ComparisonMatrixItem {
  element: string;
  yourWebsite: string;
  competitor: string;
  fixRecommendation: string;
  status: 'WEAKER' | 'PARITY' | 'BETTER';
}

export interface RevenueProjection {
  currentTraffic: number;
  currentConversionRate: number;
  targetConversionRate: number;
  averageOrderValue: number;
  currentMonthlyRevenue: number;
  projectedMonthlyRevenue: number;
  monthlyLift: number;
  annualLift: number;
  estimatedOrdersGain: number;
}

export interface CroTimelinePhase {
  phase: string;
  timeFrame: string;
  title: string;
  focus: string;
  expectedOutcome: string;
  tasks: string[];
}

export interface CroAiFixes {
  headlines: string[];
  ctaRecommendations: Array<{
    text: string;
    subtext?: string;
    color: string;
    placement: string;
    codeSnippet: string;
  }>;
  codeFixes: string;
  valuePropRewrite: string;
  guaranteeCopy: string;
}

export interface CroAuditResult {
  id: string;
  timestamp: string;
  userUrl: string;
  userDomain: string;
  competitorUrl: string;
  competitorDomain: string;
  businessType: string;
  websiteTitle?: string;
  loadSpeedMs: number;
  mobileFriendlyScore: number;
  overallScore: number;
  trustGaps: CroGapItem[];
  frictionGaps: CroGapItem[];
  clarityGaps: CroGapItem[];
  comparisonMatrix: ComparisonMatrixItem[];
  revenueProjection: RevenueProjection;
  timeline: CroTimelinePhase[];
  masterPrompt: string;
  aiGeneratedFixes: CroAiFixes;
}



