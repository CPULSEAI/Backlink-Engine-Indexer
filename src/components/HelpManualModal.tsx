import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  Zap,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Globe,
  Radio,
  BarChart2,
  Terminal,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  PlayCircle
} from 'lucide-react';

interface HelpManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWizard: () => void;
  onOpenSettings?: () => void;
  onOpenDomainProfiler?: () => void;
  onOpenAudit?: () => void;
  onOpenGeoBlueprint?: () => void;
}

export const HelpManualModal: React.FC<HelpManualModalProps> = ({
  isOpen,
  onClose,
  onOpenWizard,
  onOpenSettings,
  onOpenDomainProfiler,
  onOpenAudit,
  onOpenGeoBlueprint
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'intro'
    | 'quickstart'
    | 'interface'
    | 'features'
    | 'workflows'
    | 'settings'
    | 'troubleshooting'
    | 'faq'
    | 'advanced'
    | 'glossary'
  >('intro');

  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  // 22 Detailed Troubleshooting Items
  const troubleshootingItems = [
    { problem: 'IndexNow 403 Forbidden Error', cause: 'Invalid or missing IndexNow API Key file hosted at root domain.', solution: 'Verify key in Settings Modal and ensure the key text file matches host key hash.' },
    { problem: 'Google Indexing API Permission Denied (403)', cause: 'Service account JSON key lacks Owner/Editor permission in Google Search Console.', solution: 'Add your service account email as Owner inside Search Console property settings.' },
    { problem: 'Backlink Verification Timeout', cause: 'Target website blocking automated user-agent or response time > 6000ms.', solution: 'Enable High-Anonymity Proxies in Settings or adjust thread delay.' },
    { problem: 'Gemini API Credit Exceeded (429)', cause: 'Prepayment quota or free tier rate limits reached on Google Gemini API.', solution: 'System automatically falls back to offline heuristic scoring engine. Add fresh key in Settings if needed.' },
    { problem: 'Proxy Connection Failure', cause: 'Proxy host/port unreachable or requires username/password auth.', solution: 'Test proxy string in Settings. Format: http://user:pass@ip:port.' },
    { problem: 'WebSocket Disconnected Status', cause: 'Temporary container network blip or browser sleeping in background tab.', solution: 'Click reconnect status icon or refresh page. Server state remains safe.' },
    { problem: 'Keyword Gap Radar Empty Chart', cause: 'Domains entered do not have enough indexable keyword data.', solution: 'Click "Recalculate Radar Data" or ensure valid top-level domain syntax (e.g., brand.com).' },
    { problem: 'Content Grader Page Fetch AbortError', cause: 'Target URL timed out after 6 seconds or strictly blocks server-side scraping.', solution: 'The system uses fallback URL structure and meta heuristics. Ensure public accessibility.' },
    { problem: 'Webhook Notification Not Firing', cause: 'Webhook endpoint URL misconfigured or returning non-200 HTTP code.', solution: 'Send test payload in Settings Modal and check server response logs.' },
    { problem: 'SEO Audit Crawler Stuck at 0%', cause: 'Robots.txt on target domain strictly disallows bot crawling.', solution: 'Use custom user-agent string or bypass robots check in Domain Audit parameters.' },
    { problem: 'Scheduled Crawl Not Running', cause: 'Browser localStorage session cleared or server restart occurred.', solution: 'Re-activate schedule inside Domain Profiler modal. Schedule persists in SQLite/file store.' },
    { problem: 'SSL Certificate Warning in Domain Profiler', cause: 'Target domain SSL chain incomplete or expired.', solution: 'Verify domain HTTPS configuration or run full technical audit for SSL details.' },
    { problem: 'Batch File Upload Parse Failure', cause: 'CSV or TXT file formatted with invalid delimiters or missing header.', solution: 'Format file with one URL per line or standard header "url,anchor,target".' },
    { problem: 'Recharts Rendering Distortion', cause: 'Window resize occurred during graph render.', solution: 'Click chart mode toggles (Line/Area/Heatmap) to trigger instant clean re-render.' },
    { problem: 'Duplicate Submissions Flagged', cause: 'Identical URL submitted within the 24-hour indexing cooldown window.', solution: 'Toggle "Force Re-Index" checkbox in Smart Batcher configuration.' },
    { problem: 'High Failure Rate in Indexing Pings', cause: 'Engine endpoints unreachable or ISP rate-limiting outbound pings.', solution: 'Switch protocol pings to IndexNow protocol and decrease thread count.' },
    { problem: 'Missing Schema Markup in GEO Grade', cause: 'Target page lacks JSON-LD or Microdata structured tags.', solution: 'Use the "Generate GEO JSON-LD Schema" button inside Content Grader to generate ready code.' },
    { problem: 'Database Persistence Reset', cause: 'Local browser cache wiped or server temporary storage purged.', solution: 'Export historical database via SQL.js export tool prior to major browser updates.' },
    { problem: 'Rate Limit Throttling on Bing Ping', cause: 'Exceeded 10,000 URLs per day IndexNow quota.', solution: 'Batch URLs across multiple site host keys or schedule weekly drip indexing.' },
    { problem: 'Competitor Score Delta Discrepancy', cause: 'Different benchmark modes selected (Solo vs 3-Way Comparative).', solution: 'Toggle benchmark view mode top right in Keyword Gap Radar component.' },
    { problem: 'Export CSV Empty Output', cause: 'No submission rows selected or active filter hides all rows.', solution: 'Select "All Rows" or clear search filter before clicking Export CSV.' },
    { problem: 'CORS Blocked on External URL Crawl', cause: 'Client-side fetch restricted by target server CORS headers.', solution: 'All crawls are routed safely through our Express backend proxy at `/api/fetch-page`.' }
  ];

  const filteredTroubleshooting = troubleshootingItems.filter(
    (item) =>
      item.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.solution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const faqs = [
    {
      q: 'What makes Generative Engine Optimization (GEO) different from traditional SEO?',
      a: 'Traditional SEO focuses on rank position #1-10 on standard search engine results pages (SERPs). GEO optimizes content to be cited, referenced, and synthesized by AI models like ChatGPT, Perplexity, Claude, and Google Gemini during natural language answers.'
    },
    {
      q: 'How fast does IndexNow push pages to search engines?',
      a: 'IndexNow notifies Bing, Yandex, and participating search engines instantly (typically within 1 to 5 seconds). Indexing usually occurs within minutes to a few hours depending on site authority.'
    },
    {
      q: 'Do I need a Google Search Console Service Account to use Google Indexing API?',
      a: 'Yes, for automated Google indexing pings, you need a Service Account JSON key added as an Owner inside Google Search Console. Instructions are in the Settings Modal.'
    },
    {
      q: 'What happens if the Gemini API key runs out of credits?',
      a: 'Our platform features an intelligent offline fallback engine. If Gemini API returns a 429 quota error, our heuristic algorithm automatically evaluates readability, term frequencies, EEAT signals, and structured schema.'
    },
    {
      q: 'How does the 3-Way Competitor Keyword Gap Radar work?',
      a: 'The radar maps your domain’s visibility across high-value search intent clusters against your top two competitors and an industry average baseline, highlighting immediate content expansion gaps.'
    },
    {
      q: 'Can I schedule automated weekly domain audits?',
      a: 'Yes! Inside the SEO Domain Profiler, you can set daily, weekly, or monthly scheduled crawls. Results are automatically saved to historical trend analysis.'
    }
  ];

  const tabs = [
    { id: 'intro', label: '1. Introduction', icon: BookOpen },
    { id: 'quickstart', label: '2. Quick Start', icon: Zap },
    { id: 'interface', label: '3. Interface', icon: Layers },
    { id: 'features', label: '4. Features', icon: Sparkles },
    { id: 'workflows', label: '5. Workflows', icon: PlayCircle },
    { id: 'settings', label: '6. Settings', icon: Sliders },
    { id: 'troubleshooting', label: '7. Troubleshooting', icon: ShieldAlert },
    { id: 'faq', label: '8. FAQ', icon: HelpCircle },
    { id: 'advanced', label: '9. Advanced', icon: Terminal },
    { id: 'glossary', label: '10. Glossary', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>Platform Help Manual &amp; Documentation</span>
                <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-bold">
                  v2.4
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Complete guide to Generative Engine Optimization, Indexing Pipeline &amp; GEO Gap Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose();
                onOpenWizard();
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Guided Onboarding Wizard</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Split Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Navigation */}
          <div className="w-56 bg-zinc-950/90 border-r border-zinc-800/80 p-3 flex flex-col space-y-1 shrink-0 overflow-y-auto font-mono text-xs">
            <div className="text-[10px] uppercase font-bold text-zinc-500 px-3 pt-2 pb-1 tracking-wider">
              Manual Sections
            </div>

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}

            <div className="pt-4 border-t border-zinc-800/80 mt-auto space-y-2">
              <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                <p className="text-[11px] text-zinc-300 font-sans font-medium">Need immediate onboarding?</p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenWizard();
                  }}
                  className="w-full text-center py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 rounded-lg text-xs font-bold transition-all"
                >
                  Restart Tour
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-zinc-950 text-zinc-200 leading-relaxed font-sans text-sm">

            {/* 1. INTRODUCTION */}
            {activeTab === 'intro' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-400" />
                    <span>1. Introduction &amp; Platform Architecture</span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Welcome to the Next-Generation GEO SEO Engine, Automated Backlink Indexer &amp; Keyword Gap Radar.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-indigo-300 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-indigo-400" /> What the Application Does
                    </h4>
                    <p className="text-xs text-zinc-300 leading-normal">
                      Combines instant protocol submission APIs (IndexNow, Google Indexing API, Bing Ping), 3-way competitive keyword gap radar, real-time AI Content Grading for Generative Engine Optimization (GEO), and 30-day backlink success rate analytics.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Benefits
                    </h4>
                    <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                      <li>Instant indexing notification in &lt; 5 seconds via IndexNow</li>
                      <li>Generative AI Search Engine visibility (ChatGPT, Perplexity, Gemini)</li>
                      <li>30-day backlink verification and outreach conversion tracking</li>
                      <li>Automated weekly technical SEO domain audits</li>
                    </ul>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-indigo-950/40 to-cyan-950/40 border border-indigo-500/30 rounded-xl space-y-3">
                  <h4 className="font-bold text-white text-base">Target Audience &amp; Typical Use Cases</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800">
                      <strong className="text-cyan-300 block mb-1">SEO Agencies</strong>
                      Manage multi-site client indexing, backlink verification, and deliver white-label PDF/CSV reports.
                    </div>
                    <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800">
                      <strong className="text-indigo-300 block mb-1">In-House Marketers</strong>
                      Grade new blog content before publishing to ensure maximum Perplexity &amp; ChatGPT citation probability.
                    </div>
                    <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800">
                      <strong className="text-emerald-300 block mb-1">Content Strategists</strong>
                      Map keyword gaps against top competitors using radar charts to spot missing high-intent topics.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. QUICK START GUIDE */}
            {activeTab === 'quickstart' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Zap className="w-6 h-6 text-emerald-400" />
                    <span>2. Quick Start Guide (5 Minutes to First Indexing)</span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Follow these step-by-step instructions to initialize your workspace and launch your first crawl.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      step: 'Step 1: Configure Indexing Credentials',
                      desc: 'Click the Settings gear icon in the top header. Add your IndexNow key and paste your Google Search Console Service Account JSON key if automated Google Indexing is desired.',
                      action: 'Open Settings',
                      onClick: onOpenSettings
                    },
                    {
                      step: 'Step 2: Enter Domain or Batch Upload URLs',
                      desc: 'Paste single or batch target URLs into the Smart URL Batcher input box on the main dashboard. Supports plain text or CSV format.',
                      action: null
                    },
                    {
                      step: 'Step 3: Run GEO Domain Profiler',
                      desc: 'Click "Domain Profiler" in the top header bar to inspect domain authority metrics, crawl depth, SSL health, and backlink baseline.',
                      action: 'Launch Profiler',
                      onClick: onOpenDomainProfiler
                    },
                    {
                      step: 'Step 4: Execute Submission & Monitor Live Pings',
                      desc: 'Click "Start Smart Submission Process". Watch the live WebSocket progress bar execute protocol pings and verify backlinks in real time.',
                      action: null
                    },
                    {
                      step: 'Step 5: Review Keyword Gap Radar & Grade Pages',
                      desc: 'Examine the Keyword Gap Radar component. Click "Grade & Optimize" on any cluster gap to launch the AI Content Grader modal.',
                      action: null
                    }
                  ].map((s, idx) => (
                    <div key={idx} className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">{s.step}</span>
                        <p className="text-xs text-zinc-300 leading-relaxed">{s.desc}</p>
                      </div>
                      {s.action && s.onClick && (
                        <button
                          onClick={() => {
                            onClose();
                            s.onClick!();
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shrink-0 transition-all shadow-md shadow-indigo-600/20"
                        >
                          {s.action}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. INTERFACE OVERVIEW */}
            {activeTab === 'interface' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-6 h-6 text-cyan-400" />
                    <span>3. Interface &amp; Navigation Overview</span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    An overview of the Bento Grid dashboard sections, header tools, and interactive controls.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Top Header Control Bar
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Provides quick access to WebSocket connection status, SEO Domain Profiler, GEO Blueprint Generator, Technical SEO Crawler, Directory Network counter, Submission History drawer, and Settings modal.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Smart URL Batcher &amp; Input Form
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Central control box for submitting target pages, choosing directory categories, setting thread concurrency, and toggling IndexNow / Ping engine parameters.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Keyword Gap Radar Component
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Interactive Recharts radar visualization displaying your domain’s visibility scores against top competitors across intent categories with a toggle for Solo vs 3-Way Comparative modes.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span> 30-Day Backlink Analytics Dashboard
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Features a Recharts Line Chart visualizing the 30-day confirmed backlink success rate (%), alongside Area, Bar, Heatmap views, and AI Citation Monitoring tab.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. FEATURE DOCUMENTATION */}
            {activeTab === 'features' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    <span>4. Feature Documentation &amp; Best Practices</span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Deep dive into each primary component, best practices, real-world examples, and pitfalls to avoid.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Feature 1 */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-indigo-300 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-indigo-400" />
                        <span>Indexing Pipeline &amp; Multi-Engine Ping</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                        Core Module
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <strong className="text-zinc-200 block mb-1">Purpose</strong>
                        Automates submission of fresh web pages directly to IndexNow endpoints, Google Search Console API, and Bing ping protocol with live backlink verification.
                      </div>
                      <div>
                        <strong className="text-emerald-300 block mb-1">Best Practices</strong>
                        Set thread delay to 200–500ms to avoid endpoint throttling. Keep IndexNow API key file active at your root domain (`/indexnow.txt`).
                      </div>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-cyan-400" />
                        <span>Keyword Gap Radar &amp; GEO Intent Clusters</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">
                        Analytics
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <strong className="text-zinc-200 block mb-1">Purpose</strong>
                        Evaluates topic visibility across Commercial, Informational, Transactional, and GEO Focus clusters, comparing your domain against competitors.
                      </div>
                      <div>
                        <strong className="text-emerald-300 block mb-1">Best Practices</strong>
                        Toggle between "My Domain Focus" and "3-Way Competitor Benchmark" to isolate critical delta deficits before planning content updates.
                      </div>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>AI Content Grader &amp; GEO Optimizer</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                        AI Engine
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <strong className="text-zinc-200 block mb-1">Purpose</strong>
                        Scrapes and grades web content for AI answer engines (ChatGPT, Perplexity, Gemini). Generates structured JSON-LD Schema markup.
                      </div>
                      <div>
                        <strong className="text-emerald-300 block mb-1">Best Practices</strong>
                        Aim for a Citation Likelihood score of &gt; 80%. Include clear bullet points, quantitative facts, and JSON-LD schema on all landing pages.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. WORKFLOW EXAMPLES */}
            {activeTab === 'workflows' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <PlayCircle className="w-6 h-6 text-indigo-400" />
                    <span>5. End-to-End Workflow Examples</span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Real-world step-by-step goals to achieve maximum search engine performance.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Workflow 1: Indexing a Fresh Blog Post in &lt; 60s</span>
                    <ol className="list-decimal list-inside text-xs text-zinc-300 space-y-1 pl-1">
                      <li>Paste new blog post URL into the Smart URL Batcher.</li>
                      <li>Select "General High-DA Directory" network category.</li>
                      <li>Click "Start Smart Submission Process".</li>
                      <li><strong>Expected Result:</strong> IndexNow return HTTP 200/202, Google API ping dispatched, and backlink recorded in Results Table.</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Workflow 2: Closing Competitor Keyword Gaps</span>
                    <ol className="list-decimal list-inside text-xs text-zinc-300 space-y-1 pl-1">
                      <li>In Keyword Gap Radar, enter your domain and 2 key competitors.</li>
                      <li>Identify clusters with "High Gap" or negative delta.</li>
                      <li>Click "Grade &amp; Optimize" on the gap item to launch Content Grader.</li>
                      <li>Generate GEO JSON-LD schema code and apply recommended content edits.</li>
                      <li><strong>Expected Result:</strong> Radar score increases by 15–25% on next calculation cycle.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SETTINGS & PREFERENCES */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sliders className="w-6 h-6 text-amber-400" />
                    <span>6. Settings &amp; Configuration Options</span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Manage API keys, proxies, webhooks, database persistence, and default submission parameters.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                    <strong className="text-indigo-300 block text-sm">IndexNow Key Hash</strong>
                    <p className="text-zinc-300">32-character hexadecimal key used for authenticating protocol pings with Bing and Yandex.</p>
                  </div>
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                    <strong className="text-cyan-300 block text-sm">Google Service Account JSON</strong>
                    <p className="text-zinc-300">Service account credentials for Google Search Console OAuth indexing endpoints.</p>
                  </div>
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                    <strong className="text-emerald-300 block text-sm">Webhook Endpoints</strong>
                    <p className="text-zinc-300">Receive real-time JSON callbacks for Slack/Discord when indexing pings finish.</p>
                  </div>
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                    <strong className="text-purple-300 block text-sm">High-Anonymity Proxies</strong>
                    <p className="text-zinc-300">Rotate HTTP/HTTPS proxies during backlink verification to bypass rate limits.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenSettings) onOpenSettings();
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-600/20 transition-all"
                  >
                    Open Settings Configuration Panel
                  </button>
                </div>
              </div>
            )}

            {/* 7. TROUBLESHOOTING TABLE (22+ Items) */}
            {activeTab === 'troubleshooting' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="w-6 h-6 text-rose-400" />
                      <span>7. Troubleshooting Guide (22 Resolved Issues)</span>
                    </h3>
                    <p className="text-zinc-400 text-sm mt-1">
                      Search common warning codes, error messages, and immediate resolution steps.
                    </p>
                  </div>

                  {/* Filter Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter issue or error..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto border border-zinc-800 rounded-xl">
                  <table className="w-full text-left text-xs text-zinc-300 font-mono">
                    <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="px-4 py-3">Problem / Symptom</th>
                        <th className="px-4 py-3">Likely Cause</th>
                        <th className="px-4 py-3">Solution / Fix</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 bg-zinc-950/60">
                      {filteredTroubleshooting.length > 0 ? (
                        filteredTroubleshooting.map((item, idx) => (
                          <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                            <td className="px-4 py-3 font-bold text-rose-300">{item.problem}</td>
                            <td className="px-4 py-3 text-zinc-400">{item.cause}</td>
                            <td className="px-4 py-3 text-emerald-400">{item.solution}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-4 py-6 text-center text-zinc-500 font-sans">
                            No matching problems found for "{searchQuery}".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 8. FAQ */}
            {activeTab === 'faq' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-cyan-400" />
                    <span>8. Frequently Asked Questions (FAQ)</span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Answers to common questions about Generative Engine Optimization, Indexing, and Analytics.
                  </p>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="border border-zinc-800 bg-zinc-900/60 rounded-xl overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full px-4 py-3 text-left font-bold text-zinc-200 flex items-center justify-between hover:text-indigo-300 text-xs sm:text-sm"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-indigo-400' : 'text-zinc-500'}`} />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs text-zinc-400 border-t border-zinc-800/80 bg-zinc-950/40 leading-relaxed font-sans">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 9. ADVANCED FEATURES */}
            {activeTab === 'advanced' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Terminal className="w-6 h-6 text-indigo-400" />
                    <span>9. Power User Tools &amp; Advanced Automation</span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Keyboard shortcuts, SQLite queries, proxy rotation, and scheduled crawl webhooks.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <strong className="text-indigo-300 block text-sm font-sans font-bold">SQL.js In-Browser Database</strong>
                    <p className="text-zinc-400 font-sans">All historical indexing logs and crawls are stored in an in-memory SQLite database (`sql.js`). Run custom SQL queries inside the History Drawer.</p>
                  </div>

                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <strong className="text-cyan-300 block text-sm font-sans font-bold">Scheduled Automated Crawls</strong>
                    <p className="text-zinc-400 font-sans">Set daily or weekly cron schedules inside the SEO Domain Profiler. Results automatically update the 30-Day Backlink Analytics Line Chart.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 10. GLOSSARY */}
            {activeTab === 'glossary' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-emerald-400" />
                    <span>10. Terminology &amp; SEO Glossary</span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Key definitions and technical concepts used throughout the platform.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { term: 'Generative Engine Optimization (GEO)', def: 'Optimizing web content to be selected and cited as a source by AI search engines like Perplexity, ChatGPT, and Gemini.' },
                    { term: 'IndexNow Protocol', def: 'An open protocol that allows website owners to instantly inform search engines about recent content changes.' },
                    { term: 'Citation Likelihood', def: 'Percentage score estimating the probability that AI answer engines will cite a given web page for relevant prompts.' },
                    { term: 'EEAT Score', def: 'Google & AI Search framework assessing Experience, Expertise, Authoritativeness, and Trustworthiness.' },
                    { term: 'JSON-LD Schema', def: 'Structured data code injected into HTML head allowing search bots and LLMs to parse facts easily.' },
                    { term: 'Keyword Gap Delta', def: 'The visibility score difference between your domain and your top competitors in a specific intent cluster.' }
                  ].map((g, idx) => (
                    <div key={idx} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                      <strong className="text-indigo-300 block font-mono">{g.term}</strong>
                      <p className="text-zinc-400 leading-relaxed font-sans">{g.def}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 shrink-0 font-mono">
          <span>Documentation Edition v2.4 • GEO SEO Engine</span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                onClose();
                onOpenWizard();
              }}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <span>First-Time Wizard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
