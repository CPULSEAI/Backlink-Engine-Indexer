import React, { useState, useEffect } from 'react';
import { X, Globe, ShieldCheck, Sparkles, TrendingUp, AlertCircle, BarChart2, Layers, Award, CheckCircle2, ArrowRight, Loader2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { TotalBacklinkCounter } from './TotalBacklinkCounter';
import { DomainBacklinkGrowthChart } from './DomainBacklinkGrowthChart';

interface DomainProfilerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDomain?: string;
}

export interface DomainProfileResult {
  domain: string;
  domainRating: number;
  backlinkHealthScore: number;
  keywordAuthorityScore: number;
  geoVisibilityScore: number;
  industryBenchmark: {
    avgDomainRating: number;
    avgGeoVisibility: number;
    topCompetitorDR: number;
  };
  backlinkMetrics: {
    totalBacklinks: string;
    referringDomains: string;
    dofollowRatio: string;
    toxicBacklinksPct: string;
  };
  keywordAuthorityClusters: Array<{
    cluster: string;
    position: string;
    volume: string;
    geoCitationRate: string;
  }>;
  geoOpportunities: Array<{
    opportunity: string;
    impact: 'High' | 'Medium';
    recommendation: string;
  }>;
  summaryAnalysis: string;
}

export const DomainProfilerModal: React.FC<DomainProfilerModalProps> = ({ isOpen, onClose, initialDomain = '' }) => {
  const [domain, setDomain] = useState(initialDomain);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DomainProfileResult | null>(null);
  const [appliedOpps, setAppliedOpps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (initialDomain && initialDomain !== domain) {
      setDomain(initialDomain);
    }
  }, [initialDomain]);

  if (!isOpen) return null;

  const handleProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domain.trim()) {
      toast.error('Please enter a valid domain (e.g. company.com)');
      return;
    }

    setLoading(true);
    setResult(null);
    const toastId = toast.loading(`Analyzing domain profile & GEO readiness for ${domain}...`);

    try {
      const resp = await fetch('/api/profile-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain.trim() })
      });

      if (!resp.ok) {
        throw new Error('Domain profiling request failed');
      }

      const data: DomainProfileResult = await resp.json();
      setResult(data);
      toast.success(`Domain profile completed for ${data.domain}!`, { id: toastId });
    } catch (err: any) {
      console.error('Domain Profiler Error:', err);
      toast.error(err.message || 'Failed to analyze domain. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 55) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/80 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-100">SEO Domain Profiler</h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Gemini GEO Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Analyze domain backlink health, keyword authority, and GEO (Generative Engine Optimization) readiness against industry benchmarks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Domain Input Form */}
          <form onSubmit={handleProfile} className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-900/80 border border-zinc-800 p-2.5 rounded-xl">
            <div className="relative flex-1 w-full">
              <Globe className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain (e.g., stripe.com, Vercel.com, mystartup.io)"
                className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !domain.trim()}
              className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap shadow-md shadow-indigo-600/20 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Profiling...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Domain Profile</span>
                </>
              )}
            </button>
          </form>

          {/* Results Area */}
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-zinc-200">Evaluating Domain Intelligence &amp; Backlinks...</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-md">
                  Querying backlink velocity, anchor distribution, keyword authority clusters, and generative AI citation benchmarks.
                </p>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="py-12 px-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 text-zinc-600 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-zinc-300">Ready to Profile Any Domain</h4>
                <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1">
                  Enter your domain or a competitor's domain above to generate an instant 360° audit of Domain Rating, backlink toxicity, keyword cluster positions, and Generative Engine Optimization (GEO) potential.
                </p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Executive Summary Callout */}
              <div className="bg-gradient-to-r from-indigo-950/40 via-zinc-900/80 to-purple-950/30 border border-indigo-500/30 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono">
                    Gemini Executive Domain Profile Audit
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                    {result.domain}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {result.summaryAnalysis}
                </p>
              </div>

              {/* DataForSEO Cumulative Total Backlink Counter */}
              <TotalBacklinkCounter
                domain={result.domain}
                variant="compact"
                title={`Live Cumulative Backlink Count: ${result.domain}`}
                subtitle="DataForSEO verified live crawl and link equity metrics"
                allowManualInput={false}
              />

              {/* 4 Score Badges Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                
                {/* Domain Rating */}
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-mono font-bold">
                    <span>Domain Rating (DR)</span>
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-zinc-100">{result.domainRating}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">/ 100</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    Industry Avg: <span className="text-zinc-200 font-bold">{result.industryBenchmark.avgDomainRating}</span>
                  </div>
                </div>

                {/* Backlink Health */}
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-mono font-bold">
                    <span>Backlink Health</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-emerald-400">{result.backlinkHealthScore}%</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    Toxic Links: <span className="text-rose-400 font-bold">{result.backlinkMetrics.toxicBacklinksPct}</span>
                  </div>
                </div>

                {/* Keyword Authority */}
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-mono font-bold">
                    <span>Keyword Authority</span>
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-cyan-300">{result.keywordAuthorityScore}%</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    Ref Domains: <span className="text-zinc-200 font-bold">{result.backlinkMetrics.referringDomains}</span>
                  </div>
                </div>

                {/* GEO Visibility Score */}
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-mono font-bold">
                    <span>GEO Visibility Score</span>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-amber-400">{result.geoVisibilityScore}%</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    AI Citation Ready
                  </div>
                </div>

              </div>

              {/* 30-Day D3.js Backlink Growth Trend & Velocity Chart */}
              <DomainBacklinkGrowthChart
                domain={result.domain}
                totalBacklinks={result.backlinkMetrics.totalBacklinks}
                referringDomains={result.backlinkMetrics.referringDomains}
              />

              {/* Industry Benchmark Comparison Bar */}
              <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
                  <span className="flex items-center gap-1.5 font-mono uppercase tracking-wider">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                    Industry Benchmark Comparison
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Top Competitor DR: <span className="text-purple-400 font-bold">{result.industryBenchmark.topCompetitorDR}</span>
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-300 font-bold">{result.domain} DR ({result.domainRating})</span>
                      <span className="text-emerald-400 font-bold">Your Domain</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, result.domainRating)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-400">Industry Average DR ({result.industryBenchmark.avgDomainRating})</span>
                      <span className="text-zinc-500">Benchmark</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="bg-zinc-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, result.industryBenchmark.avgDomainRating)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-400">GEO AI Visibility Score ({result.geoVisibilityScore}%)</span>
                      <span className="text-amber-400 font-bold">Generative Engine Index</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, result.geoVisibilityScore)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Keyword Authority Clusters Table */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                      Keyword Authority Clusters &amp; AI Citation Rates
                    </h3>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Total Backlinks: <span className="text-zinc-200 font-bold">{result.backlinkMetrics.totalBacklinks}</span>
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800/80 text-[10px] text-zinc-500 uppercase tracking-wider">
                        <th className="pb-2 font-bold">Keyword Topic Cluster</th>
                        <th className="pb-2 font-bold">SERP Position</th>
                        <th className="pb-2 font-bold">Est. Volume</th>
                        <th className="pb-2 font-bold text-right">GEO Citation Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                      {result.keywordAuthorityClusters.map((row, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/80 transition-colors">
                          <td className="py-2.5 font-medium text-zinc-200">{row.cluster}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-indigo-300 font-bold">
                              {row.position}
                            </span>
                          </td>
                          <td className="py-2.5 text-zinc-400">{row.volume}</td>
                          <td className="py-2.5 text-right font-bold text-emerald-400">
                            {row.geoCitationRate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GEO Strategic Opportunities */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                    Generative Engine Optimization (GEO) High-Impact Opportunities
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.geoOpportunities.map((opp, idx) => (
                    <div key={idx} className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl space-y-2 hover:border-zinc-700 transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            {opp.opportunity}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                            opp.impact === 'High'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                          }`}>
                            {opp.impact} Impact
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-normal font-sans">
                          {opp.recommendation}
                        </p>
                      </div>
                      <div className="pt-2.5 flex items-center justify-between border-t border-zinc-800/80 mt-1">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          Fix Status: {appliedOpps[idx] ? <span className="text-emerald-400 font-bold">Fix Applied</span> : <span className="text-amber-400 font-bold">Recommended</span>}
                        </span>
                        <button
                          onClick={() => {
                            setAppliedOpps(prev => ({ ...prev, [idx]: true }));
                            toast.success(`Applied fix for: "${opp.opportunity}"`);
                          }}
                          className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center gap-1"
                        >
                          {appliedOpps[idx] ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Zap className="w-3 h-3 text-amber-400" />}
                          <span>{appliedOpps[idx] ? 'Fix Active' : 'Apply Fix'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            360° AI Domain Profile Audit
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-lg transition-all"
          >
            Close Audit
          </button>
        </div>

      </div>
    </div>
  );
};
