import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Trash2,
  X,
  Check,
  ShieldAlert,
  Loader2,
  HelpCircle,
  RotateCcw,
  StopCircle
} from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  severity?: 'danger' | 'warning' | 'info';
  actionType?: 'cancel_job' | 'clear_logs' | 'reset_settings' | 'delete' | 'generic';
  impactItems?: string[];
  requireConfirmationPhrase?: string;
  isProcessing?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText = 'Confirm & Proceed',
  cancelButtonText = 'Cancel',
  severity = 'danger',
  actionType = 'generic',
  impactItems,
  requireConfirmationPhrase,
  isProcessing = false
}) => {
  const [typedPhrase, setTypedPhrase] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTypedPhrase('');
      setInternalLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && !isProcessing && !internalLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isProcessing, internalLoading]);

  if (!isOpen) return null;

  const isConfirmedPhraseValid = !requireConfirmationPhrase || 
    typedPhrase.trim().toLowerCase() === requireConfirmationPhrase.trim().toLowerCase();

  const handleConfirmClick = async () => {
    if (!isConfirmedPhraseValid || isProcessing || internalLoading) return;
    try {
      setInternalLoading(true);
      await onConfirm();
    } catch (err) {
      console.error('Confirmation action error:', err);
    } finally {
      setInternalLoading(false);
    }
  };

  const getActionIcon = () => {
    switch (actionType) {
      case 'cancel_job':
        return <StopCircle className="w-6 h-6 text-rose-500" />;
      case 'clear_logs':
        return <Trash2 className="w-6 h-6 text-rose-500" />;
      case 'reset_settings':
        return <RotateCcw className="w-6 h-6 text-amber-500" />;
      case 'delete':
        return <Trash2 className="w-6 h-6 text-rose-500" />;
      default:
        return severity === 'danger' ? (
          <ShieldAlert className="w-6 h-6 text-rose-500" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        );
    }
  };

  const getBadgeColor = () => {
    if (severity === 'danger') return 'bg-rose-500 text-white';
    if (severity === 'warning') return 'bg-amber-500 text-black';
    return 'bg-blue-500 text-white';
  };

  const getButtonBg = () => {
    if (severity === 'danger') {
      return 'bg-rose-600 hover:bg-rose-700 text-white shadow-[3px_3px_0_#000]';
    }
    if (severity === 'warning') {
      return 'bg-[#ff4d00] hover:bg-black text-black hover:text-white shadow-[3px_3px_0_#000]';
    }
    return 'bg-black hover:bg-zinc-800 text-white shadow-[3px_3px_0_#000]';
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-600 rounded-2xl shadow-[8px_8px_0_#000] overflow-hidden transform transition-all font-mono-brutal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-black text-white px-5 py-4 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2.5">
            {getActionIcon()}
            <h2 id="confirmation-modal-title" className="text-sm font-black uppercase tracking-wider text-white">
              {title}
            </h2>
          </div>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-black/30 ${getBadgeColor()}`}>
            {severity === 'danger' ? 'Destructive Action' : 'Caution Required'}
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border-2 border-black dark:border-zinc-800 rounded-xl space-y-2">
            <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans font-medium">
              {description}
            </p>
          </div>

          {/* Impact checklist if provided */}
          {impactItems && impactItems.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
                Direct Impact &amp; Consequences:
              </span>
              <div className="space-y-1.5 font-sans">
                {impactItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg text-xs text-rose-900 dark:text-rose-300 flex items-start gap-2"
                  >
                    <span className="text-rose-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation phrase input if required */}
          {requireConfirmationPhrase && (
            <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <label className="block text-[11px] font-bold uppercase text-zinc-700 dark:text-zinc-300">
                To confirm, type <span className="text-rose-600 font-black">"{requireConfirmationPhrase}"</span> below:
              </label>
              <input
                type="text"
                value={typedPhrase}
                onChange={(e) => setTypedPhrase(e.target.value)}
                placeholder={`Type "${requireConfirmationPhrase}"`}
                className="w-full bg-white dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 px-3 py-2 text-xs font-bold text-black dark:text-white rounded-lg focus:outline-none focus:border-rose-500 shadow-[2px_2px_0_#000]"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-zinc-100 dark:bg-zinc-950/80 border-t-2 border-black dark:border-zinc-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing || internalLoading}
            className="w-full sm:w-auto px-4 py-2.5 bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 hover:bg-zinc-200 border-2 border-black rounded-xl text-xs font-bold uppercase transition-all shadow-[2px_2px_0_#000] cursor-pointer disabled:opacity-50"
          >
            {cancelButtonText}
          </button>

          <button
            type="button"
            onClick={handleConfirmClick}
            disabled={!isConfirmedPhraseValid || isProcessing || internalLoading}
            className={`w-full sm:w-auto px-5 py-2.5 border-2 border-black rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${getButtonBg()}`}
          >
            {isProcessing || internalLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{confirmButtonText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
