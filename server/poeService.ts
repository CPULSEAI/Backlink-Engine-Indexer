import crypto from 'crypto';
import { getDb, saveDb } from './db.js';

export interface ExecutionEvidenceData {
  jobId: string;
  url: string;
  actionType: 'GOOGLE_INDEXING' | 'INDEXNOW' | 'BACKLINK_SUBMISSION' | 'GEO_ANALYSIS' | 'SITEMAP_CRAWL';
  workerId?: string;
  endpoint: string;
  requestHeaders?: Record<string, any>;
  requestPayload?: any;
  responseHeaders?: Record<string, any>;
  responsePayload?: any;
  responseCode: number;
  latencyMs?: number;
  sourceOfTruth: string;
}

export interface ExecutionReceiptRecord {
  receiptId: string;
  jobId: string;
  actionType: string;
  url: string;
  verificationStatus: 'CONFIRMED' | 'UNVERIFIED' | 'FAILED';
  responseCode: number;
  evidenceHash: string;
  latencyMs: number;
  executedAt: string;
  createdAt: string;
  evidence?: {
    endpoint: string;
    requestPayload: any;
    responsePayload: any;
    sourceOfTruth: string;
  };
}

export class ProofOfExecutionService {
  /**
   * Generates a tamper-proof SHA-256 evidence hash:
   * SHA256(request + response + timestamp + worker_id + endpoint)
   */
  public static generateEvidenceHash(
    request: any,
    response: any,
    timestamp: string,
    workerId: string,
    endpoint: string
  ): string {
    const rawData = `${JSON.stringify(request)}|${JSON.stringify(response)}|${timestamp}|${workerId}|${endpoint}`;
    return crypto.createHash('sha256').update(rawData).digest('hex');
  }

  /**
   * Records a confirmed execution and issues a cryptographic receipt
   */
  public static async recordExecution(evidence: ExecutionEvidenceData): Promise<ExecutionReceiptRecord> {
    const db = await getDb();
    const now = new Date().toISOString();
    const workerId = evidence.workerId || 'worker_node_01';
    const isSuccess = evidence.responseCode >= 200 && evidence.responseCode < 300;
    const verificationStatus = isSuccess ? 'CONFIRMED' : 'FAILED';

    const receiptId = `REC-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const evidenceId = `EVI-${crypto.randomBytes(6).toString('hex')}`;
    const eventId = `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Generate SHA256 Evidence Hash
    const evidenceHash = this.generateEvidenceHash(
      evidence.requestPayload,
      evidence.responsePayload,
      now,
      workerId,
      evidence.endpoint
    );

    // 1. Insert or update Job
    db.run(
      `INSERT OR REPLACE INTO execution_jobs (id, url, action_type, status, worker_id, created_at, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [evidence.jobId, evidence.url, evidence.actionType, verificationStatus, workerId, now, now]
    );

    // 2. Insert Execution Receipt
    db.run(
      `INSERT INTO execution_receipts (receipt_id, job_id, action_type, url, verification_status, response_code, evidence_hash, latency_ms, executed_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        receiptId,
        evidence.jobId,
        evidence.actionType,
        evidence.url,
        verificationStatus,
        evidence.responseCode,
        evidenceHash,
        evidence.latencyMs || 0,
        now,
        now,
      ]
    );

    // 3. Insert Raw Immutable Evidence
    db.run(
      `INSERT INTO execution_evidence (id, receipt_id, endpoint, request_headers, request_payload, response_headers, response_payload, source_of_truth, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        evidenceId,
        receiptId,
        evidence.endpoint,
        JSON.stringify(evidence.requestHeaders || {}),
        JSON.stringify(evidence.requestPayload || {}),
        JSON.stringify(evidence.responseHeaders || {}),
        JSON.stringify(evidence.responsePayload || {}),
        evidence.sourceOfTruth,
        now,
      ]
    );

    // 4. Insert Audit Log
    db.run(
      `INSERT INTO execution_audit_logs (event_id, job_id, receipt_id, event_type, details_json, timestamp, verification_status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        eventId,
        evidence.jobId,
        receiptId,
        evidence.actionType,
        JSON.stringify({
          url: evidence.url,
          responseCode: evidence.responseCode,
          evidenceHash,
          sourceOfTruth: evidence.sourceOfTruth,
        }),
        now,
        verificationStatus,
      ]
    );

    saveDb();

    return {
      receiptId,
      jobId: evidence.jobId,
      actionType: evidence.actionType,
      url: evidence.url,
      verificationStatus,
      responseCode: evidence.responseCode,
      evidenceHash,
      latencyMs: evidence.latencyMs || 0,
      executedAt: now,
      createdAt: now,
    };
  }

  /**
   * Fetch recent receipts
   */
  public static async getReceipts(limit: number = 50): Promise<ExecutionReceiptRecord[]> {
    const db = await getDb();
    const res = db.exec(`
      SELECT r.receipt_id, r.job_id, r.action_type, r.url, r.verification_status, r.response_code, r.evidence_hash, r.latency_ms, r.executed_at, r.created_at,
             e.endpoint, e.request_payload, e.response_payload, e.source_of_truth
      FROM execution_receipts r
      LEFT JOIN execution_evidence e ON r.receipt_id = e.receipt_id
      ORDER BY r.created_at DESC
      LIMIT ${Number(limit) || 50}
    `);

    if (!res || !res[0]) return [];
    const cols = res[0].columns;

    return res[0].values.map((row: any[]) => {
      const obj: any = {};
      cols.forEach((col, idx) => {
        obj[col] = row[idx];
      });

      return {
        receiptId: obj.receipt_id,
        jobId: obj.job_id,
        actionType: obj.action_type,
        url: obj.url,
        verificationStatus: obj.verification_status,
        responseCode: obj.response_code,
        evidenceHash: obj.evidence_hash,
        latencyMs: obj.latency_ms,
        executedAt: obj.executed_at,
        createdAt: obj.created_at,
        evidence: {
          endpoint: obj.endpoint,
          requestPayload: obj.request_payload ? JSON.parse(obj.request_payload) : null,
          responsePayload: obj.response_payload ? JSON.parse(obj.response_payload) : null,
          sourceOfTruth: obj.source_of_truth,
        },
      };
    });
  }

  /**
   * Get stats for Proof of Execution Dashboard
   */
  public static async getStats() {
    const db = await getDb();
    const totalJobsRes = db.exec(`SELECT COUNT(*) FROM execution_jobs`);
    const totalJobs = Number(totalJobsRes?.[0]?.values?.[0]?.[0] || 0);

    const verifiedRes = db.exec(`SELECT COUNT(*) FROM execution_receipts WHERE verification_status = 'CONFIRMED'`);
    const verified = Number(verifiedRes?.[0]?.values?.[0]?.[0] || 0);

    const failedRes = db.exec(`SELECT COUNT(*) FROM execution_receipts WHERE verification_status = 'FAILED'`);
    const failed = Number(failedRes?.[0]?.values?.[0]?.[0] || 0);

    const unverifiedRes = db.exec(`SELECT COUNT(*) FROM execution_jobs WHERE status = 'UNVERIFIED'`);
    const unverified = Number(unverifiedRes?.[0]?.values?.[0]?.[0] || 0);

    const evidenceCoverage = totalJobs > 0 ? Number(((verified / totalJobs) * 100).toFixed(1)) : 100;

    return {
      jobsExecuted: totalJobs,
      verified,
      failed,
      pendingVerification: unverified,
      evidenceCoverage: `${evidenceCoverage}%`,
    };
  }
}
