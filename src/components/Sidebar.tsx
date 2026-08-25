import React, { useState, useEffect, useRef } from 'react';
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
  Brain,
  X,
  Smartphone,
  CloudLightning,
  TrendingUp,
  MousePointer,
  Link2,
} from 'lucide-react';
import { AuthSession, DashboardViewType } from '../types';

interface SidebarProps {
  currentView: DashboardViewType;
  onChangeView: (view: DashboardViewType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenConversionWizard: (url?: string) => void;
  onOpenClarityWizard?: (url?: string) => void;
  onOpenAutonomousAuditor?: (url?: string) => void;
  onOpenGoogleApiWizard?: () => void;
  onOpenSchemaGenerator?: () => void;
  onOpenSitemapAudit?: () => void;
  onOpenOnboardingWizard: () => void;
  onOpenGeoBlueprint: () => void;
  onOpenDomainProfiler: (domain?: string) => void;
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
  onOpenClarityWizard,
  onOpenAutonomousAuditor,
  onOpenGoogleApiWizard,
  onOpenSchemaGenerator,
  onOpenSitemapAudit,
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

  // Touch Swipe-to-Close gesture states for mobile
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  // Close on Escape key on mobile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Touch gesture handlers for mobile swipe-to-close
  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (!isMobileOpen) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!touchStartXRef.current || !touchStartYRef.current || !isMobileOpen) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartXRef.current;
    const deltaY = currentY - touchStartYRef.current;

    // Check if horizontal swipe dominates vertical scrolling
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Dragging left (closing)
        setDragOffset(deltaX);
      } else {
        // Resisting right drag
        setDragOffset(deltaX * 0.15);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    if (!touchStartXRef.current || !isMobileOpen) {
      setDragOffset(0);
      setIsSwiping(false);
      return;
    }
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - touchStartXRef.current;

    // Threshold: if swiped left by > 45px, trigger close
    if (deltaX < -45) {
      onCloseMobile();
    }
    setDragOffset(0);
    setIsSwiping(false);
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleTouchCancel = () => {
    setDragOffset(0);
    setIsSwiping(false);
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleNavClick = (callback: () => void) => {
    callback();
    if (window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  // Compute transform style during active touch dragging on mobile
  const sidebarTransform = isMobileOpen
    ? dragOffset < 0
      ? `translateX(${dragOffset}px)`
      : 'translateX(0)'
    : undefined;

  return (
    <>
      {/* Enhanced Mobile Backdrop Overlay with Blur & Instant Touch Dismiss */}
      <div
        onClick={onCloseMobile}
        onTouchEnd={(e) => {
          e.preventDefault();
          onCloseMobile();
        }}
        className={`fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity duration-300 ease-in-out ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileOpen}
        title="Tap or swipe to close mobile sidebar"
      />

      {/* Sidebar Container with Swipe Gestures */}
      <aside
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        style={{
          transform: sidebarTransform,
          transition: isSwiping ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s ease-in-out',
        }}
        className={`fixed top-0 bottom-0 left-0 z-50 lg:z-40 bg-[#f2efeb] border-r-4 border-black flex flex-col ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          isMobileOpen ? 'translate-x-0 shadow-[8px_0_0_#000]' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Swipe-To-Close Pull Bar on right edge */}
        <div className="lg:hidden absolute top-0 bottom-0 -right-4 w-4 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-16 bg-black/40 rounded-full" />
        </div>

        {/* Top Header: Logo + Collapse Toggle + Mobile Close Button */}
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

          <div className="flex items-center space-x-1.5">
            {/* Mobile Close Button with Swipe Hint */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 bg-[#ff4d00] text-black hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer flex items-center justify-center"
              title="Close Mobile Sidebar (Swipe Left)"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 bg-white hover:bg-black hover:text-white text-black border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Swipe Instruction Banner */}
        <div className="lg:hidden bg-amber-200/90 border-b-2 border-black px-3 py-1 text-[10px] font-mono-brutal font-bold text-black flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3 h-3 text-[#ff4d00]" />
            <span>SWIPE LEFT TO CLOSE</span>
          </span>
          <span className="text-[9px] bg-black text-white px-1 font-bold">ESC</span>
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
                {/* 14-Phase Autonomous Site Auditor & Conversion Engineer */}
                {onOpenAutonomousAuditor && (
                  <button
                    onClick={() => handleNavClick(onOpenAutonomousAuditor)}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                    } text-xs font-bold text-black bg-[#ff4d00]/15 hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                    title="14-Phase Autonomous Website Auditor & Conversion Engineer"
                  >
                    <Sparkles className="w-4 h-4 text-[#ff4d00] shrink-0" />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span>14-PHASE AUDITOR</span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-[#ff4d00] text-black border border-black font-bold">
                          ELITE
                        </span>
                      </div>
                    )}
                  </button>
                )}

                {/* Clarity Overload CRO Audit */}
                {onOpenClarityWizard && (
                  <button
                    onClick={() => handleNavClick(onOpenClarityWizard)}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                    } text-xs font-bold text-black bg-amber-50 hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                    title="Clarity Overload CRO Audit (5-Second Test & UX Cognitive Load)"
                  >
                    <Brain className="w-4 h-4 text-amber-600 shrink-0" />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span>CLARITY OVERLOAD</span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-amber-400 text-black border border-black font-bold">
                          5-SEC
                        </span>
                      </div>
                    )}
                  </button>
                )}

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

                {/* Google Indexing API 3-Step Setup Wizard */}
                {onOpenGoogleApiWizard && (
                  <button
                    onClick={() => handleNavClick(onOpenGoogleApiWizard)}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                    } text-xs font-bold text-black bg-emerald-50 hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                    title="Google Indexing API 3-Step Setup Wizard (JSON, GSC Owner, Handshake)"
                  >
                    <CloudLightning className="w-4 h-4 text-emerald-600 shrink-0" />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span>GOOGLE API WIZARD</span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-emerald-400 text-black border border-black font-bold">
                          SETUP
                        </span>
                      </div>
                    )}
                  </button>
                )}

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

                {/* Visual Schema Generator */}
                {onOpenSchemaGenerator && (
                  <button
                    onClick={() => handleNavClick(onOpenSchemaGenerator)}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                    } text-xs font-bold text-black bg-purple-50 hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                    title="Visual Schema Generator (FAQ, Article, Organization)"
                  >
                    <FileCode className="w-4 h-4 text-purple-600 shrink-0" />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span>SCHEMA GENERATOR</span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-purple-400 text-black border border-black font-bold">
                          JSON-LD
                        </span>
                      </div>
                    )}
                  </button>
                )}

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

                {/* Traffic & SERP CTR Generation Engine */}
                <button
                  onClick={() => handleNavClick(() => onChangeView('traffic_engine'))}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold transition-all cursor-pointer border-2 border-black uppercase ${
                    currentView === 'traffic_engine'
                      ? 'bg-[#ff4d00] text-black shadow-[2px_2px_0_#000]'
                      : 'bg-white text-black hover:bg-[#ff4d00] hover:text-black shadow-[2px_2px_0_#000]'
                  }`}
                  title="Traffic & SERP CTR Generation Engine (Chromium + SERP CTR + 301 Forwarding)"
                >
                  <TrendingUp className="w-4 h-4 text-black shrink-0" />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>TRAFFIC &amp; SERP CTR</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-black text-white border border-black font-bold">
                        v3.0
                      </span>
                    </div>
                  )}
                </button>

                {/* Bulk SEO URL Validator */}
                <button
                  onClick={() => handleNavClick(() => onChangeView('bulk_seo'))}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold transition-all cursor-pointer border-2 border-black uppercase ${
                    currentView === 'bulk_seo'
                      ? 'bg-black text-white shadow-[2px_2px_0_#ff4d00]'
                      : 'bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0_#000]'
                  }`}
                  title="Bulk SEO URL Validator (50+ Parallel URLs)"
                >
                  <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>BULK SEO VALIDATOR</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-400 text-black border border-black font-bold">
                        50+
                      </span>
                    </div>
                  )}
                </button>

                {/* Bulk Backlink & Referring Domain Counter */}
                <button
                  onClick={() => handleNavClick(() => onChangeView('backlink_counter'))}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                  } text-xs font-bold transition-all cursor-pointer border-2 border-black uppercase ${
                    currentView === 'backlink_counter'
                      ? 'bg-indigo-600 text-white shadow-[2px_2px_0_#000]'
                      : 'bg-white text-black hover:bg-indigo-600 hover:text-white shadow-[2px_2px_0_#000]'
                  }`}
                  title="Bulk Backlink & Referring Domain Counter (DataForSEO)"
                >
                  <Link2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>BACKLINK COUNTER</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-indigo-500 text-white border border-black font-bold">
                        NEW
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

                {/* XML Sitemap Audit Engine */}
                {onOpenSitemapAudit && (
                  <button
                    onClick={() => handleNavClick(onOpenSitemapAudit)}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
                    } text-xs font-bold text-black bg-white hover:bg-black hover:text-white border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer uppercase`}
                    title="XML Sitemap Crawler & Health Auditor"
                  >
                    <FileCode className="w-4 h-4 text-[#ff4d00] shrink-0" />
                    {!isCollapsed && <span>SITEMAP AUDIT</span>}
                  </button>
                )}
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
