import React, { useState, useEffect, useMemo } from 'react';
import {
  Link2,
  Globe,
  Database,
  Cpu,
  Zap,
  Sparkles,
  Search,
  Filter,
  Download,
  Copy,
  CheckCircle2,
  AlertCircle,
  Key,
  Sliders,
  RotateCw,
  Layers,
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Network,
  FileText,
  Trash2,
  Play,
  Share2,
  Check,
  ListFilter,
  Radio,
  Send,
  ArrowRight,
  Clock,
  Flame,
  CheckCheck,
  XCircle,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  BacklinkTargetMetric,
  BulkBacklinkSummary,
  RawBacklinkItem,
  DomainBacklinksManifest,
  BulkBacklinkListerReport,
  InstantIndexingResponse
} from '../types';

interface BulkBacklinkCounterProps {
  embedded?: boolean;
  onSelectDomainForAudit?: (domain: string) => void;
}

type ViewTab = 'MACRO_COUNTER' | 'DETAILED_LISTER' | 'INSTANT_INDEXER';

export const BulkBacklinkCounter: React.FC<BulkBacklinkCounterProps> = ({
  embedded = false,
  onSelectDomainForAudit,
}) => {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<ViewTab>('MACRO_COUNTER');

  // Input & configuration states
  const [targetInput, setTargetInput] = useState<string>(
    'github.com\nstackoverflow.com\nopenai.com\npython.org\ntiangolo.com'
  );
  const [concurrency, setConcurrency] = useState<number>(10);
  const [linksPerTarget, setLinksPerTarget] = useState<number>(25);
  const [apiLogin, setApiLogin] = useState<string>(() => localStorage.getItem('dataforseo_login') || '');
  const [apiPassword, setApiPassword] = useState<string>(() => localStorage.getItem('dataforseo_password') || '');
  const [indexnowKey, setIndexnowKey] = useState<string>(() => localStorage.getItem('indexnow_key') || '7bca98324e9045bca128d9c0e27163ba');
  const [googleToken, setGoogleToken] = useState<string>(() => localStorage.getItem('google_indexing_token') || '');
  
  const [showCredentials, setShowCredentials] = useState<boolean>(false);
  const [useSandbox, setUseSandbox] = useState<boolean>(() => !localStorage.getItem('dataforseo_login'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Macro stats results
  const [macroData, setMacroData] = useState<BulkBacklinkSummary | null>(null);
  
  // Detailed / Itemized raw backlink results
  const [detailedReport, setDetailedReport] = useState<BulkBacklinkListerReport | null>(null);
  const [selectedDomainKey, setSelectedDomainKey] = useState<string>('ALL');

  // Instant Indexing telemetry results
  const [indexingResult, setIndexingResult] = useState<InstantIndexingResponse | null>(null);
  const [isIndexing, setIsIndexing] = useState<boolean>(false);

  const [elapsedTimeMs, setElapsedTimeMs] = useState<number>(0);

  // Table filtering & sorting for Macro View
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'ERROR'>('ALL');
  const [sortField, setSortField] = useState<keyof BacklinkTargetMetric>('total_backlinks');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Table filtering & sorting for Detailed Items View
  const [itemSearchQuery, setItemSearchQuery] = useState<string>('');
  const [dofollowFilter, setDofollowFilter] = useState<'ALL' | 'DOFOLLOW' | 'NOFOLLOW'>('ALL');
  const [lossFilter, setLossFilter] = useState<'ALL' | 'ACTIVE' | 'LOST'>('ALL');
  const [minRankFilter, setMinRankFilter] = useState<number>(0);

  // Save credentials to localStorage
  useEffect(() => {
    if (apiLogin) localStorage.setItem('dataforseo_login', apiLogin);
    if (apiPassword) localStorage.setItem('dataforseo_password', apiPassword);
    if (indexnowKey) localStorage.setItem('indexnow_key', indexnowKey);
    if (googleToken) localStorage.setItem('google_indexing_token', googleToken);
  }, [apiLogin, apiPassword, indexnowKey, googleToken]);

  // Presets
  const handleLoadSample = (type: 'default' | 'saas' | 'dev') => {
    if (type === 'default') {
      setTargetInput('github.com\nstackoverflow.com\nopenai.com\npython.org\ntiangolo.com');
    } else if (type === 'saas') {
      setTargetInput('stripe.com\nnotion.so\nairtable.com\nlinear.app\nfigma.com\ncanva.com');
    } else {
      setTargetInput('fastapi.tiangolo.com\nreact.dev\nvitejs.dev\ntailwindcss.com\nnodejs.org\nrust-lang.org');
    }
    toast.success('Loaded preset benchmark targets');
  };

  // Run Macro Analysis
  const handleRunMacroAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const lines = targetInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));

    if (lines.length === 0) {
      toast.error('Please enter at least one target domain or URL.');
      return;
    }

    setIsLoading(true);
    setElapsedTimeMs(0);
    const startTime = Date.now();
    const timer = setInterval(() => setElapsedTimeMs(Date.now() - startTime), 100);

    toast.loading(`Querying macro metrics for ${lines.length} domains...`, { id: 'backlink-action' });

    try {
      const response = await axios.post('/api/backlinks/bulk-count', {
        targets: lines,
        apiLogin: apiLogin.trim() || undefined,
        apiPassword: apiPassword.trim() || undefined,
        maxConcurrency: concurrency,
        useSandbox: useSandbox || !apiLogin || !apiPassword,
      });

      clearInterval(timer);
      setElapsedTimeMs(Date.now() - startTime);
      setMacroData(response.data);
      toast.success(`Macro counters loaded (${response.data.successful_targets} successful)!`, { id: 'backlink-action' });
    } catch (err: any) {
      clearInterval(timer);
      toast.error(err.response?.data?.error || 'Macro backlink count failed', { id: 'backlink-action' });
    } finally {
      setIsLoading(false);
    }
  };

  // Run Itemized Raw Backlinks Retrieval (DataForSEO v3/backlinks/backlinks/live)
  const handleRunDetailedListing = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const lines = targetInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));

    if (lines.length === 0) {
      toast.error('Please enter at least one target domain or URL.');
      return;
    }

    setIsLoading(true);
    setElapsedTimeMs(0);
    const startTime = Date.now();
    const timer = setInterval(() => setElapsedTimeMs(Date.now() - startTime), 100);

    toast.loading(`Extracting individual backlink sheets (${linksPerTarget} links/target) via DataForSEO Live...`, {
      id: 'backlink-action',
    });

    try {
      const response = await axios.post('/api/backlinks/detailed-list', {
        targets: lines,
        linksPerTarget: linksPerTarget,
        apiLogin: apiLogin.trim() || undefined,
        apiPassword: apiPassword.trim() || undefined,
        maxConcurrency: Math.min(concurrency, 10),
        useSandbox: useSandbox || !apiLogin || !apiPassword,
      });

      clearInterval(timer);
      setElapsedTimeMs(Date.now() - startTime);
      setDetailedReport(response.data);
      setSelectedDomainKey('ALL');
      setActiveTab('DETAILED_LISTER');
      toast.success(
        `Retrieved ${response.data.total_backlinks_extracted} raw individual backlinks across ${response.data.total_domains} properties!`,
        { id: 'backlink-action' }
      );
    } catch (err: any) {
      clearInterval(timer);
      toast.error(err.response?.data?.error || 'Detailed backlink listing failed', { id: 'backlink-action' });
    } finally {
      setIsLoading(false);
    }
  };

  // Run Real-Time Instant Indexing Dispatch (Google Indexing API + IndexNow)
  const handleRunInstantIndexing = async (customUrls?: string[]) => {
    const urlsToDispatch = customUrls || targetInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((l) => (l.startsWith('http') ? l : `https://${l}`));

    if (urlsToDispatch.length === 0) {
      toast.error('Please specify URLs to dispatch for real-time indexing.');
      return;
    }

    setIsIndexing(true);
    const domainHeader = urlsToDispatch[0]
      .replace(/^https?:\/\//i, '')
      .split('/')[0];

    toast.loading(`Dispatching ${urlsToDispatch.length} URLs to Google Indexing API & IndexNow cluster...`, {
      id: 'indexing-dispatch',
    });

    try {
      const response = await axios.post('/api/indexing/instant-dispatch', {
        domain: domainHeader,
        urls: urlsToDispatch,
        indexnowKey: indexnowKey.trim() || undefined,
        googleToken: googleToken.trim() || undefined,
      });

      setIndexingResult(response.data);
      setActiveTab('INSTANT_INDEXER');
      toast.success(
        `Dispatched ${urlsToDispatch.length} URLs! IndexNow: ${response.data.indexnow_response?.status}, Google: ${response.data.google_summary?.success}/${response.data.google_summary?.total} successful.`,
        { id: 'indexing-dispatch' }
      );
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Instant indexing dispatch failed', { id: 'indexing-dispatch' });
    } finally {
      setIsIndexing(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (!macroData && !isLoading) {
      handleRunMacroAnalysis();
    }
  }, []);

  // Filtered rows for Macro
  const processedMacroRows = useMemo(() => {
    if (!macroData?.results) return [];
    let list = [...macroData.results];

    if (statusFilter !== 'ALL') {
      list = list.filter((item) => item.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.target.toLowerCase().includes(q) ||
          item.domain?.toLowerCase().includes(q) ||
          item.error?.toLowerCase().includes(q)
      );
    }

    list.sort((a: any, b: any) => {
      const valA = a[sortField] ?? 0;
      const valB = b[sortField] ?? 0;
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });

    return list;
  }, [macroData, statusFilter, searchQuery, sortField, sortAsc]);

  // Filtered rows for Detailed Items
  const processedItemRows = useMemo(() => {
    if (!detailedReport?.reports) return [];
    
    let combined: (RawBacklinkItem & { targetDomain: string })[] = [];

    if (selectedDomainKey === 'ALL') {
      Object.entries(detailedReport.reports).forEach(([dom, manifest]) => {
        const m = manifest as DomainBacklinksManifest;
        if (m && m.backlinks) {
          m.backlinks.forEach((bl) => combined.push({ ...bl, targetDomain: dom }));
        }
      });
    } else if (detailedReport.reports[selectedDomainKey]?.backlinks) {
      detailedReport.reports[selectedDomainKey].backlinks.forEach((bl) =>
        combined.push({ ...bl, targetDomain: selectedDomainKey })
      );
    }

    if (dofollowFilter === 'DOFOLLOW') combined = combined.filter((b) => b.is_dofollow);
    if (dofollowFilter === 'NOFOLLOW') combined = combined.filter((b) => !b.is_dofollow);
    if (lossFilter === 'ACTIVE') combined = combined.filter((b) => b.loss_status === 'ACTIVE');
    if (lossFilter === 'LOST') combined = combined.filter((b) => b.loss_status === 'LOST');
    if (minRankFilter > 0) combined = combined.filter((b) => b.domain_rank >= minRankFilter);

    if (itemSearchQuery.trim()) {
      const q = itemSearchQuery.toLowerCase();
      combined = combined.filter(
        (b) =>
          b.anchor_text.toLowerCase().includes(q) ||
          b.source_url.toLowerCase().includes(q) ||
          b.target_url.toLowerCase().includes(q)
      );
    }

    return combined;
  }, [detailedReport, selectedDomainKey, dofollowFilter, lossFilter, minRankFilter, itemSearchQuery]);

  // Export Itemized CSV
  const handleExportItemizedCSV = () => {
    if (!processedItemRows.length) {
      toast.error('No raw backlink rows to export.');
      return;
    }

    const headers = [
      'Domain Target',
      'Anchor Text',
      'Source URL',
      'Target URL',
      'Domain Rank',
      'Follow Type',
      'Loss Status',
      'First Seen',
      'Last Seen'
    ];

    const rows = processedItemRows.map((r) => [
      `"${r.targetDomain}"`,
      `"${r.anchor_text.replace(/"/g, '""')}"`,
      `"${r.source_url}"`,
      `"${r.target_url}"`,
      r.domain_rank,
      r.is_dofollow ? 'DOFOLLOW' : 'NOFOLLOW',
      r.loss_status,
      `"${r.first_seen}"`,
      `"${r.last_seen}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `raw_backlinks_itemized_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${processedItemRows.length} itemized backlinks to CSV!`);
  };

  const fmt = (num?: number) => (num !== undefined ? num.toLocaleString() : '0');

  return (
    <div className={`space-y-6 text-slate-100 ${embedded ? '' : 'p-6 max-w-7xl mx-auto'}`}>
      {/* 1. TOP HEADER & TELEMETRY CONTROLS */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Link2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Bulk Backlink Auditor & Instant Indexer
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  DataForSEO v3 Live + Google Indexing & IndexNow
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Macro referring domains & IP telemetry • Granular per-row raw backlink indices • Real-time search bot dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                apiLogin && apiPassword && !useSandbox
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{apiLogin && apiPassword && !useSandbox ? 'DataForSEO Live API' : 'Sandbox Benchmark Mode'}</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>{concurrency} Workers</span>
            </div>
          </div>
        </div>

        {/* Credentials & Settings Drawer */}
        {showCredentials && (
          <div className="mt-4 p-4 bg-slate-950/90 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                API Credentials & Protocol Keys
              </h4>
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSandbox}
                  onChange={(e) => setUseSandbox(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Force Sandbox Simulation</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">DataForSEO Login</label>
                <input
                  type="text"
                  placeholder="login@dataforseo.com"
                  value={apiLogin}
                  onChange={(e) => setApiLogin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">DataForSEO Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={apiPassword}
                  onChange={(e) => setApiPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">IndexNow API Key</label>
                <input
                  type="text"
                  placeholder="e.g. 7bca98324e9045bca128d9c0e27163ba"
                  value={indexnowKey}
                  onChange={(e) => setIndexnowKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Google OAuth / Service Bearer Token</label>
                <input
                  type="password"
                  placeholder="ya29.a0AfB_byE..."
                  value={googleToken}
                  onChange={(e) => setGoogleToken(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-[11px] text-slate-400">Worker Concurrency: {concurrency}</span>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={concurrency}
                  onChange={(e) => setConcurrency(Number(e.target.value))}
                  className="w-32 accent-indigo-500"
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-[11px] text-slate-400">Links Per Domain (Lister): {linksPerTarget}</span>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={linksPerTarget}
                  onChange={(e) => setLinksPerTarget(Number(e.target.value))}
                  className="w-32 accent-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. SUMMARY KPI METRIC CARDS (Always Available) */}
        {macroData && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Backlinks</span>
                <Link2 className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {fmt(macroData.summary.total_backlinks_sum)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{macroData.successful_targets} target profiles</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Referring Domains</span>
                <Globe className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {fmt(macroData.summary.total_referring_domains_sum)}
              </div>
              <div className="text-[11px] text-cyan-400/80 mt-1">Unique root source domains</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Referring IPs</span>
                <Network className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {fmt(macroData.summary.total_referring_ips_sum)}
              </div>
              <div className="text-[11px] text-emerald-400/80 mt-1">Distinct C-class subnets</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Dofollow Ratio</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {macroData.summary.avg_dofollow_ratio}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Link equity transmission</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Avg Domain Authority</span>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {macroData.summary.avg_authority_score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
              <div className="text-[11px] text-purple-400/80 mt-1">Composite trust rating</div>
            </div>
          </div>
        )}
      </div>

      {/* 3. INPUT BATCH POOL FORM */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              Target Website & Domain Batch Pool
            </h3>
            <p className="text-xs text-slate-400">
              Enter one domain or URL per line to audit backlinks or dispatch real-time indexing.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500">Presets:</span>
            <button
              onClick={() => handleLoadSample('default')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-all cursor-pointer"
            >
              Tech Giants
            </button>
            <button
              onClick={() => handleLoadSample('saas')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-all cursor-pointer"
            >
              Top SaaS
            </button>
            <button
              onClick={() => handleLoadSample('dev')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-all cursor-pointer"
            >
              Dev Frameworks
            </button>
          </div>
        </div>

        <div>
          <textarea
            rows={4}
            required
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            placeholder="github.com&#10;stackoverflow.com&#10;openai.com&#10;python.org&#10;tiangolo.com"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed shadow-inner"
          />
        </div>

        {/* Action Button Grid */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>
              <strong>{targetInput.split('\n').filter((l) => l.trim()).length}</strong> properties in queue
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              type="button"
              onClick={() => setTargetInput('')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>

            {/* 1. Macro Analysis */}
            <button
              type="button"
              disabled={isLoading || isIndexing}
              onClick={handleRunMacroAnalysis}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. Macro Counters</span>
            </button>

            {/* 2. Detailed Lister */}
            <button
              type="button"
              disabled={isLoading || isIndexing}
              onClick={handleRunDetailedListing}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ListFilter className="w-3.5 h-3.5" />
              )}
              <span>2. Fetch Raw Backlinks Sheet</span>
            </button>

            {/* 3. Instant Indexing */}
            <button
              type="button"
              disabled={isLoading || isIndexing}
              onClick={() => handleRunInstantIndexing()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isIndexing ? (
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>3. Dispatch Instant Indexing</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. VIEW TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('MACRO_COUNTER')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'MACRO_COUNTER'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Macro Domains Matrix ({macroData?.results?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('DETAILED_LISTER')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'DETAILED_LISTER'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Raw Itemized Links Index ({detailedReport ? detailedReport.total_backlinks_extracted : 0})</span>
          {detailedReport && (
            <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-white text-[10px] font-mono">
              Live
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('INSTANT_INDEXER')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'INSTANT_INDEXER'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Instant Indexing Telemetry</span>
          {indexingResult && (
            <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-white text-[10px] font-mono">
              {indexingResult.total_urls} URLs
            </span>
          )}
        </button>
      </div>

      {/* 5A. TAB CONTENT: MACRO VIEW TABLE */}
      {activeTab === 'MACRO_COUNTER' && macroData && (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                Domain Execution Report Manifest ({processedMacroRows.length} Targets)
              </h3>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter domain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">Success Only</option>
                <option value="ERROR">Errors Only</option>
              </select>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(macroData, null, 2));
                  toast.success('Copied macro report JSON');
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-all cursor-pointer"
                title="Copy JSON"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold select-none">
                  <th onClick={() => { setSortField('target'); setSortAsc(!sortAsc); }} className="p-3.5 cursor-pointer hover:text-white">
                    <div className="flex items-center gap-1.5">
                      <span>Target Domain</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th onClick={() => { setSortField('total_backlinks'); setSortAsc(!sortAsc); }} className="p-3.5 cursor-pointer hover:text-white text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Total Backlinks</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th onClick={() => { setSortField('referring_domains'); setSortAsc(!sortAsc); }} className="p-3.5 cursor-pointer hover:text-white text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Ref Domains</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th onClick={() => { setSortField('referring_ips'); setSortAsc(!sortAsc); }} className="p-3.5 cursor-pointer hover:text-white text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Ref IPs</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th className="p-3.5">Dofollow Ratio</th>
                  <th className="p-3.5 text-center">Authority</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {processedMacroRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="font-mono text-xs">{row.domain || row.target}</span>
                        {row.is_sandbox && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            sandbox
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-semibold text-white font-mono">{fmt(row.total_backlinks)}</td>
                    <td className="p-3.5 text-right text-cyan-400 font-mono font-semibold">{fmt(row.referring_domains)}</td>
                    <td className="p-3.5 text-right text-emerald-400 font-mono font-medium">{fmt(row.referring_ips)}</td>
                    <td className="p-3.5">
                      <div className="w-28">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>{row.dofollow_ratio}% DF</span>
                          <span>{fmt(row.dofollow_backlinks)}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, row.dofollow_ratio)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        {row.authority_score}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {row.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <AlertCircle className="w-3 h-3" /> Error
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setTargetInput(row.domain || row.target);
                            handleRunDetailedListing();
                          }}
                          className="px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-medium transition-all cursor-pointer"
                          title="Extract raw backlinks for this domain"
                        >
                          Raw Links
                        </button>
                        <button
                          onClick={() => handleRunInstantIndexing([`https://${row.domain || row.target}`])}
                          className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-medium transition-all cursor-pointer"
                          title="Instant Indexation Push"
                        >
                          Index
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5B. TAB CONTENT: RAW ITEMIZED BACKLINKS SHEET */}
      {activeTab === 'DETAILED_LISTER' && (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-0">
          {/* Header & Controls Toolbar */}
          <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Raw Backlink Records ({processedItemRows.length} Individual Rows)
              </h3>
              <p className="text-[11px] text-slate-400">
                Detailed indices captured from DataForSEO v3 live endpoint with anchor texts, target endpoints & link power.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
              {detailedReport?.reports && (
                <select
                  value={selectedDomainKey}
                  onChange={(e) => setSelectedDomainKey(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="ALL">All Target Domains</option>
                  {Object.keys(detailedReport.reports).map((dom) => (
                    <option key={dom} value={dom}>
                      {dom} ({detailedReport.reports[dom].backlinks?.length || 0})
                    </option>
                  ))}
                </select>
              )}

              <select
                value={dofollowFilter}
                onChange={(e) => setDofollowFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Follow Types</option>
                <option value="DOFOLLOW">Dofollow Only</option>
                <option value="NOFOLLOW">Nofollow Only</option>
              </select>

              <select
                value={lossFilter}
                onChange={(e) => setLossFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active Links</option>
                <option value="LOST">Lost Links</option>
              </select>

              <div className="relative flex-1 md:w-44">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search anchor/url..."
                  value={itemSearchQuery}
                  onChange={(e) => setItemSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={handleExportItemizedCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Table */}
          {!detailedReport ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <ListFilter className="w-8 h-8 text-indigo-400 mx-auto opacity-60" />
              <p className="text-sm font-medium text-slate-300">No raw backlink report generated yet.</p>
              <button
                onClick={handleRunDetailedListing}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                Fetch Raw Backlinks Sheet Now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold select-none">
                    <th className="p-3.5">Anchor Text</th>
                    <th className="p-3.5">Source URL (url_from)</th>
                    <th className="p-3.5">Target Destination (url_to)</th>
                    <th className="p-3.5 text-center">Power Rank</th>
                    <th className="p-3.5 text-center">Link Type</th>
                    <th className="p-3.5 text-center">State</th>
                    <th className="p-3.5 text-right">Quick Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {processedItemRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No individual backlink rows match current filter.
                      </td>
                    </tr>
                  ) : (
                    processedItemRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        {/* Anchor Text */}
                        <td className="p-3.5 font-medium text-white max-w-xs truncate">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20 text-xs">
                              {row.anchor_text || '(No Anchor / Image)'}
                            </span>
                          </div>
                        </td>

                        {/* Source URL */}
                        <td className="p-3.5 text-slate-300 font-mono text-[11px] max-w-sm truncate">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={row.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:underline truncate"
                            >
                              {row.source_url}
                            </a>
                            <a
                              href={row.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-white shrink-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </td>

                        {/* Target URL */}
                        <td className="p-3.5 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate">{row.target_url}</span>
                            <a
                              href={row.target_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-white shrink-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </td>

                        {/* Power Rank */}
                        <td className="p-3.5 text-center font-mono">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              row.domain_rank >= 80
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {row.domain_rank}
                          </span>
                        </td>

                        {/* Link Type */}
                        <td className="p-3.5 text-center">
                          {row.is_dofollow ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              DOFOLLOW
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                              NOFOLLOW
                            </span>
                          )}
                        </td>

                        {/* State */}
                        <td className="p-3.5 text-center">
                          {row.loss_status === 'ACTIVE' ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" /> ACTIVE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400">
                              <XCircle className="w-3 h-3" /> LOST
                            </span>
                          )}
                        </td>

                        {/* Quick Action */}
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleRunInstantIndexing([row.target_url, row.source_url])}
                            className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                            title="Push both source & destination to IndexNow + Googlebot"
                          >
                            <Send className="w-3 h-3" /> Push Index
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 5C. TAB CONTENT: INSTANT DUAL-PROTOCOL INDEXING TELEMETRY */}
      {activeTab === 'INSTANT_INDEXER' && (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                Real-Time Dual-Protocol Indexing Dispatcher
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant search engine crawl triggers via Google Indexing API v3 & IndexNow (Bing, Yandex, Seznam, Naver).
              </p>
            </div>

            <button
              onClick={() => handleRunInstantIndexing()}
              disabled={isIndexing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              {isIndexing ? <RotateCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>Re-Dispatch Current Pool</span>
            </button>
          </div>

          {!indexingResult ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Radio className="w-8 h-8 text-emerald-400 mx-auto opacity-60 animate-pulse" />
              <p className="text-sm font-medium text-slate-300">Ready to dispatch instant crawl signals.</p>
              <button
                onClick={() => handleRunInstantIndexing()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                Trigger Instant Real-Time Indexation
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Protocol Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* IndexNow Protocol Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-cyan-400" /> IndexNow Protocol (Bing / Yandex / Seznam)
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        indexingResult.indexnow_response.status === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {indexingResult.indexnow_response.status} ({indexingResult.indexnow_response.code || 200})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{indexingResult.indexnow_response.msg}</p>
                  <div className="text-[11px] text-cyan-400/90 font-mono">
                    Dispatched {indexingResult.indexnow_response.target_count || indexingResult.total_urls} URLs in batch
                  </div>
                </div>

                {/* Google Indexing API Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-indigo-400" /> Google Indexing API v3
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {indexingResult.google_summary.success} / {indexingResult.google_summary.total} PUBLISHED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Real-time atomic URL_UPDATED notification packets delivered directly to Google crawling workers.
                  </p>
                  <div className="text-[11px] text-indigo-400/90 font-mono">
                    {indexingResult.google_summary.failed === 0 ? 'All requests verified 200 OK' : `${indexingResult.google_summary.failed} queued for retry`}
                  </div>
                </div>
              </div>

              {/* Per-URL Google Dispatch Log Sheet */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Per-URL Indexing Signal Telemetry Stream</span>
                  <span>{indexingResult.google_responses.length} URL Packets</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 font-mono text-xs">
                  {indexingResult.google_responses.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-900/40">
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200 truncate">{item.url}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-semibold">
                          URL_UPDATED
                        </span>
                        <span className="text-[10px] text-slate-500 font-sans">
                          {item.notify_time ? new Date(item.notify_time).toLocaleTimeString() : 'Dispatched'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
