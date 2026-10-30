'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { 
  Building2, 
  Search, 
  Check, 
  Clock, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Filter, 
  SlidersHorizontal,
  HelpCircle,
  FileText
} from 'lucide-react';
import { SERVICE_CATEGORIES, INITIAL_SERVICES, ServiceItem } from '@/data/servicesData';

export default function ServicesDirectoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'fee-asc' | 'fee-desc' | 'sla'>('recommended');

  // Category Badge Style Resolver
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'incorporation':
      case 'company-registration':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'tax_registrations':
      case 'accounting_tax':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'ipr_licensing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'annual_compliance':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'business_legal':
      case 'proprietorship':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  // Filter & Sort Logic
  const filteredServices = useMemo(() => {
    let list = INITIAL_SERVICES.filter((srv) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        srv.name.toLowerCase().includes(query) ||
        srv.shortDesc.toLowerCase().includes(query) ||
        srv.categoryName.toLowerCase().includes(query) ||
        srv.inclusions.some((inc) => inc.toLowerCase().includes(query));

      const matchesCat = selectedCategory === 'all' || srv.category === selectedCategory;
      return matchesSearch && matchesCat;
    });

    switch (sortBy) {
      case 'fee-asc':
        list.sort((a, b) => a.baseFee - b.baseFee);
        break;
      case 'fee-desc':
        list.sort((a, b) => b.baseFee - a.baseFee);
        break;
      case 'sla':
        list.sort((a, b) => {
          const slaA = parseInt(a.slaDays) || 5;
          const slaB = parseInt(b.slaDays) || 5;
          return slaA - slaB;
        });
        break;
      case 'recommended':
      default:
        // Keep initial curated order
        break;
    }

    return list;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      <Header />

      {/* Hero Banner with Subtle Gradients */}
      <section className="bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-white border-b border-slate-200 py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Master Statutory Services Directory • 100+ Corporate Solutions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Complete Statutory Service Catalog
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transparent government filings, company registrations, trademark applications, and tax compliance handled by verified Company Secretaries and Advocates.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-2xl mx-auto pt-3">
            <div className="flex items-center bg-white rounded-2xl shadow-lg shadow-blue-900/5 p-2 border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
              <div className="pl-3 pr-2 text-blue-600">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search by service name, e.g. Private Limited, GST, Trademark, FSSAI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-2 text-xs sm:text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-3 text-xs text-slate-400 hover:text-slate-700 font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Workspace */}
      <main className="max-w-7xl mx-auto w-full py-10 px-4 sm:px-6 flex-1">
        {/* Filter & Sort Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          {/* Category Chips Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              All Services ({INITIAL_SERVICES.length})
            </button>
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Sort by:</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-3 rounded-lg border border-slate-300 text-xs font-bold bg-white cursor-pointer outline-none focus:border-blue-500"
            >
              <option value="recommended">Recommended</option>
              <option value="fee-asc">Price: Low to High</option>
              <option value="fee-desc">Price: High to Low</option>
              <option value="sla">Fastest Turnaround (SLA)</option>
            </select>
          </div>
        </div>

        {/* Results Count Banner */}
        <div className="py-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredServices.length}</strong> statutory services
            {selectedCategory !== 'all' && (
              <span> in <strong className="text-blue-600 font-bold">{SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.name}</strong></span>
            )}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Direct State Stamp Remittance
          </span>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                onClick={() => router.push(`/services/${srv.slug}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(`/services/${srv.slug}`);
                  }
                }}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 p-6 flex flex-col justify-between shadow-xs group cursor-pointer hover:-translate-y-1 active:scale-[0.99] select-none text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(srv.category);
                      }}
                      title={`Filter by ${srv.categoryName}`}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition hover:opacity-85 hover:scale-105 cursor-pointer ${getCategoryBadgeClass(srv.category)}`}
                    >
                      {srv.categoryName}
                    </button>
                    {srv.badge && (
                      <span className="text-[10px] font-bold uppercase bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
                        {srv.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {srv.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {srv.shortDesc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    {srv.inclusions.slice(0, 3).map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Standard Fee</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-900">
                        ₹{srv.baseFee.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-slate-500">+ Govt Fee</span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-500" /> SLA: {srv.slaDays}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/services/${srv.slug}`);
                      }}
                      className="px-3.5 py-2 border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95 shadow-2xs"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/register?service=${srv.slug}`);
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
                    >
                      <span>Filing</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No matching services found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find any service matching &quot;{searchQuery}&quot;. Please try a different keyword or reset filters.
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition"
            >
              Reset Search & Filters
            </button>
          </div>
        )}

        {/* Free Secretarial Advisory Consultation Banner */}
        <div className="mt-14 p-8 bg-gradient-to-r from-slate-900 via-[#0B1528] to-slate-900 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-xl">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              Free Secretarial Consultation
            </span>
            <h3 className="text-xl font-black text-white">
              Unsure which business structure is right for you?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Connect with a Fellow Company Secretary for a 15-minute eligibility check, state stamp duty consultation, and capital structure advisory.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              <span>Book Free CS Call</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="px-5 py-3 border border-slate-700 hover:border-slate-500 text-white rounded-xl text-xs font-bold flex items-center justify-center transition"
            >
              Start Online Filing
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
