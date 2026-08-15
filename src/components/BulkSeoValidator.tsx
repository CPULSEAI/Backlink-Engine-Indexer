import React, { useState, useMemo } from 'react';
import axios from 'axios';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Download,
  Copy,
  ExternalLink,
  Layers,
  FileCode,
  Heading1,
  Heading2,
  Eye,
  RefreshCw,
  UploadCloud,
  FileText,
  Filter,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Info,
  Check,
} from 'lucide-react';
import { BulkUrlValidationResult, BulkValidationSummary, BulkHeadingItem } from '../types';

interface BulkSeoValidatorProps {
  initialUrls?: string[];
  onSelectUrlForBacklinkJob?: (url: string) => void;
}

const SAMPLE_50_URLS = [
  'https://careerpulseai.net',
  'https://careerpulseai.net/features',
  'https://careerpulseai.net/pricing',
  'https://careerpulseai.net/blog',
  'https://careerpulseai.net/blog/seo-backlink-indexing-guide',
  'https://careerpulseai.net/blog/automated-google-search-console-indexing',
  'https://careerpulseai.net/docs/api-reference',
  'https://careerpulseai.net/case-studies',
  'https://careerpulseai.net/about-us',
  'https://careerpulseai.net/contact',
  'https://github.com',
  'https://en.wikipedia.org/wiki/Search_engine_optimization',
  'https://en.wikipedia.org/wiki/Canonical_link_element',
  'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta',
  'https://schema.org/FAQPage',
  'https://schema.org/Article',
  'https://schema.org/Organization',
  'https://developers.google.com/search/docs/crawling-indexing/canonicalization',
  'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
  'https://news.ycombinator.com',
  'https://techcrunch.com',
  'https://searchengineland.com',
  'https://searchenginejournal.com',
  'https://ahrefs.com/blog',
  'https://moz.com/blog',
  'https://semrush.com/blog',
  'https://backlinko.com/seo-audit',
  'https://developers.google.com/search/blog',
  'https://httpbin.org/status/200',
  'https://httpbin.org/status/301',
  'https://httpbin.org/status/404',
  'https://httpbin.org/status/503',
  'https://example.com',
  'https://iana.org',
  'https://w3.org',
  'https://w3.org/WAI',
  'https://web.dev/explore/fast',
  'https://developer.chrome.com',
  'https://wordpress.org',
  'https://react.dev',
  'https://nodejs.org',
  'https://typescriptlang.org',
  'https://tailwindcss.com',
  'https://vitejs.dev',
  'https://expressjs.com',
  'https://npmjs.com',
  'https://pypi.org',
  'https://deno.com',
  'https://bun.sh',
  'https://cloudflare.com',
  'https://vercel.com',
  'https://netlify.com',
];

export const BulkSeoValidator: React.FC<BulkSeoValidatorProps> = ({
  initialUrls = [],
  onSelectUrlForBacklinkJob,
}) => {
  const [urlInputText, setUrlInputText] = useState<string>(
    initialUrls.length > 0 ? initialUrls.join('\n') : ''
  );
  const [concurrency, setConcurrency] = useState<number>(8);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [results, setResults] = useState<BulkUrlValidationResult[]>([]);
  const [summary, setSummary] = useState<BulkValidationSummary | null>(null);
  const [selectedResult, setSelectedResult] = useState<BulkUrlValidationResult | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ISSUES' | 'CANONICAL' | 'META' | 'HEADINGS' | 'HTTP_ERRORS' | 'PASSED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'time_desc' | 'issues_desc'>('score_asc');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [validationProgress, setValidationProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

  const inputUrlCount = useMemo(() => {
    return urlInputText
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0 && !u.startsWith('#')).length;
  }, [urlInputText]);

  // Load 50+ Sample URLs
  const handleLoadSampleUrls = () => {
    setUrlInputText(SAMPLE_50_URLS.join('\n'));
  };

  // Handle File Upload (.txt or .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        // Extract URLs from text/csv
        const lines = content
          .split(/[\r\n,]+/)
          .map(l => l.trim().replace(/^["']|["']$/g, ''))
          .filter(l => l.startsWith('http://') || l.startsWith('https://') || (l.includes('.') && !l.includes(' ')));
        setUrlInputText(lines.join('\n'));
      }
    };
    reader.readAsText(file);
  };

  // Run Bulk Validation
  const handleRunValidation = async () => {
    const rawUrls = urlInputText
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0 && !u.startsWith('#'));

    if (rawUrls.length === 0) return;

    setIsValidating(true);
    setSelectedResult(null);
    setValidationProgress({ current: 0, total: rawUrls.length });

    try {
      const response = await axios.post('/api/seo-validator/bulk', {
        urls: rawUrls,
        concurrencyLimit: concurrency,
      });

      if (response.data?.success) {
        setResults(response.data.results || []);
        setSummary(response.data.summary || null);
        if (response.data.results?.length > 0) {
          setSelectedResult(response.data.results[0]);
        }
      }
    } catch (err: any) {
      console.error('Bulk SEO validation failed:', err);
    } finally {
      setIsValidating(false);
    }
  };

  // Filter and sort results
  const filteredResults = useMemo(() => {
    return results.filter((item) => {
      const matchesSearch =
        item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.canonicalUrl && item.canonicalUrl.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      switch (activeFilter) {
        case 'ISSUES':
          return item.issues.length > 0 || item.overallScore < 80;
        case 'CANONICAL':
          return item.canonicalStatus !== 'valid_match' && item.canonicalStatus !== 'self_referencing';
        case 'META':
          return item.metaDescriptionStatus !== 'optimal';
        case 'HEADINGS':
          return item.hierarchyStatus !== 'valid';
        case 'HTTP_ERRORS':
          return item.statusCode >= 400 || item.statusCode === 0;
        case 'PASSED':
          return item.overallScore >= 80 && item.issues.length === 0;
        default:
          return true;
      }
    }).sort((a, b) => {
      if (sortBy === 'score_asc') return a.overallScore - b.overallScore;
      if (sortBy === 'score_desc') return b.overallScore - a.overallScore;
      if (sortBy === 'time_desc') return b.responseTimeMs - a.responseTimeMs;
      if (sortBy === 'issues_desc') return b.issues.length - a.issues.length;
      return 0;
    });
  }, [results, activeFilter, searchQuery, sortBy]);

  // Export CSV
  const handleExportCsv = () => {
    if (results.length === 0) return;

    const headers = [
      'URL',
      'Status Code',
      'Overall Health Score',
      'Canonical Status',
      'Canonical URL',
      'Meta Description Status',
      'Meta Description Length',
      'H1 Count',
      'H2 Count',
      'Heading Hierarchy Status',
      'Response Time (ms)',
      'Total Issues Count',
    ];

    const rows = results.map(r => [
      `"${r.url.replace(/"/g, '""')}"`,
      r.statusCode,
      r.overallScore,
      `"${r.canonicalStatus}"`,
      `"${(r.canonicalUrl || '').replace(/"/g, '""')}"`,
      `"${r.metaDescriptionStatus}"`,
      r.metaDescriptionLength,
      r.h1Count,
      r.h2Count,
      `"${r.hierarchyStatus}"`,
      r.responseTimeMs,
      r.issues.length,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bulk_seo_validation_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJson = () => {
    if (results.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ summary, results }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bulk_seo_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copy Executive Report
  const handleCopySummary = () => {
    if (!summary) return;
    const text = `=== BULK SEO URL VALIDATION EXECUTIVE SUMMARY ===
Generated: ${new Date().toLocaleString()}
Total URLs Validated: ${summary.totalUrls}
Average Health Score: ${summary.healthScore}/100
Average Response Latency: ${summary.avgResponseTimeMs}ms

--- BREAKDOWN OF ISSUES ---
• Canonical Tag Errors: ${summary.canonicalIssuesCount} URLs (${Math.round((summary.canonicalIssuesCount / summary.totalUrls) * 100)}%)
• Missing / Suboptimal Meta Descriptions: ${summary.missingMetaCount} URLs (${Math.round((summary.missingMetaCount / summary.totalUrls) * 100)}%)
• H1/H2 Heading Hierarchy Defects: ${summary.headingHierarchyIssuesCount} URLs (${Math.round((summary.headingHierarchyIssuesCount / summary.totalUrls) * 100)}%)
• HTTP Status Errors (4xx/5xx): ${summary.httpErrorsCount} URLs
• Fully Passed Pages (80%+ Score): ${summary.passedCount} URLs

Audited via Apex Bulk SEO Engine.`;

    navigator.clipboard.writeText(text);
    setCopiedNotification('Executive summary copied to clipboard!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border-2 border-black rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-[#ff4d00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#ff4d00]/10 border border-[#ff4d00]/30 text-[#ff4d00] text-xs font-mono font-bold tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5" />
              <span>Parallel Multi-Page Crawler</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">
              Bulk SEO URL Validator &amp; Hierarchy Grader
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Validate 50+ URLs simultaneously for <strong className="text-zinc-200">canonical tag mismatches</strong>, <strong className="text-zinc-200">missing meta descriptions</strong>, and <strong className="text-zinc-200">H1/H2 header hierarchy integrity</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleLoadSampleUrls}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold transition-all shadow-sm flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#ff4d00]" />
              <span>Load 50+ Demo URLs</span>
            </button>
          </div>
        </div>
      </div>

      {/* INPUT & CONFIGURATION CARD */}
      <div className="bg-zinc-900 border-2 border-black rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#ff4d00]" />
            <h2 className="text-base font-bold text-zinc-100">Target URLs to Validate ({inputUrlCount})</h2>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <label className="text-zinc-400 font-medium">Parallel Concurrency:</label>
            <select
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-200 font-mono font-bold focus:outline-none focus:border-[#ff4d00]"
            >
              <option value={3}>3 Workers (Safe)</option>
              <option value={5}>5 Workers (Fast)</option>
              <option value={8}>8 Workers (Turbo)</option>
              <option value={12}>12 Workers (Enterprise)</option>
              <option value={15}>15 Workers (Max Parallel)</option>
            </select>

            <label className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold cursor-pointer transition-all flex items-center space-x-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-zinc-400" />
              <span>Upload CSV/TXT</span>
              <input type="file" accept=".txt,.csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={urlInputText}
            onChange={(e) => setUrlInputText(e.target.value)}
            placeholder="Enter one URL per line (e.g. https://careerpulseai.net/features, https://careerpulseai.net/pricing)..."
            rows={5}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] transition-all resize-y"
          />
          <div className="absolute right-3 bottom-3 text-[11px] font-mono text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded-md">
            {inputUrlCount} URLs detected
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-zinc-400 flex items-center space-x-2">
            <Info className="w-4 h-4 text-zinc-500 shrink-0" />
            <span>Checks: Canonical tags, Meta-description length (120-160c), H1/H2 nesting, HTTP latency &amp; status.</span>
          </div>

          <button
            type="button"
            onClick={handleRunValidation}
            disabled={isValidating || inputUrlCount === 0}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm tracking-wide uppercase flex items-center justify-center space-x-2 shadow-xl cursor-pointer transition-all active:scale-95 border-2 border-black ${
              isValidating || inputUrlCount === 0
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-[#ff4d00] hover:bg-black hover:text-[#ff4d00] text-black shadow-[#ff4d00]/20'
            }`}
          >
            {isValidating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-current" />
                <span>Running Parallel Check ({concurrency}x)...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Run Parallel SEO Check ({inputUrlCount} URLs)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* COPIED ALERT NOTIFICATION */}
      {copiedNotification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-mono font-bold flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* SUMMARY KPI METRICS BLOCK */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total & Health Score */}
          <div className="bg-zinc-900 border-2 border-black rounded-2xl p-4 shadow-md space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Avg Health Score</div>
            <div className="flex items-baseline space-x-1.5">
              <span className={`text-2xl font-black ${
                summary.healthScore >= 80 ? 'text-emerald-400' : summary.healthScore >= 50 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {summary.healthScore}
              </span>
              <span className="text-xs text-zinc-500">/ 100</span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">{summary.completedUrls} URLs checked</div>
          </div>

          {/* Canonical Issues */}
          <div
            onClick={() => setActiveFilter('CANONICAL')}
            className={`bg-zinc-900 border-2 border-black rounded-2xl p-4 shadow-md space-y-1 cursor-pointer transition-all hover:border-[#ff4d00] ${
              activeFilter === 'CANONICAL' ? 'ring-2 ring-[#ff4d00]' : ''
            }`}
          >
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Canonical Issues</div>
            <div className={`text-2xl font-black ${summary.canonicalIssuesCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {summary.canonicalIssuesCount}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">Missing / Mismatch</div>
          </div>

          {/* Meta Description Issues */}
          <div
            onClick={() => setActiveFilter('META')}
            className={`bg-zinc-900 border-2 border-black rounded-2xl p-4 shadow-md space-y-1 cursor-pointer transition-all hover:border-[#ff4d00] ${
              activeFilter === 'META' ? 'ring-2 ring-[#ff4d00]' : ''
            }`}
          >
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Meta Issues</div>
            <div className={`text-2xl font-black ${summary.missingMetaCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {summary.missingMetaCount}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">Missing / Bad Length</div>
          </div>

          {/* Headings Hierarchy Issues */}
          <div
            onClick={() => setActiveFilter('HEADINGS')}
            className={`bg-zinc-900 border-2 border-black rounded-2xl p-4 shadow-md space-y-1 cursor-pointer transition-all hover:border-[#ff4d00] ${
              activeFilter === 'HEADINGS' ? 'ring-2 ring-[#ff4d00]' : ''
            }`}
          >
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">H1/H2 Hierarchy</div>
            <div className={`text-2xl font-black ${summary.headingHierarchyIssuesCount > 0 ? 'text-purple-400' : 'text-emerald-400'}`}>
              {summary.headingHierarchyIssuesCount}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">No H1 / Multi H1</div>
          </div>

          {/* HTTP Errors */}
          <div
            onClick={() => setActiveFilter('HTTP_ERRORS')}
            className={`bg-zinc-900 border-2 border-black rounded-2xl p-4 shadow-md space-y-1 cursor-pointer transition-all hover:border-[#ff4d00] ${
              activeFilter === 'HTTP_ERRORS' ? 'ring-2 ring-[#ff4d00]' : ''
            }`}
          >
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">HTTP Failures</div>
            <div className={`text-2xl font-black ${summary.httpErrorsCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {summary.httpErrorsCount}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">4xx / 5xx / Timeouts</div>
          </div>

          {/* Avg Response Time */}
          <div className="bg-zinc-900 border-2 border-black rounded-2xl p-4 shadow-md space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Avg Latency</div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-blue-400">{summary.avgResponseTimeMs}</span>
              <span className="text-xs text-zinc-500">ms</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">{summary.passedCount} Passed (80%+)</div>
          </div>
        </div>
      )}

      {/* RESULTS LISTING & DRILLDOWN EXPLORER */}
      {results.length > 0 && (
        <div className="space-y-4">
          {/* TOOLBAR CONTROLS */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm">
            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 lg:pb-0 text-xs font-bold">
              {[
                { id: 'ALL', label: `All (${results.length})` },
                { id: 'ISSUES', label: `Issues Only (${summary?.totalUrls ? summary.totalUrls - (summary.passedCount || 0) : 0})` },
                { id: 'CANONICAL', label: `Canonical (${summary?.canonicalIssuesCount || 0})` },
                { id: 'META', label: `Meta Descriptions (${summary?.missingMetaCount || 0})` },
                { id: 'HEADINGS', label: `Headings (${summary?.headingHierarchyIssuesCount || 0})` },
                { id: 'HTTP_ERRORS', label: `HTTP Errors (${summary?.httpErrorsCount || 0})` },
                { id: 'PASSED', label: `Passed (${summary?.passedCount || 0})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-[#ff4d00] text-black shadow-sm font-black'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search, Sort & Export Actions */}
            <div className="flex items-center space-x-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search URL or title..."
                  className="bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#ff4d00]"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-zinc-300 font-mono text-xs focus:outline-none focus:border-[#ff4d00]"
              >
                <option value="score_asc">Score (Lowest First)</option>
                <option value="score_desc">Score (Highest First)</option>
                <option value="issues_desc">Most Issues</option>
                <option value="time_desc">Slowest Latency</option>
              </select>

              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold transition-all flex items-center space-x-1 cursor-pointer"
                title="Copy Executive Summary to Clipboard"
              >
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Summary</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold transition-all flex items-center space-x-1 cursor-pointer"
                title="Export CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 font-bold transition-all flex items-center space-x-1 cursor-pointer"
                title="Export JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* TWO COLUMN VIEW: LIST + DETAILED INSPECTION DRAWER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT: RESULTS TABLE LIST (7 cols on lg) */}
            <div className="lg:col-span-7 bg-zinc-900 border-2 border-black rounded-3xl p-4 shadow-xl space-y-2 max-h-[750px] overflow-y-auto custom-scrollbar">
              <div className="text-xs text-zinc-400 font-mono px-2 py-1 flex justify-between">
                <span>Showing {filteredResults.length} of {results.length} URLs</span>
                <span>Click entry to inspect DOM tags</span>
              </div>

              {filteredResults.map((item, idx) => {
                const isSelected = selectedResult?.url === item.url;
                return (
                  <div
                    key={`${item.url}_${idx}`}
                    onClick={() => setSelectedResult(item)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-zinc-950 border-[#ff4d00] shadow-md ring-1 ring-[#ff4d00]/50'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950'
                    }`}
                  >
                    {/* Header line: Status code + URL + Score */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                          item.statusCode === 200
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : item.statusCode >= 300 && item.statusCode < 400
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                          {item.statusCode || 'ERR'}
                        </span>
                        <span className="text-xs font-mono font-bold text-zinc-200 truncate" title={item.url}>
                          {item.url}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black ${
                          item.overallScore >= 80
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : item.overallScore >= 50
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                          {item.overallScore} pts
                        </span>
                      </div>
                    </div>

                    {/* Meta/Canonical/Headings Diagnostic Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                      {/* Canonical Badge */}
                      <span className={`px-2 py-0.5 rounded-md flex items-center space-x-1 ${
                        item.canonicalStatus === 'valid_match' || item.canonicalStatus === 'self_referencing'
                          ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        <span>Canonical:</span>
                        <strong className="capitalize">{item.canonicalStatus.replace('_', ' ')}</strong>
                      </span>

                      {/* Meta Description Badge */}
                      <span className={`px-2 py-0.5 rounded-md flex items-center space-x-1 ${
                        item.metaDescriptionStatus === 'optimal'
                          ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/20'
                          : item.metaDescriptionStatus === 'missing'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        <span>Meta:</span>
                        <strong className="capitalize">{item.metaDescriptionStatus.replace('_', ' ')}</strong>
                        {item.metaDescriptionLength > 0 && <span className="opacity-70">({item.metaDescriptionLength}c)</span>}
                      </span>

                      {/* Heading Hierarchy Badge */}
                      <span className={`px-2 py-0.5 rounded-md flex items-center space-x-1 ${
                        item.hierarchyStatus === 'valid'
                          ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                      }`}>
                        <span>Headings:</span>
                        <strong>{item.h1Count}x H1, {item.h2Count}x H2</strong>
                      </span>

                      {/* Latency badge */}
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800 ml-auto">
                        {item.responseTimeMs}ms
                      </span>
                    </div>

                    {/* Issues summary if any */}
                    {item.issues.length > 0 && (
                      <div className="text-[11px] text-red-400/90 flex items-center space-x-1.5 truncate">
                        <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                        <span className="truncate">{item.issues[0].message}</span>
                        {item.issues.length > 1 && (
                          <span className="text-zinc-500 text-[10px] shrink-0 font-mono">
                            (+{item.issues.length - 1} more)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredResults.length === 0 && (
                <div className="p-8 text-center text-zinc-500 text-xs font-mono">
                  No URLs match the selected filter criteria.
                </div>
              )}
            </div>

            {/* RIGHT: INSPECTION DETAIL CARD (5 cols on lg) */}
            <div className="lg:col-span-5 bg-zinc-900 border-2 border-black rounded-3xl p-6 shadow-xl space-y-6 sticky top-6">
              {selectedResult ? (
                <div className="space-y-6">
                  {/* Inspection Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#ff4d00] font-bold">
                        Detailed Tag Audit
                      </span>
                      <h3 className="text-sm font-bold text-zinc-100 font-mono truncate" title={selectedResult.url}>
                        {selectedResult.url}
                      </h3>
                      <div className="text-xs text-zinc-400 line-clamp-1">
                        {selectedResult.title || 'Untitled Web Document'}
                      </div>
                    </div>

                    <a
                      href={selectedResult.normalizedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all shrink-0"
                      title="Open URL in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Issues List */}
                  {selectedResult.issues.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Actionable Issues ({selectedResult.issues.length})</span>
                      </label>
                      <div className="space-y-1.5">
                        {selectedResult.issues.map((iss, i) => (
                          <div
                            key={i}
                            className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                              iss.severity === 'error'
                                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                                : iss.severity === 'warning'
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                            }`}
                          >
                            <span className="font-mono font-bold uppercase text-[10px] mr-1.5 opacity-80">
                              [{iss.type}]
                            </span>
                            {iss.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Canonical Tag Details */}
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-300 flex items-center space-x-1.5">
                        <FileCode className="w-3.5 h-3.5 text-[#ff4d00]" />
                        <span>Canonical Link Tag</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        selectedResult.canonicalStatus === 'self_referencing' || selectedResult.canonicalStatus === 'valid_match'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {selectedResult.canonicalStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="p-2.5 bg-zinc-900/80 rounded-xl font-mono text-xs text-zinc-300 break-all">
                      {selectedResult.canonicalUrl ? (
                        <code>&lt;link rel="canonical" href="{selectedResult.canonicalUrl}" /&gt;</code>
                      ) : (
                        <span className="text-red-400 italic">No canonical tag declared in &lt;head&gt;</span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {selectedResult.canonicalDetails}
                    </div>
                  </div>

                  {/* Meta Description Details */}
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-300 flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>Meta Description</span>
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {selectedResult.metaDescriptionLength} / 160 chars
                      </span>
                    </div>

                    <div className="p-2.5 bg-zinc-900/80 rounded-xl text-xs text-zinc-300 leading-relaxed font-sans">
                      {selectedResult.metaDescription ? (
                        <span>"{selectedResult.metaDescription}"</span>
                      ) : (
                        <span className="text-red-400 italic font-mono text-xs">Missing &lt;meta name="description"&gt;</span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {selectedResult.metaDescriptionDetails}
                    </div>
                  </div>

                  {/* Heading Hierarchy Tree (H1/H2 Outline) */}
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-300 flex items-center space-x-1.5">
                        <Heading1 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Heading Hierarchy Tree ({selectedResult.headingHierarchy.length})</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {selectedResult.h1Count}x H1 &bull; {selectedResult.h2Count}x H2
                      </span>
                    </div>

                    {selectedResult.headingHierarchy.length > 0 ? (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar p-1">
                        {selectedResult.headingHierarchy.map((h, hIdx) => {
                          const level = parseInt(h.tag.replace('h', ''), 10);
                          return (
                            <div
                              key={hIdx}
                              className={`flex items-start space-x-2 text-xs font-mono ${
                                level === 1
                                  ? 'text-purple-300 font-bold pl-0'
                                  : level === 2
                                  ? 'text-zinc-300 pl-3'
                                  : 'text-zinc-400 pl-6 text-[11px]'
                              }`}
                            >
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-black uppercase shrink-0 ${
                                level === 1
                                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                                  : level === 2
                                  ? 'bg-zinc-800 text-zinc-300'
                                  : 'bg-zinc-900 text-zinc-500'
                              }`}>
                                {h.tag}
                              </span>
                              <span className="line-clamp-2 leading-relaxed">{h.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-zinc-500 font-mono italic">
                        No H1-H6 headings found in document.
                      </div>
                    )}
                  </div>

                  {/* Action shortcut to launch backlink submission job */}
                  {onSelectUrlForBacklinkJob && (
                    <button
                      type="button"
                      onClick={() => onSelectUrlForBacklinkJob(selectedResult.url)}
                      className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-[#ff4d00] hover:text-black text-zinc-200 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Send this URL to Backlink Indexer</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-16 text-center text-zinc-500 text-xs font-mono space-y-2">
                  <Eye className="w-8 h-8 mx-auto opacity-40 text-zinc-400" />
                  <p>Select any URL from the table on the left to inspect its canonical tags, meta description, and heading hierarchy.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
