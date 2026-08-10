import React, { useState } from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Crown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Gift,
  HelpCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BillingInfo } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  billing: BillingInfo | null;
  onRefreshBilling: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  billing,
  onRefreshBilling,
}) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string>('');
  const [applyingPromo, setApplyingPromo] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleApplyPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      toast.error('Please enter a valid promo code.');
      return;
    }

    setApplyingPromo(true);
    const toastId = toast.loading('Validating & applying promo code...');
    try {
      const res = await axios.post('/api/billing/promo', { code: promoCode });
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Promo code applied successfully!', { id: toastId });
        setPromoCode('');
        onRefreshBilling();
      } else {
        toast.error(res.data?.error || 'Failed to apply promo code', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid promo code. Try PROMO50 or LAUNCH2026', { id: toastId });
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleCheckout = async (plan: 'PRO' | 'AGENCY' | 'TOPUP_100') => {
    setLoadingPlan(plan);
    const toastId = toast.loading(`Preparing Stripe Checkout for ${plan} plan...`);
    try {
      const res = await axios.post('/api/billing/checkout', {
        plan,
        returnUrl: window.location.href.split('?')[0],
      });

      if (res.data && res.data.url) {
        toast.success(res.data.message || 'Redirecting to checkout...', { id: toastId });
        if (res.data.simulated) {
          // If fallback/demo mode was applied
          onRefreshBilling();
        }
        window.location.href = res.data.url;
      } else {
        toast.error('Failed to create checkout session', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Checkout initialization failed', { id: toastId });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCustomerPortal = async () => {
    const toastId = toast.loading('Opening Stripe Customer Portal...');
    try {
      const res = await axios.post('/api/billing/portal', {
        returnUrl: window.location.href.split('?')[0],
      });
      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error(res.data?.message || 'Failed to open customer portal', { id: toastId });
      }
    } catch (err: any) {
      toast.error('Failed to open customer portal', { id: toastId });
    }
  };

  const remaining = billing?.credits_remaining ?? 15;
  const total = billing?.credits_total ?? 15;
  const percentage = Math.min(100, Math.max(0, Math.round((remaining / total) * 100)));
  const currentPlan = billing?.plan || 'TRIAL';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative my-8">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-purple-600/20 border-b border-zinc-800 p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Crown className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Subscription &amp; Indexation Quotas</h2>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  Stripe Enabled
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Manage your indexation credit balance, active subscription tier, and Stripe billing portal.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 7-Day Free Trial Notice Banner */}
          {currentPlan === 'TRIAL' && (
            <div className="bg-gradient-to-r from-amber-950/60 to-orange-950/60 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl mt-0.5">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-200 flex items-center gap-2">
                    <span>7-Day Free Trial Active</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded">
                      {billing?.trial_days_remaining ?? 7} Days Left
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    You received <strong>15 free indexation credits</strong> on your 7-day trial. Upgrade to Pro or Agency to unlock unlimited background scheduling and higher credit volume!
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCheckout('PRO')}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all shrink-0 cursor-pointer"
              >
                Upgrade Plan
              </button>
            </div>
          )}

          {/* Current Credit Balance Meter */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Available Indexation Credits</span>
              </span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {remaining} / {total} Credits Remaining
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-900 rounded-full h-3 p-0.5 border border-zinc-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>Current Plan: <strong className="text-zinc-200">{currentPlan}</strong></span>
              <span>1 URL Submission = 1 Credit</span>
            </div>
          </div>

          {/* Promo Code Redemption Option */}
          <div className="bg-zinc-950 border border-indigo-500/30 rounded-2xl p-4">
            <form onSubmit={handleApplyPromoCode} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <label htmlFor="promoCodeInput" className="block text-xs font-bold text-zinc-300">
                    Redeem Promo Code or Coupon
                  </label>
                  <span className="text-[11px] text-zinc-500">
                    Apply discount or claim free bonus indexation credits (e.g., <code className="text-indigo-400">PROMO50</code>, <code className="text-indigo-400">LAUNCH2026</code>)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="promoCodeInput"
                  type="text"
                  placeholder="Enter code (e.g. PROMO50)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white uppercase tracking-wider font-mono focus:outline-none focus:border-indigo-500 w-full sm:w-48"
                />
                <button
                  type="submit"
                  disabled={applyingPromo || !promoCode.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer border border-indigo-400/30 shadow-md shadow-indigo-600/20"
                >
                  {applyingPromo ? 'Applying...' : 'Apply Code'}
                </button>
              </div>
            </form>
          </div>

          {/* Pricing Tiers Grid */}
          <div>
            <h3 className="text-sm font-bold text-zinc-200 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Select Subscription Tier</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pro Tier ($49/mo) */}
              <div className="bg-zinc-950 border border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/70 transition-all relative group">
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full font-mono">
                  Most Popular
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Pro Tier</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">$49</span>
                    <span className="text-xs text-zinc-400 font-mono">/ month</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Ideal for webmasters and growing sites needing consistent search discovery.
                  </p>

                  <ul className="space-y-2 text-xs text-zinc-300 pt-3 border-t border-zinc-900">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span><strong>500 Indexation Credits</strong> / mo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Google Indexing API Integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>SmartBatchScheduler Drip Feeds</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Multi-Ping Broadcast Network</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleCheckout('PRO')}
                  disabled={loadingPlan === 'PRO'}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{loadingPlan === 'PRO' ? 'Processing...' : 'Subscribe Pro ($49)'}</span>
                </button>
              </div>

              {/* Agency Tier ($199/mo) */}
              <div className="bg-zinc-950 border border-purple-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-purple-500/70 transition-all relative group">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">Agency Tier</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">$199</span>
                    <span className="text-xs text-zinc-400 font-mono">/ month</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    High volume for SEO agencies, client portfolios, and automated indexing pipelines.
                  </p>

                  <ul className="space-y-2 text-xs text-zinc-300 pt-3 border-t border-zinc-900">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span><strong>3,000 Indexation Credits</strong> / mo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Priority Proxy Pool &amp; High Concurrency</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Unlimited SmartBatchScheduler Queues</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Dedicated Domain Profiler Scans</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleCheckout('AGENCY')}
                  disabled={loadingPlan === 'AGENCY'}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>{loadingPlan === 'AGENCY' ? 'Processing...' : 'Subscribe Agency ($199)'}</span>
                </button>
              </div>

              {/* Credit Top-Up Pack ($25) */}
              <div className="bg-zinc-950 border border-cyan-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/70 transition-all relative group">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">100 Credit Top-Up</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">$25</span>
                    <span className="text-xs text-zinc-400 font-mono">one-time</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Need quick additional credits without modifying your existing monthly plan?
                  </p>

                  <ul className="space-y-2 text-xs text-zinc-300 pt-3 border-t border-zinc-900">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span><strong>+100 Bonus Credits</strong> (No expiration)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Instant balance top-up</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Use across all submission modules</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleCheckout('TOPUP_100')}
                  disabled={loadingPlan === 'TOPUP_100'}
                  className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>{loadingPlan === 'TOPUP_100' ? 'Processing...' : 'Add 100 Credits ($25)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stripe Customer Portal Link */}
          {billing?.stripe_customer_id && (
            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <button
                onClick={handleCustomerPortal}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-all"
              >
                <span>Manage Payment Methods &amp; Invoices in Stripe</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
