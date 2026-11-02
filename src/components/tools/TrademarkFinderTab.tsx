'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Tag, ShieldAlert, CheckCircle2, ArrowRight, Sparkles, Filter, Info, Copy, Check } from 'lucide-react';
import { TRADEMARK_CLASSES, TrademarkClass } from '@/data/trademarkData';

export default function TrademarkFinderTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Goods' | 'Services'>('All');
  const [copiedClass, setCopiedClass] = useState<number | null>(null);

  // Quick industry suggestion chips
  const POPULAR_SEARCHES = [
    'Software & SaaS',
    'Clothing & Fashion',
    'Restaurant & Café',
    'Skincare & Cosmetics',
    'Packaged Food & Spices',
    'Healthcare & Clinics',
    'E-Commerce Marketplace',
    'Education & EdTech'
  ];

  const filteredClasses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TRADEMARK_CLASSES.filter((tm) => {
      // Type filter
      if (filterType !== 'All' && tm.type !== filterType) return false;
      if (!q) return true;

      // Match class number
      if (`class ${tm.classNumber}`.includes(q) || `${tm.classNumber}` === q) return true;

      // Match title, summary, or popular goods
      if (tm.title.toLowerCase().includes(q)) return true;
      if (tm.summary.toLowerCase().includes(q)) return true;
      if (tm.popularGoodsServices.some((item) => item.toLowerCase().includes(q))) return true;
      if (tm.keywords.some((kw) => kw.toLowerCase().includes(q))) return true;

      return false;
    });
  }, [searchQuery, filterType]);

  const handleCopyClass = (classNum: number) => {
    navigator.clipboard.writeText(`Class ${classNum}`);
    setCopiedClass(classNum);
    setTimeout(() => setCopiedClass(null), 2000);
  };

  return (
    <div className="p-5 sm:p-7 space-y-5">
      {/* Compact Search & Filter Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 className="text-sm font-extrabold text-white">
              Nice Classification Search (Classes 1–45)
            </h3>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
              {filteredClasses.length} of 45 Available
            </span>
          </div>

          {/* Filter Type Pills */}
          <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs shrink-0">
            {(['All', 'Goods', 'Services'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg font-bold text-center transition cursor-pointer ${
                  filterType === t
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'Goods' ? 'Goods (1-34)' : t === 'Services' ? 'Services (35-45)' : 'All (1-45)'}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type your industry, product, or service (e.g. software, clothing, restaurant, cosmetics, medicine, jewelry, logistics)..."
            className="w-full pl-10 pr-16 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-medium text-xs focus:outline-none focus:border-blue-500 shadow-inner"
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

        {/* Quick Industry Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
          <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Quick Suggest:
          </span>
          {POPULAR_SEARCHES.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setSearchQuery(chip.split(' ')[0])}
              className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Matched Classes */}
      {filteredClasses.length === 0 ? (
        <div className="p-12 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
          <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
          <h4 className="text-base font-bold text-white">No Matching Trademark Classes Found</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            We couldn't find a class matching &quot;{searchQuery}&quot;. Try searching generic terms like &quot;food&quot;, &quot;tech&quot;, &quot;app&quot;, &quot;textile&quot;, or consult our trademark counsel.
          </p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setFilterType('All'); }}
            className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((item) => (
            <div
              key={item.classNumber}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      {item.classNumber}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        Class {item.classNumber} • {item.type}
                      </span>
                      <h4 className="text-sm font-extrabold text-white group-hover:text-blue-300 transition line-clamp-1">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyClass(item.classNumber)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
                    title="Copy Class Number"
                  >
                    {copiedClass === item.classNumber ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {item.summary}
                </p>

                {/* Popular Goods / Services Tags */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Common Goods / Deliverables:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.popularGoodsServices.map((goods) => (
                      <span
                        key={goods}
                        className="text-[10px] bg-slate-900 text-slate-300 border border-slate-800/80 px-2 py-0.5 rounded-md"
                      >
                        {goods}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500">
                  Govt Fee: ₹4,500 (MSME/Individual)
                </span>
                <Link
                  href={`/services/trademark-registration?class=${item.classNumber}`}
                  className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <span>File Class {item.classNumber}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Advisory Note */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Statutory Notice:</strong> Trademark rights in India are territorial and granted on a per-class basis under the Trade Marks Act, 1999. If your enterprise sells both software (Class 9) and SaaS consulting (Class 42), multi-class application (Form TM-A) is statutory.
        </p>
      </div>
    </div>
  );
}
