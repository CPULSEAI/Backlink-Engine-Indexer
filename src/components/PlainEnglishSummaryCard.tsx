import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { ExecutiveSummaryReport } from '../types';
import toast from 'react-hot-toast';

interface PlainEnglishSummaryCardProps {
  report: ExecutiveSummaryReport;
  collapsible?: boolean;
  compact?: boolean;
}

export const PlainEnglishSummaryCard: React.FC<PlainEnglishSummaryCardProps> = ({
  report,
  collapsible = false,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'EXCELLENT':
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          label: 'OPTIMAL OUTCOME',
          icon: CheckCircle2,
        };
      case 'GOOD':
      case 'OPERATIONAL':
        return {
          bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
          label: 'SUCCESSFUL / HEALTHY',
          icon: Sparkles,
        };
      case 'NEEDS_ATTENTION':
      case 'DEGRADED':
        return {
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          label: 'ACTION REQUIRED',
          icon: AlertTriangle,
        };
      case 'CRITICAL':
      case 'OUTAGE':
      default:
        return {
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
          label: 'ATTENTION NEEDED',
          icon: ShieldAlert,
        };
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-500 text-white font-bold';
      case 'HIGH':
        return 'bg-[#ff4d00] text-black font-bold';
      case 'MEDIUM':
        return 'bg-amber-500 text-black font-bold';
      case 'LOW':
      default:
        return 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200';
    }
  };

  const badge = getStatusBadge(report?.overallStatus);
  const StatusIcon = badge.icon;

  const targetName = report?.target || 'SEO & GEO Indexing Platform';
  const reportTime = report?.timestamp ? new Date(report.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
  const whatWasDiscovered = report?.whatWasDiscovered || [];
  const whatToDoNext = report?.whatToDoNext || [];
  const opportunities = report?.businessImpact?.opportunities || [];
  const risks = report?.businessImpact?.risks || [];
  const priorityLevel = report?.businessImpact?.priorityLevel || 'LOW';

  const handleCopySummary = () => {
    const text = [
      `=== EXECUTIVE PLAIN-ENGLISH REPORT: ${report?.title || 'Platform Digest'} ===`,
      `Target: ${targetName}`,
      `Date: ${new Date().toLocaleString()}`,
      `Overall Status: ${report?.overallStatus || 'HEALTHY'} (Score: ${report?.headlineScore ?? 98}/100)`,
      ``,
      `1. WHAT HAPPENED?`,
      report?.whatHappened || 'Platform is operating under normal automated conditions.',
      ``,
      `2. WHAT WAS DISCOVERED?`,
      ...whatWasDiscovered.map((item, idx) => `  - ${item}`),
      ``,
      `3. RECOMMENDED ACTIONS:`,
      ...whatToDoNext.map((item, idx) => `  [${idx + 1}] ${item}`),
      ``,
      `4. BUSINESS IMPACT & VALUE:`,
      `  Priority: ${priorityLevel}`,
      `  Estimated Benefit: ${report?.businessImpact?.estimatedRevenueOrRankGain || 'High Organic Lift'}`,
      `  Opportunities: ${opportunities.join(', ')}`,
      `  Risks if ignored: ${risks.join(', ')}`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Executive Plain-English Summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#222] overflow-hidden transition-all">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 border-b-2 border-black dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-[#ff4d00] dark:bg-zinc-800 dark:text-cyan-400 border border-black dark:border-zinc-600 flex items-center justify-center shadow-[2px_2px_0_#000] shrink-0 font-bold">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold text-black dark:text-zinc-100 uppercase tracking-tight font-mono-brutal">
                {report.title}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${badge.bg} flex items-center gap-1`}>
                <StatusIcon className="w-3 h-3" />
                <span>{badge.label}</span>
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono-brutal mt-0.5">
              Target: <span className="font-bold text-black dark:text-zinc-200">{targetName}</span> • Generated {reportTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-600 text-xs font-mono-brutal font-bold uppercase rounded-lg shadow-[2px_2px_0_#000] flex items-center gap-1.5 transition-all cursor-pointer"
            title="Copy plain-English report for stakeholders"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED' : 'COPY SUMMARY'}</span>
          </button>

          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-600 rounded-lg cursor-pointer transition-all"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Body Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-5 text-black dark:text-zinc-200 font-sans">
          {/* Question 1: What Happened? */}
          <div className="bg-[#f8f6f0] dark:bg-zinc-950/60 p-4 rounded-xl border border-black/20 dark:border-zinc-800 space-y-1.5">
            <h4 className="text-xs font-bold uppercase font-mono-brutal text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-black text-white dark:bg-zinc-800 dark:text-cyan-400 inline-flex items-center justify-center text-[10px]">1</span>
              <span>What happened &amp; was it successful?</span>
            </h4>
            <p className="text-sm text-zinc-800 dark:text-zinc-300 leading-relaxed font-normal">
              {report?.whatHappened || 'Your SEO & GEO Indexing operations are running smoothly with optimal network health.'}
            </p>
          </div>

          {/* Question 2: What Was Discovered? */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase font-mono-brutal text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#ff4d00] text-black inline-flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Key findings &amp; discoveries:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {whatWasDiscovered.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-zinc-950 p-3 rounded-xl border-2 border-black/15 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-300 flex items-start gap-2.5 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#ff4d00] shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Question 3: Recommended Next Steps */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase font-mono-brutal text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-black text-white dark:bg-zinc-800 dark:text-emerald-400 inline-flex items-center justify-center text-[10px]">3</span>
              <span>What should you do next? (Action plan)</span>
            </h4>
            <div className="space-y-2">
              {whatToDoNext.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-[#f2efeb] dark:bg-zinc-950/80 p-3 rounded-xl border border-black/30 dark:border-zinc-700 text-xs font-medium text-black dark:text-zinc-200 flex items-center gap-3"
                >
                  <span className="px-2 py-0.5 rounded-md bg-black text-white dark:bg-zinc-800 dark:text-white font-mono-brutal text-[10px] font-bold shrink-0">
                    STEP {idx + 1}
                  </span>
                  <span className="flex-1">{step}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff4d00] shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Question 4: Business Impact & Revenue Opportunities */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-zinc-950 dark:to-zinc-900 p-4 rounded-xl border-2 border-amber-400/60 dark:border-amber-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-300/40 dark:border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#ff4d00]" />
                <h4 className="text-xs font-bold uppercase font-mono-brutal text-zinc-900 dark:text-zinc-100">
                  Business Impact &amp; Revenue Projection
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono-brutal text-zinc-600 dark:text-zinc-400">PRIORITY LEVEL:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${getPriorityBadge(priorityLevel)}`}>
                  {priorityLevel}
                </span>
                {report?.businessImpact?.estimatedRevenueOrRankGain && (
                  <span className="px-2 py-0.5 rounded bg-black text-[#ff4d00] font-mono-brutal text-[10px] font-bold border border-black">
                    {report.businessImpact.estimatedRevenueOrRankGain}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400 font-mono-brutal flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Growth Opportunities</span>
                </div>
                <ul className="space-y-1 pl-1 text-zinc-700 dark:text-zinc-300">
                  {opportunities.map((opp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase text-rose-700 dark:text-rose-400 font-mono-brutal flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Risks If Ignored</span>
                </div>
                <ul className="space-y-1 pl-1 text-zinc-700 dark:text-zinc-300">
                  {risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
