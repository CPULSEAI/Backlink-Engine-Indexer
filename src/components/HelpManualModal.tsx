import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  PlayCircle,
  Download,
  Check,
  RefreshCw,
  Clock,
  Activity,
  Share2,
  Cpu,
  Copy,
  CheckCheck,
  Server,
  Play,
  Flame,
} from 'lucide-react';
import { generateUserManualPdf } from '../utils/generateManualPdf';
import { TechnicalSystemDocs } from './TechnicalSystemDocs';

interface ChangelogFeature {
  module: string;
  description: string;
}

interface ChangelogEntry {
  version: string;
  releaseDate: string;
  status: string;
  highlights: string[];
  features: ChangelogFeature[];
}

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
    | 'server-automation'
    | 'glossary'
    | 'changelog'
    | 'system-docs'
  >('intro');

  // Dynamic backend changelog state
  const [changelogList, setChangelogList] = useState<ChangelogEntry[]>([]);
  const [isLoadingChangelog, setIsLoadingChangelog] = useState(false);
  const [lastChangelogSync, setLastChangelogSync] = useState<string | null>(null);

  const fetchChangelog = async () => {
    setIsLoadingChangelog(true);
    try {
      const res = await axios.get('/api/changelog');
      if (res.data && res.data.changelog) {
        setChangelogList(res.data.changelog);
        setLastChangelogSync(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to fetch changelog:', err);
    } finally {
      setIsLoadingChangelog(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchChangelog();
    }
  }, [isOpen]);

  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      // Brief timeout to yield thread and render state
      await new Promise(r => setTimeout(r, 100));
      const doc = generateUserManualPdf({
        version: 'v3.0',
        generatedDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        author: 'CareerPulse AI Systems & SEO Engineering',
      });
      doc.save('SEO_GEO_Indexing_Engine_User_Manual_v3.0.pdf');
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 3000);
    } catch (err) {
      console.error('Failed to generate User Manual PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!isOpen) return null;

  // 28 Detailed Troubleshooting Items (including Retry, Bulk SEO, Schema, and LLM simulation)
  const troubleshootingItems = [
    { problem: 'IndexNow 403 Forbidden Error', cause: 'Invalid or missing IndexNow API Key file hosted at root domain.', solution: 'Verify key in Settings Modal and ensure the key text file matches host key hash.' },
    { problem: 'Google Indexing API Permission Denied (403)', cause: 'Service account JSON key lacks Owner/Editor permission in Google Search Console.', solution: 'Add your service account email as Owner inside Search Console property settings using the Google API 3-Step Wizard.' },
    { problem: 'Transient HTTP 429/503 Queue Errors', cause: 'Downstream directory or API endpoint temporarily rate-limited or congested.', solution: 'Intelligent Retry Policy automatically catches 429, 500, 502, 503, 504 and re-queues with exponential backoff delay.' },
    { problem: 'Bulk SEO Validator Canonical Mismatch', cause: 'Target URL serves a rel="canonical" tag pointing to a different domain or protocol (HTTP vs HTTPS).', solution: 'Fix server canonical headers or update URL list to point to authoritative destination before batch submission.' },
    { problem: 'Bulk SEO Validator Missing Meta Description', cause: 'Page HTML lacks <meta name="description"> or contains empty content.', solution: 'Add a 50–160 character meta description containing key search entity terms to avoid SERP snippet penalty.' },
    { problem: 'Visual Schema Generator JSON-LD Syntax Error', cause: 'Unescaped double-quotes or invalid URL format inside schema fields.', solution: 'Use the Visual Schema Generator form to auto-format, escape strings, and validate JSON-LD syntax prior to copying.' },
    { problem: 'LLM Citation Simulator Low Probability (<50%)', cause: 'Page lacks structured Q&A blocks, quantitative facts, or explicit author/source schema.', solution: 'Use the 1-Click Schema Generator in the simulator to generate FAQ and Article Schema and increase entity citation density.' },
    { problem: 'Whitelabel PDF Print Preview Blank Logo', cause: 'CORS restriction or invalid image URL provided for custom logo.', solution: 'Upload a direct PNG/SVG image or use a public HTTPS image URL in the Whitelabel Client PDF Generator.' },
    { problem: 'Backlink Verification Timeout', cause: 'Target website blocking automated user-agent or response time > 6000ms.', solution: 'Enable High-Anonymity Proxies in Settings or adjust thread delay.' },
    { problem: 'Gemini API Credit Exceeded (429)', cause: 'Prepayment quota or free tier rate limits reached on Google Gemini API.', solution: 'System automatically falls back to offline heuristic scoring engine. Add fresh key in Settings if needed.' },
    { problem: 'Proxy Connection Failure', cause: 'Proxy host/port unreachable or requires username/password auth.', solution: 'Test proxy string in Settings. Format: http://user:pass@ip:port.' },
    { problem: 'WebSocket Disconnected Status', cause: 'Temporary container network blip or browser sleeping in background tab.', solution: 'Click reconnect status icon or refresh page. Server state remains safe in SQLite WAL vault.' },
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
    { problem: 'Missing Schema Markup in GEO Grade', cause: 'Target page lacks JSON-LD or Microdata structured tags.', solution: 'Use the Visual Schema Generator modal to create FAQPage, Article, or Organization JSON-LD snippets.' },
    { problem: 'Database Persistence Reset', cause: 'Local browser cache wiped or server temporary storage purged.', solution: 'All data is stored in the persistent backend SQLite WAL database (`backlink_indexer.sqlite`).' },
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
      q: 'How does the Bulk SEO URL Validator handle 50+ URLs at once?',
      a: 'The Bulk SEO Validator uses a multi-threaded parallel crawler. It concurrently checks canonical tag accuracy, meta description lengths and presence, and H1/H2 header hierarchy integrity, allowing 1-click batch export or direct handoff to the live submission queue.'
    },
    {
      q: 'How does the Intelligent Retry Policy protect against API bans and rate limits?',
      a: 'When an endpoint returns transient HTTP error codes (408, 429, 500, 502, 503, 504), the engine automatically schedules an exponential backoff re-queue with randomized jitter. This prevents burst traffic and guarantees high overall completion rates.'
    },
    {
      q: 'How does the LLM Citation Simulator estimate citation probability?',
      a: 'The simulator runs a multi-factor parser evaluating Citation Readability, Information Density, Schema Health, Fact Anchor Counts, and Domain Authority baseline, providing an immediate diagnostic scorecard with 1-click Schema generation.'
    },
    {
      q: 'Can I whitelabel executive PDF reports with my agency branding?',
      a: 'Yes! The Whitelabel Client PDF Generator lets you upload your custom logo, customize primary and accent brand colors, configure client domain information, write executive summaries, and print or export styled PDF reports.'
    },
    {
      q: 'How fast does IndexNow push pages to search engines?',
      a: 'IndexNow notifies Bing, Yandex, and participating search engines instantly (typically within 1 to 5 seconds). Indexing usually occurs within minutes to a few hours depending on site authority.'
    },
    {
      q: 'Do I need a Google Search Console Service Account to use Google Indexing API?',
      a: 'Yes, for automated Google indexing pings, you need a Service Account JSON key added as an Owner inside Google Search Console. Use the Google API 3-Step Setup Wizard for quick verification.'
    },
    {
      q: 'What happens if the Gemini API key runs out of credits?',
      a: 'Our platform features an intelligent offline fallback engine. If Gemini API returns a 429 quota error, our heuristic algorithm automatically evaluates readability, term frequencies, EEAT signals, and structured schema.'
    },
    {
      q: 'How does the 3-Way Competitor Keyword Gap Radar work?',
      a: 'The radar maps your domain’s visibility across high-value search intent clusters against your top two competitors and an industry average baseline, highlighting immediate content expansion gaps.'
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
    { id: 'server-automation', label: '10. Server-Side Automation (Cron)', icon: Server },
    { id: 'glossary', label: '11. Glossary', icon: FileText },
    { id: 'changelog', label: '12. Live Updates & Changelog', icon: Activity },
    { id: 'system-docs', label: '13. Master System Architecture & Future Analysis', icon: Cpu },
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
                  v3.0 (2026 Enterprise Edition)
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Complete guide to GEO Indexing, Bulk SEO Validator, Intelligent Retry Policy, Visual Schema &amp; Whitelabel Reports
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
              title="Download full printable PDF manual with 22 troubleshooting diagnostics & architecture guide"
            >
              {pdfDownloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>PDF Downloaded</span>
                </>
              ) : isGeneratingPdf ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Manual</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenWizard();
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Guided Onboarding Wizard</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all cursor-pointer"
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
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full text-center py-2 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export PDF Doc</span>
              </button>

              <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                <p className="text-[11px] text-zinc-300 font-sans font-medium">Need immediate onboarding?</p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenWizard();
                  }}
                  className="w-full text-center py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 rounded-lg text-xs font-bold transition-all cursor-pointer"
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
                    Exhaustive architecture and layout guide for the Bento Grid dashboard, top control bar, sidebar switcher, modal studios, and live telemetry consoles.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Top Header Control Bar
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Hosts real-time WebSocket connection state, Quick-Launcher buttons for SEO Domain Profiler, GEO Blueprint Generator, Technical SEO Crawler, Peer Network status, History Drawer, and Settings Modal.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Smart URL Batcher &amp; Input Console
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Central submission cockpit supporting single/multi URL entry, CSV/TXT batch drag-and-drop, category selector, worker thread concurrency slider (1–10), and multi-engine toggle switches.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Live Operations &amp; Real-Time Terminal
                    </h4>
                    <p className="text-xs text-zinc-300">
                      WebSocket-driven telemetry terminal rendering streaming HTTP response codes, latency timestamps, retry status indicators, log level filters (Error, Success, Info), and quick-copy backlink shortcuts.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span> 30-Day Backlink Analytics Dashboard
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Interactive Recharts suite visualizing 30-day verified backlink success percentages, velocity curves across Line, Area, Bar, and Heatmap views, plus AI Citation Monitoring telemetry.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Keyword Gap Radar Component
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Multi-axis radar comparing domain search visibility across Commercial, Informational, Transactional, Navigational, and GEO AI clusters with Solo vs 3-Way Competitor delta benchmarking.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Bulk SEO URL Validator Studio
                    </h4>
                    <p className="text-xs text-zinc-300">
                      High-throughput parallel scanner validating 50+ URLs simultaneously for canonical alignment, meta description health, H1/H2 hierarchy integrity, OpenGraph tags, and 1-click batch submission handoff.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span> Visual Schema Generator Studio
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Visual builder generating syntactically validated FAQPage, Article, Organization, and LocalBusiness JSON-LD markup with real-time Google search rich snippet previews and copy shortcuts.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span> Whitelabel Client PDF Generator
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Enterprise agency reporting suite with custom logo upload, brand hex color theming, client domain metrics, executive commentary, and interactive print preview for high-resolution PDF exports.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span> XML Sitemap Audit Center
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Deep recursive XML sitemap parser uncovering 404 broken URLs, redirect chains, missing meta descriptions, and non-canonical pages with 1-click push to the indexing submission queue.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-teal-400"></span> API Health Monitor &amp; Diagnostics
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Monitors endpoint latency and availability across Google Indexing API, IndexNow, Ping nodes, and SQLite vault with automated browser desktop alerts when health drops below 80% SLA.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. FEATURE DOCUMENTATION & BEST PRACTICES */}
            {activeTab === 'features' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    <span>4. Feature Documentation &amp; Granular Operations Reference</span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Every feature of the application is documented with equal granular detail, architectural depth, operational controls, and best practices.
                  </p>
                </div>

                <div className="space-y-6">

                  {/* Feature 1: Indexing Pipeline & Multi-Engine Ping Engine */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-indigo-300 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-indigo-400" />
                        <span>1. Indexing Pipeline &amp; Multi-Engine Ping Engine</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                        Core Engine
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Dispatches target URLs directly to search engine discovery endpoints via IndexNow (Bing/Yandex), Google Indexing API v3 (REST OAuth2), and legacy RPC Ping servers. Submissions trigger automated backlink placement across verified directory nodes with live confirmation checks.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Supports 1–10 worker thread concurrency, target category routing, automated high-anonymity proxy rotation, custom user-agent spoofing, and customizable request delay buffers (100–2000ms).
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Maintain thread concurrency between 3–5 workers during peak hours. Verify that your root-level IndexNow key file (`/indexnow.txt`) is reachable prior to executing large batch runs.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Generates confirmed live backlink URLs, HTTP 200/202 protocol confirmation receipts, indexing timestamps, and persistent SQLite WAL audit records.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 2: Live Operations Center & Real-Time Terminal */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>2. Live Operations Center &amp; Real-Time Terminal</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                        Real-Time Telemetry
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Maintains persistent bi-directional WebSocket streaming (`/ws`) providing real-time telemetry of worker queue executions, live HTTP status codes, latency timestamps, and automated job cancellation/pause signals.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Includes interactive log severity filters (All, Error, Success, Info), one-click clipboard copy for active backlink URLs, terminal autoscroll lock, and instant job cancellation triggers.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Monitor error log filters for consecutive 403/429 spikes. If downstream endpoints throttle requests, pause the job and enable proxy rotation in Settings.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Outputs real-time completion percentages, confirmed vs total task ratios, millisecond execution latencies, and exportable raw JSON session logs.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 3: 30-Day Backlink Analytics Dashboard & Visualizer */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-purple-300 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-purple-400" />
                        <span>3. 30-Day Backlink Analytics Dashboard &amp; Visualizer</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
                        Analytics &amp; Growth
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Aggregates 30-day historical submission logs from SQLite into interactive Recharts visualizations, computing rolling success percentages, link velocity curves, and AI Citation monitoring trends.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Provides 4 distinct chart projection modes (Line, Area, Bar, Activity Heatmap), customizable time range horizons, and separate AI Citation Monitoring telemetry tabs.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Review weekly velocity patterns to detect directory unpublishing or link drops. Maintain a rolling 30-day confirmation rate above 85% for healthy domain authority growth.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Delivers daily confirmation percentages, total indexed URL counts, velocity acceleration ratios, and CSV/JSON chart data exports.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 4: Keyword Gap Radar & 3-Way GEO Intent Clusters */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span>4. Keyword Gap Radar &amp; 3-Way GEO Intent Clusters</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">
                        Competitive Intelligence
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Constructs a multi-axis Recharts Radar mapping search intent coverage across Commercial, Informational, Transactional, Navigational, and GEO AI clusters, benchmarking your domain against two competitors.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Supports Solo vs 3-Way Comparative benchmarking, custom competitor domain inputs, gap delta score calculators, and 1-click handoff to the AI Content Grader.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Prioritize content production in clusters where competitor delta exceeds -15 points. Re-run radar calculations after publishing new landing pages to track parity recovery.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Generates cluster visibility index scores (0–100), net deficit delta percentages, competitor comparative tables, and topic expansion recommendations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 5: AI Content Grader & Multi-Vector GEO Optimizer */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>5. AI Content Grader &amp; Multi-Vector GEO Optimizer</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                        AI Optimization &amp; Schema
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Scrapes target URLs or analyzes pasted drafts to evaluate readiness for LLM synthesis. Computes Citation Likelihood, EEAT signals, Fact Anchor Density, and generates validated JSON-LD schema.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Accepts live URL scrapes or raw markdown drafts, targets primary and secondary keywords, features an offline heuristic fallback engine, and exports JSON-LD schema snippets.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Aim for a Citation Likelihood score &gt; 80%. Place concise, 30–50 word definitive answer summaries directly beneath H1/H2 tags and include structured numeric statistics.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Produces Citation Likelihood %, EEAT score breakdown, entity anchor density metrics, copyable JSON-LD FAQ/Article code, and targeted editorial rewrite suggestions.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 6: Bulk SEO URL Validator (50+ Parallel Crawl) */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-teal-300 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-teal-400" />
                        <span>6. Bulk SEO URL Validator (50+ Parallel Crawl)</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded border border-teal-500/20 font-bold">
                        Auditing &amp; Quality
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Executes multi-threaded parallel HTTP inspections across 50+ URLs simultaneously, parsing HTML headers for canonical mismatches, missing or short meta descriptions, and improper H1/H2 hierarchies.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Configurable crawl concurrency (1–10 threads), quick pre-flight presets, CSV/JSON export, and one-click "Send Clean URLs to Submissions" handoff to the live indexing queue.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Always run Bulk Validation prior to submitting newly generated batch URL lists to avoid wasting crawl budget on 404 broken pages or canonical loop redirects.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Delivers comprehensive URL validation tables, pass/warning/fail status tallies, character length diagnostics, and clean exportable CSV lists.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 7: Intelligent Retry Policy & Exponential Backoff Shield */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>7. Intelligent Retry Policy &amp; Exponential Backoff Shield</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                        Reliability &amp; Resilience
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Intercepts transient HTTP error codes (408 Request Timeout, 429 Rate Limited, 500 Internal Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout) and schedules re-queuing with randomized jitter backoff.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Automatic exponential formula `t = base * 2^attempt + jitter`, max retry bounds (default: 3), real-time WebSocket toast alerts (`retry_scheduled`, `retry_executed`), and proxy circuit breakers.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Leave auto-retry enabled during large batch runs. If a proxy node triggers consecutive 403 blocks, allow the system to isolate the node in cooldown rather than disabling retry policies.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Prevents pipeline aborts, elevates overall submission completion rates &gt; 97%, and logs full retry histories in SQLite.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 8: Visual Schema Generator (FAQ, Article, Org, LocalBusiness) */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-purple-300 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span>8. Visual Schema Generator (FAQ, Article, Org, LocalBusiness)</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
                        Structured Data Engine
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Provides an interactive visual form builder that translates non-technical structured inputs into valid Schema.org JSON-LD scripts with live Google Search rich snippet previews.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Supports FAQPage (dynamic Q&amp;A pairs), Article/BlogPosting (author, publisher, dates), Organization (social profiles, logo), and LocalBusiness formats with one-click clipboard copy.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Embed the generated JSON-LD snippet directly inside the `&lt;head&gt;` tag of your published page before launching indexing pings to ensure search bots parse structured entities on first crawl.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Outputs syntactically validated `&lt;script type="application/ld+json"&gt;` blocks and simulated Google Rich Card visual previews.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 9: LLM Citation Simulator & AI Diagnostic Checklist */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-blue-300 flex items-center gap-2">
                        <Radio className="w-4 h-4 text-blue-400" />
                        <span>9. LLM Citation Simulator &amp; AI Diagnostic Checklist</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20 font-bold">
                        AI Search Simulation
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Simulates natural language search queries across ChatGPT Search, Perplexity AI, Google Gemini, and Claude, calculating citation probabilities and identifying missing entity signals.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Custom query prompt simulators, multi-LLM comparative citation meters, fact anchor density counters, and integrated 1-click Schema builder launch triggers.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Ensure all four diagnostic checklist criteria pass green (Definition Snippet Present, Quantitative Data Anchors, Valid Schema Tag, High Authority Footprint) for top citation frequency.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Provides per-model citation probability percentages, fact anchor audit reports, and tailored structural recommendations for LLM discovery.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 10: Whitelabel Client PDF Report Generator */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-rose-300 flex items-center gap-2">
                        <Download className="w-4 h-4 text-rose-400" />
                        <span>10. Whitelabel Client PDF Report Generator</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20 font-bold">
                        Agency Deliverables
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Builds executive client reports using custom agency branding, dynamic color theming, domain metrics, backlink velocity curves, and customized commentary.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Agency logo upload (PNG/SVG/URL), primary and accent hex color pickers, client domain metadata, executive executive commentary textareas, and live interactive print preview.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Review formatting in the interactive Print Preview before generating final client PDF files to verify margins, charts, and executive comment flow.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Produces publication-ready high-DPI vector PDF reports formatted with custom agency branding, summary KPI tables, and charts.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 11: XML Sitemap Crawler & Technical Health Auditor */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span>11. XML Sitemap Crawler &amp; Technical Health Auditor</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">
                        Technical SEO &amp; Crawling
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Parses remote XML sitemaps and sitemap index files recursively, executing parallel health audits across discovered URLs to flag 404s, redirect chains, missing meta descriptions, and non-canonical pages.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Supports custom sitemap URLs, thread concurrency limits, broken link filters, status code aggregators, and 1-click batch submission export.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Run a sitemap audit whenever new site sections or URL structure changes are deployed. Fix all 404 broken URLs before pushing pages to search engine discovery queues.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Provides detailed URL-level status reports, broken link tallies, crawl depth metrics, and clean XML/CSV URL export lists.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 12: SEO Domain Profiler & Technical Health Crawler */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-indigo-300 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        <span>12. SEO Domain Profiler &amp; Technical Health Crawler</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                        Domain Auditing
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Performs comprehensive technical domain profiling evaluating SSL certificate validity, Core Web Vitals performance, robots.txt directives, mobile responsiveness, and schema footprint.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Automated domain crawler, scheduled cron audit intervals (Daily, Weekly), severity-ranked technical error logs, and PDF executive audit export.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Schedule weekly automated domain crawls to detect SSL certificate expirations, DNS configuration errors, or accidental disallow directives in robots.txt.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Outputs overall Technical SEO Score (0–100), SSL security diagnostics, Core Web Vitals latency timings, and prioritized remediation checklists.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 13: GEO Blueprint & AI Search Architecture Generator */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-purple-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>13. GEO Blueprint &amp; AI Search Architecture Generator</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
                        Strategic AI Architecture
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Synthesizes competitive search footprint data into a strategic architectural blueprint designed to maximize inclusion in AI overviews, ChatGPT answers, and Perplexity sources.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Entity-relationship graph visualizers, question-answer content clustering, structured schema layout recommendations, and exportable blueprint specifications.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Align your site architecture with the generated GEO Blueprint pillars to ensure topic authority and entity clarity across all major AI search assistants.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Generates structural content hierarchy maps, targeted Q&amp;A clusters, recommended JSON-LD entity graphs, and AI authority roadmaps.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 14: Smart Batch Scheduler & Cron Orchestration System */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>14. Smart Batch Scheduler &amp; Cron Orchestration System</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                        Task Automation
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Provides an enterprise recurring task orchestrator that executes automated URL submissions, sitemap audits, and proxy latency tests on timed cron expressions.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Cron schedule presets (Hourly, Daily, Weekly), manual "Run Now" execution triggers, job pause/resume controls, and persistent execution log histories.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Schedule heavy batch indexing tasks during off-peak hours (e.g., 02:00 AM UTC) to avoid peak API rate limiting and optimize network throughput.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Maintains execution timestamps, task success tallies, failure root cause logs, and automated background pipeline execution records.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 15: Traffic Generation & SERP CTR Simulation Engine */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-indigo-300 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-indigo-400" />
                        <span>15. Traffic Generation &amp; SERP CTR Simulation Engine</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                        SERP Engagement &amp; CTR
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Simulates natural organic search click-through patterns and page visits using rotating residential IP pools, realistic dwell times, scroll depths, and bounce rate controls to build positive behavioral signals.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Target keyword matching, customizable visit durations (30–180s), viewport simulation, referer header spoofing, and traffic volume throttle controls.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Gradually ramp up simulated traffic volumes over several weeks. Combine dwell times &gt; 60 seconds with internal page navigation to maintain organic behavioral profiles.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Reports simulated visits delivered, average dwell time achieved, scroll depth percentages, and positive SERP engagement metrics.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 16: High-Anonymity Proxy Pool & Auto-Rotation Health Heatmap */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-teal-300 flex items-center gap-2">
                        <Server className="w-4 h-4 text-teal-400" />
                        <span>16. High-Anonymity Proxy Pool &amp; Auto-Rotation Health Heatmap</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded border border-teal-500/20 font-bold">
                        Network Security &amp; Proxies
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Manages a distributed proxy pool with round-robin auto-rotation, latency ping monitors, and automated circuit breakers that temporarily isolate nodes receiving consecutive 403/429 errors.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          HTTP/HTTPS/SOCKS5 proxy authentication, per-node latency heatmap indicators, automated 10-minute cooldown periods, and manual diagnostic ping triggers.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Format proxy strings as `http://user:pass@ip:port`. Maintain a pool of at least 5 healthy proxy nodes to ensure continuous rotation during high-volume submissions.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Displays real-time node latency (ms), 24-hour success rate percentages, active node tallies, and isolated node cooldown timers.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 17: In-Browser SQLite Database (sql.js) & History Drawer */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-purple-300 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-purple-400" />
                        <span>17. In-Browser SQLite Database (sql.js) &amp; History Drawer</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
                        Persistence &amp; Vault
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Maintains a persistent, queryable relational SQLite database (`sql.js` in-memory and server WAL vault) storing complete historical records of submissions, crawls, and audits.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Interactive History Drawer with full-text search, custom SQL query runner, submission detail modal inspectors, and one-click database snapshot backup and restore.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Export periodic JSON workspace snapshots before performing large system migrations or clearing browser cache to ensure historic analytics records are preserved.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Provides searchable historical submission tables, SQL execution query results, and binary/JSON database backup archives.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 18: Clarity Overload & Conversion Rate Optimization (CRO) Wizard */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-rose-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-rose-400" />
                        <span>18. Clarity Overload &amp; Conversion Rate Optimization (CRO) Wizard</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20 font-bold">
                        UX &amp; CRO Diagnostics
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Analyzes landing page content density, CTA visibility, cognitive overload factors, and visual hierarchy to identify user friction points that damage conversion rates and engagement.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          URL content scraper, Cognitive Load index calculator, Above-The-Fold CTA validator, readability scoring, and automated copywriting improvement suggestions.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Maintain a Cognitive Load score &lt; 35%. Place clear value proposition headings and primary call-to-action buttons within the top 500px viewport of all key landing pages.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Outputs Overall Clarity Score (0–100), CTA prominence score, cognitive friction warning list, and step-by-step conversion enhancement suggestions.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 19: Instant Indexation Multi-Protocol Gateway */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-indigo-300 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-indigo-400" />
                        <span>19. Instant Indexation Multi-Protocol Gateway</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                        Protocol Aggregation
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Aggregates IndexNow API, Google Search Console Indexing API v3, and search engine RSS ping protocols into a unified, zero-latency parallel dispatch gateway.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          One-click protocol toggle controls, batch payload aggregation, automated protocol selection based on target domain authority, and detailed transmission receipts.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Enable both IndexNow and Google API protocols simultaneously on critical pages to ensure comprehensive coverage across both Bing/Yandex and Google search ecosystems.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Provides transmission confirmation receipts, HTTP status codes per protocol, response latency metrics, and instant indexation tracking records.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 20: Bulk Backlink Counter & External Citation Auditor */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-teal-300 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-teal-400" />
                        <span>20. Bulk Backlink Counter &amp; External Citation Auditor</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded border border-teal-500/20 font-bold">
                        Link Intelligence
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Audits external referring domains, counts active dofollow vs nofollow backlink signals, and calculates link velocity across submitted target URLs.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Batch domain input scanner, dofollow/nofollow ratio calculator, referring IP distribution metrics, and CSV citation export capabilities.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Aim for a healthy, natural link profile with 60–80% dofollow ratio and a diverse spread of high-DA referring domains across varied C-class IP subnets.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Delivers total backlink counts, referring domain metrics, dofollow/nofollow percentage breakdowns, and exportable link profile audit logs.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 21: API Health Monitor & Diagnostics Center */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-400" />
                        <span>21. API Health Monitor &amp; Diagnostics Center</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                        Telemetry &amp; Alerting
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Provides continuous real-time diagnostic polling across all integrated services (Google Indexing API, IndexNow endpoints, RPC Ping nodes, SQLite WAL database, and Proxy networks).
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Overall API Health percentage calculation (0–100%), per-service latency meters, manual health refresh triggers, and automated browser desktop notifications when health drops below 80% SLA.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Grant browser notification permissions when prompted to receive instant background desktop alerts if upstream search engine APIs or proxies experience temporary degradation.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Outputs real-time service health scores, endpoint latency milliseconds, connectivity state indicators, and desktop diagnostic alert notifications.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 22: Interactive Onboarding Wizard & Wizards Hub Dashboard */}
                  <div className="p-5 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <h4 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>22. Interactive Onboarding Wizard &amp; Wizards Hub Dashboard</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                        Guidance &amp; Enablement
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-zinc-200 block font-semibold">Architecture &amp; Operational Purpose</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Offers an interactive, step-by-step guided walkthrough of the entire platform, introducing core features, providing live configuration helpers, and centralizing specialized wizard launchers.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-cyan-300 block font-semibold">Key Technical Capabilities &amp; Controls</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Multi-step tour milestone progression, direct launcher buttons for Google API Wizard, Clarity CRO Wizard, and Schema Generator, plus one-click tour restart capabilities.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-emerald-300 block font-semibold">Best Practices &amp; Operational Recommendations</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          New users should complete all 7 onboarding steps on first launch to ensure API credentials, proxy settings, and default submission parameters are optimally configured.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-300 block font-semibold">Target Deliverables &amp; Output Metrics</strong>
                        <p className="text-zinc-400 leading-relaxed">
                          Tracks onboarding completion status in persistent storage and guides users to rapid first-job completion in under 5 minutes.
                        </p>
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
                    <span>5. End-to-End Operational Workflow Guides</span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Exhaustive step-by-step operational playbooks for core indexing, gap recovery, auditing, client reporting, and headless server automation.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Workflow 1 */}
                  <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                        Workflow 1: Instant Indexing of a New Blog Post or Landing Page (&lt;60s)
                      </span>
                      <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                        Rapid Indexing
                      </span>
                    </div>
                    <ol className="list-decimal list-inside text-xs text-zinc-300 space-y-1.5 pl-1 leading-relaxed">
                      <li>Paste the published URL into the Smart URL Batcher input form on the main dashboard.</li>
                      <li>Select the appropriate directory network category matching your page niche.</li>
                      <li>Ensure IndexNow and Google Search Console Indexing API switches are toggled ON.</li>
                      <li>Set worker concurrency to 3 threads and click <strong>"Start Smart Submission Process"</strong>.</li>
                      <li><strong>Expected Result:</strong> IndexNow returns HTTP 200/202 confirmation within 5 seconds, Google Indexing ping is dispatched, and confirmed backlinks appear in the Live Results Table.</li>
                    </ol>
                  </div>

                  {/* Workflow 2 */}
                  <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        Workflow 2: Closing Competitor Keyword Gaps &amp; GEO Schema Injection
                      </span>
                      <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
                        GEO Parity
                      </span>
                    </div>
                    <ol className="list-decimal list-inside text-xs text-zinc-300 space-y-1.5 pl-1 leading-relaxed">
                      <li>Open the Keyword Gap Radar component and input your domain alongside 2 key competitors.</li>
                      <li>Identify search intent clusters where your domain has a significant negative delta score.</li>
                      <li>Click "Grade &amp; Optimize" on the deficient cluster to launch the AI Content Grader.</li>
                      <li>Generate structured JSON-LD schema (FAQPage / Article) and apply recommended 30–50 word answer-first definitions.</li>
                      <li><strong>Expected Result:</strong> Citation likelihood score climbs &gt; 80% and gap radar scores increase on next calculation cycle.</li>
                    </ol>
                  </div>

                  {/* Workflow 3 */}
                  <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        Workflow 3: Enterprise Sitemap Audit, Broken Link Remediation &amp; Batch Re-Indexing
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                        Technical SEO
                      </span>
                    </div>
                    <ol className="list-decimal list-inside text-xs text-zinc-300 space-y-1.5 pl-1 leading-relaxed">
                      <li>Launch the XML Sitemap Audit Center and enter your root sitemap URL (e.g., `https://yourdomain.com/sitemap.xml`).</li>
                      <li>Execute parallel audit crawl to discover 404 broken links, redirect loops, and missing meta descriptions.</li>
                      <li>Filter out non-200 URLs and click "Export Clean URLs to Submissions".</li>
                      <li>Launch batch submission with auto-rotating proxies to notify search engines of all validated URLs.</li>
                      <li><strong>Expected Result:</strong> Complete sitemap health is verified and crawl error rates drop to 0% in Search Console.</li>
                    </ol>
                  </div>

                  {/* Workflow 4 */}
                  <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                        Workflow 4: Client Whitelabel Deliverable Generation &amp; Agency PDF Export
                      </span>
                      <span className="text-[10px] font-mono bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20">
                        Agency Reporting
                      </span>
                    </div>
                    <ol className="list-decimal list-inside text-xs text-zinc-300 space-y-1.5 pl-1 leading-relaxed">
                      <li>Complete your target client indexing and technical audit campaigns.</li>
                      <li>Open the Whitelabel Client PDF Generator from the Reports Center or modal menu.</li>
                      <li>Upload your agency logo, configure primary/accent brand colors, and input client domain metadata.</li>
                      <li>Draft customized executive commentary highlighting indexing velocity and backlink growth.</li>
                      <li>Inspect visual alignment in the interactive Print Preview and click <strong>"Download Whitelabel PDF Report"</strong>.</li>
                      <li><strong>Expected Result:</strong> High-resolution, custom-branded executive PDF report ready for direct client delivery.</li>
                    </ol>
                  </div>

                  {/* Workflow 5 */}
                  <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                        Workflow 5: Headless Linux Cron / Python Automation for Nightly Indexing Pipelines
                      </span>
                      <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                        Headless DevOps
                      </span>
                    </div>
                    <ol className="list-decimal list-inside text-xs text-zinc-300 space-y-1.5 pl-1 leading-relaxed">
                      <li>Navigate to Tab 10 (Server-Side Automation) in this manual.</li>
                      <li>Copy the environment variable template and bash runner script into your production server workspace.</li>
                      <li>Add the cron schedule `0 2 * * * /workspace/generated/run_indexing_cron.sh` to your server crontab via `crontab -e`.</li>
                      <li>Ensure your `GOOGLE_SERVICE_ACCOUNT_JSON` is stored in the environment.</li>
                      <li><strong>Expected Result:</strong> Pipeline runs autonomously every night at 02:00 AM UTC, executing health checks, batch submissions, GEO grading, and sitemap audits with full logging.</li>
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

            {/* 10. SERVER-SIDE AUTOMATION (CRON & PYTHON PIPELINE) */}
            {activeTab === 'server-automation' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Server className="w-6 h-6 text-emerald-400" />
                      <span>10. Server-Side Automation &amp; Cron Orchestration</span>
                    </h3>
                    <p className="text-zinc-400 text-sm mt-1">
                      Automate the 4-step indexing pipeline using Linux Cron, systemd, or standalone Python orchestration with intelligent proxy rotation.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold rounded">
                    REST API v2.4 COMPLIANT
                  </span>
                </div>

                {/* 4-Step Pipeline Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1">
                    <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Step 01</div>
                    <div className="font-bold text-white text-xs">Pre-Flight Health Check</div>
                    <div className="text-[11px] font-mono text-emerald-400">GET /api/health/integrations</div>
                    <p className="text-[11px] text-zinc-400">Queries Google API, IndexNow, and SERP latency before starting heavy tasks.</p>
                  </div>

                  <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1">
                    <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Step 02</div>
                    <div className="font-bold text-white text-xs">Batch Submission Engine</div>
                    <div className="text-[11px] font-mono text-[#ff4d00]">POST /api/submissions/start</div>
                    <p className="text-[11px] text-zinc-400">Pushes target URLs with auto-rotating proxy pool and multi-worker concurrency.</p>
                  </div>

                  <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1">
                    <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Step 03</div>
                    <div className="font-bold text-white text-xs">Multi-Vector GEO Grader</div>
                    <div className="text-[11px] font-mono text-purple-400">POST /api/geo/grade</div>
                    <p className="text-[11px] text-zinc-400">Evaluates citation likelihood, information density, and structured schema.</p>
                  </div>

                  <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1">
                    <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Step 04</div>
                    <div className="font-bold text-white text-xs">XML Sitemap Audit</div>
                    <div className="text-[11px] font-mono text-cyan-400">POST /api/sitemap/audit</div>
                    <p className="text-[11px] text-zinc-400">Deep crawls sitemaps for 404 broken links, short descriptions, and canonicals.</p>
                  </div>
                </div>

                {/* Environment Variables Setup */}
                <div className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-bold text-white font-mono uppercase">1. Environment Variable Setup</h4>
                    </div>
                    <button
                      onClick={() => handleCopySnippet(`export API_BASE_URL="http://localhost:3000"
export GOOGLE_SERVICE_ACCOUNT_JSON="$(cat /path/to/service-account.json 2>/dev/null || echo '')"
export PIPELINE_TARGET_URLS="https://careerpulseai.net,https://careerpulseai.net/resume-builder"
export PIPELINE_SITEMAP_URL="https://careerpulseai.net/sitemap.xml"
export LOG_DIR="/var/log/indexing-pipeline"`, 'env-vars')}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedSnippet === 'env-vars' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet === 'env-vars' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-black border border-zinc-800 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto">
{`# Define environment variables for headless cron automation
export API_BASE_URL="http://localhost:3000"
export GOOGLE_SERVICE_ACCOUNT_JSON="$(cat /path/to/service-account.json 2>/dev/null || echo '')"
export PIPELINE_TARGET_URLS="https://careerpulseai.net,https://careerpulseai.net/resume-builder"
export PIPELINE_SITEMAP_URL="https://careerpulseai.net/sitemap.xml"
export LOG_DIR="/var/log/indexing-pipeline"`}
                  </pre>
                </div>

                {/* Bash Runner Script */}
                <div className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-sm font-bold text-white font-mono uppercase">2. Bash Cron Wrapper (run_indexing_cron.sh)</h4>
                    </div>
                    <button
                      onClick={() => handleCopySnippet(`#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
export API_BASE_URL="\${API_BASE_URL:-http://localhost:3000}"
export LOG_DIR="\${LOG_DIR:-/var/log/indexing-pipeline}"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/indexing_\$(date +'%Y%m%d_%H%M%S').log"

echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] Starting automated SEO indexing pipeline..." | tee -a "$LOG_FILE"
python3 "$SCRIPT_DIR/automated_indexing_pipeline.py" 2>&1 | tee -a "$LOG_FILE"
echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] Pipeline completed successfully." | tee -a "$LOG_FILE"`, 'bash-script')}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedSnippet === 'bash-script' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet === 'bash-script' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-black border border-zinc-800 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto">
{`# 1. Make executable
chmod +x ./generated/run_indexing_cron.sh

# 2. Test execute immediately
./generated/run_indexing_cron.sh`}
                  </pre>
                </div>

                {/* Crontab Configuration Guide */}
                <div className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-white font-mono uppercase">3. Production Crontab Schedules</h4>
                    </div>
                    <button
                      onClick={() => handleCopySnippet(`# Edit crontab
crontab -e

# Run every 6 hours (00:00, 06:00, 12:00, 18:00)
0 */6 * * * /path/to/generated/run_indexing_cron.sh >> /var/log/indexing-cron.log 2>&1

# Run daily at 02:00 AM off-peak
0 2 * * * /path/to/generated/run_indexing_cron.sh >> /var/log/indexing-cron.log 2>&1`, 'crontab-cmd')}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedSnippet === 'crontab-cmd' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet === 'crontab-cmd' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-black border border-zinc-800 rounded-lg text-xs font-mono text-amber-300 overflow-x-auto">
{`# Open crontab editor
crontab -e

# Append one of the following automated schedules:
# Option A: Run 4 times daily (every 6 hours)
0 */6 * * * /workspace/generated/run_indexing_cron.sh >> /var/log/indexing-cron.log 2>&1

# Option B: Run once every night at 02:00 AM UTC
0 2 * * * /workspace/generated/run_indexing_cron.sh >> /var/log/indexing-cron.log 2>&1`}
                  </pre>
                </div>
              </div>
            )}

            {/* 11. GLOSSARY */}
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
                    { term: 'Keyword Gap Delta', def: 'The visibility score difference between your domain and your top competitors in a specific intent cluster.' },
                    { term: 'Intelligent Retry Backoff', def: 'Exponential re-queuing policy with jitter for transient HTTP errors (408, 429, 500, 502, 503, 504).' },
                    { term: 'Bulk SEO Concurrency', def: 'Multi-worker parallel inspection of canonical tags, meta description presence, and H1/H2 header hierarchies.' }
                  ].map((g, idx) => (
                    <div key={idx} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                      <strong className="text-indigo-300 block font-mono">{g.term}</strong>
                      <p className="text-zinc-400 leading-relaxed font-sans">{g.def}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. LIVE CHANGELOG & UPDATES */}
            {activeTab === 'changelog' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Activity className="w-6 h-6 text-[#ff4d00]" />
                      <span>11. Live System Changelog &amp; Real-time Documentation</span>
                    </h3>
                    <p className="text-zinc-400 text-sm mt-1">
                      Continuously synchronized with live backend release notes, features, and enterprise updates.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {lastChangelogSync && (
                      <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Synced at {lastChangelogSync}</span>
                      </span>
                    )}
                    <button
                      onClick={fetchChangelog}
                      disabled={isLoadingChangelog}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono font-bold rounded-lg border border-zinc-700 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingChangelog ? 'animate-spin text-[#ff4d00]' : ''}`} />
                      <span>Sync Latest</span>
                    </button>
                  </div>
                </div>

                {/* Real-time Status Card */}
                <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <h4 className="text-sm font-bold text-white font-mono">AUTOMATED USER MANUAL SYNC ACTIVE</h4>
                      <p className="text-xs text-zinc-400">
                        The user manual dynamically polls the backend API to inject the latest capabilities into documentation in real-time.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold rounded">
                    DOCUMENTATION v3.1.0
                  </span>
                </div>

                {/* Changelog Entries List */}
                <div className="space-y-6">
                  {changelogList.map((entry, eIdx) => (
                    <div key={eIdx} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-0.5 bg-[#ff4d00]/20 text-[#ff4d00] border border-[#ff4d00]/40 text-xs font-mono font-bold rounded">
                            {entry.version}
                          </span>
                          <span className="text-xs text-zinc-400 font-mono">{entry.releaseDate}</span>
                        </div>
                        <span className="text-xs font-mono text-zinc-500 uppercase">{entry.status}</span>
                      </div>

                      {/* Highlights */}
                      <div>
                        <h5 className="text-xs font-bold text-zinc-300 uppercase font-mono tracking-wider mb-2">
                          Key Release Highlights
                        </h5>
                        <ul className="space-y-1.5 text-xs text-zinc-400">
                          {entry.highlights.map((hl, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Feature Modules */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {entry.features.map((feat, fIdx) => (
                          <div key={fIdx} className="bg-zinc-950/70 border border-zinc-800 p-3 rounded-lg space-y-1">
                            <strong className="text-indigo-300 text-xs font-mono block font-bold">
                              {feat.module}
                            </strong>
                            <p className="text-zinc-400 text-xs leading-relaxed">{feat.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 13: MASTER SYSTEM ARCHITECTURE & FUTURE ANALYSIS */}
            {activeTab === 'system-docs' && (
              <div className="h-full">
                <TechnicalSystemDocs />
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 shrink-0 font-mono">
          <span>Documentation Edition v3.0 (2026 Enterprise Edition) • GEO SEO Engine</span>
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
