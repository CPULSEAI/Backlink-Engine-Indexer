import asyncio
import os
import aiosqlite

DB_FILE = os.getenv("SQLITE_DB_PATH", "backlink_indexer.sqlite")

async def get_optimized_db_connection() -> aiosqlite.Connection:
    """
    Spins up a uniquely tuned async SQLite connection wrapper featuring high-throughput 
    in-memory performance flags and transaction isolation handlers to prevent locks.
    """
    # 50000ms timeout forces workers to patiently queue writes rather than immediate crashing
    conn = await aiosqlite.connect(DB_FILE, timeout=50.0)
    
    # Enable Write-Ahead Logging for simultaneous async reads and serialization writes
    await conn.execute("PRAGMA journal_mode = WAL;")
    
    # Synchronous NORMAL reduces physical disk flushes, passing safety to the WAL profile
    await conn.execute("PRAGMA synchronous = NORMAL;")
    
    # Store temporary cache memory in RAM rather than heavy disk operations
    await conn.execute("PRAGMA temp_store = MEMORY;")
    
    # 2GB Cache size assignment (Measured in negative kibibytes allocations)
    await conn.execute("PRAGMA cache_size = -2000000;")
    
    # Enforce foreign key constraints across concurrent cascade actions
    await conn.execute("PRAGMA foreign_keys = ON;")
    
    # Allow background indexing checkpoints to scale safely
    await conn.execute("PRAGMA wal_autocheckpoint = 4000;")
    
    return conn

async def execute_wal_checkpoint_loop():
    """
    Background worker loop that runs alongside your campaign execution. This ensures 
    that the WAL log file is periodically merged back into the primary database without 
    blocking active URL processing workers.
    """
    print("[*] Initiating Background WAL Checkpoint Optimization Worker...")
    while True:
        try:
            # Wake up every 60 seconds to clean up WAL memory footprints
            await asyncio.sleep(60)
            async with aiosqlite.connect(DB_FILE) as conn:
                # PASSIVE checkpoint allows background cleaning without halting current operations
                await conn.execute("PRAGMA wal_checkpoint(PASSIVE);")
                print("[+] SQLite WAL Checkpoint Executed Successfully. Write buffers recycled.")
        except asyncio.CancelledError:
            print("[-] WAL Checkpoint Engine shutting down gracefully...")
            break
        except Exception as e:
            print(f"[-] WAL Checkpoint Routine warning: {e}")
