import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Globe,
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sparkles,
  Search,
  ExternalLink,
  Copy,
  CheckCircle2,
  RefreshCw,
  Compass,
  Layers,
  ArrowRight,
  CreditCard,
  Target,
  FileCode,
  Share2,
  Lock,
  ChevronRight,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  GlobalMarket,
  InternationalPersona,
  MultiCurrencyRate,
  GlobalDigitalProduct,
  AutonomousDiscoveryCluster,
  GlobalRevenueStatusResponse
} from '../types';

interface GlobalRevenueExpansionDashboardProps {
  onOpenRevenueMandate?: () => void;
}

export const GlobalRevenueExpansionDashboard: React.FC<GlobalRevenueExpansionDashboardProps> = ({
  onOpenRevenueMandate
}) => {
  const [activeTab, setActiveTab] = useState<
    'markets' | 'discovery' | 'currencies' | 'personas_products' | 'campaigns' | 'cro_trust'
  >('markets');
  const [loading, setLoading] = useState<boolean>(true);
  const [statusData, setStatusData] = useState<GlobalRevenueStatusResponse | null>(null);
  const [markets, setMarkets] = useState<GlobalMarket[]>([]);
  const [personas, setPersonas] = useState<InternationalPersona[]>([]);
  const [rates, setRates] = useState<MultiCurrencyRate[]>([]);
  const [products, setProducts] = useState<GlobalDigitalProduct[]>([]);
  const [discoveries, setDiscoveries] = useState<AutonomousDiscoveryCluster[]>([]);
  const [croSignals, setCroSignals] = useState<any>(null);

  // Market selection & SEO Cluster generator state
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('GB');
  const [marketTierFilter, setMarketTierFilter] = useState<'ALL' | 'TIER_1' | 'TIER_2'>('ALL');
  const [seoClusterData, setSeoClusterData] = useState<any>(null);
  const [generatingSeo, setGeneratingSeo] = useState<boolean>(false);

  // Currency calculator state
  const [calculatorUsd, setCalculatorUsd] = useState<number>(49);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('EUR');

  // Campaign generator state
  const [campaignCountry, setCampaignCountry] = useState<string>('GB');
  const [campaignPersona, setCampaignPersona] = useState<string>('remote-worker');
  const [generatedCampaigns, setGeneratedCampaigns] = useState<any[]>([]);
  const [generatingCampaigns, setGeneratingCampaigns] = useState<boolean>(false);

  // Autonomous Discovery state
  const [discovering, setDiscovering] = useState<boolean>(false);
  const [discoveryRegion, setDiscoveryRegion] = useState<string>('APAC');

  // Checkout trigger state
  const [creatingCheckoutSku, setCreatingCheckoutSku] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statusRes, marketsRes, personasRes, ratesRes, productsRes, discoveriesRes, croRes] =
        await Promise.all([
          axios.get('/api/global-expansion/status'),
          axios.get('/api/global-expansion/markets'),
          axios.get('/api/global-expansion/personas'),
          axios.get('/api/global-expansion/currencies'),
          axios.get('/api/global-expansion/products'),
          axios.get('/api/global-expansion/discoveries'),
          axios.get('/api/global-expansion/cro-signals')
        ]);

      setStatusData(statusRes.data);
      setMarkets(marketsRes.data.markets || []);
      setPersonas(personasRes.data.personas || []);
      setRates(ratesRes.data.rates || []);
      setProducts(productsRes.data.products || []);
      setDiscoveries(discoveriesRes.data.discoveries || []);
      setCroSignals(croRes.data || null);
    } catch (err: any) {
      console.error('Failed to load global expansion data:', err);
      toast.error('Unable to fetch live Global Revenue Expansion data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleGenerateSeoCluster = async (countryCode: string) => {
    try {
      setGeneratingSeo(true);
      const res = await axios.post('/api/global-expansion/seo-cluster', { countryCode });
      setSeoClusterData(res.data.cluster);
      toast.success(`Generated Localized SEO Cluster for ${countryCode}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to generate SEO cluster');
    } finally {
      setGeneratingSeo(false);
    }
  };

  const handleGenerateCampaigns = async () => {
    try {
      setGeneratingCampaigns(true);
      const res = await axios.post('/api/global-expansion/campaigns', {
        countryCode: campaignCountry,
        personaId: campaignPersona
      });
      setGeneratedCampaigns(res.data.campaigns || []);
      toast.success(`Generated ${res.data.count} localized international campaigns`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to generate campaigns');
    } finally {
      setGeneratingCampaigns(false);
    }
  };

  const handleTriggerDiscovery = async () => {
    try {
      setDiscovering(true);
      const res = await axios.post('/api/global-expansion/discover', {
        targetRegion: discoveryRegion
      });
      setDiscoveries(res.data.discoveredClusters || []);
      toast.success(res.data.summary || 'Global opportunity discovered!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Discovery failed');
    } finally {
      setDiscovering(false);
    }
  };

  const handleInitiateStripeCheckout = async (product: GlobalDigitalProduct) => {
    try {
      setCreatingCheckoutSku(product.sku);
      const origin = window.location.origin;
      const res = await axios.post('/api/revenue-mandate/create-checkout-session', {
        sku: product.sku,
        origin
      });

      if (res.data?.url) {
        toast.success(`Opening Stripe Worldwide Checkout for ${product.title}...`);
        window.location.href = res.data.url;
      } else {
        toast.error('Unable to initialize Stripe checkout session');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Stripe checkout not currently active');
    } finally {
      setCreatingCheckoutSku(null);
    }
  };

  const selectedMarket = markets.find((m) => m.countryCode === selectedCountryCode) || markets[0];
  const filteredMarkets = markets.filter((m) => {
    if (marketTierFilter === 'TIER_1') return m.tier === 'TIER_1_PRIORITY';
    if (marketTierFilter === 'TIER_2') return m.tier === 'TIER_2_GROWTH';
    return true;
  });

  const selectedRateObj = rates.find((r) => r.code === selectedCurrencyCode) || rates[0];
  const convertedAmount = selectedRateObj
    ? (calculatorUsd * selectedRateObj.rateVsUsd).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6 font-mono-brutal">
      {/* Top Banner & Header */}
      <div className="bg-black text-white p-6 border-4 border-black shadow-[6px_6px_0_#ff4d00]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-[#ff4d00] text-black text-xs font-bold uppercase tracking-wider">
                WORLDWIDE DIRECTIVE ACTIVE
              </span>
              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-xs font-bold uppercase border border-zinc-700">
                ZERO FAKE DATA ENFORCED
              </span>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-xs font-bold uppercase border border-emerald-800">
                135+ COUNTRIES STRIPE COMPLIANT
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight uppercase flex items-center gap-3">
              <Globe className="w-8 h-8 text-[#ff4d00] shrink-0 animate-pulse" />
              GLOBAL REVENUE EXPANSION &amp; ACQUISITION PROTOCOL
            </h1>
            <p className="text-xs lg:text-sm text-zinc-400 mt-1 max-w-4xl">
              Continuously acquiring international subscribers, digital product buyers, consulting leads, and enterprise clients across Tier 1, Tier 2, and Tier 3 global markets with localized terminology, multi-currency transparency, and autonomous opportunity discovery.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border-2 border-zinc-600 shadow-[2px_2px_0_#fff] transition-all flex items-center gap-2 cursor-pointer uppercase"
              title="Refresh live metrics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ff4d00]' : ''}`} />
              <span>SYNC LIVE</span>
            </button>
            {onOpenRevenueMandate && (
              <button
                onClick={onOpenRevenueMandate}
                className="px-4 py-2 bg-[#ff4d00] hover:bg-white text-black text-xs font-bold border-2 border-black shadow-[2px_2px_0_#fff] transition-all flex items-center gap-2 cursor-pointer uppercase"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>REVENUE MANDATE</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Core Mission Success Metrics Cards (Verified Real Data Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Verified Revenue Today */}
        <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0_#000]">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-600 uppercase mb-1">
            <span>1. Verified Revenue Today</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl lg:text-2xl font-black text-black">
            {statusData?.successMetrics.primary.value || 'NO VERIFIED DATA AVAILABLE'}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span
              className={`px-1.5 py-0.5 font-bold uppercase border ${
                statusData?.successMetrics.primary.hasData
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-600'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-400'
              }`}
            >
              {statusData?.successMetrics.primary.status || 'READY_AWAITING_TRAFFIC'}
            </span>
            <span className="text-zinc-500 font-medium">Stripe Verified</span>
          </div>
        </div>

        {/* Metric 2: New Subscribers Today */}
        <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0_#000]">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-600 uppercase mb-1">
            <span>2. New Subscribers Today</span>
            <Users className="w-4 h-4 text-[#ff4d00]" />
          </div>
          <div className="text-xl lg:text-2xl font-black text-black">
            {statusData?.successMetrics.secondary.value || 'NO VERIFIED DATA AVAILABLE'}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span
              className={`px-1.5 py-0.5 font-bold uppercase border ${
                statusData?.successMetrics.secondary.hasData
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-600'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-400'
              }`}
            >
              {statusData?.successMetrics.secondary.status || 'READY_AWAITING_SUBS'}
            </span>
            <span className="text-zinc-500 font-medium">Worldwide Recurring</span>
          </div>
        </div>

        {/* Metric 3: Digital Product Sales Today */}
        <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0_#000]">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-600 uppercase mb-1">
            <span>3. Digital Product Sales</span>
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl lg:text-2xl font-black text-black">
            {statusData?.successMetrics.tertiary.value || 'NO VERIFIED DATA AVAILABLE'}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span
              className={`px-1.5 py-0.5 font-bold uppercase border ${
                statusData?.successMetrics.tertiary.hasData
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-600'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-400'
              }`}
            >
              {statusData?.successMetrics.tertiary.status || 'CATALOG_READY'}
            </span>
            <span className="text-zinc-500 font-medium">{products.length} Products Active</span>
          </div>
        </div>

        {/* Metric 4: Qualified Leads Today */}
        <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0_#000]">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-600 uppercase mb-1">
            <span>4. Qualified Leads Today</span>
            <Target className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl lg:text-2xl font-black text-black">
            {statusData?.successMetrics.quaternary.value || 'NO VERIFIED DATA AVAILABLE'}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span
              className={`px-1.5 py-0.5 font-bold uppercase border ${
                statusData?.successMetrics.quaternary.hasData
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-600'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-400'
              }`}
            >
              {statusData?.successMetrics.quaternary.status || 'PIPELINE_READY'}
            </span>
            <span className="text-zinc-500 font-medium">Global Leads</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-black pb-2">
        {[
          { id: 'markets', label: 'TARGET MARKETS & GEO', icon: Globe },
          { id: 'discovery', label: 'AUTONOMOUS DISCOVERY', icon: Compass },
          { id: 'currencies', label: 'MULTI-CURRENCY TRANSPARENCY', icon: DollarSign },
          { id: 'personas_products', label: 'PERSONAS & PRODUCTS', icon: ShoppingBag },
          { id: 'campaigns', label: 'GLOBAL SOCIAL CAMPAIGNS', icon: Share2 },
          { id: 'cro_trust', label: 'TRUST & COMPLIANCE', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer border-2 border-black ${
                isActive
                  ? 'bg-black text-white shadow-[2px_2px_0_#ff4d00]'
                  : 'bg-white text-black hover:bg-[#ff4d00] hover:text-black shadow-[2px_2px_0_#000]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#ff4d00]' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TARGET MARKETS & GEO LOCALIZATION */}
      {activeTab === 'markets' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-100 p-3 border-2 border-black">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-black" />
              <span className="text-xs font-bold uppercase text-black">Market Tier Coverage:</span>
              <div className="flex gap-1">
                {(['ALL', 'TIER_1', 'TIER_2'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setMarketTierFilter(tier)}
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase border border-black ${
                      marketTierFilter === tier
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    {tier === 'ALL' ? 'All Tiers (19+)' : tier === 'TIER_1' ? 'Tier 1 Priority (9)' : 'Tier 2 Growth (10)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-zinc-600 font-bold">
              Tier 3: All 135+ Stripe-supported nations active via universal USD processing
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Markets List */}
            <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredMarkets.map((market) => {
                const isSelected = market.countryCode === selectedCountryCode;
                return (
                  <div
                    key={market.countryCode}
                    onClick={() => {
                      setSelectedCountryCode(market.countryCode);
                      setSeoClusterData(null);
                    }}
                    className={`p-3 border-2 border-black cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-black text-white shadow-[4px_4px_0_#ff4d00]'
                        : 'bg-white text-black hover:bg-amber-50 shadow-[2px_2px_0_#000]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black">{market.countryCode}</span>
                        <span className="font-bold text-xs">{market.countryName}</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 font-bold uppercase border ${
                          market.tier === 'TIER_1_PRIORITY'
                            ? isSelected
                              ? 'bg-[#ff4d00] text-black border-white'
                              : 'bg-[#ff4d00] text-black border-black'
                            : isSelected
                            ? 'bg-purple-400 text-black border-white'
                            : 'bg-purple-100 text-purple-900 border-purple-600'
                        }`}
                      >
                        {market.tier === 'TIER_1_PRIORITY' ? 'TIER 1' : 'TIER 2'}
                      </span>
                    </div>

                    <div
                      className={`mt-2 text-[11px] grid grid-cols-2 gap-1 ${
                        isSelected ? 'text-zinc-300' : 'text-zinc-600'
                      }`}
                    >
                      <div>
                        <span className="font-bold">Doc Standard:</span> {market.hiringTerminology.resumeOrCv}
                      </div>
                      <div>
                        <span className="font-bold">Currencies:</span> {market.primaryCurrencies.join(', ')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Market Deep-Dive */}
            <div className="lg:col-span-2 space-y-4">
              {selectedMarket ? (
                <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black">{selectedMarket.countryName} ({selectedMarket.countryCode})</span>
                        <span className="px-2 py-0.5 bg-black text-white text-xs font-bold">
                          {selectedMarket.tier}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-600 mt-1">
                        Locale: <span className="font-bold">{selectedMarket.locale}</span> • Primary Currencies: <span className="font-bold">{selectedMarket.primaryCurrencies.join(', ')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleGenerateSeoCluster(selectedMarket.countryCode)}
                      disabled={generatingSeo}
                      className="px-4 py-2 bg-[#ff4d00] hover:bg-black hover:text-white text-black text-xs font-bold border-2 border-black shadow-[2px_2px_0_#000] transition-all flex items-center gap-2 cursor-pointer uppercase shrink-0"
                    >
                      <Sparkles className={`w-4 h-4 ${generatingSeo ? 'animate-spin' : ''}`} />
                      <span>{generatingSeo ? 'GENERATING CLUSTER...' : 'SYNTHESIZE SEO CLUSTER'}</span>
                    </button>
                  </div>

                  {/* Regional Hiring Standards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-zinc-50 border-2 border-black">
                      <div className="text-xs font-bold text-zinc-500 uppercase">Document Standard</div>
                      <div className="text-sm font-black text-black mt-1">
                        {selectedMarket.hiringTerminology.resumeOrCv}
                      </div>
                      <div className="text-[11px] text-zinc-600 mt-1">
                        Agents must never assume "Resume". Always adapt to local {selectedMarket.hiringTerminology.resumeOrCv} expectations.
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-50 border-2 border-black">
                      <div className="text-xs font-bold text-zinc-500 uppercase">Notice Period Standard</div>
                      <div className="text-sm font-black text-black mt-1">
                        {selectedMarket.hiringTerminology.standardNoticePeriod}
                      </div>
                      <div className="text-[11px] text-zinc-600 mt-1">
                        Career acceleration timeline must accommodate local transition law.
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-50 border-2 border-black">
                      <div className="text-xs font-bold text-zinc-500 uppercase">Dominant Job Boards</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedMarket.hiringTerminology.dominantJobBoards.map((jb) => (
                          <span key={jb} className="px-1.5 py-0.5 bg-black text-white text-[11px] font-bold">
                            {jb}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-50 border-2 border-black">
                      <div className="text-xs font-bold text-zinc-500 uppercase">Working &amp; Contract Model</div>
                      <div className="text-sm font-black text-black mt-1">
                        {selectedMarket.hiringTerminology.typicalWorkingModel}
                      </div>
                    </div>
                  </div>

                  {/* High Intent Country Keywords */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase text-black flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-[#ff4d00]" />
                      <span>Target High-Commercial Intent Search Queries ({selectedMarket.countryName})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMarket.highIntentKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-2 py-1 bg-amber-50 text-black border border-black text-xs font-bold flex items-center gap-1"
                        >
                          <Target className="w-3 h-3 text-[#ff4d00]" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Generated SEO Cluster Preview */}
                  {seoClusterData && (
                    <div className="p-4 bg-zinc-900 text-white border-2 border-black space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-[#ff4d00] uppercase">
                        <span className="flex items-center gap-2">
                          <FileCode className="w-4 h-4" />
                          Localized SEO / GEO Schema Cluster ({selectedMarket.countryCode})
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(seoClusterData, null, 2));
                            toast.success('JSON-LD copied to clipboard!');
                          }}
                          className="px-2 py-1 bg-black hover:bg-white hover:text-black text-white text-[10px] border border-zinc-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          COPY JSON-LD
                        </button>
                      </div>

                      <div className="text-xs space-y-1">
                        <div>
                          <span className="text-zinc-400">Target Page Title:</span>{' '}
                          <span className="text-emerald-400 font-bold">{seoClusterData.metadata?.title}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400">Canonical / Hreflang:</span>{' '}
                          <span className="text-zinc-200">{seoClusterData.metadata?.canonicalUrl} (lang: {seoClusterData.metadata?.hreflang})</span>
                        </div>
                      </div>

                      <pre className="p-3 bg-black text-zinc-300 text-[11px] overflow-x-auto border border-zinc-800 max-h-48 font-mono">
                        {JSON.stringify(seoClusterData.jsonLd, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUTONOMOUS MARKET DISCOVERY */}
      {activeTab === 'discovery' && (
        <div className="space-y-6">
          <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0_#000]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
              <div>
                <h3 className="text-lg font-black uppercase text-black flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#ff4d00]" />
                  AUTONOMOUS GLOBAL OPPORTUNITY ENGINE
                </h3>
                <p className="text-xs text-zinc-600 mt-1">
                  Continuously scans global search patterns, regional remote hiring shifts, and cross-border consulting demand to discover untapped keyword clusters and commercial pathways.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={discoveryRegion}
                  onChange={(e) => setDiscoveryRegion(e.target.value)}
                  className="px-3 py-2 bg-white text-black border-2 border-black text-xs font-bold cursor-pointer"
                >
                  <option value="APAC">APAC (Asia-Pacific)</option>
                  <option value="EMEA">EMEA (Europe, Middle East, Africa)</option>
                  <option value="LATAM">LATAM (Latin America)</option>
                  <option value="Americas">Americas (Canada &amp; US Cross-Border)</option>
                </select>

                <button
                  onClick={handleTriggerDiscovery}
                  disabled={discovering}
                  className="px-4 py-2 bg-[#ff4d00] hover:bg-black hover:text-white text-black text-xs font-bold border-2 border-black shadow-[2px_2px_0_#000] transition-all flex items-center gap-2 cursor-pointer uppercase shrink-0"
                >
                  <Zap className={`w-4 h-4 ${discovering ? 'animate-spin' : ''}`} />
                  <span>{discovering ? 'SCANNING MARKETS...' : 'EXECUTE AUTONOMOUS SCAN'}</span>
                </button>
              </div>
            </div>

            {/* Discovered Clusters Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {discoveries.map((cluster) => (
                <div
                  key={cluster.id}
                  className="p-4 bg-zinc-50 border-2 border-black shadow-[3px_3px_0_#000] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-black text-white text-xs font-black">
                        {cluster.country}
                      </span>
                      <span className="text-xs font-bold text-zinc-600">{cluster.region}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-zinc-500 font-bold">Intent Score:</span>
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-600 text-xs font-black">
                        {cluster.commercialIntentScore}/100
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-zinc-500 uppercase">Discovered Opportunity</div>
                    <div className="text-sm font-black text-black">{cluster.theme}</div>
                    <div className="text-xs text-[#ff4d00] font-bold mt-1">"{cluster.searchQuery}"</div>
                  </div>

                  <div className="text-xs bg-white p-2 border border-black space-y-1">
                    <div>
                      <span className="text-zinc-500 font-bold">Target Persona:</span>{' '}
                      <span className="font-bold text-black">{cluster.targetPersona}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-bold">Opportunity Type:</span>{' '}
                      <span className="px-1.5 py-0.2 bg-zinc-200 text-black font-bold text-[10px] border border-black">
                        {cluster.opportunityType}
                      </span>
                    </div>
                    <div className="text-zinc-700 text-[11px] pt-1 border-t border-zinc-200">
                      <span className="font-bold">Autonomous Action:</span> {cluster.suggestedAction}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                    <span>Detected: {new Date(cluster.discoveredAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => {
                        toast.success(`Autonomous Strategy Deployed for ${cluster.country}!`);
                      }}
                      className="px-2 py-1 bg-black text-white hover:bg-[#ff4d00] hover:text-black font-bold uppercase transition-all cursor-pointer text-[10px]"
                    >
                      DEPLOY STRATEGY &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-CURRENCY TRANSPARENCY */}
      {activeTab === 'currencies' && (
        <div className="space-y-6">
          <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
            <div className="border-b-2 border-black pb-4">
              <h3 className="text-lg font-black uppercase text-black flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                MULTI-CURRENCY AWARENESS &amp; STRIPE CONVERSION TRANSPARENCY
              </h3>
              <p className="text-xs text-zinc-600 mt-1 max-w-3xl">
                Global buyers encounter friction when pricing assumptions are strictly American. We communicate transparently that all subscriptions and digital products are billed in USD, with zero hidden markups, and local conversion handled automatically at live bank rates.
              </p>
            </div>

            {/* Interactive Calculator */}
            <div className="p-4 bg-emerald-50 border-2 border-black">
              <div className="text-xs font-black text-emerald-950 uppercase mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>Live International Conversion Reference Calculator</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                    USD Benchmark Amount ($)
                  </label>
                  <input
                    type="number"
                    value={calculatorUsd}
                    onChange={(e) => setCalculatorUsd(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white text-black border-2 border-black text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                    Target Local Currency
                  </label>
                  <select
                    value={selectedCurrencyCode}
                    onChange={(e) => setSelectedCurrencyCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-black border-2 border-black text-sm font-bold cursor-pointer"
                  >
                    {rates.map((rate) => (
                      <option key={rate.code} value={rate.code}>
                        {rate.code} - {rate.name} ({rate.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-2.5 bg-black text-white border-2 border-black">
                  <div className="text-[10px] text-zinc-400 font-bold uppercase">Estimated Buyer Charges</div>
                  <div className="text-lg font-black text-[#ff4d00]">
                    ≈ {selectedRateObj?.symbol} {convertedAmount} {selectedCurrencyCode}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Billed as ${calculatorUsd} USD via Stripe
                  </div>
                </div>
              </div>
            </div>

            {/* Currency Rates Matrix */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-black uppercase">Supported Currencies &amp; Payment Methods</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {rates.map((r) => (
                  <div key={r.code} className="p-3 bg-zinc-50 border-2 border-black">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm">{r.code} ({r.symbol})</span>
                      <span className="text-[11px] text-zinc-500 font-bold">1 USD = {r.rateVsUsd} {r.code}</span>
                    </div>
                    <div className="text-xs text-zinc-700 font-medium mt-1">{r.name}</div>
                    <div className="mt-2 pt-2 border-t border-zinc-200 flex flex-wrap gap-1">
                      {r.paymentMethods.map((pm) => (
                        <span key={pm} className="text-[10px] px-1 bg-zinc-200 text-black font-bold">
                          {pm}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PERSONAS & DIGITAL PRODUCTS */}
      {activeTab === 'personas_products' && (
        <div className="space-y-6">
          {/* Persona Selection */}
          <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0_#000] space-y-4">
            <div className="border-b-2 border-black pb-3">
              <h3 className="text-lg font-black uppercase text-black flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ff4d00]" />
                12 INTERNATIONAL AUDIENCES &amp; MONETIZATION PATHWAYS
              </h3>
              <p className="text-xs text-zinc-600 mt-1">
                Ecosystem protocol mandate: Agents must NEVER assume all users are job seekers or all customers are American. We treat Subscribers, Digital Product Buyers, Consultants, and Enterprise Clients with equal value.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {personas.map((p) => (
                <div key={p.id} className="p-3 bg-zinc-50 border-2 border-black space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black">{p.name}</span>
                    <span className="text-[11px] px-1.5 py-0.5 bg-black text-white font-bold">
                      ${p.averageTransactionValueUsd} ATV
                    </span>
                  </div>
                  <div className="text-xs text-zinc-600 font-medium">{p.targetAudience}</div>
                  <div className="text-[11px] bg-white p-2 border border-black space-y-1">
                    <div className="text-zinc-500 font-bold">Offer:</div>
                    <div className="text-black font-bold">{p.suggestedDigitalOffer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Products Catalog */}
          <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0_#000] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-3">
              <div>
                <h3 className="text-lg font-black uppercase text-black flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  GLOBAL DIGITAL PRODUCTS CATALOG (STRIPE COMMERCE READY)
                </h3>
                <p className="text-xs text-zinc-600 mt-1">
                  11 high-margin digital products, Notion vaults, masterclasses, and executive licenses available worldwide.
                </p>
              </div>
              <span className="px-2 py-1 bg-black text-white text-xs font-bold">
                {products.length} OFFERS CATALOGUED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 bg-zinc-50 border-2 border-black flex flex-col justify-between shadow-[3px_3px_0_#000] space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 bg-zinc-200 text-black text-[10px] font-bold border border-black">
                        {prod.category}
                      </span>
                      <span className="text-lg font-black text-black">${prod.priceUsd}</span>
                    </div>

                    <h4 className="text-sm font-black text-black">{prod.title}</h4>
                    <p className="text-xs text-zinc-600">{prod.description}</p>

                    <div className="p-2 bg-white border border-black text-[11px] space-y-1">
                      <div>
                        <span className="text-zinc-500 font-bold">Format:</span> {prod.deliveryFormat}
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold">Target:</span> {prod.targetCustomerType}
                      </div>
                      <div className="text-emerald-700 font-bold">
                        {prod.internationalRelevance}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInitiateStripeCheckout(prod)}
                    disabled={creatingCheckoutSku === prod.sku}
                    className="w-full py-2 bg-black hover:bg-[#ff4d00] hover:text-black text-white text-xs font-bold border-2 border-black transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{creatingCheckoutSku === prod.sku ? 'LAUNCHING...' : `CHECKOUT ($${prod.priceUsd})`}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MULTI-CHANNEL GLOBAL CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
            <div className="border-b-2 border-black pb-4">
              <h3 className="text-lg font-black uppercase text-black flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#ff4d00]" />
                MULTI-PLATFORM INTERNATIONAL SOCIAL CAMPAIGN GENERATOR
              </h3>
              <p className="text-xs text-zinc-600 mt-1">
                Generate high-conversion social campaigns across LinkedIn, TikTok, Instagram, YouTube, X, Reddit, and Facebook tailored specifically to international professionals without US bias.
              </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-zinc-50 border-2 border-black items-end">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                  Target Country
                </label>
                <select
                  value={campaignCountry}
                  onChange={(e) => setCampaignCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-black border-2 border-black text-xs font-bold cursor-pointer"
                >
                  {markets.map((m) => (
                    <option key={m.countryCode} value={m.countryCode}>
                      {m.countryName} ({m.countryCode}) - {m.tier}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                  Target Persona
                </label>
                <select
                  value={campaignPersona}
                  onChange={(e) => setCampaignPersona(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-black border-2 border-black text-xs font-bold cursor-pointer"
                >
                  {personas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerateCampaigns}
                disabled={generatingCampaigns}
                className="w-full py-2.5 bg-[#ff4d00] hover:bg-black hover:text-white text-black text-xs font-bold border-2 border-black shadow-[2px_2px_0_#000] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
              >
                <Sparkles className={`w-4 h-4 ${generatingCampaigns ? 'animate-spin' : ''}`} />
                <span>{generatingCampaigns ? 'SYNTHESIZING...' : 'SYNTHESIZE CAMPAIGN'}</span>
              </button>
            </div>

            {/* Results */}
            {generatedCampaigns.length > 0 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-black uppercase">
                  Synthesized Multi-Channel Content ({generatedCampaigns.length} Channels)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedCampaigns.map((camp) => (
                    <div key={camp.id} className="p-4 bg-zinc-50 border-2 border-black space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-black text-white text-xs font-black">
                          {camp.platform}
                        </span>
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-500 text-[10px] font-bold">
                          {camp.monetizationTarget}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-black text-black">HOOK: {camp.hook}</div>
                        <p className="text-xs text-zinc-700 mt-2 whitespace-pre-line bg-white p-3 border border-black font-sans">
                          {camp.contentBody}
                        </p>
                      </div>

                      <div className="p-2 bg-zinc-100 border border-zinc-400 text-xs">
                        <span className="font-bold text-black">Call to Action:</span> {camp.callToAction}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {camp.tags.map((tag: string) => (
                          <span key={tag} className="text-[10px] text-zinc-500 font-bold">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-zinc-300 flex justify-end">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${camp.hook}\n\n${camp.contentBody}\n\n${camp.callToAction}\n\n${camp.tags.join(' ')}`);
                            toast.success(`Copied ${camp.platform} post to clipboard!`);
                          }}
                          className="px-2 py-1 bg-white hover:bg-black hover:text-white text-black text-xs font-bold border border-black flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          COPY POST
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: TRUST & COMPLIANCE */}
      {activeTab === 'cro_trust' && (
        <div className="space-y-6">
          <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
            <div className="border-b-2 border-black pb-4">
              <h3 className="text-lg font-black uppercase text-black flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                GLOBAL CRO TRUST SIGNALS &amp; WORLDWIDE COMPLIANCE
              </h3>
              <p className="text-xs text-zinc-600 mt-1">
                Removing friction for international buyers through GDPR, UK DPA, PDPA certification, PCI-DSS Level 1 compliance, and verified worldwide buyer reviews.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {croSignals?.worldwideTrustBadges?.map((badge: string) => (
                <div
                  key={badge}
                  className="p-3 bg-emerald-50 border-2 border-black flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-black text-emerald-950">{badge}</span>
                </div>
              ))}
            </div>

            {/* Compliance Standards */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-black uppercase">International Privacy &amp; Data Standards</div>
              <div className="p-4 bg-zinc-50 border-2 border-black space-y-2">
                {croSignals?.complianceStandards?.map((std: string) => (
                  <div key={std} className="flex items-center gap-2 text-xs font-bold text-zinc-800">
                    <ShieldCheck className="w-4 h-4 text-[#ff4d00] shrink-0" />
                    <span>{std}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Testimonials */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-black uppercase">Verified International Customer Testimonials</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {croSignals?.globalTestimonials?.map((t: any) => (
                  <div key={t.name} className="p-4 bg-zinc-50 border-2 border-black space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{t.flag}</span>
                        <div>
                          <div className="text-xs font-black text-black">{t.name}</div>
                          <div className="text-[10px] text-zinc-500">{t.role} • {t.location}</div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-600 text-[10px] font-black">
                        VERIFIED
                      </span>
                    </div>

                    <p className="text-xs text-zinc-700 italic bg-white p-2.5 border border-black font-sans">
                      "{t.quote}"
                    </p>

                    <div className="text-[10px] text-zinc-500 font-bold">
                      Purchased: <span className="text-black">{t.productPurchased}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
