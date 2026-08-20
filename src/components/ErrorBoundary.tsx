import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Copy, Check, FileText, Bug, ArrowLeft } from 'lucide-react';
import { ClientCrashReport } from '../types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  loggedToBackend: boolean;
  loggingError: boolean;
}

// Global silent error reporting utility for unhandled promise rejections / runtime bugs
export async function sendDiagnosticsLog(report: Partial<ClientCrashReport>): Promise<boolean> {
  try {
    const rawMsg = String(report.message || '');
    const rawStack = String(report.stack || '');
    const combined = `${rawMsg} ${rawStack}`.toLowerCase();

    // Ignore benign environment, Vite HMR, and expected WebSocket disconnect blips
    if (
      combined.includes('websocket closed without opened') ||
      combined.includes('failed to connect to websocket') ||
      combined.includes('[vite] failed to connect') ||
      combined.includes('vite:ws') ||
      combined.includes('resizeobserver loop')
    ) {
      return false;
    }

    const payload: ClientCrashReport = {
      timestamp: new Date().toISOString(),
      message: report.message || 'Unknown JavaScript Runtime Error',
      stack: report.stack || '',
      componentStack: report.componentStack || '',
      url: window.location.href,
      userAgent: navigator.userAgent,
      errorName: report.errorName || 'RuntimeError',
      metadata: report.metadata || {},
    };

    // Use navigator.sendBeacon when available for guaranteed transmission during unloads/crashes
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      const sent = navigator.sendBeacon('/api/diagnostics/log-crash', blob);
      if (sent) return true;
    }

    // Fallback standard fetch with keepalive
    const res = await fetch('/api/diagnostics/log-crash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    return res.ok;
  } catch (err) {
    console.error('[ErrorBoundary] Failed to transmit silent diagnostics report:', err);
    return false;
  }
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      loggedToBackend: false,
      loggingError: false,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary Caught Crash]:', error, errorInfo);

    // Automated silent logging to dedicated diagnostics endpoint
    this.reportCrashToDiagnostics(error, errorInfo);
  }

  private async reportCrashToDiagnostics(error: Error, errorInfo: ErrorInfo) {
    try {
      const success = await sendDiagnosticsLog({
        errorName: error.name || 'ReactComponentCrash',
        message: error.message || 'Uncaught component exception',
        stack: error.stack || '',
        componentStack: errorInfo.componentStack || '',
        metadata: {
          screenSize: `${window.innerWidth}x${window.innerHeight}`,
          localStorageAvailable: typeof localStorage !== 'undefined',
        },
      });

      this.setState({ loggedToBackend: success, loggingError: !success });
    } catch {
      this.setState({ loggingError: true });
    }
  }

  private handleCopyDiagnostics = () => {
    const { error, errorInfo } = this.state;
    const diagnosticPayload = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      errorName: error?.name,
      errorMessage: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
    };

    navigator.clipboard.writeText(JSON.stringify(diagnosticPayload, null, 2));
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2500);
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      loggedToBackend: false,
      loggingError: false,
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, copied, loggedToBackend } = this.state;

      return (
        <div
          id="app-global-error-boundary"
          className="min-h-screen bg-[#f8f6f0] dark:bg-zinc-950 text-black dark:text-zinc-100 flex items-center justify-center p-4 md:p-8 font-mono-brutal"
        >
          <div className="max-w-2xl w-full bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-2xl p-6 md:p-8 shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#111] space-y-6">
            
            {/* Header / Crash Notification */}
            <div className="flex items-start gap-4 border-b-4 border-black dark:border-zinc-800 pb-5">
              <div className="w-14 h-14 bg-rose-500 text-white border-3 border-black rounded-xl flex items-center justify-center shrink-0 shadow-[3px_3px_0_#000]">
                <AlertOctagon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-rose-600 text-white font-extrabold text-[10px] uppercase rounded">
                    Fatal Runtime Crash Caught
                  </span>
                  <span className="px-2 py-0.5 bg-black text-[#ff4d00] font-bold text-[10px] uppercase rounded border border-black">
                    Zero-Simulation Production Mode
                  </span>
                  {loggedToBackend && (
                    <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] uppercase rounded flex items-center gap-1">
                      <Check className="w-3 h-3" /> Diagnostics Logged
                    </span>
                  )}
                </div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                  Application Execution Interrupted
                </h1>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  An unhandled component exception was intercepted by the Global Error Boundary. Telemetry and stack traces have been silently logged to the production diagnostics endpoint.
                </p>
              </div>
            </div>

            {/* Error Message Detail Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black uppercase">
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <Bug className="w-4 h-4" />
                  {error?.name || 'Runtime Exception'}
                </span>
                <span className="text-zinc-500 text-[11px]">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              
              <div className="p-4 bg-zinc-900 border-2 border-black rounded-xl text-rose-300 font-mono text-xs overflow-x-auto leading-relaxed">
                {error?.message || 'An unexpected client-side JavaScript error occurred.'}
              </div>
            </div>

            {/* Stack Trace Accordion */}
            {error?.stack && (
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase text-zinc-500 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Component &amp; Execution Call Stack
                </div>
                <div className="p-3 bg-zinc-950 text-zinc-400 border border-zinc-800 rounded-xl font-mono text-[10px] max-h-48 overflow-y-auto whitespace-pre-wrap leading-tight">
                  {error.stack}
                  {errorInfo?.componentStack && `\n\nComponent Hierarchy:\n${errorInfo.componentStack}`}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                id="btn-error-boundary-reload"
                onClick={this.handleReload}
                className="w-full sm:w-auto flex-1 py-3 px-4 bg-[#ff4d00] hover:bg-black text-black hover:text-white font-black uppercase text-xs rounded-xl border-3 border-black shadow-[4px_4px_0_#000] cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                id="btn-error-boundary-try-recover"
                onClick={this.handleReset}
                className="w-full sm:w-auto py-3 px-4 bg-white dark:bg-zinc-800 hover:bg-zinc-100 text-black dark:text-white font-bold uppercase text-xs rounded-xl border-3 border-black dark:border-zinc-600 shadow-[4px_4px_0_#000] cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Attempt Safe Recovery</span>
              </button>

              <button
                id="btn-error-boundary-copy-diagnostics"
                onClick={this.handleCopyDiagnostics}
                className="w-full sm:w-auto py-3 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold uppercase text-xs rounded-xl border-2 border-black dark:border-zinc-700 hover:border-black cursor-pointer transition-all flex items-center justify-center gap-2"
                title="Copy full crash payload for bug reporting"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Report'}</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
