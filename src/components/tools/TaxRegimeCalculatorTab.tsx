'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, CheckCircle2, Sparkles, HelpCircle, ShieldCheck, TrendingUp } from 'lucide-react';

export default function TaxRegimeCalculatorTab() {
  const [grossSalary, setGrossSalary] = useState(1200000); // 12 Lakhs
  const [deduction80C, setDeduction80C] = useState(150000); // Max 1.5L
  const [deduction80D, setDeduction80D] = useState(25000); // Health insurance
  const [homeLoan24B, setHomeLoan24B] = useState(0); // Home loan interest
  const [hraExemption, setHraExemption] = useState(100000); // HRA exemption

  const calculation = useMemo(() => {
    // ==========================================
    // 1. OLD TAX REGIME
    // ==========================================
    const oldStdDeduction = 50000;
    const capped80C = Math.min(deduction80C, 150000);
    const capped80D = Math.min(deduction80D, 100000);
    const capped24B = Math.min(homeLoan24B, 200000);

    const oldTotalDeductions = oldStdDeduction + capped80C + capped80D + capped24B + hraExemption;
    const oldTaxableIncome = Math.max(0, grossSalary - oldTotalDeductions);

    let oldTax = 0;
    if (oldTaxableIncome <= 250000) {
      oldTax = 0;
    } else if (oldTaxableIncome <= 500000) {
      oldTax = (oldTaxableIncome - 250000) * 0.05;
    } else if (oldTaxableIncome <= 1000000) {
      oldTax = 12500 + (oldTaxableIncome - 500000) * 0.20;
    } else {
      oldTax = 12500 + 100000 + (oldTaxableIncome - 1000000) * 0.30;
    }

    // Sec 87A rebate under Old (taxable up to 5L = 0 tax)
    if (oldTaxableIncome <= 500000) {
      oldTax = 0;
    }

    const oldCess = oldTax * 0.04;
    const oldFinalTax = Math.round(oldTax + oldCess);

    // ==========================================
    // 2. NEW TAX REGIME (Sec 115BAC - FY 2025-27)
    // ==========================================
    const newStdDeduction = 75000; // Enhanced Standard Deduction
    const newTaxableIncome = Math.max(0, grossSalary - newStdDeduction);

    let newTax = 0;
    if (newTaxableIncome <= 300000) {
      newTax = 0;
    } else if (newTaxableIncome <= 700000) {
      newTax = (newTaxableIncome - 300000) * 0.05;
    } else if (newTaxableIncome <= 1000000) {
      newTax = 20000 + (newTaxableIncome - 700000) * 0.10;
    } else if (newTaxableIncome <= 1200000) {
      newTax = 20000 + 30000 + (newTaxableIncome - 1000000) * 0.15;
    } else if (newTaxableIncome <= 1500000) {
      newTax = 20000 + 30000 + 30000 + (newTaxableIncome - 1200000) * 0.20;
    } else {
      newTax = 20000 + 30000 + 30000 + 60000 + (newTaxableIncome - 1500000) * 0.30;
    }

    // Sec 87A rebate under New Regime (taxable up to 7L = 0 tax)
    if (newTaxableIncome <= 700000) {
      newTax = 0;
    }

    const newCess = newTax * 0.04;
    const newFinalTax = Math.round(newTax + newCess);

    const diff = Math.abs(oldFinalTax - newFinalTax);
    const recommended = newFinalTax <= oldFinalTax ? 'NEW' : 'OLD';

    return {
      oldTotalDeductions,
      oldTaxableIncome,
      oldFinalTax,
      newTaxableIncome,
      newFinalTax,
      recommended,
      diff
    };
  }, [grossSalary, deduction80C, deduction80D, homeLoan24B, hraExemption]);

  return (
    <div className="p-5 sm:p-7 space-y-5">
      {/* Compact Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <h3 className="text-sm font-extrabold text-white">
            Income Tax Regime Optimizer (Section 115BAC vs Old Slabs)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 border border-purple-800 px-2 py-0.5 rounded">
          FY 2025-27 Assessment
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Gross Salary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="font-bold text-slate-300 text-xs flex justify-between">
              <span>Gross Annual Salary / Total Income:</span>
              <span className="text-purple-400 font-mono font-bold text-sm">
                ₹{grossSalary.toLocaleString('en-IN')}
              </span>
            </label>
            <input
              type="range"
              min={300000}
              max={5000000}
              step={25000}
              value={grossSalary}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹3,00,000</span>
              <span>₹25,00,000</span>
              <span>₹50,00,000</span>
            </div>
          </div>

          {/* Deductions Accordion Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Exemptions & Deductions (Old Regime Only)
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                Standard ₹50k vs ₹75k Auto-Applied
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Section 80C */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex justify-between">
                  <span>Sec 80C (PPF, ELSS, EPF, LIC)</span>
                  <span className="text-slate-500 text-[10px]">Max ₹1.5L</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={150000}
                  step={5000}
                  value={deduction80C}
                  onChange={(e) => setDeduction80C(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Section 80D */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex justify-between">
                  <span>Sec 80D (Health Insurance)</span>
                  <span className="text-slate-500 text-[10px]">Self & Parents</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={100000}
                  step={5000}
                  value={deduction80D}
                  onChange={(e) => setDeduction80D(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* HRA Exemption */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex justify-between">
                  <span>HRA Exemption (Sec 10(13A))</span>
                  <span className="text-slate-500 text-[10px]">Rent Paid</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={1000000}
                  step={10000}
                  value={hraExemption}
                  onChange={(e) => setHraExemption(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Home Loan 24(b) */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex justify-between">
                  <span>Sec 24(b) (Home Loan Interest)</span>
                  <span className="text-slate-500 text-[10px]">Max ₹2L</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={200000}
                  step={10000}
                  value={homeLoan24B}
                  onChange={(e) => setHomeLoan24B(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Form: Side-by-Side Comparison Verdict */}
        <div className="lg:col-span-5 space-y-4">
          {/* Recommendation Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Optimal Tax Choice
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-400/40">
                {calculation.recommended === 'NEW' ? 'CHOOSE NEW REGIME' : 'CHOOSE OLD REGIME'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-black font-mono text-emerald-400">
                Save ₹{calculation.diff.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                By choosing the <strong>{calculation.recommended} Tax Regime</strong>, your annual tax outgo is minimized by ₹{calculation.diff.toLocaleString('en-IN')}.
              </p>
            </div>

            {/* Side-by-Side Comparison Columns */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
              {/* New Regime Card */}
              <div className={`p-3.5 rounded-xl border ${
                calculation.recommended === 'NEW'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              } space-y-1.5`}>
                <span className="text-[10px] uppercase font-bold block">
                  New Regime (115BAC)
                </span>
                <div className="text-lg font-black font-mono text-white">
                  ₹{calculation.newFinalTax.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] space-y-0.5 text-slate-400">
                  <div>Std Ded: ₹75,000</div>
                  <div>Taxable: ₹{calculation.newTaxableIncome.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Old Regime Card */}
              <div className={`p-3.5 rounded-xl border ${
                calculation.recommended === 'OLD'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              } space-y-1.5`}>
                <span className="text-[10px] uppercase font-bold block">
                  Old Tax Regime
                </span>
                <div className="text-lg font-black font-mono text-white">
                  ₹{calculation.oldFinalTax.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] space-y-0.5 text-slate-400">
                  <div>Deductions: ₹{calculation.oldTotalDeductions.toLocaleString('en-IN')}</div>
                  <div>Taxable: ₹{calculation.oldTaxableIncome.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/services/income-tax-filing"
                className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs text-center flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <span>File ITR with Tax Counsel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
