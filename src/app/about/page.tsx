'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { 
  ShieldCheck, 
  Award, 
  Building2, 
  Users, 
  CheckCircle2, 
  Lock, 
  Scale, 
  Landmark, 
  ArrowRight, 
  PhoneCall,
  MapPin,
  FileCheck2,
  Sparkles
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      <Header />

      {/* Hero Header with Subtle Ambient Gradients */}
      <section className="bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-white border-b border-slate-200 py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Pan-India Secretarial Infrastructure • Built for Indian Entrepreneurs</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Demystifying Corporate Governance & <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 bg-clip-text text-transparent">
              Company Incorporation Across India
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We are India&apos;s high-trust legal-tech platform uniting technology with certified Company Secretaries, Chartered Accountants, and Advocates to make business registration 100% transparent, fast, and compliant.
          </p>
        </div>
      </section>

      {/* Core Numbers / Key Impact Metrics */}
      <section className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/70 to-white border border-blue-100 shadow-xs">
            <span className="text-3xl font-black text-blue-950 font-mono block">10,000+</span>
            <span className="text-xs font-bold text-slate-700 mt-1 block">Enterprises Incorporated</span>
            <span className="text-[11px] text-blue-700 font-semibold">Across 28 States & UTs</span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-100 shadow-xs">
            <span className="text-3xl font-black text-emerald-950 font-mono block">99.8%</span>
            <span className="text-xs font-bold text-slate-700 mt-1 block">CRC First-Pass Approval</span>
            <span className="text-[11px] text-emerald-700 font-semibold">Zero Resubmission Rejection</span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 to-white border border-indigo-100 shadow-xs">
            <span className="text-3xl font-black text-indigo-950 font-mono block">₹0</span>
            <span className="text-xs font-bold text-slate-700 mt-1 block">Hidden Markups</span>
            <span className="text-[11px] text-indigo-700 font-semibold">Exact Gazette Stamp Duties</span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/70 to-white border border-amber-100 shadow-xs">
            <span className="text-3xl font-black text-amber-950 font-mono block">24–48h</span>
            <span className="text-xs font-bold text-slate-700 mt-1 block">Name Approval Turnaround</span>
            <span className="text-[11px] text-amber-800 font-semibold">SPICe+ Part A Priority Desk</span>
          </div>
        </div>
      </section>

      {/* Main Pillars of Trust */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Our Foundation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            The 4 Pillars That Set Us Apart
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            Traditional agencies rely on opaque markups and physical paperwork. We rebuilt the statutory filing engine from first principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1 */}
          <div className="p-7 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              1. 100% Sovereign Stamp Duty Transparency
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every state in India levies statutory stamp duty on Articles of Association (AOA) and Memorandum of Association (MOA) under individual State Stamp Acts. Unlike legacy brokers who quote arbitrary bulk amounts, our platform calculates exact state-level statutory levies and provides state treasury payment receipts with zero markups.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-7 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              2. Verified Fellow Company Secretaries (ICSI)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every SPICe+ Part A reservation, INC-9 director attestation, and MOA drafting is handled exclusively by verified Company Secretaries and Advocates holding valid ICSI/BCI Certificates of Practice (COP). Your filings are never outsourced to unverified third parties.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-7 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              3. DPDP Act 2023 & UIDAI Client-Side Masking
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with UIDAI regulations and India&apos;s Digital Personal Data Protection Act 2023, director Aadhaar cards uploaded to our platform are automatically redacted on the client device so the first 8 digits are masked before touching any storage server.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-7 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              4. Complete Post-Incorporation Governance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Getting the Certificate of Incorporation (CIN) is just Step 1. Our lifecycle platform manages your Commencement of Business (Form INC-20A), 30-day Auditor Appointment (Form ADT-1), Board Resolutions, Share Certificates (Form SH-1), and annual ROC filings.
            </p>
          </div>
        </div>
      </section>

      {/* Pan-India Regional Desks */}
      <section className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              Physical & Statutory Presence
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Pan-India Regional Secretarial Desks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              Direct liaison officers in major economic and ROC statutory hubs across the nation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-gradient-to-br from-blue-50/60 to-white rounded-xl border border-blue-200 shadow-xs">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase mb-2">
                <MapPin className="w-4 h-4" />
                <span>Western Region Desk</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Mumbai, Maharashtra</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Nariman Point & BKC Secretarial Desk. Handles ROC Mumbai, Pune & Western India filings.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-indigo-50/60 to-white rounded-xl border border-indigo-200 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase mb-2">
                <MapPin className="w-4 h-4" />
                <span>Northern Region Desk</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">New Delhi / NCR</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Connaught Place & Manesar CRC liaison. Direct coordination with Central Registration Centre.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-emerald-50/60 to-white rounded-xl border border-emerald-200 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase mb-2">
                <MapPin className="w-4 h-4" />
                <span>Southern Region Desk</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Bengaluru, Karnataka</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Indiranagar Tech Corridor. Dedicated VC, angel funding & DPIIT Startup India compliance desk.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-amber-50/60 to-white rounded-xl border border-amber-200 shadow-xs">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase mb-2">
                <MapPin className="w-4 h-4" />
                <span>Eastern Region Desk</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Kolkata, West Bengal</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                BBD Bagh Statutory Hub. Coordinates ROC West Bengal, Bihar, and North-Eastern state registries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-10 bg-gradient-to-r from-[#0B1528] via-slate-900 to-[#0B1528] rounded-2xl text-white text-center space-y-4 border border-slate-800 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
            Start Your Business Today
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Ready to incorporate your company with zero hidden fees?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of Indian entrepreneurs who incorporated their Private Limited or LLP with complete peace of mind.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition active:scale-95"
            >
              Start Online Registration
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-slate-700 hover:border-slate-500 text-white rounded-xl text-xs sm:text-sm font-bold transition"
            >
              Contact Secretarial Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
