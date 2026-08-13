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
      console.error('[DB Error] Corrupted SQLite file detected. Recovering automatically:', err?.message || err);
      try {
        const backupPath = `${DB_PATH}.corrupt_${Date.now()}`;
        fs.renameSync(DB_PATH, backupPath);
        console.log(`[DB] Renamed malformed database file to ${backupPath}`);
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

