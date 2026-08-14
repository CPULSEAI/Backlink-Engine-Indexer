import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Wand2,
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
  Sparkles,
  DollarSign,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Code,
  FileText,
  RotateCcw,
  BarChart3,
  Search,
  ShoppingCart,
  Building2,
  BookOpen,
  Laptop,
  Briefcase,
  Sliders,
  Award,
} from 'lucide-react';
import { CroAuditResult, CroGapItem } from '../types';

interface ConversionWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
}

const BUSINESS_TYPES = [
  { id: 'E-commerce products', label: 'E-commerce products', icon: ShoppingCart, desc: 'Physical goods, apparel, retail stores' },
  { id: 'Local services', label: 'Local services', icon: Building2, desc: 'Contractors, clinics, legal, repair' },
  { id: 'Digital products', label: 'Digital products', icon: BookOpen, desc: 'Courses, ebooks, templates, audio' },
  { id: 'SaaS & Web tools', label: 'SaaS & Web tools', icon: Laptop, desc: 'Web apps, B2B software, cloud tools' },
  { id: 'Consulting / Agency', label: 'Consulting / Agency', icon: Briefcase, desc: 'Marketing, advisory, design agencies' },
];

const ANALYSIS_PHASES = [
  { id: 1, text: 'Checking website loading speed & Core Web Vitals...', duration: 900 },
  { id: 2, text: 'Reviewing your checkout button & primary CTA contrast...', duration: 1100 },
  { id: 3, text: 'Analyzing text clarity, headlines & 5-second value test...', duration: 1000 },
  { id: 4, text: 'Scanning trust badges, customer reviews & security seals...', duration: 900 },
  { id: 5, text: 'Cross-referencing competitor benchmark metrics & pricing models...', duration: 1000 },
  { id: 6, text: 'Generating AI Master Prompt & tailored copywriting fixes...', duration: 900 },
];

export const ConversionWizardModal: React.FC<ConversionWizardModalProps> = ({
  isOpen,
  onClose,
  initialUrl = '',
}) => {
  // Wizard Steps: 1 = Input, 2 = Analysis (Loading), 3 = Competitor, 4 = Dashboard
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [userUrl, setUserUrl] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('E-commerce products');
  const [competitorUrl, setCompetitorUrl] = useState<string>('');
  const [traffic, setTraffic] = useState<number>(10000);
  const [conversionRate, setConversionRate] = useState<number>(1.5);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(75);
  const [showAdvancedInputs, setShowAdvancedInputs] = useState<boolean>(false);

  // Analysis State
  const [analysisPhaseIndex, setAnalysisPhaseIndex] = useState<number>(0);
  const [auditResult, setAuditResult] = useState<CroAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Dashboard Active Tab
  const [activeDashboardTab, setActiveDashboardTab] = useState<'why' | 'comparison' | 'timeline' | 'prompt' | 'fixes'>('why');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Dynamic what-if simulator values in Dashboard
  const [simTraffic, setSimTraffic] = useState<number>(10000);
  const [simCr, setSimCr] = useState<number>(1.5);
  const [simAov, setSimAov] = useState<number>(75);
  const [simTargetCr, setSimTargetCr] = useState<number>(2.7);

  // Set initial URL if passed
  useEffect(() => {
    if (initialUrl && !userUrl) {
      setUserUrl(initialUrl);
    }
  }, [initialUrl]);

  // Sync simulator values when audit results arrive
  useEffect(() => {
    if (auditResult) {
      setSimTraffic(auditResult.revenueProjection.currentTraffic);
      setSimCr(auditResult.revenueProjection.currentConversionRate);
      setSimAov(auditResult.revenueProjection.averageOrderValue);
      setSimTargetCr(auditResult.revenueProjection.targetConversionRate);
    }
  }, [auditResult]);

  if (!isOpen) return null;

  // Step 1 -> Step 2 -> Step 3 transition
  const handleStartAnalysis = async () => {
    if (!userUrl.trim()) {
      toast.error('Please enter your website link.');
      return;
    }

    // Move to Loading Phase (Step 2)
    setCurrentStep(2);
    setIsLoading(true);
    setAnalysisPhaseIndex(0);

    // Cycle through visual cues
    let pIdx = 0;
    const interval = setInterval(() => {
      pIdx += 1;
      if (pIdx < ANALYSIS_PHASES.length) {
        setAnalysisPhaseIndex(pIdx);
      }
    }, 900);

    try {
      const resp = await axios.post('/api/cro/audit', {
        userUrl: userUrl.trim(),
        businessType,
        competitorUrl: competitorUrl.trim() || undefined,
        traffic,
        conversionRate,
        averageOrderValue,
      });

      clearInterval(interval);

      if (resp.data && resp.data.audit) {
        setAuditResult(resp.data.audit);
        // If competitor was already specified, jump directly to Dashboard (Step 4), else Step 3
        if (competitorUrl.trim()) {
          setCurrentStep(4);
        } else {
          setCurrentStep(3);
        }
      } else {
        throw new Error('No audit data returned');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('[ConversionWizard] Audit error:', err);
      toast.error(err.response?.data?.error || 'Failed to complete website audit. Please try again.');
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3 -> Step 4
  const handleProceedToDashboard = async () => {
    // If competitor changed in Step 3, re-run or finalize
    if (competitorUrl.trim() && auditResult?.competitorUrl !== competitorUrl.trim()) {
      setIsLoading(true);
      try {
        const resp = await axios.post('/api/cro/audit', {
          userUrl: userUrl.trim(),
          businessType,
          competitorUrl: competitorUrl.trim(),
          traffic,
          conversionRate,
          averageOrderValue,
        });
        if (resp.data && resp.data.audit) {
          setAuditResult(resp.data.audit);
        }
      } catch (e) {
        // Fallback to current audit
      } finally {
        setIsLoading(false);
      }
    }
    setCurrentStep(4);
  };

  const handleCopyPrompt = () => {
    if (!auditResult) return;
    navigator.clipboard.writeText(auditResult.masterPrompt);
    setCopiedPrompt(true);
    toast.success('Master Prompt copied to clipboard! Ready to paste into ChatGPT or Claude.');
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success('Code snippet copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setAuditResult(null);
    setActiveDashboardTab('why');
  };

  // Live simulation calculated values
  const liveCurrentRev = Math.round(simTraffic * (simCr / 100) * simAov);
  const liveProjectedRev = Math.round(simTraffic * (simTargetCr / 100) * simAov);
  const liveMonthlyLift = liveProjectedRev - liveCurrentRev;
  const liveAnnualLift = liveMonthlyLift * 12;
  const liveOrdersGain = Math.round(simTraffic * ((simTargetCr - simCr) / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-[1px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                  Conversion<span className="text-amber-400">Wizard</span>
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                  CRO &amp; AI Fix-It Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Turn website visitors into paying customers • Automated gap audits, competitor benchmarks &amp; ChatGPT master prompts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-all cursor-pointer"
            title="Close Wizard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Navigation Bar */}
        <div className="px-6 py-3 bg-zinc-900/40 border-b border-zinc-800/60 shrink-0">
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div
              className={`flex items-center space-x-2 p-2 rounded-xl border transition-all ${
                currentStep === 1
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                  : currentStep > 1
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : 'bg-zinc-900/40 border-zinc-800/50 text-zinc-500'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === 1 ? 'bg-amber-500 text-zinc-950' : currentStep > 1 ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {currentStep > 1 ? <Check className="w-3 h-3" /> : '1'}
              </div>
              <div className="truncate">
                <span className="block font-semibold">Step 1: Input</span>
                <span className="text-[10px] text-zinc-400 hidden sm:inline">URL &amp; Goals</span>
              </div>
            </div>

            <div
              className={`flex items-center space-x-2 p-2 rounded-xl border transition-all ${
                currentStep === 2
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                  : currentStep > 2
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : 'bg-zinc-900/40 border-zinc-800/50 text-zinc-500'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === 2 ? 'bg-amber-500 text-zinc-950 animate-pulse' : currentStep > 2 ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {currentStep > 2 ? <Check className="w-3 h-3" /> : '2'}
              </div>
              <div className="truncate">
                <span className="block font-semibold">Step 2: Analysis</span>
                <span className="text-[10px] text-zinc-400 hidden sm:inline">Automated Audit</span>
              </div>
            </div>

            <div
              className={`flex items-center space-x-2 p-2 rounded-xl border transition-all ${
                currentStep === 3
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                  : currentStep > 3
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : 'bg-zinc-900/40 border-zinc-800/50 text-zinc-500'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === 3 ? 'bg-amber-500 text-zinc-950' : currentStep > 3 ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {currentStep > 3 ? <Check className="w-3 h-3" /> : '3'}
              </div>
              <div className="truncate">
                <span className="block font-semibold">Step 3: Competitor</span>
                <span className="text-[10px] text-zinc-400 hidden sm:inline">Direct Comparison</span>
              </div>
            </div>

            <div
              className={`flex items-center space-x-2 p-2 rounded-xl border transition-all ${
                currentStep === 4
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                  : 'bg-zinc-900/40 border-zinc-800/50 text-zinc-500'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === 4 ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}>
                4
              </div>
              <div className="truncate">
                <span className="block font-semibold">Step 4: Dashboard</span>
                <span className="text-[10px] text-zinc-400 hidden sm:inline">Results &amp; Prompts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body / Dynamic Step Views */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ================= STEP 1: WELCOME & SETUP ================= */}
          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto space-y-6 py-2">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold font-mono uppercase tracking-wider">
                  Screen 1: Welcome &amp; Setup
                </span>
                <h3 className="text-2xl font-black text-zinc-100 tracking-tight">
                  Stop Guessing Why Visitors Don't Buy
                </h3>
                <p className="text-sm text-zinc-400 max-w-lg mx-auto">
                  Enter your website link and what you sell. Our 3-pillar audit engine scans your speed, buttons, trust signals, and headlines to build your instant fix-it plan.
                </p>
              </div>

              {/* Field 1: Website Link */}
              <div className="space-y-2 bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  What is your website link? <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userUrl}
                    onChange={(e) => setUserUrl(e.target.value)}
                    placeholder="e.g. https://yourbrand.com or yoursite.io"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                  />
                </div>
                {/* Sample quick picks */}
                <div className="flex items-center space-x-2 text-[11px] text-zinc-500 pt-1">
                  <span>Quick demo samples:</span>
                  <button
                    onClick={() => setUserUrl('careerpulseai.net')}
                    className="text-amber-400/80 hover:text-amber-300 underline cursor-pointer"
                  >
                    careerpulseai.net
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setUserUrl('craftcoffeeshop.com')}
                    className="text-amber-400/80 hover:text-amber-300 underline cursor-pointer"
                  >
                    craftcoffeeshop.com
                  </button>
                </div>
              </div>

              {/* Field 2: What do you sell? */}
              <div className="space-y-2 bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  What do you sell? <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BUSINESS_TYPES.map((bt) => {
                    const Icon = bt.icon;
                    const isSelected = businessType === bt.id;
                    return (
                      <button
                        key={bt.id}
                        type="button"
                        onClick={() => setBusinessType(bt.id)}
                        className={`flex items-start space-x-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-zinc-100 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                            : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-zinc-200">{bt.label}</span>
                          <span className="text-[10px] text-zinc-500 block leading-tight mt-0.5">{bt.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional: Financial & Traffic Estimates for Revenue Projection */}
              <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/80 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
                  className="flex items-center justify-between w-full text-xs font-bold text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Revenue &amp; Traffic Projection Baseline (Optional)</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {showAdvancedInputs ? 'Hide Options ▲' : 'Customize Traffic &amp; AOV ▼'}
                  </span>
                </button>

                {showAdvancedInputs && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800/60">
                    <div>
                      <label className="text-[10px] text-zinc-400 block uppercase font-bold">Monthly Visitors</label>
                      <input
                        type="number"
                        value={traffic}
                        onChange={(e) => setTraffic(Number(e.target.value) || 0)}
                        className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500"
                        placeholder="10000"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block uppercase font-bold">Current Conv. Rate %</label>
                      <input
                        type="number"
                        step="0.1"
                        value={conversionRate}
                        onChange={(e) => setConversionRate(Number(e.target.value) || 0)}
                        className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500"
                        placeholder="1.5"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block uppercase font-bold">Avg Order Value ($)</label>
                      <input
                        type="number"
                        value={averageOrderValue}
                        onChange={(e) => setAverageOrderValue(Number(e.target.value) || 0)}
                        className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500"
                        placeholder="75"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleStartAnalysis}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-[0.99]"
              >
                <span>Run Automated Audit (Step 2)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= STEP 2: AUTOMATED ANALYSIS (LOADING STATE) ================= */}
          {currentStep === 2 && (
            <div className="max-w-xl mx-auto py-10 text-center space-y-8">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 text-amber-400 animate-bounce">
                  <Wand2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
                  Scanning Website &amp; Identifying Conversion Leaks...
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Target: <span className="text-amber-400 font-bold">{userUrl}</span> • Niche:{' '}
                  <span className="text-zinc-200">{businessType}</span>
                </p>
              </div>

              {/* Friendly Progress Bar */}
              <div className="space-y-2 bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-bold flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>{ANALYSIS_PHASES[analysisPhaseIndex]?.text || 'Finalizing audit metrics...'}</span>
                  </span>
                  <span className="font-mono text-amber-400 font-bold">
                    {Math.round(((analysisPhaseIndex + 1) / ANALYSIS_PHASES.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.round(((analysisPhaseIndex + 1) / ANALYSIS_PHASES.length) * 100)}%` }}
                  />
                </div>
              </div>

              {/* 3 Backend Core Pillars Visual Cues */}
              <div className="grid grid-cols-3 gap-3 text-left">
                <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-[10px] text-amber-400 font-bold font-mono uppercase">Pillar 1</div>
                  <div className="text-xs font-bold text-zinc-200 mt-1">Technical Audit Engine</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Speed, LCP &amp; Mobile Bugs</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-[10px] text-orange-400 font-bold font-mono uppercase">Pillar 2</div>
                  <div className="text-xs font-bold text-zinc-200 mt-1">Competitor Scraper</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Rival Pricing &amp; Value Props</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-[10px] text-rose-400 font-bold font-mono uppercase">Pillar 3</div>
                  <div className="text-xs font-bold text-zinc-200 mt-1">AI Prompt Generator</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">ChatGPT/Claude Fixes</div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: COMPETITOR BENCHMARK ================= */}
          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto space-y-6 py-2">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold font-mono uppercase tracking-wider">
                  Screen 3: Competitor Benchmark
                </span>
                <h3 className="text-2xl font-black text-zinc-100 tracking-tight">
                  Direct Rival Comparison Matrix
                </h3>
                <p className="text-sm text-zinc-400 max-w-lg mx-auto">
                  To find the highest-leverage conversion gaps, compare your site directly against an industry leader.
                </p>
              </div>

              {/* Competitor Input */}
              <div className="bg-zinc-900/70 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Who is your top competitor?
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={competitorUrl}
                    onChange={(e) => setCompetitorUrl(e.target.value)}
                    placeholder="e.g. https://competitorbrand.com (Or leave blank to use industry leader)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  💡 <span className="font-semibold text-zinc-300">If left blank:</span> We will benchmark against the #1 recognized conversion leader in <span className="text-amber-400 font-bold">{businessType}</span> ({auditResult?.competitorDomain || 'Industry Benchmark'}).
                </p>
              </div>

              {/* Quick Preset Benchmark Card */}
              {auditResult && (
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Assigned Benchmark</span>
                    <h4 className="text-xs font-bold text-zinc-200">{auditResult.competitorDomain}</h4>
                    <p className="text-[10px] text-zinc-500">Includes pricing transparency, 5-star review widgets, and high-contrast CTA layouts.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold shrink-0">
                    Ready to Compare
                  </span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold border border-zinc-800 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleProceedToDashboard}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Open Action Dashboard (Step 4)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: THE ACTION DASHBOARD ================= */}
          {currentStep === 4 && auditResult && (
            <div className="space-y-6">
              {/* Dashboard Summary Header */}
              <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-5 rounded-2xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
                      CRO Action Dashboard
                    </span>
                    <span className="text-xs text-zinc-400">
                      Audit ID: <span className="font-mono text-zinc-300">{auditResult.id}</span>
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-zinc-100">
                    {auditResult.userDomain} <span className="text-zinc-500 font-normal">vs</span>{' '}
                    <span className="text-amber-400">{auditResult.competitorDomain}</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Business Model: <span className="text-zinc-200 font-medium">{auditResult.businessType}</span> • Server Response: <span className="font-mono text-zinc-200">{auditResult.loadSpeedMs}ms</span>
                  </p>
                </div>

                {/* Score & Metric Badges */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">CRO Readiness Score</div>
                    <div className="text-2xl font-black font-mono text-amber-400 flex items-center justify-end space-x-1">
                      <span>{auditResult.overallScore}/100</span>
                      <Award className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer"
                    title="Start New Audit"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3 Core Tab Switcher */}
              <div className="flex items-center space-x-1.5 p-1 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-x-auto text-xs">
                <button
                  onClick={() => setActiveDashboardTab('why')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                    activeDashboardTab === 'why'
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Why You're Missing Sales ({auditResult.trustGaps.length + auditResult.frictionGaps.length + auditResult.clarityGaps.length} Gaps)</span>
                </button>

                <button
                  onClick={() => setActiveDashboardTab('comparison')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                    activeDashboardTab === 'comparison'
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Competitor Matrix</span>
                </button>

                <button
                  onClick={() => setActiveDashboardTab('timeline')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                    activeDashboardTab === 'timeline'
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Growth Timeline &amp; Revenue Projection</span>
                </button>

                <button
                  onClick={() => setActiveDashboardTab('prompt')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                    activeDashboardTab === 'prompt'
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Master Prompt Generator</span>
                </button>

                <button
                  onClick={() => setActiveDashboardTab('fixes')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                    activeDashboardTab === 'fixes'
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>AI Copy-and-Paste Fixes</span>
                </button>
              </div>

              {/* TAB 1: WHY YOU'RE MISSING SALES (THE 3 BUCKETS) */}
              {activeDashboardTab === 'why' && (
                <div className="space-y-6">
                  {/* Bucket 1: Trust Gaps */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-extrabold text-zinc-100">
                          1. Trust Gaps <span className="text-zinc-500 font-normal">(Reviews, Guarantees &amp; Security)</span>
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                        {auditResult.trustGaps.length} Identified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {auditResult.trustGaps.map((gap) => (
                        <div key={gap.id} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-zinc-200 flex items-center space-x-1.5">
                              <span>{gap.visualIndicator || '🛡️'}</span>
                              <span>{gap.title}</span>
                            </span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                              gap.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {gap.severity}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{gap.description}</p>
                          <div className="pt-2 border-t border-zinc-800/60 text-xs text-emerald-400 flex items-start space-x-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span><strong className="text-zinc-200">The Fix:</strong> {gap.recommendation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bucket 2: Friction Gaps */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          <Zap className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-extrabold text-zinc-100">
                          2. Friction Gaps <span className="text-zinc-500 font-normal">(Checkout Steps, Speed &amp; Buttons)</span>
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                        {auditResult.frictionGaps.length} Identified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {auditResult.frictionGaps.map((gap) => (
                        <div key={gap.id} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-zinc-200 flex items-center space-x-1.5">
                              <span>{gap.visualIndicator || '🔘'}</span>
                              <span>{gap.title}</span>
                            </span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                              gap.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {gap.severity}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{gap.description}</p>
                          <div className="pt-2 border-t border-zinc-800/60 text-xs text-emerald-400 flex items-start space-x-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span><strong className="text-zinc-200">The Fix:</strong> {gap.recommendation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bucket 3: Clarity Gaps */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-extrabold text-zinc-100">
                          3. Clarity Gaps <span className="text-zinc-500 font-normal">(Headlines &amp; 5-Second Test)</span>
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                        {auditResult.clarityGaps.length} Identified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {auditResult.clarityGaps.map((gap) => (
                        <div key={gap.id} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-zinc-200 flex items-center space-x-1.5">
                              <span>{gap.visualIndicator || '❓'}</span>
                              <span>{gap.title}</span>
                            </span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                              gap.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {gap.severity}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{gap.description}</p>
                          <div className="pt-2 border-t border-zinc-800/60 text-xs text-emerald-400 flex items-start space-x-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span><strong className="text-zinc-200">The Fix:</strong> {gap.recommendation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COMPETITOR PRODUCT & SERVICE COMPARISON MATRIX */}
              {activeDashboardTab === 'comparison' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">Side-by-Side Competitor Comparison Matrix</h4>
                      <p className="text-xs text-zinc-400">Comparing conversion mechanics against industry leader benchmark.</p>
                    </div>
                  </div>

                  <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-300 font-bold uppercase text-[10px] tracking-wider">
                            <th className="py-3 px-4">Conversion Element</th>
                            <th className="py-3 px-4 text-zinc-300">Your Website ({auditResult.userDomain})</th>
                            <th className="py-3 px-4 text-amber-400">Industry Leader ({auditResult.competitorDomain})</th>
                            <th className="py-3 px-4 text-emerald-400">The Exact Fix</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                          {auditResult.comparisonMatrix.map((row, idx) => (
                            <tr key={idx} className="hover:bg-zinc-900/60 transition-all">
                              <td className="py-3 px-4 font-bold text-zinc-200 whitespace-nowrap">
                                {row.element}
                              </td>
                              <td className="py-3 px-4 text-zinc-400">
                                <span className="inline-block bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                                  {row.yourWebsite}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-zinc-300">
                                <span className="inline-block bg-amber-500/10 text-amber-300 px-2 py-1 rounded border border-amber-500/20 font-medium">
                                  {row.competitor}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-emerald-300 font-medium">
                                <span className="inline-block bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/20">
                                  {row.fixRecommendation}
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

              {/* TAB 3: REVENUE & TIMELINE PROJECTION */}
              {activeDashboardTab === 'timeline' && (
                <div className="space-y-6">
                  {/* Revenue Formula & Lift Calculator Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-indigo-950/40 border border-emerald-500/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-emerald-400">Standard Conversion Formula</span>
                        <h4 className="text-base font-black text-zinc-100">
                          Current Traffic × Target Conversion Rate (Optimized) × Average Order Value = Estimated Sales
                        </h4>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold shrink-0">
                        +${liveMonthlyLift.toLocaleString()}/mo Projected Gain
                      </span>
                    </div>

                    {/* Interactive Sliders for What-If Analysis */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase flex justify-between">
                          <span>Monthly Traffic</span>
                          <span className="font-mono text-zinc-200">{simTraffic.toLocaleString()}</span>
                        </label>
                        <input
                          type="range"
                          min="1000"
                          max="100000"
                          step="1000"
                          value={simTraffic}
                          onChange={(e) => setSimTraffic(Number(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase flex justify-between">
                          <span>Current Conv. Rate</span>
                          <span className="font-mono text-zinc-200">{simCr}%</span>
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="5.0"
                          step="0.1"
                          value={simCr}
                          onChange={(e) => setSimCr(Number(e.target.value))}
                          className="w-full accent-orange-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase flex justify-between">
                          <span>Target (Optimized) Rate</span>
                          <span className="font-mono text-emerald-400 font-bold">{simTargetCr}%</span>
                        </label>
                        <input
                          type="range"
                          min="1.0"
                          max="8.0"
                          step="0.1"
                          value={simTargetCr}
                          onChange={(e) => setSimTargetCr(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase flex justify-between">
                          <span>Average Order Value ($)</span>
                          <span className="font-mono text-zinc-200">${simAov}</span>
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="500"
                          step="5"
                          value={simAov}
                          onChange={(e) => setSimAov(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Calculated Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-800">
                      <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
                        <div className="text-[10px] text-zinc-500 uppercase font-bold">Current Monthly Sales</div>
                        <div className="text-lg font-black font-mono text-zinc-300 mt-0.5">${liveCurrentRev.toLocaleString()}</div>
                      </div>

                      <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
                        <div className="text-[10px] text-emerald-400 uppercase font-bold">Projected Monthly Sales</div>
                        <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">${liveProjectedRev.toLocaleString()}</div>
                      </div>

                      <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
                        <div className="text-[10px] text-amber-400 uppercase font-bold">Annualized Net Gain</div>
                        <div className="text-lg font-black font-mono text-amber-400 mt-0.5">+${liveAnnualLift.toLocaleString()}</div>
                      </div>

                      <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
                        <div className="text-[10px] text-indigo-400 uppercase font-bold">Extra Monthly Orders</div>
                        <div className="text-lg font-black font-mono text-indigo-400 mt-0.5">+{liveOrdersGain} orders</div>
                      </div>
                    </div>
                  </div>

                  {/* 3-Phase Realistic Timeline */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-zinc-100">Realistic Conversion Growth Timeline</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {auditResult.timeline.map((phase, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {phase.timeFrame}
                              </span>
                              <span className="text-xs font-bold text-zinc-400">{phase.phase}</span>
                            </div>

                            <h5 className="text-xs font-black text-zinc-100">{phase.title}</h5>
                            <p className="text-[11px] text-zinc-400">{phase.focus}</p>

                            <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
                              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Action Checklist:</span>
                              {phase.tasks.map((task, tIdx) => (
                                <div key={tIdx} className="text-[11px] text-zinc-300 flex items-start space-x-1.5">
                                  <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{task}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-[11px] text-emerald-300 font-medium">
                            🎯 <strong className="text-zinc-200">Outcome:</strong> {phase.expectedOutcome}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BUILT-IN PROMPT GENERATOR (THE MASTER PROMPT) */}
              {activeDashboardTab === 'prompt' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100 flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>The Built-In Master Prompt Generator</span>
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Copy this dynamically populated prompt directly into ChatGPT or Claude to get production-ready code and copy fixes.
                      </p>
                    </div>

                    <button
                      onClick={handleCopyPrompt}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0 active:scale-95"
                    >
                      {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedPrompt ? 'Prompt Copied!' : 'Copy Master Prompt'}</span>
                    </button>
                  </div>

                  {/* Code / Prompt Display Box */}
                  <div className="relative">
                    <pre className="w-full p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed overflow-x-auto shadow-inner">
                      {auditResult.masterPrompt}
                    </pre>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                    <span>💡 Pro-tip: Works with ChatGPT-4o, Claude 3.5 Sonnet, Gemini 3.7 Flash, or any modern LLM.</span>
                    <button
                      onClick={handleCopyPrompt}
                      className="text-amber-400 hover:underline font-bold cursor-pointer"
                    >
                      Click here to copy
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: AI COPY-AND-PASTE FIXES (INSTANT REWRITES & CODE) */}
              {activeDashboardTab === 'fixes' && (
                <div className="space-y-6">
                  {/* Headline Rewrites */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-zinc-100 flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span>High-Converting Headline Rewrites (Passes 5-Second Test)</span>
                      </h4>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                        A/B Test Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {auditResult.aiGeneratedFixes.headlines.map((hl, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between gap-3">
                          <div className="flex items-start space-x-3">
                            <span className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-amber-400 shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-zinc-100">{hl}</span>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(hl);
                              toast.success(`Headline #${idx + 1} copied!`);
                            }}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer shrink-0"
                            title="Copy Headline"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Primary CTA Button Overhaul */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-zinc-100 flex items-center space-x-1.5">
                      <Zap className="w-4 h-4 text-orange-400" />
                      <span>Primary CTA Button &amp; Placement Recommendation</span>
                    </h4>

                    {auditResult.aiGeneratedFixes.ctaRecommendations.map((cta, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Recommended Button Text</span>
                            <span className="text-sm font-bold text-amber-400">{cta.text}</span>
                            {cta.subtext && <p className="text-[10px] text-zinc-400 mt-0.5">{cta.subtext}</p>}
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Contrast Color</span>
                            <span className="text-xs font-mono text-zinc-200">{cta.color}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Placement</span>
                            <span className="text-xs text-zinc-300">{cta.placement}</span>
                          </div>
                        </div>

                        {/* Button Code Snippet */}
                        <div className="pt-2 border-t border-zinc-800">
                          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase pb-1.5">
                            <span>HTML / Button Snippet</span>
                            <button
                              onClick={() => handleCopyCode(cta.codeSnippet)}
                              className="text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy HTML</span>
                            </button>
                          </div>
                          <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-amber-300 overflow-x-auto">
                            {cta.codeSnippet}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Clean CSS / Styling Code Block */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-zinc-100 flex items-center space-x-1.5">
                        <Code className="w-4 h-4 text-emerald-400" />
                        <span>High-Converting Button &amp; Trust Badge CSS (Drop-in for Shopify/WordPress)</span>
                      </h4>
                      <button
                        onClick={() => handleCopyCode(auditResult.aiGeneratedFixes.codeFixes)}
                        className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy CSS</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                      {auditResult.aiGeneratedFixes.codeFixes}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between shrink-0 text-xs text-zinc-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>ConversionWizard v2.0 • 3-Pillar Architecture</span>
          </div>

          <div className="flex items-center space-x-2">
            {currentStep === 4 && (
              <button
                onClick={handleCopyPrompt}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 transition-all cursor-pointer"
              >
                Copy Master Prompt
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
