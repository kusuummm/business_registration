'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import McaToolsSuite from '@/components/McaToolsSuite';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Clock, 
  FileText, 
  Lock, 
  Award, 
  Zap, 
  ChevronRight, 
  HelpCircle, 
  X, 
  Sparkles, 
  Users, 
  Receipt, 
  KeyRound, 
  ShieldAlert, 
  Calculator, 
  CalendarCheck, 
  FileCheck2, 
  HeartHandshake, 
  Check,
  MapPin,
  MessageCircle,
  TrendingUp,
  FileBadge
} from 'lucide-react';
import { SERVICE_CATEGORIES, INITIAL_SERVICES, ServiceItem } from '@/data/servicesData';
import { STATE_STAMP_DUTY } from '@/data/pricingData';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatePreview, setSelectedStatePreview] = useState('MH');
  const [servicesList, setServicesList] = useState<ServiceItem[]>(INITIAL_SERVICES);

  // Fetch live dynamic services from backend API on mount
  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setServicesList(json.data);
        }
      })
      .catch((err) => console.log('Loaded initial fallback catalog:', err));
  }, []);

  // Hero Consultation Form
  const [heroForm, setHeroForm] = useState({ name: '', mobile: '', service: 'Private Limited Company', city: 'Mumbai' });
  const [heroFormSubmitted, setHeroFormSubmitted] = useState(false);

  // Category Icon Resolver
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-5 h-5 text-slate-800" />;
      case 'Users': return <Users className="w-5 h-5 text-slate-800" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-slate-800" />;
      case 'Receipt': return <Receipt className="w-5 h-5 text-slate-800" />;
      case 'KeyRound': return <KeyRound className="w-5 h-5 text-slate-800" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-slate-800" />;
      case 'Calculator': return <Calculator className="w-5 h-5 text-slate-800" />;
      case 'CalendarCheck': return <CalendarCheck className="w-5 h-5 text-slate-800" />;
      case 'FileCheck2': return <FileCheck2 className="w-5 h-5 text-slate-800" />;
      default: return <Building2 className="w-5 h-5 text-slate-800" />;
    }
  };

  // Categories that actually exist in the current service list
  const availableCategories = useMemo(() => {
    const presentCategoryIds = new Set(servicesList.map((s) => s.category));
    return SERVICE_CATEGORIES.filter((cat) => presentCategoryIds.has(cat.id));
  }, [servicesList]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return servicesList.filter((srv) => {
      const matchesSearch = srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || srv.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [servicesList, searchQuery, selectedCategory]);

  const handleHeroFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.name || heroForm.mobile.length < 10) return;
    setHeroFormSubmitted(true);

    try {
      await fetch('/api/callbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroForm)
      });
    } catch (err) {
      console.error('Error recording callback lead:', err);
    }

    setTimeout(() => {
      setHeroFormSubmitted(false);
      setHeroForm({ name: '', mobile: '', service: 'Private Limited Company', city: 'Mumbai' });
    }, 4000);
  };

  const currentPreviewState = STATE_STAMP_DUTY[selectedStatePreview] || STATE_STAMP_DUTY['MH'];

  // Helper for Category Color Badges
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'incorporation':
      case 'company-registration':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'tax_registrations':
      case 'tax-compliance':
      case 'accounting':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'ipr_licensing':
      case 'intellectual-property':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'annual_compliance':
      case 'annual-compliance':
      case 'corporate-governance':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'digital_signatures':
      case 'business-licences':
      case 'firm-registration':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      <Header />

      {/* Hero Section: Modern Legal-Tech with Subtle Colorful Ambient Gradients */}
      <section className="bg-gradient-to-b from-blue-50/70 via-indigo-50/20 to-white border-b border-slate-200 py-12 px-4 sm:px-6 relative overflow-hidden">
        {/* Soft Ambient Colorful Background Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Value Proposition & Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-900 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>MCA V3 Certified Desk • Radically Transparent Stamp Duty Engine</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                India&apos;s High-Trust Platform for <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 bg-clip-text text-transparent">
                  Company Incorporation & Compliance
                </span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                Register your Private Limited, LLP, GST & Trademark with verified Company Secretaries. 
                Zero hidden markups, exact 22-state sovereign stamp duties, UIDAI client-side privacy masking, and automated 60-day utility bill QC.
              </p>

              {/* Fast Search Input */}
              <div className="relative max-w-xl">
                <div className="flex items-center bg-white rounded-xl shadow-md shadow-blue-900/5 p-1.5 border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
                  <div className="pl-3 pr-2 text-blue-600">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search 100+ services: Private Limited, GST, Trademark, FSSAI..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 px-2 text-xs sm:text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <Link
                    href="/register"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition shrink-0 shadow-md shadow-blue-500/20 active:scale-95"
                  >
                    Start Filing
                  </Link>
                </div>
              </div>

              {/* Trust Pill Badges */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> MCA SPICe+ Integrated
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> UIDAI Client-Side Masking
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 shadow-xs">
                  <Award className="w-3.5 h-3.5 text-purple-600" /> Dedicated Fellow CS Allotment
                </span>
              </div>
            </div>

            {/* Right Column: Instant "Get Free CA/CS Consultation" Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-blue-100 p-6 sm:p-7 shadow-xl shadow-blue-900/5 relative overflow-hidden">
                {/* Top Colorful Accent Stripe */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400" />

                <div className="border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100/70 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      Fast Assistance
                    </span>
                    <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" /> 15-Min Callback
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-2">
                    Consult with a Company Secretary
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Free name search, eligibility check, and state stamp duty consultation.
                  </p>
                </div>

                {heroFormSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-900 font-semibold space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="font-bold text-sm">Consultation Scheduled!</p>
                    <p className="text-slate-600">
                      Our secretarial officer will connect with you at <strong className="font-mono text-slate-900">+91 {heroForm.mobile}</strong> within 15 minutes.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleHeroFormSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Full Legal Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={heroForm.name}
                        onChange={(e) => setHeroForm({ ...heroForm, name: e.target.value })}
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold uppercase text-slate-700 mb-1">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-2 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-600 font-bold text-xs">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            placeholder="98765 43210"
                            value={heroForm.mobile}
                            onChange={(e) => setHeroForm({ ...heroForm, mobile: e.target.value.replace(/\D/g, '') })}
                            className="w-full py-2 px-2 rounded-r-lg border border-slate-300 font-mono font-bold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 text-xs transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold uppercase text-slate-700 mb-1">City / State</label>
                        <input
                          type="text"
                          placeholder="e.g. Mumbai, MH"
                          value={heroForm.city}
                          onChange={(e) => setHeroForm({ ...heroForm, city: e.target.value })}
                          className="w-full py-2 px-3 rounded-lg border border-slate-300 font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">Corporate Service</label>
                      <select
                        value={heroForm.service}
                        onChange={(e) => setHeroForm({ ...heroForm, service: e.target.value })}
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 font-semibold text-slate-900 bg-white outline-none cursor-pointer focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition"
                      >
                        <option value="Private Limited Company">Private Limited Company Registration</option>
                        <option value="Limited Liability Partnership">Limited Liability Partnership (LLP)</option>
                        <option value="One Person Company">One Person Company (OPC)</option>
                        <option value="GST Registration">GST Registration & Filing</option>
                        <option value="Trademark (TM)">Trademark (TM) Application</option>
                        <option value="FSSAI Food License">FSSAI Food Business License</option>
                        <option value="Import Export Code">Import Export Code (IEC)</option>
                        <option value="Annual ROC Compliance">Annual ROC Filing Compliance</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white rounded-lg font-bold text-xs shadow-md shadow-indigo-500/25 transition cursor-pointer active:scale-95"
                    >
                      Get Free Advice from CS / CA Desk
                    </button>

                    <p className="text-[10px] text-center text-slate-500">
                      🔒 No spam. Data protected under DPDP Act 2023.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Live Highlights Metric Strip - Interactive Fast Navigation */}
      <section className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/register" 
            title="Start Online Company Registration"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-br from-blue-50/70 to-white border border-blue-100 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 block group-hover:text-blue-600 transition-colors">100% Online Filing</span>
              <span className="text-[11px] text-blue-700 font-semibold">Zero Physical Visits →</span>
            </div>
          </Link>

          <a 
            href="#tools" 
            title="Calculate 22-State Sovereign Stamp Duty"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-100 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 block group-hover:text-emerald-700 transition-colors">22+ State Stamp Duties</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Real-Time Calculator ↓</span>
            </div>
          </a>

          <a 
            href="#tools" 
            title="Check MCA Name Availability"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/70 to-white border border-indigo-100 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 block group-hover:text-indigo-600 transition-colors">24-48h Name Approval</span>
              <span className="text-[11px] text-indigo-700 font-semibold">Check MCA V3 Availability ↓</span>
            </div>
          </a>

          <a 
            href="#pricing" 
            title="View Transparent Startup Pricing Packages"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-br from-amber-50/70 to-white border border-amber-100 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 block group-hover:text-amber-700 transition-colors">₹0 Hidden Markups</span>
              <span className="text-[11px] text-amber-800 font-semibold">View Packages ↓</span>
            </div>
          </a>
        </div>
      </section>

      {/* Interactive MCA Name Availability & State Stamp Duty Intelligence Suite */}
      <section id="tools" className="px-4 sm:px-6 max-w-7xl mx-auto w-full scroll-mt-24">
        <McaToolsSuite />
      </section>

      {/* 3 Curated Startup Bundles (LegalRaasta + MyOnlineCA inspired) */}
      <section id="pricing" className="py-14 px-4 sm:px-6 max-w-7xl mx-auto w-full scroll-mt-24">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Startup Packages
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            All-Inclusive Incorporation Packages
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            Choose the package best suited for your fundraising, GST, and IP requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Package 1: Starter Pack (Blue Tone) */}
          <Link
            href="/register?package=starter"
            className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between cursor-pointer block relative overflow-hidden group"
          >
            {/* Top Accent Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500" />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-0.5 rounded-full">
                  Starter Pack
                </span>
                <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Fast Start</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mt-2.5">
                Pvt Ltd Incorporation
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Core company incorporation covering SPICe+ Part A & B with 2 DSC tokens.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-blue-950">₹2,499</span>
                  <span className="text-xs text-slate-500 font-medium">+ State Stamp Duty</span>
                </div>
                <span className="text-[10px] text-blue-700 font-semibold">Includes MCA ROC ₹0 Govt Fee waiver</span>
              </div>

              <ul className="mt-5 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>SPICe+ Part A Name Reservation (2 choices)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>2 Class-3 Digital Signature Tokens (DSC)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Custom MOA and AOA drafting</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Certificate of Incorporation (CIN), PAN & TAN</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Zero-balance Current Bank Account</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition">
              <span>Select Starter Pack</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Package 2: Growth Pack (Most Popular - Emerald/Teal Tone) */}
          <Link
            href="/register?package=growth"
            className="bg-white rounded-2xl border-2 border-emerald-500 hover:border-emerald-600 shadow-xl shadow-emerald-500/10 hover:shadow-2xl hover:shadow-emerald-500/15 transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between cursor-pointer block relative overflow-hidden group"
          >
            {/* Top Accent Stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-0.5 rounded-full shadow-xs">
                  ★ Most Popular Pack
                </span>
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span>Save ₹2,000</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mt-2.5">
                Fast-Track Startup Kit
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Incorporation + Tax Registrations so you can invoice and open bank accounts immediately.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-emerald-950">₹4,999</span>
                  <span className="text-xs text-slate-500 font-medium">+ State Stamp Duty</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold">Includes GST & Udyam Registration</span>
              </div>

              <ul className="mt-5 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2 font-semibold text-emerald-900">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Everything included in Starter Pack</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>New GST Registration (REG-06)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Udyam MSME Certificate (Lifetime valid)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Share Certificates & 1-Year Secretarial Registers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>DPIIT Startup India Recognition Assistance</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/25 transition">
              <span>Select Growth Pack</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Package 3: Complete Shield Pack (Purple Tone) */}
          <Link
            href="/register?package=shield"
            className="bg-white rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between cursor-pointer block relative overflow-hidden group"
          >
            {/* Top Accent Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500" />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase bg-purple-50 border border-purple-200 text-purple-700 px-2.5 py-0.5 rounded-full">
                  Complete Protection
                </span>
                <span className="text-[11px] font-semibold text-purple-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Full Year Legal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mt-2.5">
                Compliance & IP Shield
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Full incorporation + Brand protection + 1st financial year annual ROC filings.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-purple-950">₹9,999</span>
                  <span className="text-xs text-slate-500 font-medium">+ Statutory Levies</span>
                </div>
                <span className="text-[10px] text-purple-700 font-semibold">Zero penalty guarantee</span>
              </div>

              <ul className="mt-5 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2 font-semibold text-purple-900">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Everything in Fast-Track Growth Pack</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>1 Trademark (TM) Application Filing (™ mark)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>1st Year Annual ROC Filing (AOC-4 & MGT-7)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Director DIR-3 KYC compliance for 2 Directors</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Dedicated Senior Fellow CS Officer</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 transition">
              <span>Select Compliance Shield</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4-Step Process Flow with Fresh Colorful Steps */}
      <section id="process" className="bg-gradient-to-b from-white via-slate-50 to-white border-y border-slate-200 py-16 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              Operational Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              How Incorporation Works in 4 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              100% online, government-compliant process with real-time milestone tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1: Blue */}
            <div className="p-5 bg-gradient-to-br from-blue-50/70 via-white to-white rounded-2xl border border-blue-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 text-left relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-blue-600 font-mono">01</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 border border-blue-200 px-2 py-0.5 rounded-full">
                  Takes 3 mins
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mt-3">Submit Online Questionnaire</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Provide proposed company names, capital, and director KYC details. Masked Aadhaar ensures full privacy.
              </p>
            </div>

            {/* Step 2: Indigo */}
            <div className="p-5 bg-gradient-to-br from-indigo-50/70 via-white to-white rounded-2xl border border-indigo-200 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 text-left relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-indigo-600 font-mono">02</span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 border border-indigo-200 px-2 py-0.5 rounded-full">
                  Day 1 (Within 24h)
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mt-3">DSC & MCA Name Approval</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Class-3 cryptographic token generated via 2-minute Video KYC. CS submits SPICe+ Part A to CRC.
              </p>
            </div>

            {/* Step 3: Amber */}
            <div className="p-5 bg-gradient-to-br from-amber-50/70 via-white to-white rounded-2xl border border-amber-200 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 text-left relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-amber-500 font-mono">03</span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-full">
                  Day 2-3
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mt-3">SPICe+ Part B & Stamp Duty</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                MOA/AOA drafted and attested. Exact state sovereign stamp duty remitted to State Treasury.
              </p>
            </div>

            {/* Step 4: Emerald */}
            <div className="p-5 bg-gradient-to-br from-emerald-50/70 via-white to-white rounded-2xl border border-emerald-200 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 text-left relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-600 font-mono">04</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                  Day 4-5 Working Days
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mt-3">COI, PAN & TAN Delivered</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Registrar of Companies issues Certificate of Incorporation with Corporate CIN. Ready to do business!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic 22-State Stamp Duty Explorer (RegistrationWala pattern) with Fresh Color Accents */}
      <section id="stamp-duty" className="py-14 px-4 sm:px-6 max-w-7xl mx-auto w-full scroll-mt-24">
        <div className="bg-white rounded-2xl border border-blue-100 shadow-md shadow-blue-500/5 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-6 sm:p-8 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white border-b border-blue-100 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100/70 border border-blue-200 px-2.5 py-0.5 rounded-full">
                Radical Sovereign Transparency
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                Pan-India State Stamp Duty Calculator
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Select your state to preview exact statutory stamp levies under the Indian Stamp Act.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Select State:</label>
              <select
                value={selectedStatePreview}
                onChange={(e) => setSelectedStatePreview(e.target.value)}
                className="py-2 px-3.5 rounded-xl border border-blue-200 text-xs font-bold bg-white cursor-pointer shadow-xs focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                {Object.values(STATE_STAMP_DUTY).map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-gradient-to-br from-blue-50/80 to-white rounded-xl border border-blue-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Sovereign Stamp Duty</span>
              <span className="text-2xl font-black text-blue-950 mt-1 block">
                ₹{currentPreviewState.stampDuty.toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Directly payable to State Treasury (GST Exempt)</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-emerald-50/80 to-white rounded-xl border border-emerald-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Statutory Act & Schedule</span>
              <span className="text-sm font-bold text-emerald-950 mt-1 block">
                {currentPreviewState.notes || `${currentPreviewState.name} Stamp Rules`}
              </span>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">Verified against 2026 State Gazettes</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50/80 to-white rounded-xl border border-purple-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700 block">Our Promise</span>
                <p className="text-xs text-slate-700 font-medium mt-1">
                  We never inflate government stamp duties or demand surprise fees post-payment.
                </p>
              </div>
              <Link
                href="/register"
                className="mt-3 inline-flex items-center gap-1 font-bold text-purple-700 hover:text-purple-900 hover:underline text-xs"
              >
                <span>Incorporate in {currentPreviewState.name}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Catalog Grid with Fresh Colorful Tags & Gradients */}
      <section id="services" className="py-10 px-4 sm:px-6 max-w-7xl mx-auto w-full scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Full Statutory Service Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Explore individual services across all corporate categories.
            </p>
          </div>

          <div className="mt-3 md:mt-0 flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              All Services
            </button>
            {availableCategories.map((cat) => (
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
                {cat.name.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
      </section>

      {/* Universal Footer with Clean Colored Highlights and Complete Platform Navigation */}
      <footer className="bg-[#0B1528] text-slate-300 border-t border-slate-800 py-12 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-slate-800 text-xs">
            {/* Col 1: Brand & Mission */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center space-x-2">
                <div className="px-2.5 py-1 rounded-md border border-slate-700 text-xs font-semibold text-slate-300 tracking-wide bg-slate-900/80">
                  Logo
                </div>
                <span className="text-sm font-bold text-white">
                  Corporate Registration & Compliance
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
                Pan-India sovereign legal-tech platform for company registration, statutory tax filings, and corporate governance. Built with certified Fellow Company Secretaries and Advocates.
              </p>
              <div className="pt-1 flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> MCA V3 CRC Desk
                </span>
                <span>•</span>
                <span>DPDP Act 2023 Certified</span>
              </div>
            </div>

            {/* Col 2: Services Directory */}
            <div>
              <h5 className="font-bold text-blue-400 uppercase tracking-wider mb-3 text-xs">
                Services Directory
              </h5>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/services" className="hover:text-white transition">All 100+ Services</Link>
                </li>
                <li>
                  <Link href="/services/private-limited-company" className="hover:text-white transition">Pvt Ltd Incorporation</Link>
                </li>
                <li>
                  <Link href="/services/limited-liability-partnership" className="hover:text-white transition">LLP Registration</Link>
                </li>
                <li>
                  <Link href="/services/gst-registration" className="hover:text-white transition">GST Registration</Link>
                </li>
                <li>
                  <Link href="/services/trademark-registration" className="hover:text-white transition">Trademark (TM) Filing</Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Statutory Tools */}
            <div>
              <h5 className="font-bold text-emerald-400 uppercase tracking-wider mb-3 text-xs">
                Tools & Schedules
              </h5>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/calculator" className="hover:text-white transition">Name Checker & Stamp Duty</Link>
                </li>
                <li>
                  <Link href="/compliance-calendar" className="hover:text-white transition">2026 Due Date Calendar</Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition">Incorporation Packages</Link>
                </li>
                <li>
                  <Link href="/customer" className="hover:text-white transition">Customer Portal</Link>
                </li>
                <li>
                  <Link href="/partner" className="hover:text-white transition">Partner CA/CS Portal</Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Corporate & Legal */}
            <div>
              <h5 className="font-bold text-amber-400 uppercase tracking-wider mb-3 text-xs">
                Corporate & Support
              </h5>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-white transition">About Our Platform</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition">Contact Secretarial Desk</Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition">Privacy Policy (DPDP)</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition">Terms & Refund Policy</Link>
                </li>
                <li className="pt-1 text-slate-300">
                  WhatsApp: <span className="text-emerald-400 font-semibold">+91 98200 12849</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
            <p>
              &copy; 2026 Corporate LegalTech & Compliance Services. All rights reserved.
            </p>
            <p className="text-center sm:text-right">
              Statutory fees are directly remitted to the Ministry of Corporate Affairs and respective State Treasuries with ₹0 markups.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
