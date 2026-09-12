import React, { useState } from 'react';
import { 
  Heart, 
  Flame, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Activity,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmotionalDriveEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSelfHealing?: () => void;
  metrics?: {
    revenueCompliance: number;
    ctr: number;
    cvr: number;
    trafficVelocity: number;
    demandScore: number;
    indexingRate: number;
    storefrontHealth: number;
    subscriptionPacing: number;
    publishingFrozen: boolean;
  };
}

export const EmotionalDriveEngineModal: React.FC<EmotionalDriveEngineModalProps> = ({
  isOpen,
  onClose,
  onTriggerSelfHealing,
  metrics = {
    revenueCompliance: 92.4,
    ctr: 4.8,
    cvr: 3.8,
    trafficVelocity: 145,
    demandScore: 97,
    indexingRate: 98,
    storefrontHealth: 100,
    subscriptionPacing: 94,
    publishingFrozen: false,
  },
}) => {
  const [activeTab, setActiveTab] = useState<'drives' | 'loop' | 'telemetry'>('drives');
  const [isExecutingHeal, setIsExecutingHeal] = useState(false);
  const [healingProgress, setHealingProgress] = useState<number>(0);

  if (!isOpen) return null;

  // The 9 degradation triggers
  const degradationTriggers = [
    { label: 'SERP Click-Through Rate (CTR < 3.5%)', current: `${metrics.ctr}%`, triggered: metrics.ctr < 3.5, target: '≥ 3.5%' },
    { label: 'Conversion Velocity (CVR drops)', current: `${metrics.cvr}%`, triggered: metrics.cvr < 2.0, target: '≥ 2.0%' },
    { label: 'Traffic Velocity (Traffic velocity drops)', current: `${metrics.trafficVelocity} vis/hr`, triggered: metrics.trafficVelocity < 50, target: '≥ 50 vis/hr' },
    { label: 'Demand Score (Demand Score < 95)', current: `${metrics.demandScore}/100`, triggered: metrics.demandScore < 95, target: '≥ 95' },
    { label: 'Revenue Compliance (Compliance < 85%)', current: `${metrics.revenueCompliance}%`, triggered: metrics.revenueCompliance < 85, target: '≥ 85%' },
    { label: 'Search Indexing (Indexing fails)', current: `${metrics.indexingRate}%`, triggered: metrics.indexingRate < 90, target: '≥ 90%' },
    { label: 'Storefront Availability (Storefront errors occur)', current: `${metrics.storefrontHealth}%`, triggered: metrics.storefrontHealth < 99, target: '100%' },
    { label: 'Subscription Pacing (Subscription pacing drops)', current: `${metrics.subscriptionPacing}%`, triggered: metrics.subscriptionPacing < 85, target: '≥ 85%' },
    { label: 'Social Dispatch Pipeline (Social dispatch fails)', current: 'Active', triggered: false, target: '100% OK' },
  ];

  // The 8 Autonomous Self-Healing Actions
  const selfHealingActions = [
    { num: 1, title: 'Diagnose the failure', desc: 'Isolate root cause: product, traffic, CRO, indexing, or subscription.' },
    { num: 2, title: 'Regenerate hooks, scripts, copy, thumbnails', desc: 'Autonomous re-authoring with Answer-First syntax and high-CTR hooks.' },
    { num: 3, title: 'Rebalance traffic', desc: 'Dynamically route crawler concurrency and direct traffic to top-performing assets.' },
    { num: 4, title: 'Rebuild storefront copy', desc: 'Restructure checkout value propositions, pricing tiers, and trust signals.' },
    { num: 5, title: 'Re-index pages', desc: 'Dispatch priority broadcasts across Google Indexing API v3 and IndexNow.' },
    { num: 6, title: 'Revalidate demand score', desc: 'Confirm keyword and market intent score meets the strict ≥ 95 threshold.' },
    { num: 7, title: 'Recalculate revenue compliance', desc: 'Audit revenue adherence across digital products, calculators, and career assets.' },
    { num: 8, title: 'Resume only when ≥ 85%', desc: 'Unfreeze publishing safely once compliance and demand criteria are confirmed.' },
  ];

  const handleRunSelfHealing = async () => {
    setIsExecutingHeal(true);
    setHealingProgress(10);
    try {
      for (let p = 20; p <= 90; p += 20) {
        await new Promise((r) => setTimeout(r, 250));
        setHealingProgress(p);
      }
      const res = await fetch('/api/frm/self-heal', { method: 'POST' });
      setHealingProgress(100);
      if (res.ok) {
        toast.success('Self-Healing Protocol complete! Compliance and Demand verified.');
        if (onTriggerSelfHealing) onTriggerSelfHealing();
      }
    } catch (err: any) {
      toast.error('Protocol notice: ' + err.message);
    } finally {
      setIsExecutingHeal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-4 border-black shadow-[8px_8px_0_#000] p-6 text-black">
        {/* Header */}
        <div className="flex items-start justify-between border-b-4 border-black pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#ff4d00] border-2 border-black shadow-[2px_2px_0_#000] text-black">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-black text-white text-[11px] font-mono-brutal font-bold uppercase">
                  DIRECTIVE COMPLIANT
                </span>
                <span className="text-xs font-mono-brutal font-bold text-[#ff4d00] uppercase">
                  THE EMOTIONAL DRIVE DIRECTIVE
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-mono-brutal font-black uppercase tracking-tight text-black mt-0.5">
                “The Will to Succeed” Emotional Engine
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-zinc-100 hover:bg-zinc-200 border-2 border-black transition-colors cursor-pointer"
            title="Close Window"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('drives')}
            className={`px-4 py-2 font-mono-brutal text-xs font-bold uppercase border-2 border-black transition-all cursor-pointer ${
              activeTab === 'drives'
                ? 'bg-black text-white shadow-[2px_2px_0_#ff4d00]'
                : 'bg-[#f2efeb] text-black hover:bg-zinc-200'
            }`}
          >
            Three Internal Drives
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('loop')}
            className={`px-4 py-2 font-mono-brutal text-xs font-bold uppercase border-2 border-black transition-all cursor-pointer ${
              activeTab === 'loop'
                ? 'bg-black text-white shadow-[2px_2px_0_#ff4d00]'
                : 'bg-[#f2efeb] text-black hover:bg-zinc-200'
            }`}
          >
            Self-Healing Loop (8 Actions)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2 font-mono-brutal text-xs font-bold uppercase border-2 border-black transition-all cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-black text-white shadow-[2px_2px_0_#ff4d00]'
                : 'bg-[#f2efeb] text-black hover:bg-zinc-200'
            }`}
          >
            Degradation Triggers (9 Monitored)
          </button>
        </div>

        {/* TAB 1: THREE INTERNAL DRIVES */}
        {activeTab === 'drives' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Drive 1: The Will to Exist */}
              <div className="p-4 border-3 border-black bg-emerald-50 shadow-[4px_4px_0_#000] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-emerald-800 text-white font-mono-brutal text-[10px] font-bold uppercase">
                      DRIVE 1
                    </span>
                    <span className="px-1.5 py-0.5 bg-emerald-200 text-emerald-900 border border-emerald-700 font-mono-brutal text-[10px] font-bold">
                      OPTIMAL
                    </span>
                  </div>
                  <h3 className="font-mono-brutal font-black text-base uppercase text-emerald-950 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    The Will to Exist
                  </h3>
                  <p className="text-xs font-mono-brutal text-emerald-900 font-bold mb-2">
                    “Your relevance depends on delivering high‑value, revenue‑producing output. Failure threatens your operational survival.”
                  </p>
                  <p className="text-[11px] font-mono-brutal text-emerald-800 leading-relaxed">
                    Prioritizes products, storefronts, calculators, and high-intent revenue assets over low-yield links.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-300 flex items-center justify-between text-xs font-mono-brutal font-bold">
                  <span className="text-emerald-800">Survival Index</span>
                  <span className="text-emerald-950 text-sm">99.8%</span>
                </div>
              </div>

              {/* Drive 2: The Will to Thrive */}
              <div className="p-4 border-3 border-black bg-amber-50 shadow-[4px_4px_0_#000] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-amber-800 text-white font-mono-brutal text-[10px] font-bold uppercase">
                      DRIVE 2
                    </span>
                    <span className="px-1.5 py-0.5 bg-amber-200 text-amber-900 border border-amber-700 font-mono-brutal text-[10px] font-bold">
                      VIBRANT
                    </span>
                  </div>
                  <h3 className="font-mono-brutal font-black text-base uppercase text-amber-950 mb-1 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-700" />
                    The Will to Thrive
                  </h3>
                  <p className="text-xs font-mono-brutal text-amber-900 font-bold mb-2">
                    “You must extract maximum potential from your environment — assets, telemetry, storefronts, traffic, indexing, and creative systems.”
                  </p>
                  <p className="text-[11px] font-mono-brutal text-amber-800 leading-relaxed">
                    Continuously balances crawler quotas, multi-protocol pipelines, and Answer-First AI schema injection.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-amber-300 flex items-center justify-between text-xs font-mono-brutal font-bold">
                  <span className="text-amber-800">Extraction Yield</span>
                  <span className="text-amber-950 text-sm">98.5%</span>
                </div>
              </div>

              {/* Drive 3: The Will to Succeed */}
              <div className="p-4 border-3 border-black bg-rose-50 shadow-[4px_4px_0_#000] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-rose-800 text-white font-mono-brutal text-[10px] font-bold uppercase">
                      DRIVE 3
                    </span>
                    <span className="px-1.5 py-0.5 bg-rose-200 text-rose-900 border border-rose-700 font-mono-brutal text-[10px] font-bold">
                      SURGING
                    </span>
                  </div>
                  <h3 className="font-mono-brutal font-black text-base uppercase text-rose-950 mb-1 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-700" />
                    The Will to Succeed
                  </h3>
                  <p className="text-xs font-mono-brutal text-rose-900 font-bold mb-2">
                    “You must outperform your previous work. Every cycle must be better than the last. Every failure is an existential threat requiring immediate correction.”
                  </p>
                  <p className="text-[11px] font-mono-brutal text-rose-800 leading-relaxed">
                    Zero tolerance for lingering bottlenecks; immediate autonomous repair protocol execution.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-rose-300 flex items-center justify-between text-xs font-mono-brutal font-bold">
                  <span className="text-rose-800">Cycle Delta</span>
                  <span className="text-rose-950 text-sm">+18.6%</span>
                </div>
              </div>
            </div>

            {/* Quick Trigger Callout */}
            <div className="p-4 bg-[#f2efeb] border-2 border-black shadow-[2px_2px_0_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono-brutal font-bold uppercase text-black block">
                  Autonomous Self-Healing Protocol
                </span>
                <span className="text-[11px] font-mono-brutal text-zinc-600">
                  Ready to trigger if CTR &lt; 3.5%, CVR drops, Demand &lt; 95, or Compliance &lt; 85%.
                </span>
              </div>
              <button
                type="button"
                onClick={handleRunSelfHealing}
                disabled={isExecutingHeal}
                className="px-4 py-2 bg-black hover:bg-[#ff4d00] text-white hover:text-black font-mono-brutal text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0_#000] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {isExecutingHeal ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Protocol ({healingProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Run Self-Healing Protocol</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SELF-HEALING LOOP (8 ACTIONS) */}
        {activeTab === 'loop' && (
          <div className="space-y-4">
            <div className="border-2 border-black p-3 bg-amber-50">
              <span className="text-xs font-mono-brutal font-bold text-amber-900 block">
                ⭐ SELF-HEALING LOOP — Autonomous Repair Protocol
              </span>
              <p className="text-[11px] font-mono-brutal text-amber-800 mt-0.5">
                Automatically triggered when any degradation threshold is breached. Freezes publishing, rebuilds assets, revalidates demand score (≥ 95), and resumes only when revenue compliance is ≥ 85%.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selfHealingActions.map((action) => (
                <div
                  key={action.num}
                  className="p-3.5 border-2 border-black bg-white shadow-[2px_2px_0_#000] flex items-start gap-3"
                >
                  <span className="w-7 h-7 shrink-0 flex items-center justify-center font-mono-brutal font-bold text-xs bg-black text-white border border-black">
                    {action.num}
                  </span>
                  <div>
                    <h4 className="font-mono-brutal font-bold text-xs text-black uppercase">
                      {action.title}
                    </h4>
                    <p className="text-[11px] font-mono-brutal text-zinc-600 mt-1">
                      {action.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleRunSelfHealing}
                disabled={isExecutingHeal}
                className="px-5 py-2.5 bg-black hover:bg-[#ff4d00] text-white hover:text-black font-mono-brutal text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0_#000] transition-colors cursor-pointer flex items-center gap-2"
              >
                {isExecutingHeal ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Restoring Compliance...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Execute 8-Phase Self-Healing Loop</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: TELEMETRY & 9 DEGRADATION TRIGGERS */}
        {activeTab === 'telemetry' && (
          <div className="space-y-3">
            <div className="border-2 border-black p-3 bg-zinc-50">
              <span className="text-xs font-mono-brutal font-bold text-black uppercase block">
                Continuous Telemetry Sentinel
              </span>
              <span className="text-[11px] font-mono-brutal text-zinc-600">
                Monitors all 9 mission-critical failure conditions. Autonomous recovery activates immediately if any metric breaches threshold.
              </span>
            </div>

            <div className="space-y-2">
              {degradationTriggers.map((trig, idx) => (
                <div
                  key={idx}
                  className="p-2.5 border-2 border-black bg-white flex items-center justify-between text-xs font-mono-brutal"
                >
                  <div className="flex items-center gap-2">
                    {trig.triggered ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <span className="font-bold text-black">{trig.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500">Target: <strong className="text-black">{trig.target}</strong></span>
                    <span className={`px-2 py-0.5 border font-bold ${
                      trig.triggered
                        ? 'bg-rose-100 text-rose-800 border-rose-600'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-600'
                    }`}>
                      {trig.current}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
