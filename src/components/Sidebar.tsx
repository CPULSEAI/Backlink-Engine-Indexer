import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  Wand2,
  Globe,
  Search,
  Timer,
  History,
  Settings,
  BookOpen,
  Radio,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Lock,
  LogOut,
  Activity,
  FileCode,
  Compass,
  Radar,
  Flame,
  LayoutGrid,
  CheckCircle2,
  Send,
  Sliders,
  HelpCircle,
  BarChart3,
  Server,
  Key,
} from 'lucide-react';
import { AuthSession, DashboardViewType } from '../types';

interface SidebarProps {
  currentView: DashboardViewType;
  onChangeView: (view: DashboardViewType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenConversionWizard: () => void;
  onOpenOnboardingWizard: () => void;
  onOpenGeoBlueprint: () => void;
  onOpenDomainProfiler: () => void;
  onOpenAudit: () => void;
  onOpenScheduler: () => void;
  onOpenDirectories: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenHelpManual: () => void;
  onOpenContentGrader: (url?: string, keyword?: string) => void;
  onLockSession: () => void;
  totalDirectoriesCount: number;
  wsConnected: boolean;
  authSession: AuthSession | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onChangeView,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onOpenConversionWizard,
  onOpenOnboardingWizard,
  onOpenGeoBlueprint,
  onOpenDomainProfiler,
  onOpenAudit,
  onOpenScheduler,
  onOpenDirectories,
  onOpenHistory,
  onOpenSettings,
  onOpenHelpManual,
  onOpenContentGrader,
  onLockSession,
  totalDirectoriesCount,
  wsConnected,
  authSession,
}) => {
  // Category accordion expansion states
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({
    views: true,
    wizards: true,
    engines: true,
    audits: true,
    network: true,
    system: true,
  });

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleNavClick = (callback: () => void) => {
    callback();
    if (window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#f2efeb] border-r-4 border-black flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header: Logo + Collapse Toggle */}
        <div className="h-16 px-4 flex items-center justify-between border-b-4 border-black shrink-0 bg-white">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 bg-black text-[#ff4d00] flex items-center justify-center border-2 border-black shadow-[2px_2px_0_#000] shrink-0 font-display font-black text-xl">
              <Zap className="w-5 h-5 fill-[#ff4d00]" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 font-mono-brutal">
                <div className="text-sm font-bold text-black uppercase tracking-tight truncate flex items-center space-x-1.5 font-oswald">
                  <span>INDEXER ENGINE</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#ff4d00] text-black border border-black font-bold">
                    PRO
                  </span>
                </div>
                <div className="text-[10px] text-zinc-700 font-bold flex items-center space-x-1 uppercase">
                  <span className={`w-2 h-2 border border-black ${wsConnected ? 'bg-[#ff4d00]' : 'bg-zinc-400'}`} />
                  <span>{wsConnected ? 'ENGINE ONLINE' : 'CONNECTING...'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 bg-white hover:bg-black hover:text-white text-black border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 font-mono-brutal">
          {/* SECTION 1: DASHBOARD VIEWS */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div
                onClick={() => toggleCategory('views')}
                className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-black cursor-pointer select-none border-b-2 border-black mb-2"
              >
                <span>DASHBOARD VIEWS</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${openCategories.views ? 'rotate-0' : '-rotate-90'}`}
                />
              </div>
            )}

            {(isCollapsed || openCategories.views) && (
              <div className="space-y-1.5">
                {/* All-in-One Bento View */}
                <button
                  onClick={() => handleNavClick(() => onChangeView('bento'))}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold transition-all cursor-pointer border-2 border-black uppercase ${
                    currentView === 'bento'
                      ? 'bg-black text-white shadow-[2px_2px_0_#ff4d00]'
                      : 'bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0_#000]'
                  }`}
                  title="All-in-One Bento Dashboard"
                >
                  <LayoutGrid className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>BENTO DASHBOARD</span>}
                </button>

                {/* Wizards & Optimization Hub View */}
                <button
                  onClick={() => handleNavClick(() => onChangeView('wizards'))}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold transition-all cursor-pointer border-2 border-black uppercase ${
                    currentView === 'wizards'
                      ? 'bg-[#ff4d00] text-black shadow-[2px_2px_0_#000]'
                      : 'bg-white text-black hover:bg-[#ff4d00] hover:text-black shadow-[2px_2px_0_#000]'
                  }`}
                  title="Wizards & Growth Hub"
                >
                  <Wand2 className="w-4 h-4 shrink-0" />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>WIZARDS HUB</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 bg-black text-white border border-black font-bold">
                        NEW
                      </span>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: WIZARDS & STRATEGY */}
          <div className="space-y-1 pt-2">
            {!isCollapsed && (
              <div
                onClick={() => toggleCategory('wizards')}
                className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-black cursor-pointer select-none border-b-2 border-black mb-2"
              >
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-3 h-3 text-[#ff4d00]" />
                  <span>WIZARDS &amp; GROWTH</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${openCategories.wizards ? 'rotate-0' : '-rotate-90'}`}
                />
              </div>
            )}

            {(isCollapsed || openCategories.wizards) && (
              <div className="space-y-1.5">
                {/* ConversionWizard CRO */}
                <button
                  onClick={() => handleNavClick(onOpenConversionWizard)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold text-black bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                  title="ConversionWizard CRO Audit & AI Prompts"
                >
                  <Wand2 className="w-4 h-4 text-[#ff4d00] shrink-0" />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>CONVERSION WIZARD</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-[#ff4d00] text-black border border-black font-bold">
                        CRO
                      </span>
                    </div>
                  )}
                </button>

                {/* 3-Step Onboarding Setup */}
                <button
                  onClick={() => handleNavClick(onOpenOnboardingWizard)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold text-black bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                  title="Onboarding & Strategy Wizard"
                >
                  <Compass className="w-4 h-4 text-black shrink-0" />
                  {!isCollapsed && <span>ONBOARDING WIZARD</span>}
                </button>

                {/* Enterprise GEO Growth Blueprint */}
                <button
                  onClick={() => handleNavClick(onOpenGeoBlueprint)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold text-black bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                  title="Enterprise GEO Blueprint (LLM Citations)"
                >
                  <Sparkles className="w-4 h-4 text-[#ff4d00] shrink-0" />
                  {!isCollapsed && <span>GEO BLUEPRINT</span>}
                </button>

                {/* AI Content & Readiness Grader */}
                <button
                  onClick={() => handleNavClick(() => onOpenContentGrader())}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold text-black bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                  title="AI Content & Readiness Grader"
                >
                  <BarChart3 className="w-4 h-4 text-black shrink-0" />
                  {!isCollapsed && <span>CONTENT GRADER</span>}
                </button>

                {/* Plain-English Executive Reports */}
                <button
                  onClick={() => handleNavClick(() => onChangeView('reports'))}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold transition-all cursor-pointer border-2 border-black uppercase ${
                    currentView === 'reports'
                      ? 'bg-black text-white shadow-[2px_2px_0_#ff4d00]'
                      : 'bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0_#000]'
                  }`}
                  title="Executive Plain-English Reports & Exports"
                >
                  <FileCode className="w-4 h-4 text-[#ff4d00] shrink-0" />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>EXECUTIVE REPORTS</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-[#ff4d00] text-black border border-black font-bold">
                        PDF/CSV
                      </span>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* SECTION 3: CORE ENGINES & SUBMISSION */}
          <div className="space-y-1 pt-2">
            {!isCollapsed && (
              <div
                onClick={() => toggleCategory('engines')}
                className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-black cursor-pointer select-none border-b-2 border-black mb-2"
              >
                <div className="flex items-center space-x-1.5">
                  <Zap className="w-3 h-3 text-[#ff4d00]" />
                  <span>CORE ENGINES</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${openCategories.engines ? 'rotate-0' : '-rotate-90'}`}
                />
              </div>
            )}

            {(isCollapsed || openCategories.engines) && (
              <div className="space-y-1.5">
                {/* Multi-Site Submissions Form */}
                <button
                  onClick={() => handleNavClick(() => onChangeView('submissions'))}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold transition-all cursor-pointer border-2 border-black uppercase ${
                    currentView === 'submissions'
                      ? 'bg-black text-white shadow-[2px_2px_0_#ff4d00]'
                      : 'bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0_#000]'
                  }`}
                  title="Multi-Site Submission Engine"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>SUBMISSION ENGINE</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-[#ff4d00] text-black border border-black font-bold">
                        LIVE
                      </span>
                    </div>
                  )}
                </button>

                {/* Smart Batch Scheduler */}
                <button
                  onClick={() => handleNavClick(onOpenScheduler)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold text-black bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                  title="Smart Batch Scheduler (Drip Queue)"
                >
                  <Timer className="w-4 h-4 text-[#ff4d00] shrink-0" />
                  {!isCollapsed && <span>BATCH SCHEDULER</span>}
                </button>
              </div>
            )}
          </div>

          {/* SECTION 4: SEO AUDITING & PROFILERS */}
          <div className="space-y-1 pt-2">
            {!isCollapsed && (
              <div
                onClick={() => toggleCategory('audits')}
                className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-black cursor-pointer select-none border-b-2 border-black mb-2"
              >
                <div className="flex items-center space-x-1.5">
                  <Search className="w-3 h-3 text-black" />
                  <span>AUDITS &amp; INTEL</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${openCategories.audits ? 'rotate-0' : '-rotate-90'}`}
                />
              </div>
            )}

            {(isCollapsed || openCategories.audits) && (
              <div className="space-y-1.5">
                {/* Domain Profiler */}
                <button
                  onClick={() => handleNavClick(onOpenDomainProfiler)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold text-black bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                  title="SEO Domain Profiler & GEO Authority"
                >
                  <Globe className="w-4 h-4 text-black shrink-0" />
                  {!isCollapsed && <span>DOMAIN PROFILER</span>}
                </button>

                {/* Technical SEO Crawler */}
                <button
                  onClick={() => handleNavClick(onOpenAudit)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold text-black bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                  title="Technical SEO Crawler & Audit"
                >
                  <Search className="w-4 h-4 text-black shrink-0" />
                  {!isCollapsed && <span>TECHNICAL CRAWLER</span>}
                </button>
              </div>
            )}
          </div>

          {/* SECTION 5: NETWORK & INFRASTRUCTURE */}
          <div className="space-y-1 pt-2">
            {!isCollapsed && (
              <div
                onClick={() => toggleCategory('network')}
                className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-black cursor-pointer select-none border-b-2 border-black mb-2"
              >
                <div className="flex items-center space-x-1.5">
                  <Server className="w-3 h-3 text-black" />
                  <span>NETWORK &amp; HEALTH</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${openCategories.network ? 'rotate-0' : '-rotate-90'}`}
                />
              </div>
            )}

            {(isCollapsed || openCategories.network) && (
              <div className="space-y-1.5">
                {/* 55+ Directory Network */}
                <button
                  onClick={() => handleNavClick(onOpenDirectories)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold text-black bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                  title="55+ Directory Networks"
                >
                  <Globe className="w-4 h-4 text-black shrink-0" />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>DIRECTORY NETWORK</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-black text-white border border-black font-bold">
                        {totalDirectoriesCount}
                      </span>
                    </div>
                  )}
                </button>

                {/* Submissions History */}
                <button
                  onClick={() => handleNavClick(onOpenHistory)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold text-black bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                  title="Job Submission History"
                >
                  <History className="w-4 h-4 text-black shrink-0" />
                  {!isCollapsed && <span>HISTORY LOGS</span>}
                </button>

                {/* Live Operations Stream */}
                <button
                  onClick={() => handleNavClick(() => onChangeView('live_ops'))}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold transition-all cursor-pointer border-2 border-black uppercase ${
                    currentView === 'live_ops'
                      ? 'bg-black text-white shadow-[2px_2px_0_#ff4d00]'
                      : 'bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0_#000]'
                  }`}
                  title="Live Operations & Verification Stream"
                >
                  <Radio className="w-4 h-4 text-[#ff4d00] shrink-0" />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>LIVE OPERATIONS</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500 text-white font-bold">
                        REAL-TIME
                      </span>
                    </div>
                  )}
                </button>

                {/* Diagnostics Center */}
                <button
                  onClick={() => handleNavClick(() => onChangeView('diagnostics'))}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold transition-all cursor-pointer border-2 border-black uppercase ${
                    currentView === 'diagnostics'
                      ? 'bg-black text-white shadow-[2px_2px_0_#ff4d00]'
                      : 'bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0_#000]'
                  }`}
                  title="Diagnostics & Guided Error Center"
                >
                  <Activity className="w-4 h-4 text-black shrink-0" />
                  {!isCollapsed && <span>DIAGNOSTICS &amp; ERRORS</span>}
                </button>
              </div>
            )}
          </div>

          {/* SECTION 6: SYSTEM & SECURITY */}
          <div className="space-y-1 pt-2">
            {!isCollapsed && (
              <div
                onClick={() => toggleCategory('system')}
                className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-black cursor-pointer select-none border-b-2 border-black mb-2"
              >
                <span>SYSTEM &amp; SECURITY</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${openCategories.system ? 'rotate-0' : '-rotate-90'}`}
                />
              </div>
            )}

            {(isCollapsed || openCategories.system) && (
              <div className="space-y-1.5">
                {/* Account & Enterprise Auth */}
                <button
                  onClick={() => handleNavClick(() => onChangeView('account'))}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold transition-all cursor-pointer border-2 border-black uppercase ${
                    currentView === 'account'
                      ? 'bg-black text-white shadow-[2px_2px_0_#ff4d00]'
                      : 'bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0_#000]'
                  }`}
                  title="Enterprise Account, MFA & RBAC"
                >
                  <ShieldCheck className="w-4 h-4 text-[#ff4d00] shrink-0" />
                  {!isCollapsed && <span>ACCOUNT &amp; SECURITY</span>}
                </button>
                {/* Help Manual */}
                <button
                  onClick={() => handleNavClick(onOpenHelpManual)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold text-black bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                  title="Help Manual & Guided Tour"
                >
                  <BookOpen className="w-4 h-4 text-black shrink-0" />
                  {!isCollapsed && <span>HELP MANUAL</span>}
                </button>

                {/* Settings & Google Indexing API */}
                <button
                  onClick={() => handleNavClick(onOpenSettings)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold text-black bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                  title="System Settings & Google Indexing API"
                >
                  <Settings className="w-4 h-4 text-black shrink-0" />
                  {!isCollapsed && <span>SYSTEM SETTINGS</span>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM USER PROFILE & SITE AUTHORIZATION FOOTER */}
        <div className="p-3 border-t-4 border-black bg-white shrink-0 font-mono-brutal">
          {!isCollapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-8 h-8 bg-black text-[#ff4d00] border-2 border-black flex items-center justify-center shadow-[1px_1px_0_#000] shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-black truncate">
                      {authSession?.email || 'admin@careerpulseai.net'}
                    </div>
                    <div className="text-[9px] text-[#ff4d00] font-bold flex items-center space-x-1 uppercase">
                      <span className="w-1.5 h-1.5 bg-[#ff4d00] border border-black" />
                      <span>SITE AUTHORIZED</span>
                    </div>
                  </div>
                </div>

                {/* Lock / Sign Out Button */}
                <button
                  onClick={onLockSession}
                  className="p-1.5 bg-white hover:bg-black hover:text-white text-black border-2 border-black shadow-[1px_1px_0_#000] transition-all cursor-pointer"
                  title="Lock Site Authorization / Sign Out"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={onLockSession}
                className="p-2 bg-white hover:bg-black hover:text-[#ff4d00] text-black border-2 border-black shadow-[1px_1px_0_#000] transition-all cursor-pointer"
                title={`Authorized: ${authSession?.email || 'admin'} (Click to Lock)`}
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
