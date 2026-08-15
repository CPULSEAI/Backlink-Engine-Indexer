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
} from 'lucide-react';

interface WizardsHubDashboardProps {
  onOpenConversionWizard: (url?: string) => void;
  onOpenClarityWizard?: (url?: string) => void;
  onOpenOnboardingWizard: () => void;
  onOpenGeoBlueprint: () => void;
  onOpenDomainProfiler: (domain?: string) => void;
  onOpenAudit: () => void;
  onOpenScheduler: () => void;
  onOpenContentGrader: (url?: string, keyword?: string) => void;
  onStartAutonomous100k: () => void;
  isAutonomousActive: boolean;
  autonomousAccumulatedCount: number;
  autonomousTargetGoal: number;
}

export const WizardsHubDashboard: React.FC<WizardsHubDashboardProps> = ({
  onOpenConversionWizard,
  onOpenClarityWizard,
  onOpenOnboardingWizard,
  onOpenGeoBlueprint,
  onOpenDomainProfiler,
  onOpenAudit,
  onOpenScheduler,
  onOpenContentGrader,
  onStartAutonomous100k,
  isAutonomousActive,
  autonomousAccumulatedCount,
  autonomousTargetGoal,
}) => {
  const [quickCroUrl, setQuickCroUrl] = useState('');
  const [quickClarityUrl, setQuickClarityUrl] = useState('');
  const [quickProfilerDomain, setQuickProfilerDomain] = useState('');
  const [quickGraderUrl, setQuickGraderUrl] = useState('');
  const [quickGraderKeyword, setQuickGraderKeyword] = useState('');

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
                  6 Interactive Guided Wizards &bull; AI Copy &bull; Autonomous Loops
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                Wizards &amp; Growth <span className="text-indigo-400">Command Center</span>
              </h2>

              <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
                Step-by-step intelligence engines engineered to eliminate trust gaps, benchmark against top competitors, execute continuous 100,000 submission loops, and optimize AI search engine rankings.
              </p>
            </div>

            {/* Quick Actions Row */}
            <div className="flex flex-wrap items-center gap-2">
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

      {/* Grid of Interactive Wizards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
    </div>
  );
};
