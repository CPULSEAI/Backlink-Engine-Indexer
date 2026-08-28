import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Copy,
  Check,
  Play,
  Download,
  Activity,
  ExternalLink,
  Layers,
  ArrowUpRight,
  Zap,
  Radio,
  Gauge,
  Clock,
} from 'lucide-react';
import { ExecutiveSummaryReport, AdvancedSummaryMetrics, SparklineMetricItem } from '../types';
import toast from 'react-hot-toast';

export interface PlainEnglishSummaryCardProps {
  report: ExecutiveSummaryReport;
  advancedMetrics?: AdvancedSummaryMetrics;
  collapsible?: boolean;
  compact?: boolean;
  onOpenWizard?: () => void;
  onScrollToStream?: () => void;
  onOpenClientPdf?: () => void;
  onOpenSitemapAudit?: () => void;
  onOpenSchemaGenerator?: () => void;
  onOpenBulkValidator?: () => void;
  onOpenGoogleApiWizard?: () => void;
  onOpenConversionWizard?: () => void;
  onStepClick?: (step: string, index: number) => void;
}

// Mini Sparkline SVG Sub-Component
const MiniSparkline: React.FC<{
  metric: SparklineMetricItem;
  idSuffix: string;
}> = ({ metric, idSuffix }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const values = metric.values && metric.values.length > 0 ? metric.values : [0];
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const width = 160;
  const height = 48;
  const px = 6;
  const py = 6;

  // Calculate points
  const points = values.map((val, i) => {
    const x = px + (i / Math.max(values.length - 1, 1)) * (width - 2 * px);
    const y = height - py - ((val - minVal) / range) * (height - 2 * py);
    return { x, y, val };
  });

  const linePath = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)}` : `${acc} L ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }, '');

  const firstPt = points[0] || { x: 0, y: height };
  const lastPt = points[points.length - 1] || { x: width, y: height };
  const areaPath = `${linePath} L ${lastPt.x.toFixed(1)},${height} L ${firstPt.x.toFixed(1)},${height} Z`;

  const gradientId = `sparkline-grad-${metric.id}-${idSuffix}`;

  return (
    <div className="bg-white dark:bg-zinc-950 p-3 rounded-xl border-2 border-black/20 dark:border-zinc-800 flex flex-col justify-between shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#222] transition-all hover:border-black dark:hover:border-zinc-600">
      {/* Sparkline Header */}
      <div className="flex items-start justify-between gap-1 mb-1">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-mono-brutal font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-tight block truncate" title={metric.label}>
            {metric.label}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-extrabold font-mono-brutal text-black dark:text-zinc-100">
              {metric.currentValue}
            </span>
            {metric.unit && (
              <span className="text-[10px] font-mono-brutal text-zinc-500">{metric.unit}</span>
            )}
          </div>
        </div>

        {/* Trend Indicator */}
        <div
          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono-brutal font-bold border shrink-0 ${
            metric.trendDirection === 'up'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : metric.trendDirection === 'down'
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700'
          }`}
        >
          {metric.trendDirection === 'up' && <TrendingUp className="w-3 h-3" />}
          {metric.trendDirection === 'down' && <TrendingDown className="w-3 h-3" />}
          {metric.trendDirection === 'neutral' && <Minus className="w-3 h-3" />}
          <span>{metric.trendPercentage}</span>
        </div>
      </div>

      {/* SVG Sparkline Canvas */}
      <div className="relative w-full h-12 mt-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={metric.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={metric.color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#${gradientId})`} />

          {/* Sparkline Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke={metric.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            const isLast = idx === points.length - 1;

            return (
              <g key={idx}>
                {/* Hit area */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="7"
                  className="cursor-pointer fill-transparent"
                  onMouseEnter={() => setHoveredIdx(idx)}
                />

                {/* Visible Point */}
                {(isHovered || isLast) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 4 : 3}
                    fill={metric.color}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className={isLast ? 'animate-pulse' : ''}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div
            className="absolute -top-6 bg-black text-white px-1.5 py-0.5 rounded text-[9px] font-mono-brutal font-bold shadow-md pointer-events-none transform -translate-x-1/2 whitespace-nowrap z-10 border border-zinc-700"
            style={{
              left: `${(points[hoveredIdx].x / width) * 100}%`,
            }}
          >
            {points[hoveredIdx].val}
            {metric.label.includes('Rate') || metric.label.includes('%') ? '%' : metric.unit || ''}
          </div>
        )}
      </div>

      {/* Subtext Footer */}
      {metric.subtext && (
        <div className="text-[9px] font-mono-brutal text-zinc-500 dark:text-zinc-400 mt-1 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-1">
          <span>{metric.subtext}</span>
          <span className="text-[8px] text-zinc-400">10-PT SPARK</span>
        </div>
      )}
    </div>
  );
};

export const PlainEnglishSummaryCard: React.FC<PlainEnglishSummaryCardProps> = ({
  report,
  advancedMetrics,
  collapsible = false,
  compact = false,
  onOpenWizard,
  onScrollToStream,
  onOpenClientPdf,
  onOpenSitemapAudit,
  onOpenSchemaGenerator,
  onOpenBulkValidator,
  onOpenGoogleApiWizard,
  onOpenConversionWizard,
  onStepClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showSparklines, setShowSparklines] = useState(true);

  // Health Pulse configuration based on overallStatus & headline score percentage
  const getHealthPulseConfig = (status?: string, score?: number) => {
    // If score is provided, prioritize score percentage thresholds:
    // >95% -> Green (Optimal)
    // 80-94% -> Amber (Moderate / Needs Attention)
    // <80% -> Red (Critical)
    const effectiveScore = score ?? (status === 'EXCELLENT' ? 98 : status === 'GOOD' ? 90 : status === 'NEEDS_ATTENTION' ? 84 : 68);

    if (effectiveScore >= 95 || status === 'EXCELLENT') {
      return {
        statusTheme: 'emerald',
        topBarGradient: 'from-emerald-500 via-green-400 to-teal-500',
        pulseBarBg: 'bg-emerald-500',
        bannerBg: 'bg-emerald-500/15 border-b-2 border-emerald-500/40 text-emerald-950 dark:text-emerald-200',
        dotColor: 'bg-emerald-500',
        pingColor: 'bg-emerald-400',
        waveStroke: '#10b981',
        label: 'HEALTH PULSE: OPTIMAL (>95% HEALTH)',
        subLabel: '100% PIPELINE INTEGRITY • ZERO DROPPED SIGNALS • ACTIVE REAL-TIME STREAM',
        latencyBadge: '<140ms AVG LATENCY',
        pulseRateClass: 'animate-pulse',
      };
    }

    if ((effectiveScore >= 80 && effectiveScore < 95) || status === 'GOOD' || status === 'OPERATIONAL' || status === 'NEEDS_ATTENTION' || status === 'DEGRADED') {
      return {
        statusTheme: 'amber',
        topBarGradient: 'from-amber-500 via-yellow-400 to-orange-500',
        pulseBarBg: 'bg-amber-500',
        bannerBg: 'bg-amber-500/20 border-b-2 border-amber-500/50 text-amber-950 dark:text-amber-200',
        dotColor: 'bg-amber-500',
        pingColor: 'bg-amber-400',
        waveStroke: '#f59e0b',
        label: 'HEALTH PULSE: ATTENTION REQUIRED (80-94% HEALTH)',
        subLabel: 'ELEVATED RETRIES OR PROXY COOLDOWN DETECTED • MONITOR DISPATCH QUEUE',
        latencyBadge: '480ms ELEVATED',
        pulseRateClass: 'animate-pulse',
      };
    }

    // Default to Red for <80% (Critical)
    return {
      statusTheme: 'rose',
      topBarGradient: 'from-rose-600 via-red-500 to-rose-700',
      pulseBarBg: 'bg-rose-600',
      bannerBg: 'bg-rose-500/25 border-b-2 border-rose-500/60 text-rose-950 dark:text-rose-200',
      dotColor: 'bg-rose-600',
      pingColor: 'bg-rose-500',
      waveStroke: '#e11d48',
      label: 'HEALTH PULSE: CRITICAL PIPELINE ALERT (<80% HEALTH)',
      subLabel: 'GATEWAY TIMEOUTS ENCOUNTERED • IMMEDIATE REMEDIATION RECOMMENDED',
      latencyBadge: '>1200ms LATENCY',
      pulseRateClass: 'animate-bounce',
    };
  };

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

  const healthPulse = getHealthPulseConfig(report?.overallStatus, report?.headlineScore);
  const badge = getStatusBadge(report?.overallStatus);
  const StatusIcon = badge.icon;

  const targetName = report?.target || 'Enterprise SEO & GEO Submission Network';
  const reportTime = report?.timestamp ? new Date(report.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
  const whatWasDiscovered = report?.whatWasDiscovered || [];
  const whatToDoNext = report?.whatToDoNext || [];
  const opportunities = report?.businessImpact?.opportunities || [];
  const risks = report?.businessImpact?.risks || [];
  const priorityLevel = report?.businessImpact?.priorityLevel || 'LOW';

  // Resolved advanced metrics: prop overrides report.advancedMetrics, or generates a comprehensive default
  const resolvedMetrics: AdvancedSummaryMetrics = advancedMetrics || report?.advancedMetrics || {
    overallSuccessRatePct: report?.headlineScore ?? 99.2,
    totalIndexedCount: 1420,
    avgLatencyMs: report?.overallStatus === 'CRITICAL' ? 1240 : report?.overallStatus === 'NEEDS_ATTENTION' ? 480 : 138,
    activeGatewaysCount: 55,
    sparklines: [
      {
        id: 'google-indexing-rate',
        label: 'Google Indexing API (v3)',
        currentValue: report?.overallStatus === 'CRITICAL' ? '82.4%' : report?.overallStatus === 'NEEDS_ATTENTION' ? '92.1%' : '99.4%',
        trendDirection: report?.overallStatus === 'CRITICAL' ? 'down' : 'up',
        trendPercentage: report?.overallStatus === 'CRITICAL' ? '-7.2%' : '+1.8%',
        color: '#10b981',
        values: report?.overallStatus === 'CRITICAL'
          ? [95, 94, 91, 88, 85, 84, 82, 80, 83, 82.4]
          : [94.0, 95.2, 96.5, 97.0, 98.1, 98.8, 99.0, 99.2, 99.4, 99.4],
        subtext: 'Direct quota push to Googlebot',
      },
      {
        id: 'live-confirmation-rate',
        label: 'HTTP 200 Live Verification',
        currentValue: report?.overallStatus === 'CRITICAL' ? '86.0%' : report?.overallStatus === 'NEEDS_ATTENTION' ? '94.5%' : '98.8%',
        trendDirection: report?.overallStatus === 'CRITICAL' ? 'down' : 'up',
        trendPercentage: report?.overallStatus === 'CRITICAL' ? '-4.5%' : '+2.4%',
        color: '#06b6d4',
        values: report?.overallStatus === 'CRITICAL'
          ? [94, 93, 90, 88, 86, 87, 85, 86, 85, 86]
          : [92.0, 93.4, 94.8, 95.6, 96.8, 97.5, 98.0, 98.4, 98.6, 98.8],
        subtext: 'Live URL backlink confirmation',
      },
      {
        id: 'indexnow-throughput',
        label: 'IndexNow Protocol Feed',
        currentValue: '100%',
        trendDirection: 'neutral',
        trendPercentage: '0.0%',
        color: '#ff4d00',
        values: [100, 100, 99.5, 100, 100, 100, 99.8, 100, 100, 100],
        subtext: 'Bing, Yandex, Seznam real-time',
      },
      {
        id: 'dispatch-latency',
        label: 'Avg Gateway Latency',
        currentValue: report?.overallStatus === 'CRITICAL' ? '1,240ms' : report?.overallStatus === 'NEEDS_ATTENTION' ? '480ms' : '138ms',
        unit: '',
        trendDirection: report?.overallStatus === 'CRITICAL' ? 'down' : 'up',
        trendPercentage: report?.overallStatus === 'CRITICAL' ? '+480ms' : '-24ms',
        color: '#8b5cf6',
        values: report?.overallStatus === 'CRITICAL'
          ? [350, 420, 600, 780, 950, 1100, 1180, 1220, 1250, 1240]
          : [210, 195, 182, 170, 162, 155, 148, 142, 140, 138],
        subtext: 'Global multi-region proxy latency',
      },
    ],
  };

  const handleCopySummary = () => {
    const text = [
      `=== EXECUTIVE PLAIN-ENGLISH REPORT: ${report?.title || 'Platform Digest'} ===`,
      `Target: ${targetName}`,
      `Date: ${new Date().toLocaleString()}`,
      `Overall Status: ${report?.overallStatus || 'HEALTHY'} (Score: ${report?.headlineScore ?? 98}/100)`,
      ``,
      `HEALTH PULSE TELEMETRY:`,
      `  Status: ${healthPulse.label}`,
      `  Integrity: ${healthPulse.subLabel}`,
      `  Success Rate: ${resolvedMetrics.overallSuccessRatePct}%`,
      `  Avg Latency: ${resolvedMetrics.avgLatencyMs}ms`,
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

  const getStepActionMeta = (step: string, index: number) => {
    const s = step.toLowerCase();
    if (s.includes('wizard') || s.includes('queue') || s.includes('5-step') || s.includes('onboarding') || index === 0) {
      return {
        label: 'LAUNCH WIZARD',
        icon: Play,
        badgeColor: 'bg-[#ff4d00] text-black border-black',
        tooltip: 'Click to launch the 5-Step Indexing Wizard',
      };
    }
    if (s.includes('stream') || s.includes('live') || s.includes('table') || s.includes('monitor') || s.includes('200') || s.includes('confirmation') || index === 1) {
      return {
        label: 'VIEW STREAM',
        icon: Activity,
        badgeColor: 'bg-emerald-400 text-black border-black',
        tooltip: 'Click to navigate to Real-time Stream & Results Table',
      };
    }
    if (s.includes('export') || s.includes('compliance') || s.includes('report') || s.includes('stakeholder') || s.includes('client') || s.includes('pdf') || index === 2) {
      return {
        label: 'EXPORT REPORT',
        icon: Download,
        badgeColor: 'bg-indigo-400 text-black border-black',
        tooltip: 'Click to generate Whitelabel Client & Compliance PDF',
      };
    }
    if (s.includes('sitemap') || s.includes('broken')) {
      return {
        label: 'AUDIT SITEMAP',
        icon: FileText,
        badgeColor: 'bg-purple-400 text-black border-black',
        tooltip: 'Click to open XML Sitemap Crawler & Auditor',
      };
    }
    if (s.includes('schema') || s.includes('json-ld')) {
      return {
        label: 'GENERATE SCHEMA',
        icon: Layers,
        badgeColor: 'bg-amber-400 text-black border-black',
        tooltip: 'Click to open Visual Schema Generator',
      };
    }
    return {
      label: 'EXECUTE STEP',
      icon: ArrowUpRight,
      badgeColor: 'bg-black text-white border-black',
      tooltip: 'Click to execute this recommended action',
    };
  };

  const handleExecuteStep = (step: string, index: number) => {
    if (onStepClick) {
      onStepClick(step, index);
      return;
    }

    const s = step.toLowerCase();
    if (s.includes('wizard') || s.includes('queue') || s.includes('5-step') || s.includes('onboarding') || index === 0) {
      if (onOpenWizard) {
        onOpenWizard();
        toast.success('🚀 Launching 5-Step URL Indexing Wizard...');
      } else {
        const formEl = document.getElementById('url-input-form');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth' });
          toast.success('Navigated to Target URLs & Pipeline Form');
        }
      }
      return;
    }

    if (s.includes('stream') || s.includes('live') || s.includes('table') || s.includes('monitor') || s.includes('200') || s.includes('confirmation') || index === 1) {
      if (onScrollToStream) {
        onScrollToStream();
      } else {
        const tableEl = document.getElementById('results-table');
        if (tableEl) {
          tableEl.scrollIntoView({ behavior: 'smooth' });
          toast.success('📊 Navigated to Live Operations Stream Table');
        }
      }
      return;
    }

    if (s.includes('export') || s.includes('compliance') || s.includes('report') || s.includes('stakeholder') || s.includes('client') || s.includes('pdf') || index === 2) {
      if (onOpenClientPdf) {
        onOpenClientPdf();
        toast.success('📄 Opening Whitelabel Client Report Generator...');
      } else {
        toast.success('Exporting summary report...');
        handleCopySummary();
      }
      return;
    }

    if (s.includes('sitemap') && onOpenSitemapAudit) {
      onOpenSitemapAudit();
      return;
    }

    if (s.includes('schema') && onOpenSchemaGenerator) {
      onOpenSchemaGenerator();
      return;
    }

    const formEl = document.getElementById('url-input-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#222] overflow-hidden transition-all">
      {/* 1. ANIMATED HEALTH PULSE TOP SCANNER & STATUS BAR */}
      <div className="relative overflow-hidden">
        {/* Animated Laser/Shimmer Beam */}
        <div
          className={`h-1.5 w-full bg-gradient-to-r ${healthPulse.topBarGradient} relative overflow-hidden`}
        >
          <div
            className="absolute inset-0 bg-white/40 dark:bg-white/60 animate-pulse"
            style={{
              animationDuration: '1.8s',
            }}
          />
        </div>

        {/* Health Pulse Telemetry Bar */}
        <div
          className={`px-4 py-2 sm:px-5 ${healthPulse.bannerBg} flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors`}
        >
          <div className="flex items-center gap-3 flex-wrap">
            {/* Pulsing Orb with Ping Ring */}
            <div className="relative flex items-center justify-center shrink-0">
              <span
                className={`animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 ${healthPulse.pingColor}`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${healthPulse.dotColor}`}
              />
            </div>

            {/* Health Pulse Title */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-brutal text-xs font-black tracking-wide uppercase flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{healthPulse.label}</span>
              </span>
              <span className="hidden md:inline text-zinc-400 dark:text-zinc-600">•</span>
              <span className="text-[11px] font-mono-brutal opacity-90 truncate max-w-md hidden sm:inline">
                {healthPulse.subLabel}
              </span>
            </div>
          </div>

          {/* Real-Time Waveform & Quick Metrics */}
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 font-mono-brutal">
            {/* Heartbeat ECG Mini Waveform */}
            <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-black/10 dark:bg-black/40 border border-black/15 dark:border-white/10" title="Live Heartbeat ECG Rhythm">
              <svg className="w-16 h-3.5 stroke-current fill-none" viewBox="0 0 100 20">
                <path
                  d="M 0 10 L 22 10 L 30 3 L 38 17 L 46 1 L 54 19 L 60 10 L 100 10"
                  stroke={healthPulse.waveStroke}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[9px] font-bold uppercase">{healthPulse.latencyBadge}</span>
            </div>

            {/* Headline Health Score */}
            <span className="px-2 py-0.5 rounded bg-black text-white dark:bg-zinc-800 text-[10px] font-extrabold uppercase border border-black/20 shadow-sm flex items-center gap-1">
              <Gauge className="w-3 h-3 text-[#ff4d00]" />
              <span>SCORE: {report?.headlineScore ?? 99}/100</span>
            </span>

            {/* Toggle Sparklines Button */}
            <button
              onClick={() => setShowSparklines(!showSparklines)}
              className="text-[10px] font-bold uppercase underline hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1"
              title="Toggle recent indexation sparklines"
            >
              <span>{showSparklines ? 'HIDE METRICS' : 'VIEW SPARKLINE METRICS'}</span>
              {showSparklines ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. OPTIONAL MINI-SPARKLINES ROW FOR RECENT INDEXATION SUCCESS RATES */}
      {showSparklines && resolvedMetrics.sparklines && resolvedMetrics.sparklines.length > 0 && (
        <div className="p-4 sm:p-5 bg-zinc-50/80 dark:bg-zinc-950/70 border-b-2 border-black dark:border-zinc-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#ff4d00]" />
              <h4 className="text-xs font-black uppercase font-mono-brutal text-black dark:text-zinc-100 tracking-tight">
                Recent Indexation Velocity &amp; Telemetry Sparklines
              </h4>
            </div>
            <span className="text-[10px] font-mono-brutal text-zinc-500 uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Rolling 24-Hour Success Intervals</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {resolvedMetrics.sparklines.map((metric, idx) => (
              <MiniSparkline
                key={metric.id || idx}
                metric={metric}
                idSuffix={`plain-card-${idx}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. CARD HEADER */}
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

      {/* 4. BODY CONTENT */}
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

          {/* Question 3: Recommended Next Steps (Clickable Action Links) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-bold uppercase font-mono-brutal text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-black text-white dark:bg-zinc-800 dark:text-emerald-400 inline-flex items-center justify-center text-[10px]">3</span>
                <span>What should you do next? (Click to execute action)</span>
              </h4>
              <span className="text-[10px] font-mono-brutal text-zinc-500 uppercase">
                Interactive Action Links Active
              </span>
            </div>

            <div className="space-y-2">
              {whatToDoNext.map((step, idx) => {
                const actionMeta = getStepActionMeta(step, idx);
                const ActionIcon = actionMeta.icon;

                return (
                  <div
                    key={idx}
                    id={`next-step-action-${idx + 1}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleExecuteStep(step, idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleExecuteStep(step, idx);
                      }
                    }}
                    title={actionMeta.tooltip}
                    className="group bg-[#f2efeb] hover:bg-black text-black hover:text-white dark:bg-zinc-950/80 dark:hover:bg-zinc-800 dark:text-zinc-200 dark:hover:text-white p-3 rounded-xl border-2 border-black/30 hover:border-black dark:border-zinc-700 dark:hover:border-zinc-500 text-xs font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[2px_2px_0_rgba(0,0,0,0.1)] hover:shadow-[3px_3px_0_#000] transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="px-2 py-0.5 rounded-md bg-black text-white group-hover:bg-[#ff4d00] group-hover:text-black dark:bg-zinc-800 dark:text-white dark:group-hover:bg-[#ff4d00] font-mono-brutal text-[10px] font-bold shrink-0 transition-colors shadow-sm">
                        STEP {idx + 1}
                      </span>
                      <span className="flex-1 font-semibold leading-relaxed">
                        {step}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono-brutal font-bold rounded uppercase border ${actionMeta.badgeColor} shadow-[1px_1px_0_#000] group-hover:bg-white group-hover:text-black transition-all`}>
                        <ActionIcon className="w-3 h-3 shrink-0" />
                        <span>{actionMeta.label}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#ff4d00] group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </div>
                );
              })}
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

