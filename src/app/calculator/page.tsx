'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import McaToolsSuite from '@/components/McaToolsSuite';
import { 
  Calculator, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Landmark, 
  ArrowRight,
  Info
} from 'lucide-react';

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      <Header />

      {/* Hero Header with Gradients */}
      <section className="bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-white border-b border-slate-200 py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Statutory Tools Suite • Updated with 2026 Sovereign Gazettes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            MCA Name Feasibility & State Stamp Duty Suite
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Verify your proposed company name against MCA Rule 8 restriction guidelines and calculate exact 22-state sovereign stamp duties before investing in legal paperwork.
          </p>
        </div>
      </section>

      {/* Main Suite Container */}
      <main className="max-w-7xl mx-auto w-full py-10 px-4 sm:px-6 flex-1 space-y-12">
        {/* Embedded Interactive MCA Tools Suite Component */}
        <McaToolsSuite />

        {/* Deep Explainer: How Indian Stamp Duties Work */}
        <div className="p-8 bg-white rounded-2xl border border-slate-200 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Info className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900">
              Understanding Sovereign Stamp Levies on Company Incorporation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                State Sovereign Powers
              </h4>
              <p>
                Under Entry 63 of the State List (List II) of the Constitution of India, rates of stamp duty on commercial instruments like Articles of Association (AOA) and Memorandum of Association (MOA) are fixed by individual State Legislatures.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                ROC ₹0 Govt Fee Waiver
              </h4>
              <p>
                The Ministry of Corporate Affairs (MCA) waives ROC statutory filing fees for incorporation of Private Limited companies with authorized capital up to ₹15,00,000. However, state stamp duty remains statutory and directly payable to State Treasuries.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                Zero GST on Stamp Duty
              </h4>
              <p>
                Because stamp duty is a sovereign state levy, it is completely exempt from Goods and Services Tax (GST). Our platform never adds GST onto sovereign stamp amounts; GST applies strictly to professional secretarial services.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
