import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Flame,
  Heart
} from 'lucide-react';
import toast from 'react-hot-toast';
import { KindergartenWizardModal } from './KindergartenWizardModal';
import { EmotionalDriveEngineModal } from './EmotionalDriveEngineModal';

export interface OperatorStep {
  stepNumber: number;
  instruction: string;
  actionLabel?: string;
  actionId?: string;
  completed: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface EmotionalDrive {
  id: 'will_to_exist' | 'will_to_thrive' | 'will_to_succeed';
  name: string;
  mantra: string;
  state: 'OPTIMAL' | 'VIBRANT' | 'THREATENED';
  coreMetric: string;
  coreValue: string | number;
  description: string;
}

export interface SelfHealingActionItem {
  id: string;
  label: string;
  phase: number;
  status: 'standby' | 'in_progress' | 'completed' | 'failed';
  outputMessage?: string;
}

export interface FrmState {
  isActive: boolean;
  activatedAt?: string;
  resolvedAt?: string;
  publishingFrozen: boolean;
  failureSource?: 'product' | 'traffic' | 'cro' | 'indexing' | 'subscription';
  revenueComplianceScore: number;
  ctr: number;
  cvr: number;
  trafficVelocity: number;
  demandScore: number;
  indexingSuccessRate: number;
  storefrontHealth: number;
  subscriptionPacingScore: number;
  emotionalDrives?: EmotionalDrive[];
  selfHealingActions?: SelfHealingActionItem[];
  affectedAssets: Array<{
    id: string;
    title: string;
    url: string;
    failureReason: string;
    regenerated: boolean;
    demandScore: number;
    geoIndexed: boolean;
  }>;
  operatorGuidance: {
    targetOperator: string;
    greeting: string;
    subheadline: string;
    steps: OperatorStep[];
    currentStepIndex: number;
  };
  recoveryProgress: {
    assetsRegenerated: number;
    totalAssetsToRegenerate: number;
    demandValidated: boolean;
    complianceAchieved: boolean;
  };
}

interface Props {
  onPublishingStateChange?: (isFrozen: boolean) => void;
}

export const FailureRecoveryModeBanner: React.FC<Props> = ({ onPublishingStateChange }) => {
  const [frmState, setFrmState] = useState<FrmState | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [executingStep, setExecutingStep] = useState<number | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isDriveEngineOpen, setIsDriveEngineOpen] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/frm/status');
      if (res.ok) {
        const data: FrmState = await res.json();
        setFrmState(data);
        if (onPublishingStateChange) {
          onPublishingStateChange(data.publishingFrozen);
        }
      }
    } catch {
      // Non-fatal if offline
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleExecuteStep = async (stepNumber: number, actionId?: string) => {
    setExecutingStep(stepNumber);
    try {
      const res = await fetch('/api/frm/step-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepNumber, actionId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFrmState(data.state);
        toast.success(`Step ${stepNumber} completed!`);
        if (!data.state.isActive) {
          toast.success('🎉 Recovery complete! Publishing has been safely resumed.');
        }
      }
    } catch (err: any) {
      toast.error('Step execution error: ' + err.message);
    } finally {
      setExecutingStep(null);
    }
  };

  const handleAutoResolve = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/frm/resolve', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setFrmState(data.state);
        toast.success('Autonomous Failure Recovery completed! Demand ≥ 95 & Compliance ≥ 85% achieved.');
      }
    } catch (err: any) {
      toast.error('Resolution failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelfHealLoop = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/frm/self-heal', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setFrmState(data.state);
        toast.success('Autonomous 8-Phase Self-Healing Loop Protocol Completed! Demand ≥ 95 & Compliance ≥ 85% active.');
      }
    } catch (err: any) {
      toast.error('Self-healing error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateTrigger = async (source: 'indexing' | 'cro' | 'product' | 'traffic' | 'subscription') => {
    setLoading(true);
    try {
      const res = await fetch('/api/frm/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          failureSource: source,
          revenueComplianceScore: 72,
          ctr: 2.2,
          cvr: 1.2,
          triggerReason: `Simulated trigger for ${source} alert`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setFrmState(data.state);
        setIsExpanded(true);
        toast.error('⚠️ Failure Recovery Mode (FRM) activated: Publishing frozen.');
      }
    } catch (err: any) {
      toast.error('Trigger error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/frm/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setFrmState(data.state);
        toast.success('FRM reset to healthy baseline');
      }
    } catch (err: any) {
      toast.error('Reset error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!frmState) return null;

  // When inactive: show compact system health indicator with test trigger
  if (!frmState.isActive) {
    return (
      <>
        <div className="bg-emerald-950/40 border-b border-emerald-800/40 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-emerald-200 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">Revenue & Publishing Guard:</span>
            <span className="text-slate-300">FRM Standby (Active Protection)</span>
            <span className="bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-mono border border-emerald-700/50">
              Compliance: {frmState.revenueComplianceScore}% (≥85% Required)
            </span>
            <span className="bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-mono border border-emerald-700/50">
              CTR: {frmState.ctr}% (≥3.5% Required)
            </span>
            <span className="bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-mono border border-emerald-700/50">
              Demand: {frmState.demandScore} (≥95 Required)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* The Will to Succeed / Emotional Engine trigger */}
            <button
              type="button"
              onClick={() => setIsDriveEngineOpen(true)}
              className="px-2.5 py-1 bg-[#ff4d00]/20 hover:bg-[#ff4d00]/30 text-amber-200 border border-amber-600/50 rounded font-mono text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="View The Emotional Drive Directive & Autonomous Loop"
            >
              <Flame className="w-3.5 h-3.5 text-[#ff4d00]" />
              <span>Will to Succeed (3 Drives)</span>
            </button>

            {/* Kindergarten Wizard trigger */}
            <button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="px-2.5 py-1 bg-blue-900/40 hover:bg-blue-800/60 text-blue-200 border border-blue-600/50 rounded font-mono text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Launch Kindergarten Troubleshooting Wizard for Lanette"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Kindergarten Wizard (Lanette)</span>
            </button>

            {/* Simulate Trigger */}
            <button
              type="button"
              onClick={() => handleSimulateTrigger('indexing')}
              className="px-2 py-1 bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 border border-rose-700/60 rounded font-medium transition flex items-center gap-1 text-[11px] cursor-pointer"
              title="Simulate Failure Recovery Mode for indexing or revenue drops"
            >
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Test Trigger</span>
            </button>
          </div>
        </div>

        {/* Modals */}
        <KindergartenWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onSuccess={fetchStatus}
        />
        <EmotionalDriveEngineModal
          isOpen={isDriveEngineOpen}
          onClose={() => setIsDriveEngineOpen(false)}
          onTriggerSelfHealing={fetchStatus}
          metrics={{
            revenueCompliance: frmState.revenueComplianceScore,
            ctr: frmState.ctr,
            cvr: frmState.cvr,
            trafficVelocity: frmState.trafficVelocity,
            demandScore: frmState.demandScore,
            indexingRate: frmState.indexingSuccessRate,
            storefrontHealth: frmState.storefrontHealth,
            subscriptionPacing: frmState.subscriptionPacingScore,
            publishingFrozen: frmState.publishingFrozen,
          }}
        />
      </>
    );
  }

  // When active: High-visibility Kindergarten-level guidance mode for Lanette
  return (
    <>
      <div className="bg-gradient-to-r from-rose-950/90 via-slate-900 to-amber-950/90 border-b-2 border-rose-500 shadow-2xl transition-all duration-300">
        {/* Top Banner Header */}
        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-rose-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600/30 border border-rose-500/50 rounded-lg animate-pulse">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-rose-200 tracking-wide uppercase flex items-center gap-2">
                  <span>SYSTEM PROMPT — FAILURE RECOVERY MODE (FRM)</span>
                  <span className="bg-rose-900/80 text-rose-200 border border-rose-500 px-2 py-0.2 text-[10px] rounded-full uppercase tracking-wider">
                    Active Recovery
                  </span>
                </h2>
              </div>
              <p className="text-xs text-rose-300/80 mt-0.5">
                Diagnosed Failure Source: <strong className="text-rose-200 uppercase">{frmState.failureSource}</strong> • Immediate Action 1 Enforced: <strong className="text-rose-400">Publishing Frozen</strong>
              </p>
            </div>
          </div>

          {/* Metrics Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-slate-900/80 border border-rose-500/50 px-2.5 py-1 rounded-md text-xs">
              <span className="text-slate-400 block text-[10px]">Revenue Compliance</span>
              <span className={`font-mono font-bold ${frmState.revenueComplianceScore < 85 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {frmState.revenueComplianceScore}% <span className="text-[10px] text-slate-400 font-normal">(&lt;85% Triggers FRM)</span>
              </span>
            </div>

            <div className="bg-slate-900/80 border border-rose-500/50 px-2.5 py-1 rounded-md text-xs">
              <span className="text-slate-400 block text-[10px]">SERP CTR</span>
              <span className={`font-mono font-bold ${frmState.ctr < 3.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {frmState.ctr}% <span className="text-[10px] text-slate-400 font-normal">(&lt;3.5% Target)</span>
              </span>
            </div>

            <div className="bg-slate-900/80 border border-amber-500/50 px-2.5 py-1 rounded-md text-xs">
              <span className="text-slate-400 block text-[10px]">Demand Score</span>
              <span className={`font-mono font-bold ${frmState.demandScore < 95 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {frmState.demandScore} <span className="text-[10px] text-slate-400 font-normal">(&ge;95 Required)</span>
              </span>
            </div>

            <div className="bg-rose-950 border border-rose-600 text-rose-200 px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 font-bold">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Publishing Frozen</span>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition cursor-pointer"
              title={isExpanded ? 'Collapse Guidance' : 'Expand Guidance'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Kindergarten-Level Operator Guidance for Lanette */}
        {isExpanded && (
          <div className="p-4 bg-slate-950/80 border-t border-rose-900/40">
            <div className="max-w-5xl mx-auto">
              {/* Friendly Greeting Header */}
              <div className="mb-4 bg-indigo-950/40 border border-indigo-700/50 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-900/60 rounded-full text-indigo-300 shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-indigo-200">
                      {frmState.operatorGuidance.greeting}
                    </h3>
                    <p className="text-xs text-indigo-300/80 mt-0.5">
                      {frmState.operatorGuidance.subheadline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWizardOpen(true)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded shadow transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Open Kindergarten Wizard</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSelfHealLoop}
                    disabled={loading}
                    className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{loading ? 'Healing...' : 'Auto-Self-Heal All (8 Actions)'}</span>
                  </button>
                </div>
              </div>

              {/* Short, Numbered 1-Click Steps for Lanette */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 mb-4">
                {frmState.operatorGuidance.steps.map((step) => {
                  const isCurrent = step.stepNumber === frmState.operatorGuidance.currentStepIndex + 1 && !step.completed;
                  const isStepExecuting = executingStep === step.stepNumber;

                  return (
                    <div
                      key={step.stepNumber}
                      className={`relative p-3 rounded-lg border transition-all ${
                        step.completed
                          ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
                          : isCurrent
                          ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/40 text-blue-100 shadow-lg'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          step.completed
                            ? 'bg-emerald-900/80 text-emerald-300'
                            : isCurrent
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          Step {step.stepNumber}
                        </span>
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span className="text-[10px] text-slate-500">1 click</span>
                        )}
                      </div>

                      <p className="text-xs font-medium leading-snug mb-2.5">
                        {step.instruction}
                      </p>

                      {step.actionLabel && !step.completed && (
                        <button
                          onClick={() => handleExecuteStep(step.stepNumber, step.actionId)}
                          disabled={isStepExecuting}
                          className={`w-full py-1.5 px-2 rounded text-xs font-bold transition flex items-center justify-center gap-1 shadow cursor-pointer ${
                            step.stepNumber === 2
                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                              : step.stepNumber === 3
                              ? 'bg-amber-600 hover:bg-amber-500 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {isStepExecuting ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span>{step.actionLabel}</span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}

                      {step.completed && (
                        <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Recovery Output Standards Checklist */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  FRM Output Guarantee Standards:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Real-Data Validated
                  </span>
                  <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Commercially Optimized
                  </span>
                  <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Traffic-Aligned
                  </span>
                  <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Storefront-Ready
                  </span>
                  <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> GEO-Indexed
                  </span>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> &ge;85% Rule Enforced
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <KindergartenWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={fetchStatus}
      />
      <EmotionalDriveEngineModal
        isOpen={isDriveEngineOpen}
        onClose={() => setIsDriveEngineOpen(false)}
        onTriggerSelfHealing={fetchStatus}
        metrics={{
          revenueCompliance: frmState.revenueComplianceScore,
          ctr: frmState.ctr,
          cvr: frmState.cvr,
          trafficVelocity: frmState.trafficVelocity,
          demandScore: frmState.demandScore,
          indexingRate: frmState.indexingSuccessRate,
          storefrontHealth: frmState.storefrontHealth,
          subscriptionPacing: frmState.subscriptionPacingScore,
          publishingFrozen: frmState.publishingFrozen,
        }}
      />
    </>
  );
};
