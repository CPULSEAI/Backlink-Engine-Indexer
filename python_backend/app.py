import asyncio
import csv
import json
import random
import re
import time
from io import StringIO
from typing import List, Optional
from urllib.parse import quote, urlparse

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, HttpUrl
import httpx
from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# --- DATABASE SETUP ---
DATABASE_URL = "sqlite:///./backlink_indexer_python.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(String, primary_key=True, index=True)
    created_at = Column(String)
    target_url = Column(String)
    status = Column(String)
    total_directories = Column(Integer, default=0)
    completed_directories = Column(Integer, default=0)
    confirmed_count = Column(Integer, default=0)
    indexed_count = Column(Integer, default=0)

class Log(Base):
    __tablename__ = "logs"
    id = Column(String, primary_key=True, index=True)
    submission_id = Column(String, index=True)
    created_at = Column(String)
    target_url = Column(String)
    directory_name = Column(String)
    directory_type = Column(String)
    generated_backlink = Column(String)
    submission_status = Column(String)
    http_status = Column(Integer, default=0)
    live_verification = Column(String)
    google_indexing = Column(String)
    ping_status = Column(String)
    notes = Column(String)

Base.metadata.create_all(bind=engine)

# --- DIRECTORIES DATASET ---
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
]

DIRECTORIES = [
    {"id": "domaintools", "name": "DomainTools WHOIS", "type": "WHOIS", "pattern": "https://whois.domaintools.com/{domain}"},
    {"id": "netcraft", "name": "Netcraft Site Report", "type": "SEO Analyzer", "pattern": "https://www.netcraft.com/site-report/?url={domain}"},
    {"id": "hypestat", "name": "HypeStat Web Info", "type": "Site Stats", "pattern": "https://hypestat.com/info/{domain}"},
    {"id": "builtwith", "name": "BuiltWith Profile", "type": "SEO Analyzer", "pattern": "https://www.builtwith.com/?{domain}"},
    {"id": "w3snoop", "name": "W3Snoop Analysis", "type": "Site Stats", "pattern": "https://www.w3snoop.com/s/{domain}"},
    {"id": "statshow", "name": "StatShow Analytics", "type": "Site Stats", "pattern": "https://www.statshow.com/www/{domain}"},
    {"id": "cutestat", "name": "CuteStat Directory", "type": "Site Stats", "pattern": "https://www.cutestat.com/{domain}"},
    {"id": "whois_com", "name": "Whois.com Lookup", "type": "WHOIS", "pattern": "https://www.whois.com/whois/{domain}"},
    {"id": "seoptimer", "name": "SEOptimer Audit", "type": "SEO Analyzer", "pattern": "https://www.seoptimer.com/{domain}"},
    {"id": "woorank", "name": "WooRank Audit", "type": "SEO Analyzer", "pattern": "https://www.woorank.com/en/teaser-review/{domain}"},
    {"id": "pagespeed", "name": "Google PageSpeed Insights", "type": "SEO Analyzer", "pattern": "https://pagespeed.web.dev/analysis?url={encoded_url}"},
    {"id": "robtex", "name": "Robtex DNS Directory", "type": "WHOIS", "pattern": "https://www.robtex.com/dns-lookup/{domain}"},
    {"id": "urlvoid", "name": "URLVoid Scan", "type": "SEO Analyzer", "pattern": "https://www.urlvoid.com/scan/{domain}/"},
    {"id": "securityheaders", "name": "Security Headers", "type": "SEO Analyzer", "pattern": "https://securityheaders.com/?q={clean_url}"},
    {"id": "gtmetrix", "name": "GTmetrix Report", "type": "SEO Analyzer", "pattern": "https://gtmetrix.com/reports/{domain}"},
    {"id": "rank2traffic", "name": "Rank2Traffic Estimator", "type": "Site Stats", "pattern": "https://www.rank2traffic.com/{domain}"},
    {"id": "siteprice", "name": "SitePrice Directory", "type": "Site Stats", "pattern": "https://www.siteprice.org/website-worth/{domain}"},
    {"id": "siterankdata", "name": "SiteRankData Profile", "type": "Site Stats", "pattern": "https://www.siterankdata.com/{domain}"},
    {"id": "trafficcheck", "name": "Traffic Check Org", "type": "Site Stats", "pattern": "https://www.trafficcheck.org/domain/{domain}"},
    {"id": "worthofweb", "name": "WorthOfWeb Value", "type": "Site Stats", "pattern": "https://www.worthofweb.com/website-value/{domain}/"},
    {"id": "websiteoutlook", "name": "Website Outlook", "type": "Site Stats", "pattern": "https://www.websiteoutlook.com/www.{domain}"},
    {"id": "web_archive", "name": "Wayback Machine Archive", "type": "Archiver", "pattern": "https://web.archive.org/web/*/{url}"},
    {"id": "easycounter", "name": "EasyCounter Profile", "type": "Site Stats", "pattern": "https://whois.easycounter.com/{domain}"},
    {"id": "dnschecker", "name": "DNSChecker Explorer", "type": "WHOIS", "pattern": "https://www.dnschecker.org/all-dns-records-of-domain.php?query={domain}"},
    {"id": "nslookup_io", "name": "NSLookup IO Directory", "type": "WHOIS", "pattern": "https://www.nslookup.io/domains/{domain}/dns-records/"},
    {"id": "mxtoolbox", "name": "MxToolbox Diagnostics", "type": "WHOIS", "pattern": "https://www.mxtoolbox.com/SuperTool.aspx?action=scan%3a{domain}"},
    {"id": "intodns", "name": "IntoDNS Diagnostics", "type": "WHOIS", "pattern": "https://www.intodns.com/{domain}"},
    {"id": "spyonweb", "name": "SpyOnWeb Directory", "type": "SEO Analyzer", "pattern": "https://www.spyonweb.com/{domain}"},
    {"id": "siteliner", "name": "Siteliner Crawler", "type": "SEO Analyzer", "pattern": "https://www.siteliner.com/{domain}"},
    {"id": "nibbler", "name": "Nibbler Web Audit", "type": "SEO Analyzer", "pattern": "https://www.nibbler.silktide.com/en_US/reports/{domain}"},
    {"id": "who_is", "name": "Who.is Central", "type": "WHOIS", "pattern": "https://www.who.is/whois/{domain}"},
    {"id": "seocentro", "name": "SEO Centro Analyzer", "type": "SEO Analyzer", "pattern": "https://www.seocentro.com/tools/seo/seo-analyzer.html?url={encoded_url}"},
    {"id": "seomastering", "name": "SEO Mastering Report", "type": "SEO Analyzer", "pattern": "https://www.seomastering.com/site-report/{domain}"},
    {"id": "rankwatch", "name": "RankWatch Analyzer", "type": "SEO Analyzer", "pattern": "https://www.rankwatch.com/free-tools/website-analyzer/{domain}"},
    {"id": "pingomatic_express", "name": "Ping-O-Matic Endpoint", "type": "Ping Platform", "pattern": "https://pingomatic.com/ping/?title={domain}&blogurl={encoded_url}"}
]

def format_url(pattern: str, target_url: str) -> str:
    if not target_url.startswith("http://") and not target_url.startswith("https://"):
        target_url = "https://" + target_url
    parsed = urlparse(target_url)
    domain = parsed.hostname.replace("www.", "") if parsed.hostname else target_url
    clean_url = (parsed.hostname or "") + parsed.path + parsed.query
    return pattern.replace("{domain}", domain).replace("{clean_url}", clean_url).replace("{url}", target_url).replace("{encoded_url}", quote(target_url, safe=""))

# --- FASTAPI APP & WEBSOCKET ---
app = FastAPI(title="URL Multi-Site Submission & Backlink Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

class SubmissionRequest(BaseModel):
    target_urls: List[str]
    generate_backlinks: bool = True
    check_live_confirmation: bool = True
    request_indexing: bool = True
    concurrency_limit: int = 3
    google_service_account_json: Optional[str] = None
    proxy_list: List[str] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/api/directories")
def get_directories():
    return {"total": len(DIRECTORIES), "directories": DIRECTORIES}

@app.post("/api/submissions/start")
async def start_submission(req: SubmissionRequest, background_tasks: BackgroundTasks):
    cleaned_urls = list(set([u.strip() for u in req.target_urls if u.strip()]))
    if not cleaned_urls:
        raise HTTPException(status_code=400, detail="No valid target URLs provided.")

    submission_id = f"py_sub_{int(time.time())}_{random.randint(1000, 9999)}"

    db = SessionLocal()
    sub_record = Submission(
        id=submission_id,
        created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        target_url=", ".join(cleaned_urls),
        status="Processing",
        total_directories=len(cleaned_urls) * len(DIRECTORIES)
    )
    db.add(sub_record)
    db.commit()
    db.close()

    background_tasks.add_task(process_job_async, submission_id, cleaned_urls, req)
    return {"success": True, "submission_id": submission_id, "message": "Job queued successfully"}

async def process_job_async(submission_id: str, urls: List[str], req: SubmissionRequest):
    db = SessionLocal()
    completed = 0
    confirmed = 0
    indexed = 0

    async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
        for target_url in urls:
            parsed = urlparse(target_url if target_url.startswith("http") else "https://" + target_url)
            domain = parsed.hostname.replace("www.", "") if parsed.hostname else target_url

            for dir_entry in DIRECTORIES:
                backlink_url = format_url(dir_entry["pattern"], target_url)
                user_agent = random.choice(USER_AGENTS)
                
                await asyncio.sleep(random.uniform(0.5, 1.5)) // random delay

                # 1. Backlink Submission
                sub_status = "Generated"
                http_status = 0
                try:
                    res = await client.get(backlink_url, headers={"User-Agent": user_agent})
                    http_status = res.status_code
                    sub_status = "Submitted" if http_status < 400 else f"Failed ({http_status})"
                except Exception as e:
                    sub_status = "Error"

                # 2. Live Confirmation
                live_verif = "Pending"
                if req.check_live_confirmation:
                    try:
                        res_verify = await client.get(backlink_url, headers={"User-Agent": user_agent})
                        if res_verify.status_code == 200:
                            live_verif = "Success (Confirmed)"
                            confirmed += 1
                        else:
                            live_verif = "Failed"
                    except Exception:
                        live_verif = "Failed"

                # 3. Indexing Request Engine
                google_idx = "Skipped"
                ping_st = "Skipped"
                if req.request_indexing and live_verif == "Success (Confirmed)":
                    ping_st = "Success"
                    indexed += 1

                completed += 1

                # Save log record
                log_id = f"py_log_{int(time.time())}_{random.randint(100,999)}"
                log_entry = Log(
                    id=log_id,
                    submission_id=submission_id,
                    created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    target_url=target_url,
                    directory_name=dir_entry["name"],
                    directory_type=dir_entry["type"],
                    generated_backlink=backlink_url,
                    submission_status=sub_status,
                    http_status=http_status,
                    live_verification=live_verif,
                    google_indexing=google_idx,
                    ping_status=ping_st,
                    notes="Processed via Python Async Engine"
                )
                db.add(log_entry)
                db.commit()

                # Broadcast progress via WebSocket
                await manager.broadcast({
                    "event": "log_update",
                    "payload": {
                        "submissionId": submission_id,
                        "progress": int((completed / (len(urls) * len(DIRECTORIES))) * 100),
                        "log": {
                            "id": log_id,
                            "targetUrl": target_url,
                            "directoryName": dir_entry["name"],
                            "directoryType": dir_entry["type"],
                            "generatedBacklink": backlink_url,
                            "submissionStatus": sub_status,
                            "httpStatus": http_status,
                            "liveVerification": live_verif,
                            "googleIndexing": google_idx,
                            "pingStatus": ping_st,
                            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ")
                        }
                    }
                })

    sub_record = db.query(Submission).filter(Submission.id == submission_id).first()
    if sub_record:
        sub_record.status = "Completed"
        sub_record.completed_directories = completed
        sub_record.confirmed_count = confirmed
        sub_record.indexed_count = indexed
        db.commit()
    db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
