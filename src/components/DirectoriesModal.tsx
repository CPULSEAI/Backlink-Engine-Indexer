import React, { useState } from 'react';
import { X, Globe, ExternalLink, ShieldCheck, Search, Filter } from 'lucide-react';
import { DirectoryEntry } from '../types';

interface DirectoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  directories: DirectoryEntry[];
}

export const DirectoriesModal: React.FC<DirectoriesModalProps> = ({
  isOpen,
  onClose,
  directories,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  if (!isOpen) return null;

  const filteredDirs = directories.filter((dir) => {
    const matchesSearch =
      dir.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dir.urlPattern.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || dir.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950/50">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>Built-in Directory Network ({directories.length} High-DA Platforms)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Verified list of WHOIS lookups, SEO analyzers, site valuation platforms &amp; indexers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-zinc-950/40 border-b border-zinc-800">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search directory name or URL pattern..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800/90 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto bg-zinc-950/80 border border-zinc-800/90 rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Categories</option>
            <option value="WHOIS">WHOIS Directory</option>
            <option value="SEO Analyzer">SEO Analyzer</option>
            <option value="Site Stats">Site Stats / Analytics</option>
            <option value="Ping Platform">Ping Platform</option>
            <option value="Archiver">Archiver</option>
          </select>
        </div>

        {/* Directory Cards Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredDirs.map((dir) => (
            <div
              key={dir.id}
              className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3.5 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-zinc-100">{dir.name}</h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    DA: {dir.authorityScore}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 truncate mb-2" title={dir.urlPattern}>
                  Pattern: {dir.urlPattern}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-zinc-900">
                <span className="text-zinc-400 font-semibold">{dir.type}</span>
                <span className="text-emerald-400 font-mono">Accepts Dynamic URL</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
