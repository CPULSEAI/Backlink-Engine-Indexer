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
  ArrowRight
} from 'lucide-react';

interface ContentGraderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  initialKeyword?: string;
}

interface GradeResult {
  overallScore: number;
  answerFirstScore: number;
  entityDensityScore: number;
  schemaScore: number;
  answerFirstAnalysis: string;
  entityAnalysis: string;
  schemaAnalysis: string;
  suggestedAnswerBox: string;
  missingEntities: string[];
  recommendedActionItems: string[];
  competitiveBenchmark: {
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
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [copiedAnswer, setCopiedAnswer] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (initialUrl) setUrl(initialUrl);
    if (initialKeyword) setKeyword(initialKeyword);
  }, [initialUrl, initialKeyword]);

  if (!isOpen) return null;

  const handleGradePage = async () => {
    if (!url.trim() || !keyword.trim()) {
      toast.error('Please enter both target URL and focus keyword');
      return;
    }

    let cleanTargetUrl = url.trim();
    while (cleanTargetUrl.match(/^(https?:\/\/)+/i)) {
      cleanTargetUrl = cleanTargetUrl.replace(/^(https?:\/\/)+/i, '');
    }
    cleanTargetUrl = `https://${cleanTargetUrl.replace(/^\/+/, '')}`;
    setUrl(cleanTargetUrl);

    setLoading(true);
    setErrorMsg('');
    const toastId = toast.loading('Evaluating page GEO content score & answer-first structure...');

    try {
      const resp = await fetch('/api/grade-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanTargetUrl, keyword: keyword.trim() }),
      });

      if (!resp.ok) {
        throw new Error('Failed to grade content page');
      }

      const data = await resp.json();
      setResult(data);
      toast.success(`GEO Content Grading Complete! Overall Score: ${data.overallScore}/100`, { id: toastId });
    } catch (e: any) {
      console.error('Grading Error:', e);
      const msg = e.message || 'Error occurred while grading page';
      setErrorMsg(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAnswer = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAnswer(true);
    toast.success('Copied Answer-First callout snippet to clipboard!');
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/85 backdrop-blur-md p-3 sm:p-5">
      <div className="w-full max-w-4xl bg-zinc-900 border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-gradient-to-r from-zinc-950 via-purple-950/30 to-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>Gemini AI Content &amp; GEO Grader</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30 font-mono font-bold">
                  Gemini 2.5 Flash Engine
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Evaluate Answer-First conciseness, NLP entity density, and JSON-LD schema against competitive benchmarks.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <div className="md:col-span-6">
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Target Page URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourdomain.com/blog/page"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Target Prompt / Keyword</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. best backlink submitter"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                onClick={handleGradePage}
                disabled={loading || !url.trim() || !keyword.trim()}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20 shrink-0"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{loading ? 'Grading...' : 'Grade Page'}</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Render Results */}
          {result && (
            <div className="space-y-5 animate-fadeIn">
              {/* Overall Score Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-4 rounded-xl border border-zinc-800">
                <div className="sm:col-span-1 flex flex-col items-center justify-center text-center p-3 bg-zinc-950/80 rounded-xl border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Overall GEO &amp; SEO Score</span>
                  <span className={`text-3xl font-black font-mono mt-1 ${
                    result.overallScore >= 80 ? 'text-emerald-400' : result.overallScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {result.overallScore}<span className="text-xs text-zinc-500 font-normal">/100</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                    result.overallScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {result.overallScore >= 80 ? 'LLM Citation Ready' : 'Optimization Required'}
                  </span>
                </div>

                {/* 3 Pillar Progress Bars */}
                <div className="sm:col-span-3 space-y-2.5 flex flex-col justify-center">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-zinc-300 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Answer-First Structure (First 50 Words)
                      </span>
                      <span className="font-mono font-bold text-zinc-200">{result.answerFirstScore}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                      <div
                        className="bg-amber-400 h-full transition-all duration-500"
                        style={{ width: `${result.answerFirstScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-zinc-300 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        Entity Density &amp; Topic Coverage
                      </span>
                      <span className="font-mono font-bold text-zinc-200">{result.entityDensityScore}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                      <div
                        className="bg-cyan-400 h-full transition-all duration-500"
                        style={{ width: `${result.entityDensityScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-zinc-300 flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                        JSON-LD Schema &amp; Structured Data
                      </span>
                      <span className="font-mono font-bold text-zinc-200">{result.schemaScore}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                      <div
                        className="bg-indigo-400 h-full transition-all duration-500"
                        style={{ width: `${result.schemaScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Competitive Benchmark Row */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <h4 className="text-xs font-bold uppercase text-zinc-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Competitive Benchmark Comparison</span>
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                  <div className="p-2.5 bg-zinc-900 rounded-xl border border-indigo-500/30">
                    <span className="text-[10px] text-indigo-300 block font-bold">Your Page</span>
                    <span className="text-base font-black text-indigo-200">{result.competitiveBenchmark.userScore}%</span>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded-xl border border-cyan-500/30">
                    <span className="text-[10px] text-cyan-300 block font-bold">Top SERP Competitor</span>
                    <span className="text-base font-black text-cyan-200">{result.competitiveBenchmark.topCompetitorScore}%</span>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block font-bold">Industry Average</span>
                    <span className="text-base font-black text-zinc-300">{result.competitiveBenchmark.industryAvg}%</span>
                  </div>
                </div>
              </div>

              {/* Suggested Answer-Box Snippet */}
              <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Gemini AI Recommended "Answer-First" Box (First 50 Words)</span>
                  </h4>
                  <button
                    onClick={() => handleCopyAnswer(result.suggestedAnswerBox)}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all border border-amber-500/30"
                  >
                    {copiedAnswer ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAnswer ? 'Copied!' : 'Copy Snippet'}</span>
                  </button>
                </div>
                <p className="text-xs font-mono text-zinc-200 p-3 bg-zinc-950 rounded-lg border border-amber-500/20 leading-relaxed">
                  "{result.suggestedAnswerBox}"
                </p>
              </div>

              {/* Missing LSI Entities */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
                  Missing High-Intent LSI Entities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingEntities.map((entity, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-mono font-medium"
                    >
                      + {entity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations Checklist */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Actionable Optimization Protocol</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {result.recommendedActionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                      <span className="text-emerald-400 font-bold shrink-0">#{idx + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
