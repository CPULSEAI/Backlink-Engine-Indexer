import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Server,
  Activity,
  Code2,
  Database,
  Globe,
  Terminal,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Search,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Key,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const TechnicalSystemDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('executive-overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    toast.success('Snippet copied to clipboard');
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = `# SEARCHPULSE AI / GEO INDEXING ENGINE — TECHNICAL USER MANUAL & SYSTEM DOCUMENTATION
Version: 3.2.0 (Enterprise Architecture Edition)
Generated: 2026-08-20

## 1. EXECUTIVE APPLICATION OVERVIEW
- Value Proposition: High-throughput SEO indexing dispatcher, verified live backlink audit engine, Generative Engine Optimization (GEO) readiness profiler, and enterprise proxy health manager.
- Target Audience: Enterprise Technical SEO Directors, Digital PR agencies, Performance Marketing Teams, and Systems Engineers.
- Architecture Summary:
  - Frontend: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, D3.js math curves, Recharts.
  - Backend: Node.js Express server with streaming SSE, proxy pool balancer, Cheerio HTML parser, and Gemini Generative AI SDK.
  - Third-Party Integrations: Google Indexing API (OAuth2 JWT), Bing IndexNow API, DataForSEO Live Crawl API, Stripe Billing & Webhooks.

## 2. VERSION HISTORY & UPDATE LOG
- v3.2.0 (2026-08-20): D3.js 30-Day Backlink Growth Trend line chart with interactive cursor hover tooltips, exact backlink/referring domain breakdown, and Master Recreator Prompt generator in System Settings.
- v3.1.0 (2026-08-15): TotalBacklinkCounter real-data integration with DataForSEO live crawl metrics, dofollow equity ratio, and anti-fabrication enforcement.
- v3.0.0 (2026-08-01): Intelligent Proxy Auto-Rotate Shield with latency testing, circuit breakers, and automatic 429/403 failover.
- v2.4.0 (2026-07-15): Visual Schema Generator supporting FAQPage, Article, Organization, Product, JobPosting JSON-LD.
- v2.0.0 (2026-06-01): Stripe Customer Billing Portal, subscription webhooks, and multi-tier access tiers.

## 3. FEATURE & FUNCTIONALITY CATALOG
- URL Indexing Engine: Batch submission to Google & Bing with concurrency limiting and proxy distribution.
- Cumulative & Bulk Backlink Counters: Real-data backlink discovery and verification.
- D3.js Backlink Growth Trend: 30-day time series tracking backlink velocity, referring domains, and dofollow ratios.
- Generative Engine Optimization (GEO) Profiler: LLM citation readiness scoring and schema auditing.
- Proxy Diagnostic Center: Live latency probing, IP pool rotation, and error interception.
- Bulk SEO Validator: On-page metadata, canonical URL tags, OpenGraph, and heading density scanner.
- Visual Schema Builder: 1-click JSON-LD generator with real-time syntax linting.
- Whitelabel Reports Center: Client-ready PDF and CSV export generator.

## 4. CODE FEATURES & CORE ARCHITECTURE
- Server Architecture: Single bundled \`dist/server.cjs\` with Vite middleware in development and static SPA serving in production.
- Concurrency & Queue: Async worker pool with p-limit and exponential backoff retry.
- Real-Data Strictness: Anti-fabrication guardrails enforcing live crawl and API verification.

## 5. UI/UX & DESIGN SYSTEM
- Color Archetype: Slate/Zinc dark aesthetic with high-contrast accents (Indigo #6366f1, Cyan #06b6d4, Emerald #10b981).
- Typography: Monospace for metric values, code blocks, and system states; Sans-serif for body typography.
- Responsiveness: Fluid container scaling with touch targets exceeding 44px on mobile devices.

## 6. SYSTEM DEPENDENCIES & ENVIRONMENT
- Node.js 18+ / 20+ Runtime.
- Key npm packages: express, @google/genai, googleapis, axios, cheerio, lucide-react, recharts, tailwindcss, react-hot-toast.
- Environment variables: GEMINI_API_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, PORT=3000.

## 7. OPTIMIZATION & FUTURE ANALYSIS FRAMEWORK
- Bottlenecks: Memory cache limits on high-volume proxy pools; rate limits on upstream search APIs.
- Next Steps: Redis distributed queue integration, WebSocket bi-directional streaming, and automated SERP diff snapshots.
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SearchPulse_AI_Technical_User_Manual_v3.2.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Technical User Manual downloaded as Markdown (.md)!');
  };

  const sections = [
    { id: 'executive-overview', title: '1. Executive Application Overview', icon: BookOpen },
    { id: 'version-history', title: '2. Version History & Update Log', icon: Activity },
    { id: 'feature-catalog', title: '3. Feature & Functionality Catalog', icon: Sparkles },
    { id: 'code-architecture', title: '4. Code Features & Core Architecture', icon: Code2 },
    { id: 'ui-ux-design', title: '5. UI/UX & Design System Documentation', icon: Layers },
    { id: 'dependencies-env', title: '6. System Dependencies & Environment', icon: Server },
    { id: 'optimization-future', title: '7. Optimization & Future Analysis Framework', icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span>Technical User Manual &amp; Comprehensive System Architecture</span>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                v3.2 Enterprise Spec
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Authoritative documentation covering production architecture, data models, algorithm pipelines, and future optimization roadmap.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadMarkdown}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Spec (.md)</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Navigation + Section Details */}
      <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-hidden min-h-[500px]">
        
        {/* Section Navigation Tabs */}
        <div className="w-full md:w-64 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-3 space-y-1 shrink-0 overflow-y-auto font-mono text-xs">
          <div className="text-[10px] uppercase font-bold text-zinc-500 px-2.5 py-1 tracking-wider">
            Architecture Sections
          </div>
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span className="truncate">{sec.title}</span>
              </button>
            );
          })}
        </div>

        {/* Section Content Area */}
        <div className="flex-1 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 overflow-y-auto space-y-6 text-zinc-300">
          
          {/* SECTION 1: EXECUTIVE OVERVIEW */}
          {activeSection === 'executive-overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-3">
                <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-mono">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>1. Executive Application Overview</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  High-level mission, core value proposition, targeted user personas, and macro system topologies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Core Value Proposition
                  </h5>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    SearchPulse AI is an enterprise-grade SEO indexing, backlink intelligence, and Generative Engine Optimization (GEO) platform. It unifies rapid URL discovery dispatch (Google Indexing API &amp; Bing IndexNow), factual real-data backlink audits, AI citation readiness scoring, and intelligent proxy auto-rotation into a single command center.
                  </p>
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Target User Personas
                  </h5>
                  <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
                    <li><strong className="text-zinc-200">Enterprise Technical SEOs:</strong> Requiring rapid indexing of high-churn e-commerce URLs.</li>
                    <li><strong className="text-zinc-200">Digital PR &amp; Link Builders:</strong> Auditing referring domain velocity without simulated metrics.</li>
                    <li><strong className="text-zinc-200">Agency Growth Directors:</strong> Generating whitelabel audit reports and client deliverables.</li>
                  </ul>
                </div>
              </div>

              {/* High-Level Architecture Diagram Grid */}
              <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl space-y-3">
                <h5 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                  High-Level System Architecture
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="bg-zinc-950 p-3 rounded-lg border border-indigo-500/30 space-y-1">
                    <div className="font-bold text-indigo-400">1. Client Layer</div>
                    <div className="text-zinc-400">React 18 + Vite SPA, Tailwind CSS, D3.js Math Curves, Lucide Icons</div>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-cyan-500/30 space-y-1">
                    <div className="font-bold text-cyan-400">2. Gateway &amp; Proxy</div>
                    <div className="text-zinc-400">Express.js API Router, Intelligent Proxy Pool, SSE Progress Stream</div>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-emerald-500/30 space-y-1">
                    <div className="font-bold text-emerald-400">3. Verification Core</div>
                    <div className="text-zinc-400">DataForSEO Live Crawl API, Cheerio HTML Parser, Gemini AI Models</div>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-purple-500/30 space-y-1">
                    <div className="font-bold text-purple-400">4. Billing &amp; Security</div>
                    <div className="text-zinc-400">Stripe Checkout &amp; Webhooks, MFA Auth Gatekeeper, PCI Compliant</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: VERSION HISTORY */}
          {activeSection === 'version-history' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-3">
                <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-mono">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>2. Version History &amp; Update Log</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Chronological breakdown of major releases, core enhancements, bug fixes, and resolved technical debt.
                </p>
              </div>

              <div className="space-y-4">
                
                {/* v3.2.0 */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
                      v3.2.0 — Current Stable Release (2026-08-20)
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Enterprise Visualizer Release</span>
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                    <li><strong className="text-zinc-200">D3.js 30-Day Growth Chart:</strong> Integrated interactive SVG time-series visualizer in DomainProfilerModal with cursor crosshair tracking, exact counts, referring domain filters, and CSV export.</li>
                    <li><strong className="text-zinc-200">Master App Recreator Prompt:</strong> Added a 1-click blueprint generator inside SettingsModal for full-stack reproduction across any environment.</li>
                    <li><strong className="text-zinc-200">Technical System Documentation:</strong> Embedded the comprehensive 7-section architectural user manual into the core application.</li>
                  </ul>
                </div>

                {/* v3.1.0 */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
                      v3.1.0 — Real-Data Verification Engine (2026-08-15)
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Anti-Simulation Hardening</span>
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                    <li><strong className="text-zinc-200">DataForSEO Verification:</strong> Integrated live crawl backlink counting and eliminated simulated fallback data.</li>
                    <li><strong className="text-zinc-200">Bulk SEO Validator:</strong> Implemented batch inspection for Canonical URLs, OpenGraph headers, and Heading tag densities.</li>
                    <li><strong className="text-zinc-200">Visual Schema Generator:</strong> Added interactive form builder producing validated JSON-LD schema models.</li>
                  </ul>
                </div>

                {/* v3.0.0 */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold font-mono text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-lg">
                      v3.0.0 — Intelligent Proxy Auto-Rotate Shield (2026-08-01)
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Infrastructure Architecture</span>
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                    <li><strong className="text-zinc-200">Proxy Diagnostic Pool:</strong> Added bulk latency testing, HTTP status probing, and automatic 429/403 circuit breakers.</li>
                    <li><strong className="text-zinc-200">Stripe Billing Integration:</strong> Added Customer Portal session handling and webhook management.</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 3: FEATURE CATALOG */}
          {activeSection === 'feature-catalog' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-3">
                <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-mono">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <span>3. Feature &amp; Functionality Catalog</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Exhaustive operational breakdown of every primary subsystem, input vectors, output contracts, and user controls.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. URL Indexing Dispatcher */}
                <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-indigo-300 font-mono flex items-center justify-between">
                    <span>1. Batch URL Indexing Engine</span>
                    <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300">Core</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Dispatches batch URLs to Google Indexing API via service account JWT credentials and Bing IndexNow protocol with concurrency controls.
                  </p>
                  <div className="text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/80">
                    <div><strong>Inputs:</strong> Raw URL list, Service Account JSON, API Key</div>
                    <div><strong>Outputs:</strong> Real-time HTTP 200/403 status stream, Indexing confirmation</div>
                  </div>
                </div>

                {/* 2. Live Cumulative Backlink Counter */}
                <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-emerald-300 font-mono flex items-center justify-between">
                    <span>2. Live Backlink Counter</span>
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">Verified</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Discovers and verifies total backlinks, distinct referring domains, class-C subnets, and dofollow/nofollow distributions without simulation.
                  </p>
                  <div className="text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/80">
                    <div><strong>Inputs:</strong> Target root domain or deep URL</div>
                    <div><strong>Outputs:</strong> Live crawl count, referring domain totals, anchor stats</div>
                  </div>
                </div>

                {/* 3. D3.js Growth Velocity Visualizer */}
                <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-cyan-300 font-mono flex items-center justify-between">
                    <span>3. D3.js 30-Day Growth Chart</span>
                    <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-300">D3.js</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Mathematical time-series spline curve calculating daily acquisition velocity, referring domain expansion, and net link equity influx.
                  </p>
                  <div className="text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/80">
                    <div><strong>Inputs:</strong> Domain identifier, total verified links</div>
                    <div><strong>Outputs:</strong> Interactive tooltip hover stats, CSV export, rate metrics</div>
                  </div>
                </div>

                {/* 4. GEO Readiness & AI Citation Profiler */}
                <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-amber-300 font-mono flex items-center justify-between">
                    <span>4. GEO AI Citation Profiler</span>
                    <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">AI</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Analyzes content for Large Language Model (ChatGPT, Gemini, Perplexity) citation probability, structured entity density, and schema completeness.
                  </p>
                  <div className="text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/80">
                    <div><strong>Inputs:</strong> Target URL or HTML source</div>
                    <div><strong>Outputs:</strong> GEO Visibility Score (0-100%), Citation Readiness Checklist</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 4: CODE FEATURES & ARCHITECTURE */}
          {activeSection === 'code-architecture' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-3">
                <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-mono">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  <span>4. Code Features &amp; Core Architecture</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Server entry points, async queue worker algorithms, error-handling interceptors, and security sandboxes.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                
                {/* Server Architecture Snippet */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="font-bold text-zinc-200">Server Entry Point (server.ts)</span>
                    <button
                      onClick={() => handleCopy(`// Express Server with Vite Middleware in Development
import express from 'express';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
app.use(express.json());

// API endpoints mounted prior to Vite / Static SPA fallback
app.get('/api/backlink-count', handleBacklinkCount);
app.post('/api/submit-urls', handleBatchIndexing);`, 'server-code')}
                      className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300"
                    >
                      {copiedCodeId === 'server-code' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCodeId === 'server-code' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-zinc-950 p-3 rounded-lg overflow-x-auto text-[11px] text-zinc-300 border border-zinc-800/80">
{`// Express Server with Vite Middleware in Development
import express from 'express';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
app.use(express.json());

// API endpoints mounted prior to Vite / Static SPA fallback
app.get('/api/backlink-count', handleBacklinkCount);
app.post('/api/submit-urls', handleBatchIndexing);`}
                  </pre>
                </div>

                {/* Intelligent Retry Policy & Circuit Breaker */}
                <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-zinc-200 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Intelligent Exponential Backoff &amp; Proxy Failover</span>
                  </div>
                  <p className="text-zinc-300 font-sans leading-relaxed">
                    When downstream endpoints return HTTP 429 (Rate Limit) or HTTP 503 (Service Unavailable), the queue worker automatically shifts the request through an exponential backoff formula: <code className="bg-zinc-950 px-1 py-0.5 rounded text-amber-300">delay = baseDelay * (2 ^ retryCount) + jitter</code> and seamlessly routes the payload through an alternate proxy node from the healthy pool.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 5: UI/UX & DESIGN SYSTEM */}
          {activeSection === 'ui-ux-design' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-3">
                <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-mono">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>5. UI/UX &amp; Design System Documentation</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Color tokens, typographic step scales, mathematical padding ratios, and accessible interaction patterns.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="text-zinc-200 font-bold">Color Hierarchy</div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#09090b] border border-zinc-700" />
                      <span>Canvas: Zinc-950 (#09090b)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#6366f1]" />
                      <span>Primary Accent: Indigo-500 (#6366f1)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#06b6d4]" />
                      <span>Data Accent: Cyan-500 (#06b6d4)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#10b981]" />
                      <span>Success/Live: Emerald-500 (#10b981)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="text-zinc-200 font-bold">Typography System</div>
                  <div className="space-y-1 text-[11px] text-zinc-300 font-sans">
                    <div><strong>Headings:</strong> High-contrast sans-serif with tight tracking</div>
                    <div><strong>Data &amp; Counters:</strong> Monospace (JetBrains Mono / Courier) for numerical clarity</div>
                    <div><strong>Body Text:</strong> Clean readable typography with 1.6 line height</div>
                  </div>
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="text-zinc-200 font-bold">Spatial Math</div>
                  <div className="space-y-1 text-[11px] text-zinc-300 font-sans">
                    <div><strong>Outer Padding:</strong> ≥ 16px (16px to 24px)</div>
                    <div><strong>Button Ratios:</strong> Horizontal padding exactly 2x vertical padding</div>
                    <div><strong>Border Radius:</strong> Capped at 12–16px; pills strictly for badges</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: DEPENDENCIES & ENVIRONMENT */}
          {activeSection === 'dependencies-env' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-3">
                <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-mono">
                  <Server className="w-5 h-5 text-emerald-400" />
                  <span>6. System Dependencies &amp; Environment Requirements</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Catalog of runtime packages, required secrets, browser compatibility standards, and infrastructure constraints.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-3 font-mono text-xs">
                  <div className="text-zinc-200 font-bold flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>Environment Variables (.env.example)</span>
                  </div>
                  <pre className="bg-zinc-950 p-3 rounded-lg text-[11px] text-emerald-400 border border-zinc-800/80">
{`# Platform Secrets & Runtime Keys
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
INDEXNOW_API_KEY=
PORT=3000`}
                  </pre>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                    <div className="font-bold text-zinc-200 font-mono">Runtime &amp; Libraries</div>
                    <ul className="text-zinc-300 space-y-1 list-disc list-inside">
                      <li>Node.js 18.x / 20.x ESM/CJS Runtime</li>
                      <li>React 18.3.1 + TypeScript 5.5</li>
                      <li>Express 4.19 / Vite 5.3</li>
                      <li>Lucide React + Recharts + D3.js Math</li>
                    </ul>
                  </div>

                  <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                    <div className="font-bold text-zinc-200 font-mono">Browser Standards</div>
                    <ul className="text-zinc-300 space-y-1 list-disc list-inside">
                      <li>Chrome / Chromium 110+</li>
                      <li>Firefox 115+</li>
                      <li>Safari 16.4+ (WebRTC &amp; Canvas support)</li>
                      <li>Edge 110+</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: OPTIMIZATION & FUTURE FRAMEWORK */}
          {activeSection === 'optimization-future' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-zinc-800 pb-3">
                <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-mono">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <span>7. Optimization &amp; Future Analysis Framework</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Current throughput benchmarks, known bottlenecks, and strategic scalability roadmap.
                </p>
              </div>

              <div className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                    <h5 className="text-xs font-bold text-rose-300 font-mono flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Identified Bottlenecks &amp; Limits
                    </h5>
                    <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                      <li><strong>In-Memory Proxy State:</strong> Storing proxy health in Node process memory resets on container restarts; requires persistent Redis or Cloud SQL store for horizontal scaling.</li>
                      <li><strong>Upstream Google Quotas:</strong> Google Indexing API 200 URL/day default quota per service account requires automated rotation across multiple service accounts for large sites.</li>
                    </ul>
                  </div>

                  <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl space-y-2">
                    <h5 className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Scale &amp; AI Roadmap Recommendations
                    </h5>
                    <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                      <li><strong>Multi-Service Account Rotating Vault:</strong> Allow users to supply an array of 5-10 Google service account JSONs for automated quota pooling (up to 2,000 URLs/day).</li>
                      <li><strong>Real-Time SERP Diff Engine:</strong> Store daily HTML snapshots to compute word-for-word competitor changes using AST diffing.</li>
                      <li><strong>Autonomous IndexNow Ping Hooks:</strong> Webhook listener that auto-submits URLs immediately upon CMS publishing.</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
