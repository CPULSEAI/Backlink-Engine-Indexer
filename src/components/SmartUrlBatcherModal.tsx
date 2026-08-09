import React, { useState, useMemo } from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, Trash2, Copy, Filter, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

interface SmartUrlBatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawText: string;
  onApplyCleanedUrls: (cleanedText: string) => void;
}

export interface ProcessedUrlItem {
  id: string;
  original: string;
  cleaned: string;
  status: 'valid' | 'fixed_protocol' | 'duplicate' | 'invalid';
  reason?: string;
}

// Regex for robust domain and URL format validation
const STRICT_URL_REGEX = /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,24}(:\d{1,5})?(\/[^\s]*)?$/i;

export const SmartUrlBatcherModal: React.FC<SmartUrlBatcherModalProps> = ({
  isOpen,
  onClose,
  rawText,
  onApplyCleanedUrls,
}) => {
  const [stripQueryParams, setStripQueryParams] = useState<boolean>(false);
  const [forceHttps, setForceHttps] = useState<boolean>(true);
  const [filterTab, setFilterTab] = useState<'all' | 'valid' | 'invalid' | 'duplicate'>('all');

  // Process raw text into structured items
  const processedBatch = useMemo(() => {
    const lines = rawText
      .split(/[\n,;]+/) // Split by newline, comma, or semicolon
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#') && !l.startsWith('//'));

    const seenUrls = new Set<string>();
    const results: ProcessedUrlItem[] = [];

    lines.forEach((line, idx) => {
      let candidate = line;

      // Handle space stripping
      candidate = candidate.replace(/\s+/g, '');

      let status: 'valid' | 'fixed_protocol' | 'duplicate' | 'invalid' = 'valid';
      let reason = '';
      let isFixedProtocol = false;

      // Protocol handling
      if (!candidate.startsWith('http://') && !candidate.startsWith('https://')) {
        candidate = (forceHttps ? 'https://' : 'http://') + candidate;
        isFixedProtocol = true;
      } else if (forceHttps && candidate.startsWith('http://')) {
        candidate = candidate.replace('http://', 'https://');
        isFixedProtocol = true;
      }

      // Query param stripping
      if (stripQueryParams) {
        candidate = candidate.split('?')[0].split('#')[0];
      }

      // Regex format check
      if (!STRICT_URL_REGEX.test(candidate)) {
        status = 'invalid';
        if (!candidate.includes('.')) {
          reason = 'Missing valid domain extension (TLD)';
        } else if (candidate.includes(' ')) {
          reason = 'Contains invalid whitespace characters';
        } else {
          reason = 'Malformed URL structure';
        }
      } else {
        // Normalization for duplicate checking
        const normKey = candidate.toLowerCase().replace(/\/+$/, '');
        if (seenUrls.has(normKey)) {
          status = 'duplicate';
          reason = 'Duplicate URL detected';
        } else {
          seenUrls.add(normKey);
          if (isFixedProtocol) {
            status = 'fixed_protocol';
            reason = 'Auto-prepended https:// protocol';
          }
        }
      }

      results.push({
        id: `url-${idx}-${candidate}`,
        original: line,
        cleaned: candidate,
        status,
        reason,
      });
    });

    return results;
  }, [rawText, stripQueryParams, forceHttps]);

  if (!isOpen) return null;

  const validAndFixedItems = processedBatch.filter(
    (item) => item.status === 'valid' || item.status === 'fixed_protocol'
  );
  const invalidItems = processedBatch.filter((item) => item.status === 'invalid');
  const duplicateItems = processedBatch.filter((item) => item.status === 'duplicate');

  const filteredList = processedBatch.filter((item) => {
    if (filterTab === 'valid') return item.status === 'valid' || item.status === 'fixed_protocol';
    if (filterTab === 'invalid') return item.status === 'invalid';
    if (filterTab === 'duplicate') return item.status === 'duplicate';
    return true;
  });

  const handleApply = () => {
    const cleanedOutput = validAndFixedItems.map((item) => item.cleaned).join('\n');
    onApplyCleanedUrls(cleanedOutput);
    toast.success(
      `Smart URL Batcher applied! ${validAndFixedItems.length} valid URLs batch-processed (${duplicateItems.length} duplicates removed, ${invalidItems.length} invalid dropped).`
    );
    onClose();
  };

  const handleCopyValid = () => {
    const text = validAndFixedItems.map((item) => item.cleaned).join('\n');
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${validAndFixedItems.length} validated URLs to clipboard!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-100">Smart URL Batcher &amp; Regex Validator</h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-bold">
                  Batch Utility
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Automatically clean missing protocols, remove duplicate entries, and validate URL formatting before pipeline dispatch.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total Raw Tokens</span>
              <div className="text-xl font-extrabold text-zinc-100 font-mono mt-0.5">{processedBatch.length}</div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Validated &amp; Clean</span>
              <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">{validAndFixedItems.length}</div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Duplicates Removed</span>
              <div className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">{duplicateItems.length}</div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Invalid / Malformed</span>
              <div className="text-xl font-extrabold text-rose-400 font-mono mt-0.5">{invalidItems.length}</div>
            </div>
          </div>

          {/* Batch Configuration Toggles */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={forceHttps}
                  onChange={(e) => setForceHttps(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-500 focus:ring-indigo-500/50"
                />
                <span className="font-semibold text-zinc-200">Force https:// Protocol</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stripQueryParams}
                  onChange={(e) => setStripQueryParams(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-500 focus:ring-indigo-500/50"
                />
                <span className="font-semibold text-zinc-200">Strip Query Params &amp; Anchors (?utm, #tag)</span>
              </label>
            </div>

            <button
              onClick={handleCopyValid}
              disabled={validAndFixedItems.length === 0}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700 font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Copy Valid ({validAndFixedItems.length})</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                Inspection Table
              </span>
            </div>

            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 font-mono text-xs">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterTab === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All ({processedBatch.length})
              </button>
              <button
                onClick={() => setFilterTab('valid')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterTab === 'valid' ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Valid ({validAndFixedItems.length})
              </button>
              <button
                onClick={() => setFilterTab('duplicate')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterTab === 'duplicate' ? 'bg-amber-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Duplicates ({duplicateItems.length})
              </button>
              <button
                onClick={() => setFilterTab('invalid')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterTab === 'invalid' ? 'bg-rose-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Invalid ({invalidItems.length})
              </button>
            </div>
          </div>

          {/* Detailed URL Table */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
            {filteredList.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                No URLs found matching tab filter "{filterTab}".
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950/80 text-[10px] text-zinc-500 uppercase tracking-wider">
                      <th className="py-2.5 px-4 font-bold">Status</th>
                      <th className="py-2.5 px-4 font-bold">Original Input</th>
                      <th className="py-2.5 px-4 font-bold">Cleaned Output</th>
                      <th className="py-2.5 px-4 font-bold">Note / Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {filteredList.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-900/80 transition-colors">
                        <td className="py-2.5 px-4">
                          {item.status === 'valid' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3" />
                              Valid
                            </span>
                          )}
                          {item.status === 'fixed_protocol' && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <Zap className="w-3 h-3" />
                              Auto-Fixed
                            </span>
                          )}
                          {item.status === 'duplicate' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" />
                              Duplicate
                            </span>
                          )}
                          {item.status === 'invalid' && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <X className="w-3 h-3" />
                              Invalid
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-4 text-zinc-400 truncate max-w-[180px]">
                          {item.original}
                        </td>

                        <td className="py-2.5 px-4 font-bold text-zinc-100 truncate max-w-[220px]">
                          {item.status === 'invalid' ? (
                            <span className="line-through text-rose-400/70">{item.cleaned}</span>
                          ) : (
                            item.cleaned
                          )}
                        </td>

                        <td className="py-2.5 px-4 text-[11px] text-zinc-400">
                          {item.reason || 'Regex format verified'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ready to batch replace input with <strong className="text-emerald-400">{validAndFixedItems.length}</strong> validated URLs</span>
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={validAndFixedItems.length === 0}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Cleaned Batch ({validAndFixedItems.length})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
