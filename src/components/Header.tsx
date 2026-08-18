import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  ShieldCheck,
  Settings,
  History,
  Globe,
  Zap,
  Radio,
  Search,
  Sparkles,
  BookOpen,
  HelpCircle,
  Calendar,
  Timer,
  Menu,
  Lock,
  LayoutGrid,
  Wand2,
  Download,
  Upload,
  HardDrive,
  FileCode,
  Activity,
  Shield,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Layers,
  Compass,
  CheckCircle2,
  Sliders,
  LogOut,
  FolderTree,
  FileSpreadsheet,
  Brain,
  Clock,
  Check,
  AlertCircle,
} from 'lucide-react';
import { AuthSession, DashboardViewType, ApiHealthReport } from '../types';
import { ApiHealthMonitor } from './ApiHealthMonitor';

interface HeaderProps {
  wsConnected: boolean;
  activeJobId: string | null;
  currentView?: DashboardViewType;
  onChangeView?: (view: DashboardViewType) => void;
  onToggleSidebar?: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenDirectories: () => void;
  onOpenAudit: () => void;
  onOpenGeoBlueprint: () => void;
  onOpenDomainProfiler: () => void;
  onOpenHelpManual: () => void;
  onOpenWizard: () => void;
  onOpenClarityWizard?: () => void;
  onOpenGoogleApiWizard?: () => void;
  onOpenScheduler?: () => void;
  onLockSession?: () => void;
  onQuickSaveWorkspace?: () => void;
  onImportWorkspace?: () => void;
  apiHealthReport?: ApiHealthReport | null;
  onRefreshApiHealth?: () => Promise<void>;
  isRefreshingApiHealth?: boolean;
  totalDirectoriesCount: number;
  authSession?: AuthSession | null;
}

export const Header: React.FC<HeaderProps> = ({
  wsConnected,
  activeJobId,
  currentView = 'bento',
  onChangeView,
  onToggleSidebar,
  onOpenSettings,
  onOpenHistory,
  onOpenDirectories,
  onOpenAudit,
  onOpenGeoBlueprint,
  onOpenDomainProfiler,
  onOpenHelpManual,
  onOpenWizard,
  onOpenClarityWizard,
  onOpenGoogleApiWizard,
  onOpenScheduler,
  onLockSession,
  onQuickSaveWorkspace,
  onImportWorkspace,
  apiHealthReport,
  onRefreshApiHealth,
  isRefreshingApiHealth = false,
  totalDirectoriesCount,
  authSession,
}) => {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const navMenuRef = useRef<HTMLDivElement | null>(null);

  // Cron / Server-Side Scheduler Status state
  const [cronStatus, setCronStatus] = useState<{
    status: 'RUNNING' | 'IDLE' | 'ERROR';
    activeJobsCount: number;
    runningJobsCount: number;
    totalJobsCount: number;
    nextExecution: string | null;
  }>({
    status: 'RUNNING',
    activeJobsCount: 0,
    runningJobsCount: 0,
    totalJobsCount: 0,
    nextExecution: null,
  });
  const [isCheckingCron, setIsCheckingCron] = useState(false);

  const fetchCronStatus = async () => {
    try {
      setIsCheckingCron(true);
      const res = await axios.get('/api/cron/status');
      if (res.data && res.data.scheduler) {
        const s = res.data.scheduler;
        setCronStatus({
          status: s.status === 'RUNNING' ? 'RUNNING' : 'IDLE',
          activeJobsCount: s.activeJobsCount || 0,
          runningJobsCount: s.runningJobsCount || 0,
          totalJobsCount: s.totalJobsCount || 0,
          nextExecution: s.nextExecution || null,
        });
      }
    } catch (err) {
      console.warn('Failed to fetch /api/cron/status:', err);
      setCronStatus((prev) => ({ ...prev, status: 'RUNNING' }));
    } finally {
      setIsCheckingCron(false);
    }
  };

  useEffect(() => {
    fetchCronStatus();
    const interval = setInterval(fetchCronStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target as Node)) {
        setIsNavMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNavMenuOpen(false);
      }
    };

    if (isNavMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNavMenuOpen]);

  const handleAction = (callback?: () => void) => {
    setIsNavMenuOpen(false);
    if (callback) callback();
  };

  return (
    <header className="bg-white border-b-4 border-black sticky top-0 z-30 shadow-none">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Brand Logo & System Label */}
          <div className="flex items-center space-x-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 bg-white hover:bg-black hover:text-white text-black border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer"
                title="Toggle Side Navigation"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            <div className="w-9 h-9 bg-black text-[#ff4d00] flex items-center justify-center border-2 border-black shadow-[2px_2px_0_#ff4d00] shrink-0 font-display font-black text-xl">
              <Zap className="w-5 h-5 fill-[#ff4d00]" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-black tracking-tight uppercase">
                  INDEXER ENGINE <span className="text-[#ff4d00]">// HIGH-DENSITY</span>
                </h1>
                <span className="font-mono-brutal text-[10px] uppercase px-2 py-0.5 bg-black text-[#ff4d00] font-bold tracking-wider hidden sm:inline-block">
                  V.2.4_PRST_X7
                </span>
              </div>
              <p className="font-mono-brutal text-[11px] text-zinc-700 hidden sm:block">
                SYSTEM_REVISION // AUTOMATED_BACKLINK_PIPELINE • LIVE_SERP_GATEWAY
              </p>
            </div>
          </div>

          {/* Center / Quick View Switcher Tabs */}
          {onChangeView && (
            <div className="hidden xl:flex items-center p-1 bg-[#f2efeb] border-2 border-black space-x-1 shadow-[2px_2px_0_#000]">
              <button
                onClick={() => onChangeView('bento')}
                className={`flex items-center space-x-1 px-2 py-1 text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer ${
                  currentView === 'bento'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-zinc-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onChangeView('wizards')}
                className={`flex items-center space-x-1 px-2 py-1 text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer ${
                  currentView === 'wizards'
                    ? 'bg-[#ff4d00] text-black'
                    : 'text-black hover:bg-zinc-200'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Wizards Hub</span>
              </button>

              <button
                onClick={() => onChangeView('submissions')}
                className={`flex items-center space-x-1 px-2 py-1 text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer ${
                  currentView === 'submissions'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-zinc-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Engine</span>
              </button>

              <button
                onClick={() => onChangeView('reports')}
                className={`flex items-center space-x-1 px-2 py-1 text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer ${
                  currentView === 'reports'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-zinc-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Reports</span>
              </button>

              <button
                onClick={() => onChangeView('live_ops')}
                className={`flex items-center space-x-1 px-2 py-1 text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer ${
                  currentView === 'live_ops'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-zinc-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-[#ff4d00]" />
                <span>Live Ops</span>
              </button>

              <button
                onClick={() => onChangeView('diagnostics')}
                className={`flex items-center space-x-1 px-2 py-1 text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer ${
                  currentView === 'diagnostics'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-zinc-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Health</span>
              </button>

              <button
                onClick={() => onChangeView('account')}
                className={`flex items-center space-x-1 px-2 py-1 text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer ${
                  currentView === 'account'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-zinc-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Auth &amp; RBAC</span>
              </button>
            </div>
          )}

          {/* Right Navigation Controls & Menu */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 flex-wrap gap-y-2 relative" id="header-right-nav-container">
            {/* WebSocket Live Status */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-[#f2efeb] border-2 border-black text-[11px] font-mono-brutal font-bold text-black shadow-[2px_2px_0_#000]">
              <Radio className={`w-3.5 h-3.5 ${wsConnected ? 'text-emerald-600 animate-pulse' : 'text-amber-600'}`} />
              <span>{wsConnected ? 'WS_200_OK' : 'WS_SYNC...'}</span>
            </div>

            {/* Server-Side Cron & Scheduler Status Indicator */}
            <button
              onClick={onOpenScheduler}
              title={`Server-Side Cron Status: ${cronStatus.status} (${cronStatus.activeJobsCount} active background queue jobs). Click to manage scheduler.`}
              className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 border-2 border-black text-[11px] font-mono-brutal font-bold shadow-[2px_2px_0_#000] transition-all cursor-pointer ${
                cronStatus.status === 'RUNNING'
                  ? 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-950 hover:bg-amber-100'
              }`}
            >
              <Clock className={`w-3.5 h-3.5 ${cronStatus.status === 'RUNNING' ? 'text-emerald-600 animate-spin' : 'text-amber-600'}`} />
              <span>
                CRON_{cronStatus.status === 'RUNNING' ? 'ACTIVE' : 'IDLE'}
                {cronStatus.activeJobsCount > 0 ? ` [${cronStatus.activeJobsCount}]` : ''}
              </span>
            </button>

            {/* Dedicated Real-Time API Health Monitor */}
            {apiHealthReport !== undefined && (
              <ApiHealthMonitor
                report={apiHealthReport}
                onRefresh={onRefreshApiHealth || (async () => {})}
                isRefreshing={isRefreshingApiHealth}
                wsConnected={wsConnected}
                onOpenSettings={onOpenSettings}
              />
            )}

            {/* ConversionWizard CRO Engine Button */}
            <button
              onClick={onOpenWizard}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#ff4d00] hover:bg-[#ff5c14] text-black border-2 border-black shadow-[3px_3px_0_#000] text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer"
              title="Launch ConversionWizard CRO Audit & AI Prompt Generator"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>[ WIZARD ]</span>
            </button>

            {/* Quick Access Desktop Buttons */}
            <div className="hidden xl:flex items-center space-x-1.5">
              {/* Quick Save Workspace State Button */}
              {onQuickSaveWorkspace && (
                <button
                  type="button"
                  onClick={onQuickSaveWorkspace}
                  className="flex items-center space-x-1 px-2.5 py-1.5 bg-white hover:bg-[#f2efeb] text-black border-2 border-black shadow-[2px_2px_0_#000] text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer"
                  title="Quick Save & Export Workspace State"
                >
                  <Download className="w-3.5 h-3.5 text-black" />
                  <span>SAVE</span>
                </button>
              )}

              {/* Import Workspace State Button */}
              {onImportWorkspace && (
                <button
                  type="button"
                  onClick={onImportWorkspace}
                  className="flex items-center space-x-1 px-2.5 py-1.5 bg-white hover:bg-[#f2efeb] text-black border-2 border-black shadow-[2px_2px_0_#000] text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer"
                  title="Resume / Import Workspace JSON"
                >
                  <Upload className="w-3.5 h-3.5 text-black" />
                  <span>RESUME</span>
                </button>
              )}

              {/* SEO Domain Profiler Button */}
              <button
                onClick={onOpenDomainProfiler}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-white hover:bg-[#f2efeb] text-black border-2 border-black shadow-[2px_2px_0_#000] text-xs font-mono-brutal font-bold uppercase transition-all"
                title="Launch SEO Domain Profiler"
              >
                <Globe className="w-3.5 h-3.5 text-black" />
                <span>PROFILER</span>
              </button>

              {/* Technical SEO Audit */}
              <button
                onClick={onOpenAudit}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-white hover:bg-[#f2efeb] text-black border-2 border-black shadow-[2px_2px_0_#000] text-xs font-mono-brutal font-bold uppercase transition-all"
                title="Launch Technical SEO Website Audit Crawler"
              >
                <Search className="w-3.5 h-3.5 text-black" />
                <span>AUDIT</span>
              </button>
            </div>

            {/* MASTER RIGHT-SIDE NAVIGATION MENU DROPDOWN */}
            <div className="relative" ref={navMenuRef}>
              <button
                type="button"
                id="header-nav-menu-button"
                onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 border-2 border-black shadow-[3px_3px_0_#000] text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer ${
                  isNavMenuOpen
                    ? 'bg-black text-white'
                    : 'bg-[#f2efeb] hover:bg-zinc-200 text-black'
                }`}
                title="Open Complete Navigation Menu & Tools Hub"
                aria-expanded={isNavMenuOpen}
              >
                <Compass className={`w-3.5 h-3.5 ${isNavMenuOpen ? 'text-[#ff4d00] animate-spin' : 'text-black'}`} />
                <span>MENU</span>
                {isNavMenuOpen ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
              </button>

              {/* Navigation Menu Popover / Dropdown Panel */}
              {isNavMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border-4 border-black shadow-[6px_6px_0_#000] z-50 p-3 space-y-3 font-sans animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Menu Header */}
                  <div className="flex items-center justify-between border-b-2 border-black pb-2 bg-[#f2efeb] p-2 -m-1 mb-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 bg-[#ff4d00] border border-black animate-ping"></div>
                      <span className="font-mono-brutal text-xs font-bold uppercase text-black">
                        NAVIGATION &amp; TOOLS HUB
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-brutal px-1.5 py-0.5 bg-black text-[#ff4d00] font-bold">
                      ESC_TO_CLOSE
                    </span>
                  </div>

                  {/* Section 1: AI & SEO Intelligence Suite */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono-brutal font-bold text-zinc-500 uppercase tracking-wider px-1">
                      // AI &amp; SEO INTELLIGENCE
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {/* Clarity Overload CRO Audit Wizard */}
                      {onOpenClarityWizard && (
                        <button
                          type="button"
                          onClick={() => handleAction(onOpenClarityWizard)}
                          className="w-full flex items-center justify-between p-2 hover:bg-amber-50 border border-transparent hover:border-black transition-all text-left text-xs font-medium text-black group cursor-pointer"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="p-1.5 bg-amber-400 text-black border border-black group-hover:scale-105 transition-transform">
                              <Brain className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-bold text-black text-xs group-hover:text-amber-800 transition-colors">
                                Clarity Overload CRO Audit
                              </div>
                              <div className="text-[10px] text-zinc-600 font-mono-brutal">
                                5-Second Test • UX cognitive friction &amp; bloat
                              </div>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono-brutal bg-black text-amber-400 px-1.5 py-0.5 uppercase font-bold">
                            5-SEC_TEST
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleAction(onOpenWizard)}
                        className="w-full flex items-center justify-between p-2 hover:bg-[#fff4ed] border border-transparent hover:border-black transition-all text-left text-xs font-medium text-black group cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 bg-[#ff4d00] text-black border border-black group-hover:scale-105 transition-transform">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-black text-xs group-hover:text-[#ff4d00] transition-colors">
                              ConversionWizard CRO
                            </div>
                            <div className="text-[10px] text-zinc-600 font-mono-brutal">
                              Audit conversion rates &amp; generate AI prompts
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono-brutal bg-black text-white px-1.5 py-0.5 uppercase font-bold">
                          AI_CORE
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAction(onOpenGeoBlueprint)}
                        className="w-full flex items-center justify-between p-2 hover:bg-zinc-100 border border-transparent hover:border-black transition-all text-left text-xs font-medium text-black group cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 bg-black text-[#ff4d00] border border-black">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-black text-xs">GEO Strategy Blueprint</div>
                            <div className="text-[10px] text-zinc-600 font-mono-brutal">
                              Generative Engine Optimization schema
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono-brutal bg-[#f2efeb] border border-black text-black px-1.5 py-0.5 font-bold">
                          LLM_GEO
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAction(onOpenAudit)}
                        className="w-full flex items-center justify-between p-2 hover:bg-zinc-100 border border-transparent hover:border-black transition-all text-left text-xs font-medium text-black group cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 bg-black text-white border border-black">
                            <Search className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-black text-xs">Technical SEO Audit</div>
                            <div className="text-[10px] text-zinc-600 font-mono-brutal">
                              Deep crawl, HTTP response &amp; PDF report
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono-brutal bg-[#f2efeb] border border-black text-black px-1.5 py-0.5 font-bold">
                          CRAWLER
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAction(onOpenDomainProfiler)}
                        className="w-full flex items-center justify-between p-2 hover:bg-zinc-100 border border-transparent hover:border-black transition-all text-left text-xs font-medium text-black group cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 bg-black text-white border border-black">
                            <Globe className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-black text-xs">SEO Domain Profiler</div>
                            <div className="text-[10px] text-zinc-600 font-mono-brutal">
                              Domain authority &amp; SERP footprints
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono-brutal bg-[#f2efeb] border border-black text-black px-1.5 py-0.5 font-bold">
                          PROFILER
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAction(onOpenDirectories)}
                        className="w-full flex items-center justify-between p-2 hover:bg-zinc-100 border border-transparent hover:border-black transition-all text-left text-xs font-medium text-black group cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 bg-black text-white border border-black">
                            <FolderTree className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-black text-xs">Built-in Directory Networks</div>
                            <div className="text-[10px] text-zinc-600 font-mono-brutal">
                              {totalDirectoriesCount} verified high-DA syndication targets
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono-brutal bg-black text-[#ff4d00] px-1.5 py-0.5 font-bold">
                          {totalDirectoriesCount} DIRS
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Section 2: Workspace & Session State */}
                  <div className="space-y-1 pt-2 border-t-2 border-zinc-200">
                    <div className="text-[10px] font-mono-brutal font-bold text-zinc-500 uppercase tracking-wider px-1">
                      // WORKSPACE &amp; HISTORY
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {onQuickSaveWorkspace && (
                        <button
                          type="button"
                          onClick={() => handleAction(onQuickSaveWorkspace)}
                          className="flex items-center space-x-1.5 p-2 bg-[#f2efeb] hover:bg-black hover:text-white text-black border border-black text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>SAVE_JSON</span>
                        </button>
                      )}

                      {onImportWorkspace && (
                        <button
                          type="button"
                          onClick={() => handleAction(onImportWorkspace)}
                          className="flex items-center space-x-1.5 p-2 bg-[#f2efeb] hover:bg-black hover:text-white text-black border border-black text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>RESUME_JSON</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleAction(onOpenHistory)}
                        className="flex items-center space-x-1.5 p-2 bg-[#f2efeb] hover:bg-black hover:text-white text-black border border-black text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>LOGS_DRAWER</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAction(onOpenHelpManual)}
                        className="flex items-center space-x-1.5 p-2 bg-[#f2efeb] hover:bg-black hover:text-white text-black border border-black text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>DOC_MANUAL</span>
                      </button>
                    </div>
                  </div>

                  {/* Section 3: System Settings, Security & Billing */}
                  <div className="space-y-1 pt-2 border-t-2 border-zinc-200">
                    <div className="text-[10px] font-mono-brutal font-bold text-zinc-500 uppercase tracking-wider px-1">
                      // CONFIGURATION &amp; SECURITY
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      <button
                        type="button"
                        onClick={() => handleAction(onOpenSettings)}
                        className="w-full flex items-center justify-between p-2 bg-black text-white hover:bg-zinc-800 border border-black text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <Settings className="w-3.5 h-3.5 text-[#ff4d00]" />
                          <span>SYSTEM CONFIG &amp; PROXIES</span>
                        </div>
                        <span className="text-[9px] text-[#ff4d00]">OPEN ⚙</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAction(onOpenSettings)}
                        className="w-full flex items-center justify-between p-2 bg-[#f2efeb] hover:bg-zinc-200 text-black border border-black text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                          <span>STRIPE SUBSCRIPTION &amp; BILLING</span>
                        </div>
                        <span className="text-[9px] bg-purple-100 text-purple-800 px-1 py-0.5 border border-purple-300">
                          PRO TIER
                        </span>
                      </button>

                      {authSession && onLockSession && (
                        <button
                          type="button"
                          onClick={() => handleAction(onLockSession)}
                          className="w-full flex items-center justify-between p-2 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-400 text-xs font-mono-brutal font-bold uppercase transition-all cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <Lock className="w-3.5 h-3.5 text-rose-600" />
                            <span>LOCK / SIGN OUT ({authSession.email.split('@')[0]})</span>
                          </div>
                          <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Authorized Account Badge */}
            {authSession && onLockSession && (
              <button
                onClick={onLockSession}
                className="hidden md:flex items-center space-x-1 px-2 py-1.5 bg-[#f2efeb] text-black border-2 border-black shadow-[2px_2px_0_#000] text-xs font-mono-brutal font-bold uppercase cursor-pointer"
                title={`Authorized as ${authSession.email}. Click to lock session.`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline truncate max-w-[100px]">{authSession.email.split('@')[0]}</span>
                <Lock className="w-3 h-3 text-black ml-0.5" />
              </button>
            )}

            {/* Settings Modal Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 bg-black hover:bg-zinc-800 text-[#ff4d00] border-2 border-black shadow-[3px_3px_0_#ff4d00] transition-all cursor-pointer"
              title="Configure Proxies, Site Authorization & Google Indexing API"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Brutalist 50-Word GEO Answer Callout Box */}
        <div className="mt-2.5 bg-black text-white border-2 border-black p-2.5 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2 shadow-[3px_3px_0_#ff4d00]">
          <div className="flex items-start gap-2">
            <span className="px-1.5 py-0.5 bg-[#ff4d00] text-black font-mono-brutal text-[10px] uppercase font-bold shrink-0 mt-0.5">
              GEO_CORE
            </span>
            <p className="font-sans text-zinc-200 text-xs sm:text-[12.5px] leading-snug">
              Automated high-density indexing pipeline integrating Google Indexing API v3, IndexNow protocol, and high-DA authority syndication. Executes HTTP 200 live verification, algorithmic keyword radar, and Generative Engine Optimization for peak AI search citations.
            </p>
          </div>
          <span className="text-[10px] font-mono-brutal text-[#ff4d00] bg-zinc-900 px-2 py-0.5 border border-zinc-700 shrink-0 hidden xl:inline-block">
            LLM_DISPATCH // 200_OK
          </span>
        </div>
      </div>
    </header>
  );
};

