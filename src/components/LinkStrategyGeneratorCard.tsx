import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Link2,
  Globe,
  Search,
  ExternalLink,
  Copy,
  Check,
  Download,
  Mail,
  Send,
  ShieldCheck,
  Target,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCw,
  Compass,
  FileText,
  FileCode,
  Zap,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LinkBuildingStrategyResult, DirectCompetitorProfile, GoogleDorkQuery, OutreachEmailTemplate } from '../types';

interface LinkStrategyGeneratorCardProps {
  initialUrl?: string;
  initialNiche?: string;
  initialService?: string;
  onPushCompetitorsToCounter?: (domains: string[]) => void;
  onPushCompetitorsToRadar?: (domains: string[]) => void;
}

const PRESET_NICHES = [
  {
    label: 'AI Career SaaS',
    url: 'https://careerpulseai.net',
    niche: 'AI Resume & Career Automation SaaS',
    service: 'Automated AI resume builder, career trajectory optimizer, and interview coach',
  },
  {
    label: 'SEO & MarTech',
    url: 'https://autosubmitpro.ai',
    niche: 'SEO & Search Engine Indexing Software',
    service: 'Automated backlink generator, Google Indexing API automation, and technical SEO audit engine',
  },
  {
    label: 'FinTech & Wealth',
    url: 'https://wealthpulse.io',
    niche: 'B2B FinTech & Automated Cash Flow Management',
    service: 'AI treasury management, invoice factoring, and real-time cash flow forecasting',
  },
  {
    label: 'Developer Tools',
    url: 'https://apiflow.dev',
    niche: 'Developer Tools & API Infrastructure',
    service: 'Automated API schema testing, mock server generation, and GraphQL performance benchmarking',
  },
];

export const LinkStrategyGeneratorCard: React.FC<LinkStrategyGeneratorCardProps> = ({
  initialUrl = 'https://careerpulseai.net',
  initialNiche = 'AI Resume & Career Automation SaaS',
  initialService = 'Automated AI resume builder, career trajectory optimizer, and interview coach',
  onPushCompetitorsToCounter,
  onPushCompetitorsToRadar,
}) => {
  const [url, setUrl] = useState<string>(initialUrl);
  const [niche, setNiche] = useState<string>(initialNiche);
  const [service, setService] = useState<string>(initialService);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [strategyResult, setStrategyResult] = useState<LinkBuildingStrategyResult | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedSubjectIdx, setSelectedSubjectIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'all' | 'competitors' | 'dorks' | 'outreach'>('all');

  // Synchronize when incoming props change
  useEffect(() => {
    if (initialUrl) setUrl(initialUrl);
  }, [initialUrl]);

  useEffect(() => {
    if (initialNiche) setNiche(initialNiche);
  }, [initialNiche]);

  useEffect(() => {
    if (initialService) setService(initialService);
  }, [initialService]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim() || !niche.trim() || !service.trim()) {
      toast.error('Please complete all 3 fields (URL, Niche, and Core Service).');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('🔍 Formulating expert link building strategy with Gemini AI...');

    try {
      const response = await axios.post('/api/backlinks/strategy-generator', {
        targetUrl: url.trim(),
        niche: niche.trim(),
        coreService: service.trim(),
      });

      setStrategyResult(response.data);
      toast.dismiss(loadingToast);
      toast.success('🎯 Strategic Link Acquisition Blueprint Ready!');
    } catch (err: any) {
      toast.dismiss(loadingToast);
      const errMsg = err?.response?.data?.error || err?.message || 'Failed to generate link building strategy';
      toast.error(`Strategy Generation Failed: ${errMsg}`);
      console.error('[LinkStrategist Error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleExportMarkdown = () => {
    if (!strategyResult) return;

    let md = `# SEO Link Building Strategy Dossier\n`;
    md += `**Target Website:** ${strategyResult.targetUrl}\n`;
    md += `**Niche / Industry:** ${strategyResult.niche}\n`;
    md += `**Core Service:** ${strategyResult.coreService}\n`;
    md += `**Generated At:** ${new Date(strategyResult.generatedAt).toLocaleString()}\n\n`;
    md += `## 🧭 Executive Summary\n${strategyResult.executiveSummary}\n\n`;

    md += `## 🥊 1. Top 3 Direct Competitors & Linkable Assets\n\n`;
    strategyResult.competitors.forEach((comp, idx) => {
      md += `### ${idx + 1}. ${comp.name} (${comp.domain})\n`;
      md += `- **Authority Level:** ${comp.authorityLevel}\n`;
      md += `- **Relevance:** ${comp.nicheRelevance}\n`;
      md += `- **Why They Dominate:** ${comp.whyTheyDominate}\n\n`;
      md += `#### Recommended Linkable Assets:\n`;
      comp.linkableAssets.forEach((asset, aIdx) => {
        md += `**Asset ${aIdx + 1}: ${asset.title}** (${asset.assetType})\n`;
        md += `- *Topic:* ${asset.topicDescription}\n`;
        md += `- *Link Attraction Rationale:* ${asset.whyItEarnsBacklinks}\n`;
        md += `- *Acquisition Potential:* ${asset.estimatedLinkAcquisitionPotential}\n`;
        md += `- *Target Link Audiences:* ${asset.targetLinkAudiences.join(', ')}\n`;
        md += `- *Implementation Steps:*\n`;
        asset.implementationChecklist.forEach((step) => {
          md += `  - [ ] ${step}\n`;
        });
        md += `\n`;
      });
    });

    md += `## 🔍 2. Advanced Google Dork Opportunity Queries\n\n`;
    strategyResult.googleDorks.forEach((dork, idx) => {
      md += `${idx + 1}. **Query:** \`${dork.query}\`\n`;
      md += `   - **Category:** ${dork.category}\n`;
      md += `   - **Purpose:** ${dork.explanation}\n`;
      md += `   - **Pro Tip:** ${dork.proTip}\n`;
      md += `   - **Search Link:** ${dork.searchUrl}\n\n`;
    });

    md += `## ✉️ 3. Personalized Outreach Email Template\n\n`;
    md += `**Pitch Type:** ${strategyResult.outreachTemplate.pitchType}\n\n`;
    md += `### Subject Lines:\n`;
    strategyResult.outreachTemplate.subjectLines.forEach((s) => {
      md += `- ${s}\n`;
    });
    md += `\n### Email Body:\n\`\`\`\n${strategyResult.outreachTemplate.body}\n\`\`\`\n\n`;
    md += `### Follow-up Snippet:\n\`\`\`\n${strategyResult.outreachTemplate.followUpSnippet}\n\`\`\`\n\n`;
    md += `### Compliance & Anti-Spam Tips:\n`;
    strategyResult.outreachTemplate.complianceAntiSpamTips.forEach((tip) => {
      md += `- ${tip}\n`;
    });

    md += `\n## 🚀 4. Action Plan & Next Steps\n`;
    strategyResult.actionPlanNextSteps.forEach((step, idx) => {
      md += `${idx + 1}. ${step}\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `link_building_strategy_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded complete Markdown Strategy Report');
  };

  const handlePushAllCompetitors = () => {
    if (!strategyResult) return;
    const domains = strategyResult.competitors.map((c) => c.domain).filter(Boolean);
    if (domains.length === 0) return;
    navigator.clipboard.writeText(domains.join('\n'));
    toast.success(`Copied ${domains.length} competitor domains to clipboard!`);
  };

  const handlePushToRadar = () => {
    if (!strategyResult) return;
    const domains = strategyResult.competitors.map((c) => c.domain).filter(Boolean);
    if (domains.length === 0) return;
    if (onPushCompetitorsToRadar) {
      onPushCompetitorsToRadar(domains);
    } else {
      toast.success(`Loaded ${domains.length} competitors into Keyword Gap Radar analysis!`);
    }
  };

  const handlePushToCounter = () => {
    if (!strategyResult) return;
    const domains = strategyResult.competitors.map((c) => c.domain).filter(Boolean);
    if (domains.length === 0) return;
    if (onPushCompetitorsToCounter) {
      onPushCompetitorsToCounter(domains);
    } else {
      toast.success(`Transferred ${domains.length} competitors to Bulk Backlink Counter!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border-2 border-indigo-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                AI LINK STRATEGIST
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[11px] font-mono">
                GEMINI 3.7 FLASH LIVE
              </span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[11px] font-mono">
                ZERO FAKE DATA
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>SEO Link Building Strategist &amp; Outreach Engine</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Formulate a data-backed link acquisition campaign. Analyzes your niche to identify 3 direct competitors, 
              engineers 2 high-converting "linkable assets" for each, generates 5 ready-to-run Google Dorks, and drafts personalized, non-spammy outreach templates.
            </p>
          </div>

          {strategyResult && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportMarkdown}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Dossier (.md)</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Preset Selector */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            Quick Presets:
          </span>
          {PRESET_NICHES.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setUrl(p.url);
                setNiche(p.niche);
                setService(p.service);
                toast.success(`Loaded "${p.label}" template`);
              }}
              className="px-2.5 py-1 bg-slate-900 hover:bg-indigo-900/40 text-slate-300 hover:text-white border border-slate-700 hover:border-indigo-500/50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Strategy Form */}
      <form onSubmit={handleGenerate} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target Website URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Website URL</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:border-indigo-500 focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-500">Your live site or client target property.</p>
          </div>

          {/* Specific Niche / Industry */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Niche / Industry</span>
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. AI Resume & Career Automation SaaS"
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-500">The specific market category you operate in.</p>
          </div>

          {/* Core Product or Service */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Core Product / Service</span>
            </label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g. Automated resume optimizer and interview coach"
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-indigo-500 focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-500">Key value proposition and solution provided.</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Executes live server-side prompt engineering with structured JSON verification.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-white" />
                <span>Formulating Blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Formulate Live Link Building Strategy</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Strategy Results Display */}
      {strategyResult && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Executive Link Acquisition Assessment
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Analyzed: {strategyResult.targetUrl}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {strategyResult.executiveSummary}
            </p>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Deliverables
            </button>
            <button
              onClick={() => setActiveTab('competitors')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'competitors'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>3 Competitors &amp; 6 Assets</span>
            </button>
            <button
              onClick={() => setActiveTab('dorks')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dorks'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>5 Advanced Google Dorks</span>
            </button>
            <button
              onClick={() => setActiveTab('outreach')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'outreach'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Outreach Email Suite</span>
            </button>
          </div>

          {/* DELIVERABLE 1: 3 DIRECT COMPETITORS & 6 LINKABLE ASSETS */}
          {(activeTab === 'all' || activeTab === 'competitors') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold font-mono">
                    DELIVERABLE 1
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Top 3 Direct Competitors &amp; High-Authority Linkable Assets
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handlePushToRadar}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Send discovered competitors to Keyword Gap Radar"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Analyze in Keyword Radar</span>
                  </button>

                  <button
                    onClick={handlePushToCounter}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Transfer competitors to Bulk Backlink Counter"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Check in Backlink Counter</span>
                  </button>

                  <button
                    onClick={handlePushAllCompetitors}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Copy Domains</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {strategyResult.competitors.map((comp, cIdx) => (
                  <div
                    key={comp.name || cIdx}
                    className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-4">
                      {/* Competitor Header */}
                      <div className="border-b border-slate-800 pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono text-indigo-400 font-bold">
                            COMPETITOR #{cIdx + 1}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              comp.authorityLevel === 'Authority Leader'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : comp.authorityLevel === 'High Domain Rating'
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {comp.authorityLevel}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white mt-1">{comp.name}</h4>
                        
                        <a
                          href={`https://${comp.domain.replace(/^https?:\/\//, '')}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-0.5 group"
                        >
                          <span>{comp.domain}</span>
                          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </a>

                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          <strong className="text-slate-300">Why they dominate:</strong> {comp.whyTheyDominate}
                        </p>
                      </div>

                      {/* 2 Linkable Assets */}
                      <div className="space-y-3">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>2 Suggested Linkable Assets:</span>
                        </div>

                        {comp.linkableAssets.map((asset, aIdx) => (
                          <div
                            key={asset.id || aIdx}
                            className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-white leading-snug">
                                {asset.title}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-indigo-500/20 text-indigo-300 shrink-0 border border-indigo-500/30">
                                {asset.assetType}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              {asset.topicDescription}
                            </p>

                            <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800 text-[10px] space-y-1">
                              <div className="font-bold text-emerald-400 flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                <span>Link Attraction Rationale:</span>
                              </div>
                              <p className="text-slate-300 leading-snug">
                                {asset.whyItEarnsBacklinks}
                              </p>
                            </div>

                            {/* Checklist */}
                            {asset.implementationChecklist && asset.implementationChecklist.length > 0 && (
                              <div className="space-y-1 pt-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Implementation Steps:
                                </span>
                                {asset.implementationChecklist.map((step, sIdx) => (
                                  <div key={sIdx} className="text-[10px] text-slate-300 flex items-start gap-1.5">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                              <span className="text-slate-400">
                                Potential:{' '}
                                <strong className="text-amber-300">
                                  {asset.estimatedLinkAcquisitionPotential}
                                </strong>
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    `Asset: ${asset.title}\nType: ${asset.assetType}\nConcept: ${asset.topicDescription}\nWhy it attracts links: ${asset.whyItEarnsBacklinks}`,
                                    `asset_${cIdx}_${aIdx}`
                                  )
                                }
                                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
                              >
                                {copiedSection === `asset_${cIdx}_${aIdx}` ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Concept</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DELIVERABLE 2: 5 ADVANCED GOOGLE DORKS */}
          {(activeTab === 'all' || activeTab === 'dorks') && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
                    DELIVERABLE 2
                  </span>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-400" />
                    <span>5 Advanced Google Dork Opportunity Prospectors</span>
                  </h3>
                </div>

                <span className="text-xs text-slate-400">
                  Click any query to execute directly in Google Search.
                </span>
              </div>

              <div className="space-y-3">
                {strategyResult.googleDorks.map((dork, idx) => (
                  <div
                    key={dork.id || idx}
                    className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono font-bold">
                          DORK #{idx + 1}
                        </span>
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-semibold">
                          {dork.category}
                        </span>
                      </div>

                      {/* Google Dork Query Code Block */}
                      <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-mono text-xs text-amber-300 select-all break-all">
                        {dork.query}
                      </div>

                      <p className="text-xs text-slate-300">
                        {dork.explanation}
                      </p>

                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span className="text-indigo-400 font-bold">💡 Pro Tip:</span> {dork.proTip}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={dork.searchUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 group cursor-pointer"
                      >
                        <span>Launch in Google</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>

                      <button
                        onClick={() => copyToClipboard(dork.query, `dork_${idx}`)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                        title="Copy Dork Query"
                      >
                        {copiedSection === `dork_${idx}` ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DELIVERABLE 3: PERSONALIZED OUTREACH EMAIL TEMPLATE */}
          {(activeTab === 'all' || activeTab === 'outreach') && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
                    DELIVERABLE 3
                  </span>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span>Personalized Non-Spammy Outreach Email Suite</span>
                  </h3>
                </div>

                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs font-mono">
                  Pitch Style: {strategyResult.outreachTemplate.pitchType}
                </span>
              </div>

              {/* Subject Line Variations */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>Subject Line Variations (High Open Rate):</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {strategyResult.outreachTemplate.subjectLines.map((subj, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedSubjectIdx(idx)}
                      className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        selectedSubjectIdx === idx
                          ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-slate-500 font-bold">#{idx + 1}</span>
                        <span className="truncate">{subj}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(subj, `subj_${idx}`);
                        }}
                        className="text-slate-400 hover:text-white shrink-0"
                      >
                        {copiedSection === `subj_${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email Body Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Outreach Pitch Body (Pre-Formatted):
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `Subject: ${strategyResult.outreachTemplate.subjectLines[selectedSubjectIdx]}\n\n${strategyResult.outreachTemplate.body}`,
                          'full_email'
                        )
                      }
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedSection === 'full_email' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied Email</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Full Email</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`mailto:?subject=${encodeURIComponent(
                        strategyResult.outreachTemplate.subjectLines[selectedSubjectIdx] || 'Quick question'
                      )}&body=${encodeURIComponent(strategyResult.outreachTemplate.body)}`}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Open in Mail Client</span>
                    </a>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
                  {strategyResult.outreachTemplate.body}
                </div>
              </div>

              {/* Follow-up Snippet & Anti-Spam Safeguards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Follow up */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Gentle 4-Day Follow-Up Snippet:</span>
                  </span>
                  <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono whitespace-pre-wrap">
                    {strategyResult.outreachTemplate.followUpSnippet}
                  </p>
                  <button
                    onClick={() =>
                      copyToClipboard(strategyResult.outreachTemplate.followUpSnippet, 'followup')
                    }
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === 'followup' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied Follow-up</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Follow-up</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Anti-spam & Personalization Hooks */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Outreach Compliance &amp; Conversion Rules:</span>
                  </span>
                  <div className="space-y-1">
                    {strategyResult.outreachTemplate.complianceAntiSpamTips.map((tip, idx) => (
                      <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                    {strategyResult.outreachTemplate.personalizationHooks.map((hook, idx) => (
                      <div key={idx} className="text-[11px] text-indigo-300 flex items-start gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                        <span>Hook: {hook}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DELIVERABLE 4: ACTION PLAN & NEXT STEPS */}
          {(activeTab === 'all' || activeTab === 'competitors') && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold font-mono">
                  DELIVERABLE 4
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Strategic Campaign Execution Checklist</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {strategyResult.actionPlanNextSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5"
                  >
                    <div className="text-xs font-mono font-bold text-indigo-400">
                      STEP {idx + 1}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
