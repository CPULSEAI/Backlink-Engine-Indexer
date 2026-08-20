import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary, sendDiagnosticsLog } from './components/ErrorBoundary.tsx';
import './index.css';

// Global uncaught JavaScript error and promise rejection listeners with silent telemetry logging
if (typeof window !== 'undefined') {
  const isBenignError = (msg: string, stack: string = '') => {
    const text = `${msg} ${stack}`.toLowerCase();
    return (
      text.includes('websocket closed without opened') ||
      text.includes('failed to connect to websocket') ||
      text.includes('[vite] failed to connect') ||
      text.includes('vite:ws') ||
      text.includes('resizeobserver loop')
    );
  };

  window.addEventListener('error', (event) => {
    const message = event.message || event.error?.message || 'Uncaught error on window';
    const stack = event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`;
    
    if (isBenignError(message, stack)) {
      return;
    }

    sendDiagnosticsLog({
      errorName: event.error?.name || 'UncaughtWindowError',
      message,
      stack,
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = typeof reason === 'string' ? reason : reason?.message || 'Unhandled Promise Rejection';
    const stack = reason?.stack || '';

    if (isBenignError(message, stack)) {
      return;
    }

    sendDiagnosticsLog({
      errorName: 'UnhandledPromiseRejection',
      message,
      stack,
      metadata: {
        type: typeof reason,
      },
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
