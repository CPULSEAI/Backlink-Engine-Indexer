import fs from 'fs';
import path from 'path';
import initSqlJs, { Database } from 'sql.js';

const DB_PATH = path.join(process.cwd(), 'backlink_indexer.sqlite');

let db: Database | null = null;
let saveDebounceTimer: NodeJS.Timeout | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    try {
      const filebuffer = fs.readFileSync(DB_PATH);
      if (filebuffer.length === 0) {
        throw new Error('Database file is 0 bytes');
      }
      db = new SQL.Database(filebuffer);
      // Run quick integrity check
      db.exec('PRAGMA integrity_check;');
    } catch (err: any) {
      console.warn('[DB Recovery] Notice: Recovered from legacy or corrupted SQLite file:', err?.message || err);
      try {
        const backupPath = `${DB_PATH}.corrupt_${Date.now()}`;
        fs.renameSync(DB_PATH, backupPath);
        console.log(`[DB] Preserved legacy database snapshot as ${backupPath}`);
      } catch (e) {
        try { fs.unlinkSync(DB_PATH); } catch (e2) {}
      }
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  try {
    // Create tables if not exist
    db.run(`
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        target_url TEXT NOT NULL,
        status TEXT NOT NULL,
        total_directories INTEGER DEFAULT 0,
        completed_directories INTEGER DEFAULT 0,
        confirmed_count INTEGER DEFAULT 0,
        indexed_count INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        submission_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        target_url TEXT NOT NULL,
        directory_name TEXT NOT NULL,
        directory_type TEXT NOT NULL,
        generated_backlink TEXT NOT NULL,
        submission_status TEXT NOT NULL,
        http_status INTEGER DEFAULT 0,
        live_verification TEXT NOT NULL,
        google_indexing TEXT NOT NULL,
        ping_status TEXT NOT NULL,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS password_resets (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        token TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS scheduled_jobs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        target_urls TEXT NOT NULL,
        schedule_type TEXT NOT NULL,
        scheduled_at TEXT NOT NULL,
        interval_minutes INTEGER DEFAULT 60,
        batch_size INTEGER DEFAULT 10,
        status TEXT NOT NULL,
        total_batches INTEGER DEFAULT 1,
        completed_batches INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        last_run_at TEXT,
        next_run_at TEXT,
        config_json TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS active_sessions (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        token TEXT NOT NULL,
        device TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        location TEXT NOT NULL,
        created_at TEXT NOT NULL,
        last_active_at TEXT NOT NULL,
        is_current INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS login_history (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        login_time TEXT NOT NULL,
        device TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL,
        mfa_used INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS traffic_campaigns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        engine_mode TEXT NOT NULL, -- 'DIRECT_TRAFFIC' | 'SERP_CTR' | 'DOMAIN_REDIRECT'
        target_urls TEXT NOT NULL, -- JSON array of strings or newline separated
        daily_volume INTEGER DEFAULT 500,
        completed_sessions INTEGER DEFAULT 0,
        bounce_rate_pct INTEGER DEFAULT 35,
        min_dwell_sec INTEGER DEFAULT 45,
        max_dwell_sec INTEGER DEFAULT 180,
        mobile_ratio_pct INTEGER DEFAULT 60,
        geo_country TEXT DEFAULT 'US',
        geo_state TEXT,
        geo_city TEXT,
        referrer_type TEXT DEFAULT 'ORGANIC', -- 'ORGANIC' | 'SOCIAL' | 'DIRECT' | 'CUSTOM'
        custom_referrers TEXT,
        sitemap_url TEXT,
        ga4_measurement_id TEXT,
        status TEXT NOT NULL, -- 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'DRAFT'
        concurrency_threads INTEGER DEFAULT 3,
        created_at TEXT NOT NULL,
        last_run_at TEXT,
        config_json TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS serp_ctr_jobs (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        keyword TEXT NOT NULL,
        target_url TEXT NOT NULL,
        search_engine TEXT DEFAULT 'google', -- 'google' | 'bing' | 'maps'
        max_serp_depth INTEGER DEFAULT 10,
        anti_pogo_sticking INTEGER DEFAULT 1,
        min_dwell_sec INTEGER DEFAULT 60,
        target_position INTEGER,
        click_executed INTEGER DEFAULT 0,
        status TEXT NOT NULL, -- 'PENDING' | 'SEARCHING' | 'CLICKED' | 'PAGES_SURFED' | 'FAILED'
        geo_city TEXT,
        proxy_node TEXT,
        created_at TEXT NOT NULL,
        completed_at TEXT,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS redirect_routes (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        source_domain TEXT NOT NULL,
        destination_url TEXT NOT NULL,
        redirect_type INTEGER DEFAULT 301, -- 301 or 302
        niche_tags TEXT,
        geo_filter_countries TEXT,
        device_filter TEXT DEFAULT 'ALL', -- 'ALL' | 'MOBILE' | 'DESKTOP'
        total_forwarded_hits INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        last_hit_at TEXT
      );

      -- =========================================================================
      -- BULK URL TARGET MANAGER & HIGH-PERFORMANCE SMART BATCH SCHEMA
      -- Optimized for 100,000+ URL campaigns with Composite Index Partitioning
      -- =========================================================================

      CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        total_urls INTEGER DEFAULT 0,
        processed_urls INTEGER DEFAULT 0,
        indexed_urls INTEGER DEFAULT 0,
        failed_urls INTEGER DEFAULT 0,
        avg_health_score REAL DEFAULT 0.0,
        concurrency_limit INTEGER DEFAULT 10,
        features_json TEXT NOT NULL DEFAULT '{}',
        status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING' | 'VALIDATING' | 'PROCESSING' | 'PAUSED' | 'COMPLETED' | 'FAILED'
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        completed_at TEXT
      );

      CREATE TABLE IF NOT EXISTS batches (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        batch_index INTEGER NOT NULL,
        priority_order INTEGER DEFAULT 100,
        target_count INTEGER NOT NULL DEFAULT 0,
        processed_count INTEGER NOT NULL DEFAULT 0,
        success_count INTEGER NOT NULL DEFAULT 0,
        failure_count INTEGER NOT NULL DEFAULT 0,
        execution_window TEXT NOT NULL DEFAULT 'IMMEDIATE', -- 'IMMEDIATE' | 'OFF_PEAK' | 'NIGHTLY' | 'SCHEDULED'
        scheduled_for TEXT,
        status TEXT NOT NULL DEFAULT 'QUEUED', -- 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'PAUSED' | 'FAILED'
        worker_node_id TEXT,
        started_at TEXT,
        completed_at TEXT,
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS url_targets (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        batch_id TEXT,
        url TEXT NOT NULL,
        url_hash TEXT NOT NULL, -- SHA256/FNV-1a hex for deduplication and O(1) index scans
        http_status INTEGER DEFAULT NULL,
        canonical_url TEXT,
        canonical_match INTEGER DEFAULT 1,
        meta_title TEXT,
        meta_description TEXT,
        schema_types TEXT, -- comma-delimited or JSON array
        health_score INTEGER DEFAULT 0, -- 0 to 100
        validation_state TEXT NOT NULL DEFAULT 'UNCHECKED', -- 'UNCHECKED' | 'VALID' | 'WARNING' | 'CRITICAL_BLOCKER'
        indexing_state TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING' | 'QUEUED' | 'SUBMITTED' | 'INDEXED' | 'FAILED' | 'RETRYING'
        indexnow_status TEXT,
        google_indexing_status TEXT,
        retry_count INTEGER DEFAULT 0,
        next_retry_at TEXT,
        priority_score INTEGER DEFAULT 50, -- 1 to 100 authority weight
        geo_citation_score REAL DEFAULT 0.0,
        entity_gap_count INTEGER DEFAULT 0,
        last_error TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
        FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS system_metrics (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        queue_depth INTEGER NOT NULL DEFAULT 0,
        active_workers INTEGER NOT NULL DEFAULT 0,
        worker_saturation REAL NOT NULL DEFAULT 0.0, -- 0.0 to 1.0 (CPU/Thread saturation)
        system_pressure_state TEXT NOT NULL DEFAULT 'GREEN', -- 'GREEN' | 'YELLOW' | 'RED'
        api_limits_depleted INTEGER DEFAULT 0, -- boolean flag for provider rate limits
        google_api_latency_ms INTEGER DEFAULT 0,
        indexnow_api_latency_ms INTEGER DEFAULT 0,
        urls_per_second REAL DEFAULT 0.0
      );

      -- -------------------------------------------------------------------------
      -- COMPOSITE PERFORMANCE & STATE-POLLING INDEXES
      -- Designed for 100k+ record sets, fast queue pops, deduplication, and aggregation
      -- -------------------------------------------------------------------------
      
      -- O(1) Deduplication and Lookups
      CREATE UNIQUE INDEX IF NOT EXISTS idx_url_targets_campaign_hash 
        ON url_targets (campaign_id, url_hash);

      -- Rapid Queue Polling: Batch + Status + Retry timestamp
      CREATE INDEX IF NOT EXISTS idx_url_targets_batch_state_prio 
        ON url_targets (batch_id, indexing_state, priority_score DESC);

      -- Worker Queue Extraction Filter: Campaign + Status + Next Retry
      CREATE INDEX IF NOT EXISTS idx_url_targets_worker_queue 
        ON url_targets (campaign_id, indexing_state, retry_count, next_retry_at);

      -- Validation Scanner Index: Campaign + Validation State + Health Score
      CREATE INDEX IF NOT EXISTS idx_url_targets_validation_health 
        ON url_targets (campaign_id, validation_state, health_score);

      -- Batch Priority Leapfrog Index: Campaign + Status + Priority Order
      CREATE INDEX IF NOT EXISTS idx_batches_campaign_prio_status 
        ON batches (campaign_id, status, priority_order ASC);

      -- System Metrics Time-Series Query Index
      CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp 
        ON system_metrics (timestamp DESC);

      -- =========================================================================
      -- XML SITEMAP BACKGROUND OBSERVER & NEW CONTENT DETECTION SCHEMA
      -- =========================================================================
      CREATE TABLE IF NOT EXISTS sitemap_monitored_targets (
        id TEXT PRIMARY KEY,
        domain TEXT NOT NULL,
        sitemap_url TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        check_interval_minutes INTEGER DEFAULT 15,
        last_checked_at TEXT,
        last_status TEXT DEFAULT 'PENDING',
        discovered_urls_count INTEGER DEFAULT 0,
        new_urls_pending_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        error_message TEXT
      );

      CREATE TABLE IF NOT EXISTS sitemap_discovered_urls (
        id TEXT PRIMARY KEY,
        target_id TEXT NOT NULL,
        domain TEXT NOT NULL,
        url TEXT NOT NULL,
        discovered_at TEXT NOT NULL,
        is_new INTEGER DEFAULT 1,
        last_indexed_at TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_sitemap_discovered_target 
        ON sitemap_discovered_urls (target_id, url);

      -- =========================================================================
      -- PROOF OF EXECUTION (PoE) CRYPTOGRAPHIC AUDIT LAYER SCHEMA
      -- =========================================================================
      CREATE TABLE IF NOT EXISTS execution_jobs (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        action_type TEXT NOT NULL, -- 'GOOGLE_INDEXING' | 'INDEXNOW' | 'BACKLINK_SUBMISSION' | 'GEO_ANALYSIS' | 'SITEMAP_CRAWL'
        status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING' | 'VERIFIED' | 'FAILED' | 'UNVERIFIED'
        worker_id TEXT NOT NULL DEFAULT 'worker-01',
        created_at TEXT NOT NULL,
        completed_at TEXT
      );

      CREATE TABLE IF NOT EXISTS execution_receipts (
        receipt_id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        action_type TEXT NOT NULL,
        url TEXT NOT NULL,
        verification_status TEXT NOT NULL, -- 'CONFIRMED' | 'UNVERIFIED' | 'FAILED'
        response_code INTEGER DEFAULT 200,
        evidence_hash TEXT NOT NULL, -- SHA-256(request + response + timestamp + worker_id)
        latency_ms INTEGER DEFAULT 0,
        executed_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (job_id) REFERENCES execution_jobs(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS execution_evidence (
        id TEXT PRIMARY KEY,
        receipt_id TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        request_headers TEXT,
        request_payload TEXT,
        response_headers TEXT,
        response_payload TEXT,
        source_of_truth TEXT NOT NULL, -- e.g. 'https://indexing.googleapis.com/v3/urlNotifications:publish'
        created_at TEXT NOT NULL,
        FOREIGN KEY (receipt_id) REFERENCES execution_receipts(receipt_id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS execution_audit_logs (
        event_id TEXT PRIMARY KEY,
        job_id TEXT,
        receipt_id TEXT,
        event_type TEXT NOT NULL, -- 'URL_INGESTION' | 'VALIDATION' | 'INDEXNOW_SUBMIT' | 'GOOGLE_SUBMIT' | 'REPORT_GENERATION'
        details_json TEXT,
        timestamp TEXT NOT NULL,
        verification_status TEXT NOT NULL -- 'CONFIRMED' | 'UNVERIFIED' | 'FAILED'
      );

      CREATE INDEX IF NOT EXISTS idx_poe_receipts_job 
        ON execution_receipts (job_id);

      CREATE INDEX IF NOT EXISTS idx_poe_evidence_receipt 
        ON execution_evidence (receipt_id);

      CREATE INDEX IF NOT EXISTS idx_poe_audit_timestamp 
        ON execution_audit_logs (timestamp DESC);

      -- =========================================================================
      -- CLIENT RUNTIME CRASH & DIAGNOSTICS LOGS SCHEMA
      -- Real-time telemetry captured from Global Error Boundary without mock fallbacks
      -- =========================================================================
      CREATE TABLE IF NOT EXISTS client_crash_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        error_name TEXT NOT NULL,
        message TEXT NOT NULL,
        stack TEXT,
        component_stack TEXT,
        url TEXT NOT NULL,
        user_agent TEXT NOT NULL,
        metadata_json TEXT,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_client_crash_timestamp
        ON client_crash_logs (timestamp DESC);
    `);
  } catch (schemaErr) {
    console.error('[DB Error] Failed to verify / create schema:', schemaErr);
  }

  saveDbImmediate();
  return db;
}

export function saveDbImmediate() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    const tmpPath = `${DB_PATH}.tmp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    fs.writeFileSync(tmpPath, buffer);
    fs.renameSync(tmpPath, DB_PATH);
  } catch (err) {
    console.error('[DB Error] Failed to write database atomically:', err);
  }
}

export function saveDb() {
  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer);
  }
  saveDebounceTimer = setTimeout(() => {
    saveDbImmediate();
  }, 200);
}

// Ensure database flush on process termination
process.on('beforeExit', () => {
  saveDbImmediate();
});

