#!/usr/bin/env bash
# ==============================================================================
# CareerPulseAI & AutoSubmit Pro - Automated Indexing Cron Runner
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="${SCRIPT_DIR}/automated_indexing_pipeline.py"
LOG_FILE="${SCRIPT_DIR}/indexing_cron_$(date +'%Y%m%d').log"

echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] Starting AutoSubmit Pro Cron Pipeline..." | tee -a "$LOG_FILE"

# Check if Python is available
if command -v python3 &>/dev/null; then
    PYTHON_BIN="python3"
elif command -v python &>/dev/null; then
    PYTHON_BIN="python"
else
    echo "[-] Error: Python 3 was not found in PATH." | tee -a "$LOG_FILE"
    exit 1
fi

# Execute Pipeline
$PYTHON_BIN "$PYTHON_SCRIPT" 2>&1 | tee -a "$LOG_FILE"

echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] Cron Pipeline execution completed." | tee -a "$LOG_FILE"
