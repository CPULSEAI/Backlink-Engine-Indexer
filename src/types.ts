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



