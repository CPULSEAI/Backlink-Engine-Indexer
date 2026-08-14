import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Share2,
  Brain,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  FileCode,
  Copy,
  Check,
  Search,
} from 'lucide-react';
import { SubmissionHistoryItem } from '../types';
import toast from 'react-hot-toast';

interface ReportsExportCenterProps {
  history: SubmissionHistoryItem[];
  onExportCsv: (submissionId?: string) => void;
}

export const ReportsExportCenter: React.FC<ReportsExportCenterProps> = ({
  history,
  onExportCsv,
}) => {
  const [selectedReportType, setSelectedReportType] = useState<'campaign' | 'geo' | 'competitor' | 'conversion'>('campaign');
  const [dateFilter, setDateFilter] = useState<'ALL' | '7D' | '30D' | '90D'>('30D');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mockExecutiveReports = [
    {
      id: 'rep_01',
      title: 'Q3 Enterprise GEO Indexing & AI Citation Audit',
      target: 'careerpulseai.net / product-suite',
      date: '2025-08-14',
      status: 'EXCELLENT',
      score: 94,
      urlsCount: 148,
      verifiedPct: 98.6,
      summary: '148 URLs broadcasted to Google Indexing API & IndexNow. All 148 pages successfully returned confirmed entity graphs and structured FAQ schema markup for ChatGPT and Perplexity citation discovery.',
    },
    {
      id: 'rep_02',
      title: 'Competitor Gap & Citation Benchmark Report',
      target: 'careerpulseai.net vs. jobhop.ai & resumerocket.io',
      date: '2025-08-10',
      status: 'GOOD',
      score: 88,
      urlsCount: 45,
      verifiedPct: 95.5,
      summary: 'Identified 32 high-intent semantic keyword gaps. Our authority signals lead in 7 out of 9 core categories.',
    },
    {
      id: 'rep_03',
      title: 'CRO Conversion & UX Friction Audit Package',
      target: 'careerpulseai.net/pricing',
      date: '2025-08-04',
      status: 'NEEDS_ATTENTION',
      score: 76,
      urlsCount: 1,
      verifiedPct: 100,
      summary: 'Found primary CTA button below fold on mobile screen sizes. Fixing CTA hierarchy projects an estimated +18% organic visitor signup lift.',
    },
  ];

  const handleDownloadJsonReport = (report: any) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${report.title.replace(/\s+/g, '_')}_Audit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('JSON Audit Package downloaded successfully!');
  };

  const handleCopyLink = (id: string) => {
    setCopiedId(id);
    navigator.clipboard.writeText(`https://app.indexerengine.pro/reports/share/${id}`);
    toast.success('Secure report share link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-mono-brutal">
      {/* Top Banner */}
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#222] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-black text-[#ff4d00] dark:bg-zinc-800 dark:text-cyan-400 border-2 border-black dark:border-zinc-600 rounded-xl flex items-center justify-center font-display font-black text-2xl shadow-[3px_3px_0_#000]">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase text-black dark:text-zinc-100">
              Executive Reports &amp; Export Center
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-sans">
              Generate audit packages, CSV spreadsheets, JSON schemas, and plain-English executive summaries for clients and leadership.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onExportCsv()}
            className="px-4 py-2 bg-[#ff4d00] hover:bg-black text-black hover:text-white font-bold uppercase text-xs rounded-lg border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export All to CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-4 rounded-xl shadow-[4px_4px_0_#000] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'campaign', label: 'Campaign Performance' },
            { id: 'geo', label: 'GEO Content Audits' },
            { id: 'competitor', label: 'Competitor Intelligence' },
            { id: 'conversion', label: 'Conversion & CRO' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedReportType(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold uppercase cursor-pointer whitespace-nowrap transition-all ${
                selectedReportType === cat.id
                  ? 'bg-black text-white dark:bg-zinc-800 dark:text-cyan-400 border-black dark:border-zinc-600 shadow-[2px_2px_0_#ff4d00]'
                  : 'bg-zinc-100 dark:bg-zinc-950 text-black dark:text-zinc-300 border-zinc-300 dark:border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#f8f6f0] dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 rounded-lg text-xs font-mono-brutal"
            />
          </div>

          <div className="flex items-center bg-zinc-100 dark:bg-zinc-950 p-1 border-2 border-black dark:border-zinc-700 rounded-lg text-xs font-bold">
            {['7D', '30D', '90D', 'ALL'].map((range) => (
              <button
                key={range}
                onClick={() => setDateFilter(range as any)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  dateFilter === range ? 'bg-black text-white' : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {mockExecutiveReports.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[4px_4px_0_#000] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black/20 dark:border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100">
                    {report.title}
                  </h3>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                      report.status === 'EXCELLENT'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                        : report.status === 'GOOD'
                        ? 'bg-cyan-100 text-cyan-800 border border-cyan-400'
                        : 'bg-amber-100 text-amber-800 border border-amber-400'
                    }`}
                  >
                    {report.status} • {report.score}/100
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Target: <span className="font-bold text-black dark:text-zinc-200">{report.target}</span> • Generated {report.date}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadJsonReport(report)}
                  className="px-3 py-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-600 rounded-lg text-xs font-bold uppercase shadow-[2px_2px_0_#000] flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>JSON Package</span>
                </button>

                <button
                  onClick={() => onExportCsv()}
                  className="px-3 py-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-600 rounded-lg text-xs font-bold uppercase shadow-[2px_2px_0_#000] flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>

                <button
                  onClick={() => handleCopyLink(report.id)}
                  className="px-3 py-1.5 bg-black hover:bg-[#ff4d00] text-white hover:text-black border-2 border-black rounded-lg text-xs font-bold uppercase shadow-[2px_2px_0_#000] flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {copiedId === report.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedId === report.id ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Plain English Summary Box */}
            <div className="p-4 bg-[#f8f6f0] dark:bg-zinc-950 border-2 border-black/20 dark:border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#ff4d00] uppercase">
                <Brain className="w-4 h-4" />
                <span>Plain-English Executive Digest:</span>
              </div>
              <p className="text-xs text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed">
                {report.summary}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Total URLs Analyzed</div>
                <div className="text-base font-black text-black dark:text-zinc-100">{report.urlsCount}</div>
              </div>

              <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Live Verification Rate</div>
                <div className="text-base font-black text-emerald-600">{report.verifiedPct}%</div>
              </div>

              <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-bold">GEO Citation Score</div>
                <div className="text-base font-black text-black dark:text-zinc-100">{report.score}/100</div>
              </div>

              <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Audit Standard</div>
                <div className="text-base font-black text-zinc-800 dark:text-zinc-200">ISO/SOC-2</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
