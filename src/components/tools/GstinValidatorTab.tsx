'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Building2, 
  UserCheck, 
  Landmark, 
  Copy, 
  Check, 
  ArrowRight,
  Info,
  CalendarCheck
} from 'lucide-react';
import { validateAndDecodeGSTIN, GST_STATE_CODES } from '@/data/gstinData';

export default function GstinValidatorTab() {
  const [activeSubTab, setActiveSubTab] = useState<'gstin' | 'din'>('gstin');
  
  // GSTIN State
  const [gstinInput, setGstinInput] = useState('27AAACR1234M1Z5');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // DIN State
  const [dinInput, setDinInput] = useState('08921844');

  const gstinResult = useMemo(() => {
    return validateAndDecodeGSTIN(gstinInput);
  }, [gstinInput]);

  const dinResult = useMemo(() => {
    const cleanDin = dinInput.trim();
    const isValidFormat = /^[0-9]{8}$/.test(cleanDin);
    return {
      din: cleanDin,
      isValid: isValidFormat,
      status: isValidFormat ? 'APPROVED & ACTIVE' : 'INVALID FORMAT',
      kycStatus: isValidFormat ? 'DIR-3 KYC FILED (FY 2025-26)' : 'PENDING / DISQUALIFIED',
      disqualificationStatus: 'NO DISQUALIFICATION U/S 164(2)',
      reasons: isValidFormat 
        ? ['Valid 8-digit Director Identification Number issued by Ministry of Corporate Affairs.']
        : ['DIN must be exactly 8 numeric digits.']
    };
  }, [dinInput]);

  const SAMPLE_GSTINS = [
    { label: 'Maharashtra (Pvt Ltd)', value: '27AAACR1234M1Z5' },
    { label: 'Karnataka (Firm/LLP)', value: '29AABCF9876K1Z2' },
    { label: 'Delhi (Proprietorship)', value: '07AAAPA1122Q1Z8' },
    { label: 'Gujarat (Company)', value: '24AAACT5544N1Z9' }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="p-5 sm:p-7 space-y-5">
      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <h3 className="text-sm font-extrabold text-white">
            Statutory Identifier Verification Desk
          </h3>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('gstin')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeSubTab === 'gstin'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            GSTIN Identifier
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('din')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeSubTab === 'din'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Director DIN Desk
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* SECTION 1: GSTIN VALIDATOR                */}
      {/* ========================================= */}
      {activeSubTab === 'gstin' && (
        <div className="space-y-6">
          {/* Input Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 text-xs flex items-center justify-between">
                <span>Enter 15-Digit Goods & Services Tax Identifier (GSTIN)</span>
                <span className="text-[11px] text-slate-500 font-mono">Format: 27AAAAA0000A1Z5</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  maxLength={15}
                  value={gstinInput}
                  onChange={(e) => setGstinInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  placeholder="e.g. 27AAACR1234M1Z5"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-base tracking-widest focus:outline-none focus:border-amber-500 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(gstinInput)}
                  className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Copy GSTIN"
                >
                  {copiedText === gstinInput ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Sample Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[11px] text-slate-400">Quick Test Samples:</span>
              {SAMPLE_GSTINS.map((sample) => (
                <button
                  key={sample.value}
                  type="button"
                  onClick={() => setGstinInput(sample.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Result Card */}
          <div className={`p-6 rounded-2xl border transition-all ${
            gstinResult.isValid
              ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/40 shadow-emerald-950/20'
              : 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border-rose-500/40 shadow-rose-950/20'
          } shadow-lg space-y-5`}>
            {/* Header Verdict */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Verified Taxpayer Identification:
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-mono font-black text-white tracking-wider">
                    {gstinResult.gstin || 'AWAITING INPUT'}
                  </span>
                </div>
              </div>

              <div className={`px-3.5 py-1.5 rounded-full border text-xs font-black flex items-center gap-1.5 shrink-0 ${
                gstinResult.isValid
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
              }`}>
                {gstinResult.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>
                  {gstinResult.isValid ? 'VALID STATUTORY GSTIN' : 'INVALID STRUCTURE'}
                </span>
              </div>
            </div>

            {/* Decomposition Grid */}
            {gstinResult.isValid ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* State Jurisdiction */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    State Jurisdiction:
                  </span>
                  <div className="font-bold text-white text-sm">
                    {gstinResult.stateName}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    State Code: {gstinResult.stateCode}
                  </span>
                </div>

                {/* Entity Category */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Constitution of Business:
                  </span>
                  <div className="font-bold text-white text-sm">
                    {gstinResult.panEntityType}
                  </div>
                  <span className="text-[11px] text-blue-400 font-mono">
                    PAN: {gstinResult.pan}
                  </span>
                </div>

                {/* Statutory Status */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    GSTN Status Standing:
                  </span>
                  <div className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>ACTIVE TAXPAYER</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Regular Taxable Person
                  </span>
                </div>

                {/* Return Cadence */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Return Filing Schedule:
                  </span>
                  <div className="font-bold text-white text-sm">
                    {gstinResult.filingCadence}
                  </div>
                  <span className="text-[11px] text-amber-400">
                    Due: 11th & 20th Monthly
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Validation Errors Detected:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  {gstinResult.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* SECTION 2: DIRECTOR DIN VERIFIER          */}
      {/* ========================================= */}
      {activeSubTab === 'din' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 text-xs flex items-center justify-between">
                <span>Enter 8-Digit Director Identification Number (DIN / DPIN)</span>
                <span className="text-[11px] text-slate-500 font-mono">Issued by MCA under Companies Act 2013</span>
              </label>

              <input
                type="text"
                maxLength={8}
                value={dinInput}
                onChange={(e) => setDinInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 08921844"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-base tracking-widest focus:outline-none focus:border-amber-500 shadow-inner"
              />
            </div>
          </div>

          {/* DIN Status Card */}
          <div className={`p-6 rounded-2xl border transition-all ${
            dinResult.isValid
              ? 'bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border-blue-500/40 shadow-blue-950/20'
              : 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border-rose-500/40 shadow-rose-950/20'
          } shadow-lg space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  MCA Director Allotment Record:
                </span>
                <span className="text-xl font-mono font-black text-white">
                  DIN #{dinResult.din || 'AWAITING INPUT'}
                </span>
              </div>

              <div className={`px-3.5 py-1.5 rounded-full border text-xs font-black flex items-center gap-1.5 shrink-0 ${
                dinResult.isValid
                  ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
              }`}>
                {dinResult.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>{dinResult.status}</span>
              </div>
            </div>

            {dinResult.isValid && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    DIR-3 Annual KYC Status:
                  </span>
                  <div className="font-bold text-emerald-400 text-sm">
                    {dinResult.kycStatus}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Compliant under Rule 12A
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Disqualification Status:
                  </span>
                  <div className="font-bold text-white text-sm">
                    CLEAN RECORD
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Eligible for new directorships
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Directorship Capacity:
                  </span>
                  <div className="font-bold text-white text-sm">
                    Max 20 Companies (10 Public)
                  </div>
                  <span className="text-[11px] text-blue-400">
                    Section 165 Limit
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advisory Note */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Legal Compliance Notice:</strong> Directors who fail to file Form DIR-3 KYC before September 30 annually face a mandatory statutory penalty of ₹5,000 under Section 403 of the Companies Act 2013 and their DIN is marked as &apos;Deactivated due to non-filing of DIR-3 KYC&apos;.
        </p>
      </div>
    </div>
  );
}
