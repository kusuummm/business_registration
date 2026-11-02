'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Receipt, Tag, Info, Copy, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { HSN_SAC_DIRECTORY, HsnItem } from '@/data/hsnData';

export default function HsnDirectoryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'HSN' | 'SAC'>('All');
  const [rateFilter, setRateFilter] = useState<number | 'All'>('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return HSN_SAC_DIRECTORY.filter((item) => {
      if (typeFilter !== 'All' && item.type !== typeFilter) return false;
      if (rateFilter !== 'All' && item.gstRate !== rateFilter) return false;
      if (!q) return true;

      if (item.code.toLowerCase().includes(q)) return true;
      if (item.category.toLowerCase().includes(q)) return true;
      if (item.description.toLowerCase().includes(q)) return true;
      if (item.conditionNotes?.toLowerCase().includes(q)) return true;

      return false;
    });
  }, [searchQuery, typeFilter, rateFilter]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const GST_SLABS: (number | 'All')[] = ['All', 0, 5, 12, 18, 28];

  return (
    <div className="p-5 sm:p-7 space-y-5">
      {/* Compact Search & Slab Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-extrabold text-white">
              HSN (Goods) & SAC (Services) Directory
            </h3>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
              {filteredItems.length} Codes Available
            </span>
          </div>

          {/* Type Filter */}
          <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs shrink-0">
            {(['All', 'HSN', 'SAC'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg font-bold text-center transition cursor-pointer ${
                  typeFilter === t
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'HSN' ? 'Goods (HSN)' : t === 'SAC' ? 'Services (SAC)' : 'All Types'}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input & Slabs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code (e.g. 998313, 847130) or item (software, legal, cement, tea, laptop)..."
              className="w-full pl-10 pr-16 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-medium text-xs focus:outline-none focus:border-emerald-500 shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-xs font-bold text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800"
              >
                Clear
              </button>
            )}
          </div>

          {/* Slab Quick Filter */}
          <div className="md:col-span-5 flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs overflow-x-auto">
            {GST_SLABS.map((slab) => (
              <button
                key={slab}
                type="button"
                onClick={() => setRateFilter(slab)}
                className={`flex-1 min-w-[34px] py-1 rounded-lg font-bold text-center transition cursor-pointer ${
                  rateFilter === slab
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {slab === 'All' ? 'All %' : `${slab}%`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Table / Cards */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
          <Receipt className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-base font-bold text-white">No HSN / SAC Codes Matched</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No codes found matching &quot;{searchQuery}&quot;. Try searching generic category terms like &quot;it&quot;, &quot;food&quot;, &quot;transport&quot;, &quot;consulting&quot;, or reset your filters.
          </p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setTypeFilter('All'); setRateFilter('All'); }}
            className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.code}
              className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-sm text-emerald-400 tracking-wider">
                      {item.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.code)}
                      className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Copy Code"
                    >
                      {copiedCode === item.code ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    item.type === 'SAC'
                      ? 'bg-purple-950/60 text-purple-300 border-purple-800'
                      : 'bg-blue-950/60 text-blue-300 border-blue-800'
                  }`}>
                    {item.type === 'SAC' ? 'SAC Service' : 'HSN Goods'}
                  </span>

                  <span className="text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                    {item.category}
                  </span>

                  {item.compensationCess && (
                    <span className="text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
                      {item.compensationCess}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {item.description}
                </p>

                {item.conditionNotes && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Info className="w-3 h-3 text-teal-400 shrink-0" />
                    <span>{item.conditionNotes}</span>
                  </p>
                )}
              </div>

              {/* Rate & Actions Pill */}
              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-900">
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-mono text-white">
                      {item.gstRate}%
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">GST</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {item.gstRate === 0
                      ? 'Exempt / Zero Rated'
                      : `CGST ${(item.gstRate / 2)}% + SGST ${(item.gstRate / 2)}%`}
                  </span>
                </div>

                <Link
                  href="/services/gst-registration"
                  className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <span>Apply GST</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statutory Guidance */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">CBIC Invoicing Rule:</strong> Under Notification No. 78/2020-Central Tax, businesses with an aggregate annual turnover exceeding ₹5 Crores must mandatorily disclose 6-digit HSN/SAC codes on all B2B invoices. Businesses below ₹5 Crores turnover must disclose minimum 4-digit codes on B2B supplies.
        </p>
      </div>
    </div>
  );
}
