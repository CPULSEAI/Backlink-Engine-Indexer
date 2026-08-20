import React, { useState, useEffect, useMemo } from 'react';
import {
  Link2,
  Globe,
  TrendingUp,
  ShieldCheck,
  Zap,
  RefreshCw,
  Layers,
  BarChart3,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BulkBacklinkSummary, BacklinkTargetMetric } from '../types';

interface TotalBacklinkCounterProps {
  /** Optional target domains to aggregate and calculate cumulative backlink count */
  initialDomains?: string[];
  /** Single domain string override (e.g. from Domain Profiler) */
  domain?: string;
  /** Visual variant: 'default' | 'compact' | 'minimal' */
  variant?: 'default' | 'compact' | 'minimal';
  /** Title override */
  title?: string;
  /** Subtitle override */
  subtitle?: string;
  /** Callback when user clicks on a domain to inspect in Domain Profiler */
  onInspectDomain?: (domain: string) => void;
  /** Allow manual domain input / addition */
  allowManualInput?: boolean;
}

export const TotalBacklinkCounter: React.FC<TotalBacklinkCounterProps> = ({
  initialDomains = [],
  domain,
  variant = 'default',
  title = 'Total Backlink Counter',
  subtitle = 'Cumulative live backlink count & referring domain intelligence powered by DataForSEO API',
  onInspectDomain,
  allowManualInput = true,
}) => {
  // Helper to extract clean domain list
  const extractCleanDomains = (rawDomain?: string, rawList?: string[]) => {
    const raw = rawDomain ? [rawDomain] : (rawList || []);
    const cleanList = Array.from(
      new Set(
        raw
          .map((d) => (d || '').trim().replace(/^(https?:\/\/)+/i, '').split('/')[0].toLowerCase())
          .filter((d) => d && d.includes('.') && !d.includes('localhost'))
      )
    );
    return cleanList.length > 0 ? cleanList : ['careerpulseai.net'];
  };

  // State
  const [targetDomains, setTargetDomains] = useState<string[]>(() => extractCleanDomains(domain, initialDomains));
  const [inputDomain, setInputDomain] = useState('');
  const [data, setData] = useState<BulkBacklinkSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [useSandbox, setUseSandbox] = useState(false);

  // Primitive key for incoming props to avoid object identity churn
  const incomingPropsKey = useMemo(() => {
    const list = extractCleanDomains(domain, initialDomains);
    return list.slice().sort().join(',');
  }, [domain, initialDomains ? initialDomains.join(',') : '']);

  // Sync targets when incoming domain prop actually changes
  useEffect(() => {
    const clean = extractCleanDomains(domain, initialDomains);
    const cleanKey = clean.slice().sort().join(',');
    const currentKey = targetDomains.slice().sort().join(',');
    if (cleanKey !== currentKey && clean.length > 0) {
      setTargetDomains(clean);
    }
  }, [incomingPropsKey]);

  // Target domains primitive key for network fetches
  const activeTargetsKey = useMemo(() => {
    return targetDomains.slice().sort().join(',');
  }, [targetDomains]);

  // Fetch cumulative backlink data from /api/backlinks/bulk-count
  const fetchBacklinks = async (domainsToFetch: string[] = targetDomains) => {
    if (!domainsToFetch || domainsToFetch.length === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/backlinks/bulk-count', {
        targets: domainsToFetch,
        useSandbox,
        maxConcurrency: 10,
      });

      if (response.data && response.data.summary) {
        setData(response.data);
      } else {
        setError('No backlink summary returned from DataForSEO API');
      }
    } catch (err: any) {
      console.error('Failed to fetch cumulative backlink count:', err);
      setError(err?.response?.data?.error || err?.message || 'DataForSEO API query failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount or when serialized activeTargetsKey or useSandbox change
  useEffect(() => {
    if (targetDomains.length > 0) {
      fetchBacklinks(targetDomains);
    }
  }, [activeTargetsKey, useSandbox]);

  // Add domain handler
  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputDomain.trim().replace(/^(https?:\/\/)+/i, '').split('/')[0].toLowerCase();
    if (!clean) return;
    if (!targetDomains.includes(clean)) {
      const updated = [...targetDomains, clean];
      setTargetDomains(updated);
      setInputDomain('');
      fetchBacklinks(updated);
      toast.success(`Added ${clean} to cumulative counter`);
    } else {
      toast.error('Domain already in counter list');
    }
  };

  // Remove domain handler
  const handleRemoveDomain = (domToRemove: string) => {
    if (targetDomains.length <= 1) {
      toast.error('At least one domain must remain in counter');
      return;
    }
    const updated = targetDomains.filter((d) => d !== domToRemove);
    setTargetDomains(updated);
    fetchBacklinks(updated);
  };

  // Number formatting helper
  const formatNumber = (num: number = 0) => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2) + 'B';
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const summary = data?.summary || {
    total_backlinks_sum: 0,
    total_referring_domains_sum: 0,
    total_referring_ips_sum: 0,
    avg_authority_score: 0,
    avg_dofollow_ratio: 0,
  };

  // Minimal variant (single compact line or pill)
  if (variant === 'minimal') {
    return (
      <div className="inline-flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono">
        <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
          <Link2 className="w-3.5 h-3.5" />
          <span>Total Backlinks:</span>
        </div>
        {isLoading ? (
          <RefreshCw className="w-3 h-3 text-zinc-500 animate-spin" />
        ) : (
          <span className="text-emerald-400 font-black text-sm">
            {formatNumber(summary.total_backlinks_sum)}
          </span>
        )}
        <span className="text-zinc-500 text-[10px]">
          ({formatNumber(summary.total_referring_domains_sum)} Ref Dom)
        </span>
      </div>
    );
  }

  // Compact variant (useful inside modals like Domain Profiler)
  if (variant === 'compact') {
    return (
      <div className="bg-zinc-900/90 border border-indigo-500/30 rounded-xl p-4 space-y-3 font-mono shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                <span>{title}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  DataForSEO Live
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-sans">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => fetchBacklinks()}
            disabled={isLoading}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-zinc-700 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>

        {/* 4 Mini Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-lg">
            <div className="text-[9px] text-zinc-400 uppercase font-bold">Cumulative Backlinks</div>
            <div className="text-base font-black text-emerald-400 mt-0.5 flex items-center gap-1">
              {isLoading ? '...' : formatNumber(summary.total_backlinks_sum)}
            </div>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-lg">
            <div className="text-[9px] text-zinc-400 uppercase font-bold">Referring Domains</div>
            <div className="text-base font-black text-cyan-400 mt-0.5">
              {isLoading ? '...' : formatNumber(summary.total_referring_domains_sum)}
            </div>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-lg">
            <div className="text-[9px] text-zinc-400 uppercase font-bold">Dofollow Ratio</div>
            <div className="text-base font-black text-indigo-400 mt-0.5">
              {isLoading ? '...' : `${summary.avg_dofollow_ratio}%`}
            </div>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-lg">
            <div className="text-[9px] text-zinc-400 uppercase font-bold">Avg Authority Rank</div>
            <div className="text-base font-black text-amber-400 mt-0.5">
              {isLoading ? '...' : `${summary.avg_authority_score} / 100`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full / Default Variant (Ideal for ResultsTable and primary dashboard areas)
  return (
    <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#1a1a1a] space-y-4 font-mono-brutal">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-[#ff4d00] dark:bg-zinc-800 dark:text-cyan-400 border-2 border-black dark:border-zinc-600 rounded-xl flex items-center justify-center font-black shadow-[2px_2px_0_#000]">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black uppercase text-black dark:text-zinc-100">
                {title}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-white shadow-[1px_1px_0_#000]">
                DATAFORSEO LIVE ENGINE
              </span>
              {useSandbox && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-black border border-black">
                  SANDBOX BENCHMARK
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 font-sans">
              {subtitle} ({targetDomains.length} monitored target domain{targetDomains.length > 1 ? 's' : ''})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setUseSandbox(!useSandbox)}
            className="px-2.5 py-1 text-[10px] font-bold uppercase rounded border border-black dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-200 hover:bg-zinc-200 cursor-pointer"
          >
            {useSandbox ? 'Switch to Live API' : 'Benchmark Mode'}
          </button>

          <button
            onClick={() => fetchBacklinks()}
            disabled={isLoading}
            className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black font-bold text-xs uppercase border-2 border-black rounded-lg shadow-[2px_2px_0_#ff4d00] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Syncing...' : 'Sync Live Count'}</span>
          </button>
        </div>
      </div>

      {/* Main Cumulative Scoreboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Cumulative Backlinks */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border-3 border-black dark:border-zinc-800 p-3.5 rounded-xl shadow-[3px_3px_0_#000] relative overflow-hidden">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase">
            <span>Cumulative Backlinks</span>
            <Link2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {isLoading ? (
              <span className="animate-pulse">Fetching...</span>
            ) : (
              formatNumber(summary.total_backlinks_sum)
            )}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">
            Raw: {summary.total_backlinks_sum.toLocaleString()} links
          </div>
        </div>

        {/* Referring Domains */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border-3 border-black dark:border-zinc-800 p-3.5 rounded-xl shadow-[3px_3px_0_#000]">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase">
            <span>Referring Domains</span>
            <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {isLoading ? (
              <span className="animate-pulse">Fetching...</span>
            ) : (
              formatNumber(summary.total_referring_domains_sum)
            )}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">
            IPs: {formatNumber(summary.total_referring_ips_sum)} subnets
          </div>
        </div>

        {/* Dofollow Ratio */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border-3 border-black dark:border-zinc-800 p-3.5 rounded-xl shadow-[3px_3px_0_#000]">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase">
            <span>Dofollow Ratio</span>
            <Zap className="w-3.5 h-3.5 text-[#ff4d00]" />
          </div>
          <div className="text-2xl font-black text-[#ff4d00] mt-1">
            {isLoading ? (
              <span className="animate-pulse">Fetching...</span>
            ) : (
              `${summary.avg_dofollow_ratio}%`
            )}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">
            High Link Equity Weight
          </div>
        </div>

        {/* Authority Score */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border-3 border-black dark:border-zinc-800 p-3.5 rounded-xl shadow-[3px_3px_0_#000]">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase">
            <span>Average Authority</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
            {isLoading ? (
              <span className="animate-pulse">Fetching...</span>
            ) : (
              `${summary.avg_authority_score} / 100`
            )}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">
            Domain Trust Rank
          </div>
        </div>
      </div>

      {/* Target Domain Chips & Quick Add Form */}
      {allowManualInput && (
        <div className="bg-zinc-100 dark:bg-zinc-950 p-3 rounded-xl border-2 border-black dark:border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase mr-1">Domains:</span>
            {targetDomains.map((dom) => (
              <span
                key={dom}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-zinc-900 border border-black dark:border-zinc-700 rounded-lg text-xs font-bold text-black dark:text-zinc-200 shadow-[1px_1px_0_#000]"
              >
                <span>{dom}</span>
                {onInspectDomain && (
                  <button
                    onClick={() => onInspectDomain(dom)}
                    className="text-indigo-500 hover:text-indigo-400 p-0.5 cursor-pointer"
                    title="Audit domain profile"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                )}
                <button
                  onClick={() => handleRemoveDomain(dom)}
                  className="text-zinc-400 hover:text-rose-500 font-black text-xs ml-0.5 cursor-pointer"
                  title="Remove from counter"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddDomain} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={inputDomain}
              onChange={(e) => setInputDomain(e.target.value)}
              placeholder="Add domain..."
              className="px-2.5 py-1 bg-white dark:bg-zinc-900 border border-black dark:border-zinc-700 rounded-lg text-xs font-mono text-black dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-black text-white dark:bg-zinc-800 dark:text-cyan-400 text-xs font-bold uppercase rounded-lg border border-black dark:border-zinc-700 shadow-[1px_1px_0_#000] cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>
      )}

      {/* Expandable Per-Domain Breakdown Table */}
      {data && data.results && data.results.length > 0 && (
        <div className="border-2 border-black dark:border-zinc-800 rounded-xl overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-between text-xs font-bold uppercase text-black dark:text-zinc-200 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#ff4d00]" />
              <span>Domain Breakdown &amp; Metric Matrix ({data.results.length})</span>
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="overflow-x-auto max-h-[300px]">
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-black dark:border-zinc-800 sticky top-0">
                  <tr>
                    <th className="p-2.5 font-bold uppercase">Domain Target</th>
                    <th className="p-2.5 font-bold uppercase">Total Backlinks</th>
                    <th className="p-2.5 font-bold uppercase">Ref Domains</th>
                    <th className="p-2.5 font-bold uppercase">Dofollow %</th>
                    <th className="p-2.5 font-bold uppercase">Authority Score</th>
                    <th className="p-2.5 font-bold uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                  {data.results.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                      <td className="p-2.5 font-bold text-black dark:text-zinc-200">
                        {item.domain || item.target}
                      </td>
                      <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">
                        {item.total_backlinks.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-indigo-600 dark:text-indigo-400">
                        {item.referring_domains.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-[#ff4d00] font-semibold">
                        {item.dofollow_ratio}%
                      </td>
                      <td className="p-2.5 font-bold text-cyan-600 dark:text-cyan-400">
                        {item.authority_score} / 100
                      </td>
                      <td className="p-2.5 text-right">
                        {onInspectDomain && (
                          <button
                            onClick={() => onInspectDomain(item.domain || item.target)}
                            className="px-2 py-0.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Audit Profile
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
