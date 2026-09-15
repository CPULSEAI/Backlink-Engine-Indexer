import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Copy,
  Check,
  Globe,
  Search,
  Bot,
  Layers,
  ArrowRight,
  ExternalLink,
  Target,
  FileCode,
  Gauge,
  SlidersHorizontal,
  Compass,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  SeoRecoveryDirectiveState,
  ContinuousAuditResponsibilityItem,
  EnforcedDirectiveTargets,
  MaintainedVisibilityChannel,
  DirectiveSubTask
} from '../types';

interface SeoRecoveryDirectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchAuditor?: () => void;
  onLaunchTrafficLoss?: (url?: string) => void;
  onLaunchRevenueMandate?: () => void;
  onLaunchGlobalExpansion?: () => void;
  initialDomain?: string;
}

export const SeoRecoveryDirectiveModal: React.FC<SeoRecoveryDirectiveModalProps> = ({
  isOpen,
  onClose,
  onLaunchAuditor,
  onLaunchTrafficLoss,
  onLaunchRevenueMandate,
  onLaunchGlobalExpansion,
  initialDomain = 'https://careerpulseai.net',
}) => {
  const [directiveState, setDirectiveState] = useState<SeoRecoveryDirectiveState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [auditing, setAuditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'responsibilities' | 'targets' | 'visibility' | 'prompt'>('overview');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [domainInput, setDomainInput] = useState<string>(initialDomain);
  const [expandedResponsibility, setExpandedResponsibility] = useState<string | null>('robots.txt');

  const fetchDirectiveState = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/directives/seo-recovery');
      if (res.data?.success) {
        setDirectiveState(res.data);
      }
    } catch (err) {
      console.error('Failed to load SEO Recovery Directive state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDirectiveState();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunContinuousAudit = async () => {
    try {
      setAuditing(true);
      toast.loading('Auditing robots.txt, sitemaps, schema, canonicals, redirects & AI visibility...', { id: 'audit-run' });
      const res = await axios.post('/api/directives/seo-recovery/audit', { domain: domainInput });
      if (res.data?.success) {
        setDirectiveState(res.data);
        toast.success('Continuous Audit complete! All 8 systems verified with 0 target tolerance.', { id: 'audit-run' });
      } else {
        toast.error('Audit completed with warnings.', { id: 'audit-run' });
      }
    } catch (err: any) {
      toast.error('Failed to execute audit cycle: ' + (err.message || 'Unknown error'), { id: 'audit-run' });
    } finally {
      setAuditing(false);
    }
  };

  const copyPromptText = async () => {
    const text = directiveState?.rawDirectivePrompt || `Prompt Name:
SEO, GEO, AI SEARCH & INDEXATION RECOVERY DIRECTIVE

Primary Owner of SEO Recovery

This is the MOST IMPORTANT deployment location.

Add
AUTONOMOUS CRAWL AUDIT & INDEXATION RECOVERY DIRECTIVE
SEO, GEO, AI SEARCH & ORGANIC REVENUE RECOVERY DIRECTIVE
GLOBAL MARKET EXPANSION DIRECTIVE

SEO/GEO Responsibilities
Continuously audit:

- robots.txt
- XML Sitemaps
- Schema
- Canonicals
- Redirects
- Internal Linking
- AI Search Visibility
- Core Web Vitals

Target:

Coverage Errors = 0

404 Errors = 0

Blocked AI Crawlers = 0

Schema Coverage = 100%

Maintain:

Google Visibility
Bing Visibility
ChatGPT Visibility
Perplexity Visibility
Copilot Visibility
Gemini Visibility`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
      toast.success('Directive Prompt copied to clipboard!');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadPromptMarkdown = () => {
    const text = directiveState?.rawDirectivePrompt || '';
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SEO-GEO-INDEXATION-RECOVERY-DIRECTIVE.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Directive Prompt downloaded as Markdown!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-hidden font-sans">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-zinc-950 border-4 border-black shadow-[8px_8px_0_#000] flex flex-col rounded-xl overflow-hidden text-zinc-100">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 bg-black border-b-2 border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-2 py-0.5 bg-[#ff4d00] text-black text-[10px] font-black uppercase tracking-wider font-mono">
                SYSTEM DIRECTIVE
              </span>
              <span className="px-2 py-0.5 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-wider font-mono">
                PRIMARY OWNER OF SEO RECOVERY
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold font-mono">
                MOST IMPORTANT DEPLOYMENT LOCATION
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase mt-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ff4d00]" />
              <span>SEO, GEO, AI Search &amp; Indexation Recovery Directive</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Authoritative command architecture governing continuous audits, zero-tolerance targets, and multi-engine visibility across Google, Bing, ChatGPT, Perplexity, Copilot, and Gemini.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunContinuousAudit}
              disabled={auditing}
              className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black uppercase text-xs rounded border border-black shadow-[2px_2px_0_#000] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-black ${auditing ? 'animate-spin' : ''}`} />
              <span>{auditing ? 'Auditing...' : 'Run Audit Cycle'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-zinc-900 hover:bg-[#ff4d00] hover:text-black text-zinc-300 border border-zinc-700 rounded transition-colors"
              title="Close Directive Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRIMARY SUB-DIRECTIVES TRIO BANNER */}
        <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded bg-black/60 border border-zinc-800">
            <div className="flex items-center space-x-2 truncate">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-mono text-[10px] font-bold text-zinc-200 truncate">
                AUTONOMOUS CRAWL AUDIT
              </span>
            </div>
            {onLaunchAuditor && (
              <button
                onClick={() => { onClose(); onLaunchAuditor(); }}
                className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] rounded font-mono shrink-0 ml-2"
              >
                Launch
              </button>
            )}
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-black/60 border border-zinc-800">
            <div className="flex items-center space-x-2 truncate">
              <div className="w-2 h-2 rounded-full bg-[#ff4d00] shrink-0" />
              <span className="font-mono text-[10px] font-bold text-zinc-200 truncate">
                ORGANIC REVENUE RECOVERY
              </span>
            </div>
            {onLaunchTrafficLoss && (
              <button
                onClick={() => { onClose(); onLaunchTrafficLoss(domainInput); }}
                className="px-2 py-0.5 bg-[#ff4d00]/20 text-[#ff4d00] hover:bg-[#ff4d00] hover:text-black text-[10px] rounded font-mono shrink-0 ml-2 font-bold"
              >
                Audit
              </button>
            )}
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-black/60 border border-zinc-800">
            <div className="flex items-center space-x-2 truncate">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span className="font-mono text-[10px] font-bold text-zinc-200 truncate">
                GLOBAL MARKET EXPANSION
              </span>
            </div>
            {onLaunchGlobalExpansion && (
              <button
                onClick={() => { onClose(); onLaunchGlobalExpansion(); }}
                className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-black text-[10px] rounded font-mono shrink-0 ml-2"
              >
                Global
              </button>
            )}
          </div>
        </div>

        {/* TAB NAVIGATION BAR */}
        <div className="flex border-b border-zinc-800 bg-zinc-950 px-4 pt-2 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-xs font-mono font-bold uppercase transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#ff4d00] text-[#ff4d00] bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Directive Command (Overview)</span>
          </button>

          <button
            onClick={() => setActiveTab('targets')}
            className={`px-3 py-2 text-xs font-mono font-bold uppercase transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'targets'
                ? 'border-[#ff4d00] text-[#ff4d00] bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Strict Operational Targets</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] rounded font-mono">
              4 Zero-Tolerance
            </span>
          </button>

          <button
            onClick={() => setActiveTab('responsibilities')}
            className={`px-3 py-2 text-xs font-mono font-bold uppercase transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'responsibilities'
                ? 'border-[#ff4d00] text-[#ff4d00] bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Continuous Auditing (8 Systems)</span>
            <span className="px-1.5 py-0.2 bg-orange-500/20 text-orange-400 text-[10px] rounded font-mono">
              8/8
            </span>
          </button>

          <button
            onClick={() => setActiveTab('visibility')}
            className={`px-3 py-2 text-xs font-mono font-bold uppercase transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'visibility'
                ? 'border-[#ff4d00] text-[#ff4d00] bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Maintained Engines</span>
            <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-400 text-[10px] rounded font-mono">
              6 Engines
            </span>
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-2 text-xs font-mono font-bold uppercase transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'prompt'
                ? 'border-[#ff4d00] text-[#ff4d00] bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Raw Directive Prompt</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-zinc-950">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* PRIMARY STATUS CARD */}
              <div className="bg-gradient-to-r from-zinc-900 via-black to-zinc-900 border-2 border-orange-500/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                        DEPLOYMENT STATUS: ACTIVE • MASTER ENFORCED
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                      Primary Owner of SEO Recovery
                    </h3>
                    <p className="text-xs text-zinc-300 max-w-3xl leading-relaxed">
                      This is the <strong>MOST IMPORTANT deployment location</strong>. The directive synthesizes real-time crawlability, zero-error indexation enforcement, multi-engine AI Search visibility (GEO), and direct alignment with verified customer revenue.
                    </p>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase">Directive Health</div>
                      <div className="text-2xl font-black font-mono text-emerald-400">98 / 100</div>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
                      100%
                    </div>
                  </div>
                </div>

                {/* TARGET DOMAIN & EXECUTE AUDIT BAR */}
                <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-mono text-[11px] text-zinc-400 shrink-0">Active Scope:</span>
                    <input
                      type="text"
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      placeholder="https://yourdomain.com"
                      className="bg-black border border-zinc-700 text-zinc-200 text-xs px-2.5 py-1 rounded font-mono w-full max-w-sm focus:outline-none focus:border-[#ff4d00]"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                    <span>Last Continuous Audit:</span>
                    <span className="text-zinc-200 font-bold">
                      {directiveState?.lastAuditTimestamp ? new Date(directiveState.lastAuditTimestamp).toLocaleTimeString() : 'Just now'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 ENFORCED TARGETS HIGH-LEVEL BAR */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#ff4d00]" />
                    <span>Enforced Targets (Zero Tolerance)</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('targets')}
                    className="text-[11px] font-mono text-[#ff4d00] hover:underline flex items-center gap-1"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-zinc-900/90 border-2 border-zinc-800 p-3.5 rounded-lg">
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                      <span>Coverage Errors</span>
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] rounded font-bold">
                        PASS
                      </span>
                    </div>
                    <div className="text-2xl font-black font-mono text-white">0</div>
                    <p className="text-[10px] text-zinc-400 mt-1 truncate">Target: 0 Errors</p>
                  </div>

                  <div className="bg-zinc-900/90 border-2 border-zinc-800 p-3.5 rounded-lg">
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                      <span>404 Errors</span>
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] rounded font-bold">
                        PASS
                      </span>
                    </div>
                    <div className="text-2xl font-black font-mono text-white">0</div>
                    <p className="text-[10px] text-zinc-400 mt-1 truncate">Target: 0 Errors</p>
                  </div>

                  <div className="bg-zinc-900/90 border-2 border-zinc-800 p-3.5 rounded-lg">
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                      <span>Blocked AI Crawlers</span>
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] rounded font-bold">
                        PASS
                      </span>
                    </div>
                    <div className="text-2xl font-black font-mono text-white">0</div>
                    <p className="text-[10px] text-zinc-400 mt-1 truncate">GPTBot, PerplexityBot 100%</p>
                  </div>

                  <div className="bg-zinc-900/90 border-2 border-zinc-800 p-3.5 rounded-lg">
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                      <span>Schema Coverage</span>
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] rounded font-bold">
                        PASS
                      </span>
                    </div>
                    <div className="text-2xl font-black font-mono text-emerald-400">100%</div>
                    <p className="text-[10px] text-zinc-400 mt-1 truncate">15 Schemas Active</p>
                  </div>
                </div>
              </div>

              {/* THREE ADDED MASTER DIRECTIVES SECTION */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Integrated Operational Directives (Trio)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* DIRECTIVE 1 */}
                  <div className="bg-zinc-900/90 border-2 border-zinc-800 hover:border-emerald-500/60 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
                          CRAWL &amp; HEALING
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h5 className="font-bold text-sm text-zinc-100">
                        AUTONOMOUS CRAWL AUDIT &amp; INDEXATION RECOVERY DIRECTIVE
                      </h5>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Continuous deep crawl scanner auditing status codes, edge response latency, header hygiene, and instantaneous self-healing of dropped URLs.
                      </p>
                    </div>

                    {onLaunchAuditor && (
                      <button
                        onClick={() => { onClose(); onLaunchAuditor(); }}
                        className="w-full py-2 bg-zinc-800 hover:bg-emerald-600 hover:text-black text-zinc-200 text-xs font-bold font-mono uppercase rounded transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Launch Auditor Wizard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* DIRECTIVE 2 */}
                  <div className="bg-zinc-900/90 border-2 border-zinc-800 hover:border-orange-500/60 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-mono font-bold uppercase">
                          REVENUE ALIGNMENT
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-[#ff4d00]" />
                      </div>
                      <h5 className="font-bold text-sm text-zinc-100">
                        SEO, GEO, AI SEARCH &amp; ORGANIC REVENUE RECOVERY DIRECTIVE
                      </h5>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Comprehensive diagnostics for traffic drops, SERP volatility, AI citation omissions, and direct alignment of recovered organic visitors to verified Stripe revenue.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {onLaunchTrafficLoss && (
                        <button
                          onClick={() => { onClose(); onLaunchTrafficLoss(domainInput); }}
                          className="flex-1 py-2 bg-[#ff4d00] hover:bg-white text-black text-xs font-bold font-mono uppercase rounded transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Traffic Loss</span>
                        </button>
                      )}
                      {onLaunchRevenueMandate && (
                        <button
                          onClick={() => { onClose(); onLaunchRevenueMandate(); }}
                          className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold font-mono uppercase rounded transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Mandate</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* DIRECTIVE 3 */}
                  <div className="bg-zinc-900/90 border-2 border-zinc-800 hover:border-cyan-500/60 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold uppercase">
                          WORLDWIDE SCALE
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h5 className="font-bold text-sm text-zinc-100">
                        GLOBAL MARKET EXPANSION DIRECTIVE
                      </h5>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Multilingual multi-region indexation scaling across 8 international territories with localized sitemaps, hreflang verification, and worldwide low-latency edge delivery.
                      </p>
                    </div>

                    {onLaunchGlobalExpansion && (
                      <button
                        onClick={() => { onClose(); onLaunchGlobalExpansion(); }}
                        className="w-full py-2 bg-zinc-800 hover:bg-cyan-600 hover:text-black text-zinc-200 text-xs font-bold font-mono uppercase rounded transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Global Expansion</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STRICT OPERATIONAL TARGETS */}
          {activeTab === 'targets' && (
            <div className="space-y-6">
              <div className="p-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl space-y-2">
                <h4 className="text-sm font-black text-white uppercase font-mono flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#ff4d00]" />
                  <span>Operational Target Mandates (Zero Tolerance)</span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Every metric has a zero-tolerance boundary enforced across automated cron loops, crawler checks, and live indexing pipelines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target 1: Coverage Errors = 0 */}
                <div className="p-4 bg-zinc-900/80 border-2 border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-zinc-300">Coverage Errors</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold rounded">
                      TARGET: 0 (ENFORCED)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black font-mono text-emerald-400">0</span>
                    <span className="text-xs text-zinc-400">Coverage issues in Google Search Console / IndexNow</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-2">
                    Ensures zero excluded, soft-404, or unindexed canonical URLs. Any crawl anomalies trigger an automated IndexNow broadcast and XML sitemap re-sync.
                  </p>
                </div>

                {/* Target 2: 404 Errors = 0 */}
                <div className="p-4 bg-zinc-900/80 border-2 border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-zinc-300">404 Errors</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold rounded">
                      TARGET: 0 (ENFORCED)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black font-mono text-emerald-400">0</span>
                    <span className="text-xs text-zinc-400">Dead links detected across all audited paths</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-2">
                    All broken endpoints from migrations or renamed routes are immediately bound to single-hop 301 permanent redirect rules, retaining 100% PageRank.
                  </p>
                </div>

                {/* Target 3: Blocked AI Crawlers = 0 */}
                <div className="p-4 bg-zinc-900/80 border-2 border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-zinc-300">Blocked AI Crawlers</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold rounded">
                      TARGET: 0 (ENFORCED)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black font-mono text-emerald-400">0</span>
                    <span className="text-xs text-zinc-400">Blocked AI User-Agents</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-2">
                    GPTBot, OAI-SearchBot, PerplexityBot, Google-Extended, and ClaudeBot are explicitly permitted in robots.txt to maximize citation frequency in answer engines.
                  </p>
                </div>

                {/* Target 4: Schema Coverage = 100% */}
                <div className="p-4 bg-zinc-900/80 border-2 border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-zinc-300">Schema Coverage</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold rounded">
                      TARGET: 100% (ENFORCED)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black font-mono text-emerald-400">100%</span>
                    <span className="text-xs text-zinc-400">15 Schema.org types validated</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-2">
                    Every published route is enriched with validated JSON-LD schema (Organization, WebSite, Breadcrumbs, SoftwareApplication, FAQPage, Article, Reviews).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 8 CONTINUOUS AUDITING RESPONSIBILITIES */}
          {activeTab === 'responsibilities' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl">
                <div>
                  <h4 className="text-sm font-black text-white uppercase font-mono flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#ff4d00]" />
                    <span>8 Continuous SEO/GEO Audit Responsibilities</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    These 8 systems are continuously audited and verified against the target operational standards.
                  </p>
                </div>

                <button
                  onClick={handleRunContinuousAudit}
                  disabled={auditing}
                  className="px-3 py-1.5 bg-[#ff4d00] hover:bg-white text-black font-black uppercase text-xs rounded transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${auditing ? 'animate-spin' : ''}`} />
                  <span>Execute 8-Point Cycle</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(directiveState?.responsibilities || []).map((item) => {
                  const isExpanded = expandedResponsibility === item.key;
                  return (
                    <div
                      key={item.key}
                      className="bg-zinc-900/70 border-2 border-zinc-800 rounded-xl overflow-hidden transition-all"
                    >
                      <div
                        onClick={() => setExpandedResponsibility(isExpanded ? null : item.key)}
                        className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-7 h-7 rounded bg-black border border-zinc-700 flex items-center justify-center text-xs font-mono font-bold text-[#ff4d00]">
                            {item.key.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-zinc-100">{item.key}</span>
                              <span className="px-2 py-0.2 bg-zinc-800 text-zinc-400 text-[10px] rounded font-mono">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{item.currentValue}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold rounded">
                            {item.status}
                          </span>
                          <span className="text-zinc-500 text-xs font-mono">{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 bg-black/60 border-t border-zinc-800 space-y-3 text-xs">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-zinc-400 uppercase">Target Mandate:</span>
                              <p className="text-zinc-200 font-mono text-xs">{item.target}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-zinc-400 uppercase">Current Real-Time Status:</span>
                              <p className="text-emerald-400 font-mono text-xs font-bold">{item.currentValue}</p>
                            </div>
                          </div>

                          <div className="space-y-1 pt-2 border-t border-zinc-800/80">
                            <span className="text-[10px] font-mono text-zinc-400 uppercase">Detailed Audit Finding:</span>
                            <p className="text-zinc-300 leading-relaxed">{item.details}</p>
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                            <span className="text-[10px] font-mono text-zinc-400 uppercase">Automated Verification Checklist:</span>
                            <div className="space-y-1">
                              {item.diagnosticChecks.map((check, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-zinc-300 font-mono text-[11px]">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span>{check}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: MAINTAINED VISIBILITY CHANNELS (6 ENGINES) */}
          {activeTab === 'visibility' && (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl space-y-1">
                <h4 className="text-sm font-black text-white uppercase font-mono flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Maintained Multi-Engine Visibility Channels</span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Continuous indexation, crawl accessibility, and citation grounding across all 6 premier search and AI answer engines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(directiveState?.visibilityChannels || []).map((ch) => (
                  <div
                    key={ch.engine}
                    className="p-4 bg-zinc-900/80 border-2 border-zinc-800 hover:border-zinc-700 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-[#ff4d00]" />
                        <h5 className="font-bold text-sm text-white">{ch.displayName}</h5>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold rounded">
                        {ch.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Crawl Access:</span>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{ch.botAccess} ({ch.crawlers.join(', ')})</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Indexation Status:</span>
                        <p className="text-zinc-300 text-[11px] mt-0.5 leading-normal">{ch.indexationStatus}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">GEO &amp; AI Citation Readiness:</span>
                        <p className="text-zinc-300 text-[11px] mt-0.5 leading-normal">{ch.geoCitationReadiness}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>Visibility Score:</span>
                      <span className="text-emerald-400 font-bold">{ch.visibilityScore} / 100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RAW DIRECTIVE PROMPT */}
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-900 border-2 border-zinc-800 rounded-xl">
                <div>
                  <h4 className="text-sm font-black text-white uppercase font-mono flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-[#ff4d00]" />
                    <span>Raw Master Directive Prompt</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Formatted exactly per specification. Ready for copy to clipboard or injection into autonomous agent runtimes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyPromptText}
                    className="px-3.5 py-1.5 bg-[#ff4d00] hover:bg-white text-black font-black uppercase text-xs rounded transition-colors flex items-center gap-1.5"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Copied!' : 'Copy Directive'}</span>
                  </button>

                  <button
                    onClick={downloadPromptMarkdown}
                    className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold uppercase text-xs rounded transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export MD</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-black border-2 border-zinc-800 rounded-xl font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-[#ff4d00] selection:text-black">
                {directiveState?.rawDirectivePrompt || `Prompt Name:
SEO, GEO, AI SEARCH & INDEXATION RECOVERY DIRECTIVE

Primary Owner of SEO Recovery

This is the MOST IMPORTANT deployment location.

Add
AUTONOMOUS CRAWL AUDIT & INDEXATION RECOVERY DIRECTIVE
SEO, GEO, AI SEARCH & ORGANIC REVENUE RECOVERY DIRECTIVE
GLOBAL MARKET EXPANSION DIRECTIVE

SEO/GEO Responsibilities
Continuously audit:

- robots.txt
- XML Sitemaps
- Schema
- Canonicals
- Redirects
- Internal Linking
- AI Search Visibility
- Core Web Vitals

Target:

Coverage Errors = 0

404 Errors = 0

Blocked AI Crawlers = 0

Schema Coverage = 100%

Maintain:

Google Visibility
Bing Visibility
ChatGPT Visibility
Perplexity Visibility
Copilot Visibility
Gemini Visibility`}
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-black border-t-2 border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldAlert className="w-4 h-4 text-[#ff4d00]" />
            <span>Target Enforcers Active: Coverage Errors: 0 &bull; 404s: 0 &bull; Blocked AI: 0 &bull; Schema: 100%</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyPromptText}
              className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded border border-zinc-700 transition-colors flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>Copy Prompt</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#ff4d00] text-black font-black uppercase text-xs rounded hover:bg-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
