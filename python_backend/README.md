# URL Multi-Site Submission & Backlink Engine - Python DevOps Deployment Guide

This repository contains both a high-performance **Node.js / Express + React** full-stack web application (running directly on Cloud Run / container port 3000) and a standalone **Python FastAPI** backend engine for standalone microservice deployment.

---

## 🛠️ Python FastAPI Setup Instructions

### 1. Requirements
- Python 3.10+
- SQLite3

### 2. Environment Setup
```bash
# Clone the repository
git clone <repository_url>
cd python_backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Launching the FastAPI Server
```bash
# Run server using Uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
Access interactive API docs at: `http://localhost:8000/docs`

---

## ⚙️ Key Architecture & Features

1. **Async HTTP Execution (`httpx`)**: Concurrent non-blocking requests across 55+ high-authority WHOIS, SEO audit, and site analytics platforms.
2. **Anti-Blocking Strategy**: Rotates user-agents, introduces randomized 1–3s delays between submissions, and supports custom proxy lists (`IP:Port:User:Pass`).
3. **Live Confirmation Verification**: Follows up with GET requests to verify page creation and confirms presence of target URL in page HTML.
4. **Google Indexing API Integration**: Submits confirmed backlinks directly via Google Service Account credentials (`JSON`).
5. **Ping Fallback Engine**: Fires XML-RPC and HTTP pings to Ping-O-Matic, FeedBurner, PubSubHubbub, and pingmyurl.
6. **SQLite Storage**: Tracks full execution logs and submission records for instant CSV export.
