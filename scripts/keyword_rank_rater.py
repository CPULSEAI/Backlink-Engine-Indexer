"""
Production-Ready Keyword Rank & Rating Utility Engine
---------------------------------------------------
A zero-dependency, high-performance Python engine for extracting organic search positions, 
scoring keyword visibility (1-100), and generating multi-format reports (Markdown, CSV, JSON).

Author: Senior Python & Web Development Engineer
"""

import os
import sys
import re
import json
import csv
import time
import random
import urllib.parse
import urllib.request
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, asdict

# User-Agent rotation pool for scraping fallback
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.64 Mobile Safari/537.36"
]

@dataclass
class RankResult:
    domain: str
    normalized_domain: str
    keyword: str
    organic_rank: Optional[int]  # None if > max_depth
    rank_display: str           # "1", "14", or "Not Ranked (>100)"
    rating_category: str        # "Excellent", "Good / Page 1", "Fair / Page 2", "Low", "Poor / Unranked"
    score: int                  # 0 to 100
    landing_page_url: str       # Exact URL ranking, or "N/A"
    search_region: str
    device: str
    checked_at: str

class DomainNormalizer:
    """Utilities for cleaning and matching domain names."""
    
    @staticmethod
    def clean_domain(raw_input: str) -> str:
        """Strips http/https, www, query params, ports, and trailing slashes."""
        if not raw_input:
            return ""
        
        cleaned = raw_input.strip().lower()
        if not cleaned.startswith(("http://", "https://")):
            cleaned = "http://" + cleaned
            
        try:
            parsed = urllib.parse.urlparse(cleaned)
            host = parsed.netloc or parsed.path.split('/')[0]
            # Strip port number if present
            host = host.split(':')[0]
            # Strip www prefix
            if host.startswith("www."):
                host = host[4:]
            return host.strip('/')
        except Exception:
            sub = re.sub(r'^(https?://)?(www\.)?', '', raw_input.strip().lower())
            return sub.split('/')[0].split(':')[0]

    @staticmethod
    def is_match(target_domain: str, result_url: str) -> bool:
        """Determines if a result URL belongs to target_domain or its subdomains."""
        if not result_url or result_url == "N/A":
            return False
        
        target_clean = DomainNormalizer.clean_domain(target_domain)
        result_clean = DomainNormalizer.clean_domain(result_url)
        
        if not target_clean or not result_clean:
            return False
            
        return (
            result_clean == target_clean or
            result_clean.endswith("." + target_clean)
        )

class KeywordScorer:
    """Calculates Keyword Rating Score (1-100) and rating category based on rank."""
    
    @staticmethod
    def calculate(rank: Optional[int]) -> Tuple[int, str]:
        """
        Positions 1-3: Excellent (Score: 90-100)
        Positions 4-10: Good / Page 1 (Score: 70-89)
        Positions 11-20: Fair / Page 2 (Score: 50-69)
        Positions 21-50: Low (Score: 25-49)
        Positions 51-100+: Poor / Unranked (Score: 0-24)
        """
        if rank is None or rank <= 0 or rank > 100:
            return 0, "Poor / Unranked"
        
        if rank == 1:
            return 100, "Excellent"
        elif rank == 2:
            return 95, "Excellent"
        elif rank == 3:
            return 90, "Excellent"
        elif 4 <= rank <= 10:
            score = 89 - int((rank - 4) * (19 / 6))
            return max(70, score), "Good / Page 1"
        elif 11 <= rank <= 20:
            score = 69 - int((rank - 11) * (19 / 9))
            return max(50, score), "Fair / Page 2"
        elif 21 <= rank <= 50:
            score = 49 - int((rank - 21) * (24 / 29))
            return max(25, score), "Low"
        elif 51 <= rank <= 100:
            score = 24 - int((rank - 51) * (23 / 49))
            return max(1, score), "Poor / Unranked"
        else:
            return 0, "Poor / Unranked"

class SerpFetcher:
    """Multi-provider SERP search result provider with API key & zero-dependency HTTP fallback."""
    
    def __init__(
        self, 
        serpapi_key: Optional[str] = None,
        google_api_key: Optional[str] = None,
        google_cx: Optional[str] = None
    ):
        self.serpapi_key = serpapi_key or os.getenv("SERPAPI_API_KEY")
        self.google_api_key = google_api_key or os.getenv("GOOGLE_SEARCH_API_KEY")
        self.google_cx = google_cx or os.getenv("GOOGLE_SEARCH_CX")

    def fetch_serp_links(
        self, 
        keyword: str, 
        region: str = "US", 
        device: str = "desktop", 
        depth: int = 100
    ) -> List[str]:
        """
        Fetches organic landing page URLs for a search term up to specified depth.
        Tries providers in priority order: SerpAPI -> Google Custom Search -> Direct HTTP Scrape.
        """
        urls: List[str] = []
        
        # Strategy 1: SerpAPI (Most accurate)
        if self.serpapi_key:
            try:
                urls = self._fetch_serpapi(keyword, region, device, depth)
                if urls:
                    return urls
            except Exception as e:
                print(f"[Warning] SerpAPI query failed: {e}. Falling back to secondary engine.", file=sys.stderr)

        # Strategy 2: Google Custom Search API
        if self.google_api_key and self.google_cx:
            try:
                urls = self._fetch_google_cse(keyword, region, depth)
                if urls:
                    return urls
            except Exception as e:
                print(f"[Warning] Google CSE query failed: {e}. Falling back to fallback provider.", file=sys.stderr)

        # Strategy 3: Zero-dependency DuckDuckGo / Bing Search Fallback
        try:
            urls = self._fetch_scrape_fallback(keyword, region, device, depth)
        except Exception as e:
            print(f"[Error] Direct SERP retrieval failed: {e}", file=sys.stderr)
            
        return urls

    def _fetch_serpapi(self, keyword: str, region: str, device: str, depth: int) -> List[str]:
        urls = []
        num_per_page = 100 if depth >= 100 else depth
        params = {
            "engine": "google",
            "q": keyword,
            "gl": region.lower(),
            "hl": "en",
            "device": "mobile" if device.lower() == "mobile" else "desktop",
            "num": num_per_page,
            "api_key": self.serpapi_key
        }
        query_str = urllib.parse.urlencode(params)
        req = urllib.request.Request(f"https://serpapi.com/search.json?{query_str}")
        with urllib.request.urlopen(req, timeout=12) as response:
            data = json.loads(response.read().decode('utf-8'))
            organic_results = data.get("organic_results", [])
            for item in organic_results:
                if "link" in item:
                    urls.append(item["link"])
        return urls

    def _fetch_google_cse(self, keyword: str, region: str, depth: int) -> List[str]:
        urls = []
        pages = (min(depth, 100) + 9) // 10
        for page in range(pages):
            start = page * 10 + 1
            params = {
                "key": self.google_api_key,
                "cx": self.google_cx,
                "q": keyword,
                "gl": region.lower(),
                "start": start
            }
            query_str = urllib.parse.urlencode(params)
            req = urllib.request.Request(f"https://customsearch.googleapis.com/customsearch/v1?{query_str}")
            try:
                with urllib.request.urlopen(req, timeout=10) as response:
                    data = json.loads(response.read().decode('utf-8'))
                    for item in data.get("items", []):
                        if "link" in item:
                            urls.append(item["link"])
            except Exception:
                break
            time.sleep(0.2)
        return urls

    def _fetch_scrape_fallback(self, keyword: str, region: str, device: str, depth: int) -> List[str]:
        urls = []
        encoded_q = urllib.parse.quote_plus(keyword)
        headers = {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
        
        num_results = min(depth, 100)
        target_url = f"https://html.duckduckgo.com/html/?q={encoded_q}&kl={region.lower()}-en"
        
        req = urllib.request.Request(target_url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                html_text = response.read().decode('utf-8', errors='ignore')
                
                # Regex match links from html
                raw_links = re.findall(r'href=["\'](/l/\?[^"\']+|https?://[^"\']+)["\']', html_text)
                for href in raw_links:
                    if "/l/?" in href:
                        parsed = urllib.parse.parse_qs(urllib.parse.urlparse(href).query)
                        if "uddg" in parsed:
                            extracted = parsed["uddg"][0]
                            if extracted not in urls:
                                urls.append(extracted)
                    elif href.startswith("http") and "duckduckgo.com" not in href:
                        if href not in urls:
                            urls.append(href)
        except Exception as e:
            print(f"[Warning] Fallback scraping encountered response delay: {e}", file=sys.stderr)
            
        return urls[:num_results]

class KeywordRankEngine:
    """Main Orchestrator for Bulk Keyword Rank Calculation & Reporting."""

    def __init__(
        self, 
        serpapi_key: Optional[str] = None,
        google_api_key: Optional[str] = None,
        google_cx: Optional[str] = None
    ):
        self.fetcher = SerpFetcher(serpapi_key, google_api_key, google_cx)

    def analyze_bulk(
        self,
        domains: List[str],
        keywords: List[str],
        region: str = "US",
        device: str = "desktop",
        depth: int = 100
    ) -> List[RankResult]:
        """
        Executes SERP rank extraction for every keyword x domain pair.
        """
        results: List[RankResult] = []
        cleaned_domains = [DomainNormalizer.clean_domain(d) for d in domains if d.strip()]
        cleaned_domains = list(dict.fromkeys(cleaned_domains))  # Unique preserved
        
        cleaned_keywords = [k.strip() for k in keywords if k.strip()]
        cleaned_keywords = list(dict.fromkeys(cleaned_keywords)) # Unique preserved

        if not cleaned_domains:
            raise ValueError("At least one valid target domain must be provided.")
        if not cleaned_keywords:
            raise ValueError("At least one valid search keyword/phrase must be provided.")

        timestamp = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())

        for kw in cleaned_keywords:
            serp_urls = self.fetcher.fetch_serp_links(kw, region, device, depth)
            
            for orig_domain, norm_domain in zip(domains, cleaned_domains):
                rank_found: Optional[int] = None
                landing_page = "N/A"
                
                for idx, serp_url in enumerate(serp_urls, start=1):
                    if idx > depth:
                        break
                    if DomainNormalizer.is_match(norm_domain, serp_url):
                        rank_found = idx
                        landing_page = serp_url
                        break

                score, category = KeywordScorer.calculate(rank_found)
                rank_display = str(rank_found) if rank_found is not None else f"Not Ranked (>{depth})"

                results.append(
                    RankResult(
                        domain=orig_domain.strip(),
                        normalized_domain=norm_domain,
                        keyword=kw,
                        organic_rank=rank_found,
                        rank_display=rank_display,
                        rating_category=category,
                        score=score,
                        landing_page_url=landing_page,
                        search_region=region.upper(),
                        device=device.lower(),
                        checked_at=timestamp
                    )
                )

        return results

    @staticmethod
    def to_markdown_table(results: List[RankResult]) -> str:
        """Formats RankResults as a clean Markdown table."""
        headers = ["Domain", "Keyword/Phrase", "Organic Rank", "Rating Category", "Score (1-100)", "Ranking Landing Page URL"]
        rows = []
        rows.append("| " + " | ".join(headers) + " |")
        rows.append("| " + " | ".join(["---"] * len(headers)) + " |")

        for r in results:
            url_display = f"[{r.landing_page_url}]({r.landing_page_url})" if r.landing_page_url != "N/A" else "N/A"
            rows.append(
                f"| `{r.normalized_domain}` | **{r.keyword}** | {r.rank_display} | {r.rating_category} | **{r.score}/100** | {url_display} |"
            )

        return "\n".join(rows)

    @staticmethod
    def export_csv(results: List[RankResult], filepath: str) -> None:
        """Exports results array to CSV file."""
        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([
                "Domain", "Normalized Domain", "Keyword", "Organic Rank", 
                "Rank Display", "Rating Category", "Score", "Landing Page URL", 
                "Search Region", "Device", "Checked At"
            ])
            for r in results:
                writer.writerow([
                    r.domain, r.normalized_domain, r.keyword, 
                    r.organic_rank if r.organic_rank is not None else "",
                    r.rank_display, r.rating_category, r.score, r.landing_page_url,
                    r.search_region, r.device, r.checked_at
                ])

    @staticmethod
    def export_json(results: List[RankResult], filepath: str) -> None:
        """Exports results array to formatted JSON file."""
        data = [asdict(r) for r in results]
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Keyword Rank & Rating Engine")
    parser.add_argument("--domains", "-d", required=True, help="Comma-separated or line-separated domain list (e.g., 'careerpulseai.net, example.com')")
    parser.add_argument("--keywords", "-k", required=True, help="Comma-separated list of search terms (e.g., 'resume optimizer, ATS audit tool')")
    parser.add_argument("--region", "-r", default="US", help="Target search country code (e.g. US, UK, CA)")
    parser.add_argument("--device", default="desktop", choices=["desktop", "mobile"], help="Device type")
    parser.add_argument("--depth", type=int, default=100, help="Max SERP search depth (e.g. 10, 50, 100)")
    parser.add_argument("--output-csv", help="Optional CSV file path to save report")
    parser.add_argument("--output-json", help="Optional JSON file path to save report")

    args = parser.parse_args()

    domain_list = [d.strip() for d in args.domains.split(",") if d.strip()]
    keyword_list = [k.strip() for k in args.keywords.split(",") if k.strip()]

    engine = KeywordRankEngine()
    print(f"\n🔍 Running SERP rank analysis for {len(domain_list)} domains across {len(keyword_list)} keywords...\n")
    
    results_data = engine.analyze_bulk(
        domains=domain_list,
        keywords=keyword_list,
        region=args.region,
        device=args.device,
        depth=args.depth
    )

    markdown_output = engine.to_markdown_table(results_data)
    print("### SERP Keyword Rank & Rating Report\n")
    print(markdown_output)
    print("\n")

    if args.output_csv:
        engine.export_csv(results_data, args.output_csv)
        print(f"✅ CSV Report exported to: {args.output_csv}")

    if args.output_json:
        engine.export_json(results_data, args.output_json)
        print(f"✅ JSON Report exported to: {args.output_json}")
