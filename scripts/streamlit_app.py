"""
Streamlit Web Dashboard for Keyword Rank & Rating Utility Engine
---------------------------------------------------------------
Run with: streamlit run scripts/streamlit_app.py
"""

import os
import json
import pandas as pd
import streamlit as st
from keyword_rank_rater import KeywordRankEngine, DomainNormalizer, KeywordScorer

st.set_page_config(
    page_title="Keyword Rank & Rating Utility",
    page_icon="🎯",
    layout="wide"
)

st.title("🎯 Keyword Rank & Rating Engine")
st.markdown(
    "Production-grade utility tool to rate and calculate the organic keyword rank of search terms across multiple target website domains."
)

st.sidebar.header("⚙️ Search & API Configuration")

serpapi_key = st.sidebar.text_input(
    "SerpAPI Key (Recommended)", 
    type="password", 
    value=os.getenv("SERPAPI_API_KEY", ""),
    help="Provides exact Google SERP results. Fallbacks to direct fetch if left blank."
)

google_api_key = st.sidebar.text_input(
    "Google Custom Search API Key", 
    type="password", 
    value=os.getenv("GOOGLE_SEARCH_API_KEY", "")
)

google_cx = st.sidebar.text_input(
    "Google Custom Search Engine CX ID", 
    type="password", 
    value=os.getenv("GOOGLE_SEARCH_CX", "")
)

st.sidebar.markdown("---")
st.sidebar.subheader("🎯 Target Settings")

search_region = st.sidebar.selectbox(
    "Search Country / Region", 
    ["US", "UK", "CA", "AU", "DE", "FR", "IN", "JP", "BR"], 
    index=0
)

device_type = st.sidebar.selectbox(
    "Device Type", 
    ["desktop", "mobile"], 
    index=0
)

search_depth = st.sidebar.slider(
    "Search Engine Depth", 
    min_value=10, 
    max_value=100, 
    value=50, 
    step=10,
    help="Positions checked per search term (e.g. Top 10, Top 50, Top 100)"
)

col1, col2 = st.columns(2)

with col1:
    st.subheader("🌐 Target Websites / Domains")
    domain_input = st.text_area(
        "Enter target domains or URLs (one per line or comma-separated):",
        height=150,
        value="careerpulseai.net\nexample.com",
        help="Input bare domains or full URLs. The engine automatically normalizes protocols, www prefixes, and trailing paths."
    )

with col2:
    st.subheader("🔑 Keywords & Keyphrases")
    keyword_input = st.text_area(
        "Enter search terms or multi-word phrases (one per line or comma-separated):",
        height=150,
        value="resume optimizer, ATS audit tool, career matches",
        help="Enter single keywords or multi-word long-tail keyphrases."
    )

if st.button("🚀 Run Rank & Rating Audit", type="primary", use_container_width=True):
    # Parse inputs
    domains = [d.strip() for d in domain_input.replace(",", "\n").split("\n") if d.strip()]
    keywords = [k.strip() for k in keyword_input.replace(",", "\n").split("\n") if k.strip()]

    if not domains:
        st.error("Please enter at least one target domain.")
    elif not keywords:
        st.error("Please enter at least one target keyword.")
    else:
        st.info(f"Analyzing {len(domains)} domain(s) across {len(keywords)} keyword(s) up to Top {search_depth} results ({search_region} / {device_type})...")
        
        progress_bar = st.progress(0)
        engine = KeywordRankEngine(
            serpapi_key=serpapi_key if serpapi_key else None,
            google_api_key=google_api_key if google_api_key else None,
            google_cx=google_cx if google_cx else None
        )

        try:
            results = engine.analyze_bulk(
                domains=domains,
                keywords=keywords,
                region=search_region,
                device=device_type,
                depth=search_depth
            )
            progress_bar.progress(100)
            
            st.success("✅ Audit completed successfully!")

            # Convert to Pandas DataFrame for Streamlit UI
            table_data = []
            for r in results:
                table_data.append({
                    "Domain": r.normalized_domain,
                    "Keyword/Phrase": r.keyword,
                    "Organic Rank": r.rank_display,
                    "Rating Category": r.rating_category,
                    "Score (1-100)": r.score,
                    "Ranking Landing Page URL": r.landing_page_url,
                    "Checked At": r.checked_at
                })
            
            df = pd.DataFrame(table_data)

            # Metrics row
            m1, m2, m3, m4 = st.columns(4)
            avg_score = int(df["Score (1-100)"].mean()) if not df.empty else 0
            ranked_count = sum(1 for r in results if r.organic_rank is not None)
            
            m1.metric("Total Keywords Analyzed", len(keywords) * len(domains))
            m2.metric("Ranked Keywords (Top " + str(search_depth) + ")", ranked_count)
            m3.metric("Average Visibility Score", f"{avg_score}/100")
            m4.metric("Unranked Ratio", f"{len(results) - ranked_count}/{len(results)}")

            st.markdown("### 📊 SERP Rank & Score Summary Table")
            st.dataframe(df, use_container_width=True)

            st.markdown("### 📝 Sortable Markdown Output")
            md_table = engine.to_markdown_table(results)
            st.markdown(md_table)

            st.markdown("### 📥 Download Reports")
            col_d1, col_d2 = st.columns(2)
            
            csv_bytes = df.to_csv(index=False).encode('utf-8')
            col_d1.download_button(
                label="📄 Download CSV Report",
                data=csv_bytes,
                file_name="keyword_rank_report.csv",
                mime="text/csv",
                use_container_width=True
            )

            json_bytes = json.dumps([r.__dict__ for r in results], indent=2).encode('utf-8')
            col_d2.download_button(
                label="📦 Download JSON Report",
                data=json_bytes,
                file_name="keyword_rank_report.json",
                mime="application/json",
                use_container_width=True
            )

        except Exception as e:
            st.error(f"Execution Error: {str(e)}")
