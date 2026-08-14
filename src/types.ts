export interface DirectoryEntry {
  id: string;
  name: string;
  type: 'WHOIS' | 'SEO Analyzer' | 'Site Stats' | 'Archiver' | 'Directory' | 'Ping Platform';
  urlPattern: string;
  authorityScore: number;
}

export type DirectoryItem = DirectoryEntry;
export type SubmissionHistoryItem = SubmissionRecord;

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
  autoRotateProxies?: boolean;
  autoRotatePatterns?: string[];
  maxRetriesPerProxy?: number;
  proxyCooldownSeconds?: number;
  notifyOnProxyRotation?: boolean;
}

export interface ApiEndpointHealth {
  status: 'operational' | 'degraded' | 'not_configured' | 'error';
  latencyMs: number;
  details: string;
  lastChecked: string;
  quotaUsed?: number;
  quotaTotal?: number;
}

export interface DisabledProxyInfo {
  proxy: string;
  disabledUntil: string;
  reason: string;
  disabledAt?: string;
}

export interface ProxyHealthMetrics {
  successRate: number; // percentage 0 - 100
  totalRequests24h: number;
  successRequests24h: number;
  failedRequests24h: number;
  disabledNodesCount: number;
  disabledNodes: DisabledProxyInfo[];
  activeHealthyNodes: number;
  totalConfiguredNodes: number;
  avgLatencyMs: number;
}

export interface ApiHealthReport {
  timestamp: string;
  googleIndexing: ApiEndpointHealth;
  indexNow: ApiEndpointHealth;
  serpPing: ApiEndpointHealth;
  proxyHealth?: ProxyHealthMetrics;
  overallScore: number;
}

export interface ProxyRotationEvent {
  id: string;
  submissionId: string;
  oldProxy: string;
  newProxy: string;
  triggerPattern: string;
  statusCode?: number;
  reason: string;
  timestamp: string;
}

export interface WorkspaceSnapshot {
  version: string | number;
  exportedAt?: string;
  timestamp?: string;
  workspaceName?: string;
  targetUrls: string[];
  selectedCategory?: string;
  selectedDirectoryIds: string[];
  features: {
    generateBacklinks: boolean;
    checkLiveConfirmation: boolean;
    requestIndexing: boolean;
    runGoogleIndexing: boolean;
    runPingServices: boolean;
  };
  concurrencyLimit: number;
  autonomousConfig?: AutonomousConfig;
  settings?: SystemSettings;
  notes?: string;
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

export interface AuthSession {
  email: string;
  token: string;
  expiresAt: number;
  role: 'admin' | 'user';
  rememberMe: boolean;
  authorizedAt: string;
}

export interface AuthConfig {
  authRequired: boolean;
  adminEmail: string;
  siteAccessKey: string;
  sessionTimeoutHours: number;
}

export type DashboardViewType =
  | 'dashboard'
  | 'bento'
  | 'wizards'
  | 'indexing_engine'
  | 'submissions'
  | 'geo_grader'
  | 'competitor_radar'
  | 'live_operations'
  | 'scheduler'
  | 'cro_wizard'
  | 'reports'
  | 'diagnostics'
  | 'network'
  | 'audits'
  | 'settings';

export type UserRole = 'Owner' | 'Administrator' | 'Standard User' | 'Read-Only User';

export interface UserAccountProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  companyName: string;
  planTier: 'Enterprise Pro' | 'Growth' | 'Starter';
  mfaEnabled: boolean;
  mfaMethod: 'authenticator_app' | 'email_pin' | 'sms';
  activeSessionsCount: number;
  apiTokensCount: number;
  createdAt: string;
}

export interface DeviceSession {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface DeviceLoginHistory {
  id: string;
  timestamp: string;
  ip: string;
  location: string;
  device: string;
  status: 'SUCCESS' | 'MFA_CHALLENGE' | 'FAILED';
  method: string;
}

export interface ExecutiveSummaryReport {
  title: string;
  target: string;
  timestamp: string;
  overallStatus: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL';
  headlineScore: number;
  whatHappened: string;
  wasSuccessful: boolean;
  whatWasDiscovered: string[];
  whatToDoNext: string[];
  businessImpact: {
    opportunities: string[];
    risks: string[];
    recommendedActions: string[];
    priorityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    estimatedRevenueOrRankGain?: string;
  };
}

export interface IndexingCampaignConfig {
  campaignName: string;
  targetUrls: string[];
  engines: {
    googleIndexingApi: boolean;
    indexNow: boolean;
    multiPing: boolean;
    directoryNetworks: boolean;
  };
  concurrencyThreads: number;
  retryStrategy: 'AGGRESSIVE' | 'STANDARD' | 'CONSERVATIVE';
  maxRetries: number;
  proxyRoutingMode: 'AUTO_ROTATE' | 'RESIDENTIAL_ONLY' | 'DIRECT';
  scheduledDripIntervalMinutes?: number;
  notes?: string;
}

export interface SystemDiagnosticItem {
  component: string;
  category: 'API' | 'PROXY' | 'DATABASE' | 'SCHEDULER' | 'AUTH' | 'WORKER';
  status: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';
  latencyMs: number;
  uptimePct: number;
  lastChecked: string;
  details: string;
}

export interface GuidedErrorTroubleshooting {
  id: string;
  timestamp: string;
  errorCode: string;
  category: 'AUTH' | 'API_QUOTA' | 'PROXY_WAF' | 'SUBMISSION_REJECTED' | 'VALIDATION';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  rawTechnicalMessage: string;
  plainEnglishExplanation: string;
  rootCause: string;
  recommendedResolution: string[];
  autoFixActionAvailable: boolean;
  autoFixActionName?: string;
}

export type AppSettings = SystemSettings;

export interface ProxyHealth {
  ipPort: string;
  host: string;
  port: string;
  protocol: string;
  region: string;
  latencyMs: number;
  status: 'Healthy' | 'Moderate' | 'Degraded' | 'Offline';
  diagnosticNote: string;
  targetTested?: string;
}

export interface DiagnosticSummary {
  totalTested: number;
  healthyCount: number;
  moderateCount: number;
  degradedCount: number;
  offlineCount: number;
  averageLatencyMs: number;
  targetTested: string;
}

export interface ActiveSession {
  id: string;
  user_email: string;
  device: string;
  ip_address: string;
  location: string;
  created_at: string;
  last_active_at: string;
  is_current?: number | boolean;
}

export interface LoginHistoryItem {
  id: string;
  user_email: string;
  login_time: string;
  device: string;
  ip_address: string;
  location: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED' | 'MFA_ENABLED' | 'MFA_DISABLED' | string;
  mfa_used: number | boolean;
}

export interface StripeSubscriptionDetails {
  isLive: boolean;
  isConfigured: boolean;
  customerId: string;
  subscriptionId: string;
  planName: string;
  status: string;
  amount: string;
  currency: string;
  interval: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  quotaUsed?: {
    submissionsThisMonth: number;
    limit: string;
    apiThreads: string;
  };
  paymentMethod?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}




