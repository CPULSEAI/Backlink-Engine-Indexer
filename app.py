import streamlit as st
import pandas as pd
import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse
import io

st.set_page_config(page_title="Bulk Keyword & Site Optimizer", layout="wide")

def clean_url(url: str) -> str:
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    return url

def fetch_page_content(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.text
    except Exception as e:
        return None

def analyze_site_against_keyword(url: str, html_content: str, keyword: str):
    if not html_content:
        return {
            "Domain / Page": url,
            "Keyword / Phrase": keyword,
            "Status": "Failed to Fetch",
            "Optimization Score": 0,
            "Title Match": "N/A",
            "Meta Match": "N/A",
            "H1 Match": "N/A",
            "Body Density (%)": 0.0,
            "Actionable Recommendations": "Check URL availability or block status."
        }

    soup = BeautifulSoup(html_content, "html.parser")
    kw_lower = keyword.lower().strip()
    words_in_kw = set(kw_lower.split())

    # Extract Page Elements
    title_text = soup.title.string.lower() if soup.title and soup.title.string else ""
    meta_desc = ""
    meta_tag = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
    if meta_tag and meta_tag.get("content"):
        meta_desc = meta_tag["content"].lower()

    h1_texts = " ".join([h.get_text().lower() for h in soup.find_all("h1")])
    
    # Body Content Analysis
    for script in soup(["script", "style", "nav", "footer", "header"]):
        script.extract()
    body_text = soup.get_text(separator=" ").lower()
    clean_body_words = re.findall(r'\w+', body_text)
    total_word_count = len(clean_body_words) if len(clean_body_words) > 0 else 1

    # Keyword Density & Exact Matches
    exact_matches = len(re.findall(re.escape(kw_lower), body_text))
    density = round((exact_matches * len(kw_lower.split()) / total_word_count) * 100, 2)

    # Partial / Term Coverage Check
    missing_terms = [w for w in words_in_kw if w not in body_text]

    # Scoring Matrix (1 - 100 Scale)
    score = 0
    recs = []

    # Title Tag Audit (30 pts)
    if kw_lower in title_text:
        score += 30
        title_status = "Exact Match"
    elif all(w in title_text for w in words_in_kw):
        score += 20
        title_status = "Partial Match"
    else:
        title_status = "Missing"
        recs.append(f"Add exact phrase '{keyword}' to HTML <title> tag.")

    # Meta Description Audit (20 pts)
    if kw_lower in meta_desc:
        score += 20
        meta_status = "Exact Match"
    elif all(w in meta_desc for w in words_in_kw):
        score += 10
        meta_status = "Partial Match"
    else:
        meta_status = "Missing"
        recs.append(f"Inject keyword '{keyword}' into meta description.")

    # H1 Header Audit (25 pts)
    if kw_lower in h1_texts:
        score += 25
        h1_status = "Exact Match"
    elif all(w in h1_texts for w in words_in_kw):
        score += 15
        h1_status = "Partial Match"
    else:
        h1_status = "Missing"
        recs.append(f"Include phrase in main <h1> heading.")

    # Density & Frequency Audit (25 pts)
    if 1.0 <= density <= 3.0:
        score += 25
    elif density > 0:
        score += 10
        if density < 1.0:
            recs.append(f"Increase frequency of '{keyword}' in content (current density: {density}%).")
        else:
            recs.append(f"Reduce frequency of '{keyword}' to avoid over-optimization (current density: {density}%).")
    else:
        recs.append(f"Mention '{keyword}' naturally inside main body paragraphs.")

    if missing_terms:
        recs.append(f"Include missing related term(s): {', '.join(missing_terms)}.")

    return {
        "Domain / Page": url,
        "Keyword / Phrase": keyword,
        "Status": "Success",
        "Optimization Score": min(score, 100),
        "Title Match": title_status,
        "Meta Match": meta_status,
        "H1 Match": h1_status,
        "Body Density (%)": density,
        "Actionable Recommendations": " | ".join(recs) if recs else "Fully optimized for target keyword!"
    }

# UI Setup
st.title("⚡ Bulk Keyword & Site Optimization Tool")
st.markdown("Submit multiple websites and keywords below to audit and optimize on-page content alignment.")

col1, col2 = st.columns(2)

with col1:
    websites_input = st.text_area(
        "Enter Target Websites / URLs (Comma-delimited):",
        placeholder="https://careerpulseai.net, https://example.com",
        height=150
    )

with col2:
    keywords_input = st.text_area(
        "Enter Target Keywords / Phrases (Comma-delimited):",
        placeholder="resume optimizer, ATS audit tool, career matches",
        height=150
    )

if st.button("Run Bulk Optimization Audit", type="primary"):
    if not websites_input.strip() or not keywords_input.strip():
        st.error("Please enter at least one website and one keyword.")
    else:
        urls = [clean_url(u) for u in websites_input.split(",") if u.strip()]
        keywords = [k.strip() for k in keywords_input.split(",") if k.strip()]

        st.info(f"Analyzing {len(urls)} website(s) across {len(keywords)} keyword(s)... Total pairs: {len(urls) * len(keywords)}")

        results = []
        progress_bar = st.progress(0)
        total_tasks = len(urls) * len(keywords)
        current_task = 0

        # Crawl cache to prevent fetching same site multiple times
        site_html_cache = {}

        for url in urls:
            if url not in site_html_cache:
                site_html_cache[url] = fetch_page_content(url)
            
            html = site_html_cache[url]

            for kw in keywords:
                res = analyze_site_against_keyword(url, html, kw)
                results.append(res)
                
                current_task += 1
                progress_bar.progress(current_task / total_tasks)

        df = pd.DataFrame(results)

        st.subheader("Optimization Matrix Results")
        
        # Display Score Overview
        avg_score = df["Optimization Score"].mean()
        st.metric(label="Average Optimization Score across Matrix", value=f"{round(avg_score, 1)} / 100")

        # Color-coded Dataframe Output
        st.dataframe(
            df.style.background_gradient(subset=["Optimization Score"], cmap="RdYlGn", vmin=0, vmax=100),
            use_container_width=True
        )

        # Export Functionality
        csv_buffer = io.BytesIO()
        df.to_csv(csv_buffer, index=False)
        st.download_button(
            label="📥 Download CSV Audit Report",
            data=csv_buffer.getvalue(),
            file_name="bulk_keyword_optimization_report.csv",
            mime="text/csv"
        )
