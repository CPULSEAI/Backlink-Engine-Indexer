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
    <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0_#000000] relative">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-black text-white font-mono-brutal text-xs font-bold uppercase tracking-wider">
                [ CONVERSIONWIZARD ]
              </span>
              <span className="font-mono-brutal text-xs text-[#ff4d00] font-bold">
                // SYSTEM_PROTOCOL: OPTIMIZE_AI_STRATEGY
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl font-black text-black leading-[0.9] tracking-tight uppercase">
              OPTIMIZE AI STRATEGY
            </h2>

            <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-sans border-t-2 border-black pt-4">
              Identify trust gaps and friction points. Advanced indexing protocol to outperform competition using precise algorithmic feedback, structured JSON-LD schemas, and AI search engine prompt optimization.
            </p>
          </div>

          {/* Quick Launch Form */}
          <form
            onSubmit={handleLaunch}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 lg:w-[420px]"
          >
            <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="DOMAIN_QUERY_HEX:"
              className="flex-1 bg-white border-4 border-black px-4 py-3 text-xs font-mono-brutal font-bold text-black placeholder-zinc-500 focus:outline-none focus:border-black shadow-[4px_4px_0_#000]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#ff4d00] hover:bg-[#ff5c14] text-black font-mono-brutal font-bold text-xs uppercase border-4 border-black shadow-[4px_4px_0_#000] flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0_#000]"
            >
              <Wand2 className="w-4 h-4 text-black" />
              <span>RUN_ANALYSIS</span>
            </button>
          </form>
        </div>

        {/* 4 Brutalist Pipeline Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t-4 border-black">
          <div className="p-3.5 bg-[#f2efeb] border-2 border-black shadow-[2px_2px_0_#000] space-y-1">
            <div className="font-mono-brutal text-[10px] font-bold text-black uppercase tracking-wider">
              [01] INPUT &amp; GOALS
            </div>
            <div className="font-display text-sm font-bold text-black uppercase">Domain &amp; Niche</div>
            <div className="font-mono-brutal text-[10px] text-zinc-700">Target URL, Ecom/SaaS</div>
          </div>

          <div className="p-3.5 bg-[#f2efeb] border-2 border-black shadow-[2px_2px_0_#000] space-y-1">
            <div className="font-mono-brutal text-[10px] font-bold text-[#ff4d00] uppercase tracking-wider">
              [02] AUTOMATED AUDIT
            </div>
            <div className="font-display text-sm font-bold text-black uppercase">Speed &amp; Friction</div>
            <div className="font-mono-brutal text-[10px] text-zinc-700">Clarity &amp; Trust Gaps</div>
          </div>

          <div className="p-3.5 bg-[#f2efeb] border-2 border-black shadow-[2px_2px_0_#000] space-y-1">
            <div className="font-mono-brutal text-[10px] font-bold text-black uppercase tracking-wider">
              [03] COMPETITOR MATRIX
            </div>
            <div className="font-display text-sm font-bold text-black uppercase">Market Radar</div>
            <div className="font-mono-brutal text-[10px] text-zinc-700">Side-by-side pricing &amp; CTAs</div>
          </div>

          <div className="p-3.5 bg-black text-white border-2 border-black shadow-[2px_2px_0_#ff4d00] space-y-1">
            <div className="font-mono-brutal text-[10px] font-bold text-[#ff4d00] uppercase tracking-wider">
              [04] AI PROMPTS
            </div>
            <div className="font-display text-sm font-bold text-white uppercase">Master Prompt</div>
            <div className="font-mono-brutal text-[10px] text-zinc-300">Copyable LLM Fixes</div>
          </div>
        </div>
      </div>
    </div>
  );
};
