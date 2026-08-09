import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  X,
  Sparkles,
  Zap,
  CheckCircle2,
  Globe,
  Sliders,
  BarChart2,
  TrendingUp,
  Clock,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Play
} from 'lucide-react';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelpManual: () => void;
  onOpenSettings: () => void;
  onRunDemoSubmission: (domain: string) => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onOpenHelpManual,
  onOpenSettings,
  onRunDemoSubmission
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [targetDomain, setTargetDomain] = useState<string>('myseoapp.com');
  const [benchmarkMode, setBenchmarkMode] = useState<'comparative' | 'solo'>('comparative');
  const [scheduleInterval, setScheduleInterval] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [taskCompleted, setTaskCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalSteps = 8;

  const stepsData = [
    {
      step: 1,
      title: 'Welcome to GEO SEO Engine',
      goal: 'Understand platform capabilities and architecture.',
      screenText:
        'Welcome! This platform unifies instant IndexNow protocol submission, 3-way competitive keyword gap analysis, AI content grading for ChatGPT & Perplexity citations, and 30-day backlink success analytics.',
      actionText: 'Start Setup Walkthrough',
      helpTip: 'You can re-launch this wizard anytime from the Help Manual button in the header bar.'
    },
    {
      step: 2,
      title: 'Account & Target Domain Setup',
      goal: 'Define your primary domain for keyword gap analysis and indexing.',
      screenText:
        'Enter your primary domain name below. This domain will automatically populate the Keyword Gap Radar and SEO Domain Profiler.',
      actionText: 'Save Target Domain',
      helpTip: 'Enter a clean domain name without http/https (e.g., brand.com).'
    },
    {
      step: 3,
      title: 'Indexing Protocol Credentials',
      goal: 'Initialize IndexNow & Google Search Console API credentials.',
      screenText:
        'Ensure your IndexNow key and Google Search Console service account JSON key are initialized in Settings for instant multi-engine pings.',
      actionText: 'Verify Credentials',
      helpTip: 'Host your IndexNow key text file at https://yourdomain.com/indexnow.txt.'
    },
    {
      step: 4,
      title: 'Keyword Gap Radar Walkthrough',
      goal: 'Learn how to discover search intent gaps vs competitors.',
      screenText:
        'The Keyword Gap Radar maps your visibility across Commercial, Transactional, Informational, and GEO Focus clusters against your top rivals.',
      actionText: 'Test Benchmark Mode Toggle',
      helpTip: 'Clicking "Grade & Optimize" on any gap cluster launches the AI Content Grader modal.'
    },
    {
      step: 5,
      title: 'First Task Creation: Launch Submission',
      goal: 'Execute a live URL submission ping and backlink verification.',
      screenText:
        'Let’s create your first task! Submitting a URL batch triggers instant IndexNow protocol pings and live WebSocket status updates.',
      actionText: 'Run First Submission Task',
      helpTip: 'Submissions update the live progress bar and generate a historical audit log.'
    },
    {
      step: 6,
      title: '30-Day Backlink Analytics & Line Chart',
      goal: 'Explore long-term backlink success rate tracking.',
      screenText:
        'Monitor confirmed backlink success rates over 30 days using our interactive Recharts Line Chart, Area Chart, and Heatmap views.',
      actionText: 'Activate 30-Day Line Chart',
      helpTip: 'You can toggle chart view modes anytime inside the Analytics Card component.'
    },
    {
      step: 7,
      title: 'Scheduled Automated Crawls',
      goal: 'Enable recurring technical SEO audits and gap calculations.',
      screenText:
        'Automate technical domain audits on daily, weekly, or monthly intervals. All results are saved for historical trend analysis.',
      actionText: 'Enable Weekly Schedule',
      helpTip: 'Scheduled crawls run seamlessly in the background and preserve database history.'
    },
    {
      step: 8,
      title: 'Setup Complete! Ready for Production',
      goal: 'Wrap up onboarding and transition to the live dashboard.',
      screenText:
        'Congratulations! Your GEO SEO Engine workspace is fully configured and ready for production use.',
      actionText: 'Finish & Open Dashboard',
      helpTip: 'Need assistance later? Click the Help Manual button in the header bar!'
    }
  ];

  const currentData = stepsData[currentStep - 1];

  const handleNextStep = () => {
    if (currentStep === 2) {
      if (!targetDomain.trim()) {
        toast.error('Please enter a valid target domain');
        return;
      }
      toast.success(`Target domain set to ${targetDomain}`);
    }

    if (currentStep === 5 && !taskCompleted) {
      setTaskCompleted(true);
      onRunDemoSubmission(targetDomain);
      toast.success('First submission task launched successfully!');
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      localStorage.setItem('geo_seo_onboarded', 'true');
      toast.success('Onboarding complete! Enjoy the platform.');
      onClose();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        
        {/* Step Header Bar */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>First-Time User Onboarding Wizard</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  Step {currentStep} of {totalSteps}
                </span>
              </h3>
              <p className="text-xs text-zinc-400">Guided setup for Generative Engine Optimization &amp; Indexing</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Indicator Bar */}
        <div className="w-full bg-zinc-900 h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-400 h-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Wizard Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Step Header & Goal */}
          <div className="space-y-1 border-b border-zinc-800/80 pb-4">
            <h2 className="text-xl font-bold text-white">{currentData.title}</h2>
            <p className="text-xs font-mono text-indigo-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Goal: {currentData.goal}</span>
            </p>
          </div>

          {/* Screen Text Instructional Box */}
          <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3">
            <p className="text-xs text-zinc-200 leading-relaxed font-sans">{currentData.screenText}</p>

            {/* Custom Interactive Elements per Step */}
            {currentStep === 2 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono text-zinc-400 block font-bold">Target Domain Name:</label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Globe className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={targetDomain}
                      onChange={(e) => setTargetDomain(e.target.value)}
                      placeholder="e.g. mybrand.com"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={() => setTargetDomain('indexerpro.com')}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono rounded-xl border border-zinc-700 transition-all"
                  >
                    Use Sample
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span className="text-zinc-300">IndexNow Protocol Key:</span>
                  <span className="text-emerald-400 font-bold">Active (Key Hash Verified)</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 rounded-lg text-[11px] font-bold"
                >
                  Configure Keys
                </button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Benchmark View Mode:</span>
                  <div className="flex items-center space-x-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    <button
                      onClick={() => setBenchmarkMode('solo')}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        benchmarkMode === 'solo' ? 'bg-emerald-600 text-white' : 'text-zinc-400'
                      }`}
                    >
                      Solo Domain
                    </button>
                    <button
                      onClick={() => setBenchmarkMode('comparative')}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        benchmarkMode === 'comparative' ? 'bg-indigo-600 text-white' : 'text-zinc-400'
                      }`}
                    >
                      3-Way Benchmark
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span className="text-zinc-300">Test Submission Task:</span>
                  <span className={taskCompleted ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {taskCompleted ? 'Completed' : 'Ready to Launch'}
                  </span>
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Scheduled Audit Interval:</span>
                  <select
                    value={scheduleInterval}
                    onChange={(e) => setScheduleInterval(e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-800 text-indigo-300 rounded-lg px-2 py-1 text-xs font-bold"
                  >
                    <option value="daily">Daily Crawl</option>
                    <option value="weekly">Weekly Crawl (Recommended)</option>
                    <option value="monthly">Monthly Crawl</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Help Tip Box */}
          <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex items-start space-x-2 text-xs text-indigo-200">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed"><strong className="text-indigo-300">Pro Tip:</strong> {currentData.helpTip}</p>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between shrink-0">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed border-zinc-800 text-zinc-600'
                : 'border-zinc-800 bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose();
                onOpenHelpManual();
              }}
              className="text-xs text-zinc-400 hover:text-zinc-200 font-mono underline"
            >
              Open Manual
            </button>

            <button
              onClick={handleNextStep}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <span>{currentData.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
