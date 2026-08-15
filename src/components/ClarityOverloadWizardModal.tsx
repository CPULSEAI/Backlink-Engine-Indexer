import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Zap,
  TrendingUp,
  Copy,
  Check,
  Globe,
  Sliders,
  Award,
  Layers,
  Activity,
  ChevronRight,
  ExternalLink,
  Code,
  FileText,
  RotateCcw,
  Target,
  Brain,
  Eye,
  Crosshair,
  Gauge,
  ListOrdered,
  Lightbulb,
  MousePointerClick,
  Scale,
  Compass,
  Download,
  Flame,
} from 'lucide-react';
import {
  ClarityOverloadAuditResult,
  FeatureDecision,
  FeatureBloatItem,
} from '../types';

interface ClarityOverloadWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
}

const PRESET_URLS = [
  {
    name: 'CareerPulseAI (Current Platform)',
    url: 'https://careerpulseai.net',
    badge: 'Multi-Engine SaaS',
  },
  {
    name: 'Linear App',
    url: 'https://linear.app',
    badge: 'Minimalist SaaS',
  },
  {
    name: 'Teal HQ',
    url: 'https://tealhq.com',
    badge: 'Career Tech Competitor',
  },
  {
    name: 'Stripe',
    url: 'https://stripe.com',
    badge: 'Fintech Benchmark',
  },
];

const SCAN_PHASES = [
  { text: 'Initializing crawler & fetching page DOM structure...', duration: 800 },
  { text: 'Executing 5-Second Test comprehension simulator...', duration: 900 },
  { text: 'Scanning above-the-fold feature density & message hierarchy...', duration: 900 },
  { text: 'Detecting competing CTAs & decision paralysis risks...', duration: 850 },
  { text: 'Evaluating Feature Bloat matrix & customer transformation hooks...', duration: 950 },
  { text: 'Calculating Cognitive Load Index & AI Hero Rewrites...', duration: 850 },
];

export const ClarityOverloadWizardModal: React.FC<ClarityOverloadWizardModalProps> = ({
  isOpen,
  onClose,
  initialUrl = '',
}) => {
  // Wizard view mode: 'SETUP' | 'SCANNING' | 'REPORT'
  const [viewMode, setViewMode] = useState<'SETUP' | 'SCANNING' | 'REPORT'>('SETUP');
  const [activeStepTab, setActiveStepTab] = useState<number>(1); // 1 to 9
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [scanPhaseIdx, setScanPhaseIdx] = useState<number>(0);
  const [auditResult, setAuditResult] = useState<ClarityOverloadAuditResult | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedHero, setCopiedHero] = useState<boolean>(false);
  const [featureFilter, setFeatureFilter] = useState<string>('ALL');

  useEffect(() => {
    if (initialUrl && !targetUrl) {
      setTargetUrl(initialUrl);
    }
  }, [initialUrl]);

  if (!isOpen) return null;

  const handleStartAudit = async (overrideUrl?: string) => {
    const urlToTest = (overrideUrl || targetUrl || 'https://careerpulseai.net').trim();
    if (!urlToTest) {
      toast.error('Please provide a valid website URL.');
      return;
    }

    setTargetUrl(urlToTest);
    setViewMode('SCANNING');
    setScanPhaseIdx(0);

    let pIdx = 0;
    const interval = setInterval(() => {
      pIdx += 1;
      if (pIdx < SCAN_PHASES.length) {
        setScanPhaseIdx(pIdx);
      }
    }, 850);

    try {
      const resp = await axios.post('/api/cro/clarity-overload-audit', {
        targetUrl: urlToTest,
      });

      clearInterval(interval);
      if (resp.data && resp.data.audit) {
        setAuditResult(resp.data.audit);
        setViewMode('REPORT');
        setActiveStepTab(1);
        toast.success('Clarity Overload Audit completed successfully!');
      } else {
        throw new Error('No audit data received');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('[ClarityWizard] Audit error:', err);
      toast.error(err.response?.data?.error || 'Failed to complete Clarity Overload audit.');
      setViewMode('SETUP');
    }
  };

  const handleCopyPrompt = () => {
    if (!auditResult?.aiMasterPrompt) return;
    navigator.clipboard.writeText(auditResult.aiMasterPrompt);
    setCopiedPrompt(true);
    toast.success('AI Master Prompt copied to clipboard!');
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleCopyHero = () => {
    if (!auditResult?.homepageHeroRewrite) return;
    const hero = auditResult.homepageHeroRewrite;
    const text = `HEADLINE: ${hero.heroHeadline}
SUBHEADLINE: ${hero.subheadline}
PRIMARY CTA: ${hero.singlePrimaryCta}
MICRO-COPY: ${hero.guaranteeMicroCopy}
HERO VISUAL: ${hero.heroVisualFocus}`;
    navigator.clipboard.writeText(text);
    setCopiedHero(true);
    toast.success('Rewritten Hero Copy copied to clipboard!');
    setTimeout(() => setCopiedHero(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    if (!auditResult) return;
    const md = `# Clarity Overload CRO Audit Report
Target: ${auditResult.targetUrl}
Generated: ${new Date(auditResult.timestamp).toLocaleString()}
Overall Clarity Overload Score: ${auditResult.step8_CognitiveLoad.overallClarityOverloadScore}/100 (${auditResult.clarityRisk})

## Executive Summary
${auditResult.executiveSummary}

## Single Most Valuable Customer Outcome
> ${auditResult.singleMostValuableOutcome}

## 1. The 5-Second Test (Score: ${auditResult.step1_FiveSecondTest.score}/10)
- **What this company does:** ${auditResult.step1_FiveSecondTest.whatCompanyDoes}
- **Who it is for:** ${auditResult.step1_FiveSecondTest.whoItIsFor}
- **Primary problem solved:** ${auditResult.step1_FiveSecondTest.primaryProblemSolved}
- **Action visitors should take:** ${auditResult.step1_FiveSecondTest.actionVisitorsShouldTake}

## 2. Clarity Overload Metrics
- Features Above the Fold: ${auditResult.step2_ClarityOverload.featuresAboveTheFold}
- Competing Messages: ${auditResult.step2_ClarityOverload.competingMessagesCount}
- User Actions Presented: ${auditResult.step2_ClarityOverload.userActionsPresented}
- Distinct Value Props: ${auditResult.step2_ClarityOverload.distinctValuePropsCount}
- CTA Variations: ${auditResult.step2_ClarityOverload.ctaVariationsCount}
- Risk Assessment: ${auditResult.step2_ClarityOverload.riskSummary}

## 3. Feature Bloat Analysis & Recommendations
${auditResult.step4_FeatureBloat
  .map(
    (f) =>
      `### [${f.recommendation}] ${f.featureName}
- **Essential to conversion:** ${f.essentialToConversion ? 'YES' : 'NO'}
- **Causes confusion:** ${f.causesConfusion ? 'YES' : 'NO'}
- **Rationale:** ${f.rationale}
- **Recommended Outcome Benefit:** ${f.suggestedOutcomeBenefit}`
  )
  .join('\n\n')}

## 4. Homepage Hero Rewrite
- **Headline:** ${auditResult.homepageHeroRewrite.heroHeadline}
- **Subheadline:** ${auditResult.homepageHeroRewrite.subheadline}
- **Primary CTA:** ${auditResult.homepageHeroRewrite.singlePrimaryCta}
- **Guarantee Micro-copy:** ${auditResult.homepageHeroRewrite.guaranteeMicroCopy}
- **Visual Focus:** ${auditResult.homepageHeroRewrite.heroVisualFocus}

## 5. Prioritized Action Plan
${auditResult.prioritizedActionPlan.map((p) => `${p.step}. **${p.phase}:** ${p.focus} (Lift: ${p.expectedClarityLift})`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `clarity-overload-audit-${auditResult.targetDomain}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Markdown report downloaded.');
  };

  const filteredFeatures = auditResult?.step4_FeatureBloat.filter((f) => {
    if (featureFilter === 'ALL') return true;
    return f.recommendation === featureFilter;
  }) || [];

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'LOW OVERLOAD':
        return 'bg-emerald-100 text-emerald-900 border-emerald-500';
      case 'MEDIUM OVERLOAD':
        return 'bg-amber-100 text-amber-900 border-amber-500';
      case 'HIGH OVERLOAD':
        return 'bg-orange-100 text-orange-900 border-orange-600';
      case 'SEVERE OVERLOAD':
      default:
        return 'bg-rose-100 text-rose-900 border-rose-600';
    }
  };

  const getDecisionBadge = (rec: FeatureDecision) => {
    switch (rec) {
      case 'KEEP':
        return 'bg-emerald-100 text-emerald-800 border-emerald-400 font-bold';
      case 'SIMPLIFY':
        return 'bg-sky-100 text-sky-800 border-sky-400 font-bold';
      case 'DE-EMPHASIZE':
        return 'bg-amber-100 text-amber-800 border-amber-400 font-bold';
      case 'REMOVE':
        return 'bg-rose-100 text-rose-800 border-rose-400 font-bold';
    }
  };

  return (
    <div
      id="clarity-overload-wizard-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl bg-white border-2 border-black shadow-[6px_6px_0_#000] rounded-none my-auto flex flex-col max-h-[92vh] overflow-hidden">
        {/* MODAL HEADER */}
        <div className="bg-amber-400 border-b-2 border-black px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-black text-amber-400 p-1.5 border border-black shadow-[2px_2px_0_#000]">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-brutal font-extrabold text-black text-sm uppercase tracking-wide">
                  Clarity Overload CRO Audit Engine
                </span>
                <span className="bg-black text-white text-[10px] font-mono-brutal px-2 py-0.5 uppercase tracking-wider font-bold">
                  UX Psychology • 5-Second Test
                </span>
              </div>
              <p className="text-[11px] text-black/80 font-mono-brutal">
                Detect cognitive friction, feature bloat & competing CTAs on your landing page
              </p>
            </div>
          </div>

          <button
            id="close-clarity-wizard-btn"
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-colors"
            title="Close Audit"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: SETUP FORM */}
        {/* ========================================================================= */}
        {viewMode === 'SETUP' && (
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Context Banner */}
            <div className="bg-amber-50 border-2 border-black p-4 shadow-[3px_3px_0_#000]">
              <div className="flex items-start gap-3">
                <div className="bg-black text-amber-400 p-2 border border-black shrink-0 mt-0.5">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono-brutal font-bold text-sm text-black uppercase tracking-tight">
                    What is Clarity Overload?
                  </h4>
                  <p className="text-xs text-black/80 font-mono-brutal mt-1 leading-relaxed">
                    Clarity Overload occurs when visitors cannot understand within <strong>5 seconds</strong>:{' '}
                    <em>1) What the product does, 2) Who it is for, 3) Why it is better, and 4) What action to take next</em>.
                    When multiple features compete for attention, this audit recommends centering the homepage around the{' '}
                    <strong>single most valuable customer outcome</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Target URL Input Box */}
            <div className="bg-white border-2 border-black p-5 shadow-[3px_3px_0_#000] space-y-4">
              <label className="block font-mono-brutal text-xs font-bold text-black uppercase">
                Landing Page or SaaS Website URL to Audit:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
                  <input
                    id="clarity-audit-url-input"
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://careerpulseai.net or your landing page"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border-2 border-black font-mono-brutal text-xs focus:outline-none focus:bg-white focus:shadow-[2px_2px_0_#000]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleStartAudit();
                    }}
                  />
                </div>
                <button
                  id="start-clarity-audit-btn"
                  onClick={() => handleStartAudit()}
                  className="px-6 py-2.5 bg-black text-amber-400 hover:bg-amber-400 hover:text-black border-2 border-black font-mono-brutal font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Run Clarity Audit
                </button>
              </div>

              {/* Quick Presets */}
              <div className="pt-2">
                <span className="text-[11px] font-mono-brutal text-black/60 uppercase font-semibold block mb-2">
                  Quick Benchmark Presets:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {PRESET_URLS.map((preset) => (
                    <button
                      key={preset.url}
                      onClick={() => {
                        setTargetUrl(preset.url);
                        handleStartAudit(preset.url);
                      }}
                      className="p-2.5 bg-neutral-50 hover:bg-amber-100 border-2 border-black text-left shadow-[2px_2px_0_#000] transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono-brutal font-bold text-xs text-black group-hover:text-black">
                          {preset.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-mono-brutal bg-black text-white px-1.5 py-0.2">
                        {preset.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 9-Step Audit Protocol Overview */}
            <div className="bg-neutral-100 border-2 border-black p-4 shadow-[2px_2px_0_#000]">
              <h5 className="font-mono-brutal text-xs font-bold text-black uppercase mb-3 flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-black" />
                9-Phase Cognitive Friction Evaluation Protocol
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono-brutal">
                <div className="bg-white border border-black p-2">
                  <strong className="text-black block font-bold">1. The 5-Second Test</strong>
                  <span className="text-black/70 text-[11px]">Assess instant comprehension of what, who & why.</span>
                </div>
                <div className="bg-white border border-black p-2">
                  <strong className="text-black block font-bold">2. Clarity Overload Scan</strong>
                  <span className="text-black/70 text-[11px]">Count competing messages & above-fold density.</span>
                </div>
                <div className="bg-white border border-black p-2">
                  <strong className="text-black block font-bold">3. Message Hierarchy</strong>
                  <span className="text-black/70 text-[11px]">Isolate distracting sections & conflicting claims.</span>
                </div>
                <div className="bg-white border border-black p-2">
                  <strong className="text-black block font-bold">4. Feature Bloat Matrix</strong>
                  <span className="text-black/70 text-[11px]">Triage: Keep, Simplify, De-emphasize, Remove.</span>
                </div>
                <div className="bg-white border border-black p-2">
                  <strong className="text-black block font-bold">5. Competitor Comparison</strong>
                  <span className="text-black/70 text-[11px]">Identify what rivals explain faster & simpler.</span>
                </div>
                <div className="bg-white border border-black p-2">
                  <strong className="text-black block font-bold">6. UVP Distinctiveness</strong>
                  <span className="text-black/70 text-[11px]">Score unique edge vs generic feature claims.</span>
                </div>
                <div className="bg-white border border-black p-2">
                  <strong className="text-black block font-bold">7. CTA Decision Paralysis</strong>
                  <span className="text-black/70 text-[11px]">Evaluate button quantity, contrast & conflict.</span>
                </div>
                <div className="bg-white border border-black p-2">
                  <strong className="text-black block font-bold">8. Cognitive Load Score</strong>
                  <span className="text-black/70 text-[11px]">0-100 index across mental effort & visual load.</span>
                </div>
                <div className="bg-white border border-black p-2">
                  <strong className="text-black block font-bold">9. Action Plan & Hero Rewrite</strong>
                  <span className="text-black/70 text-[11px]">Single primary outcome copy & quick wins.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: SCANNING / LOADING STATE */}
        {/* ========================================================================= */}
        {viewMode === 'SCANNING' && (
          <div className="p-10 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative">
              <div className="w-16 h-16 bg-amber-400 border-2 border-black flex items-center justify-center shadow-[4px_4px_0_#000] animate-bounce">
                <Brain className="w-8 h-8 text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full animate-ping" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="font-mono-brutal text-base font-bold text-black uppercase tracking-tight">
                Auditing Landing Page for Cognitive Friction...
              </h3>
              <p className="text-xs font-mono-brutal text-black/70">
                Target: <span className="font-bold text-black underline">{targetUrl}</span>
              </p>
            </div>

            {/* Live Progress Bar */}
            <div className="w-full max-w-md bg-neutral-100 border-2 border-black h-4 shadow-[2px_2px_0_#000] overflow-hidden">
              <div
                className="bg-black h-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.round(((scanPhaseIdx + 1) / SCAN_PHASES.length) * 100)}%`,
                }}
              />
            </div>

            {/* Current Phase Message */}
            <div className="bg-amber-100 border-2 border-black px-4 py-2 shadow-[2px_2px_0_#000]">
              <span className="font-mono-brutal text-xs font-bold text-black flex items-center gap-2">
                <Activity className="w-4 h-4 animate-spin text-black" />
                {SCAN_PHASES[scanPhaseIdx]?.text || 'Processing audit metrics...'}
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: COMPREHENSIVE WIZARD REPORT */}
        {/* ========================================================================= */}
        {viewMode === 'REPORT' && auditResult && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Score Strip & Risk Gauge */}
            <div className="bg-neutral-100 border-b-2 border-black p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0_#000]">
                  <span className="text-[10px] font-mono-brutal text-black/60 uppercase block font-semibold">
                    Target Domain
                  </span>
                  <span className="font-mono-brutal text-xs font-bold text-black">
                    {auditResult.targetDomain}
                  </span>
                </div>

                <div
                  className={`border-2 px-3 py-1.5 shadow-[2px_2px_0_#000] ${getRiskBadgeColor(
                    auditResult.clarityRisk
                  )}`}
                >
                  <span className="text-[10px] font-mono-brutal uppercase block font-semibold">
                    Clarity Risk Level
                  </span>
                  <span className="font-mono-brutal text-xs font-black uppercase tracking-wider">
                    {auditResult.clarityRisk}
                  </span>
                </div>

                <div className="bg-black text-amber-400 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0_#000]">
                  <span className="text-[10px] font-mono-brutal text-amber-200 uppercase block font-semibold">
                    Cognitive Load Score
                  </span>
                  <span className="font-mono-brutal text-xs font-black">
                    {auditResult.step8_CognitiveLoad.overallClarityOverloadScore}/100
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="copy-master-prompt-btn"
                  onClick={handleCopyPrompt}
                  className="px-3 py-1.5 bg-white hover:bg-black hover:text-white border-2 border-black font-mono-brutal text-[11px] font-bold uppercase shadow-[2px_2px_0_#000] flex items-center gap-1.5 transition-colors"
                  title="Copy Master CRO Prompt"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedPrompt ? 'Prompt Copied' : 'AI Prompt'}
                </button>

                <button
                  id="download-md-report-btn"
                  onClick={handleDownloadMarkdown}
                  className="px-3 py-1.5 bg-white hover:bg-black hover:text-white border-2 border-black font-mono-brutal text-[11px] font-bold uppercase shadow-[2px_2px_0_#000] flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Markdown
                </button>

                <button
                  id="new-audit-btn"
                  onClick={() => setViewMode('SETUP')}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-black hover:text-amber-400 border-2 border-black font-mono-brutal text-[11px] font-bold uppercase shadow-[2px_2px_0_#000] flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Audit Another
                </button>
              </div>
            </div>

            {/* Core Outcome Focus Callout */}
            <div className="bg-amber-300 border-b-2 border-black px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-black shrink-0" />
                <span className="font-mono-brutal text-xs font-black text-black uppercase">
                  Single Most Valuable Outcome:
                </span>
                <span className="font-mono-brutal text-xs text-black font-medium">
                  "{auditResult.singleMostValuableOutcome}"
                </span>
              </div>
            </div>

            {/* 9-Step Interactive Wizard Navigation Tabs */}
            <div className="bg-neutral-200 border-b-2 border-black px-2 py-1.5 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-thin">
              {[
                { id: 1, label: '1. 5-Sec Test', icon: Eye },
                { id: 2, label: '2. Density & Risk', icon: Gauge },
                { id: 3, label: '3. Message Flow', icon: Layers },
                { id: 4, label: '4. Feature Bloat', icon: Sliders },
                { id: 5, label: '5. Competitors', icon: Scale },
                { id: 6, label: '6. UVP Test', icon: Crosshair },
                { id: 7, label: '7. CTA Paralysis', icon: MousePointerClick },
                { id: 8, label: '8. Cognitive Load', icon: Brain },
                { id: 9, label: '9. Action Plan & Hero', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeStepTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStepTab(tab.id)}
                    className={`px-3 py-1.5 font-mono-brutal text-[11px] font-bold uppercase whitespace-nowrap border-2 border-black transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-black text-amber-400 shadow-[2px_2px_0_#000] -translate-y-0.5'
                        : 'bg-white text-black hover:bg-neutral-100 shadow-[1px_1px_0_#000]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* ACTIVE STEP CONTENT CONTAINER */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* ================================================================= */}
              {/* STEP 1: 5-SECOND TEST */}
              {/* ================================================================= */}
              {activeStepTab === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    <div>
                      <h3 className="font-mono-brutal font-black text-sm text-black uppercase">
                        Step 1: The 5-Second Comprehension Test
                      </h3>
                      <p className="text-xs text-black/70 font-mono-brutal">
                        Can a first-time visitor understand your product within 5 seconds of landing?
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0_#000]">
                      <span className="text-[10px] font-mono-brutal text-black/60 uppercase font-bold">
                        Score
                      </span>
                      <span className="font-mono-brutal text-sm font-black text-black">
                        {auditResult.step1_FiveSecondTest.score}/10
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-3">
                      <div className="flex items-center gap-2 text-black font-mono-brutal font-bold text-xs uppercase">
                        <span className="w-5 h-5 bg-black text-white flex items-center justify-center text-[10px]">
                          1
                        </span>
                        What does this company do?
                      </div>
                      <p className="text-xs font-mono-brutal text-black/80 bg-neutral-50 p-2.5 border border-black/30">
                        {auditResult.step1_FiveSecondTest.whatCompanyDoes}
                      </p>
                    </div>

                    <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-3">
                      <div className="flex items-center gap-2 text-black font-mono-brutal font-bold text-xs uppercase">
                        <span className="w-5 h-5 bg-black text-white flex items-center justify-center text-[10px]">
                          2
                        </span>
                        Who is the product for?
                      </div>
                      <p className="text-xs font-mono-brutal text-black/80 bg-neutral-50 p-2.5 border border-black/30">
                        {auditResult.step1_FiveSecondTest.whoItIsFor}
                      </p>
                    </div>

                    <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-3">
                      <div className="flex items-center gap-2 text-black font-mono-brutal font-bold text-xs uppercase">
                        <span className="w-5 h-5 bg-black text-white flex items-center justify-center text-[10px]">
                          3
                        </span>
                        What primary problem does it solve?
                      </div>
                      <p className="text-xs font-mono-brutal text-black/80 bg-neutral-50 p-2.5 border border-black/30">
                        {auditResult.step1_FiveSecondTest.primaryProblemSolved}
                      </p>
                    </div>

                    <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-3">
                      <div className="flex items-center gap-2 text-black font-mono-brutal font-bold text-xs uppercase">
                        <span className="w-5 h-5 bg-black text-white flex items-center justify-center text-[10px]">
                          4
                        </span>
                        What action should visitors take next?
                      </div>
                      <p className="text-xs font-mono-brutal text-black/80 bg-neutral-50 p-2.5 border border-black/30">
                        {auditResult.step1_FiveSecondTest.actionVisitorsShouldTake}
                      </p>
                    </div>
                  </div>

                  {auditResult.step1_FiveSecondTest.unclearExplanation && (
                    <div className="bg-amber-50 border-2 border-black p-4 shadow-[3px_3px_0_#000]">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-mono-brutal font-bold text-xs text-black uppercase">
                            Why this page causes 5-Second Friction:
                          </h4>
                          <p className="text-xs font-mono-brutal text-black/80 mt-1">
                            {auditResult.step1_FiveSecondTest.unclearExplanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================================================================= */}
              {/* STEP 2: CLARITY OVERLOAD DETECTION */}
              {/* ================================================================= */}
              {activeStepTab === 2 && (
                <div className="space-y-5">
                  <div className="border-b-2 border-black pb-2">
                    <h3 className="font-mono-brutal font-black text-sm text-black uppercase">
                      Step 2: Above-the-Fold Density & Clutter Detection
                    </h3>
                    <p className="text-xs text-black/70 font-mono-brutal">
                      Evaluation of feature volume, conflicting claims, and action density before scrolling.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="bg-white border-2 border-black p-3 text-center shadow-[2px_2px_0_#000]">
                      <span className="text-[10px] font-mono-brutal text-black/60 uppercase block font-semibold">
                        Features Above Fold
                      </span>
                      <span className="font-mono-brutal text-2xl font-black text-black">
                        {auditResult.step2_ClarityOverload.featuresAboveTheFold}
                      </span>
                      <span className="text-[9px] font-mono-brutal text-rose-600 block mt-1">
                        Recommended: Max 1-2
                      </span>
                    </div>

                    <div className="bg-white border-2 border-black p-3 text-center shadow-[2px_2px_0_#000]">
                      <span className="text-[10px] font-mono-brutal text-black/60 uppercase block font-semibold">
                        Competing Messages
                      </span>
                      <span className="font-mono-brutal text-2xl font-black text-black">
                        {auditResult.step2_ClarityOverload.competingMessagesCount}
                      </span>
                      <span className="text-[9px] font-mono-brutal text-rose-600 block mt-1">
                        Recommended: 1 Core Hook
                      </span>
                    </div>

                    <div className="bg-white border-2 border-black p-3 text-center shadow-[2px_2px_0_#000]">
                      <span className="text-[10px] font-mono-brutal text-black/60 uppercase block font-semibold">
                        User Actions Presented
                      </span>
                      <span className="font-mono-brutal text-2xl font-black text-black">
                        {auditResult.step2_ClarityOverload.userActionsPresented}
                      </span>
                      <span className="text-[9px] font-mono-brutal text-amber-600 block mt-1">
                        Recommended: 1 Primary CTA
                      </span>
                    </div>

                    <div className="bg-white border-2 border-black p-3 text-center shadow-[2px_2px_0_#000]">
                      <span className="text-[10px] font-mono-brutal text-black/60 uppercase block font-semibold">
                        Distinct UVPs
                      </span>
                      <span className="font-mono-brutal text-2xl font-black text-black">
                        {auditResult.step2_ClarityOverload.distinctValuePropsCount}
                      </span>
                      <span className="text-[9px] font-mono-brutal text-black/60 block mt-1">
                        Recommended: 1
                      </span>
                    </div>

                    <div className="bg-white border-2 border-black p-3 text-center shadow-[2px_2px_0_#000]">
                      <span className="text-[10px] font-mono-brutal text-black/60 uppercase block font-semibold">
                        CTA Variations
                      </span>
                      <span className="font-mono-brutal text-2xl font-black text-black">
                        {auditResult.step2_ClarityOverload.ctaVariationsCount}
                      </span>
                      <span className="text-[9px] font-mono-brutal text-black/60 block mt-1">
                        Recommended: 1
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-2">
                    <h4 className="font-mono-brutal font-bold text-xs text-black uppercase flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      Clarity Overload Risk Assessment Summary:
                    </h4>
                    <p className="text-xs font-mono-brutal text-black/80 leading-relaxed">
                      {auditResult.step2_ClarityOverload.riskSummary}
                    </p>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* STEP 3: MESSAGE HIERARCHY ANALYSIS */}
              {/* ================================================================= */}
              {activeStepTab === 3 && (
                <div className="space-y-5">
                  <div className="border-b-2 border-black pb-2">
                    <h3 className="font-mono-brutal font-black text-sm text-black uppercase">
                      Step 3: Message Hierarchy & Distraction Identification
                    </h3>
                    <p className="text-xs text-black/70 font-mono-brutal">
                      Which messages command the page, and which sections actively sabotage conversion focus?
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Primary Message */}
                    <div className="bg-emerald-50 border-2 border-black p-4 shadow-[3px_3px_0_#000]">
                      <span className="bg-emerald-700 text-white text-[10px] font-mono-brutal font-bold px-2 py-0.5 uppercase tracking-wider">
                        Current Primary Hero Message
                      </span>
                      <p className="text-xs font-mono-brutal text-emerald-950 font-bold mt-2">
                        "{auditResult.step3_MessageHierarchy.primaryMessage}"
                      </p>
                    </div>

                    {/* Secondary vs Distracting */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-2">
                        <span className="font-mono-brutal text-xs font-bold text-black uppercase block">
                          Secondary Competing Messages:
                        </span>
                        <ul className="space-y-2 text-xs font-mono-brutal text-black/80">
                          {auditResult.step3_MessageHierarchy.secondaryMessages.map((msg, i) => (
                            <li key={i} className="flex items-start gap-2 bg-neutral-50 p-2 border border-black/20">
                              <span className="text-sky-600 font-bold">•</span>
                              {msg}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-rose-50 border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-2">
                        <span className="font-mono-brutal text-xs font-bold text-rose-900 uppercase block">
                          Distracting Messages (High Cognitive Friction):
                        </span>
                        <ul className="space-y-2 text-xs font-mono-brutal text-rose-950">
                          {auditResult.step3_MessageHierarchy.distractingMessages.map((msg, i) => (
                            <li key={i} className="flex items-start gap-2 bg-white p-2 border border-rose-300">
                              <span className="text-rose-600 font-bold">✕</span>
                              {msg}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Distraction Sections Triage */}
                    {auditResult.step3_MessageHierarchy.distractionSections.length > 0 && (
                      <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-3">
                        <h4 className="font-mono-brutal font-bold text-xs text-black uppercase">
                          Specific Page Sections Acting as Distractions:
                        </h4>
                        <div className="space-y-2">
                          {auditResult.step3_MessageHierarchy.distractionSections.map((sec, i) => (
                            <div
                              key={i}
                              className="p-3 bg-neutral-50 border-2 border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                            >
                              <div>
                                <span className="font-mono-brutal font-bold text-xs text-black">
                                  {sec.sectionName}
                                </span>
                                <p className="text-[11px] font-mono-brutal text-black/70 mt-0.5">
                                  {sec.whyItDistracts}
                                </p>
                              </div>
                              <span
                                className={`text-[10px] font-mono-brutal font-bold px-2 py-0.5 border ${
                                  sec.impact === 'HIGH'
                                    ? 'bg-rose-100 text-rose-900 border-rose-500'
                                    : 'bg-amber-100 text-amber-900 border-amber-500'
                                }`}
                              >
                                {sec.impact} Friction
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* STEP 4: FEATURE BLOAT ANALYSIS MATRIX */}
              {/* ================================================================= */}
              {activeStepTab === 4 && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-2">
                    <div>
                      <h3 className="font-mono-brutal font-black text-sm text-black uppercase">
                        Step 4: Feature Bloat & Triage Matrix
                      </h3>
                      <p className="text-xs text-black/70 font-mono-brutal">
                        Audit each feature: Is it essential to conversion, or does it cause confusion?
                      </p>
                    </div>

                    {/* Filter buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['ALL', 'KEEP', 'SIMPLIFY', 'DE-EMPHASIZE', 'REMOVE'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setFeatureFilter(f)}
                          className={`px-2.5 py-1 font-mono-brutal text-[10px] font-bold uppercase border border-black ${
                            featureFilter === f
                              ? 'bg-black text-amber-400 shadow-[1px_1px_0_#000]'
                              : 'bg-white text-black hover:bg-neutral-100'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feature Cards Grid */}
                  <div className="space-y-3">
                    {filteredFeatures.map((feat) => (
                      <div
                        key={feat.id}
                        className="bg-white border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-mono-brutal px-2.5 py-0.5 border ${getDecisionBadge(
                                feat.recommendation
                              )}`}
                            >
                              ACTION: {feat.recommendation}
                            </span>
                            <h4 className="font-mono-brutal font-bold text-xs text-black">
                              {feat.featureName}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] font-mono-brutal">
                            <span
                              className={`px-2 py-0.5 border ${
                                feat.essentialToConversion
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                  : 'bg-neutral-100 text-black/60 border-black/20'
                              }`}
                            >
                              Essential: {feat.essentialToConversion ? 'YES' : 'NO'}
                            </span>
                            <span
                              className={`px-2 py-0.5 border ${
                                feat.causesConfusion
                                  ? 'bg-rose-100 text-rose-900 border-rose-400'
                                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              }`}
                            >
                              Causes Confusion: {feat.causesConfusion ? 'YES' : 'NO'}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs font-mono-brutal text-black/70">
                          {feat.description}
                        </p>

                        <div className="bg-neutral-50 p-2.5 border border-black/30 space-y-1.5">
                          <div className="text-[11px] font-mono-brutal text-black">
                            <strong className="text-black">CRO Rationale:</strong> {feat.rationale}
                          </div>
                          <div className="text-[11px] font-mono-brutal text-emerald-900">
                            <strong className="text-emerald-950">Recommended Customer Outcome Benefit:</strong>{' '}
                            "{feat.suggestedOutcomeBenefit}"
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* STEP 5: COMPETITOR BENCHMARK */}
              {/* ================================================================= */}
              {activeStepTab === 5 && (
                <div className="space-y-5">
                  <div className="border-b-2 border-black pb-2">
                    <h3 className="font-mono-brutal font-black text-sm text-black uppercase">
                      Step 5: Competitor Clarity Benchmark
                    </h3>
                    <p className="text-xs text-black/70 font-mono-brutal">
                      What category leaders explain faster, simpler, and with higher conversion velocity.
                    </p>
                  </div>

                  <div className="bg-white border-2 border-black p-5 shadow-[3px_3px_0_#000] space-y-4">
                    <div className="bg-black text-white p-3 font-mono-brutal text-xs font-bold uppercase flex items-center justify-between">
                      <span>Benchmark Reference: {auditResult.step5_CompetitorComparison.competitorName}</span>
                      <Scale className="w-4 h-4 text-amber-400" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-neutral-50 border-2 border-black p-3 space-y-1.5 shadow-[2px_2px_0_#000]">
                        <span className="text-[10px] font-mono-brutal font-bold uppercase text-black/60 block">
                          What They Communicate Better
                        </span>
                        <p className="text-xs font-mono-brutal text-black">
                          {auditResult.step5_CompetitorComparison.whatTheyCommunicateBetter}
                        </p>
                      </div>

                      <div className="bg-neutral-50 border-2 border-black p-3 space-y-1.5 shadow-[2px_2px_0_#000]">
                        <span className="text-[10px] font-mono-brutal font-bold uppercase text-black/60 block">
                          What They Explain Faster
                        </span>
                        <p className="text-xs font-mono-brutal text-black">
                          {auditResult.step5_CompetitorComparison.whatTheyExplainFaster}
                        </p>
                      </div>

                      <div className="bg-neutral-50 border-2 border-black p-3 space-y-1.5 shadow-[2px_2px_0_#000]">
                        <span className="text-[10px] font-mono-brutal font-bold uppercase text-black/60 block">
                          What They Simplify More
                        </span>
                        <p className="text-xs font-mono-brutal text-black">
                          {auditResult.step5_CompetitorComparison.whatTheySimplifyMoreEffectively}
                        </p>
                      </div>
                    </div>

                    <div className="bg-amber-50 border-2 border-black p-4 shadow-[2px_2px_0_#000]">
                      <h5 className="font-mono-brutal text-xs font-bold text-black uppercase flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-700" />
                        Your Hidden Differentiator to Spotlight:
                      </h5>
                      <p className="text-xs font-mono-brutal text-black/80 mt-1">
                        {auditResult.step5_CompetitorComparison.hiddenDifferentiator}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* STEP 6: UNIQUE VALUE PROPOSITION (UVP) TEST */}
              {/* ================================================================= */}
              {activeStepTab === 6 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    <div>
                      <h3 className="font-mono-brutal font-black text-sm text-black uppercase">
                        Step 6: Unique Value Proposition (UVP) Distinctiveness Test
                      </h3>
                      <p className="text-xs text-black/70 font-mono-brutal">
                        Why choose this product instead of alternatives?
                      </p>
                    </div>
                    <div className="bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0_#000]">
                      <span className="text-[10px] font-mono-brutal text-black/60 uppercase font-bold mr-2">
                        UVP Score
                      </span>
                      <span className="font-mono-brutal text-sm font-black text-black">
                        {auditResult.step6_UvpTest.score}/10
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-2">
                      <span className="text-[10px] font-mono-brutal font-bold uppercase text-black/60 block">
                        Current UVP Articulated on Page:
                      </span>
                      <p className="text-xs font-mono-brutal text-black bg-neutral-50 p-2.5 border border-black/30">
                        "{auditResult.step6_UvpTest.currentUvp}"
                      </p>
                    </div>

                    <div className="bg-rose-50 border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-2">
                      <span className="text-[10px] font-mono-brutal font-bold uppercase text-rose-900 block">
                        What is Missing from the UVP:
                      </span>
                      <p className="text-xs font-mono-brutal text-rose-950">
                        {auditResult.step6_UvpTest.missingUvp}
                      </p>
                    </div>

                    <div className="bg-emerald-50 border-2 border-black p-5 shadow-[3px_3px_0_#000] space-y-2">
                      <span className="text-[10px] font-mono-brutal font-bold uppercase text-emerald-900 block">
                        Recommended High-Converting UVP Formula:
                      </span>
                      <p className="text-xs font-mono-brutal text-emerald-950 font-bold bg-white p-3 border-2 border-emerald-600">
                        "{auditResult.step6_UvpTest.recommendedUvp}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* STEP 7: CTA CLARITY & DECISION PARALYSIS */}
              {/* ================================================================= */}
              {activeStepTab === 7 && (
                <div className="space-y-5">
                  <div className="border-b-2 border-black pb-2">
                    <h3 className="font-mono-brutal font-black text-sm text-black uppercase">
                      Step 7: Call-to-Action (CTA) Clarity & Decision Paralysis
                    </h3>
                    <p className="text-xs text-black/70 font-mono-brutal">
                      Are multiple buttons causing Hick's Law decision paralysis?
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white border-2 border-black p-3 text-center shadow-[2px_2px_0_#000]">
                      <span className="text-[10px] font-mono-brutal text-black/60 uppercase block font-semibold">
                        Visibility
                      </span>
                      <span className="font-mono-brutal text-sm font-black text-black">
                        {auditResult.step7_CtaClarity.visibilityRating}
                      </span>
                    </div>

                    <div className="bg-white border-2 border-black p-3 text-center shadow-[2px_2px_0_#000]">
                      <span className="text-[10px] font-mono-brutal text-black/60 uppercase block font-semibold">
                        Relevance
                      </span>
                      <span className="font-mono-brutal text-sm font-black text-black">
                        {auditResult.step7_CtaClarity.relevanceRating}
                      </span>
                    </div>

                    <div className="bg-white border-2 border-black p-3 text-center shadow-[2px_2px_0_#000]">
                      <span className="text-[10px] font-mono-brutal text-black/60 uppercase block font-semibold">
                        Quantity Score
                      </span>
                      <span className="font-mono-brutal text-sm font-black text-black">
                        {auditResult.step7_CtaClarity.quantityScore}/10
                      </span>
                    </div>

                    <div
                      className={`border-2 p-3 text-center shadow-[2px_2px_0_#000] ${
                        auditResult.step7_CtaClarity.causesDecisionParalysis
                          ? 'bg-rose-100 border-rose-600 text-rose-900'
                          : 'bg-emerald-100 border-emerald-600 text-emerald-900'
                      }`}
                    >
                      <span className="text-[10px] font-mono-brutal uppercase block font-semibold">
                        Decision Paralysis
                      </span>
                      <span className="font-mono-brutal text-xs font-black uppercase">
                        {auditResult.step7_CtaClarity.causesDecisionParalysis ? 'FLAGGED (HIGH)' : 'MINIMAL'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-2">
                      <span className="text-[10px] font-mono-brutal font-bold uppercase text-black/60 block">
                        Current Dispersed CTAs:
                      </span>
                      <div className="bg-neutral-50 p-3 border border-black/30 font-mono-brutal text-xs text-black">
                        {auditResult.step7_CtaClarity.primaryCtaText}
                      </div>
                      {auditResult.step7_CtaClarity.paralysisExplanation && (
                        <p className="text-[11px] font-mono-brutal text-rose-700">
                          {auditResult.step7_CtaClarity.paralysisExplanation}
                        </p>
                      )}
                    </div>

                    <div className="bg-emerald-50 border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-2">
                      <span className="text-[10px] font-mono-brutal font-bold uppercase text-emerald-900 block">
                        Recommended Single High-Intent CTA:
                      </span>
                      <div className="bg-black text-amber-400 p-3 border-2 border-black font-mono-brutal text-xs font-bold text-center uppercase tracking-wide">
                        {auditResult.step7_CtaClarity.suggestedCtaText}
                      </div>
                      <p className="text-[11px] font-mono-brutal text-emerald-900">
                        Focus 100% of above-the-fold traffic into this single conversion funnel.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* STEP 8: COGNITIVE LOAD SCORE RADAR */}
              {/* ================================================================= */}
              {activeStepTab === 8 && (
                <div className="space-y-5">
                  <div className="border-b-2 border-black pb-2">
                    <h3 className="font-mono-brutal font-black text-sm text-black uppercase">
                      Step 8: Overall Cognitive Load & Friction Scorecard
                    </h3>
                    <p className="text-xs text-black/70 font-mono-brutal">
                      0-100 scale measuring mental effort required to understand and act on the landing page.
                    </p>
                  </div>

                  {/* Main Gauge Banner */}
                  <div className="bg-black text-white p-6 border-2 border-black shadow-[4px_4px_0_#000] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                    <div>
                      <span className="text-[11px] font-mono-brutal text-amber-400 uppercase tracking-widest block font-bold">
                        Cognitive Overload Index
                      </span>
                      <div className="font-mono-brutal text-4xl font-black text-white mt-1">
                        {auditResult.step8_CognitiveLoad.overallClarityOverloadScore}
                        <span className="text-lg text-white/50"> / 100</span>
                      </div>
                      <span className="inline-block mt-2 font-mono-brutal text-xs bg-amber-400 text-black font-bold px-2 py-0.5 uppercase">
                        {auditResult.step8_CognitiveLoad.scoreLabel}
                      </span>
                    </div>

                    <div className="text-xs font-mono-brutal text-white/80 max-w-sm space-y-1 bg-neutral-900 p-3 border border-white/20">
                      <div>• 0–20: Instant Comprehension (Elite)</div>
                      <div>• 21–40: Good Clarity</div>
                      <div>• 41–60: Moderate Friction Risk</div>
                      <div>• 61–80: High Overload Risk (Conversion leak)</div>
                      <div>• 81–100: Severe Conversion Friction</div>
                    </div>
                  </div>

                  {/* 5 Cognitive Pillars Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <div className="bg-white border-2 border-black p-3 space-y-2 shadow-[2px_2px_0_#000]">
                      <div className="text-[10px] font-mono-brutal font-bold uppercase text-black/60">
                        Information Density
                      </div>
                      <div className="font-mono-brutal text-2xl font-black text-black">
                        {auditResult.step8_CognitiveLoad.informationDensity}/10
                      </div>
                      <div className="w-full bg-neutral-100 h-2 border border-black overflow-hidden">
                        <div
                          className="bg-black h-full"
                          style={{ width: `${auditResult.step8_CognitiveLoad.informationDensity * 10}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-white border-2 border-black p-3 space-y-2 shadow-[2px_2px_0_#000]">
                      <div className="text-[10px] font-mono-brutal font-bold uppercase text-black/60">
                        Complexity
                      </div>
                      <div className="font-mono-brutal text-2xl font-black text-black">
                        {auditResult.step8_CognitiveLoad.complexity}/10
                      </div>
                      <div className="w-full bg-neutral-100 h-2 border border-black overflow-hidden">
                        <div
                          className="bg-black h-full"
                          style={{ width: `${auditResult.step8_CognitiveLoad.complexity * 10}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-white border-2 border-black p-3 space-y-2 shadow-[2px_2px_0_#000]">
                      <div className="text-[10px] font-mono-brutal font-bold uppercase text-black/60">
                        Mental Effort
                      </div>
                      <div className="font-mono-brutal text-2xl font-black text-black">
                        {auditResult.step8_CognitiveLoad.mentalEffortRequired}/10
                      </div>
                      <div className="w-full bg-neutral-100 h-2 border border-black overflow-hidden">
                        <div
                          className="bg-black h-full"
                          style={{ width: `${auditResult.step8_CognitiveLoad.mentalEffortRequired * 10}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-white border-2 border-black p-3 space-y-2 shadow-[2px_2px_0_#000]">
                      <div className="text-[10px] font-mono-brutal font-bold uppercase text-black/60">
                        Visual Overload
                      </div>
                      <div className="font-mono-brutal text-2xl font-black text-black">
                        {auditResult.step8_CognitiveLoad.visualOverload}/10
                      </div>
                      <div className="w-full bg-neutral-100 h-2 border border-black overflow-hidden">
                        <div
                          className="bg-black h-full"
                          style={{ width: `${auditResult.step8_CognitiveLoad.visualOverload * 10}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-white border-2 border-black p-3 space-y-2 shadow-[2px_2px_0_#000]">
                      <div className="text-[10px] font-mono-brutal font-bold uppercase text-black/60">
                        Clarity Rating
                      </div>
                      <div className="font-mono-brutal text-2xl font-black text-black">
                        {auditResult.step8_CognitiveLoad.clarity}/10
                      </div>
                      <div className="w-full bg-neutral-100 h-2 border border-black overflow-hidden">
                        <div
                          className="bg-amber-400 h-full"
                          style={{ width: `${auditResult.step8_CognitiveLoad.clarity * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* STEP 9: ACTION PLAN & HOMEPAGE HERO REWRITE */}
              {/* ================================================================= */}
              {activeStepTab === 9 && (
                <div className="space-y-6">
                  <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                    <div>
                      <h3 className="font-mono-brutal font-black text-sm text-black uppercase">
                        Step 9: High-Impact Action Plan & Hero Rewrite
                      </h3>
                      <p className="text-xs text-black/70 font-mono-brutal">
                        Centering the entire website around the single most valuable customer outcome.
                      </p>
                    </div>

                    <button
                      id="copy-hero-copy-btn"
                      onClick={handleCopyHero}
                      className="px-3 py-1.5 bg-black text-amber-400 hover:bg-amber-400 hover:text-black border-2 border-black font-mono-brutal text-[11px] font-bold uppercase shadow-[2px_2px_0_#000] flex items-center gap-1.5 transition-colors"
                    >
                      {copiedHero ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedHero ? 'Hero Copied' : 'Copy Hero'}
                    </button>
                  </div>

                  {/* Complete Hero Rewrite Box */}
                  <div className="bg-amber-100 border-2 border-black p-5 shadow-[4px_4px_0_#000] space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-black" />
                      <span className="font-mono-brutal font-bold text-xs text-black uppercase">
                        AI High-Converting Hero Rewrite Blueprint
                      </span>
                    </div>

                    <div className="bg-white border-2 border-black p-4 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono-brutal text-black/50 uppercase font-bold block">
                          Headline (Outcome-Focused):
                        </span>
                        <h2 className="font-mono-brutal text-lg font-black text-black mt-0.5">
                          {auditResult.homepageHeroRewrite.heroHeadline}
                        </h2>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono-brutal text-black/50 uppercase font-bold block">
                          Subheadline (Removes Friction & Clarifies Transformation):
                        </span>
                        <p className="font-mono-brutal text-xs text-black/80 mt-0.5 leading-relaxed">
                          {auditResult.homepageHeroRewrite.subheadline}
                        </p>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <button className="px-5 py-2.5 bg-black text-amber-400 font-mono-brutal font-bold text-xs uppercase tracking-wide border-2 border-black shadow-[2px_2px_0_#000]">
                          {auditResult.homepageHeroRewrite.singlePrimaryCta}
                        </button>
                        <span className="text-[11px] font-mono-brutal text-black/70">
                          {auditResult.homepageHeroRewrite.guaranteeMicroCopy}
                        </span>
                      </div>

                      <div className="bg-neutral-50 p-2.5 border border-black/20 text-[11px] font-mono-brutal text-black/80">
                        <strong className="text-black">Hero Visual Focus:</strong>{' '}
                        {auditResult.homepageHeroRewrite.heroVisualFocus}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations by Timeframe */}
                  <div className="space-y-3">
                    <h4 className="font-mono-brutal font-bold text-xs text-black uppercase">
                      Prioritized Implementation Recommendations:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {auditResult.step9_Recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="bg-white border-2 border-black p-3.5 shadow-[2px_2px_0_#000] space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono-brutal bg-black text-white px-1.5 py-0.5 uppercase font-bold">
                                {rec.timeframe}
                              </span>
                              <span className="text-[9px] font-mono-brutal text-emerald-800 font-bold">
                                Lift: {rec.impactOnConversions}
                              </span>
                            </div>
                            <h5 className="font-mono-brutal font-bold text-xs text-black">
                              {rec.title}
                            </h5>
                            <p className="text-[11px] font-mono-brutal text-black/70 leading-normal">
                              {rec.action}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[10px] font-mono-brutal text-black/60">
                            <span>Clarity: {rec.impactOnClarity}</span>
                            <span>Ease: {rec.easeOfImplementation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3-Phase Timeline */}
                  <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0_#000] space-y-3">
                    <h4 className="font-mono-brutal font-bold text-xs text-black uppercase flex items-center gap-2">
                      <ListOrdered className="w-4 h-4" />
                      Step-by-Step Rollout Timeline:
                    </h4>
                    <div className="space-y-2">
                      {auditResult.prioritizedActionPlan.map((p) => (
                        <div
                          key={p.step}
                          className="p-2.5 bg-neutral-50 border border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono-brutal"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-black text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                              {p.step}
                            </span>
                            <div>
                              <strong className="text-black">{p.phase}:</strong>{' '}
                              <span className="text-black/80">{p.focus}</span>
                            </div>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-400 px-2 py-0.5 font-bold shrink-0">
                            {p.expectedClarityLift}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* WIZARD FOOTER NAVIGATION */}
            <div className="bg-white border-t-2 border-black px-4 py-3 flex items-center justify-between flex-shrink-0">
              <button
                disabled={activeStepTab <= 1}
                onClick={() => setActiveStepTab((prev) => Math.max(1, prev - 1))}
                className="px-4 py-1.5 bg-white disabled:opacity-30 hover:bg-neutral-100 border-2 border-black font-mono-brutal text-xs font-bold uppercase shadow-[2px_2px_0_#000] flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous Step
              </button>

              <span className="text-xs font-mono-brutal font-bold text-black">
                Step {activeStepTab} of 9
              </span>

              <button
                disabled={activeStepTab >= 9}
                onClick={() => setActiveStepTab((prev) => Math.min(9, prev + 1))}
                className="px-4 py-1.5 bg-black text-amber-400 disabled:opacity-30 hover:bg-amber-400 hover:text-black border-2 border-black font-mono-brutal text-xs font-bold uppercase shadow-[2px_2px_0_#000] flex items-center gap-1.5 transition-all"
              >
                Next Step
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
