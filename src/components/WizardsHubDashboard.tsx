import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Zap,
  Compass,
  Search,
  Timer,
  Globe,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  FileCode,
  Flame,
  Radar,
  BarChart3,
  Sliders,
  Send,
  Brain,
  Key,
  Printer,
  Bot,
  CloudLightning,
  FileText,
  Check,
  Workflow,
  Network,
  Filter,
  Play,
} from 'lucide-react';
import { SubmissionHistoryItem } from '../types';
import { LLmCitationSimulator } from './LLmCitationSimulator';
import { WhitelabelClientPdfGenerator } from './WhitelabelClientPdfGenerator';
import { BulkSeoValidator } from './BulkSeoValidator';
import { LinkStrategyGeneratorCard } from './LinkStrategyGeneratorCard';

interface WizardsHubDashboardProps {
  onOpenConversionWizard: (url?: string) => void;
  onOpenClarityWizard?: (url?: string) => void;
  onOpenGoogleApiWizard?: () => void;
  onOpenSchemaGeneratorModal?: () => void;
  onOpenBulkSeoValidator?: () => void;
  onOpenOnboardingWizard: () => void;
  onOpenGeoBlueprint: () => void;
  onOpenDomainProfiler: (domain?: string) => void;
  onOpenAudit: () => void;
  onOpenScheduler: () => void;
  onOpenContentGrader: (url?: string, keyword?: string) => void;
  onOpenIndexingWizard?: () => void;
  onStartAutonomous100k: () => void;
  isAutonomousActive: boolean;
  autonomousAccumulatedCount: number;
  autonomousTargetGoal: number;
  history?: SubmissionHistoryItem[];
  defaultUrl?: string;
  defaultAgencyName?: string;
  initialTab?: 'wizards' | 'citation-sim' | 'whitelabel-pdf' | 'bulk-seo' | 'funnel-map' | 'link-strategist';
}

export const WizardsHubDashboard: React.FC<WizardsHubDashboardProps> = ({
  onOpenConversionWizard,
  onOpenClarityWizard,
  onOpenGoogleApiWizard,
  onOpenSchemaGeneratorModal,
  onOpenBulkSeoValidator,
  onOpenOnboardingWizard,
  onOpenGeoBlueprint,
  onOpenDomainProfiler,
  onOpenAudit,
  onOpenScheduler,
  onOpenContentGrader,
  onOpenIndexingWizard,
  onStartAutonomous100k,
  isAutonomousActive,
  autonomousAccumulatedCount,
  autonomousTargetGoal,
  history = [],
  defaultUrl = 'https://careerpulseai.net',
  defaultAgencyName = 'Apex Search Engine Partners',
  initialTab = 'wizards',
}) => {
  const [activeTab, setActiveTab] = useState<'wizards' | 'citation-sim' | 'whitelabel-pdf' | 'bulk-seo' | 'funnel-map' | 'link-strategist'>(initialTab);
  const [simUrl, setSimUrl] = useState(defaultUrl);
  const [simKeyword, setSimKeyword] = useState('AI resume builder and automated backlink indexer for tech talent');
  const [quickCroUrl, setQuickCroUrl] = useState('');
  const [quickClarityUrl, setQuickClarityUrl] = useState('');
  const [quickProfilerDomain, setQuickProfilerDomain] = useState('');
  const [quickGraderUrl, setQuickGraderUrl] = useState('');
  const [quickGraderKeyword, setQuickGraderKeyword] = useState('');

  // Sync tab when prop changes dynamically from parent navigation
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  React.useEffect(() => {
    if (defaultUrl) {
      setSimUrl(defaultUrl);
    }
  }, [defaultUrl]);

  const handleLaunchCro = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenConversionWizard(quickCroUrl.trim());
  };

  const handleLaunchClarity = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenClarityWizard) {
      onOpenClarityWizard(quickClarityUrl.trim());
    }
  };

  const handleLaunchProfiler = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenDomainProfiler(quickProfilerDomain.trim());
  };

  const handleLaunchGrader = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenContentGrader(quickGraderUrl.trim(), quickGraderKeyword.trim());
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Wizards & Strategy Command Center */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950/30 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Strategic Optimization Hub</span>
                </span>
                <span className="text-zinc-500 text-xs">•</span>
                <span className="text-xs text-zinc-400 font-mono">
                  Interactive Guided Wizards &bull; AI Citation Simulator &bull; Whitelabel Reports
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                Wizards &amp; Growth <span className="text-indigo-400">Command Center</span>
              </h2>

              <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
                Step-by-step intelligence engines engineered to eliminate trust gaps, setup Google Indexing API service accounts, benchmark citations across Perplexity and ChatGPT, and generate executive white-label client PDF audits.
              </p>
            </div>

            {/* Quick Actions Row */}
            <div className="flex flex-wrap items-center gap-2">
              {onOpenSchemaGeneratorModal && (
                <button
                  onClick={onOpenSchemaGeneratorModal}
                  className="px-4 py-2.5 rounded-2xl bg-purple-500 hover:bg-purple-400 text-zinc-950 font-black text-xs tracking-wide shadow-lg shadow-purple-500/20 flex items-center space-x-2 transition-all cursor-pointer active:scale-95 border-2 border-black"
                >
                  <FileCode className="w-4 h-4 text-black" />
                  <span>Schema Generator</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('bulk-seo')}
                className="px-4 py-2.5 rounded-2xl bg-[#ff4d00] hover:bg-[#ff6a2b] text-black font-black text-xs tracking-wide shadow-lg shadow-[#ff4d00]/20 flex items-center space-x-2 transition-all cursor-pointer active:scale-95 border-2 border-black"
              >
                <Layers className="w-4 h-4 text-black" />
                <span>Bulk SEO Validator</span>
              </button>

              {onOpenGoogleApiWizard && (
                <button
                  onClick={onOpenGoogleApiWizard}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-black text-xs tracking-wide shadow-lg shadow-emerald-400/20 flex items-center space-x-2 transition-all cursor-pointer active:scale-95 border-2 border-black"
                >
                  <CloudLightning className="w-4 h-4 text-black" />
                  <span>Google API Wizard</span>
                </button>
              )}

              {onOpenClarityWizard && (
                <button
                  onClick={() => onOpenClarityWizard()}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs tracking-wide shadow-lg shadow-amber-400/20 flex items-center space-x-2 transition-all cursor-pointer active:scale-95 border-2 border-black"
                >
                  <Brain className="w-4 h-4" />
                  <span>Clarity Overload Audit</span>
                </button>
              )}

              <button
                onClick={() => onOpenConversionWizard()}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-black text-xs tracking-wide shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
              >
                <Wand2 className="w-4 h-4" />
                <span>Launch ConversionWizard</span>
              </button>

              <button
                onClick={onOpenOnboardingWizard}
                className="px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs border border-zinc-700 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>3-Step Setup Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hub Navigation Tabs */}
      <div className="flex items-center gap-3 border-b-2 border-black dark:border-zinc-700 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('wizards')}
          className={`px-4 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'wizards'
              ? 'bg-black text-[#ff4d00] shadow-[2px_2px_0_#ff4d00]'
              : 'bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>WIZARDS &amp; STRATEGY CARDS</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bulk-seo')}
          className={`px-4 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'bulk-seo'
              ? 'bg-black text-[#ff4d00] shadow-[2px_2px_0_#ff4d00]'
              : 'bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#ff4d00]" />
            <span>BULK SEO URL VALIDATOR</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('citation-sim')}
          className={`px-4 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'citation-sim'
              ? 'bg-black text-[#ff4d00] shadow-[2px_2px_0_#ff4d00]'
              : 'bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-[#ff4d00]" />
            <span>LLM CITATION SIMULATOR</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('whitelabel-pdf')}
          className={`px-4 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'whitelabel-pdf'
              ? 'bg-black text-[#ff4d00] shadow-[2px_2px_0_#ff4d00]'
              : 'bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Printer className="w-4 h-4 text-emerald-500" />
            <span>WHITELABEL PDF GENERATOR</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('link-strategist')}
          className={`px-4 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'link-strategist'
              ? 'bg-amber-400 text-black shadow-[2px_2px_0_#000]'
              : 'bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI LINK STRATEGIST &amp; OUTREACH</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('funnel-map')}
          className={`px-4 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'funnel-map'
              ? 'bg-[#ff4d00] text-black shadow-[2px_2px_0_#000]'
              : 'bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Workflow className="w-4 h-4 text-black dark:text-zinc-100" />
            <span>TOOL-TO-STEP FUNNEL GUIDE</span>
          </span>
        </button>
      </div>

      {/* TAB CONTENT: TOOL-TO-STEP FUNNEL GUIDE */}
      {activeTab === 'funnel-map' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0_#000] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-4 border-black">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-[#ff4d00] text-black text-[10px] font-mono-brutal font-bold uppercase">
                    ARCHITECTURE // STAGES 1 TO 5
                  </span>
                  <span className="text-xs font-mono-brutal text-zinc-500 uppercase">
                    GEO_INDEXING_LIFECYCLE
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-black dark:text-zinc-100 tracking-tight uppercase mt-1">
                  Visual Tool-to-Step Indexing Funnel Map
                </h3>
                <p className="text-xs sm:text-sm font-mono-brutal text-zinc-600 dark:text-zinc-300 mt-1 max-w-3xl">
                  Every wizard and diagnostic engine corresponds directly to an essential stage in the Search &amp; Generative Engine lifecycle. Use this interactive roadmap to launch each tool at the optimal phase of your campaign.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenOnboardingWizard}
                  className="px-4 py-2 bg-black text-white hover:bg-zinc-800 text-xs font-mono-brutal font-bold uppercase border-2 border-black shadow-[2px_2px_0_#ff4d00] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-[#ff4d00]" />
                  <span>3-Step Quickstart</span>
                </button>
              </div>
            </div>

            {/* Visual Funnel Step-by-Step Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative">
              {/* STAGE 1 */}
              <div className="bg-[#fcfaf7] dark:bg-zinc-950 border-3 border-black p-4 space-y-3 flex flex-col justify-between shadow-[3px_3px_0_#000] hover:translate-y-[-2px] transition-transform">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-black text-white text-[10px] font-mono-brutal font-bold uppercase">
                      STAGE 01
                    </span>
                    <span className="text-[10px] font-mono-brutal text-zinc-500 uppercase font-bold">
                      DISCOVERY
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-black dark:text-zinc-100 uppercase tracking-tight">
                    Technical &amp; Site Crawl
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    Identify indexation blockers, 404 broken links, short descriptions, and canonical headers across the domain.
                  </p>
                  <div className="p-2 bg-white dark:bg-zinc-900 border border-black/30 rounded text-[11px] font-mono-brutal space-y-1">
                    <div className="text-zinc-500 uppercase text-[9px] font-bold">Active Engine:</div>
                    <div className="font-bold text-black dark:text-zinc-100">XML Sitemap &amp; Technical Audit Crawler</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-black/20 space-y-2">
                  <button
                    onClick={onOpenAudit}
                    className="w-full py-1.5 px-2 bg-black hover:bg-zinc-800 text-white text-xs font-mono-brutal font-bold uppercase border border-black transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Search className="w-3 h-3 text-[#ff4d00]" />
                    <span>LAUNCH AUDIT</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('bulk-seo')}
                    className="w-full py-1 px-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-black dark:text-zinc-200 text-[10px] font-mono-brutal font-bold uppercase border border-black/40 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Layers className="w-3 h-3" />
                    <span>BULK SEO VALIDATOR</span>
                  </button>
                </div>
              </div>

              {/* STAGE 2 */}
              <div className="bg-[#fcfaf7] dark:bg-zinc-950 border-3 border-black p-4 space-y-3 flex flex-col justify-between shadow-[3px_3px_0_#000] hover:translate-y-[-2px] transition-transform">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-emerald-400 text-black text-[10px] font-mono-brutal font-bold uppercase">
                      STAGE 02
                    </span>
                    <span className="text-[10px] font-mono-brutal text-zinc-500 uppercase font-bold">
                      AUTHENTICATION
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-black dark:text-zinc-100 uppercase tracking-tight">
                    API &amp; Proxy Readiness
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    Verify Google Cloud Service Account permissions, test proxy node latencies, and check 403 shield isolation.
                  </p>
                  <div className="p-2 bg-white dark:bg-zinc-900 border border-black/30 rounded text-[11px] font-mono-brutal space-y-1">
                    <div className="text-zinc-500 uppercase text-[9px] font-bold">Active Engine:</div>
                    <div className="font-bold text-black dark:text-zinc-100">Google API 3-Step Wizard &amp; Latency Monitor</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-black/20 space-y-2">
                  {onOpenGoogleApiWizard && (
                    <button
                      onClick={onOpenGoogleApiWizard}
                      className="w-full py-1.5 px-2 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-mono-brutal font-bold uppercase border border-black transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <CloudLightning className="w-3 h-3 text-black" />
                      <span>GOOGLE API WIZARD</span>
                    </button>
                  )}
                  <button
                    onClick={onOpenScheduler}
                    className="w-full py-1 px-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-black dark:text-zinc-200 text-[10px] font-mono-brutal font-bold uppercase border border-black/40 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Timer className="w-3 h-3" />
                    <span>SCHEDULER HEALTH</span>
                  </button>
                </div>
              </div>

              {/* STAGE 3 */}
              <div className="bg-[#fcfaf7] dark:bg-zinc-950 border-3 border-black p-4 space-y-3 flex flex-col justify-between shadow-[3px_3px_0_#000] hover:translate-y-[-2px] transition-transform">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#ff4d00] text-black text-[10px] font-mono-brutal font-bold uppercase">
                      STAGE 03
                    </span>
                    <span className="text-[10px] font-mono-brutal text-zinc-500 uppercase font-bold">
                      EXECUTION
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-black dark:text-zinc-100 uppercase tracking-tight">
                    Batch Submission Engine
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    Queue target URLs, configure high-authority directories, calibrate concurrency limits, and dispatch workers.
                  </p>
                  <div className="p-2 bg-white dark:bg-zinc-900 border border-black/30 rounded text-[11px] font-mono-brutal space-y-1">
                    <div className="text-zinc-500 uppercase text-[9px] font-bold">Active Engine:</div>
                    <div className="font-bold text-black dark:text-zinc-100">5-Step URL Indexing Wizard &amp; Live Stream</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-black/20 space-y-2">
                  <button
                    onClick={() => {
                      if (onOpenIndexingWizard) onOpenIndexingWizard();
                      else onOpenConversionWizard();
                    }}
                    className="w-full py-1.5 px-2 bg-[#ff4d00] hover:bg-[#ff6a2b] text-black text-xs font-mono-brutal font-bold uppercase border border-black transition-all cursor-pointer flex items-center justify-center gap-1 shadow-[2px_2px_0_#000]"
                  >
                    <Zap className="w-3 h-3 text-black" />
                    <span>5-STEP WIZARD</span>
                  </button>
                  <button
                    onClick={onStartAutonomous100k}
                    className="w-full py-1 px-2 bg-zinc-900 hover:bg-zinc-800 text-[#ff4d00] text-[10px] font-mono-brutal font-bold uppercase border border-black transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Flame className="w-3 h-3 text-[#ff4d00]" />
                    <span>AUTONOMOUS 100K</span>
                  </button>
                </div>
              </div>

              {/* STAGE 4 */}
              <div className="bg-[#fcfaf7] dark:bg-zinc-950 border-3 border-black p-4 space-y-3 flex flex-col justify-between shadow-[3px_3px_0_#000] hover:translate-y-[-2px] transition-transform">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-purple-400 text-black text-[10px] font-mono-brutal font-bold uppercase">
                      STAGE 04
                    </span>
                    <span className="text-[10px] font-mono-brutal text-zinc-500 uppercase font-bold">
                      GEO &amp; AI ENGINES
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-black dark:text-zinc-100 uppercase tracking-tight">
                    LLM Citation &amp; Schema
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    Optimize for Perplexity, ChatGPT Search, and Gemini with direct answer framing and JSON-LD structured data.
                  </p>
                  <div className="p-2 bg-white dark:bg-zinc-900 border border-black/30 rounded text-[11px] font-mono-brutal space-y-1">
                    <div className="text-zinc-500 uppercase text-[9px] font-bold">Active Engine:</div>
                    <div className="font-bold text-black dark:text-zinc-100">GEO Grader, Schema Gen &amp; Citation Sim</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-black/20 space-y-2">
                  <button
                    onClick={() => setActiveTab('citation-sim')}
                    className="w-full py-1.5 px-2 bg-purple-400 hover:bg-purple-300 text-black text-xs font-mono-brutal font-bold uppercase border border-black transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Bot className="w-3 h-3 text-black" />
                    <span>CITATION SIMULATOR</span>
                  </button>
                  {onOpenSchemaGeneratorModal && (
                    <button
                      onClick={onOpenSchemaGeneratorModal}
                      className="w-full py-1 px-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-black dark:text-zinc-200 text-[10px] font-mono-brutal font-bold uppercase border border-black/40 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <FileCode className="w-3 h-3" />
                      <span>SCHEMA GENERATOR</span>
                    </button>
                  )}
                </div>
              </div>

              {/* STAGE 5 */}
              <div className="bg-[#fcfaf7] dark:bg-zinc-950 border-3 border-black p-4 space-y-3 flex flex-col justify-between shadow-[3px_3px_0_#000] hover:translate-y-[-2px] transition-transform">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-amber-400 text-black text-[10px] font-mono-brutal font-bold uppercase">
                      STAGE 05
                    </span>
                    <span className="text-[10px] font-mono-brutal text-zinc-500 uppercase font-bold">
                      CONVERSION &amp; PROOF
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-black dark:text-zinc-100 uppercase tracking-tight">
                    CRO &amp; Client Reporting
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    Eliminate cognitive friction, trigger high-converting trust levers, and export whitelabeled PDF audit reports.
                  </p>
                  <div className="p-2 bg-white dark:bg-zinc-900 border border-black/30 rounded text-[11px] font-mono-brutal space-y-1">
                    <div className="text-zinc-500 uppercase text-[9px] font-bold">Active Engine:</div>
                    <div className="font-bold text-black dark:text-zinc-100">ConversionWizard &amp; Whitelabel PDF Suite</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-black/20 space-y-2">
                  <button
                    onClick={() => onOpenConversionWizard()}
                    className="w-full py-1.5 px-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-black text-xs font-mono-brutal font-bold uppercase border border-black transition-all cursor-pointer flex items-center justify-center gap-1 shadow-[2px_2px_0_#000]"
                  >
                    <Wand2 className="w-3 h-3 text-black" />
                    <span>CONVERSION WIZARD</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('whitelabel-pdf')}
                    className="w-full py-1 px-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-black dark:text-zinc-200 text-[10px] font-mono-brutal font-bold uppercase border border-black/40 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Printer className="w-3 h-3 text-emerald-600" />
                    <span>WHITELABEL PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Flow Summary Bar */}
            <div className="p-4 bg-[#f2efeb] dark:bg-zinc-800 border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-brutal">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-zinc-800 dark:text-zinc-200">
                  <strong>Recommended Workflow:</strong> Audit Site (Stage 1) &rarr; Verify API Credentials (Stage 2) &rarr; Launch Batch Indexing (Stage 3) &rarr; Harvest JSON-LD (Stage 4) &rarr; Export Client PDF (Stage 5)
                </span>
              </div>
              <button
                onClick={() => setActiveTab('wizards')}
                className="px-3 py-1 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-black dark:text-zinc-100 text-xs font-bold uppercase border border-black shadow-[1px_1px_0_#000] shrink-0"
              >
                Back to Wizards
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BULK SEO VALIDATOR */}
      {activeTab === 'bulk-seo' && (
        <BulkSeoValidator
          initialUrls={[defaultUrl]}
        />
      )}

      {/* TAB CONTENT: CITATION SIMULATOR */}
      {activeTab === 'citation-sim' && (
        <LLmCitationSimulator
          initialUrl={simUrl}
          initialKeyword={simKeyword}
        />
      )}

      {/* TAB CONTENT: WHITELABEL PDF GENERATOR */}
      {activeTab === 'whitelabel-pdf' && (
        <WhitelabelClientPdfGenerator
          history={history}
          defaultAgencyName={defaultAgencyName}
          defaultClientName={defaultUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '') || 'CareerPulseAI.net'}
        />
      )}

      {/* TAB CONTENT: AI LINK STRATEGIST & OUTREACH ENGINE */}
      {activeTab === 'link-strategist' && (
        <LinkStrategyGeneratorCard
          initialUrl={defaultUrl}
          initialNiche="AI Resume & Career Automation SaaS"
          initialService="Automated AI resume builder, career trajectory optimizer, and interview coach"
        />
      )}

      {/* TAB CONTENT: WIZARDS GRID */}
      {activeTab === 'wizards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* CARD: AI SEO Link Building Strategist & Outreach Engine */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-amber-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-amber-400 transition-all group relative overflow-hidden md:col-span-2 lg:col-span-3">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-black uppercase">
                    PRO STRATEGY SUITE
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono">
                    GEMINI 3.7 FLASH
                  </span>
                </div>
                <h3 className="text-xl font-black text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>SEO Link Building Strategist &amp; Outreach Engine</span>
                </h3>
                <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                  Identify 3 top direct competitors in your niche, suggest 2 high-converting "linkable assets" for each, generate 5 live Google Search Dorks for active guest posts &amp; resource opportunities, and draft personalized outreach emails.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('link-strategist')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs tracking-wide shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <span>Launch Link Strategist Engine</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </button>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono flex-wrap gap-2">
              <span>Competitor Assets &bull; Google Dorks &bull; Outreach Templates</span>
              <span className="text-amber-400 font-bold">Zero-Hallucination Blueprint</span>
            </div>
          </div>
          {/* CARD: Bulk SEO URL Validator & Hierarchy Grader */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-emerald-500 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 p-[1px] shadow-lg shadow-emerald-500/20">
                  <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                    <Layers className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  50+ Parallel URLs
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                  Bulk SEO URL Validator &amp; Hierarchy Grader
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Run parallel performance audits on 50+ URLs at once to detect canonical mismatches, missing meta-descriptions, and H1/H2 heading hierarchy flaws.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Concurrency:</span>
                  <span className="text-zinc-200 font-mono">Up to 15 Parallel Workers</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Checks:</span>
                  <span className="text-emerald-400 font-mono font-bold">Canonical, Metas, H1/H2 Tree</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('bulk-seo')}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-black hover:text-emerald-400 text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-all active:scale-95 border-2 border-black"
              >
                <span>Launch Bulk URL Validator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Parallel Multi-Check</span>
              <span className="text-emerald-400 font-bold">Turbo Engine</span>
            </div>
          </div>

          {/* CARD: Visual Schema Generator Modal */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-purple-500/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-purple-500 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500 p-[1px] shadow-lg shadow-purple-500/20">
                  <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                    <FileCode className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Schema.org JSON-LD
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-purple-400 transition-colors">
                  Visual Schema Generator &amp; SERP Preview
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Visually generate FAQ, Article, and Organization Schema.org markup with live Google search rich snippet preview and 1-click copy code snippets.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Supported Schemas:</span>
                  <span className="text-zinc-200 font-mono">FAQPage, Article, Organization</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>SERP Simulator:</span>
                  <span className="text-purple-400 font-mono font-bold">Google Rich Results Ready</span>
                </div>
              </div>

              {onOpenSchemaGeneratorModal ? (
                <button
                  type="button"
                  onClick={onOpenSchemaGeneratorModal}
                  className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-black hover:text-purple-400 text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-purple-500/20 cursor-pointer transition-all active:scale-95 border-2 border-black"
                >
                  <span>Build Schema &amp; Copy Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenOnboardingWizard()}
                  className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-black hover:text-purple-400 text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-purple-500/20 cursor-pointer transition-all active:scale-95 border-2 border-black"
                >
                  <span>Launch Schema Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Rich Snippet Generator</span>
              <span className="text-purple-400 font-bold">JSON-LD</span>
            </div>
          </div>

          {/* CARD: LLM Citation Simulator */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-[#ff4d00]/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-[#ff4d00] transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4d00]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#ff4d00] p-[1px] shadow-lg shadow-[#ff4d00]/20">
                  <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                    <Bot className="w-6 h-6 text-[#ff4d00]" />
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ff4d00]/10 text-[#ff4d00] border border-[#ff4d00]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Multi-LLM Test
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-[#ff4d00] transition-colors">
                  LLM Citation Simulator &amp; Diagnostic
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Test prompt visibility across Perplexity Pro, SearchGPT, Gemini Overviews, Claude, and Copilot with schema and direct-answer graders.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Target Entity:</span>
                  <span className="text-zinc-200 font-mono truncate max-w-[150px]">{simUrl}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Consensus Engine:</span>
                  <span className="text-emerald-400 font-mono font-bold">5 Major LLMs</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('citation-sim')}
                className="w-full py-2.5 rounded-xl bg-[#ff4d00] hover:bg-black hover:text-[#ff4d00] text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-[#ff4d00]/20 cursor-pointer transition-all active:scale-95 border-2 border-black"
              >
                <span>Launch Citation Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Perplexity &bull; SearchGPT</span>
              <span className="text-[#ff4d00] font-bold">Live Simulation</span>
            </div>
          </div>

          {/* CARD: Whitelabel Client PDF Generator */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-emerald-400/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-emerald-400 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400 p-[1px] shadow-lg shadow-emerald-400/20">
                  <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                    <Printer className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Agency Ready
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                  White-Label Client PDF Generator
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Customize agency logos, executive sign-offs, brand palettes, and generate high-resolution print-to-PDF audit reports for clients.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Client Domain:</span>
                  <span className="text-zinc-200 font-mono truncate max-w-[150px]">{defaultUrl.replace(/^https?:\/\//i, '')}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Log Telemetry:</span>
                  <span className="text-emerald-400 font-mono font-bold">{history.length > 0 ? `${history.length} URLs` : '148 Live URLs'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('whitelabel-pdf')}
                className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-400/20 cursor-pointer transition-all active:scale-95 border-2 border-black"
              >
                <span>Generate Client PDF Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Print-to-PDF &bull; Logo Branding</span>
              <span className="text-emerald-400 font-bold">Executive Report</span>
            </div>
          </div>

          {/* CARD: Google Indexing API 3-Step Setup Wizard */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-emerald-400/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-emerald-400 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400 p-[1px] shadow-lg shadow-emerald-400/20">
                  <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                    <CloudLightning className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  3-Step Setup
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                  Google Indexing API Setup Wizard
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Upload Service Account JSON, configure delegated ownership in Google Search Console, and verify live HTTP 200 connection handshakes.
                </p>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Step 1:</span>
                  <span className="text-zinc-200 font-mono">Upload JSON Key</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Step 2:</span>
                  <span className="text-zinc-200 font-mono">GSC Owner Delegation</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Step 3:</span>
                  <span className="text-emerald-400 font-mono font-bold">200 OK Handshake</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenGoogleApiWizard}
                className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-400/20 cursor-pointer transition-all active:scale-95 border-2 border-black"
              >
                <span>Launch Google API Wizard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Google API v3 Engine</span>
              <span className="text-emerald-400 font-bold">200 Quota/Day</span>
            </div>
          </div>

          {/* CARD 0: Clarity Overload CRO Audit Tool */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-amber-400/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-amber-400 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 p-[1px] shadow-lg shadow-amber-400/20">
                  <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                    <Brain className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  5-Second Test
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                  Clarity Overload CRO Audit
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Evaluates whether landing pages overwhelm visitors with feature bloat, competing headlines, and decision paralysis instead of one high-value outcome.
                </p>
              </div>

              {/* Quick URL form */}
              <form onSubmit={handleLaunchClarity} className="space-y-2">
                <input
                  type="text"
                  value={quickClarityUrl}
                  onChange={(e) => setQuickClarityUrl(e.target.value)}
                  placeholder="Enter URL (e.g. careerpulseai.com)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-400/20 cursor-pointer transition-all active:scale-95"
                >
                  <span>Run 5-Sec Clarity Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>UX Friction &amp; Bloat Triage</span>
              <span className="text-amber-400 font-bold">Single Outcome Focus</span>
            </div>
          </div>

          {/* CARD 1: ConversionWizard CRO & Prompt Generator */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-amber-500/50 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-[1px] shadow-lg shadow-amber-500/20">
                  <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                    <Wand2 className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  4-Step CRO Flow
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                  ConversionWizard (CRO &amp; Prompts)
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Diagnose Trust, Friction, and Clarity gaps on any website. Benchmark side-by-side with competitors and generate production-ready AI fix-it prompts.
                </p>
              </div>

              {/* Quick URL form */}
              <form onSubmit={handleLaunchCro} className="space-y-2">
                <input
                  type="text"
                  value={quickCroUrl}
                  onChange={(e) => setQuickCroUrl(e.target.value)}
                  placeholder="Enter URL (e.g. mybrand.com)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
                >
                  <span>Audit &amp; Generate Prompts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Formula: Traffic × CR × AOV</span>
              <span className="text-amber-400 font-bold">Copy AI Prompts</span>
            </div>
          </div>

        {/* CARD 2: Autonomous 100,000 Milestone Continuous Engine */}
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-indigo-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 p-[1px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                100,000 Goal Engine
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                Autonomous Continuous Engine
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Automated continuous rotation loop with rate-limiting protection, URL cycling, and automated restart toward a 100,000 submission milestone.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Target Milestone:</span>
                <span className="font-mono font-bold text-indigo-300">
                  {autonomousTargetGoal.toLocaleString()} Tasks
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Current Status:</span>
                <span
                  className={`font-mono font-bold ${
                    isAutonomousActive ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'
                  }`}
                >
                  {isAutonomousActive
                    ? `Running (${autonomousAccumulatedCount.toLocaleString()}/${autonomousTargetGoal.toLocaleString()})`
                    : 'Ready to Activate'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onStartAutonomous100k}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20 cursor-pointer transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-300" />
              <span>{isAutonomousActive ? 'View Active 100k Loop' : 'Activate 100,000 Loop'}</span>
            </button>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Auto-Rotate URLs</span>
            <span className="text-cyan-400 font-bold">100k Milestone</span>
          </div>
        </div>

        {/* CARD 3: Enterprise GEO & AI Engine Growth Blueprint */}
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-purple-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-purple-500/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-[1px] shadow-lg shadow-purple-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                LLM Search Blueprint
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-100 group-hover:text-purple-300 transition-colors">
                Enterprise GEO Blueprint
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Answer-First strategy, structured JSON-LD entity graph schemas, and direct citation optimization for ChatGPT, Perplexity, Google SGE, and Bing Copilot.
              </p>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-300 font-mono">
              <div className="flex items-center space-x-1.5 text-purple-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>50-Word Answer-First Box</span>
              </div>
              <div className="flex items-center space-x-1.5 text-indigo-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Perplexity Citation Graphs</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenGeoBlueprint}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-purple-600/20 cursor-pointer transition-all active:scale-95"
            >
              <span>Open GEO Blueprint</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>GEO v2.4 Framework</span>
            <span className="text-purple-400 font-bold">LLM Citation Score</span>
          </div>
        </div>

        {/* CARD 4: SEO Domain Profiler & Authority Scanner */}
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-cyan-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-cyan-500/50 transition-all group relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 p-[1px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <Globe className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                Authority Intelligence
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                SEO Domain Profiler
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Scan domain age, estimated authority backlinks, indexing status, SSL health, and GEO authority ranking benchmarks.
              </p>
            </div>

            <form onSubmit={handleLaunchProfiler} className="space-y-2">
              <input
                type="text"
                value={quickProfilerDomain}
                onChange={(e) => setQuickProfilerDomain(e.target.value)}
                placeholder="Domain (e.g. competitor.com)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-600/20 cursor-pointer transition-all active:scale-95"
              >
                <span>Run Domain Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>WHOIS &bull; DA &bull; SSL</span>
            <span className="text-cyan-400 font-bold">Instant Audit</span>
          </div>
        </div>

        {/* CARD 5: Smart Batch Scheduler (Drip Queue Wizard) */}
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-amber-500/50 transition-all group relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 p-[1px] shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <Timer className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                Drip Automation
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                Smart Batch Scheduler
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Schedule recurring drip-feed backlink submissions. Configure cron intervals, batch sizes, and directory rotations.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">Intervals:</span>
                <span className="font-mono text-amber-300">Hourly / Daily / Custom</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Queue Engine:</span>
                <span className="font-mono text-emerald-400">Background Worker Active</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenScheduler}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-zinc-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-600/20 cursor-pointer transition-all active:scale-95"
            >
              <span>Configure Batch Drip Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Drip-Feed Protection</span>
            <span className="text-amber-400 font-bold">Cron Engine</span>
          </div>
        </div>

        {/* CARD 6: AI Content & Readiness Grader */}
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-teal-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-teal-500/50 transition-all group relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 p-[1px] shadow-lg shadow-teal-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-teal-400" />
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                Readiness Scorecard
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-100 group-hover:text-teal-300 transition-colors">
                AI Content &amp; Readiness Grader
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Analyze word density, H1-H6 heading structure, readability, and citation probability score before index submissions.
              </p>
            </div>

            <form onSubmit={handleLaunchGrader} className="space-y-2">
              <input
                type="text"
                value={quickGraderUrl}
                onChange={(e) => setQuickGraderUrl(e.target.value)}
                placeholder="Target URL"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-500 font-mono"
              />
              <input
                type="text"
                value={quickGraderKeyword}
                onChange={(e) => setQuickGraderKeyword(e.target.value)}
                placeholder="Focus Keyword"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-500 font-mono"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-zinc-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-teal-600/20 cursor-pointer transition-all active:scale-95"
              >
                <span>Grade Readiness &amp; Citations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Readiness % &bull; Citations</span>
            <span className="text-teal-400 font-bold">Pre-Flight Audit</span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
