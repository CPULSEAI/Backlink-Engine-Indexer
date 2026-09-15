import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Search,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Globe,
  Database,
  Layers,
  ArrowRight,
  Copy,
  Check,
  Download,
  Terminal,
  Brain,
  ShieldAlert,
  SlidersHorizontal,
  Bot,
  FileCode,
  Share2,
  RotateCcw,
  Target,
  ExternalLink,
  Code2,
  Compass,
  Zap,
  Info,
  Clock,
  ListOrdered
} from 'lucide-react';
import {
  TrafficLossAuditInputs,
  TrafficLossAuditReport,
} from '../types';

interface ComprehensiveTrafficLossAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
}

const DEFAULT_INPUTS: TrafficLossAuditInputs = {
  websiteUrl: 'https://careerpulseai.net',
  websiteDescription: 'AI-native career intelligence, ATS resume scanner, and automated backlink submission engine for tech professionals.',
  industryNiche: 'B2B SaaS / Career Tech / AI SEO & Indexing',
  targetAudience: 'Software Engineers, Engineering Managers, Tech Job Seekers, Agency Founders',
  primaryTrafficGoal: 'Organic Search',
  dateRangeAnalyzed: 'Last 90 Days vs Previous Period',
  totalClicks: 14820,
  clickChangePercent: -42.4,
  totalImpressions: 489200,
  impressionChangePercent: -18.2,
  averageCtr: 3.03,
  averagePosition: 14.8,
  indexedPages: 312,
  coverageErrors: 47,
  totalUsers: 18450,
  sessions: 22800,
  organicTraffic: 11200,
  directTraffic: 5100,
  referralTraffic: 1650,
  socialTraffic: 850,
  highestPerformingPages: '/tools/resume-optimizer (8,400 impressions, 410 clicks)\n/blog/ats-keywords-2026 (12,200 impressions, 380 clicks)',
  lowestPerformingPages: '/pricing (1,200 impressions, 14 clicks)\n/features/backlink-pipeline (890 impressions, 9 clicks)',
  pagesWithTrafficDeclines: '/blog/how-to-beat-workday-ats (-68% clicks)\n/templates/engineering-resume (-54% clicks)\n/guides/ai-cover-letter (-41% clicks)',
  topQueriesAndKeywords: 'ai resume builder (pos 8.2, 4.1% CTR)\nats keyword scanner (pos 14.5, 1.8% CTR)\ntechnical resume format (pos 19.1, 0.9% CTR)\nfree job tracking dashboard (pos 22.4, 0.5% CTR)',
  recentChanges: {
    websiteRedesign: true,
    cmsMigration: true,
    domainMigration: false,
    hostingMigration: true,
    themeChanges: true,
    robotsTxtModifications: true,
    trackingCodeChanges: false,
    sitemapUpdates: true,
    canonicalUpdates: true,
    securityIssues: false,
    manualPenalties: false,
    majorContentUpdates: false,
  },
  recentChangesNotes: 'Migrated from legacy static blog to Next.js edge runtime. URLs were adjusted with partial 301 redirects, resulting in 404 crawl spikes in GSC.',
  referringDomains: 148,
  totalBacklinks: 2840,
  authorityMetrics: 34,
  newLinksGained: 12,
  linksLost: 38,
  anchorTextDistribution: 'Branded: 52%, Naked URL: 28%, Exact Match: 12%, Generic: 8%',
  topLinkingPages: 'github.com/awesome-career-tools\nproducthunt.com/posts/careerpulse\nnews.ycombinator.com',
};

export const ComprehensiveTrafficLossAuditModal: React.FC<ComprehensiveTrafficLossAuditModalProps> = ({
  isOpen,
  onClose,
  initialUrl,
}) => {
  const [inputs, setInputs] = useState<TrafficLossAuditInputs>(DEFAULT_INPUTS);
  const [activeTab, setActiveTab] = useState<'inputs' | 'executive' | 'technical' | 'content_backlinks' | 'schema_geo' | 'prompt_export'>('inputs');
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<TrafficLossAuditReport | null>(null);
  const [rawPromptText, setRawPromptText] = useState<string>('');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [presets, setPresets] = useState<any[]>([]);
  const [activeStepMessage, setActiveStepMessage] = useState<string>('');

  useEffect(() => {
    if (initialUrl && initialUrl !== inputs.websiteUrl) {
      setInputs((prev) => ({ ...prev, websiteUrl: initialUrl }));
    }
  }, [initialUrl]);

  useEffect(() => {
    if (isOpen) {
      axios.get('/api/traffic-loss-audit/presets')
        .then((res) => {
          if (res.data?.presets) {
            setPresets(res.data.presets);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof TrafficLossAuditInputs, value: any) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (changeKey: keyof TrafficLossAuditInputs['recentChanges'], checked: boolean) => {
    setInputs((prev) => ({
      ...prev,
      recentChanges: {
        ...prev.recentChanges,
        [changeKey]: checked,
      },
    }));
  };

  const loadPreset = (preset: any) => {
    if (preset?.data) {
      setInputs(preset.data);
      toast.success(`Loaded preset: ${preset.name}`);
    }
  };

  const runAudit = async () => {
    try {
      setLoading(true);
      setActiveStepMessage('Validating GSC & Analytics Telemetry...');
      setTimeout(() => setActiveStepMessage('Auditing Crawl Blockers & Schema Gaps...'), 1000);
      setTimeout(() => setActiveStepMessage('Analyzing AI Overviews, GEO Citations & Backlinks...'), 2200);
      setTimeout(() => setActiveStepMessage('Synthesizing Root Cause Prioritization Matrix...'), 3500);

      const res = await axios.post('/api/traffic-loss-audit/diagnose', inputs);
      if (res.data?.success && res.data?.report) {
        setReport(res.data.report);
        setActiveTab('executive');
        toast.success('Comprehensive Traffic Loss & AI Audit Completed!');
      } else {
        toast.error('Audit completed with warnings.');
      }
    } catch (err: any) {
      console.error('Audit execution failed:', err);
      toast.error('Failed to run audit diagnosis');
    } finally {
      setLoading(false);
      setActiveStepMessage('');
    }
  };

  const fetchPrompt = async () => {
    try {
      const res = await axios.post('/api/traffic-loss-audit/build-prompt', inputs);
      if (res.data?.prompt) {
        setRawPromptText(res.data.prompt);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = async (text: string, isPrompt: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isPrompt) {
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
      } else {
        setCopiedReport(true);
        setTimeout(() => setCopiedReport(false), 2000);
      }
      toast.success(isPrompt ? 'Prompt copied to clipboard!' : 'Audit Markdown copied!');
    } catch (e) {
      toast.error('Failed to copy');
    }
  };

  const downloadReportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Traffic-Loss-Audit-${report.websiteUrl.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-hidden font-sans">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-zinc-950 border-4 border-black shadow-[8px_8px_0_#000] flex flex-col rounded-xl overflow-hidden text-zinc-100">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 bg-black border-b-2 border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-[#ff4d00] text-black text-[10px] font-black uppercase tracking-wider font-mono">
                AISO/GEO v4.2 CONSULTANT
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold font-mono">
                BACKLINK + SCHEMA + AI VISIBILITY
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase mt-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ff4d00]" />
              Comprehensive SEO, Traffic Loss &amp; AI Search Visibility Audit
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Diagnose why a website is experiencing low, stagnant, declining, or zero traffic with prioritized root causes.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {report && (
              <button
                onClick={downloadReportJson}
                className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
                title="Download JSON Report"
              >
                <Download className="w-3.5 h-3.5 text-[#ff4d00]" />
                <span className="hidden sm:inline">Export JSON</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 bg-zinc-900 hover:bg-[#ff4d00] hover:text-black text-zinc-300 border border-zinc-700 rounded transition-colors"
              title="Close Audit Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRESET QUICK-LOAD BAR */}
        <div className="px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-zinc-400 uppercase font-mono flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-[#ff4d00]" />
              Quick Datasets:
            </span>
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-[11px] rounded transition-all"
              >
                {p.name}
              </button>
            ))}
            <button
              onClick={() => setInputs(DEFAULT_INPUTS)}
              className="px-2 py-1 text-zinc-400 hover:text-zinc-200 text-[11px] underline"
            >
              Reset to Default
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runAudit}
              disabled={loading}
              className="px-4 py-1.5 bg-[#ff4d00] hover:bg-[#ff6a00] text-black font-black uppercase text-xs tracking-wider shadow-[2px_2px_0_#000] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              {loading ? 'Diagnosing...' : 'Run Audit Diagnosis'}
            </button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-zinc-800 bg-black/60 overflow-x-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab('inputs')}
            className={`px-4 py-2.5 font-bold uppercase transition-colors whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
              activeTab === 'inputs'
                ? 'border-[#ff4d00] text-[#ff4d00] bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            1. Diagnostic Inputs
          </button>

          <button
            onClick={() => {
              if (!report) {
                runAudit();
              } else {
                setActiveTab('executive');
              }
            }}
            className={`px-4 py-2.5 font-bold uppercase transition-colors whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
              activeTab === 'executive'
                ? 'border-[#ff4d00] text-[#ff4d00] bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            2. Executive Summary &amp; Root Causes
          </button>

          <button
            onClick={() => {
              if (!report) runAudit();
              else setActiveTab('technical');
            }}
            className={`px-4 py-2.5 font-bold uppercase transition-colors whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
              activeTab === 'technical'
                ? 'border-[#ff4d00] text-[#ff4d00] bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            3. Technical &amp; Data Validation
          </button>

          <button
            onClick={() => {
              if (!report) runAudit();
              else setActiveTab('content_backlinks');
            }}
            className={`px-4 py-2.5 font-bold uppercase transition-colors whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
              activeTab === 'content_backlinks'
                ? 'border-[#ff4d00] text-[#ff4d00] bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            4. Content &amp; Backlink Profile
          </button>

          <button
            onClick={() => {
              if (!report) runAudit();
              else setActiveTab('schema_geo');
            }}
            className={`px-4 py-2.5 font-bold uppercase transition-colors whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
              activeTab === 'schema_geo'
                ? 'border-[#ff4d00] text-[#ff4d00] bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            5. Schema (15) &amp; GEO AI Visibility
          </button>

          <button
            onClick={() => {
              fetchPrompt();
              setActiveTab('prompt_export');
            }}
            className={`px-4 py-2.5 font-bold uppercase transition-colors whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
              activeTab === 'prompt_export'
                ? 'border-[#ff4d00] text-[#ff4d00] bg-zinc-900/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            6. Prompt &amp; Markdown Report
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* LOADING OVERLAY */}
          {loading && (
            <div className="py-16 text-center space-y-4">
              <div className="inline-block p-4 bg-black border-2 border-[#ff4d00] rounded-full animate-bounce">
                <Sparkles className="w-8 h-8 text-[#ff4d00]" />
              </div>
              <h3 className="text-base font-bold text-white uppercase font-mono">
                Senior SEO &amp; GEO Consultant Engine Working...
              </h3>
              <p className="text-xs text-[#ff4d00] font-mono animate-pulse font-bold">
                {activeStepMessage || 'Analyzing empirical inputs...'}
              </p>
              <div className="max-w-md mx-auto h-1.5 bg-zinc-900 rounded overflow-hidden">
                <div className="h-full bg-[#ff4d00] animate-pulse w-3/4 rounded" />
              </div>
            </div>
          )}

          {/* TAB 1: DIAGNOSTIC INPUTS */}
          {!loading && activeTab === 'inputs' && (
            <div className="space-y-6">
              
              {/* SECTION A: WEBSITE DETAILS */}
              <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-lg space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-black uppercase text-[#ff4d00] font-mono flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    Website Details
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Target Subject Overview</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Website URL</label>
                    <input
                      type="text"
                      value={inputs.websiteUrl}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-100 focus:border-[#ff4d00] outline-none"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Industry / Niche</label>
                    <input
                      type="text"
                      value={inputs.industryNiche}
                      onChange={(e) => handleInputChange('industryNiche', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-100 focus:border-[#ff4d00] outline-none"
                      placeholder="e.g. B2B SaaS / Career Tech"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Target Audience</label>
                    <input
                      type="text"
                      value={inputs.targetAudience}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-100 focus:border-[#ff4d00] outline-none"
                      placeholder="e.g. Technical Job Seekers"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Primary Traffic Goal</label>
                    <select
                      value={inputs.primaryTrafficGoal}
                      onChange={(e) => handleInputChange('primaryTrafficGoal', e.target.value as any)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-100 focus:border-[#ff4d00] outline-none"
                    >
                      <option value="Organic Search">Organic Search</option>
                      <option value="AI Search">AI Search (ChatGPT/Perplexity/Gemini)</option>
                      <option value="Referral">Referral Traffic</option>
                      <option value="Direct">Direct Brand Awareness</option>
                      <option value="Social">Social Channels</option>
                      <option value="Multi-Channel">Multi-Channel Growth</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Date Range Analyzed</label>
                    <input
                      type="text"
                      value={inputs.dateRangeAnalyzed}
                      onChange={(e) => handleInputChange('dateRangeAnalyzed', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-100 focus:border-[#ff4d00] outline-none"
                      placeholder="e.g. Last 90 Days vs Previous Period"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Website Description</label>
                    <input
                      type="text"
                      value={inputs.websiteDescription}
                      onChange={(e) => handleInputChange('websiteDescription', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-100 focus:border-[#ff4d00] outline-none"
                      placeholder="Describe what the website does..."
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: GOOGLE SEARCH CONSOLE DATA */}
              <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-lg space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-black uppercase text-amber-400 font-mono flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4" />
                    Google Search Console (GSC) Data
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Core Search Traffic Signals</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Total Clicks</label>
                    <input
                      type="number"
                      value={inputs.totalClicks}
                      onChange={(e) => handleInputChange('totalClicks', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-100 focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Click Change (%)</label>
                    <input
                      type="number"
                      value={inputs.clickChangePercent}
                      onChange={(e) => handleInputChange('clickChangePercent', e.target.value)}
                      className={`w-full px-3 py-1.5 bg-zinc-950 border rounded font-mono font-bold outline-none ${
                        Number(inputs.clickChangePercent) < 0
                          ? 'text-red-400 border-red-500/40'
                          : 'text-emerald-400 border-emerald-500/40'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Total Impressions</label>
                    <input
                      type="number"
                      value={inputs.totalImpressions}
                      onChange={(e) => handleInputChange('totalImpressions', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-100 focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Impression Change (%)</label>
                    <input
                      type="number"
                      value={inputs.impressionChangePercent}
                      onChange={(e) => handleInputChange('impressionChangePercent', e.target.value)}
                      className={`w-full px-3 py-1.5 bg-zinc-950 border rounded font-mono font-bold outline-none ${
                        Number(inputs.impressionChangePercent) < 0
                          ? 'text-red-400 border-red-500/40'
                          : 'text-emerald-400 border-emerald-500/40'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Average CTR (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={inputs.averageCtr}
                      onChange={(e) => handleInputChange('averageCtr', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-100 focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Average Position</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.averagePosition}
                      onChange={(e) => handleInputChange('averagePosition', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-100 focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Indexed Pages</label>
                    <input
                      type="number"
                      value={inputs.indexedPages}
                      onChange={(e) => handleInputChange('indexedPages', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-100 focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Coverage Errors</label>
                    <input
                      type="number"
                      value={inputs.coverageErrors}
                      onChange={(e) => handleInputChange('coverageErrors', e.target.value)}
                      className={`w-full px-3 py-1.5 bg-zinc-950 border rounded font-mono font-bold outline-none ${
                        Number(inputs.coverageErrors) > 0 ? 'text-amber-400 border-amber-500/40' : 'text-zinc-300 border-zinc-800'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: ANALYTICS & CHANNEL DATA */}
              <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-lg space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-black uppercase text-cyan-400 font-mono flex items-center gap-1.5">
                    <Database className="w-4 h-4" />
                    Analytics Channel Breakdown
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Sessions by Traffic Channel</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Total Users</label>
                    <input
                      type="number"
                      value={inputs.totalUsers}
                      onChange={(e) => handleInputChange('totalUsers', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Sessions</label>
                    <input
                      type="number"
                      value={inputs.sessions}
                      onChange={(e) => handleInputChange('sessions', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-emerald-400 mb-1">Organic Traffic</label>
                    <input
                      type="number"
                      value={inputs.organicTraffic}
                      onChange={(e) => handleInputChange('organicTraffic', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-emerald-400 font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Direct Traffic</label>
                    <input
                      type="number"
                      value={inputs.directTraffic}
                      onChange={(e) => handleInputChange('directTraffic', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Referral Traffic</label>
                    <input
                      type="number"
                      value={inputs.referralTraffic}
                      onChange={(e) => handleInputChange('referralTraffic', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Social Traffic</label>
                    <input
                      type="number"
                      value={inputs.socialTraffic}
                      onChange={(e) => handleInputChange('socialTraffic', e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-100 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION D: PAGES & KEYWORDS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-lg space-y-3 text-xs">
                  <h4 className="text-xs font-black uppercase text-zinc-300 font-mono">
                    Top Pages (High, Low &amp; Declines)
                  </h4>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-emerald-400 mb-1">Highest-Performing Pages</label>
                    <textarea
                      rows={2}
                      value={inputs.highestPerformingPages}
                      onChange={(e) => handleInputChange('highestPerformingPages', e.target.value)}
                      className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-200 outline-none text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-red-400 mb-1">Pages With Traffic Declines</label>
                    <textarea
                      rows={2}
                      value={inputs.pagesWithTrafficDeclines}
                      onChange={(e) => handleInputChange('pagesWithTrafficDeclines', e.target.value)}
                      className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-200 outline-none text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Lowest-Performing Pages</label>
                    <textarea
                      rows={2}
                      value={inputs.lowestPerformingPages}
                      onChange={(e) => handleInputChange('lowestPerformingPages', e.target.value)}
                      className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-200 outline-none text-[11px]"
                    />
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-lg space-y-3 text-xs">
                  <h4 className="text-xs font-black uppercase text-zinc-300 font-mono">
                    Top Queries, Search Keywords &amp; CTR
                  </h4>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                      Query Impressions, Clicks, CTR &amp; Rankings
                    </label>
                    <textarea
                      rows={8}
                      value={inputs.topQueriesAndKeywords}
                      onChange={(e) => handleInputChange('topQueriesAndKeywords', e.target.value)}
                      className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-200 outline-none text-[11px]"
                      placeholder="List search queries, impressions, clicks, CTR, and rankings..."
                    />
                  </div>
                </div>
              </div>

              {/* SECTION E: RECENT CHANGES & BACKLINK DATA */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-lg space-y-3 text-xs">
                  <h4 className="text-xs font-black uppercase text-purple-400 font-mono flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4" />
                    Recent Website Changes (Select All Applicable)
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {[
                      { key: 'websiteRedesign', label: 'Website redesign' },
                      { key: 'cmsMigration', label: 'CMS migration' },
                      { key: 'domainMigration', label: 'Domain migration' },
                      { key: 'hostingMigration', label: 'Hosting migration' },
                      { key: 'themeChanges', label: 'Theme changes' },
                      { key: 'robotsTxtModifications', label: 'robots.txt changes' },
                      { key: 'trackingCodeChanges', label: 'Tracking code changes' },
                      { key: 'sitemapUpdates', label: 'Sitemap updates' },
                      { key: 'canonicalUpdates', label: 'Canonical updates' },
                      { key: 'securityIssues', label: 'Security / malware' },
                      { key: 'manualPenalties', label: 'Manual penalties' },
                      { key: 'majorContentUpdates', label: 'Major content edits' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!inputs.recentChanges[item.key as keyof typeof inputs.recentChanges]}
                          onChange={(e) => handleCheckboxChange(item.key as any, e.target.checked)}
                          className="rounded bg-zinc-950 border-zinc-700 text-[#ff4d00] focus:ring-0"
                        />
                        <span className="text-zinc-300">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Migration / Change Details</label>
                    <textarea
                      rows={2}
                      value={inputs.recentChangesNotes}
                      onChange={(e) => handleInputChange('recentChangesNotes', e.target.value)}
                      className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-200 outline-none text-[11px]"
                      placeholder="Include details about redirection maps, staging headers, or date of release..."
                    />
                  </div>
                </div>

                {/* BACKLINK DATA */}
                <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-lg space-y-3 text-xs">
                  <h4 className="text-xs font-black uppercase text-emerald-400 font-mono flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" />
                    Backlink Profile Data
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Referring Domains</label>
                      <input
                        type="number"
                        value={inputs.referringDomains}
                        onChange={(e) => handleInputChange('referringDomains', e.target.value)}
                        className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-zinc-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Total Backlinks</label>
                      <input
                        type="number"
                        value={inputs.totalBacklinks}
                        onChange={(e) => handleInputChange('totalBacklinks', e.target.value)}
                        className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-zinc-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Authority Score (DA/DR)</label>
                      <input
                        type="number"
                        value={inputs.authorityMetrics}
                        onChange={(e) => handleInputChange('authorityMetrics', e.target.value)}
                        className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-emerald-400 font-bold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">New Links Gained</label>
                      <input
                        type="number"
                        value={inputs.newLinksGained}
                        onChange={(e) => handleInputChange('newLinksGained', e.target.value)}
                        className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-zinc-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Links Lost</label>
                      <input
                        type="number"
                        value={inputs.linksLost}
                        onChange={(e) => handleInputChange('linksLost', e.target.value)}
                        className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-red-400 font-bold outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Anchor Text Distribution</label>
                    <input
                      type="text"
                      value={inputs.anchorTextDistribution}
                      onChange={(e) => handleInputChange('anchorTextDistribution', e.target.value)}
                      className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-200 outline-none text-[11px]"
                      placeholder="Branded %, Exact Match %, Naked URL %..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Top Linking Pages</label>
                    <textarea
                      rows={2}
                      value={inputs.topLinkingPages}
                      onChange={(e) => handleInputChange('topLinkingPages', e.target.value)}
                      className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-200 outline-none text-[11px]"
                      placeholder="Top domains or directories linking to the website..."
                    />
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="p-4 bg-black border-2 border-zinc-800 rounded-lg flex items-center justify-between">
                <div className="text-xs text-zinc-400 font-mono">
                  Input data configured. Run diagnosis or view prompt.
                </div>
                <button
                  onClick={runAudit}
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#ff4d00] hover:bg-[#ff6a00] text-black font-black uppercase text-xs tracking-wider shadow-[3px_3px_0_#000] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  Generate Comprehensive Audit
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EXECUTIVE SUMMARY & ROOT CAUSES */}
          {!loading && report && activeTab === 'executive' && (
            <div className="space-y-6">
              
              {/* PRIMARY REASON CALLOUT */}
              <div className="p-5 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border-2 border-[#ff4d00] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-[#ff4d00] text-black font-black text-[10px] uppercase font-mono">
                    DIAGNOSTIC VERDICT // PRIMARY REASON
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    Recovery Potential: <span className={`font-black ${report.executiveSummary.recoveryPotential === 'High' ? 'text-emerald-400' : 'text-amber-400'}`}>{report.executiveSummary.recoveryPotential}</span>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  {report.executiveSummary.primaryReason}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded">
                    <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Top Backlink Opportunity</div>
                    <div className="text-xs font-bold text-emerald-400 mt-1">{report.executiveSummary.topBacklinkOpportunity}</div>
                  </div>
                  <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded">
                    <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Highest-Priority Schema</div>
                    <div className="text-xs font-bold text-cyan-400 mt-1">{report.executiveSummary.highestPrioritySchema}</div>
                  </div>
                  <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded">
                    <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Top AI Search Opportunity</div>
                    <div className="text-xs font-bold text-purple-400 mt-1">{report.executiveSummary.topAiSearchOpportunity}</div>
                  </div>
                </div>
              </div>

              {/* SECTION 9: ROOT CAUSE PRIORITIZATION TABLE */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-white font-mono flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-[#ff4d00]" />
                    9. Root Cause Prioritization Matrix
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Ranked from highest to lowest impact</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b-2 border-zinc-800 text-[10px] uppercase text-zinc-400">
                        <th className="py-2 px-2.5 w-12">Pri</th>
                        <th className="py-2 px-3">Root Cause</th>
                        <th className="py-2 px-3">Evidence</th>
                        <th className="py-2 px-3">Impact</th>
                        <th className="py-2 px-3 w-24">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {report.rootCausePrioritization.map((row) => (
                        <tr key={row.priority} className="hover:bg-zinc-950/50 transition-colors">
                          <td className="py-2.5 px-2.5 font-black text-[#ff4d00]">#{row.priority}</td>
                          <td className="py-2.5 px-3 font-bold text-white">{row.rootCause}</td>
                          <td className="py-2.5 px-3 text-zinc-300">{row.evidence}</td>
                          <td className="py-2.5 px-3 text-amber-300">{row.impact}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.confidence === 'High' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-300'
                            }`}>
                              {row.confidence}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* IF I OWNED THIS WEBSITE QUOTE */}
              <div className="p-5 bg-black border-2 border-zinc-800 rounded-xl space-y-3 font-mono">
                <div className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  Senior Consultant Direct Action Directive
                </div>
                <blockquote className="text-sm font-bold text-zinc-100 border-l-4 border-[#ff4d00] pl-3 py-0.5 italic">
                  "If I owned this website, the first five actions I would take tomorrow are..."
                </blockquote>
                <div className="space-y-2 pt-1 text-xs">
                  {report.executiveSummary.ifIOwnedThisWebsiteFiveActions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 bg-zinc-900/60 border border-zinc-800 rounded">
                      <span className="px-1.5 py-0.5 bg-[#ff4d00] text-black text-[10px] font-black shrink-0">
                        DAY 1
                      </span>
                      <span className="text-zinc-200 font-medium">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 10: RECOVERY & GROWTH ROADMAP */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-4 font-mono">
                <h4 className="text-xs font-black uppercase text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  10. Recovery &amp; Growth Roadmap
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
                    <div className="text-[11px] font-black text-[#ff4d00] uppercase">Immediate Actions (Days 1–3)</div>
                    <ul className="space-y-1.5 text-zinc-300 text-[11px]">
                      {report.recoveryRoadmap.immediateDays1To3.map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#ff4d00] font-bold">•</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
                    <div className="text-[11px] font-black text-amber-400 uppercase">Short-Term Actions (Weeks 1–2)</div>
                    <ul className="space-y-1.5 text-zinc-300 text-[11px]">
                      {report.recoveryRoadmap.shortTermWeeks1To2.map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
                    <div className="text-[11px] font-black text-cyan-400 uppercase">Mid-Term Actions (Weeks 3–8)</div>
                    <ul className="space-y-1.5 text-zinc-300 text-[11px]">
                      {report.recoveryRoadmap.midTermWeeks3To8.map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
                    <div className="text-[11px] font-black text-purple-400 uppercase">Long-Term Actions (2–6 Months)</div>
                    <ul className="space-y-1.5 text-zinc-300 text-[11px]">
                      {report.recoveryRoadmap.longTermMonths2To6.map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TECHNICAL & DATA VALIDATION */}
          {!loading && report && activeTab === 'technical' && (
            <div className="space-y-6">
              
              {/* SECTION 1: DATA VALIDATION */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-black uppercase text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    1. Data Validation &amp; Diagnosis
                  </h4>
                  <span className="text-[10px] text-zinc-500">Confirmed vs Hypothesized Factors</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {report.dataValidation.map((factor, idx) => {
                    const badgeColor =
                      factor.status === 'Confirmed'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : factor.status === 'Highly Likely'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : factor.status === 'Possible'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700';

                    return (
                      <div key={idx} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-200">{factor.factor}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold border rounded uppercase ${badgeColor}`}>
                            {factor.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">{factor.reasoning}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: TECHNICAL SEO AUDIT */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-black uppercase text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    2. Technical SEO Audit (Crawlability, Directives, Vitals &amp; Gaps)
                  </h4>
                  <span className="text-[10px] text-zinc-500">Rated Critical / High / Medium / Low</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-[10px] uppercase text-zinc-400">
                        <th className="py-2 px-3">Issue</th>
                        <th className="py-2 px-2.5 w-24">Rating</th>
                        <th className="py-2 px-3">Observed Condition</th>
                        <th className="py-2 px-3">Impact Assessment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {report.technicalSeoAudit.map((item, idx) => {
                        const ratingBadge =
                          item.rating === 'Critical'
                            ? 'bg-red-500/20 text-red-400 border-red-500/40'
                            : item.rating === 'High'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : item.rating === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700';

                        return (
                          <tr key={idx} className="hover:bg-zinc-950/50">
                            <td className="py-2.5 px-3 font-bold text-zinc-200">{item.issue}</td>
                            <td className="py-2.5 px-2.5">
                              <span className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase ${ratingBadge}`}>
                                {item.rating}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-zinc-300 text-[11px]">{item.description}</td>
                            <td className="py-2.5 px-3 text-zinc-400 text-[11px]">{item.impact}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTENT, SEARCH & BACKLINKS */}
          {!loading && report && activeTab === 'content_backlinks' && (
            <div className="space-y-6">
              
              {/* SECTION 3: CONTENT QUALITY */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-black uppercase text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    3. Content Quality &amp; Topical Authority Analysis
                  </h4>
                  <span className="text-[10px] text-zinc-500">EEAT &amp; Intent Alignment</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {report.contentQuality.assessments.map((c, i) => (
                    <div key={i} className="p-3 bg-zinc-950 border border-zinc-800 rounded space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-200">{c.factor}</span>
                        <span className={`px-1.5 py-0.2 text-[9px] font-bold border rounded uppercase ${
                          c.status === 'Problematic' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">{c.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-zinc-950 border border-purple-500/30 rounded-lg space-y-2">
                  <div className="text-[11px] font-bold text-purple-400 uppercase">Highest-Value Content Opportunities</div>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {report.contentQuality.highestValueContentOpportunities.map((o, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-purple-400 font-bold">{i + 1}.</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* SECTION 4: SEARCH PERFORMANCE & CTR CONTRIBUTIONS */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3 font-mono">
                <h4 className="text-xs font-black uppercase text-white flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-amber-400" />
                  4. Search Performance Analysis (Estimated Traffic Loss Contributors)
                </h4>

                <div className="space-y-2 text-xs">
                  {report.searchPerformance.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-zinc-950 border border-zinc-800 rounded space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-zinc-200">{item.factor}</span>
                        <span className="font-mono font-black text-[#ff4d00]">~{item.contributionPercent}% impact</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded overflow-hidden">
                        <div className="h-full bg-[#ff4d00]" style={{ width: `${item.contributionPercent * 2}%` }} />
                      </div>
                      <p className="text-[11px] text-zinc-400">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 5: BACKLINK PROFILE ANALYSIS */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-black uppercase text-white flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    5. Backlink Profile &amp; Domain Authority Analysis
                  </h4>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300">
                      Ref Domains: <strong>{report.backlinkProfile.referringDomainCount}</strong>
                    </span>
                    <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300">
                      Total Backlinks: <strong>{report.backlinkProfile.totalBacklinkCount}</strong>
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                      Authority Score: <strong>DA {report.backlinkProfile.authorityScore}</strong>
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-300 leading-relaxed">
                  <strong className="text-white">Profile Evaluation: </strong>
                  {report.backlinkProfile.qualitySummary}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded space-y-1.5">
                    <div className="text-[11px] font-bold text-red-400 uppercase">Major Weaknesses &amp; Link Risks</div>
                    <ul className="space-y-1 text-zinc-400 text-[11px]">
                      {report.backlinkProfile.majorWeaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-red-400 font-bold">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded space-y-1.5">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase">Prioritized Backlink Recommendations</div>
                    <ul className="space-y-1 text-zinc-300 text-[11px]">
                      {report.backlinkProfile.prioritizedRecommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SCHEMA & GEO VISIBILITY */}
          {!loading && report && activeTab === 'schema_geo' && (
            <div className="space-y-6">
              
              {/* SECTION 6: SCHEMA MARKUP & STRUCTURED DATA REVIEW */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-black uppercase text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    6. Schema Markup &amp; Structured Data Review (15 Schema Types)
                  </h4>
                  <span className="text-[10px] text-zinc-500">SEO &amp; AI Search Benefit Mapping</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {report.schemaMarkupReview.map((schema, idx) => (
                    <div key={idx} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[12px]">{schema.schemaType}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase ${
                          schema.priority.includes('P1') ? 'bg-[#ff4d00]/20 text-[#ff4d00] border-[#ff4d00]/40' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        }`}>
                          {schema.priority}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <div className="text-emerald-400">
                          <strong>SEO Benefit: </strong>{schema.seoBenefits}
                        </div>
                        <div className="text-purple-400">
                          <strong>AI Search Benefit: </strong>{schema.aiSearchBenefits}
                        </div>
                        <div className="text-zinc-400">
                          <strong>Action: </strong>{schema.implementationRecommendations}
                        </div>
                      </div>

                      {schema.exampleSnippet && (
                        <div className="pt-1">
                          <pre className="p-2 bg-black border border-zinc-800 rounded text-[10px] text-zinc-400 overflow-x-auto">
                            <code>{schema.exampleSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 7: AI SEARCH VISIBILITY & GEO */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-black uppercase text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-400" />
                    7. AI Search Visibility &amp; Generative Engine Optimization (GEO)
                  </h4>
                  <span className="text-[10px] text-purple-400 font-bold">Google AI Overviews • ChatGPT • Perplexity • Copilot • Gemini</span>
                </div>

                {/* PLATFORM READINESS SCORES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {report.aiSearchVisibility.platforms.map((p, idx) => (
                    <div key={idx} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
                      <div className="text-[11px] font-bold text-white">{p.platform}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-purple-400 font-mono">{p.scorePercent}%</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-zinc-900 text-zinc-300 rounded border border-zinc-700">
                          {p.visibilityPotential}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-tight">{p.observations}</p>
                    </div>
                  ))}
                </div>

                {/* BARRIERS PREVENTING CITATIONS */}
                <div className="p-3 bg-zinc-950 border border-red-500/30 rounded-lg space-y-1.5 text-xs">
                  <div className="text-[11px] font-bold text-red-400 uppercase">Barriers Preventing AI Citations</div>
                  <ul className="space-y-1 text-zinc-300 text-[11px]">
                    {report.aiSearchVisibility.barriersPreventingCitations.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-400 font-bold">✕</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SPECIFIC GEO RECOMMENDATIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded space-y-1">
                    <div className="text-[11px] font-bold text-cyan-400 uppercase">Content Structure for AI Extraction</div>
                    <ul className="space-y-1 text-zinc-400 text-[11px]">
                      {report.aiSearchVisibility.recommendations.contentStructure.map((r, i) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded space-y-1">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase">Entity &amp; Knowledge Graph Optimization</div>
                    <ul className="space-y-1 text-zinc-400 text-[11px]">
                      {report.aiSearchVisibility.recommendations.entityOptimization.map((r, i) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* SECTION 8: COMPETITIVE GAP ANALYSIS */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3 font-mono">
                <h4 className="text-xs font-black uppercase text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  8. Competitive Gap Analysis (Topical, Authority &amp; AI Citations)
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-[10px] uppercase text-zinc-400">
                        <th className="py-2 px-3">Dimension</th>
                        <th className="py-2 px-3">Your Website Status</th>
                        <th className="py-2 px-3">Competitor Benchmark</th>
                        <th className="py-2 px-3 w-28">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {report.competitiveGapAnalysis.map((gap, idx) => (
                        <tr key={idx} className="hover:bg-zinc-950/50">
                          <td className="py-2.5 px-3 font-bold text-zinc-200">{gap.dimension}</td>
                          <td className="py-2.5 px-3 text-zinc-300 text-[11px]">{gap.websiteStatus}</td>
                          <td className="py-2.5 px-3 text-zinc-400 text-[11px]">{gap.competitorBenchmark}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase ${
                              gap.severity === 'Critical Gap' ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            }`}>
                              {gap.severity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PROMPT & MARKDOWN EXPORT */}
          {!loading && activeTab === 'prompt_export' && (
            <div className="space-y-6 font-mono">
              
              {/* RAW CONSULTANT PROMPT AS REQUESTED */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-[#ff4d00]" />
                      Exact Consultant Prompt (With Dynamic Data)
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      The exact enhanced prompt requested by user covering backlink analysis, schema markup, and AI search visibility.
                    </p>
                  </div>

                  <button
                    onClick={() => copyToClipboard(rawPromptText || 'Prompt not loaded yet', true)}
                    className="px-3 py-1.5 bg-[#ff4d00] hover:bg-[#ff6a00] text-black font-black uppercase text-xs rounded flex items-center gap-1.5 transition-colors"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    rows={12}
                    readOnly
                    value={rawPromptText || 'Loading prompt...'}
                    className="w-full p-3 bg-black border border-zinc-800 rounded text-zinc-300 font-mono text-[11px] leading-relaxed outline-none"
                  />
                </div>
              </div>

              {/* COMPLETE RAW MARKDOWN REPORT */}
              {report && (
                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                        <FileCode className="w-4 h-4" />
                        Complete Audit Report (Markdown)
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Export-ready 11-section executive briefing.
                      </p>
                    </div>

                    <button
                      onClick={() => copyToClipboard(report.rawMarkdownReport, false)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase text-xs rounded flex items-center gap-1.5 transition-colors"
                    >
                      {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedReport ? 'Copied Markdown!' : 'Copy Markdown'}
                    </button>
                  </div>

                  <textarea
                    rows={14}
                    readOnly
                    value={report.rawMarkdownReport}
                    className="w-full p-3 bg-black border border-zinc-800 rounded text-zinc-300 font-mono text-[11px] leading-relaxed outline-none"
                  />
                </div>
              )}
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 sm:p-4 bg-black border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="text-zinc-500 text-[11px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Search Optimization (AISO/GEO) &amp; Technical SEO Diagnostic Engine v4.2</span>
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== 'inputs' && (
              <button
                onClick={() => setActiveTab('inputs')}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold uppercase text-[11px] rounded transition-colors"
              >
                Edit Inputs
              </button>
            )}

            <button
              onClick={runAudit}
              disabled={loading}
              className="px-4 py-1.5 bg-[#ff4d00] hover:bg-[#ff6a00] text-black font-black uppercase text-[11px] tracking-wider shadow-[2px_2px_0_#000] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              {loading ? 'Diagnosing...' : 'Re-Run Diagnosis'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
