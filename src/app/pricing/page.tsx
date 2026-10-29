'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { 
  Check, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight,
  Calculator,
  Clock,
  Award,
  Zap,
  X
} from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      <Header />

      {/* Hero Header with Subtle Gradients */}
      <section className="bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-white border-b border-slate-200 py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Radically Transparent Pricing • Zero Hidden Markups</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            All-Inclusive Incorporation Packages
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transparent legal-tech packages designed for bootstrapped founders, venture-backed startups, and professional consulting firms across India.
          </p>
        </div>
      </section>

      {/* Main 3 Packages Grid */}
      <main className="max-w-7xl mx-auto w-full py-12 px-4 sm:px-6 flex-1 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Package 1: Starter Pack */}
          <Link
            href="/register?package=starter"
            className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/15 hover:-translate-y-1 transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between shadow-xs relative overflow-hidden group cursor-pointer block"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500 group-hover:h-2 transition-all" />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-0.5 rounded-full">
                  Starter Pack
                </span>
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Fast Incorporation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mt-3 group-hover:text-blue-600 transition-colors">
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

              <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
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
                  <span>Custom MOA and AOA drafting & attestation</span>
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

            <div className="mt-8 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700 text-white rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition active:scale-95">
              <span>Get Started with Starter</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Package 2: Growth Pack (Most Popular) */}
          <Link
            href="/register?package=growth"
            className="bg-white rounded-2xl border-2 border-emerald-500 hover:border-emerald-600 shadow-xl shadow-emerald-500/10 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1.5 transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group cursor-pointer block"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 group-hover:h-2.5 transition-all" />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-0.5 rounded-full shadow-xs">
                  ★ Most Popular Choice
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Save ₹2,000</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mt-3 group-hover:text-emerald-700 transition-colors">
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

              <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
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

            <div className="mt-8 w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 group-hover:from-emerald-700 group-hover:to-teal-700 text-white rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/25 transition active:scale-95">
              <span>Get Started with Growth</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Package 3: Complete Shield */}
          <Link
            href="/register?package=shield"
            className="bg-white rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/15 hover:-translate-y-1 transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between shadow-xs relative overflow-hidden group cursor-pointer block"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:h-2 transition-all" />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase bg-purple-50 border border-purple-200 text-purple-700 px-2.5 py-0.5 rounded-full">
                  Complete Protection
                </span>
                <span className="text-xs font-semibold text-purple-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Full Year Legal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mt-3 group-hover:text-purple-700 transition-colors">
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

              <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
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

            <div className="mt-8 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:from-purple-700 group-hover:to-indigo-700 text-white rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 transition active:scale-95">
              <span>Get Started with Shield</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-black text-slate-900">
              Detailed Feature Comparison
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare statutory inclusions across all three corporate tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">Inclusion Feature</th>
                  <th className="py-3 px-4 text-center">
                    <Link href="/register?package=starter" className="inline-flex items-center gap-1 text-slate-700 hover:text-blue-600 transition underline underline-offset-2 hover:-translate-y-0.5">
                      Starter (₹2,499)
                    </Link>
                  </th>
                  <th className="py-3 px-4 text-center text-emerald-800 bg-emerald-50/50">
                    <Link href="/register?package=growth" className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 transition underline underline-offset-2 hover:-translate-y-0.5">
                      ★ Growth (₹4,999)
                    </Link>
                  </th>
                  <th className="py-3 px-4 text-center text-purple-800">
                    <Link href="/register?package=shield" className="inline-flex items-center gap-1 text-purple-800 hover:text-purple-950 transition underline underline-offset-2 hover:-translate-y-0.5">
                      Shield (₹9,999)
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-5 font-semibold">SPICe+ Part A Name Feasibility & Reservation</td>
                  <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-emerald-600 bg-emerald-50/30"><Check className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold">Class-3 DSC Cryptographic Tokens</td>
                  <td className="py-3 px-4 text-center font-bold">2 Tokens</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-800 bg-emerald-50/30">2 Tokens</td>
                  <td className="py-3 px-4 text-center font-bold">2 Tokens</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold">Certificate of Incorporation, Corporate CIN, PAN & TAN</td>
                  <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-emerald-600 bg-emerald-50/30"><Check className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold">GST Registration Certificate (REG-06)</td>
                  <td className="py-3 px-4 text-center text-slate-300"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-emerald-600 bg-emerald-50/30"><Check className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold">Udyam MSME Government Registration</td>
                  <td className="py-3 px-4 text-center text-slate-300"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-emerald-600 bg-emerald-50/30"><Check className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold">Share Certificates (Form SH-1) & Board Minutes</td>
                  <td className="py-3 px-4 text-center text-slate-300"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-emerald-600 bg-emerald-50/30"><Check className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold">Trademark (TM) Application Filing (1 Class)</td>
                  <td className="py-3 px-4 text-center text-slate-300"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-slate-300 bg-emerald-50/30"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold">1st Financial Year Annual ROC Filing (AOC-4 & MGT-7)</td>
                  <td className="py-3 px-4 text-center text-slate-300"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-slate-300 bg-emerald-50/30"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold">Director DIR-3 KYC Annual Filing (2 Directors)</td>
                  <td className="py-3 px-4 text-center text-slate-300"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-slate-300 bg-emerald-50/30"><X className="w-4 h-4 mx-auto" /></td>
                  <td className="py-3 px-4 text-center text-emerald-600"><Check className="w-4 h-4 mx-auto" /></td>
                </tr>
                <tr className="bg-slate-50/80 border-t-2 border-slate-200">
                  <td className="py-4 px-5 font-black text-slate-900">
                    Select Your Plan
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Link
                      href="/register?package=starter"
                      className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-xs hover:shadow-md transition active:scale-95"
                    >
                      <span>Choose Starter</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-center bg-emerald-50/40">
                    <Link
                      href="/register?package=growth"
                      className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs hover:shadow-md transition active:scale-95"
                    >
                      <span>Choose Growth</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Link
                      href="/register?package=shield"
                      className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-bold shadow-xs hover:shadow-md transition active:scale-95"
                    >
                      <span>Choose Shield</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}