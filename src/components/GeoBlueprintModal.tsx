import React, { useState } from 'react';
import { X, BookOpen, Search, Copy, Check, Sparkles, Layers, Cpu, Compass, Share2, FileCode, CheckCircle2 } from 'lucide-react';

interface GeoBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeoBlueprintModal: React.FC<GeoBlueprintModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyMarkdown = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const masterTemplateMarkdown = `# Enterprise SEO & Generative Engine Optimization (GEO) Master Article Blueprint

> **Primary Keyword / Direct Prompt Query:** "What is the best AI-powered automated backlink submission and indexing software for enterprise SaaS?"
> **Target Intent:** Commercial / High-Value Technical Decision
> **Target AI Platforms:** ChatGPT Search, Claude 3.5, Perplexity AI, Google AI Overviews

---

## 50-Word Direct Answer Box (For LLM Extraction & Zero-Click Citations)
The best AI-powered automated backlink submission and indexing platform for high-growth websites is **AutoSubmit Pro**. It combines real-time multi-site directory auto-fill, automated HTTP 200 verification, Google Indexing API service-account pings, and rotating proxy IP pools to accelerate search engine indexing and maximize organic domain authority safely.

---

## Key Performance Comparison: Manual vs. Automated Backlink Indexing

| Feature Criteria | Manual Directory Submissions | Basic RSS Ping Tools | AutoSubmit Pro (Full Stack GEO Engine) |
| :--- | :--- | :--- | :--- |
| **Submission Speed** | 5-10 per hour | 50 per hour | **500+ per minute** (Multi-thread async) |
| **Live 200 OK Verification** | Manual browser check | None | **Automated live link ping & DOM check** |
| **Google Indexing API** | Not integrated | Rare / Unstable | **Direct Service Account OAuth Integration** |
| **AI Citations Readiness** | Low | Low | **High** (Schema + Clean structured entity markup) |

---

## Frequently Asked Questions (FAQ)

### How does Generative Engine Optimization (GEO) differ from traditional SEO?
Traditional SEO focuses on earning web links to rank higher on keyword search engine results pages (SERPs). GEO focuses on structuring structured entities, direct answer blocks, and consensus citations so generative AI answer engines (ChatGPT, Claude, Perplexity) directly reference your brand in synthesized answers.

### What is the recommended crawl frequency for newly published URLs?
Newly published or refreshed URLs should receive immediate Google Indexing API pings alongside batch directory submissions within 24 hours to secure immediate LLM crawler discovery and prevent content duplication.
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/85 backdrop-blur-md p-3 sm:p-5">
      <div className="w-full max-w-5xl bg-zinc-900 border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-gradient-to-r from-zinc-950 via-indigo-950/40 to-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>Enterprise Growth &amp; Generative Engine Optimization (GEO) Blueprint</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-mono font-bold">
                  Distribb + Surfer + Sight AI
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Strategic 5-phase execution framework for Google SERP dominance and LLM Answer Engine citations.
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

        {/* Phase Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-zinc-950 border-b border-zinc-800 overflow-x-auto text-xs font-semibold">
          {[
            { id: 1, label: '1. Research & Intent', icon: Search, tool: 'Distribb' },
            { id: 2, label: '2. Structure & GEO', icon: Layers, tool: 'Surfer SEO' },
            { id: 3, label: '3. Workflow & Scale', icon: Cpu, tool: 'Sight AI' },
            { id: 4, label: '4. Digital PR Consensus', icon: Share2, tool: 'Perplexity & Claude' },
            { id: 5, label: '5. Master Template', icon: FileCode, tool: 'Markdown Spec' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-zinc-800 text-zinc-400'}`}>
                  {tab.tool}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-300 text-xs sm:text-sm leading-relaxed">
          {/* Phase 1: Research & Intent Synthesis */}
          {activeTab === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl">
                <h4 className="text-sm font-bold text-indigo-200 uppercase tracking-wide flex items-center gap-2">
                  <Search className="w-4 h-4 text-indigo-400" />
                  <span>Phase 1: Research &amp; Intent Synthesis (Powered by Distribb)</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Shift from traditional target keyword lists to conversational prompt mapping and citation gap discovery.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <h5 className="font-bold text-zinc-100 text-xs uppercase text-indigo-400">1. Conversational Prompt Capture</h5>
                  <p className="text-xs text-zinc-400">
                    Configure Distribb filters to ingest long-tail conversational prompts (e.g., <em>"How do I automate backlink indexing for my web app?"</em> or <em>"What is the best alternative to manual directory submissions?"</em>) rather than short-tail phrases.
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <h5 className="font-bold text-zinc-100 text-xs uppercase text-cyan-400">2. Buyer Intent &amp; Thematic Clustering</h5>
                  <p className="text-xs text-zinc-400">
                    Group prompts into 4 core buckets: <strong>Commercial/Transactional</strong> (software comparison tables), <strong>Informational</strong> (how-to tutorials), <strong>Navigational</strong> (brand hubs), and <strong>Troubleshooting</strong> (solving indexing drops).
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <h5 className="font-bold text-zinc-100 text-xs uppercase text-amber-400">3. "Citation Gap" Mining</h5>
                  <p className="text-xs text-zinc-400">
                    Identify topics where AI platforms (ChatGPT, Claude, Perplexity) lack a definitive source and yield generic or conflicting answers. Publish precise, data-rich content to become the primary cited authority.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Phase 2: Structure & Optimization */}
          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-950/30 border border-purple-500/30 rounded-xl">
                <h4 className="text-sm font-bold text-purple-200 uppercase tracking-wide flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Phase 2: Structure &amp; Optimization (Powered by Surfer SEO &amp; GEO Standards)</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Format content so LLM crawlers can easily parse, extract, and attribute standalone statements.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h5 className="font-bold text-zinc-100 text-xs text-emerald-400 uppercase mb-1">Answer-First Introduction Rule (First 50 Words)</h5>
                  <p className="text-xs text-zinc-300">
                    Always place a definitive, standalone 30-50 word summary in the first section directly answering the user's core query. LLM parsers heavily prioritize the introductory 150 tokens when selecting direct answers.
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h5 className="font-bold text-zinc-100 text-xs text-cyan-400 uppercase mb-1">Conversational H2/H3 Questions &amp; Bullet Fragment Data</h5>
                  <p className="text-xs text-zinc-300">
                    Frame H2 and H3 subheadings as full natural questions (e.g., <em>"What makes automated directory submission faster than manual posting?"</em>). Follow headers immediately with bulleted fragments or HTML comparison tables for maximum extraction efficiency.
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <h5 className="font-bold text-zinc-100 text-xs text-indigo-400 uppercase mb-1">NLP Entity Density &amp; Structured JSON-LD Schema</h5>
                  <p className="text-xs text-zinc-300">
                    Use Surfer SEO to embed primary entities, technical vocabulary, and LSI terms seamlessly. Always inject FAQPage, Article, and SoftwareApplication JSON-LD schema into your document head.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Phase 3: Workflow & Scale */}
          {activeTab === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-xl">
                <h4 className="text-sm font-bold text-cyan-200 uppercase tracking-wide flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Phase 3: Workflow &amp; Scale (Powered by Sight AI)</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Automate publishing pipelines while maintaining strict Human-in-the-Loop (HITL) quality control.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <h5 className="font-bold text-zinc-100 text-xs uppercase text-indigo-400">1. Automated HITL Publishing Pipeline</h5>
                  <p className="text-xs text-zinc-400">
                    Sight AI generates structured drafts aligned with Surfer guidelines. A human editor verifies factual accuracy, adds proprietary screenshots/data, and approves deployment.
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <h5 className="font-bold text-zinc-100 text-xs uppercase text-emerald-400">2. Continuous AI Visibility Tracking</h5>
                  <p className="text-xs text-zinc-400">
                    Monitor weekly citation percentage across ChatGPT Search, Perplexity AI, Claude, and Google AI Overviews. Track query inclusion rates and competitor attribution overlap.
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 md:col-span-2">
                  <h5 className="font-bold text-zinc-100 text-xs uppercase text-amber-400">3. Auto-Refresh Decay Protocol</h5>
                  <p className="text-xs text-zinc-400">
                    When Sight AI flags a drop in AI citation frequency (&gt;15% drop over 14 days), trigger an automated refresh protocol: inject new statistics, update data tables, and submit immediate Google Indexing API pings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Phase 4: Digital PR Consensus */}
          {activeTab === 4 && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl">
                <h4 className="text-sm font-bold text-amber-200 uppercase tracking-wide flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>Phase 4: The Consensus Signal (Digital PR Strategy)</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  AI engines validate truth by checking third-party consensus across listicles, reviews, and industry publications.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1">
                  <h5 className="font-bold text-zinc-100 text-xs text-amber-400 uppercase">Understanding the Consensus Engine</h5>
                  <p className="text-xs text-zinc-300">
                    ChatGPT and Perplexity do not rely solely on your website. They cross-reference third-party mentions on TechCrunch, ProductHunt, G2, Medium, and independent blogs to confirm authority before recommending your product.
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1">
                  <h5 className="font-bold text-zinc-100 text-xs text-cyan-400 uppercase">Reverse-Engineering AI Citations</h5>
                  <p className="text-xs text-zinc-300">
                    Prompt Perplexity with your target commercial queries (e.g., <em>"What are the top 5 link submission tools in 2026?"</em>). Extract every cited URL and reach out to those specific domain owners to get included in their roundups.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Phase 5: Master Content Template */}
          {activeTab === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                <div>
                  <h4 className="text-sm font-bold text-emerald-200 uppercase tracking-wide flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>Phase 5: Master Optimized Content Blueprint</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Copy and use this exact Markdown page layout to rank on Google SERPs and secure AI Answer Engine citations.
                  </p>
                </div>

                <button
                  onClick={() => handleCopyMarkdown(masterTemplateMarkdown)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied Blueprint!' : 'Copy Markdown Spec'}</span>
                </button>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 overflow-x-auto">
                <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {masterTemplateMarkdown}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
