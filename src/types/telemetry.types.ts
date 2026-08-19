export interface CampaignFeatures {
  indexNow: boolean;
  googleIndexing: boolean;
  geoGrade: boolean;
  citationAnalysis: boolean;
}

export interface CampaignBatchRequest {
  campaignName: string;
  targetUrls: string[];
  features: CampaignFeatures;
  concurrencyLimit: number;
  subBatchSize: number;
}

export type SystemPressureState = 'GREEN' | 'YELLOW' | 'RED';
export type BatchStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'PAUSED';
export type CampaignStatus = 'PENDING' | 'VALIDATING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'PAUSED';

export interface CampaignMetrics {
  id: string;
  name: string;
  total_urls: number;
  processed_urls: number;
  indexed_urls: number;
  failed_urls: number;
  avg_health_score: number;
  concurrency_limit?: number;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
}

export interface SubBatchItem {
  id: string;
  campaign_id: string;
  batch_index: number;
  priority_order: number;
  target_count: number;
  processed_count: number;
  success_count: number;
  failure_count: number;
  status: BatchStatus;
  execution_window?: 'IMMEDIATE' | 'OFF_PEAK' | 'NIGHTLY' | 'SCHEDULED';
  started_at: string | null;
  completed_at: string | null;
}

// WebSocket Event Envelopes
export interface BaseWebSocketEnvelope<T, K extends string> {
  event: K;
  timestamp: string;
  data: T;
}

export type ConnectionEvent = BaseWebSocketEnvelope<{
  active_subscribers: number;
}, 'CONNECTED'>;

export type SystemPressureEvent = BaseWebSocketEnvelope<{
  queue_depth: number;
  active_workers: number;
  worker_saturation: number;
  system_pressure_state: SystemPressureState;
  api_limits_depleted: number;
  urls_per_second: number;
  google_api_latency_ms?: number;
  indexnow_api_latency_ms?: number;
}, 'SYSTEM_PRESSURE_UPDATE'>;

export type IndexingProgressEvent = BaseWebSocketEnvelope<{
  campaign_id: string;
  batch_id?: string;
  processed_urls: number;
  indexed_urls: number;
  failed_urls: number;
  current_urls_per_second: number;
  active_batches?: SubBatchItem[];
  health_score?: number;
  url?: string;
}, 'INDEXING_PROGRESS'>;

export type BatchCompletedEvent = BaseWebSocketEnvelope<{
  batch_id: string;
  campaign_id: string;
  batch_index: number;
  total_success: number;
  total_failure: number;
  timestamp?: string;
}, 'BATCH_COMPLETED'>;

export type TelemetryWebSocketMessage = 
  | ConnectionEvent 
  | SystemPressureEvent 
  | IndexingProgressEvent 
  | BatchCompletedEvent;
