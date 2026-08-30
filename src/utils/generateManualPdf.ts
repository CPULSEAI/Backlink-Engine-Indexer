import { jsPDF } from 'jspdf';

export interface ManualPdfOptions {
  version?: string;
  generatedDate?: string;
  author?: string;
}

export function generateUserManualPdf(options: ManualPdfOptions = {}): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const version = options.version || 'v3.0';
  const generatedDate = options.generatedDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const author = options.author || 'CareerPulse AI Systems & SEO Engineering';

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // Helper to check page break
  const ensureSpace = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin - 12) {
      doc.addPage();
      cursorY = margin + 10;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    const pageNum = doc.getNumberOfPages();
    if (pageNum > 1) {
      // Running Header
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(130, 140, 160);
      doc.text('SEO & GEO Backlink Indexing Engine — Complete Platform Manual v3.0', margin, 12);
      doc.text(version, pageWidth - margin - 10, 12);
      doc.setDrawColor(220, 225, 235);
      doc.line(margin, 14, pageWidth - margin, 14);

      // Running Footer
      doc.setDrawColor(220, 225, 235);
      doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
      doc.setFontSize(8);
      doc.setTextColor(140, 145, 160);
      doc.text(`Confidential & Proprietary • ${author}`, margin, pageHeight - 9);
      doc.text(`Page ${pageNum}`, pageWidth - margin - 12, pageHeight - 9);
    }
  };

  // --- COVER / TITLE BANNER ---
  doc.setFillColor(15, 23, 42); // dark slate #0f172a
  doc.roundedRect(margin, cursorY, contentWidth, 54, 4, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Generative Engine Optimization (GEO)', margin + 8, cursorY + 16);
  doc.text('& Search Indexing Pipeline Manual', margin + 8, cursorY + 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(190, 210, 240);
  doc.text('Enterprise Operations, Bulk SEO Validator, Intelligent Retry & Whitelabel Reporting', margin + 8, cursorY + 34);

  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Release Edition: ${version}  •  Publication Date: ${generatedDate}  •  Status: Verified Production`, margin + 8, cursorY + 44);

  cursorY += 62;

  // --- EXECUTIVE OVERVIEW CALLOUT ---
  doc.setFillColor(241, 245, 249); // #f1f5f9
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, cursorY, contentWidth, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('EXECUTIVE SYSTEM SUMMARY', margin + 6, cursorY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const summaryText = 'This enterprise platform coordinates high-velocity backlink creation, parallel Bulk SEO URL validation (50+ URLs), Google Indexing API v3 and IndexNow protocol pushes, 3-way competitor GEO gap radar mapping, Intelligent Retry exponential backoff, Visual Schema generator, and Whitelabel client PDF reporting.';
  const summaryLines = doc.splitTextToSize(summaryText, contentWidth - 12);
  doc.text(summaryLines, margin + 6, cursorY + 13);

  cursorY += 32;

  // --- SECTION BUILDER HELPERS ---
  const addSectionHeading = (title: string, sub?: string) => {
    ensureSpace(22);
    doc.setFillColor(79, 70, 229); // indigo
    doc.rect(margin, cursorY, 3.5, 10, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin + 7, cursorY + 7);

    cursorY += 12;

    if (sub) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(sub, margin + 7, cursorY);
      cursorY += 6;
    }
  };

  const addParagraph = (text: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(text, contentWidth);
    ensureSpace(lines.length * 4.5 + 4);
    doc.text(lines, margin, cursorY);
    cursorY += lines.length * 4.5 + 4;
  };

  const addBullet = (boldTitle: string, desc: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    
    doc.setFont('helvetica', 'normal');
    const remainingWidth = contentWidth - 8;
    const fullText = `•  ${boldTitle}: ${desc}`;
    const lines = doc.splitTextToSize(fullText, remainingWidth);

    ensureSpace(lines.length * 4.4 + 2);
    doc.text(lines, margin + 2, cursorY);
    cursorY += lines.length * 4.4 + 2;
  };

  // --- 1. INTRODUCTION ---
  addSectionHeading('1. Introduction to Generative Engine Optimization (GEO)', 'The paradigm shift from traditional SERP rankings to AI synthesis & citation engines');
  addParagraph('Traditional Search Engine Optimization (SEO) concentrated on winning rank positions #1-10 on standard search results pages. Generative Engine Optimization (GEO) focuses on optimizing digital properties so that artificial intelligence search assistants (such as OpenAI ChatGPT Search, Perplexity AI, Claude, and Google Gemini AI Overviews) parse, cite, and recommend your domain.');
  addBullet('Direct Answer-First Content', 'Structuring 30-50 word definitional answers directly below H1/H2 tags for instant LLM snippet extraction.');
  addBullet('JSON-LD Entity Graphing', 'Exposing explicit organizational, FAQ, schema, and product attributes for machine crawlers.');
  addBullet('Authority Backlink Velocity', 'Broadcasting newly minted URLs across search engine ping protocols and high-authority directory ecosystems.');

  // --- 2. QUICK START GUIDE ---
  addSectionHeading('2. Five-Minute Quick Start Guide', 'End-to-end steps to launch your first verified indexing job');
  addBullet('Step 1 — Input Target URLs', 'Enter single or batch URLs in the submission console or upload CSV/TXT format files.');
  addBullet('Step 2 — Bulk SEO Pre-Flight Validation', 'Optionally run the Bulk SEO Validator on 50+ URLs to inspect canonical tags and meta description health.');
  addBullet('Step 3 — Configure Indexing Engine', 'Select whether to engage Google Indexing API v3, the IndexNow multi-engine protocol, or SERP multi-ping nodes.');
  addBullet('Step 4 — Proxy & Concurrency', 'Set worker threads (1 to 10) and enable the Intelligent Auto-Rotate Proxy Shield for 429/403 rate-limit evasion.');
  addBullet('Step 5 — Execute & Live Stream', 'Click "Start Automated Submission". WebSocket streaming delivers live HTTP status codes, backlink verification logs, and retry notifications.');
  addBullet('Step 6 — Export Whitelabel Deliverables', 'Download full CSV/JSON audit reports, schema snippets, and whitelabel branded client PDF packages.');

  // --- 3. ARCHITECTURE & USER INTERFACE ---
  addSectionHeading('3. Architecture & User Interface Map', 'Component layout and navigation hierarchy');
  addBullet('Bento Analytics Dashboard', 'High-level real-time KPI tiles including confirmed backlinks, active worker nodes, indexing score, and 30-day velocity.');
  addBullet('Bulk SEO URL Validator', 'Parallel multi-threaded scanner analyzing canonical tags, missing meta descriptions, and H1/H2 header hierarchies for 50+ URLs.');
  addBullet('Intelligent Retry Policy', 'Automated exponential backoff shield catching transient 408/429/500/502/503/504 errors with real-time WebSocket toast notifications.');
  addBullet('Visual Schema Generator', 'Interactive Schema.org form builder generating FAQPage, Article, and Organization JSON-LD markup with rich snippet preview.');
  addBullet('LLM Citation Simulator', 'AI search simulation evaluating citation probability for ChatGPT, Perplexity, Gemini, and Claude with diagnostic scorecard.');
  addBullet('Whitelabel Client PDF Generator', 'Executive report studio with custom logo upload, brand color pickers, client domain setup, and live print preview.');
  addBullet('Interactive Keyword Gap Radar', 'Comparative 3-way radar visualization benchmarking your domain against two competitors across search intent clusters.');
  addBullet('Enterprise Content & GEO Grader', 'Deep-dive AI analysis inspecting keyword density, answer-first positioning, entity schema, and information gain.');

  // --- 4. 28 DETAILED TROUBLESHOOTING DIAGNOSTICS ---
  addSectionHeading('4. Complete Diagnostic & Troubleshooting Matrix (28 Items)', 'Comprehensive issue resolution reference for DevOps and SEO operators');

  const troubleshootingItems = [
    { p: '1. IndexNow 403 Forbidden Error', c: 'Missing IndexNow API Key file at root domain.', s: 'Verify key in Settings Modal and ensure the key text file matches host key hash.' },
    { p: '2. Google Indexing API 403 (Permission Denied)', c: 'Service account JSON lacks Owner role in Search Console.', s: 'Add service account email as Owner inside Google Search Console property settings using the Google API 3-Step Wizard.' },
    { p: '3. Transient HTTP 429/503 Queue Errors', c: 'Downstream directory or API endpoint temporarily rate-limited or congested.', s: 'Intelligent Retry Policy automatically catches 429/500/502/503/504 and re-queues with exponential backoff delay.' },
    { p: '4. Bulk SEO Validator Canonical Mismatch', c: 'Target URL serves a rel="canonical" pointing to a different domain or protocol.', s: 'Fix server canonical headers or update URL list to point to authoritative destination before batch submission.' },
    { p: '5. Bulk SEO Validator Missing Meta Description', c: 'Page HTML lacks <meta name="description"> or contains empty content.', s: 'Add a 50-160 character meta description containing key search entity terms.' },
    { p: '6. Visual Schema Generator JSON-LD Error', c: 'Unescaped double-quotes or invalid URL format inside schema fields.', s: 'Use the Visual Schema Generator form to auto-format, escape strings, and validate JSON-LD syntax.' },
    { p: '7. LLM Citation Simulator Low Probability (<50%)', c: 'Page lacks structured Q&A blocks, quantitative facts, or explicit author schema.', s: 'Use the 1-Click Schema Generator in the simulator to generate FAQ and Article Schema.' },
    { p: '8. Whitelabel PDF Print Preview Blank Logo', c: 'CORS restriction or invalid image URL provided for custom logo.', s: 'Upload a direct PNG/SVG image or use a public HTTPS image URL in the Whitelabel Client PDF Generator.' },
    { p: '9. Backlink Verification Timeout', c: 'Target website blocking automated UA or latency >6000ms.', s: 'Enable High-Anonymity Proxies in Settings or adjust worker thread delay.' },
    { p: '10. Gemini API Quota Exceeded (429)', c: 'Free tier or prepayment quota exhausted on Google Gemini.', s: 'System automatically falls back to offline heuristic scoring engine. Add fresh key in Settings.' },
    { p: '11. Proxy Node Connection Failure', c: 'Proxy unreachable or requires credentials.', s: 'Format proxy string as http://user:pass@ip:port and run Diagnostic Latency Ping.' },
    { p: '12. Consecutive 403 Proxy Auto-Disabling', c: 'Proxy node received 3 consecutive 403 WAF blocks.', s: 'System auto-disables the node for 10 minutes to protect submission flow and alerts in Settings.' },
    { p: '13. WebSocket Disconnected Status', c: 'Temporary container network sleep or background tab.', s: 'Click reconnect status icon or refresh page. Server SQLite database state remains persistent.' },
    { p: '14. Keyword Gap Radar Empty Chart', c: 'Entered domains lack indexable keyword data.', s: 'Click "Recalculate Radar Data" or ensure valid top-level domain syntax (e.g., brand.com).' },
    { p: '15. Content Grader Fetch AbortError', c: 'Target URL timed out after 6s or blocks server scrape.', s: 'The engine uses fallback URL structure and meta heuristics. Ensure public accessibility.' },
    { p: '16. Webhook Notification Not Firing', c: 'Webhook endpoint URL misconfigured or non-200 HTTP code.', s: 'Send test payload in Settings Modal and check server response logs.' },
    { p: '17. SEO Audit Crawler Stuck at 0%', c: 'Robots.txt on target domain strictly disallows bot crawling.', s: 'Use custom user-agent string or bypass robots check in Domain Audit parameters.' },
    { p: '18. Scheduled Crawl Not Running', c: 'Browser session cleared or server restart occurred.', s: 'Re-activate schedule inside Domain Profiler modal. Schedule persists in SQLite store.' },
    { p: '19. SSL Certificate Warning in Domain Profiler', c: 'Target domain SSL chain incomplete or expired.', s: 'Verify domain HTTPS configuration or run full technical audit for SSL details.' },
    { p: '20. Batch File Upload Parse Failure', c: 'CSV or TXT formatted with invalid delimiters.', s: 'Format file with one URL per line or standard header "url,anchor,target".' },
    { p: '21. Recharts Rendering Distortion', c: 'Window resize occurred during graph render.', s: 'Click chart mode toggles (Line/Area/Heatmap) to trigger instant clean re-render.' },
    { p: '22. Duplicate Submissions Flagged', c: 'Identical URL submitted within 24h cooldown window.', s: 'Toggle "Force Re-Index" checkbox in Smart Batcher configuration.' },
    { p: '23. High Failure Rate in Indexing Pings', c: 'Engine endpoints unreachable or ISP rate-limiting outbound.', s: 'Switch protocol pings to IndexNow protocol and decrease thread count.' },
    { p: '24. Missing Schema Markup in GEO Grade', c: 'Target page lacks JSON-LD or Microdata structured tags.', s: 'Use Visual Schema Generator modal to create FAQPage, Article, or Organization JSON-LD snippets.' },
    { p: '25. Database Persistence Reset', c: 'Local browser cache wiped or temporary container purged.', s: 'All data is stored in the persistent backend SQLite WAL database (`backlink_indexer.sqlite`).' },
    { p: '26. Rate Limit Throttling on Bing Ping', c: 'Exceeded 10,000 URLs per day IndexNow quota.', s: 'Batch URLs across multiple site host keys or schedule weekly drip indexing.' },
    { p: '27. Competitor Score Delta Discrepancy', c: 'Different benchmark modes selected (Solo vs 3-Way).', s: 'Toggle benchmark view mode top right in Keyword Gap Radar component.' },
    { p: '28. Export CSV Empty Output', c: 'No submission rows selected or active filter hides rows.', s: 'Select "All Rows" or clear search filter before clicking Export CSV.' }
  ];

  troubleshootingItems.forEach((item) => {
    ensureSpace(18);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, cursorY, contentWidth, 16, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(225, 29, 72); // rose red
    doc.text(item.p, margin + 4, cursorY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Root Cause: ${item.c}`, margin + 4, cursorY + 9.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 148, 136); // teal
    doc.text(`Resolution: ${item.s}`, margin + 4, cursorY + 13.5);

    cursorY += 18;
  });

  // --- 5. FREQUENTLY ASKED QUESTIONS ---
  addSectionHeading('5. Frequently Asked Questions (FAQ)', 'Operational guidelines and platform architecture');
  const faqs = [
    { q: 'What makes Generative Engine Optimization (GEO) different from traditional SEO?', a: 'Traditional SEO targets rank position #1-10 on standard search engine results pages. GEO optimizes content to be synthesized, cited, and referenced directly by AI models like ChatGPT, Perplexity, Claude, and Google Gemini.' },
    { q: 'How fast does IndexNow push pages to search engines?', a: 'IndexNow notifies Bing, Yandex, and participating search engines instantly (1-5 seconds). Indexing usually occurs within minutes to hours depending on site crawl frequency.' },
    { q: 'Do I need a Google Search Console Service Account to use Google Indexing API?', a: 'Yes. For automated Google indexing pings, you need a Service Account JSON key added as an Owner inside Google Search Console property settings.' },
    { q: 'What is the Intelligent Proxy Auto-Rotate Shield?', a: 'The shield monitors outbound worker requests. If a proxy receives 429, 503, or 3 consecutive 403 Forbidden errors, the system rotates to the next healthy node and temporarily isolates the blocked proxy for 10 minutes.' }
  ];

  faqs.forEach(f => {
    ensureSpace(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(`Q: ${f.q}`, margin, cursorY);
    cursorY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const aLines = doc.splitTextToSize(`A: ${f.a}`, contentWidth);
    doc.text(aLines, margin, cursorY);
    cursorY += aLines.length * 4.2 + 4;
  });

  // --- 6. 14-PHASE AUTONOMOUS AUDITOR & REMEDIATION ENGINE ---
  addSectionHeading('6. 14-Phase Autonomous Auditor & Conversion Engineer', 'Agentic diagnostics, content drift repair & semantic schema injection');
  addParagraph('The 14-Phase Autonomous Auditor executes a multi-vector scan across discovery, technical performance, TF-IDF density, competitor gap radar, UX clarity, and semantic JSON-LD entity graphs. It generates code-level fixes and streams verified URLs directly into the indexing pipeline.');
  addBullet('Diagnostic & Discovery (Phases 1-4)', 'Crawls orphan links, evaluates Core Web Vitals, measures topical density, and benchmarks against competitor SERP blueprints.');
  addBullet('Remediation & UX Drift (Phases 5-10)', 'Constructs entity graphs, audits heading hierarchy, repairs PageRank silos, injects JSON-LD, and eliminates cognitive conversion friction.');
  addBullet('Action Matrix & Protocol Push (Phases 11-14)', 'Ranks defects by traffic ROI, generates copy-paste HTML patches, tracks SQLite scorecards, and triggers instant Google API & IndexNow dispatch.');
  addBullet('BullMQ Queue Priority & 80/20 Concurrency Split', 'P0 enterprise submissions receive dedicated 80% concurrency while P2 historical re-indexing tasks run throttled in the background.');

  // --- 7. DEVELOPER API & WEBHOOK REFERENCE ---
  addSectionHeading('7. Developer API & REST Endpoints', 'Programmatic access for CI/CD pipelines and external integrations');
  addBullet('POST /api/submissions', 'Payload: { targetUrls: string[], features: {...}, concurrencyLimit: number } — Launches background indexing task.');
  addBullet('GET /api/health/integrations', 'Returns live connectivity and latency metrics for Google API, IndexNow, SERP pings, and proxy nodes.');
  addBullet('POST /api/grade-content', 'Payload: { url: string, keyword: string } — Executes multi-vector GEO evaluation and JSON-LD generator.');
  addBullet('GET /api/proxy-health', 'Returns 24-hour latency and success rate telemetry matrix across all configured proxy servers.');

  // Render header/footer across all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Draw footer page count
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 145, 160);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 14, pageHeight - 9);
  }

  return doc;
}
