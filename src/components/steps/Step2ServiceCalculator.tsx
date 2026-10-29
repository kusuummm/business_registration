'use client';

import React, { useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Coins, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Info, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { 
  ENTITY_TYPES, 
  STATE_STAMP_DUTY, 
  CAPITAL_OPTIONS, 
  DSC_TOKEN_UNIT_PRICE, 
  GST_RATE 
} from '@/data/pricingData';
import { CompanyDetails, PricingBreakdown } from '@/types';

interface Step2Props {
  company: CompanyDetails;
  onChange: (updated: Partial<CompanyDetails>, pricing: PricingBreakdown) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2ServiceCalculator({
  company,
  onChange,
  onNext,
  onBack
}: Step2Props) {
  const currentEntity = useMemo(
    () => ENTITY_TYPES.find((e) => e.id === company.entityType) || ENTITY_TYPES[0],
    [company.entityType]
  );

  const currentState = useMemo(
    () => STATE_STAMP_DUTY[company.stateCode] || STATE_STAMP_DUTY['MH'],
    [company.stateCode]
  );

  const currentCapital = useMemo(
    () => CAPITAL_OPTIONS.find((c) => c.value === company.authorizedCapital) || CAPITAL_OPTIONS[0],
    [company.authorizedCapital]
  );

  // Financial calculations
  const pricing = useMemo<PricingBreakdown>(() => {
    const baseFee = currentEntity.baseFee;
    const stampDuty = currentState.stampDuty;
    const rocFee = currentCapital.rocFee;
    const dscFee = company.directorCount * DSC_TOKEN_UNIT_PRICE;
    
    // GST applies only to commercial taxable professional services (Base Platform fee + DSC Tokens)
    // Sovereign government levies (State Stamp Duty & ROC fees) are statutory government taxes, strictly exempt from GST.
    const taxableSubtotal = baseFee + dscFee;
    const gstAmount = Math.round(taxableSubtotal * GST_RATE);
    const totalAmount = taxableSubtotal + gstAmount + stampDuty + rocFee;

    return {
      baseFee,
      stampDuty,
      rocFee,
      dscFee,
      taxableSubtotal,
      gstAmount,
      totalAmount
    };
  }, [currentEntity, currentState, currentCapital, company.directorCount]);

  const handleEntitySelect = (entityId: string) => {
    const selected = ENTITY_TYPES.find((e) => e.id === entityId) || ENTITY_TYPES[0];
    const newDirCount = Math.max(company.directorCount, selected.minDirectors);
    onChange({ entityType: entityId, directorCount: newDirCount }, pricing);
  };

  const handleStateChange = (stateCode: string) => {
    onChange({ stateCode }, pricing);
  };

  const handleCapitalSelect = (val: number) => {
    onChange({ authorizedCapital: val }, pricing);
  };

  const handleDirectorCountChange = (delta: number) => {
    const min = currentEntity.minDirectors;
    const max = 7;
    const nextVal = Math.min(Math.max(company.directorCount + delta, min), max);
    onChange({ directorCount: nextVal }, pricing);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Step Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dynamic Real-Time Pricing Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Select Entity Structure & State of Incorporation
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          State stamp duty laws differ drastically across India (e.g. MH flat ₹1,000 vs PB ₹10,000). Our transparent engine calculates exact statutory costs with zero hidden charges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Selections */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Entity Type */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>1. Corporate Legal Entity Structure</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ENTITY_TYPES.map((entity) => {
                const isSelected = entity.id === company.entityType;
                return (
                  <div
                    key={entity.id}
                    onClick={() => handleEntitySelect(entity.id)}
                    className={`relative p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0B1528] bg-slate-50 ring-2 ring-slate-900/10 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                          {entity.badge}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#0B1528] text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{entity.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-3">
                        {entity.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">Standard Base:</span>
                      <span className="text-sm font-bold text-slate-900">₹{entity.baseFee.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. State Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>2. State of Registered Office (Determines Stamp Duty)</span>
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Stamp duties are levied by respective State Governments under the Indian Stamp Act.
            </p>

            <select
              value={company.stateCode}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold bg-white cursor-pointer"
            >
              {Object.values(STATE_STAMP_DUTY).map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name} — Stamp Duty: ₹{state.stampDuty.toLocaleString('en-IN')}
                </option>
              ))}
            </select>

            {currentState.notes && (
              <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Statutory Note for {currentState.name}:</span>{' '}
                  {currentState.notes}
                </div>
              </div>
            )}
          </div>

          {/* 3. Authorized Capital & ROC Fee */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-2">
              <Coins className="w-4 h-4 text-blue-600" />
              <span>3. Authorized Share Capital (MCA Fee Slabs)</span>
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Government ROC filing fee is ₹0 for authorized capital up to ₹15,00,000 under MCA SPICe+ scheme.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CAPITAL_OPTIONS.map((cap) => {
                const isSelected = company.authorizedCapital === cap.value;
                return (
                  <button
                    key={cap.value}
                    type="button"
                    onClick={() => handleCapitalSelect(cap.value)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#0B1528] bg-slate-50 ring-2 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{cap.label.split('(')[0]}</div>
                      <div className="text-[11px] text-slate-500">
                        {cap.rocFee === 0 ? 'Govt ROC Fee: ₹0 (Waiver)' : `Govt ROC Fee: ₹${cap.rocFee}`}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-slate-900" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Number of Directors */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>4. Number of Directors / Partners</span>
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Includes 1 Class-3 DSC Cryptographic USB Token per Director (₹{DSC_TOKEN_UNIT_PRICE}/each).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={company.directorCount <= currentEntity.minDirectors}
                  onClick={() => handleDirectorCountChange(-1)}
                  className="w-9 h-9 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold text-lg flex items-center justify-center transition"
                >
                  -
                </button>
                <span className="text-lg font-bold text-slate-900 w-6 text-center">
                  {company.directorCount}
                </span>
                <button
                  type="button"
                  disabled={company.directorCount >= 7}
                  onClick={() => handleDirectorCountChange(1)}
                  className="w-9 h-9 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold text-lg flex items-center justify-center transition"
                >
                  +
                </button>
              </div>
            </div>

            {company.directorCount < currentEntity.minDirectors && (
              <p className="text-xs text-red-600 font-medium mt-2">
                Minimum {currentEntity.minDirectors} directors required for {currentEntity.name}.
              </p>
            )}
          </div>
        </div>

        {/* Right Sticky Column: Live Itemized Price Breakdown */}
        <div className="lg:col-span-5 sticky top-36">
          <div className="bg-[#0B1528] text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  Statutory Bill of Costs
                </span>
                <h3 className="text-lg font-extrabold text-white">Itemized Quotation</h3>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>Base Platform & CS Drafting Fee:</span>
                <span className="font-semibold text-white">₹{pricing.baseFee.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span>Class-3 DSC Tokens ({company.directorCount} × ₹{DSC_TOKEN_UNIT_PRICE}):</span>
                </span>
                <span className="font-semibold text-white">₹{pricing.dscFee.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Taxable Professional Subtotal:</span>
                <span className="font-semibold text-white">₹{pricing.taxableSubtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>GST (18% on Taxable Services):</span>
                <span className="font-semibold text-slate-200">₹{pricing.gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-slate-300">
                <div>
                  <span>State Sovereign Stamp Duty ({currentState.name}):</span>
                  <p className="text-[10px] text-emerald-400">Statutory Govt Levy (GST Exempt)</p>
                </div>
                <span className="font-semibold text-emerald-400">₹{pricing.stampDuty.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <div>
                  <span>MCA ROC Govt Fee:</span>
                  <p className="text-[10px] text-emerald-400">Zero Fee up to ₹15L Capital</p>
                </div>
                <span className="font-semibold text-emerald-400">
                  {pricing.rocFee === 0 ? '₹ 0 (Free)' : `₹${pricing.rocFee.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>

            {/* Total Highlight */}
            <div className="mt-6 pt-4 border-t-2 border-slate-700/80 flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Total All-Inclusive:</span>
                <p className="text-[10px] text-slate-400">Govt Fees + DSC + Drafting + GST</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-white tracking-tight">
                  ₹{pricing.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px] text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-400">🛡️ Zero Surprise Guarantee:</span> We do not charge surprise notary fees, hidden document delivery charges, or unannounced stamp escalations later.
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="w-1/3 py-3 px-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={onNext}
                className="w-2/3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#0B1528] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
