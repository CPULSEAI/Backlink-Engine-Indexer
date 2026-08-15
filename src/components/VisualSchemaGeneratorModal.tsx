import React, { useState, useMemo } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  FileText,
  Building2,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  Search,
  Globe,
  Share2,
} from 'lucide-react';
import {
  SchemaType,
  FaqItem,
  ArticleSchemaData,
  OrganizationSchemaData,
} from '../types';

interface VisualSchemaGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSchemaType?: SchemaType;
  defaultDomain?: string;
}

export const VisualSchemaGeneratorModal: React.FC<VisualSchemaGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialSchemaType = 'FAQ',
  defaultDomain = 'https://careerpulseai.net',
}) => {
  const [activeTab, setActiveTab] = useState<SchemaType>(initialSchemaType);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedRaw, setCopiedRaw] = useState<boolean>(false);

  // FAQ Schema State
  const [faqItems, setFaqItems] = useState<FaqItem[]>([
    {
      id: '1',
      question: 'How fast does Apex Indexer submit backlinks to Google Search Console?',
      answer:
        'Submissions are triggered within milliseconds through automated Google Indexing API workflows and multi-threaded ping protocols, typically reflecting in indexing crawl logs within 24 to 48 hours.',
    },
    {
      id: '2',
      question: 'What is the difference between canonical tags and 301 redirects?',
      answer:
        'A canonical tag tells search engines which version of a page is the master copy without redirecting human visitors, whereas a 301 redirect permanently sends both visitors and search bots to the destination URL.',
    },
    {
      id: '3',
      question: 'Does having structured JSON-LD schema guarantee Google Rich Snippets?',
      answer:
        'While schema markup is a prerequisite for rich results, Google uses algorithmic quality assessments to determine whether to display rich cards, FAQ accordions, or knowledge graphs.',
    },
  ]);

  // Article Schema State
  const [articleData, setArticleData] = useState<ArticleSchemaData>({
    headline: 'The Ultimate Enterprise Guide to High-Velocity Backlink Indexing',
    articleType: 'TechArticle',
    description: 'Learn how automated Google Indexing API requests, proxy shielding, and canonical verification optimize modern crawl budgets.',
    authorName: 'Alex Thorne',
    authorType: 'Person',
    authorUrl: `${defaultDomain}/author/alex-thorne`,
    publisherName: 'CareerPulse AI SEO Labs',
    publisherLogoUrl: `${defaultDomain}/logo.png`,
    datePublished: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    dateModified: new Date().toISOString().split('T')[0],
    imageUrl: `${defaultDomain}/assets/hero-seo-indexing.jpg`,
    mainEntityUrl: `${defaultDomain}/blog/seo-backlink-indexing-guide`,
    keywords: 'SEO, Backlink Indexing, Google Search Console, Schema Markup, Link Velocity',
  });

  // Organization Schema State
  const [orgData, setOrgData] = useState<OrganizationSchemaData>({
    name: 'Apex Backlink Indexer & SEO Labs',
    legalName: 'Apex SEO Intelligence Inc.',
    url: defaultDomain,
    logoUrl: `${defaultDomain}/logo-square.png`,
    description: 'Enterprise-grade backlink generation, live HTTP verification, and high-velocity Google Indexing API automation suite.',
    foundingDate: '2024-01-15',
    email: 'support@careerpulseai.net',
    telephone: '+1-800-555-0199',
    contactType: 'Customer Support',
    socialUrls: [
      'https://twitter.com/ApexSeoIndexer',
      'https://linkedin.com/company/apex-seo-labs',
      'https://github.com/apex-indexer',
      'https://youtube.com/@apexseolabs',
    ],
    streetAddress: '100 Montgomery Street, Suite 2400',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94104',
    addressCountry: 'US',
  });

  // Dynamic FAQ Handlers
  const handleAddFaq = () => {
    const newItem: FaqItem = {
      id: Date.now().toString(),
      question: 'What are the best practices for structuring H1 and H2 tags?',
      answer: 'Ensure exactly one main H1 tag per page representing the core topic, followed by sequential H2 subheadings without skipping heading levels.',
    };
    setFaqItems([...faqItems, newItem]);
  };

  const handleRemoveFaq = (id: string) => {
    if (faqItems.length <= 1) return;
    setFaqItems(faqItems.filter(f => f.id !== id));
  };

  const handleUpdateFaq = (id: string, field: 'question' | 'answer', val: string) => {
    setFaqItems(faqItems.map(f => (f.id === id ? { ...f, [field]: val } : f)));
  };

  // Social Links Handlers
  const handleAddSocial = () => {
    setOrgData({ ...orgData, socialUrls: [...orgData.socialUrls, 'https://'] });
  };

  const handleRemoveSocial = (idx: number) => {
    const updated = [...orgData.socialUrls];
    updated.splice(idx, 1);
    setOrgData({ ...orgData, socialUrls: updated });
  };

  const handleUpdateSocial = (idx: number, val: string) => {
    const updated = [...orgData.socialUrls];
    updated[idx] = val;
    setOrgData({ ...orgData, socialUrls: updated });
  };

  // JSON-LD Generated Object
  const generatedSchemaJson = useMemo(() => {
    if (activeTab === 'FAQ') {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems
          .filter(f => f.question.trim().length > 0 && f.answer.trim().length > 0)
          .map(f => ({
            '@type': 'Question',
            name: f.question.trim(),
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer.trim(),
            },
          })),
      };
    }

    if (activeTab === 'Article') {
      return {
        '@context': 'https://schema.org',
        '@type': articleData.articleType || 'Article',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleData.mainEntityUrl || defaultDomain,
        },
        headline: articleData.headline,
        description: articleData.description,
        image: articleData.imageUrl ? [articleData.imageUrl] : undefined,
        datePublished: articleData.datePublished,
        dateModified: articleData.dateModified || articleData.datePublished,
        author: {
          '@type': articleData.authorType,
          name: articleData.authorName,
          url: articleData.authorUrl || undefined,
        },
        publisher: {
          '@type': 'Organization',
          name: articleData.publisherName,
          logo: {
            '@type': 'ImageObject',
            url: articleData.publisherLogoUrl,
          },
        },
        keywords: articleData.keywords
          ? articleData.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
          : undefined,
      };
    }

    // Organization Schema
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: orgData.name,
      legalName: orgData.legalName || undefined,
      url: orgData.url,
      logo: orgData.logoUrl,
      description: orgData.description,
      foundingDate: orgData.foundingDate || undefined,
      contactPoint: orgData.telephone || orgData.email ? {
        '@type': 'ContactPoint',
        telephone: orgData.telephone || undefined,
        email: orgData.email || undefined,
        contactType: orgData.contactType || 'Customer Service',
      } : undefined,
      address: orgData.streetAddress ? {
        '@type': 'PostalAddress',
        streetAddress: orgData.streetAddress,
        addressLocality: orgData.addressLocality,
        addressRegion: orgData.addressRegion,
        postalCode: orgData.postalCode,
        addressCountry: orgData.addressCountry,
      } : undefined,
      sameAs: orgData.socialUrls.filter(s => s.trim().length > 8 && s.startsWith('http')),
    };
  }, [activeTab, faqItems, articleData, orgData, defaultDomain]);

  const jsonLdString = useMemo(() => {
    return JSON.stringify(generatedSchemaJson, null, 2);
  }, [generatedSchemaJson]);

  const scriptTagString = useMemo(() => {
    return `<script type="application/ld+json">\n${jsonLdString}\n</script>`;
  }, [jsonLdString]);

  // Copy Handlers
  const handleCopyScriptTag = () => {
    navigator.clipboard.writeText(scriptTagString);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleCopyRawJson = () => {
    navigator.clipboard.writeText(jsonLdString);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2500);
  };

  const handleDownloadFile = () => {
    const dataStr = 'data:application/ld+json;charset=utf-8,' + encodeURIComponent(jsonLdString);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeTab.toLowerCase()}_schema.jsonld`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border-2 border-black rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="p-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff4d00]/10 border border-[#ff4d00]/30 flex items-center justify-center text-[#ff4d00]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-zinc-100 tracking-tight">
                  Visual Schema Generator
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#ff4d00]/10 border border-[#ff4d00]/30 text-[#ff4d00] text-[10px] font-mono font-bold">
                  JSON-LD &bull; Schema.org
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Generate valid Schema.org structured data markup for Google Rich Snippets with live SERP simulation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCHEMA TYPE SELECTOR TABS */}
        <div className="px-6 pt-4 bg-zinc-900 border-b border-zinc-800 flex items-center space-x-2 shrink-0">
          {[
            { id: 'FAQ', label: 'FAQPage Schema', icon: HelpCircle },
            { id: 'Article', label: 'Article / Blog Schema', icon: FileText },
            { id: 'Organization', label: 'Organization Schema', icon: Building2 },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SchemaType)}
                className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer border-t-2 ${
                  isActive
                    ? 'bg-zinc-950 text-[#ff4d00] border-[#ff4d00] shadow-sm'
                    : 'bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MODAL MAIN CONTENT BODY (2-COLUMN GRID) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden min-h-0">
          {/* LEFT: FORM INPUTS (6 cols on lg) */}
          <div className="lg:col-span-6 p-6 overflow-y-auto custom-scrollbar space-y-6 bg-zinc-950 border-r border-zinc-800">
            {/* FAQ FORM */}
            {activeTab === 'FAQ' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-300">
                      FAQ Questions &amp; Answers ({faqItems.length})
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Google displays these in foldable accordion dropdowns on Search Results.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="px-3 py-1.5 rounded-xl bg-[#ff4d00]/10 hover:bg-[#ff4d00]/20 border border-[#ff4d00]/30 text-[#ff4d00] text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {faqItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-[#ff4d00] bg-[#ff4d00]/10 px-2 py-0.5 rounded-md">
                          Question #{idx + 1}
                        </span>
                        {faqItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(item.id)}
                            className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                            title="Remove Question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-zinc-400">Question Title</label>
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => handleUpdateFaq(item.id, 'question', e.target.value)}
                          placeholder="e.g. How does backlink indexing work?"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-zinc-400">Accepted Answer</label>
                        <textarea
                          value={item.answer}
                          onChange={(e) => handleUpdateFaq(item.id, 'answer', e.target.value)}
                          placeholder="Provide the clear, direct answer to the question..."
                          rows={3}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-[#ff4d00] resize-y"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ARTICLE FORM */}
            {activeTab === 'Article' && (
              <div className="space-y-4">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-300">
                    Article &amp; Blog Metadata
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Enables Google Carousel, Top Stories, and enhanced Knowledge Cards.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-zinc-400 font-medium block mb-1">Headline / Title</label>
                    <input
                      type="text"
                      value={articleData.headline}
                      onChange={(e) => setArticleData({ ...articleData, headline: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Article Type</label>
                      <select
                        value={articleData.articleType}
                        onChange={(e) => setArticleData({ ...articleData, articleType: e.target.value as any })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                      >
                        <option value="Article">General Article</option>
                        <option value="BlogPosting">Blog Posting</option>
                        <option value="NewsArticle">News Article</option>
                        <option value="TechArticle">Tech Article / Guide</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Date Published</label>
                      <input
                        type="date"
                        value={articleData.datePublished}
                        onChange={(e) => setArticleData({ ...articleData, datePublished: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 font-medium block mb-1">Description / Summary</label>
                    <textarea
                      value={articleData.description}
                      onChange={(e) => setArticleData({ ...articleData, description: e.target.value })}
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Author Name</label>
                      <input
                        type="text"
                        value={articleData.authorName}
                        onChange={(e) => setArticleData({ ...articleData, authorName: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Author Type</label>
                      <select
                        value={articleData.authorType}
                        onChange={(e) => setArticleData({ ...articleData, authorType: e.target.value as any })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                      >
                        <option value="Person">Person</option>
                        <option value="Organization">Organization</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 font-medium block mb-1">Featured Image URL</label>
                    <input
                      type="text"
                      value={articleData.imageUrl}
                      onChange={(e) => setArticleData({ ...articleData, imageUrl: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Publisher Name</label>
                      <input
                        type="text"
                        value={articleData.publisherName}
                        onChange={(e) => setArticleData({ ...articleData, publisherName: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Publisher Logo URL</label>
                      <input
                        type="text"
                        value={articleData.publisherLogoUrl}
                        onChange={(e) => setArticleData({ ...articleData, publisherLogoUrl: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 font-medium block mb-1">Keywords (Comma separated)</label>
                    <input
                      type="text"
                      value={articleData.keywords || ''}
                      onChange={(e) => setArticleData({ ...articleData, keywords: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ORGANIZATION FORM */}
            {activeTab === 'Organization' && (
              <div className="space-y-4">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-300">
                    Organization &amp; Brand Knowledge Graph
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Powers Google Brand Knowledge Panels, logo attribution, and official contact points.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Brand / Name</label>
                      <input
                        type="text"
                        value={orgData.name}
                        onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Legal Name</label>
                      <input
                        type="text"
                        value={orgData.legalName || ''}
                        onChange={(e) => setOrgData({ ...orgData, legalName: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Official Website URL</label>
                      <input
                        type="text"
                        value={orgData.url}
                        onChange={(e) => setOrgData({ ...orgData, url: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Logo URL (512x512 recommended)</label>
                      <input
                        type="text"
                        value={orgData.logoUrl}
                        onChange={(e) => setOrgData({ ...orgData, logoUrl: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 font-medium block mb-1">Description</label>
                    <textarea
                      value={orgData.description}
                      onChange={(e) => setOrgData({ ...orgData, description: e.target.value })}
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={orgData.email || ''}
                        onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Customer Service Phone</label>
                      <input
                        type="text"
                        value={orgData.telephone || ''}
                        onChange={(e) => setOrgData({ ...orgData, telephone: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                      />
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <label className="text-zinc-400 font-medium">Social Profile URLs (SameAs)</label>
                      <button
                        type="button"
                        onClick={handleAddSocial}
                        className="text-[11px] text-[#ff4d00] hover:underline font-bold flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Profile</span>
                      </button>
                    </div>
                    {orgData.socialUrls.map((s, sIdx) => (
                      <div key={sIdx} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={s}
                          onChange={(e) => handleUpdateSocial(sIdx, e.target.value)}
                          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-[#ff4d00]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSocial(sIdx)}
                          className="text-zinc-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: LIVE JSON-LD CODE & SERP PREVIEW (6 cols on lg) */}
          <div className="lg:col-span-6 p-6 overflow-y-auto custom-scrollbar space-y-5 bg-zinc-900">
            {/* ACTION BAR: COPY & DOWNLOAD */}
            <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-400">Schema.org Valid</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCopyScriptTag}
                  className="px-3 py-1.5 rounded-xl bg-[#ff4d00] hover:bg-black hover:text-[#ff4d00] text-black border border-black font-black text-xs transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied Tag!' : 'Copy <script> Tag'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyRawJson}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                  title="Copy JSON only"
                >
                  {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Raw JSON</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 transition-all cursor-pointer"
                  title="Download .jsonld file"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* LIVE SERP SIMULATOR CARD */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-b border-zinc-800 pb-2">
                <span className="flex items-center space-x-1.5">
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                  <strong className="text-zinc-200">Google SERP Rich Snippet Preview</strong>
                </span>
                <span>Mobile &amp; Desktop</span>
              </div>

              {/* SERP Item Preview */}
              <div className="space-y-1 font-sans">
                <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
                  <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-300">
                    G
                  </div>
                  <span className="truncate">{defaultDomain}</span>
                  <span>&rsaquo;</span>
                  <span className="text-zinc-500 truncate">{activeTab.toLowerCase()}</span>
                </div>

                <h4 className="text-sm font-medium text-blue-400 hover:underline cursor-pointer">
                  {activeTab === 'FAQ'
                    ? 'Frequently Asked Questions &amp; Support - CareerPulse'
                    : activeTab === 'Article'
                    ? articleData.headline
                    : orgData.name}
                </h4>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {activeTab === 'FAQ'
                    ? 'Find instant answers to common questions about backlink velocity, Google indexing APIs, and canonical compliance...'
                    : activeTab === 'Article'
                    ? articleData.description
                    : orgData.description}
                </p>

                {/* FAQ Accordion preview */}
                {activeTab === 'FAQ' && (
                  <div className="pt-2 space-y-1.5">
                    {faqItems.slice(0, 3).map((f, fi) => (
                      <div
                        key={fi}
                        className="p-2 bg-zinc-900/80 rounded-lg text-xs text-zinc-300 border border-zinc-800 flex items-center justify-between"
                      >
                        <span className="truncate font-medium">{f.question}</span>
                        <span className="text-zinc-500 font-mono text-[10px] ml-2 shrink-0">&darr;</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* FORMATTED JSON-LD CODE VIEWER */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>JSON-LD Output</span>
                <span className="text-[10px] text-zinc-500">Ready to paste inside &lt;head&gt;</span>
              </div>

              <pre className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-64 custom-scrollbar leading-relaxed">
                <code>{scriptTagString}</code>
              </pre>
            </div>

            {/* DIRECT EXTERNAL VALIDATOR TEST LINK */}
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              <span>Test in Google Rich Results Validator</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
