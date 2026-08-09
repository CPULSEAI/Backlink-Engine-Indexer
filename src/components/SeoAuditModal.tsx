import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  X,
  Search,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileJson,
  Code2,
  Globe,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  AlertOctagon,
  Image,
  Link2,
  Clock
} from 'lucide-react';
import { AuditReport, AuditIssue } from '../../server/crawler';

interface SeoAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUrl?: string;
}

export const SeoAuditModal: React.FC<SeoAuditModalProps> = ({
  isOpen,
  onClose,
  defaultUrl = ''
}) => {
  const [baseURL, setBaseURL] = useState(defaultUrl || 'https://example.com');
  const [maxPages, setMaxPages] = useState(15);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'issues' | 'pages' | 'script'>('issues');
  const [copiedScript, setCopiedScript] = useState(false);
  const [impactFilter, setImpactFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  if (!isOpen) return null;

  const handleRunAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!baseURL.trim()) return;

    setLoading(true);
    setError(null);
    const toastId = toast.loading(`Crawling ${baseURL.trim()} up to ${maxPages} pages...`);

    try {
      const res = await axios.post('/api/audit/crawl', {
        baseURL: baseURL.trim(),
        maxPages
      });
      setReport(res.data);
      setActiveTab('issues');
      toast.success(`SEO Crawl completed! Found ${res.data.issues?.length || 0} issues across ${res.data.summary?.totalPages || 0} pages.`, { id: toastId });
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to crawl website';
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo_audit_${report.targetDomain}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const standaloneScriptCode = `// Standalone Node.js Technical SEO Audit Crawler
// Prerequisites: npm install axios cheerio

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function auditCrawl(startUrl, maxPages = 20) {
  const visited = new Set();
  const queue = [startUrl];
  const pages = [];
  const targetDomain = new URL(startUrl).hostname;

  console.log(\`Starting audit for \${targetDomain} (max \${maxPages} pages)...\`);

  while (queue.length > 0 && visited.size < maxPages) {
    const currentUrl = queue.shift();
    if (visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    try {
      const start = Date.now();
      const res = await axios.get(currentUrl, { timeout: 8000, validateStatus: () => true });
      const duration = Date.now() - start;
      const $ = cheerio.load(res.data || '');

      const title = $('title').text().trim();
      const metaDesc = $('meta[name="description" i]').attr('content')?.trim() || '';
      const h1s = [];
      $('h1').each((_, el) => h1s.push($(el).text().trim()));

      const missingAltImages = [];
      $('img').each((_, el) => {
        if (!$(el).attr('alt')) missingAltImages.push($(el).attr('src') || '');
      });

      const issues = [];
      if (!title) issues.push({ impact: 'HIGH', issue: 'Missing <title> tag' });
      if (h1s.length === 0) issues.push({ impact: 'HIGH', issue: 'Missing H1 heading' });
      if (h1s.length > 1) issues.push({ impact: 'HIGH', issue: 'Multiple H1 headings' });
      if (!metaDesc) issues.push({ impact: 'MEDIUM', issue: 'Missing meta description' });
      if (res.status === 404) issues.push({ impact: 'HIGH', issue: 'Broken Page (404)' });

      pages.push({
        url: currentUrl,
        statusCode: res.status,
        durationMs: duration,
        title,
        metaDesc,
        h1s,
        missingAltCount: missingAltImages.length,
        issues
      });

      // Internal link discovery
      $('a[href]').each((_, el) => {
        try {
          const resolved = new URL($(el).attr('href'), currentUrl);
          resolved.hash = '';
          if (resolved.hostname === targetDomain && !visited.has(resolved.href)) {
            queue.push(resolved.href);
          }
        } catch {}
      });
    } catch (e) {
      console.error(\`Failed \${currentUrl}: \${e.message}\`);
    }
  }

  fs.writeFileSync('audit-results.json', JSON.stringify(pages, null, 2));
  console.log('Saved audit-results.json successfully.');
}

auditCrawl('${baseURL || 'https://example.com'}', ${maxPages});`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(standaloneScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const getImpactBadge = (impact: 'HIGH' | 'MEDIUM' | 'LOW') => {
    if (impact === 'HIGH') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <ShieldAlert className="w-3 h-3" /> High Impact
        </span>
      );
    }
    if (impact === 'MEDIUM') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertTriangle className="w-3 h-3" /> Medium Impact
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
        <Info className="w-3 h-3" /> Low Impact
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                Technical SEO Website Audit Crawler
              </h3>
              <p className="text-xs text-zinc-400">
                Crawls target domain, parses HTML meta tags, H1s, links, alt text, and flags high-impact technical issues.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form Controls */}
        <div className="p-4 bg-zinc-950/40 border-b border-zinc-800/80">
          <form onSubmit={handleRunAudit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 focus-within:border-indigo-500 transition-all">
              <Globe className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
              <input
                type="text"
                value={baseURL}
                onChange={(e) => setBaseURL(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
                <span className="text-xs text-zinc-400 mr-2 whitespace-nowrap">Max Pages:</span>
                <select
                  value={maxPages}
                  onChange={(e) => setMaxPages(Number(e.target.value))}
                  className="bg-transparent text-xs text-zinc-200 font-mono focus:outline-none cursor-pointer"
                >
                  <option value={10}>10 pages</option>
                  <option value={15}>15 pages</option>
                  <option value={25}>25 pages</option>
                  <option value={50}>50 pages</option>
                  <option value={100}>100 pages</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !baseURL.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Crawling...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Start Audit</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Audit Report View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {report ? (
            <>
              {/* Summary Stats Header */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Health Score</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span
                      className={`text-2xl font-black font-mono ${
                        report.healthScore >= 80
                          ? 'text-emerald-400'
                          : report.healthScore >= 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {report.healthScore}/100
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">{report.totalPagesCrawled} Pages</span>
                  </div>
                </div>

                <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total Issues</span>
                  <div className="text-2xl font-extrabold text-zinc-100 font-mono mt-1">
                    {report.summary.totalIssues}
                  </div>
                </div>

                <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-rose-400/80 tracking-wider flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> High Impact
                  </span>
                  <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1">
                    {report.summary.highImpactCount}
                  </div>
                </div>

                <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-amber-400/80 tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Medium Impact
                  </span>
                  <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                    {report.summary.mediumImpactCount}
                  </div>
                </div>

                <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-xl col-span-2 md:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-sky-400/80 tracking-wider flex items-center gap-1">
                    <Info className="w-3 h-3" /> Low Impact
                  </span>
                  <div className="text-2xl font-extrabold text-sky-400 font-mono mt-1">
                    {report.summary.lowImpactCount}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800/80">
                  <button
                    onClick={() => setActiveTab('issues')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'issues'
                        ? 'bg-indigo-600 text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Technical Issues ({report.summary.totalIssues})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('pages')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'pages'
                        ? 'bg-indigo-600 text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Crawled Pages ({report.pages.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('script')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'script'
                        ? 'bg-indigo-600 text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Standalone CLI Script</span>
                  </button>
                </div>

                {/* Export Button */}
                <button
                  onClick={handleDownloadJson}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold border border-zinc-700 transition-all flex items-center gap-1.5"
                >
                  <FileJson className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export JSON Report</span>
                </button>
              </div>

              {/* TAB 1: Issues Prioritized by Impact */}
              {activeTab === 'issues' && (
                <div className="space-y-4">
                  {/* Filter Sub-Bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Filter by Impact:</span>
                    {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setImpactFilter(lvl)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                          impactFilter === lvl
                            ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  {/* Issues List */}
                  {report.pages.flatMap((p) => p.issues).length === 0 ? (
                    <div className="p-8 text-center bg-zinc-950/60 rounded-2xl border border-zinc-800">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-zinc-200">No Technical Issues Flagged!</h4>
                      <p className="text-xs text-zinc-400 mt-1">All crawled pages passed title, H1, meta description, and status checks cleanly.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {report.pages
                        .flatMap((p) => p.issues)
                        .filter((i) => impactFilter === 'ALL' || i.impact === impactFilter)
                        .map((iss, idx) => (
                          <div
                            key={`iss_${idx}`}
                            className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700 transition-all"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {getImpactBadge(iss.impact)}
                                <span className="text-xs font-bold text-zinc-100">{iss.title}</span>
                              </div>
                              <p className="text-xs text-zinc-400">{iss.description}</p>
                              {iss.details && (
                                <p className="text-[11px] text-zinc-500 font-mono bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
                                  {iss.details}
                                </p>
                              )}
                            </div>
                            <a
                              href={iss.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0 bg-indigo-500/10 px-2.5 py-1.5 rounded-lg border border-indigo-500/20"
                            >
                              <span className="truncate max-w-[200px]">{iss.url}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Crawled Pages Details */}
              {activeTab === 'pages' && (
                <div className="overflow-x-auto border border-zinc-800 rounded-xl">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800 font-mono">
                      <tr>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Page URL</th>
                        <th className="py-3 px-4">Title Tag</th>
                        <th className="py-3 px-4">H1 Heading</th>
                        <th className="py-3 px-4">Missing Alt</th>
                        <th className="py-3 px-4">Links</th>
                        <th className="py-3 px-4">Issues</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono">
                      {report.pages.map((p, idx) => (
                        <tr key={`p_${idx}`} className="hover:bg-zinc-800/30">
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.statusCode >= 200 && p.statusCode < 300
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {p.statusCode || '404/ERR'}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-[220px] truncate" title={p.url}>
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <span className="truncate">{p.url}</span>
                            </a>
                          </td>
                          <td className="py-3 px-4 max-w-[180px] truncate" title={p.title || 'Missing Title'}>
                            {p.title ? (
                              <span className="text-zinc-200">{p.title}</span>
                            ) : (
                              <span className="text-rose-400 font-bold">Missing</span>
                            )}
                          </td>
                          <td className="py-3 px-4 max-w-[160px] truncate">
                            {p.h1s.length > 0 ? (
                              <span className="text-zinc-300">{p.h1s[0]}</span>
                            ) : (
                              <span className="text-rose-400 font-bold">None</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {p.imagesMissingAlt.length > 0 ? (
                              <span className="text-amber-400 font-bold flex items-center gap-1">
                                <Image className="w-3 h-3" /> {p.imagesMissingAlt.length}/{p.imagesTotal}
                              </span>
                            ) : (
                              <span className="text-zinc-500">0</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Link2 className="w-3 h-3 text-indigo-400" />
                              {p.internalLinks.length} int / {p.externalLinks.length} ext
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 font-bold">
                              {p.issues.length}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 3: Standalone CLI Script Code */}
              {activeTab === 'script' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">Standalone Node.js Crawler Script</h4>
                      <p className="text-[11px] text-zinc-400">Run directly from CLI: <code className="text-emerald-400 font-mono">node scripts/seo-crawler.js https://example.com 20</code></p>
                    </div>
                    <button
                      onClick={copyScriptToClipboard}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? 'Copied!' : 'Copy Script Code'}</span>
                    </button>
                  </div>

                  <pre className="p-4 bg-zinc-950 border border-zinc-800/90 rounded-xl text-[11px] text-emerald-400 font-mono overflow-x-auto max-h-[350px]">
                    {standaloneScriptCode}
                  </pre>
                </div>
              )}
            </>
          ) : (
            /* Cold State / Welcome Banner */
            <div className="text-center py-12 px-4 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl">
              <Search className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-80" />
              <h4 className="text-base font-bold text-zinc-100">Ready to Crawl &amp; Audit Any Domain</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-6">
                Enter a starting domain URL above and click <strong>Start Audit</strong>. The crawler will stay strictly within domain boundaries, extract technical SEO tags, check status codes, detect image alt gaps, and group findings by severity.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left">
                <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl">
                  <span className="block text-xs font-bold text-rose-400 mb-1">🔴 High Impact</span>
                  <p className="text-[11px] text-zinc-400">404 broken pages, missing title tags, duplicate H1s, and noindex flags.</p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl">
                  <span className="block text-xs font-bold text-amber-400 mb-1">🟡 Medium Impact</span>
                  <p className="text-[11px] text-zinc-400">Missing meta descriptions, images missing alt text, and slow page responses.</p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl">
                  <span className="block text-xs font-bold text-sky-400 mb-1">🔵 Low Impact</span>
                  <p className="text-[11px] text-zinc-400">Overly long title tags, short meta descriptions, and excessive link density.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
