import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  TrendingUp,
  FileCode,
  Layers,
} from 'lucide-react';

interface ConversionWizardBannerProps {
  onOpenWizardWithUrl: (url?: string) => void;
}

export const ConversionWizardBanner: React.FC<ConversionWizardBannerProps> = ({
  onOpenWizardWithUrl,
}) => {
  const [quickUrl, setQuickUrl] = useState('');

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenWizardWithUrl(quickUrl.trim());
  };

  return (
    <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/20 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>4-Step Guided CRO Flow</span>
              </span>
              <span className="text-zinc-500 text-xs hidden sm:inline">•</span>
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                Automated Audit &bull; Competitor Benchmark &bull; ChatGPT Prompt Generator
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-zinc-100 tracking-tight flex items-center space-x-2">
              <span>ConversionWizard: Why Visitors Leave Without Buying</span>
            </h3>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Identify <strong className="text-amber-400">Trust Gaps</strong> (missing reviews &amp; guarantees), <strong className="text-orange-400">Friction Gaps</strong> (confusing checkout &amp; passive buttons), and <strong className="text-rose-400">Clarity Gaps</strong> (vague headlines). Compare side-by-side with top competitors and copy production-ready AI fix-it prompts.
            </p>
          </div>

          {/* Quick Launch Form */}
          <form
            onSubmit={handleLaunch}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 lg:w-[420px]"
          >
            <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="Enter website link (e.g. mybrand.com)"
              className="flex-1 bg-zinc-950/90 border border-zinc-700/80 rounded-2xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono shadow-inner"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-black text-xs tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
            >
              <Wand2 className="w-4 h-4" />
              <span>Launch Wizard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* 4 Guided Steps Visual Pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-zinc-800/80">
          <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <div className="text-[10px] font-mono font-bold text-amber-400 flex items-center space-x-1">
              <span>Step 1</span>
              <span className="text-zinc-600">&rarr;</span>
            </div>
            <div className="text-xs font-bold text-zinc-200">Input &amp; Goals</div>
            <div className="text-[10px] text-zinc-400">URL &amp; Niche (Ecom, SaaS, Local)</div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <div className="text-[10px] font-mono font-bold text-orange-400 flex items-center space-x-1">
              <span>Step 2</span>
              <span className="text-zinc-600">&rarr;</span>
            </div>
            <div className="text-xs font-bold text-zinc-200">Automated Audit</div>
            <div className="text-[10px] text-zinc-400">Speed, Buttons, Clarity &amp; Trust</div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <div className="text-[10px] font-mono font-bold text-rose-400 flex items-center space-x-1">
              <span>Step 3</span>
              <span className="text-zinc-600">&rarr;</span>
            </div>
            <div className="text-xs font-bold text-zinc-200">Competitor Matrix</div>
            <div className="text-[10px] text-zinc-400">Side-by-side Pricing &amp; CTA fixes</div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <div className="text-[10px] font-mono font-bold text-emerald-400 flex items-center space-x-1">
              <span>Step 4</span>
              <span>✓</span>
            </div>
            <div className="text-xs font-bold text-zinc-200">Dashboard &amp; Prompts</div>
            <div className="text-[10px] text-zinc-400">Master Prompt + Timeline ROI</div>
          </div>
        </div>
      </div>
    </div>
  );
};
