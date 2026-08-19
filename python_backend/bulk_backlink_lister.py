import asyncio
import base64
import json
import os
import random
from typing import List, Dict, Any, Optional
import httpx

class BulkBacklinkListerEngine:
    """
    Enterprise-ready Async Backlink Auditor.
    Fetches raw individual backlink sheets for single or bulk domain submissions
    using DataForSEO v3/backlinks/backlinks/live.
    """
    def __init__(self, api_login: Optional[str] = None, api_password: Optional[str] = None, use_sandbox: bool = False):
        self.api_login = api_login or os.getenv("DATAFORSEO_LOGIN", "")
        self.api_password = api_password or os.getenv("DATAFORSEO_PASSWORD", "")
        self.use_sandbox = use_sandbox or (not self.api_login or not self.api_password)
        self.api_url = "https://api.dataforseo.com/v3/backlinks/backlinks/live"
        
        credentials = f"{self.api_login}:{self.api_password}"
        encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
        
        self.headers = {
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/json"
        }

    def clean_target_domain(self, raw_target: str) -> str:
        cleaned = raw_target.strip()
        if "://" in cleaned:
            cleaned = cleaned.split("://", 1)[1]
        cleaned = cleaned.split("/")[0].split("?")[0].split("#")[0].strip()
        return cleaned.lower()

    def _generate_synthetic_backlinks(self, target_domain: str, limit: int = 100) -> Dict[str, Any]:
        """Generates realistic structured sample backlink rows for sandbox / benchmark evaluations."""
        clean = self.clean_target_domain(target_domain)
        anchors = [
            f"Official {clean.title()}",
            "API Documentation",
            "Project Repository",
            "Learn More Here",
            f"Why {clean} is fast",
            "Reference Architecture",
            "Source Code on GitHub",
            "Community Discussion",
            "Download Package",
            "Full Release Notes"
        ]
        referring_domains = [
            "github.com", "stackoverflow.com", "medium.com", "dev.to",
            "reddit.com", "news.ycombinator.com", "techcrunch.com",
            "slashdot.org", "wikipedia.org", "producthunt.com"
        ]

        count = min(limit, 25)
        backlink_rows = []
        for i in range(count):
            ref_dom = referring_domains[i % len(referring_domains)]
            is_dofollow = (i % 5 != 0)
            is_lost = (i % 9 == 0)
            backlink_rows.append({
                "source_url": f"https://{ref_dom}/post/{clean}-review-{100 + i}",
                "target_url": f"https://{clean}/docs/guide-{i+1}",
                "anchor_text": anchors[i % len(anchors)],
                "domain_rank": max(20, 96 - (i * 3)),
                "is_dofollow": is_dofollow,
                "first_seen": "2023-01-15T10:00:00Z",
                "last_seen": "2026-08-15T09:11:45Z",
                "loss_status": "LOST" if is_lost else "ACTIVE"
            })

        return {
            "target": target_domain,
            "domain": clean,
            "status": "SUCCESS",
            "is_sandbox": True,
            "total_rows_returned": len(backlink_rows),
            "backlinks": backlink_rows
        }

    async def fetch_detailed_backlinks(
        self, 
        client: httpx.AsyncClient, 
        target_domain: str, 
        limit: int = 100
    ) -> Dict[str, Any]:
        """
        Queries the live database endpoint to return an explicit array of individual 
        backlinks pointing to the targeted website.
        """
        clean_target = self.clean_target_domain(target_domain)
        if not clean_target:
            return {"target": target_domain, "domain": "", "status": "ERROR", "error": "Invalid or empty domain target"}

        if self.use_sandbox or not self.api_login or not self.api_password:
            await asyncio.sleep(0.05)
            return self._generate_synthetic_backlinks(target_domain, limit=limit)

        payload = [{
            "target": clean_target,
            "limit": limit,
            "include_subdomains": True,
            "order_by": ["rank,desc"] 
        }]
        
        try:
            response = await client.post(self.api_url, headers=self.headers, json=payload, timeout=60.0)
            
            if response.status_code != 200:
                return {
                    "target": target_domain,
                    "domain": clean_target,
                    "status": "ERROR",
                    "error": f"DataForSEO HTTP Refusal Code {response.status_code}"
                }
                
            response_json = response.json()
            tasks = response_json.get("tasks", [])
            
            if not tasks or tasks[0].get("status_code") != 20000:
                error_msg = tasks[0].get("status_message", "Unknown Fail") if tasks else "No tasks returned"
                return {"target": target_domain, "domain": clean_target, "status": "ERROR", "error": error_msg}

            result_block = tasks[0].get("result", [{}])[0]
            items = result_block.get("items", [])
            
            backlink_rows = []
            for item in items:
                backlink_rows.append({
                    "source_url": item.get("url_from") or "",
                    "target_url": item.get("url_to") or "",
                    "anchor_text": item.get("anchor") or "",
                    "domain_rank": item.get("rank") or 0,
                    "is_dofollow": not bool(item.get("is_nofollow", False)),
                    "first_seen": item.get("first_seen") or "",
                    "last_seen": item.get("last_seen") or "",
                    "loss_status": "LOST" if item.get("is_lost") else "ACTIVE"
                })

            return {
                "target": target_domain,
                "domain": clean_target,
                "status": "SUCCESS",
                "is_sandbox": False,
                "total_rows_returned": len(backlink_rows),
                "backlinks": backlink_rows
            }

        except httpx.RequestError as exc:
            return {"target": target_domain, "domain": clean_target, "status": "ERROR", "error": f"Network transport failure: {str(exc)}"}

    async def generate_bulk_reports(self, targets: List[str], links_per_target: int = 100, max_concurrency: int = 5) -> Dict[str, Any]:
        """Orchestrates concurrent retrieval tasks across safe async execution boundaries."""
        semaphore = asyncio.Semaphore(max_concurrency)
        
        async with httpx.AsyncClient() as client:
            async def worker_wrapper(domain: str):
                async with semaphore:
                    return await self.fetch_detailed_backlinks(client, domain.strip(), limit=links_per_target)
                    
            tasks = [asyncio.create_task(worker_wrapper(url)) for url in targets if url.strip()]
            
            completed_manifests = await asyncio.gather(*tasks)
            # Map items back into an accessible keyed object dictionary
            return {res.get("domain") or res.get("target"): res for res in completed_manifests if "target" in res}


# =============================================================================
# OPERATIONAL EXECUTIONS RUNNER
# =============================================================================
if __name__ == "__main__":
    API_LOGIN = os.getenv("DATAFORSEO_LOGIN", "")
    API_PASSWORD = os.getenv("DATAFORSEO_PASSWORD", "")

    bulk_targets = [
        "tiangolo.com",
        "openai.com"
    ]

    lister_engine = BulkBacklinkListerEngine(api_login=API_LOGIN, api_password=API_PASSWORD, use_sandbox=True)
    
    print("=== Deep Backlink Audit Report Builder ===")
    report_data = asyncio.run(lister_engine.generate_bulk_reports(bulk_targets, links_per_target=5, max_concurrency=2))
    
    print("\n" + "="*70 + "\nDETAILED STRUCTURAL AUDIT SHEET:\n" + "="*70)
    print(json.dumps(report_data, indent=2))
