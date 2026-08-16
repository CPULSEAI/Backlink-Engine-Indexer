import React, { useState } from 'react';
import axios from 'axios';
import {
  X,
  FileCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Download,
  Play,
  RefreshCw,
  Sliders,
  Send,
  Globe,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface SitemapUrlAuditResult {
  url: string;
  httpStatus: number;
  isBroken: boolean;
  hasMetaDescription: boolean;
  metaDescription: string;
  metaLength: number;
  title: string;
  canonicalUrl: string;
  isCanonicalMatch: boolean;
  isOrphanOrNoindex: boolean;
  responseLatencyMs: number;
  issues: string[];
}

export interface SitemapAuditReport {
  targetDomain: string;
  sitemapUrl: string;
  auditedAt: string;
  totalPagesFound: number;
  healthyPagesCount: number;
  brokenLinksCount: number;
  missingMetaCount: number;
  orphanOrNoindexCount: number;
  canonicalMismatchCount: number;
  overallHealthScore: number;
  avgLatencyMs: number;
  pages: SitemapUrlAuditResult[];
}

interface SitemapAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDomain?: string;
  onSendToIndexingQueue?: (urls: string[]) => void;
}

export const SitemapAuditModal: React.FC<SitemapAuditModalProps> = ({
  isOpen,
  onClose,
  initialDomain = 'careerpulseai.net',
  onSendToIndexingQueue,
}) => {
  const [domainInput, setDomainInput] = useState<string>(initialDomain);
  const [maxPages, setMaxPages] = useState<number>(50);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [report, setReport] = useState<SitemapAuditReport | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'ALL' | 'BROKEN' | 'MISSING_META' | 'ORPHAN' | 'HEALTHY'>('ALL');

  if (!isOpen) return null;

  const handleRunAudit = async () => {
    if (!domainInput.trim()) {
      toast.error('Please enter a target domain or sitemap XML URL');
      return;
    }

    setIsAuditing(true);
    setReport(null);
    try {
      const res = await axios.post('/api/sitemap/audit', {
        domainOrUrl: domainInput.trim(),
        maxPages: Number(maxPages) || 50,
      });

      if (res.data && res.data.report) {
        setReport(res.data.report);
        toast.success(`Sitemap audit completed! Health Score: ${res.data.report.overallHealthScore}%`);
      } else {
        toast.error('Failed to parse sitemap report');
      }
    } catch (err: any) {
      console.error('Sitemap audit error:', err);
      toast.error(err.response?.data?.error || 'Sitemap audit failed. Ensure domain is reachable.');
    } finally {
      setIsAuditing(false);
    }
  };

  // Filtered pages list
  const filteredPages = (report?.pages || []).filter((page) => {
    const matchesSearch =
      page.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.metaDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.issues.some((iss) => iss.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'BROKEN') return page.isBroken;
    if (filterType === 'MISSING_META') return !page.hasMetaDescription || page.metaLength < 50;
    if (filterType === 'ORPHAN') return page.isOrphanOrNoindex || !page.isCanonicalMatch;
    if (filterType === 'HEALTHY') return !page.isBroken && page.hasMetaDescription && page.isCanonicalMatch && !page.isOrphanOrNoindex;

    return true;
  });

  const handleExportCsv = () => {
    if (!report || report.pages.length === 0) return;
    const headers = ['URL', 'HTTP Status', 'Title', 'Meta Description', 'Meta Chars', 'Canonical Match', 'Orphan/Noindex', 'Latency (ms)', 'Issues'];
    const rows = report.pages.map((p) => [
      `"${p.url.replace(/"/g, '""')}"`,
      p.httpStatus,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${(p.metaDescription || '').replace(/"/g, '""')}"`,
      p.metaLength,
      p.isCanonicalMatch ? 'YES' : 'NO',
      p.isOrphanOrNoindex ? 'YES' : 'NO',
      p.responseLatencyMs,
      `"${p.issues.join('; ').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sitemap_Audit_${report.targetDomain}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Audit Report exported successfully!');
  };

  const handleSendFlaggedToIndexQueue = () => {
    if (!report) return;
    const flaggedUrls = report.pages
      .filter((p) => p.isBroken || !p.hasMetaDescription || p.isOrphanOrNoindex)
      .map((p) => p.url);

    if (flaggedUrls.length === 0) {
      toast.success('All audited pages are already healthy!');
      return;
    }

    if (onSendToIndexingQueue) {
      onSendToIndexingQueue(flaggedUrls);
      onClose();
      toast.success(`Sent ${flaggedUrls.length} flagged URLs to submission queue!`);
    } else {
      navigator.clipboard.writeText(flaggedUrls.join('\n'));
      toast.success(`Copied ${flaggedUrls.length} flagged URLs to clipboard!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#f2efeb] border-4 border-black w-full max-w-6xl max-h-[92vh] flex flex-col shadow-[8px_8px_0_#000] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-black text-white p-4 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ff4d00] text-black border-2 border-black shadow-[2px_2px_0_#fff]">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-mono-brutal font-bold uppercase tracking-wider text-white">
                XML SITEMAP CRAWLER &amp; TECHNICAL SEO AUDIT
              </h2>
              <p className="text-xs font-mono-brutal text-zinc-300">
                Inspect 50+ URLs for broken links (404/500), missing meta descriptions, orphan pages &amp; canonical mismatches
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white text-black hover:bg-[#ff4d00] hover:text-black border-2 border-black shadow-[2px_2px_0_#fff] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-b-4 border-black space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter domain or XML URL (e.g., careerpulseai.net or https://mysite.com/sitemap.xml)"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                className="w-full bg-[#f2efeb] border-2 border-black pl-9 pr-3 py-2 text-xs font-mono-brutal font-bold text-black focus:outline-none shadow-[2px_2px_0_#000]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={maxPages}
                onChange={(e) => setMaxPages(Number(e.target.value))}
                className="bg-[#f2efeb] border-2 border-black px-3 py-2 text-xs font-mono-brutal font-bold text-black shadow-[2px_2px_0_#000]"
              >
                <option value={20}>Audit 20 Pages</option>
                <option value={50}>Audit 50 Pages (Standard)</option>
                <option value={100}>Audit 100 Pages (Deep)</option>
              </select>

              <button
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="flex items-center gap-2 px-5 py-2 bg-[#ff4d00] hover:bg-[#ff5c14] text-black font-mono-brutal font-bold text-xs uppercase border-2 border-black shadow-[3px_3px_0_#000] transition-all cursor-pointer disabled:opacity-50"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>CRAWLING_SITEMAP...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-black fill-black" />
                    <span>RUN_SITEMAP_AUDIT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Audit Summary Scorecard */}
          {report ? (
            <div className="space-y-4">
              {/* Score Bento Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Overall Health Score */}
                <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
                  <span className="text-[10px] font-mono-brutal font-bold text-zinc-600 uppercase block">
                    HEALTH SCORE
                  </span>
                  <div className="text-2xl font-mono-brutal font-bold text-black mt-1">
                    {report.overallHealthScore}%
                  </div>
                  <div className="text-[10px] font-mono-brutal text-zinc-500">
                    {report.overallHealthScore >= 80 ? '🟢 Authoritative' : '🔴 Needs Attention'}
                  </div>
                </div>

                {/* Total Pages Audited */}
                <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
                  <span className="text-[10px] font-mono-brutal font-bold text-zinc-600 uppercase block">
                    TOTAL URLS
                  </span>
                  <div className="text-2xl font-mono-brutal font-bold text-black mt-1">
                    {report.totalPagesFound}
                  </div>
                  <div className="text-[10px] font-mono-brutal text-zinc-500">
                    Avg {report.avgLatencyMs}ms latency
                  </div>
                </div>

                {/* Healthy Pages */}
                <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
                  <span className="text-[10px] font-mono-brutal font-bold text-emerald-700 uppercase block">
                    HEALTHY PAGES
                  </span>
                  <div className="text-2xl font-mono-brutal font-bold text-emerald-700 mt-1">
                    {report.healthyPagesCount}
                  </div>
                  <div className="text-[10px] font-mono-brutal text-zinc-500">
                    {Math.round((report.healthyPagesCount / Math.max(1, report.totalPagesFound)) * 100)}% Pass
                  </div>
                </div>

                {/* Broken Links (404/500) */}
                <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
                  <span className="text-[10px] font-mono-brutal font-bold text-red-600 uppercase block">
                    BROKEN (404/500)
                  </span>
                  <div className="text-2xl font-mono-brutal font-bold text-red-600 mt-1">
                    {report.brokenLinksCount}
                  </div>
                  <div className="text-[10px] font-mono-brutal text-zinc-500">
                    Critical fix required
                  </div>
                </div>

                {/* Missing Meta Description */}
                <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
                  <span className="text-[10px] font-mono-brutal font-bold text-amber-600 uppercase block">
                    MISSING META
                  </span>
                  <div className="text-2xl font-mono-brutal font-bold text-amber-600 mt-1">
                    {report.missingMetaCount}
                  </div>
                  <div className="text-[10px] font-mono-brutal text-zinc-500">
                    CTR / SERP risk
                  </div>
                </div>

                {/* Orphan / Canonical Mismatch */}
                <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
                  <span className="text-[10px] font-mono-brutal font-bold text-purple-700 uppercase block">
                    ORPHAN / NOINDEX
                  </span>
                  <div className="text-2xl font-mono-brutal font-bold text-purple-700 mt-1">
                    {report.orphanOrNoindexCount}
                  </div>
                  <div className="text-[10px] font-mono-brutal text-zinc-500">
                    {report.canonicalMismatchCount} Canonical diffs
                  </div>
                </div>
              </div>

              {/* Action & Filter Toolbar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 border-2 border-black shadow-[2px_2px_0_#000]">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search URLs, title, or error tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#f2efeb] border border-black pl-8 pr-2.5 py-1.5 text-xs font-mono-brutal text-black focus:outline-none"
                  />
                </div>

                {/* Filter Badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setFilterType('ALL')}
                    className={`px-2.5 py-1 text-[11px] font-mono-brutal font-bold uppercase border border-black transition-all ${
                      filterType === 'ALL' ? 'bg-black text-white' : 'bg-zinc-100 text-black hover:bg-zinc-200'
                    }`}
                  >
                    ALL ({report.pages.length})
                  </button>
                  <button
                    onClick={() => setFilterType('BROKEN')}
                    className={`px-2.5 py-1 text-[11px] font-mono-brutal font-bold uppercase border border-black transition-all ${
                      filterType === 'BROKEN' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-800 hover:bg-red-100'
                    }`}
                  >
                    BROKEN ({report.brokenLinksCount})
                  </button>
                  <button
                    onClick={() => setFilterType('MISSING_META')}
                    className={`px-2.5 py-1 text-[11px] font-mono-brutal font-bold uppercase border border-black transition-all ${
                      filterType === 'MISSING_META' ? 'bg-amber-500 text-black' : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                    }`}
                  >
                    MISSING META ({report.missingMetaCount})
                  </button>
                  <button
                    onClick={() => setFilterType('ORPHAN')}
                    className={`px-2.5 py-1 text-[11px] font-mono-brutal font-bold uppercase border border-black transition-all ${
                      filterType === 'ORPHAN' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                    }`}
                  >
                    ORPHAN ({report.orphanOrNoindexCount})
                  </button>
                  <button
                    onClick={() => setFilterType('HEALTHY')}
                    className={`px-2.5 py-1 text-[11px] font-mono-brutal font-bold uppercase border border-black transition-all ${
                      filterType === 'HEALTHY' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                    }`}
                  >
                    HEALTHY ({report.healthyPagesCount})
                  </button>
                </div>

                {/* Export & Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCsv}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#f2efeb] hover:bg-zinc-200 text-black text-xs font-mono-brutal font-bold border border-black cursor-pointer"
                    title="Export Audit as CSV spreadsheet"
                  >
                    <Download className="w-3.5 h-3.5 text-black" />
                    <span>CSV</span>
                  </button>

                  <button
                    onClick={handleSendFlaggedToIndexQueue}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#ff4d00] hover:bg-[#ff5c14] text-black text-xs font-mono-brutal font-bold border border-black cursor-pointer shadow-[1px_1px_0_#000]"
                    title="Send flagged URLs to submission queue"
                  >
                    <Send className="w-3.5 h-3.5 text-black" />
                    <span>QUEUE_FLAGGED</span>
                  </button>
                </div>
              </div>

              {/* URL Diagnostic Table */}
              <div className="bg-white border-2 border-black overflow-x-auto shadow-[2px_2px_0_#000]">
                <table className="w-full text-left text-xs font-mono-brutal">
                  <thead className="bg-[#111113] text-white border-b-2 border-black uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3 border-r border-zinc-800">Status</th>
                      <th className="py-2.5 px-3 border-r border-zinc-800">Page URL &amp; Title</th>
                      <th className="py-2.5 px-3 border-r border-zinc-800">Meta Description</th>
                      <th className="py-2.5 px-3 border-r border-zinc-800">Canonical Tag</th>
                      <th className="py-2.5 px-3 border-r border-zinc-800">Latency</th>
                      <th className="py-2.5 px-3">Diagnostic Issues</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-[11px]">
                    {filteredPages.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-zinc-500 font-mono-brutal">
                          No URL pages found matching the active filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredPages.map((page, idx) => (
                        <tr key={idx} className="hover:bg-[#f2efeb] transition-colors">
                          {/* Status Badge */}
                          <td className="py-2.5 px-3 border-r border-zinc-200 whitespace-nowrap">
                            {page.httpStatus === 200 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px]">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>200_OK</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 border border-red-300 font-bold text-[10px]">
                                <XCircle className="w-2.5 h-2.5" />
                                <span>HTTP_{page.httpStatus}</span>
                              </span>
                            )}
                          </td>

                          {/* URL & Title */}
                          <td className="py-2.5 px-3 border-r border-zinc-200 max-w-[280px]">
                            <a
                              href={page.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-black hover:text-[#ff4d00] hover:underline font-bold flex items-center gap-1 truncate"
                              title={page.url}
                            >
                              <span className="truncate">{page.url}</span>
                              <ExternalLink className="w-3 h-3 shrink-0 text-zinc-500" />
                            </a>
                            <div className="text-[10px] text-zinc-600 truncate mt-0.5" title={page.title}>
                              {page.title || <span className="text-red-500 italic">&lt;Missing Title&gt;</span>}
                            </div>
                          </td>

                          {/* Meta Description */}
                          <td className="py-2.5 px-3 border-r border-zinc-200 max-w-[260px]">
                            {page.hasMetaDescription ? (
                              <div>
                                <p className="truncate text-zinc-800 text-[10px]" title={page.metaDescription}>
                                  "{page.metaDescription}"
                                </p>
                                <span className={`text-[9px] px-1 py-0.2 font-mono-brutal font-bold ${
                                  page.metaLength < 50 || page.metaLength > 165
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-zinc-100 text-zinc-700'
                                }`}>
                                  {page.metaLength} chars
                                </span>
                              </div>
                            ) : (
                              <span className="text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 text-[10px] font-bold">
                                MISSING_META
                              </span>
                            )}
                          </td>

                          {/* Canonical */}
                          <td className="py-2.5 px-3 border-r border-zinc-200 whitespace-nowrap">
                            {page.isCanonicalMatch ? (
                              <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>MATCH</span>
                              </span>
                            ) : (
                              <span className="text-amber-800 bg-amber-50 border border-amber-200 px-1 py-0.5 text-[10px] font-bold">
                                DIFF_CANONICAL
                              </span>
                            )}
                          </td>

                          {/* Latency */}
                          <td className="py-2.5 px-3 border-r border-zinc-200 whitespace-nowrap text-zinc-600 text-[10px]">
                            {page.responseLatencyMs}ms
                          </td>

                          {/* Issues Tag List */}
                          <td className="py-2.5 px-3">
                            {page.issues.length === 0 ? (
                              <span className="text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>PASSED_ALL_CHECKS</span>
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {page.issues.map((iss, iIdx) => (
                                  <span
                                    key={iIdx}
                                    className="bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.2 text-[9px] font-bold"
                                  >
                                    {iss}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-black p-10 text-center space-y-3 shadow-[2px_2px_0_#000]">
              <div className="w-12 h-12 bg-[#ff4d00] text-black border-2 border-black mx-auto flex items-center justify-center shadow-[3px_3px_0_#000]">
                <FileCode className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-mono-brutal font-bold uppercase text-black">
                READY TO AUDIT DOMAIN XML SITEMAP
              </h3>
              <p className="text-xs font-mono-brutal text-zinc-600 max-w-lg mx-auto">
                Enter your domain above and click <strong>RUN SITEMAP AUDIT</strong> to inspect sitemap structure, identify broken links, and detect canonical errors before deploying backlink indexing campaigns.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#111113] p-3 text-xs text-white flex items-center justify-between border-t-2 border-black font-mono-brutal">
          <span className="text-zinc-400 text-[11px]">
            Sitemap Inspector Engine // v3.1 Enterprise Diagnostics
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-white text-black font-bold uppercase hover:bg-[#ff4d00] transition-all cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
