import React from 'react';
import { ShieldCheck, Settings, History, Globe, Zap, Radio, Search, Sparkles, BookOpen, HelpCircle, Calendar, Timer, Crown, CreditCard } from 'lucide-react';
import { BillingInfo } from '../types';

interface HeaderProps {
  wsConnected: boolean;
  activeJobId: string | null;
  billing?: BillingInfo | null;
  onOpenSubscription?: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenDirectories: () => void;
  onOpenAudit: () => void;
  onOpenGeoBlueprint: () => void;
  onOpenDomainProfiler: () => void;
  onOpenHelpManual: () => void;
  onOpenWizard: () => void;
  onOpenScheduler?: () => void;
  totalDirectoriesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  wsConnected,
  activeJobId,
  billing,
  onOpenSubscription,
  onOpenSettings,
  onOpenHistory,
  onOpenDirectories,
  onOpenAudit,
  onOpenGeoBlueprint,
  onOpenDomainProfiler,
  onOpenHelpManual,
  onOpenWizard,
  onOpenScheduler,
  totalDirectoriesCount,
}) => {
  return (
    <header className="bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight">
                Backlink Engine <span className="text-indigo-400">&amp; Indexer</span>
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold tracking-wider">
                v2.4 Bento
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Automated Multi-Site Submissions • Live Verification • Ping &amp; Indexing
            </p>
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* WebSocket Live Status */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <Radio className={`w-3.5 h-3.5 ${wsConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span>{wsConnected ? 'Live WS Connected' : 'Connecting...'}</span>
          </div>

          {/* SEO Domain Profiler Button */}
          <button
            onClick={onOpenDomainProfiler}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all shadow-sm"
            title="Launch SEO Domain Profiler & GEO Authority Audit"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Domain Profiler</span>
          </button>

          {/* GEO Strategy & Enterprise SEO Blueprint Button */}
          <button
            onClick={onOpenGeoBlueprint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 text-purple-300 text-xs font-bold border border-purple-500/30 transition-all shadow-sm"
            title="Open Enterprise Growth & GEO Strategy Blueprint"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="hidden sm:inline">GEO Blueprint</span>
          </button>

          {/* SEO Website Audit Crawler Button */}
          <button
            onClick={onOpenAudit}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 transition-all shadow-sm"
            title="Launch Technical SEO Website Audit Crawler"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">SEO Crawler</span>
          </button>

          {/* Smart Batch Scheduler Button */}
          {onOpenScheduler && (
            <button
              onClick={onOpenScheduler}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all shadow-sm"
              title="Launch SmartBatchScheduler Drip Queue Engine"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden lg:inline">Batch Scheduler</span>
            </button>
          )}

          {/* Subscription & Credit Usage Quota Button */}
          {onOpenSubscription && (
            <button
              onClick={onOpenSubscription}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-all shadow-md group cursor-pointer"
              title="Manage Subscription & Indexation Credits"
            >
              <Zap className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-mono">
                {billing ? `${billing.credits_remaining} / ${billing.credits_total}` : '15 / 15'}
              </span>
              <span className="hidden xl:inline text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                {billing?.plan || 'TRIAL'}
              </span>
            </button>
          )}

          {/* Directory Count Badge Button */}
          <button
            onClick={onOpenDirectories}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 transition-all shadow-sm"
            title="View 55+ Built-in Directory Networks"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{totalDirectoriesCount} Directories</span>
          </button>

          {/* History Drawer Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 transition-all shadow-sm"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Help Manual & Guided Tour Button */}
          <button
            onClick={onOpenHelpManual}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all shadow-sm"
            title="Open Complete Help Manual & Guided User Tour"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Help Manual</span>
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 active:scale-95"
            title="Configure Proxies & Google Indexing API"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

