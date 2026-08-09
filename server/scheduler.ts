import { getDb, saveDb } from './db.js';
import { jobManager, TaskJobConfig } from './queue.js';
import { deductUserCredits } from './stripe.js';

export interface ScheduledJobRecord {
  id: string;
  name: string;
  target_urls: string[];
  schedule_type: 'ONCE' | 'INTERVAL' | 'DAILY';
  scheduled_at: string; // ISO string or HH:mm time
  interval_minutes: number;
  batch_size: number;
  status: 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  total_batches: number;
  completed_batches: number;
  created_at: string;
  last_run_at: string | null;
  next_run_at: string;
  config: {
    features: {
      generateBacklinks: boolean;
      checkLiveConfirmation: boolean;
      requestIndexing: boolean;
      runGoogleIndexing: boolean;
      runPingServices: boolean;
    };
    concurrencyLimit: number;
    selectedDirectoryIds?: string[];
  };
}

let schedulerTimer: NodeJS.Timeout | null = null;

export async function initSchedulerLoop() {
  if (schedulerTimer) return;
  
  // Run scheduler tick every 10 seconds
  schedulerTimer = setInterval(async () => {
    try {
      await processScheduledJobsTick();
    } catch (err) {
      console.error('Error in SmartBatchScheduler loop:', err);
    }
  }, 10000);

  console.log('[SmartBatchScheduler] Engine initialized and actively polling...');
}

export async function getScheduledJobs(): Promise<ScheduledJobRecord[]> {
  const db = await getDb();
  const stmt = db.exec(`SELECT * FROM scheduled_jobs ORDER BY created_at DESC`);
  if (stmt.length === 0) return [];

  const columns = stmt[0].columns;
  return stmt[0].values.map((row) => {
    const obj: any = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });

    let target_urls: string[] = [];
    let config = {
      features: {
        generateBacklinks: true,
        checkLiveConfirmation: true,
        requestIndexing: true,
        runGoogleIndexing: true,
        runPingServices: true,
      },
      concurrencyLimit: 3,
    };

    try {
      target_urls = JSON.parse(obj.target_urls || '[]');
    } catch (e) {}

    try {
      config = JSON.parse(obj.config_json || '{}');
    } catch (e) {}

    return {
      id: obj.id,
      name: obj.name,
      target_urls,
      schedule_type: obj.schedule_type,
      scheduled_at: obj.scheduled_at,
      interval_minutes: Number(obj.interval_minutes) || 60,
      batch_size: Number(obj.batch_size) || 10,
      status: obj.status,
      total_batches: Number(obj.total_batches) || 1,
      completed_batches: Number(obj.completed_batches) || 0,
      created_at: obj.created_at,
      last_run_at: obj.last_run_at || null,
      next_run_at: obj.next_run_at,
      config,
    };
  });
}

export async function createScheduledJob(params: {
  name: string;
  target_urls: string[];
  schedule_type: 'ONCE' | 'INTERVAL' | 'DAILY';
  scheduled_at: string;
  interval_minutes?: number;
  batch_size?: number;
  config?: any;
}): Promise<ScheduledJobRecord> {
  const db = await getDb();
  const id = `sched_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date();

  const batchSize = Math.max(1, params.batch_size || 10);
  const totalBatches = Math.ceil(params.target_urls.length / batchSize);
  const intervalMinutes = Math.max(5, params.interval_minutes || 60);

  let nextRunAt = params.scheduled_at ? new Date(params.scheduled_at) : new Date();

  // If scheduled_at is in the past, or empty, set to now
  if (isNaN(nextRunAt.getTime()) || nextRunAt.getTime() < now.getTime()) {
    nextRunAt = new Date(now.getTime() + 10000); // 10s from now
  }

  const record: ScheduledJobRecord = {
    id,
    name: params.name || `Batch Job (${params.target_urls.length} URLs)`,
    target_urls: params.target_urls,
    schedule_type: params.schedule_type,
    scheduled_at: nextRunAt.toISOString(),
    interval_minutes: intervalMinutes,
    batch_size: batchSize,
    status: 'SCHEDULED',
    total_batches: totalBatches,
    completed_batches: 0,
    created_at: now.toISOString(),
    last_run_at: null,
    next_run_at: nextRunAt.toISOString(),
    config: params.config || {
      features: {
        generateBacklinks: true,
        checkLiveConfirmation: true,
        requestIndexing: true,
        runGoogleIndexing: true,
        runPingServices: true,
      },
      concurrencyLimit: 3,
    },
  };

  db.run(
    `INSERT INTO scheduled_jobs (
      id, name, target_urls, schedule_type, scheduled_at, interval_minutes, batch_size,
      status, total_batches, completed_batches, created_at, last_run_at, next_run_at, config_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      record.id,
      record.name,
      JSON.stringify(record.target_urls),
      record.schedule_type,
      record.scheduled_at,
      record.interval_minutes,
      record.batch_size,
      record.status,
      record.total_batches,
      record.completed_batches,
      record.created_at,
      record.last_run_at,
      record.next_run_at,
      JSON.stringify(record.config),
    ]
  );
  saveDb();

  jobManager.broadcast('scheduled_job_created', record);
  return record;
}

export async function pauseScheduledJob(id: string) {
  const db = await getDb();
  db.run(`UPDATE scheduled_jobs SET status = 'PAUSED' WHERE id = ?`, [id]);
  saveDb();
  jobManager.broadcast('scheduled_job_updated', { id, status: 'PAUSED' });
}

export async function resumeScheduledJob(id: string) {
  const db = await getDb();
  const now = new Date();
  const nextRunAt = new Date(now.getTime() + 5000).toISOString();
  db.run(`UPDATE scheduled_jobs SET status = 'SCHEDULED', next_run_at = ? WHERE id = ?`, [nextRunAt, id]);
  saveDb();
  jobManager.broadcast('scheduled_job_updated', { id, status: 'SCHEDULED', next_run_at: nextRunAt });
}

export async function deleteScheduledJob(id: string) {
  const db = await getDb();
  db.run(`DELETE FROM scheduled_jobs WHERE id = ?`, [id]);
  saveDb();
  jobManager.broadcast('scheduled_job_deleted', { id });
}

export async function runScheduledJobNow(id: string) {
  const jobs = await getScheduledJobs();
  const job = jobs.find((j) => j.id === id);
  if (!job) return;

  await triggerBatchRun(job);
}

async function processScheduledJobsTick() {
  const jobs = await getScheduledJobs();
  const now = new Date();

  for (const job of jobs) {
    if (job.status !== 'SCHEDULED') continue;

    const nextRun = new Date(job.next_run_at);
    if (!isNaN(nextRun.getTime()) && nextRun.getTime() <= now.getTime()) {
      await triggerBatchRun(job);
    }
  }
}

async function triggerBatchRun(job: ScheduledJobRecord) {
  const db = await getDb();
  const now = new Date();

  // Slice target URLs for current batch
  const startIndex = job.completed_batches * job.batch_size;
  const endIndex = Math.min(startIndex + job.batch_size, job.target_urls.length);

  let urlsToProcess: string[] = [];
  if (startIndex < job.target_urls.length) {
    urlsToProcess = job.target_urls.slice(startIndex, endIndex);
  } else {
    // If all URLs processed once, loop back if recurring or complete
    if (job.schedule_type === 'ONCE') {
      db.run(`UPDATE scheduled_jobs SET status = 'COMPLETED' WHERE id = ?`, [job.id]);
      saveDb();
      jobManager.broadcast('scheduled_job_updated', { id: job.id, status: 'COMPLETED' });
      return;
    } else {
      urlsToProcess = job.target_urls.slice(0, job.batch_size);
    }
  }

  // Deduct indexation credits for this batch run
  const creditResult = await deductUserCredits(urlsToProcess.length);
  if (!creditResult.success) {
    console.warn(`[SmartBatchScheduler] Job ${job.id} paused due to insufficient credits.`);
    db.run(`UPDATE scheduled_jobs SET status = 'PAUSED' WHERE id = ?`, [job.id]);
    saveDb();
    jobManager.broadcast('scheduled_job_updated', {
      id: job.id,
      status: 'PAUSED',
      error: creditResult.error || 'Insufficient indexation credits remaining.',
    });
    return;
  }

  const submissionId = `sub_sched_${job.id}_${Date.now()}`;
  const config: TaskJobConfig = {
    submissionId,
    targetUrls: urlsToProcess,
    features: job.config.features || {
      generateBacklinks: true,
      checkLiveConfirmation: true,
      requestIndexing: true,
      runGoogleIndexing: true,
      runPingServices: true,
    },
    concurrencyLimit: job.config.concurrencyLimit || 3,
    proxyList: [],
    selectedDirectoryIds: job.config.selectedDirectoryIds,
  };

  // Launch the batch submission job
  jobManager.startJob(config).catch((err) => {
    console.error(`Scheduled Job Execution Error [${job.id}]:`, err);
  });

  const nextBatchNum = job.completed_batches + 1;
  const isFullyFinished = nextBatchNum >= job.total_batches && job.schedule_type === 'ONCE';

  let nextRunAtDate: Date;
  if (job.schedule_type === 'INTERVAL') {
    nextRunAtDate = new Date(now.getTime() + job.interval_minutes * 60 * 1000);
  } else if (job.schedule_type === 'DAILY') {
    nextRunAtDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  } else {
    // ONCE
    nextRunAtDate = new Date(now.getTime() + job.interval_minutes * 60 * 1000);
  }

  const newStatus = isFullyFinished ? 'COMPLETED' : 'SCHEDULED';

  db.run(
    `UPDATE scheduled_jobs SET
      completed_batches = ?,
      last_run_at = ?,
      next_run_at = ?,
      status = ?
     WHERE id = ?`,
    [
      nextBatchNum,
      now.toISOString(),
      nextRunAtDate.toISOString(),
      newStatus,
      job.id,
    ]
  );
  saveDb();

  jobManager.broadcast('scheduled_job_triggered', {
    id: job.id,
    submissionId,
    batchNum: nextBatchNum,
    urlsProcessed: urlsToProcess.length,
    status: newStatus,
    nextRunAt: nextRunAtDate.toISOString(),
  });
}
