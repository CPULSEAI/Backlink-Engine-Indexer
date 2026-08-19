import asyncio
import json
import random
import time
import httpx
from datetime import datetime, timezone

TARGET_URL = "http://127.0.0.1:8000/api/v1/campaigns/batch-process"

def generate_mock_url_pool(total_count: int = 100000) -> list[str]:
    """Generates a massive, structured list of synthetic URLs for pipeline testing."""
    domains = [
        "techcrunch.com", "forbes.com", "bloomberg.com", "medium.com", 
        "github.com", "stackoverflow.com", "dev.to", "reddit.com"
    ]
    categories = ["career-advice", "job-hunting", "resume-tips", "interview-prep", "hiring-trends"]
    url_pool = []
    
    print(f"[*] Pre-allocating memory structures for {total_count:,} target URLs...")
    for i in range(total_count):
        domain = random.choice(domains)
        category = random.choice(categories)
        slug_id = random.randint(10000, 99999)
        url_pool.append(f"https://www.{domain}/{category}/how-to-optimize-profile-metrics-{slug_id}-{i}.html")
    
    return url_pool

async def execute_stress_test():
    """Compiles a complete 100k campaign object and executes an atomic chunked post."""
    url_payload_list = generate_mock_url_pool(total_count=100000)
    
    payload = {
      "campaignName": f"Enterprise GEO Performance Run - {int(time.time())}",
      "targetUrls": url_payload_list,
      "features": {
          "indexNow": True,
          "googleIndexing": True,
          "geoGrade": True,
          "citationAnalysis": True
      },
      "concurrencyLimit": 25,
      "subBatchSize": 2500
    }

    print(f"[*] Packaging payload context. Payload total dictionary size: {len(payload['targetUrls']):,} references.")
    print("[*] Dispatching payload transaction to backend. Monitoring allocation safety bounds...")
    
    # Utilizing an extended timeouts profile to securely accommodate structural array handshakes
    timeout_config = httpx.Timeout(120.0, connect=10.0)
    
    async with httpx.AsyncClient(timeout=timeout_config) as client:
        start_time = time.perf_counter()
        try:
            response = await client.post(TARGET_URL, json=payload)
            elapsed_time = time.perf_counter() - start_time
            
            if response.status_code == 200:
                print(f"[+] Core Ingestion Complete! HTTP Status: {response.status_code}")
                print(f"[+] Total execution processing transfer time: {elapsed_time:.4f} seconds")
                print(f"[+] Server Response Blueprint: {json.dumps(response.json(), indent=2)}")
            else:
                print(f"[-] Pipeline Refusal Encountered! Status Code: {response.status_code}")
                print(f"[-] Error Trace Body: {response.text}")
                
        except httpx.RequestError as exc:
            print(f"[-] Structural transport layer failure occurred during API dispatch: {exc}")

if __name__ == "__main__":
    print("=== Bulk URL Target Manager: High-Volume Pipeline Stress Tester ===")
    asyncio.run(execute_stress_test())
