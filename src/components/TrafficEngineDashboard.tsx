import React, { useState, useEffect } from 'react';
import {
  Zap,
  Globe,
  Search,
  Share2,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  Plus,
  Shield,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  Sliders,
  Sparkles,
  Smartphone,
  Laptop,
  Compass,
  ArrowRight,
  TrendingUp,
  Cpu,
  BarChart3,
  ExternalLink,
  Flame,
  MousePointer,
  RotateCw,
  AlertTriangle,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  TrafficCampaignClientItem,
  SerpCtrJobClientItem,
  RedirectRouteClientItem,
  TrafficHealthReport,
  TrafficEngineMode,
  ReferrerType,
} from '../types';

interface TrafficEngineDashboardProps {
  onOpenSettings?: () => void;
}

export const TrafficEngineDashboard: React.FC<TrafficEngineDashboardProps> = ({ onOpenSettings }) => {
  // Active Tab: Direct Traffic, SERP CTR, Domain Forwarding, Telemetry & Diagnostics
  const [activeTab, setActiveTab] = useState<'direct' | 'serp_ctr' | 'redirects' | 'overview'>('overview');

  // Server state
  const [campaigns, setCampaigns] = useState<TrafficCampaignClientItem[]>([]);
  const [serpJobs, setSerpJobs] = useState<SerpCtrJobClientItem[]>([]);
  const [redirectRoutes, setRedirectRoutes] = useState<RedirectRouteClientItem[]>([]);
  const [health, setHealth] = useState<TrafficHealthReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [burstingId, setBurstingId] = useState<string | null>(null);

  // New Campaign Form Modal / Drawer State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [formEngineMode, setFormEngineMode] = useState<TrafficEngineMode>('DIRECT_TRAFFIC');
  const [formName, setFormName] = useState<string>('');
  const [formTargetUrls, setFormTargetUrls] = useState<string>('https://careerpulseai.net\nhttps://careerpulseai.net/resume-builder');
  const [formDailyVolume, setFormDailyVolume] = useState<number>(500);
  const [formBounceRatePct, setFormBounceRatePct] = useState<number>(35);
  const [formMinDwellSec, setFormMinDwellSec] = useState<number>(45);
  const [formMaxDwellSec, setFormMaxDwellSec] = useState<number>(180);
  const [formMobileRatioPct, setFormMobileRatioPct] = useState<number>(60);
  const [formGeoCountry, setFormGeoCountry] = useState<string>('US');
  const [formGeoCity, setFormGeoCity] = useState<string>('New York, NY');
  const [formReferrerType, setFormReferrerType] = useState<ReferrerType>('ORGANIC');
  const [formCustomReferrers, setFormCustomReferrers] = useState<string>('https://t.co/share\nhttps://news.ycombinator.com');
  const [formGa4MeasurementId, setFormGa4MeasurementId] = useState<string>('G-CP8291X0');
  const [formSitemapUrl, setFormSitemapUrl] = useState<string>('https://careerpulseai.net/sitemap.xml');
  const [formConcurrency, setFormConcurrency] = useState<number>(4);

  // SERP Specific Form Fields
  const [formKeywords, setFormKeywords] = useState<string>('GEO backlink engine\nAI resume analyzer\ninstant indexing tool 2026');
  const [formSearchEngine, setFormSearchEngine] = useState<'google' | 'bing' | 'maps'>('google');
  const [formMaxSerpDepth, setFormMaxSerpDepth] = useState<number>(10);
  const [formAntiPogo, setFormAntiPogo] = useState<boolean>(true);

  // Domain Redirection Specific Form Fields
  const [formRedirectSource, setFormRedirectSource] = useState<string>('expired-careers-vault.org');
  const [formRedirectType, setFormRedirectType] = useState<301 | 302>(301);
  const [formNicheTags, setFormNicheTags] = useState<string>('tech,recruiting,ai,careers');
  const [formDeviceFilter, setFormDeviceFilter] = useState<'ALL' | 'MOBILE' | 'DESKTOP'>('ALL');

  const [submittingCampaign, setSubmittingCampaign] = useState<boolean>(false);

  // Fetch all initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [campRes, serpRes, redRes, healthRes] = await Promise.all([
        axios.get('/api/traffic-campaigns'),
        axios.get('/api/traffic/serp-jobs'),
        axios.get('/api/traffic/redirect-routes'),
        axios.get('/api/traffic-health'),
      ]);

      if (campRes.data?.campaigns) setCampaigns(campRes.data.campaigns);
      if (serpRes.data?.jobs) setSerpJobs(serpRes.data.jobs);
      if (redRes.data?.routes) setRedirectRoutes(redRes.data.routes);
      if (healthRes.data?.health) setHealth(healthRes.data.health);
    } catch (err: any) {
      console.warn('Failed to load traffic engine state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'RUNNING' ? 'PAUSED' : 'RUNNING';
      await axios.post(`/api/traffic-campaigns/${id}/toggle`, { status: nextStatus });
      toast.success(`Campaign ${nextStatus === 'RUNNING' ? 'Resumed' : 'Paused'}`);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to toggle campaign status');
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this traffic campaign?')) return;
    try {
      await axios.delete(`/api/traffic-campaigns/${id}`);
      toast.success('Campaign deleted successfully');
      fetchData();
    } catch (err: any) {
      toast.error('Failed to delete campaign');
    }
  };

  const handleImmediateBurst = async (id: string) => {
    try {
      setBurstingId(id);
      await axios.post(`/api/traffic-campaigns/${id}/burst`);
      toast.success('Dispatched real-time stealth Chromium / SERP burst!');
      fetchData();
    } catch (err: any) {
      toast.error('Burst execution failed');
    } finally {
      setBurstingId(null);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetUrlArray = formTargetUrls
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);

    if (targetUrlArray.length === 0) {
      toast.error('Please provide at least one target URL');
      return;
    }

    try {
      setSubmittingCampaign(true);
      const payload: any = {
        name: formName || `${formEngineMode.replace('_', ' ')} #${Date.now().toString().slice(-4)}`,
        engineMode: formEngineMode,
        targetUrls: targetUrlArray,
        dailyVolume: formDailyVolume,
        bounceRatePct: formBounceRatePct,
        minDwellSec: formMinDwellSec,
        maxDwellSec: formMaxDwellSec,
        mobileRatioPct: formMobileRatioPct,
        geoCountry: formGeoCountry,
        geoCity: formGeoCity,
        referrerType: formReferrerType,
        customReferrers: formCustomReferrers.split('\n').map((r) => r.trim()).filter(Boolean),
        sitemapUrl: formSitemapUrl,
        ga4MeasurementId: formGa4MeasurementId,
        concurrencyThreads: formConcurrency,
        keywords: formKeywords.split('\n').map((k) => k.trim()).filter(Boolean),
        searchEngine: formSearchEngine,
        maxSerpDepth: formMaxSerpDepth,
        antiPogoSticking: formAntiPogo,
        redirectSourceDomain: formRedirectSource,
        redirectType: formRedirectType,
        nicheTags: formNicheTags.split(',').map((t) => t.trim()).filter(Boolean),
        deviceFilter: formDeviceFilter,
      };

      const res = await axios.post('/api/traffic-campaigns', payload);
      if (res.data?.success) {
        toast.success(res.data.message || 'Traffic campaign initialized successfully!');
        setIsCreateModalOpen(false);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create traffic campaign');
    } finally {
      setSubmittingCampaign(false);
    }
  };

  const directCampaigns = campaigns.filter((c) => c.engine_mode === 'DIRECT_TRAFFIC');
  const serpCampaigns = campaigns.filter((c) => c.engine_mode === 'SERP_CTR');
  const redirectCampaigns = campaigns.filter((c) => c.engine_mode === 'DOMAIN_REDIRECT');

  return (
    <div className="space-y-6 font-mono-brutal pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 p-6 rounded-3xl shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#222] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-4">
          <div className="w-16 h-16 bg-[#ff4d00] text-black border-3 border-black dark:border-zinc-600 rounded-2xl flex items-center justify-center font-display font-black text-3xl shadow-[3px_3px_0_#000] shrink-0">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black uppercase text-black dark:text-zinc-100 tracking-tight">
                Traffic &amp; SERP CTR Generation Engine
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-500 text-white font-extrabold text-[10px] uppercase rounded-md tracking-wider">
                v3.0 ENTERPRISE
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans max-w-2xl leading-relaxed">
              Full-browser stealth Chromium sessions, residential IP rotation across 190+ countries, SERP CTR manipulation with anti-pogo-sticking guards, and live parked domain forwarding.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-black dark:text-zinc-200 text-xs font-bold uppercase rounded-xl border-2 border-black dark:border-zinc-600 shadow-[2px_2px_0_#000] flex items-center gap-2 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-[#ff4d00] hover:bg-orange-600 text-black font-extrabold text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0_#000] flex items-center gap-2 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Launch Traffic Campaign</span>
          </button>
        </div>
      </div>

      {/* Real-time KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4.5 bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 rounded-2xl shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#222] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-zinc-500 dark:text-zinc-400">
              Active Campaigns
            </span>
            <div className="text-2xl font-black text-black dark:text-zinc-100 font-mono">
              {health?.activeCampaignsCount || campaigns.filter((c) => c.status === 'RUNNING').length}{' '}
              <span className="text-xs font-normal text-zinc-500">/ {campaigns.length}</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Multi-Worker Pool Active</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-500 border-2 border-black dark:border-zinc-700 rounded-xl shadow-[2px_2px_0_#000]">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4.5 bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 rounded-2xl shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#222] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-zinc-500 dark:text-zinc-400">
              Sessions Delivered (GA4 Validated)
            </span>
            <div className="text-2xl font-black text-black dark:text-zinc-100 font-mono">
              {(health?.totalSessionsDelivered || campaigns.reduce((a, b) => a + (b.completed_sessions || 0), 0)).toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans">
              Masked real-time UTM &amp; pixel hits
            </div>
          </div>
          <div className="p-3 bg-[#ff4d00]/10 text-[#ff4d00] border-2 border-black dark:border-zinc-700 rounded-xl shadow-[2px_2px_0_#000]">
            <MousePointer className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4.5 bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 rounded-2xl shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#222] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-zinc-500 dark:text-zinc-400">
              SERP Organic CTR Clicks
            </span>
            <div className="text-2xl font-black text-black dark:text-zinc-100 font-mono">
              {health?.totalCtrClicksDelivered || serpJobs.filter((j) => j.click_executed === 1).length}
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">
              100% Anti-Pogo Protection
            </div>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-500 border-2 border-black dark:border-zinc-700 rounded-xl shadow-[2px_2px_0_#000]">
            <Search className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4.5 bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 rounded-2xl shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#222] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-zinc-500 dark:text-zinc-400">
              Bandwidth Asset Savings
            </span>
            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
              {health?.workerPool?.bandwidthSavingsPct || 78.4}%
            </div>
            <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans">
              Dynamic media &amp; ad script blocking
            </div>
          </div>
          <div className="p-3 bg-cyan-500/10 text-cyan-500 border-2 border-black dark:border-zinc-700 rounded-xl shadow-[2px_2px_0_#000]">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-4 border-black dark:border-zinc-700 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-black uppercase rounded-xl border-2 border-black dark:border-zinc-600 flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'overview'
              ? 'bg-black text-white dark:bg-zinc-800 dark:text-cyan-400 shadow-[3px_3px_0_#ff4d00]'
              : 'bg-white dark:bg-zinc-900 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Fleet Overview &amp; Campaigns ({campaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('direct')}
          className={`px-4 py-2 text-xs font-black uppercase rounded-xl border-2 border-black dark:border-zinc-600 flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'direct'
              ? 'bg-black text-white dark:bg-zinc-800 dark:text-cyan-400 shadow-[3px_3px_0_#ff4d00]'
              : 'bg-white dark:bg-zinc-900 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <MousePointer className="w-4 h-4 text-[#ff4d00]" />
          <span>Subsystem A: Direct Chromium ({directCampaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('serp_ctr')}
          className={`px-4 py-2 text-xs font-black uppercase rounded-xl border-2 border-black dark:border-zinc-600 flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'serp_ctr'
              ? 'bg-black text-white dark:bg-zinc-800 dark:text-cyan-400 shadow-[3px_3px_0_#ff4d00]'
              : 'bg-white dark:bg-zinc-900 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <Search className="w-4 h-4 text-purple-400" />
          <span>Subsystem B: Search CTR Engine ({serpJobs.length} Jobs)</span>
        </button>

        <button
          onClick={() => setActiveTab('redirects')}
          className={`px-4 py-2 text-xs font-black uppercase rounded-xl border-2 border-black dark:border-zinc-600 flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'redirects'
              ? 'bg-black text-white dark:bg-zinc-800 dark:text-cyan-400 shadow-[3px_3px_0_#ff4d00]'
              : 'bg-white dark:bg-zinc-900 text-black dark:text-zinc-200 hover:bg-zinc-100 shadow-[2px_2px_0_#000]'
          }`}
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
          <span>Subsystem C: Domain Redirection ({redirectRoutes.length} Routes)</span>
        </button>
      </div>

      {/* TAB 1: FLEET OVERVIEW & ACTIVE CAMPAIGNS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {campaigns.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 rounded-3xl shadow-[5px_5px_0_#000] space-y-4">
              <div className="w-16 h-16 bg-[#ff4d00]/20 text-[#ff4d00] border-2 border-black dark:border-zinc-600 rounded-2xl flex items-center justify-center mx-auto shadow-[3px_3px_0_#000]">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black uppercase text-black dark:text-zinc-100">
                No Traffic Campaigns Deployed Yet
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto font-sans">
                Deploy your first automated traffic campaign to generate stealth Chromium visits, simulate organic SERP CTR clicks, or route domain redirects.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2.5 bg-[#ff4d00] hover:bg-orange-600 text-black font-extrabold text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer"
              >
                + Create First Campaign
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {campaigns.map((camp) => {
                const isRunning = camp.status === 'RUNNING';
                const isBursting = burstingId === camp.id;
                let parsedUrls: string[] = [];
                try {
                  parsedUrls = JSON.parse(camp.target_urls);
                } catch (e) {
                  parsedUrls = [camp.target_urls];
                }

                return (
                  <div
                    key={camp.id}
                    className="p-5 bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 rounded-2xl shadow-[5px_5px_0_#000] dark:shadow-[5px_5px_0_#222] flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Badge Top Bar */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-black uppercase rounded border ${
                            camp.engine_mode === 'DIRECT_TRAFFIC'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                              : camp.engine_mode === 'SERP_CTR'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {camp.engine_mode.replace('_', ' ')}
                        </span>

                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded ${
                            isRunning
                              ? 'bg-emerald-500 text-white font-black animate-pulse'
                              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400'
                          }`}
                        >
                          {camp.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-black dark:text-zinc-100 uppercase truncate">
                          {camp.name}
                        </h3>
                        <p className="text-[11px] text-zinc-500 truncate font-mono mt-0.5">
                          {parsedUrls[0] || 'Target URL'}
                        </p>
                      </div>

                      {/* Behavioral Metrics Grid */}
                      <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[11px]">
                        <div>
                          <span className="text-zinc-400 text-[9px] uppercase font-bold block">Daily Goal</span>
                          <strong className="text-black dark:text-zinc-200 font-mono">
                            {camp.daily_volume.toLocaleString()} hits
                          </strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[9px] uppercase font-bold block">Delivered</span>
                          <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                            {camp.completed_sessions.toLocaleString()} hits
                          </strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[9px] uppercase font-bold block">Dwell Window</span>
                          <span className="text-black dark:text-zinc-200 font-mono">
                            {camp.min_dwell_sec}s – {camp.max_dwell_sec}s
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[9px] uppercase font-bold block">Mobile / Desktop</span>
                          <span className="text-black dark:text-zinc-200 font-mono">
                            {camp.mobile_ratio_pct}% / {100 - camp.mobile_ratio_pct}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span>Geo: <strong>{camp.geo_city || camp.geo_country}</strong></span>
                        <span>Threads: <strong>{camp.concurrency_threads} Max</strong></span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleStatus(camp.id, camp.status)}
                        className={`flex-1 py-1.5 px-3 rounded-lg border-2 border-black text-xs font-bold uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0_#000] cursor-pointer transition-all ${
                          isRunning
                            ? 'bg-amber-400 hover:bg-amber-500 text-black'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                      >
                        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isRunning ? 'Pause' : 'Resume'}</span>
                      </button>

                      <button
                        onClick={() => handleImmediateBurst(camp.id)}
                        disabled={isBursting}
                        className="py-1.5 px-2.5 bg-black hover:bg-[#ff4d00] text-white hover:text-black rounded-lg border-2 border-black text-xs font-bold shadow-[2px_2px_0_#000] cursor-pointer transition-all flex items-center gap-1"
                        title="Execute 1 instant simulated headless visitor"
                      >
                        <Flame className={`w-3.5 h-3.5 ${isBursting ? 'animate-bounce' : ''}`} />
                        <span>Burst</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="p-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 rounded-lg border-2 border-black dark:border-zinc-700 shadow-[2px_2px_0_#000] cursor-pointer transition-all"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUBSYSTEM A - DIRECT CHROMIUM TRAFFIC */}
      {activeTab === 'direct' && (
        <div className="space-y-6">
          <div className="p-5 bg-blue-500/10 border-3 border-black dark:border-zinc-700 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100 flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-blue-500" />
                <span>Subsystem A: Direct Headless Chromium &amp; Stealth Evasion</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans mt-1">
                Executes realistic human behavior scrolls, multi-page deep navigation, randomized mouse movements, and GA4 measurement protocol validation.
              </p>
            </div>
            <button
              onClick={() => {
                setFormEngineMode('DIRECT_TRAFFIC');
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer shrink-0"
            >
              + Deploy Chromium Campaign
            </button>
          </div>

          {/* Evasion Engine Specs Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-xl space-y-2">
              <div className="text-xs font-bold text-black dark:text-zinc-200 uppercase flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Stealth Evasion Patches</span>
              </div>
              <ul className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1 font-mono">
                <li>• navigator.webdriver: Overridden (false)</li>
                <li>• Canvas Noise: Dynamic per-session hash</li>
                <li>• WebGL Vendor: Randomized Apple/NVIDIA</li>
                <li>• WebRTC Leak Guard: Proxy IP locked</li>
              </ul>
            </div>

            <div className="p-4 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-xl space-y-2">
              <div className="text-xs font-bold text-black dark:text-zinc-200 uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#ff4d00]" />
                <span>GA4 Payload Masking</span>
              </div>
              <ul className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1 font-mono">
                <li>• Pixel Verification: HTTP 200 collect ping</li>
                <li>• Client ID: Generated persistent UUIDv4</li>
                <li>• Engagement Time: Dynamic dwell duration</li>
                <li>• UTM Parameters: Auto-tagged campaigns</li>
              </ul>
            </div>

            <div className="p-4 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-xl space-y-2">
              <div className="text-xs font-bold text-black dark:text-zinc-200 uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-500" />
                <span>Resource Optimization</span>
              </div>
              <ul className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1 font-mono">
                <li>• Heavy Video Stripping: Blocked (mp4/webm)</li>
                <li>• Non-Essential Ads: Intercepted via regex</li>
                <li>• Bandwidth Saved: ~78.4% per session</li>
                <li>• Thread Scaling: 1–10 worker instances</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUBSYSTEM B - SEARCH CTR ENGINE */}
      {activeTab === 'serp_ctr' && (
        <div className="space-y-6">
          <div className="p-5 bg-purple-500/10 border-3 border-black dark:border-zinc-700 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100 flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-500" />
                <span>Subsystem B: Search CTR Engine (SERP &amp; Map Local SEO)</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans mt-1">
                Searches target keywords, scans SERP depth up to 10 pages, executes organic click-throughs, and engages internal pages to prevent pogo-sticking.
              </p>
            </div>
            <button
              onClick={() => {
                setFormEngineMode('SERP_CTR');
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer shrink-0"
            >
              + Add SERP CTR Keyword Job
            </button>
          </div>

          {/* SERP Jobs Table */}
          <div className="border-3 border-black dark:border-zinc-700 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-[4px_4px_0_#000]">
            <div className="p-4 border-b-2 border-black dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
              <h4 className="text-xs font-black uppercase text-black dark:text-zinc-200">
                SERP Search &amp; CTR Dispatch Queue ({serpJobs.length} Tasks)
              </h4>
              <span className="text-[10px] text-zinc-500 font-mono">Live Google &amp; Bing Automation</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 uppercase text-[10px] border-b-2 border-black dark:border-zinc-700">
                  <tr>
                    <th className="px-4 py-3">Keyword</th>
                    <th className="px-4 py-3">Target Destination</th>
                    <th className="px-4 py-3">Engine</th>
                    <th className="px-4 py-3">SERP Rank</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Anti-Pogo Guard</th>
                    <th className="px-4 py-3">Proxy Node</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {serpJobs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-zinc-500 font-sans">
                        No active SERP CTR tasks in queue. Deploy a SERP CTR campaign to begin rank manipulation.
                      </td>
                    </tr>
                  ) : (
                    serpJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-black dark:text-zinc-100">
                          {job.keyword}
                        </td>
                        <td className="px-4 py-3 text-zinc-500 truncate max-w-[200px]">
                          {job.target_url}
                        </td>
                        <td className="px-4 py-3 uppercase text-[10px] font-bold">
                          {job.search_engine}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 rounded text-[10px] font-bold">
                            #{job.target_position || 1}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              job.click_executed === 1
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          {job.anti_pogo_sticking ? '✓ Enabled (>60s dwell)' : 'Disabled'}
                        </td>
                        <td className="px-4 py-3 text-zinc-500 text-[11px] truncate max-w-[150px]">
                          {job.proxy_node || 'US-Auto-Node'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUBSYSTEM C - DOMAIN REDIRECTION */}
      {activeTab === 'redirects' && (
        <div className="space-y-6">
          <div className="p-5 bg-emerald-500/10 border-3 border-black dark:border-zinc-700 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black uppercase text-black dark:text-zinc-100 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-500" />
                <span>Subsystem C: Domain Redirection Engine (Live Traffic Routing)</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans mt-1">
                Route live navigation traffic from parked domains, expired web assets, and active link networks straight to target pages via 301/302 redirects.
              </p>
            </div>
            <button
              onClick={() => {
                setFormEngineMode('DOMAIN_REDIRECT');
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-xs rounded-xl border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer shrink-0"
            >
              + Create Forwarding Route
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {redirectRoutes.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl text-zinc-500 font-sans text-xs">
                No domain forwarding routes configured. Add parked or expired domain URLs to route live traffic.
              </div>
            ) : (
              redirectRoutes.map((route) => (
                <div
                  key={route.id}
                  className="p-4 bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 rounded-2xl shadow-[4px_4px_0_#000] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black uppercase rounded">
                      HTTP {route.redirect_type} Permanent
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      Total Forwarded: <strong>{route.total_forwarded_hits.toLocaleString()}</strong>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold text-black dark:text-zinc-100 flex items-center gap-1.5">
                      <span className="text-zinc-400">From:</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">{route.source_domain}</span>
                    </div>
                    <div className="text-xs font-bold text-black dark:text-zinc-100 flex items-center gap-1.5">
                      <span className="text-zinc-400">To:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 truncate">
                        {route.destination_url}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Niche: <strong>{route.niche_tags || 'general'}</strong></span>
                    <span>Device Filter: <strong>{route.device_filter}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL / FORM */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-3xl shadow-[8px_8px_0_#000] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-black dark:border-zinc-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#ff4d00] text-black border-2 border-black rounded-lg flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black uppercase text-black dark:text-zinc-100">
                  Deploy Advanced Traffic Campaign
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-5 text-xs">
              {/* Engine Mode Selection Tabs */}
              <div className="space-y-1.5">
                <label className="font-bold text-black dark:text-zinc-200 uppercase tracking-wider block">
                  Select Subsystem Mode:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormEngineMode('DIRECT_TRAFFIC')}
                    className={`p-3 rounded-xl border-2 border-black text-left cursor-pointer transition-all ${
                      formEngineMode === 'DIRECT_TRAFFIC'
                        ? 'bg-blue-500 text-white shadow-[3px_3px_0_#000]'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-black dark:text-zinc-200'
                    }`}
                  >
                    <div className="font-extrabold uppercase text-[11px]">Subsystem A</div>
                    <div className="text-[10px] mt-0.5">Direct Chromium Traffic</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormEngineMode('SERP_CTR')}
                    className={`p-3 rounded-xl border-2 border-black text-left cursor-pointer transition-all ${
                      formEngineMode === 'SERP_CTR'
                        ? 'bg-purple-600 text-white shadow-[3px_3px_0_#000]'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-black dark:text-zinc-200'
                    }`}
                  >
                    <div className="font-extrabold uppercase text-[11px]">Subsystem B</div>
                    <div className="text-[10px] mt-0.5">Search CTR &amp; SERP Engine</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormEngineMode('DOMAIN_REDIRECT')}
                    className={`p-3 rounded-xl border-2 border-black text-left cursor-pointer transition-all ${
                      formEngineMode === 'DOMAIN_REDIRECT'
                        ? 'bg-emerald-600 text-white shadow-[3px_3px_0_#000]'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-black dark:text-zinc-200'
                    }`}
                  >
                    <div className="font-extrabold uppercase text-[11px]">Subsystem C</div>
                    <div className="text-[10px] mt-0.5">Domain Forwarding Layer</div>
                  </button>
                </div>
              </div>

              {/* Campaign Name */}
              <div className="space-y-1">
                <label className="font-bold text-black dark:text-zinc-200 uppercase">
                  Campaign Title / Tag
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Q3 High-Ticket Resume Engine Boost"
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 rounded-xl font-mono text-xs focus:outline-none focus:border-[#ff4d00]"
                />
              </div>

              {/* Target URLs */}
              <div className="space-y-1">
                <label className="font-bold text-black dark:text-zinc-200 uppercase">
                  Target Landing Page URLs (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formTargetUrls}
                  onChange={(e) => setFormTargetUrls(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 rounded-xl font-mono text-xs focus:outline-none focus:border-[#ff4d00]"
                />
              </div>

              {/* Engine specific options */}
              {formEngineMode === 'SERP_CTR' && (
                <div className="p-3 bg-purple-500/10 border-2 border-purple-500/30 rounded-xl space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-purple-900 dark:text-purple-200 uppercase">
                      SERP Keywords to Search &amp; Click
                    </label>
                    <textarea
                      rows={2}
                      value={formKeywords}
                      onChange={(e) => setFormKeywords(e.target.value)}
                      placeholder="e.g., AI resume builder 2026&#10;best GEO backlink indexing tools"
                      className="w-full p-2 bg-white dark:bg-zinc-950 border border-purple-500/40 rounded-lg font-mono text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="font-bold text-purple-900 dark:text-purple-200 uppercase flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formAntiPogo}
                        onChange={(e) => setFormAntiPogo(e.target.checked)}
                        className="w-4 h-4 accent-purple-600 cursor-pointer"
                      />
                      <span>Enforce Anti-Pogo-Sticking Guard (&gt;60s internal dwell)</span>
                    </label>
                  </div>
                </div>
              )}

              {formEngineMode === 'DOMAIN_REDIRECT' && (
                <div className="p-3 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-emerald-900 dark:text-emerald-200 uppercase block mb-1">
                        Parked / Expired Source Domain
                      </label>
                      <input
                        type="text"
                        value={formRedirectSource}
                        onChange={(e) => setFormRedirectSource(e.target.value)}
                        placeholder="expired-seo-vault.com"
                        className="w-full p-2 bg-white dark:bg-zinc-950 border border-emerald-500/40 rounded-lg font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-emerald-900 dark:text-emerald-200 uppercase block mb-1">
                        Redirect HTTP Code
                      </label>
                      <select
                        value={formRedirectType}
                        onChange={(e) => setFormRedirectType(Number(e.target.value) as 301 | 302)}
                        className="w-full p-2 bg-white dark:bg-zinc-950 border border-emerald-500/40 rounded-lg font-mono text-xs cursor-pointer"
                      >
                        <option value={301}>301 Permanent Redirect</option>
                        <option value={302}>302 Temporary Redirect</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Behavior tuning sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Daily Target Volume:</span>
                    <span className="font-mono text-[#ff4d00]">{formDailyVolume} visits</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={5000}
                    step={50}
                    value={formDailyVolume}
                    onChange={(e) => setFormDailyVolume(Number(e.target.value))}
                    className="w-full accent-[#ff4d00] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Target Bounce Rate:</span>
                    <span className="font-mono text-indigo-500">{formBounceRatePct}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={95}
                    step={5}
                    value={formBounceRatePct}
                    onChange={(e) => setFormBounceRatePct(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Dwell Duration Window:</span>
                    <span className="font-mono text-purple-500">
                      {formMinDwellSec}s – {formMaxDwellSec}s
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formMinDwellSec}
                      onChange={(e) => setFormMinDwellSec(Number(e.target.value))}
                      className="w-1/2 p-1.5 bg-white dark:bg-zinc-900 border rounded font-mono text-xs"
                      placeholder="Min (s)"
                    />
                    <input
                      type="number"
                      value={formMaxDwellSec}
                      onChange={(e) => setFormMaxDwellSec(Number(e.target.value))}
                      className="w-1/2 p-1.5 bg-white dark:bg-zinc-900 border rounded font-mono text-xs"
                      placeholder="Max (s)"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Mobile / Desktop Ratio:</span>
                    <span className="font-mono text-cyan-500">
                      {formMobileRatioPct}% Mobile
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={formMobileRatioPct}
                    onChange={(e) => setFormMobileRatioPct(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Referrer & GA4 settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-black dark:text-zinc-200 uppercase block mb-1">
                    Referrer Chain Spoofing
                  </label>
                  <select
                    value={formReferrerType}
                    onChange={(e) => setFormReferrerType(e.target.value as ReferrerType)}
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg font-mono text-xs cursor-pointer"
                  >
                    <option value="ORGANIC">Organic (Google, Bing Search)</option>
                    <option value="SOCIAL">Social (X / Twitter, LinkedIn, FB)</option>
                    <option value="DIRECT">Direct (Direct Browser URL)</option>
                    <option value="CUSTOM">Custom Referral Domain List</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-black dark:text-zinc-200 uppercase block mb-1">
                    GA4 Measurement ID (Pixel Test)
                  </label>
                  <input
                    type="text"
                    value={formGa4MeasurementId}
                    onChange={(e) => setFormGa4MeasurementId(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t-2 border-black dark:border-zinc-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-zinc-200 font-bold uppercase rounded-xl border border-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCampaign}
                  className="px-6 py-2 bg-[#ff4d00] hover:bg-orange-600 text-black font-black uppercase rounded-xl border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer transition-all flex items-center gap-2"
                >
                  {submittingCampaign ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-black" />}
                  <span>Launch Campaign Fleet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
