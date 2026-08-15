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
  | 'bulk_seo'
  | 'schema_generator'
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

// ==========================================
// CLARITY OVERLOAD CRO AUDIT ENGINE TYPES
// ==========================================

export type ClarityOverloadRiskLevel = 'LOW OVERLOAD' | 'MEDIUM OVERLOAD' | 'HIGH OVERLOAD' | 'SEVERE OVERLOAD';

export type FeatureDecision = 'KEEP' | 'SIMPLIFY' | 'DE-EMPHASIZE' | 'REMOVE';

export interface FiveSecondTestResult {
  whatCompanyDoes: string;
  whoItIsFor: string;
  primaryProblemSolved: string;
  actionVisitorsShouldTake: string;
  score: number; // 1 - 10
  unclearExplanation?: string;
}

export interface ClarityOverloadMetrics {
  featuresAboveTheFold: number;
  competingMessagesCount: number;
  userActionsPresented: number;
  distinctValuePropsCount: number;
  ctaVariationsCount: number;
  riskLevel: ClarityOverloadRiskLevel;
  riskSummary: string;
}

export interface MessageHierarchyAnalysis {
  primaryMessage: string;
  secondaryMessages: string[];
  distractingMessages: string[];
  distractionSections: Array<{
    sectionName: string;
    whyItDistracts: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
}

export interface FeatureBloatItem {
  id: string;
  featureName: string;
  description: string;
  essentialToConversion: boolean;
  niceToHave: boolean;
  causesConfusion: boolean;
  shouldMoveLower: boolean;
  recommendation: FeatureDecision;
  rationale: string;
  suggestedOutcomeBenefit: string;
}

export interface CompetitorClarityInsight {
  competitorName: string;
  whatTheyCommunicateBetter: string;
  whatTheyExplainFaster: string;
  whatTheySimplifyMoreEffectively: string;
  hiddenDifferentiator: string;
}

export interface UvpTestResult {
  score: number; // 1 - 10
  whyThisProductOverAlternatives: string;
  currentUvp: string;
  missingUvp: string;
  recommendedUvp: string;
}

export interface CtaClarityTestResult {
  visibilityRating: 'EXCELLENT' | 'GOOD' | 'POOR' | 'CRITICAL';
  relevanceRating: 'HIGH' | 'MEDIUM' | 'LOW';
  quantityScore: number;
  consistencyScore: number;
  causesDecisionParalysis: boolean;
  primaryCtaText: string;
  suggestedCtaText: string;
  paralysisExplanation?: string;
}

export interface CognitiveLoadBreakdown {
  informationDensity: number; // 1 - 10
  complexity: number; // 1 - 10
  mentalEffortRequired: number; // 1 - 10
  visualOverload: number; // 1 - 10
  clarity: number; // 1 - 10 (inverted for load)
  overallClarityOverloadScore: number; // 0 - 100
  scoreLabel: 'Excellent (0-20)' | 'Good (21-40)' | 'Moderate Risk (41-60)' | 'High Risk (61-80)' | 'Severe Conversion Risk (81-100)';
}

export interface CroRecommendationItem {
  id: string;
  category: 'QUICK_WIN' | 'MEDIUM_IMPROVEMENT' | 'MAJOR_OPPORTUNITY';
  timeframe: '< 1 day' | '1-7 days' | 'High Impact Project';
  title: string;
  action: string;
  impactOnClarity: 'HIGH' | 'VERY HIGH' | 'MEDIUM';
  impactOnConversions: 'HIGH' | 'VERY HIGH' | 'MEDIUM';
  easeOfImplementation: 'VERY EASY' | 'EASY' | 'MODERATE' | 'COMPLEX';
}

export interface ClarityOverloadAuditResult {
  id: string;
  timestamp: string;
  targetUrl: string;
  targetDomain: string;
  pageTitle?: string;
  executiveSummary: string;
  clarityRisk: ClarityOverloadRiskLevel;
  top5Problems: string[];
  top5Opportunities: string[];
  singleMostValuableOutcome: string;
  step1_FiveSecondTest: FiveSecondTestResult;
  step2_ClarityOverload: ClarityOverloadMetrics;
  step3_MessageHierarchy: MessageHierarchyAnalysis;
  step4_FeatureBloat: FeatureBloatItem[];
  step5_CompetitorComparison: CompetitorClarityInsight;
  step6_UvpTest: UvpTestResult;
  step7_CtaClarity: CtaClarityTestResult;
  step8_CognitiveLoad: CognitiveLoadBreakdown;
  step9_Recommendations: CroRecommendationItem[];
  prioritizedActionPlan: Array<{
    step: number;
    phase: string;
    focus: string;
    expectedClarityLift: string;
  }>;
  aiMasterPrompt: string;
  homepageHeroRewrite: {
    heroHeadline: string;
    subheadline: string;
    singlePrimaryCta: string;
    guaranteeMicroCopy: string;
    heroVisualFocus: string;
  };
}

// --- BULK SEO URL VALIDATOR TYPES ---
export interface BulkHeadingItem {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text: string;
}

export interface BulkValidationIssue {
  severity: 'error' | 'warning' | 'notice';
  type: 'canonical' | 'meta_description' | 'headings' | 'status' | 'speed';
  message: string;
}

export interface BulkUrlValidationResult {
  url: string;
  normalizedUrl: string;
  statusCode: number;
  statusText: string;
  responseTimeMs: number;
  pageSizeKb: number;
  title: string;
  titleLength: number;
  canonicalUrl: string | null;
  canonicalStatus: 'valid_match' | 'self_referencing' | 'mismatch' | 'missing' | 'relative' | 'duplicate';
  canonicalDetails: string;
  metaDescription: string | null;
  metaDescriptionLength: number;
  metaDescriptionStatus: 'optimal' | 'missing' | 'too_short' | 'too_long' | 'duplicate';
  metaDescriptionDetails: string;
  h1Count: number;
  h1List: string[];
  h2Count: number;
  h2List: string[];
  headingHierarchy: BulkHeadingItem[];
  hierarchyStatus: 'valid' | 'missing_h1' | 'multiple_h1' | 'empty_h1' | 'missing_h2' | 'skipped_levels';
  hierarchyDetails: string;
  overallScore: number; // 0 - 100
  issues: BulkValidationIssue[];
}

export interface BulkValidationSummary {
  totalUrls: number;
  completedUrls: number;
  avgResponseTimeMs: number;
  healthScore: number;
  canonicalIssuesCount: number;
  missingMetaCount: number;
  headingHierarchyIssuesCount: number;
  httpErrorsCount: number;
  passedCount: number;
}

// --- INTELLIGENT RETRY POLICY TYPES ---
export interface RetryPolicyConfig {
  enabled: boolean;
  maxRetries: number;
  initialBackoffMs: number;
  maxBackoffMs: number;
  transientCodes: number[];
}

export interface RetryTelemetryEvent {
  id: string;
  submissionId: string;
  targetUrl: string;
  directoryName: string;
  attemptNumber: number;
  maxRetries: number;
  triggerStatus: number;
  triggerReason: string;
  backoffDelayMs: number;
  nextAttemptAt: string;
  timestamp: string;
}

// --- VISUAL SCHEMA GENERATOR TYPES ---
export type SchemaType = 'FAQ' | 'Article' | 'Organization';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ArticleSchemaData {
  headline: string;
  articleType: 'Article' | 'BlogPosting' | 'NewsArticle' | 'TechArticle';
  description: string;
  authorName: string;
  authorType: 'Person' | 'Organization';
  authorUrl?: string;
  publisherName: string;
  publisherLogoUrl: string;
  datePublished: string;
  dateModified: string;
  imageUrl: string;
  mainEntityUrl: string;
  keywords?: string;
}

export interface OrganizationSchemaData {
  name: string;
  legalName?: string;
  url: string;
  logoUrl: string;
  description: string;
  foundingDate?: string;
  email?: string;
  telephone?: string;
  contactType?: string;
  socialUrls: string[];
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}






