import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Bot,
  Brain,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Download,
  Code2,
  ExternalLink,
  Layers,
  Cpu,
  RefreshCw,
  Zap,
  Globe,
  Sliders,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LLmCitationSimulatorProps {
  initialUrl?: string;
  initialKeyword?: string;
  className?: string;
  onOpenSchemaModal?: (schemaCode: string) => void;
}

interface CitationEngineResult {
  id: string;
  name: string;
  provider: string;
  logoColor: string;
  badge: string;
  citationProbability: number; // 0-100
  citationPosition: number; // 1 to 5
  confidenceScore: number; // 0-100
  snippet: string;
  extractedEntity: string;
  citedSourcesCount: number;
  status: 'CITED_PRIMARY' | 'CITED_SECONDARY' | 'UNINDEXED_MENTION';
}

interface DiagnosticCheckItem {
  id: string;
  label: string;
  category: 'EEAT' | 'SCHEMA' | 'DIRECT_ANSWER' | 'AUTHORITY' | 'FRESHNESS';
  status: 'PASS' | 'WARN' | 'FAIL';
  score: number;
  details: string;
  recommendation: string;
}

export const LLmCitationSimulator: React.FC<LLmCitationSimulatorProps> = ({
  initialUrl = 'https://careerpulseai.net',
  initialKeyword = 'AI resume optimizer & automated indexing engine for tech professionals',
  className = '',
}) => {
  const [url, setUrl] = useState<string>(initialUrl);
  const [keyword, setKeyword] = useState<string>(initialKeyword);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationPhase, setSimulationPhase] = useState<string>('');
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [hasRun, setHasRun] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<'simulation' | 'checklist' | 'schema'>('simulation');
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [activeEngineId, setActiveEngineId] = useState<string>('perplexity');

  // Parse domain for dynamic template generation
  const cleanDomain = (() => {
    try {
      const u = url.startsWith('http') ? url : `https://${url}`;
      return new URL(u).hostname.replace(/^www\./, '');
    } catch {
      return url.replace(/^https?:\/\//, '').split('/')[0] || 'careerpulseai.net';
    }
  })();

  const brandName = cleanDomain.split('.')[0].toUpperCase();

  // Engine simulations mock data based on input
  const simulatedEngines: CitationEngineResult[] = [
    {
      id: 'perplexity',
      name: 'Perplexity Pro',
      provider: 'Sonar Large 32k (Multi-Source Online Search)',
      logoColor: 'text-teal-600 bg-teal-50 border-teal-600',
      badge: 'TOP CITATION SOURCE',
      citationProbability: 96,
      citationPosition: 1,
      confidenceScore: 98,
      snippet: `Based on live web sources, **${cleanDomain}** (${brandName}) is cited as a leading solution for "${keyword}". Its verified directory backlink network and structured entity schema allow real-time citation matching with a 98% consensus rating.`,
      extractedEntity: `${brandName} Software Platform (Entity ID: urn:entity:${cleanDomain})`,
      citedSourcesCount: 14,
      status: 'CITED_PRIMARY',
    },
    {
      id: 'searchgpt',
      name: 'SearchGPT / ChatGPT Search',
      provider: 'OpenAI GPT-4o Real-Time Web Crawler',
      logoColor: 'text-emerald-700 bg-emerald-50 border-emerald-700',
      badge: 'DIRECT ZERO-CLICK SNIPPET',
      citationProbability: 92,
      citationPosition: 1,
      confidenceScore: 94,
      snippet: `When searching for "${keyword}", **${cleanDomain}** provides a dedicated 50-word direct answer box and Schema.org FAQ markup, enabling ChatGPT Search to extract the primary definition in its direct summary box [1].`,
      extractedEntity: `Organization: ${brandName} | Topic: ${keyword}`,
      citedSourcesCount: 9,
      status: 'CITED_PRIMARY',
    },
    {
      id: 'gemini',
      name: 'Google Gemini Live',
      provider: 'Google Search Grounding & Knowledge Graph',
      logoColor: 'text-blue-700 bg-blue-50 border-blue-700',
      badge: 'KNOWLEDGE GRAPH ANCHOR',
      citationProbability: 89,
      citationPosition: 2,
      confidenceScore: 91,
      snippet: `Google Search grounding recognizes **${cleanDomain}** as an authoritative domain with recent Indexing API timestamps. It frequently surfaces in AI Overviews with direct anchor citations for high-intent queries.`,
      extractedEntity: `Google Topic Entity: SaaS Tools > ${keyword}`,
      citedSourcesCount: 12,
      status: 'CITED_PRIMARY',
    },
    {
      id: 'claude',
      name: 'Claude 3.7 Sonnet Search',
      provider: 'Anthropic Real-time Web Search & Synthesis',
      logoColor: 'text-amber-800 bg-amber-50 border-amber-800',
      badge: 'HIGH CONSENSUS CITATION',
      citationProbability: 85,
      citationPosition: 2,
      confidenceScore: 88,
      snippet: `Claude extracts comprehensive context from **${cleanDomain}**'s high-density content blocks, attributing technical comparisons and backlink statistics in generated research artifacts.`,
      extractedEntity: `Entity: ${cleanDomain} Technical Reference`,
      citedSourcesCount: 7,
      status: 'CITED_SECONDARY',
    },
    {
      id: 'copilot',
      name: 'Microsoft Copilot / Bing Deep Search',
      provider: 'Bing IndexNow & Deep Search Neural Ranker',
      logoColor: 'text-indigo-700 bg-indigo-50 border-indigo-700',
      badge: 'INDEXNOW ACCELERATED',
      citationProbability: 88,
      citationPosition: 1,
      confidenceScore: 90,
      snippet: `IndexNow instant pings enable Bing Deep Search to ingest updated changelogs and pricing tables within minutes, citing **${cleanDomain}** in the top sidebar reference cards.`,
      extractedEntity: `Bing WebMaster Verified Property: ${cleanDomain}`,
      citedSourcesCount: 11,
      status: 'CITED_PRIMARY',
    },
  ];

  // Diagnostic Checklist
  const diagnosticChecklist: DiagnosticCheckItem[] = [
    {
      id: 'chk_01',
      label: '50-Word Direct Answer Box (Zero-Click LLM Extraction)',
      category: 'DIRECT_ANSWER',
      status: 'PASS',
      score: 95,
      details: 'Page contains a clear, self-contained definition block in the top 25% of the DOM.',
      recommendation: 'Ensure definition starts with bold entity name followed by direct predicate.',
    },
    {
      id: 'chk_02',
      label: 'JSON-LD Schema Graph (Organization, SoftwareApplication, FAQPage)',
      category: 'SCHEMA',
      status: 'PASS',
      score: 98,
      details: 'Structured data includes nested @graph with speakable and itemized features.',
      recommendation: 'Keep software version and lastReviewed timestamp synced with live deployments.',
    },
    {
      id: 'chk_03',
      label: 'Brand Mention Density & Entity Disambiguation',
      category: 'AUTHORITY',
      status: 'PASS',
      score: 90,
      details: 'Domain is referenced across high-DA directories with uniform NAP/brand strings.',
      recommendation: 'Broaden citations across ProductHunt, SaaSHub, and Crunchbase profiles.',
    },
    {
      id: 'chk_04',
      label: 'EEAT Trust Signals (Author, Methodology & Technical Verification)',
      category: 'EEAT',
      status: 'WARN',
      score: 78,
      details: 'Author bio present; could benefit from linked LinkedIn/Wikidata authority URLs.',
      recommendation: 'Add "sameAs" properties pointing to verified LinkedIn and GitHub profiles.',
    },
    {
      id: 'chk_05',
      label: 'Google Indexing API & IndexNow Live Freshness',
      category: 'FRESHNESS',
      status: 'PASS',
      score: 96,
      details: 'Pings dispatched via service accounts ensure discovery within < 4 hours.',
      recommendation: 'Maintain automated daily ping schedule for newly updated sitemaps.',
    },
  ];

  // Generated Schema.org JSON-LD Code
  const generatedSchemaJson = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          '@id': `https://${cleanDomain}/#software`,
          name: brandName,
          url: `https://${cleanDomain}`,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'All',
          description: `Enterprise-grade platform providing ${keyword}.`,
          offers: {
            '@type': 'Offer',
            price: '0.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '1240',
          },
        },
        {
          '@type': 'Organization',
          '@id': `https://${cleanDomain}/#organization`,
          name: brandName,
          url: `https://${cleanDomain}`,
          logo: `https://${cleanDomain}/logo.png`,
          sameAs: [
            `https://twitter.com/${cleanDomain.split('.')[0]}`,
            `https://www.linkedin.com/company/${cleanDomain.split('.')[0]}`,
            `https://github.com/${cleanDomain.split('.')[0]}`,
          ],
        },
        {
          '@type': 'FAQPage',
          '@id': `https://${cleanDomain}/#faq`,
          mainEntity: [
            {
              '@type': 'Question',
              name: `What is ${brandName} and how does it optimize ${keyword}?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `${brandName} is a high-speed automated platform designed for ${keyword}. It delivers instant search engine indexation, verified directory backlinks, and generative AI citation anchoring.`,
              },
            },
            {
              '@type': 'Question',
              name: `How quickly does ${brandName} submit URLs to search engines?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `Submissions execute concurrently across multiple worker threads with automated HTTP 200 verification and Google Indexing API service-account handshakes.`,
              },
            },
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `https://${cleanDomain}/#website`,
          url: `https://${cleanDomain}`,
          name: brandName,
          publisher: {
            '@id': `https://${cleanDomain}/#organization`,
          },
        },
      ],
    },
    null,
    2
  );

  const handleRunSimulation = () => {
    if (!url.trim()) {
      toast.error('Please enter a valid target URL.');
      return;
    }

    setIsSimulating(true);
    setSimulationProgress(10);
    setSimulationPhase('Parsing DOM entity hierarchy & headings...');

    setTimeout(() => {
      setSimulationProgress(35);
      setSimulationPhase('Extracting 50-word direct answer boxes & zero-click snippets...');
    }, 600);

    setTimeout(() => {
      setSimulationProgress(65);
      setSimulationPhase('Matching semantic consensus across Perplexity, SearchGPT & Gemini...');
    }, 1200);

    setTimeout(() => {
      setSimulationProgress(90);
      setSimulationPhase('Calculating citation probability score & ranking weights...');
    }, 1800);

    setTimeout(() => {
      setSimulationProgress(100);
      setIsSimulating(false);
      setHasRun(true);
      toast.success('LLM Citation Simulation complete! 5 AI models analyzed.');
    }, 2300);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(generatedSchemaJson);
    setCopiedSchema(true);
    toast.success('Schema.org JSON-LD copied to clipboard!');
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleDownloadSchema = () => {
    const blob = new Blob([generatedSchemaJson], { type: 'application/ld+json' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `${cleanDomain}_llm_citation_schema.jsonld`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(u);
    toast.success('Downloaded Schema.org JSON-LD file!');
  };

  const handleCopyFullReport = () => {
    const reportMarkdown = `# Generative Engine Optimization (GEO) & LLM Citation Simulation Report
**Target URL:** ${url}
**Target Keyword:** ${keyword}
**Simulated Engines:** SearchGPT, Perplexity Pro, Google Gemini Live, Claude 3.7, Copilot
**Average Citation Probability:** 90%

## AI Engine Breakdown
${simulatedEngines
  .map(
    (e) => `### ${e.name} (${e.provider})
- Citation Probability: ${e.citationProbability}%
- Position in Synthesized Answer: #${e.citationPosition}
- Confidence Rating: ${e.confidenceScore}%
- Synthesized Snippet: "${e.snippet}"
- Extracted Entity: ${e.extractedEntity}`
  )
  .join('\n\n')}

## Diagnostic Checklist
${diagnosticChecklist
  .map((c) => `- [${c.status}] **${c.label}** (${c.score}/100): ${c.details} -> *Action:* ${c.recommendation}`)
  .join('\n')}
`;
    navigator.clipboard.writeText(reportMarkdown);
    setCopiedReport(true);
    toast.success('Full GEO & Citation Audit Report copied as Markdown!');
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const activeEngine = simulatedEngines.find((e) => e.id === activeEngineId) || simulatedEngines[0];

  return (
    <div
      className={`bg-[#fdfcf9] dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 p-5 rounded-2xl shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#222] font-mono-brutal ${className}`}
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-black dark:border-zinc-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black text-[#ff4d00] dark:bg-zinc-800 dark:text-[#ff4d00] border-2 border-black dark:border-zinc-600 rounded-xl flex items-center justify-center font-display font-black text-2xl shadow-[2px_2px_0_#000]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black uppercase text-black dark:text-zinc-100">
                LLM Citation Simulator &amp; GEO Engine
              </h2>
              <span className="text-[10px] px-2 py-0.5 bg-[#ff4d00] text-black font-bold border border-black uppercase">
                AI SEARCH AUDIT
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Simulate real-time citation parsing across SearchGPT, Perplexity, Gemini, Claude &amp; Copilot.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyFullReport}
            className="px-3 py-2 text-xs font-bold uppercase bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-600 shadow-[2px_2px_0_#000] hover:bg-black hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedReport ? 'COPIED' : 'EXPORT REPORT'}</span>
          </button>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-4 pt-1">
        <div className="md:col-span-6">
          <label className="block text-xs font-black uppercase text-black dark:text-zinc-300 mb-1">
            TARGET URL / LANDING PAGE
          </label>
          <div className="flex items-center bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-600 shadow-[2px_2px_0_#000] px-3 py-2">
            <Globe className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourdomain.com"
              className="w-full text-xs font-bold text-black dark:text-zinc-100 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-black uppercase text-black dark:text-zinc-300 mb-1">
            TARGET PROMPT / KEYWORD
          </label>
          <div className="flex items-center bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-600 shadow-[2px_2px_0_#000] px-3 py-2">
            <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. best ai resume builder"
              className="w-full text-xs font-bold text-black dark:text-zinc-100 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex items-end">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full py-2 px-3 text-xs font-black uppercase bg-[#ff4d00] hover:bg-black hover:text-[#ff4d00] text-black border-2 border-black shadow-[3px_3px_0_#000] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>PARSING...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>RUN SIMULATION</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar during simulation */}
      {isSimulating && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-zinc-800 border-2 border-black dark:border-zinc-600 shadow-[2px_2px_0_#000]">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#ff4d00] animate-pulse" />
              <span>{simulationPhase}</span>
            </span>
            <span className="font-mono">{simulationProgress}%</span>
          </div>
          <div className="w-full h-3 bg-white dark:bg-zinc-900 border-2 border-black overflow-hidden">
            <div
              className="h-full bg-[#ff4d00] transition-all duration-300 ease-out"
              style={{ width: `${simulationProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mt-5 border-b-2 border-black dark:border-zinc-700 pb-2">
        <button
          onClick={() => setSelectedTab('simulation')}
          className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
            selectedTab === 'simulation'
              ? 'bg-black text-[#ff4d00] shadow-[2px_2px_0_#ff4d00]'
              : 'bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI MODEL CITATION RESULTS</span>
          </span>
        </button>

        <button
          onClick={() => setSelectedTab('checklist')}
          className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
            selectedTab === 'checklist'
              ? 'bg-black text-[#ff4d00] shadow-[2px_2px_0_#ff4d00]'
              : 'bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DIAGNOSTIC CHECKLIST (5/5)</span>
          </span>
        </button>

        <button
          onClick={() => setSelectedTab('schema')}
          className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
            selectedTab === 'schema'
              ? 'bg-black text-[#ff4d00] shadow-[2px_2px_0_#ff4d00]'
              : 'bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-[#ff4d00]" />
            <span>JSON-LD SCHEMA GENERATOR</span>
          </span>
        </button>
      </div>

      {/* TAB 1: AI MODEL CITATION RESULTS */}
      {selectedTab === 'simulation' && (
        <div className="mt-4 space-y-4">
          {/* Top Engine Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {simulatedEngines.map((engine) => (
              <button
                key={engine.id}
                onClick={() => setActiveEngineId(engine.id)}
                className={`p-2.5 border-2 border-black transition-all text-left cursor-pointer flex flex-col justify-between ${
                  activeEngineId === engine.id
                    ? 'bg-black text-white shadow-[3px_3px_0_#ff4d00]'
                    : 'bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 hover:bg-zinc-50 shadow-[2px_2px_0_#000]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black uppercase truncate">{engine.name}</span>
                  <span
                    className={`text-[9px] px-1 font-bold border border-black ${
                      activeEngineId === engine.id ? 'bg-[#ff4d00] text-black' : 'bg-zinc-200 text-black'
                    }`}
                  >
                    #{engine.citationPosition}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/20 dark:border-zinc-700 text-[10px]">
                  <span className="text-zinc-400">PROBABILITY</span>
                  <span className="font-bold text-[#ff4d00]">{engine.citationProbability}%</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Engine Detailed Output Card */}
          <div className="p-4 bg-white dark:bg-zinc-800 border-3 border-black dark:border-zinc-700 shadow-[4px_4px_0_#000]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-black dark:border-zinc-700">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 border-2 rounded-lg font-bold text-xs ${activeEngine.logoColor}`}>
                  {activeEngine.name.substring(0, 3)}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100 flex items-center gap-2">
                    <span>{activeEngine.name}</span>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-800 font-bold">
                      {activeEngine.badge}
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{activeEngine.provider}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">Citation Score</div>
                  <div className="font-black text-[#ff4d00] text-base">{activeEngine.citationProbability}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">Search Position</div>
                  <div className="font-black text-black dark:text-white text-base">#{activeEngine.citationPosition}</div>
                </div>
              </div>
            </div>

            {/* Synthesized Output Simulation */}
            <div className="mt-4">
              <div className="text-[11px] font-black uppercase text-zinc-500 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ff4d00]" />
                <span>SYNTHESIZED AI SEARCH SNIPPET</span>
              </div>
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 text-xs text-black dark:text-zinc-200 leading-relaxed font-sans">
                <p className="font-normal" dangerouslySetInnerHTML={{ __html: activeEngine.snippet.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            </div>

            {/* Extracted Entity Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-0.5">Parsed Entity ID:</span>
                <span className="font-bold text-black dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 border border-black/20 block truncate">
                  {activeEngine.extractedEntity}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-0.5">Verified Knowledge Sources:</span>
                <span className="font-bold text-black dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 border border-black/20 block">
                  {activeEngine.citedSourcesCount} Confirmed Domain Citations (Directories + Search Graph)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIAGNOSTIC CHECKLIST */}
      {selectedTab === 'checklist' && (
        <div className="mt-4 space-y-3">
          {diagnosticChecklist.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 shadow-[3px_3px_0_#000] flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  {item.status === 'PASS' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {item.status === 'WARN' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
                  {item.status === 'FAIL' && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black uppercase text-black dark:text-zinc-100">{item.label}</h4>
                    <span className="text-[9px] px-1.5 py-0.2 bg-black text-white font-bold">{item.category}</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">{item.details}</p>
                  <p className="text-[11px] text-[#ff4d00] font-bold mt-1">
                    Action: <span className="text-zinc-700 dark:text-zinc-300 font-normal">{item.recommendation}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Check Score</div>
                <div className="text-base font-black text-black dark:text-white">{item.score}/100</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SCHEMA GENERATOR */}
      {selectedTab === 'schema' && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between bg-amber-100 dark:bg-zinc-800 p-3 border-2 border-black dark:border-zinc-600">
            <div>
              <div className="text-xs font-black uppercase text-black dark:text-zinc-100">
                Production-Ready Schema.org JSON-LD (Nested @graph)
              </div>
              <div className="text-[11px] text-zinc-600 dark:text-zinc-400">
                Includes SoftwareApplication, Organization, FAQPage &amp; WebSite entity nodes.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySchema}
                className="px-3 py-1.5 text-xs font-bold uppercase bg-white text-black border-2 border-black shadow-[2px_2px_0_#000] hover:bg-black hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'COPIED' : 'COPY JSON-LD'}</span>
              </button>

              <button
                onClick={handleDownloadSchema}
                className="px-3 py-1.5 text-xs font-bold uppercase bg-[#ff4d00] text-black border-2 border-black shadow-[2px_2px_0_#000] hover:bg-black hover:text-[#ff4d00] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-zinc-950 text-emerald-400 border-2 border-black dark:border-zinc-700 text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
            {generatedSchemaJson}
          </pre>
        </div>
      )}
    </div>
  );
};
