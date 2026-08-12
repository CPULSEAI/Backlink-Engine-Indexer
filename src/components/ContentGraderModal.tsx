import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  X,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  TrendingUp,
  Layers,
  FileCode,
  ShieldCheck,
  Zap,
  ArrowRight,
  Table,
  Code,
  FileText,
  Globe,
  Target,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  HelpCircle
} from 'lucide-react';

interface ContentGraderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  initialKeyword?: string;
}

interface Step1Data {
  exactOccurrences: number;
  wordCount: number;
  densityPercent: number;
  densityStatus: 'LOW' | 'OPTIMAL' | 'HIGH_STUFFING';
  densityAnalysis: string;
  detectedIntent: 'Informational' | 'Transactional' | 'Navigational' | 'Commercial';
  intentMatch: boolean;
  intentAnalysis: string;
}

interface Step2Data {
  optimizedTitle: string;
  titleCharCount: number;
  optimizedMetaDescription: string;
  metaCharCount: number;
  optimizedH1: string;
  suggestedSubheadings: Array<{
    tag: 'H2' | 'H3';
    heading: string;
    rationale: string;
  }>;
}

interface Step3Data {
  competitorGaps: string[];
  informationGainAngle: string;
  secondaryKeywords: string[];
}

interface Step4Data {
  jsonLdSchemaType: string;
  jsonLdSchemaSnippet: string;
  internalLinkingStrategy: Array<{
    sourcePageType: string;
    suggestedAnchorText: string;
    linkingContext: string;
  }>;
}

interface Step5Data {
  comparisonTable: Array<{
    element: string;
    currentState: string;
    optimizedState: string;
    impact: 'Critical' | 'High' | 'Medium';
  }>;
  cmsCopyBlocks: {
    htmlHeadBlock: string;
    introAnswerBoxBlock: string;
    headingStructureBlock: string;
  };
}

interface GradeResult {
  overallScore: number;
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
  answerFirstScore?: number;
  entityDensityScore?: number;
  schemaScore?: number;
  suggestedAnswerBox?: string;
  missingEntities?: string[];
  recommendedActionItems?: string[];
  competitiveBenchmark?: {
    userScore: number;
    topCompetitorScore: number;
    industryAvg: number;
  };
}

export const ContentGraderModal: React.FC<ContentGraderModalProps> = ({
  isOpen,
  onClose,
  initialUrl = 'https://mybrand.com/blog/automated-backlinks',
  initialKeyword = 'best automated backlink submission software',
}) => {
  const [url, setUrl] = useState<string>(initialUrl);
  const [keyword, setKeyword] = useState<string>(initialKeyword);
  const [rawPageText, setRawPageText] = useState<string>('');
  const [competitorUrlsText, setCompetitorUrlsText] = useState<string>('');
  const [showAdvancedInputs, setShowAdvancedInputs] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Active Tab Filter
  const [activeTab, setActiveTab] = useState<'ALL' | 'STEP1' | 'STEP2' | 'STEP3' | 'STEP4' | 'STEP5'>('ALL');

  // Copy States
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (initialUrl && initialUrl !== url) setUrl(initialUrl);
    if (initialKeyword && initialKeyword !== keyword) setKeyword(initialKeyword);
  }, [initialUrl, initialKeyword]);

  if (!isOpen) return null;

  const handleGradePage = async () => {
    if (!url.trim() || !keyword.trim()) {
      toast.error('Please enter both target URL and target keyword');
      return;
    }

    let cleanTargetUrl = url.trim();
    while (cleanTargetUrl.match(/^(https?:\/\/)+/i)) {
      cleanTargetUrl = cleanTargetUrl.replace(/^(https?:\/\/)+/i, '');
    }
    cleanTargetUrl = `https://${cleanTargetUrl.replace(/^\/+/, '')}`;
    setUrl(cleanTargetUrl);

    const competitorsList = competitorUrlsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setLoading(true);
    setErrorMsg('');
    const toastId = toast.loading('Executing 5-Step Enterprise SEO & Search Indexing Audit...');

    try {
      const resp = await fetch('/api/grade-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: cleanTargetUrl,
          rawPageText: rawPageText.trim(),
          keyword: keyword.trim(),
          competitorUrls: competitorsList,
        }),
      });

      if (!resp.ok) {
        throw new Error('Failed to execute SEO content audit');
      }

      const data: GradeResult = await resp.json();
      setResult(data);
      toast.success(`SEO Audit Complete! Optimization Score: ${data.overallScore}/100`, { id: toastId });
    } catch (e: any) {
      console.error('Grading Error:', e);
      const msg = e.message || 'Error occurred while grading page';
      setErrorMsg(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/85 backdrop-blur-md p-2 sm:p-4">
      <div className="w-full max-w-5xl bg-zinc-900 border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-gradient-to-r from-zinc-950 via-purple-950/40 to-zinc-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>Enterprise SEO &amp; Search Indexing Audit Engine</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30 font-mono font-bold">
                  Gemini 2.5 Flash Engine
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                5-Step Content Grader: Keyword Intent, HTML Restructure, Competitor Gaps, Schema, &amp; CMS Deliverables.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Form Inputs Container */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6">
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  <span>Target Webpage URL {"{{TARGET_URL}}"}</span>
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourdomain.com/blog/target-page"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center gap-1">
                  <Target className="w-3 h-3 text-purple-400" />
                  <span>Target Keyword {"{{TARGET_KEYWORD}}"}</span>
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. automated backlink submitter"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="md:col-span-2 flex items-end">
                <button
                  onClick={handleGradePage}
                  disabled={loading || !url.trim() || !keyword.trim()}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20 shrink-0 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>{loading ? 'Analyzing...' : 'Run Audit'}</span>
                </button>
              </div>
            </div>

            {/* Advanced Toggle: Raw Page Text & Competitor URLs */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
                className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 py-1 cursor-pointer"
              >
                {showAdvancedInputs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>
                  {showAdvancedInputs ? 'Hide Advanced Context Inputs' : '+ Add Raw Page Text or Competitor URLs'}
                </span>
              </button>

              {showAdvancedInputs && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2.5 border-t border-zinc-900">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center justify-between">
                      <span>Raw Page Text {"{{RAW_PAGE_TEXT}}"}</span>
                      <span className="text-[9px] text-zinc-500 font-normal">Optional - Auto-crawled if blank</span>
                    </label>
                    <textarea
                      rows={3}
                      value={rawPageText}
                      onChange={(e) => setRawPageText(e.target.value)}
                      placeholder="Paste full text content of target webpage here..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center justify-between">
                      <span>Competitor Ranking URLs {"{{COMPETITOR_URLS}}"}</span>
                      <span className="text-[9px] text-zinc-500 font-normal">Optional - 1 to 3 URLs (1 per line)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={competitorUrlsText}
                      onChange={(e) => setCompetitorUrlsText(e.target.value)}
                      placeholder="https://competitor1.com/page&#10;https://competitor2.com/page"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Render 5-Step Workflow Results */}
          {result && (
            <div className="space-y-5 animate-fadeIn">
              {/* Overall Score Header Banner */}
              <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 text-center shrink-0 min-w-[100px]">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">SEO Score</span>
                    <span
                      className={`text-3xl font-black font-mono ${
                        result.overallScore >= 80
                          ? 'text-emerald-400'
                          : result.overallScore >= 60
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {result.overallScore}
                      <span className="text-xs text-zinc-500 font-normal">/100</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      <span>Target Keyword:</span>
                      <span className="text-purple-300 font-mono font-bold bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                        {keyword}
                      </span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      5-Step Sequential Workflow Execution Complete. Actionable copy blocks generated for CMS deployment.
                    </p>
                  </div>
                </div>

                {/* Benchmark Pills */}
                {result.competitiveBenchmark && (
                  <div className="flex items-center gap-2 text-center text-xs font-mono shrink-0">
                    <div className="p-2 bg-zinc-900 rounded-xl border border-indigo-500/30">
                      <span className="text-[9px] text-indigo-300 block font-bold">Your Score</span>
                      <span className="text-sm font-black text-indigo-200">{result.overallScore}%</span>
                    </div>
                    <div className="p-2 bg-zinc-900 rounded-xl border border-cyan-500/30">
                      <span className="text-[9px] text-cyan-300 block font-bold">Top Competitor</span>
                      <span className="text-sm font-black text-cyan-200">
                        {result.competitiveBenchmark.topCompetitorScore}%
                      </span>
                    </div>
                    <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800">
                      <span className="text-[9px] text-zinc-400 block font-bold">Industry Avg</span>
                      <span className="text-sm font-black text-zinc-300">
                        {result.competitiveBenchmark.industryAvg}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Navigation Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-800">
                <button
                  onClick={() => setActiveTab('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'ALL'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  All 5 Steps
                </button>
                <button
                  onClick={() => setActiveTab('STEP1')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'STEP1'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  Step 1: Keyword Audit
                </button>
                <button
                  onClick={() => setActiveTab('STEP2')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'STEP2'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  Step 2: HTML Restructure
                </button>
                <button
                  onClick={() => setActiveTab('STEP3')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'STEP3'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  Step 3: Gaps &amp; Secondary KW
                </button>
                <button
                  onClick={() => setActiveTab('STEP4')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'STEP4'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  Step 4: Schema &amp; Linking
                </button>
                <button
                  onClick={() => setActiveTab('STEP5')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'STEP5'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  Step 5: CMS Deliverables
                </button>
              </div>

              {/* STEP 1: KEYWORD INTENT & DENSITY AUDIT */}
              {(activeTab === 'ALL' || activeTab === 'STEP1') && result.step1 && (
                <div className="bg-zinc-950 border border-cyan-500/30 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center border border-cyan-500/40 shrink-0">
                        1
                      </span>
                      <h4 className="text-xs font-bold text-cyan-300 uppercase font-mono tracking-wider">
                        STEP 1: Keyword Intent &amp; Density Audit
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      Density Threshold: 0.5% – 2.5%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Occurrences & Word count */}
                    <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                      <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">
                        Keyword Occurrences
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-mono font-black text-cyan-300">
                          {result.step1.exactOccurrences} times
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">in {result.step1.wordCount} words</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 pt-1 leading-relaxed">
                        Calculated against total body text word count.
                      </p>
                    </div>

                    {/* Density Meter */}
                    <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold">
                          Keyword Density %
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                            result.step1.densityStatus === 'OPTIMAL'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : result.step1.densityStatus === 'LOW'
                              ? 'bg-amber-950 text-amber-400 border-amber-800'
                              : 'bg-rose-950 text-rose-400 border-rose-800'
                          }`}
                        >
                          {result.step1.densityStatus === 'OPTIMAL'
                            ? 'Optimal (0.5% - 2.5%)'
                            : result.step1.densityStatus === 'LOW'
                            ? 'Too Low (<0.5%)'
                            : 'Keyword Stuffing (>2.5%)'}
                        </span>
                      </div>
                      <span className="text-2xl font-mono font-black text-white block">
                        {result.step1.densityPercent}%
                      </span>
                      <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                        <div
                          className={`h-full transition-all duration-500 ${
                            result.step1.densityStatus === 'OPTIMAL'
                              ? 'bg-emerald-400'
                              : result.step1.densityStatus === 'LOW'
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(8, result.step1.densityPercent * 25))}%` }}
                        />
                      </div>
                    </div>

                    {/* Search Intent */}
                    <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                      <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">
                        Detected Search Intent
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-mono font-bold text-purple-300">
                          {result.step1.detectedIntent}
                        </span>
                        <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-mono font-bold">
                          {result.step1.intentMatch ? 'Intent Matched' : 'Framing Mismatch'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 pt-1 leading-relaxed">
                        {result.step1.intentAnalysis}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 leading-relaxed font-sans">
                    <strong className="text-cyan-300 font-mono">Density Audit Summary:</strong>{' '}
                    {result.step1.densityAnalysis}
                  </p>
                </div>
              )}

              {/* STEP 2: ON-PAGE HTML RESTRUCTURE */}
              {(activeTab === 'ALL' || activeTab === 'STEP2') && result.step2 && (
                <div className="bg-zinc-950 border border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center border border-indigo-500/40 shrink-0">
                      2
                    </span>
                    <h4 className="text-xs font-bold text-indigo-300 uppercase font-mono tracking-wider">
                      STEP 2: On-Page HTML Restructure
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {/* Title Tag */}
                    <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Optimized &lt;title&gt; Tag</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                              result.step2.titleCharCount <= 60
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                : 'bg-rose-950 text-rose-400 border-rose-800'
                            }`}
                          >
                            {result.step2.titleCharCount} / 60 chars
                          </span>
                          <button
                            onClick={() =>
                              handleCopyText(
                                `<title>${result.step2.optimizedTitle}</title>`,
                                'titleTag'
                              )
                            }
                            className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-indigo-300 rounded text-[10px] font-bold font-mono flex items-center gap-1 border border-zinc-700 cursor-pointer"
                          >
                            {copiedKey === 'titleTag' ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedKey === 'titleTag' ? 'Copied' : 'Copy HTML'}</span>
                          </button>
                        </div>
                      </div>
                      <div className="bg-zinc-950 p-2.5 rounded-lg font-mono text-xs text-indigo-200 border border-zinc-800 select-all">
                        {`<title>${result.step2.optimizedTitle}</title>`}
                      </div>
                    </div>

                    {/* Meta Description */}
                    <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Optimized Meta Description</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                              result.step2.metaCharCount >= 145 && result.step2.metaCharCount <= 160
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                : 'bg-amber-950 text-amber-400 border-amber-800'
                            }`}
                          >
                            {result.step2.metaCharCount} / 155 chars
                          </span>
                          <button
                            onClick={() =>
                              handleCopyText(
                                `<meta name="description" content="${result.step2.optimizedMetaDescription}" />`,
                                'metaDesc'
                              )
                            }
                            className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-indigo-300 rounded text-[10px] font-bold font-mono flex items-center gap-1 border border-zinc-700 cursor-pointer"
                          >
                            {copiedKey === 'metaDesc' ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedKey === 'metaDesc' ? 'Copied' : 'Copy HTML'}</span>
                          </button>
                        </div>
                      </div>
                      <div className="bg-zinc-950 p-2.5 rounded-lg font-mono text-xs text-indigo-200 border border-zinc-800 select-all">
                        {`<meta name="description" content="${result.step2.optimizedMetaDescription}" />`}
                      </div>
                    </div>

                    {/* Heading Hierarchy (H1, H2, H3) */}
                    <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 space-y-2.5">
                      <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider block">
                        Heading Hierarchy Restructure (H1, H2, H3)
                      </span>

                      {/* H1 */}
                      <div className="p-2.5 bg-zinc-950 rounded-lg border border-indigo-500/20 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-800">
                            H1 HEADING
                          </span>
                        </div>
                        <p className="text-xs font-mono font-bold text-zinc-100">{result.step2.optimizedH1}</p>
                      </div>

                      {/* Suggested H2/H3s */}
                      <div className="space-y-2">
                        {result.step2.suggestedSubheadings.map((sub, idx) => (
                          <div key={idx} className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                                {sub.tag} SUBHEADING
                              </span>
                              <span className="text-[10px] text-zinc-400 font-sans italic">{sub.rationale}</span>
                            </div>
                            <p className="text-xs font-mono text-zinc-200">{sub.heading}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CONTENT COMPREHENSIVENESS & GAP ANALYSIS */}
              {(activeTab === 'ALL' || activeTab === 'STEP3') && result.step3 && (
                <div className="bg-zinc-950 border border-purple-500/30 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold flex items-center justify-center border border-purple-500/40 shrink-0">
                      3
                    </span>
                    <h4 className="text-xs font-bold text-purple-300 uppercase font-mono tracking-wider">
                      STEP 3: Content Comprehensiveness &amp; Gap Analysis
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Competitor Gaps */}
                    <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider block">
                        Competitor Topic &amp; Entity Gaps
                      </span>
                      <ul className="space-y-2 text-xs text-zinc-300">
                        {result.step3.competitorGaps.map((gap, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                            <span className="text-purple-400 font-bold shrink-0">#{idx + 1}</span>
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Information Gain Angle */}
                    <div className="bg-zinc-900 p-3.5 rounded-xl border border-purple-500/30 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                          Information Gain Opportunity
                        </span>
                      </div>
                      <p className="text-xs text-zinc-200 bg-amber-950/20 p-3 rounded-lg border border-amber-500/30 leading-relaxed">
                        "{result.step3.informationGainAngle}"
                      </p>
                    </div>
                  </div>

                  {/* 5 Secondary Keywords */}
                  <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                        5 Semantically Related Secondary Keywords (Topical Authority)
                      </span>
                      <button
                        onClick={() =>
                          handleCopyText(
                            result.step3.secondaryKeywords.join(', '),
                            'secKeywords'
                          )
                        }
                        className="px-2 py-0.5 bg-purple-950 hover:bg-purple-900 text-purple-300 rounded text-[10px] font-bold font-mono flex items-center gap-1 border border-purple-800 cursor-pointer"
                      >
                        {copiedKey === 'secKeywords' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedKey === 'secKeywords' ? 'Copied All' : 'Copy All'}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {result.step3.secondaryKeywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                          <span>{kw}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: INDEXATION & CRAWLABILITY CHECKLIST */}
              {(activeTab === 'ALL' || activeTab === 'STEP4') && result.step4 && (
                <div className="bg-zinc-950 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center border border-emerald-500/40 shrink-0">
                      4
                    </span>
                    <h4 className="text-xs font-bold text-emerald-300 uppercase font-mono tracking-wider">
                      STEP 4: Indexation &amp; Crawlability Checklist
                    </h4>
                  </div>

                  {/* JSON-LD Schema Snippet */}
                  <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider">
                          JSON-LD Structured Schema ({result.step4.jsonLdSchemaType})
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleCopyText(
                            `<script type="application/ld+json">\n${result.step4.jsonLdSchemaSnippet}\n</script>`,
                            'jsonLd'
                          )
                        }
                        className="px-2 py-0.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded text-[10px] font-bold font-mono flex items-center gap-1 border border-emerald-800 cursor-pointer"
                      >
                        {copiedKey === 'jsonLd' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedKey === 'jsonLd' ? 'Copied Schema' : 'Copy Script Tag'}</span>
                      </button>
                    </div>

                    <pre className="bg-zinc-950 p-3 rounded-lg font-mono text-[11px] text-emerald-200 border border-emerald-500/20 overflow-x-auto max-h-48 scrollbar-thin">
                      {`<script type="application/ld+json">\n${result.step4.jsonLdSchemaSnippet}\n</script>`}
                    </pre>
                  </div>

                  {/* Internal Linking Placement Strategies */}
                  <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider block">
                      Internal Linking Placement Strategies
                    </span>

                    <div className="overflow-x-auto rounded-lg border border-zinc-800">
                      <table className="w-full text-left text-xs font-sans border-collapse">
                        <thead className="bg-zinc-950 text-zinc-400 font-mono text-[10px] uppercase">
                          <tr className="border-b border-zinc-800">
                            <th className="p-2.5 border-r border-zinc-800">Source Page Type</th>
                            <th className="p-2.5 border-r border-zinc-800">Suggested Anchor Text</th>
                            <th className="p-2.5">Linking Context &amp; Placement</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/80 bg-zinc-900">
                          {result.step4.internalLinkingStrategy.map((strat, idx) => (
                            <tr key={idx} className="hover:bg-zinc-950/50">
                              <td className="p-2.5 border-r border-zinc-800 font-mono text-zinc-300 font-bold whitespace-nowrap">
                                {strat.sourcePageType}
                              </td>
                              <td className="p-2.5 border-r border-zinc-800 font-mono text-purple-300 font-bold whitespace-nowrap">
                                "{strat.suggestedAnchorText}"
                              </td>
                              <td className="p-2.5 text-zinc-300 leading-relaxed">
                                {strat.linkingContext}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: ACTIONABLE DELIVERABLES & CMS COPY BLOCKS */}
              {(activeTab === 'ALL' || activeTab === 'STEP5') && result.step5 && (
                <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center border border-amber-500/40 shrink-0">
                      5
                    </span>
                    <h4 className="text-xs font-bold text-amber-300 uppercase font-mono tracking-wider">
                      STEP 5: Actionable Deliverables &amp; CMS Copy Blocks
                    </h4>
                  </div>

                  {/* Markdown/HTML Comparison Table */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider block">
                      Current Content State vs. Optimized Content State
                    </span>

                    <div className="overflow-x-auto rounded-xl border border-zinc-800">
                      <table className="w-full text-left text-xs font-sans border-collapse">
                        <thead className="bg-zinc-950 text-zinc-400 font-mono text-[10px] uppercase">
                          <tr className="border-b border-zinc-800">
                            <th className="p-3 border-r border-zinc-800 font-bold text-amber-400">SEO Element</th>
                            <th className="p-3 border-r border-zinc-800 font-bold text-rose-400">Current Content State</th>
                            <th className="p-3 border-r border-zinc-800 font-bold text-emerald-400">Optimized Content State</th>
                            <th className="p-3 font-bold text-indigo-400">SEO Impact</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/80 bg-zinc-900">
                          {result.step5.comparisonTable.map((row, idx) => (
                            <tr key={idx} className="hover:bg-zinc-950/60">
                              <td className="p-3 border-r border-zinc-800 font-mono font-bold text-amber-300 whitespace-nowrap">
                                {row.element}
                              </td>
                              <td className="p-3 border-r border-zinc-800 text-zinc-400 leading-relaxed">
                                {row.currentState}
                              </td>
                              <td className="p-3 border-r border-zinc-800 text-zinc-200 font-medium leading-relaxed bg-emerald-950/10">
                                {row.optimizedState}
                              </td>
                              <td className="p-3 font-mono text-[11px]">
                                <span
                                  className={`px-2 py-0.5 rounded font-bold ${
                                    row.impact === 'Critical'
                                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                      : row.impact === 'High'
                                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                      : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                                  }`}
                                >
                                  {row.impact}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Ready to Paste Copy Blocks for CMS */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider block">
                      CMS Ready Copy Blocks (Paste Directly into WordPress / CMS)
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* HTML Head Tags Block */}
                      <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-amber-300 uppercase">
                              HTML &lt;head&gt; Tags
                            </span>
                          </div>
                          <pre className="bg-zinc-950 p-2 rounded font-mono text-[10px] text-zinc-300 border border-zinc-800 overflow-x-auto whitespace-pre-wrap max-h-28">
                            {result.step5.cmsCopyBlocks.htmlHeadBlock}
                          </pre>
                        </div>
                        <button
                          onClick={() => handleCopyText(result.step5.cmsCopyBlocks.htmlHeadBlock, 'headBlock')}
                          className="w-full py-1.5 bg-amber-950/60 hover:bg-amber-900 text-amber-200 font-mono text-[11px] font-bold rounded-lg border border-amber-800/80 flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          {copiedKey === 'headBlock' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'headBlock' ? 'Copied' : 'Copy Head Block'}</span>
                        </button>
                      </div>

                      {/* Answer Box HTML Block */}
                      <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-amber-300 uppercase">
                              Answer-First Callout Block
                            </span>
                          </div>
                          <pre className="bg-zinc-950 p-2 rounded font-mono text-[10px] text-zinc-300 border border-zinc-800 overflow-x-auto whitespace-pre-wrap max-h-28">
                            {result.step5.cmsCopyBlocks.introAnswerBoxBlock}
                          </pre>
                        </div>
                        <button
                          onClick={() => handleCopyText(result.step5.cmsCopyBlocks.introAnswerBoxBlock, 'answerBlock')}
                          className="w-full py-1.5 bg-amber-950/60 hover:bg-amber-900 text-amber-200 font-mono text-[11px] font-bold rounded-lg border border-amber-800/80 flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          {copiedKey === 'answerBlock' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'answerBlock' ? 'Copied' : 'Copy Answer Box'}</span>
                        </button>
                      </div>

                      {/* Heading Structure Block */}
                      <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-amber-300 uppercase">
                              Heading Structure HTML
                            </span>
                          </div>
                          <pre className="bg-zinc-950 p-2 rounded font-mono text-[10px] text-zinc-300 border border-zinc-800 overflow-x-auto whitespace-pre-wrap max-h-28">
                            {result.step5.cmsCopyBlocks.headingStructureBlock}
                          </pre>
                        </div>
                        <button
                          onClick={() => handleCopyText(result.step5.cmsCopyBlocks.headingStructureBlock, 'headingBlock')}
                          className="w-full py-1.5 bg-amber-950/60 hover:bg-amber-900 text-amber-200 font-mono text-[11px] font-bold rounded-lg border border-amber-800/80 flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          {copiedKey === 'headingBlock' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'headingBlock' ? 'Copied' : 'Copy Headings'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
