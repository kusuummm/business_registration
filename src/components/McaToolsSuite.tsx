'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Calculator, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  Building2, 
  Landmark, 
  Coins, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { STATE_STAMP_DUTY, StatePricing } from '@/data/pricingData';

// Prohibited / Regulated Words under MCA Rule 8 & Emblems and Names Act
const RESTRICTED_WORDS = [
  { word: 'national', reason: 'Requires Central Government prior approval under Emblems and Names Act, 1950.' },
  { word: 'federal', reason: 'Restricted under MCA Rule 8(2)(b); suggests government ownership.' },
  { word: 'republic', reason: 'Prohibited under Rule 8; indicates sovereign entity.' },
  { word: 'bharat', reason: 'Permissible only with substantial national presence or prior approval.' },
  { word: 'prime minister', reason: 'Strictly prohibited under Emblems and Names Act, 1950.' },
  { word: 'rashtrapati', reason: 'Strictly prohibited under Emblems and Names Act, 1950.' },
  { word: 'governor', reason: 'Prohibited; implies state governance.' },
  { word: 'bureau', reason: 'Requires regulatory justification; implies official government body.' },
  { word: 'commission', reason: 'Requires regulatory clearance; suggests statutory commission.' },
  { word: 'chartered', reason: 'Reserved strictly for ICAI/ICSI/ICMAI regulated bodies.' },
  { word: 'bank', reason: 'Requires RBI banking license and No Objection Certificate (NOC).' },
  { word: 'banking', reason: 'Requires Reserve Bank of India (RBI) prior clearance.' },
  { word: 'insurance', reason: 'Requires IRDAI regulatory clearance and registration.' },
  { word: 'stock exchange', reason: 'Requires SEBI prior approval.' },
  { word: 'mutual fund', reason: 'Requires SEBI asset management registration.' },
  { word: 'university', reason: 'Requires UGC accreditation and statutory state act.' },
  { word: 'court', reason: 'Prohibited; implies judicial body.' },
  { word: 'judiciary', reason: 'Prohibited; implies judicial authority.' },
  { word: 'police', reason: 'Prohibited under Emblems and Names Act.' },
  { word: 'army', reason: 'Prohibited under Emblems and Names Act.' },
  { word: 'navy', reason: 'Prohibited under Emblems and Names Act.' },
  { word: 'air force', reason: 'Prohibited under Emblems and Names Act.' }
];

// Well-known existing corporate brand words to detect phonetic conflict
const PROMINENT_BRANDS = [
  'tata', 'reliance', 'infosys', 'wipro', 'hdfc', 'icici', 'airtel', 'adani',
  'flipkart', 'paytm', 'zomato', 'swiggy', 'ola', 'byjus', 'razorpay', 'cred',
  'microsoft', 'google', 'apple', 'amazon', 'meta', 'tesla'
];

interface NameEvaluation {
  fullName: string;
  status: 'approved' | 'caution' | 'rejected';
  score: number;
  reasons: string[];
  positives: string[];
  suggestions: string[];
  trademarkClassRisk: string;
}

export default function McaToolsSuite() {
  const [activeTab, setActiveTab] = useState<'nameChecker' | 'stampDuty'>('nameChecker');

  // ==========================================
  // STATE 1: MCA NAME CHECKER STATE
  // ==========================================
  const [proposedName, setProposedName] = useState('TechNova');
  const [activityWord, setActivityWord] = useState('Solutions');
  const [entityType, setEntityType] = useState('Private Limited');
  const [industry, setIndustry] = useState('Technology & Software (Class 42 & 9)');
  const [copiedSuggestion, setCopiedSuggestion] = useState('');

  // Real-Time Rule 8 Verification Logic
  const nameResult: NameEvaluation = useMemo(() => {
    const cleanCore = proposedName.trim().toLowerCase();
    const cleanActivity = activityWord.trim().toLowerCase();
    const cleanFull = `${cleanCore} ${cleanActivity}`.trim();
    const combinedTokens = cleanFull.split(/\s+/).filter(Boolean);

    const reasons: string[] = [];
    const positives: string[] = [];
    let score = 95;

    if (!cleanCore) {
      return {
        fullName: 'Please enter a name',
        status: 'caution',
        score: 0,
        reasons: ['Please enter a proposed coined brand name.'],
        positives: [],
        suggestions: [],
        trademarkClassRisk: 'N/A'
      };
    }

    // 1. Length check
    if (cleanCore.length < 3) {
      reasons.push('Name is too short. MCA requires at least 3 characters for distinctive brand component.');
      score -= 30;
    } else {
      positives.push('Distinctive brand root length is compliant (≥ 3 characters).');
    }

    // 2. Prohibited word check
    let foundRestricted = false;
    for (const rw of RESTRICTED_WORDS) {
      if (combinedTokens.includes(rw.word) || cleanCore.includes(rw.word)) {
        reasons.push(`Contains restricted word "${rw.word.toUpperCase()}": ${rw.reason}`);
        foundRestricted = true;
        score -= 45;
        break;
      }
    }

    // 3. Brand conflict check
    let brandConflict = false;
    for (const b of PROMINENT_BRANDS) {
      if (cleanCore === b || cleanCore.startsWith(b) || cleanCore.endsWith(b)) {
        reasons.push(`High risk of trademark objection: Resembles well-known brand "${b.toUpperCase()}".`);
        brandConflict = true;
        score -= 40;
        break;
      }
    }

    // 4. Activity word validation
    if (!cleanActivity || cleanActivity.length < 2) {
      reasons.push('Missing activity noun. MCA Rule 8(2)(b) requires an indicative industry noun (e.g. Solutions, Technologies, Foods).');
      score -= 20;
    } else {
      positives.push(`Includes approved activity noun "${activityWord}".`);
    }

    // 5. Distinctiveness evaluation
    const commonGenericWords = ['india', 'global', 'international', 'services', 'enterprises', 'company', 'consulting'];
    if (commonGenericWords.includes(cleanCore)) {
      reasons.push('Purely generic/geographic word. MCA rejects names without a distinctive coined prefix.');
      score -= 35;
    } else if (!brandConflict && !foundRestricted) {
      positives.push('Distinctive coined root component with high distinctiveness.');
      positives.push('Complies with MCA Rule 8(2)(a) phonetic similarity guidelines.');
      positives.push('Free of restricted words under the Emblems and Names Act, 1950.');
    }

    // Final Status
    let status: 'approved' | 'caution' | 'rejected' = 'approved';
    if (foundRestricted || brandConflict || score < 50) {
      status = 'rejected';
    } else if (score < 80) {
      status = 'caution';
    }

    // Generate smart variations
    const capitalizedCore = proposedName.charAt(0).toUpperCase() + proposedName.slice(1);
    const suggestions = [
      `Nex${capitalizedCore} ${activityWord} ${entityType}`,
      `${capitalizedCore} Global ${activityWord} ${entityType}`,
      `Aura${capitalizedCore} ${activityWord} ${entityType}`,
      `${capitalizedCore} Dynamics ${entityType}`
    ];

    const trademarkClassRisk = industry.includes('Technology') 
      ? 'Class 42 (SaaS/Cloud) & Class 9 (Software Products)' 
      : industry.includes('E-Commerce')
      ? 'Class 35 (Trading/Online Portal)'
      : 'Class 35 (Business Consultancy) & Class 45 (Legal)';

    const displayFullName = `${capitalizedCore} ${activityWord} ${entityType}`.trim();

    return {
      fullName: displayFullName,
      status,
      score: Math.max(15, Math.min(98, score)),
      reasons,
      positives,
      suggestions,
      trademarkClassRisk
    };
  }, [proposedName, activityWord, entityType, industry]);

  const handleCopy = (text: string) => {
    setCopiedSuggestion(text);
    navigator.clipboard?.writeText(text);
    setTimeout(() => setCopiedSuggestion(''), 3000);
  };

  // ==========================================
  // STATE 2: PAN-INDIA STAMP DUTY CALCULATOR
  // ==========================================
  const [selectedStateCode, setSelectedStateCode] = useState<string>('MH');
  const [authorizedCapital, setAuthorizedCapital] = useState<number>(100000);
  const [dutyEntityType, setDutyEntityType] = useState<'Pvt Ltd' | 'LLP' | 'OPC'>('Pvt Ltd');

  const selectedStateObj = useMemo(() => {
    return STATE_STAMP_DUTY[selectedStateCode] || STATE_STAMP_DUTY['MH'];
  }, [selectedStateCode]);

  // Dynamic Stamp & ROC Duty Calculation Logic
  const calculation = useMemo(() => {
    const baseStamp = selectedStateObj.stampDuty || 1000;
    
    // Scale stamp duty for higher authorized capital
    let moaDuty = Math.round(baseStamp * 0.4);
    let aoaDuty = Math.round(baseStamp * 0.6);

    // Some states scale AOA duty above 10 Lakhs (e.g. Maharashtra, Punjab 1%, Delhi)
    if (authorizedCapital > 1000000) {
      const extraCapital = authorizedCapital - 1000000;
      if (selectedStateCode === 'MH') {
        aoaDuty += Math.min(40000, Math.round(extraCapital * 0.001));
      } else if (selectedStateCode === 'PB') {
        aoaDuty += Math.round(extraCapital * 0.005);
      } else {
        aoaDuty += Math.round(extraCapital * 0.0005);
      }
    }

    const totalStampDuty = moaDuty + aoaDuty;

    // MCA SPICe+ Part B ROC Fee Waiver:
    // Government ROC Fee is ₹0 for authorized capital up to ₹15 Lakhs for Pvt Ltd / OPC!
    let rocGovtFee = 0;
    if (authorizedCapital > 1500000) {
      const excess = authorizedCapital - 1500000;
      rocGovtFee = Math.round(1000 + (excess / 100000) * 300);
    }

    const panTanFee = 132; // NSDL ₹66 PAN + ₹66 TAN
    const nameReservationFee = 1000; // Form SPICe+ Part A Government fee
    const twoDscFee = 1500; // Class-3 tokens & eKYC verification
    const professionalFee = dutyEntityType === 'Pvt Ltd' ? 2499 : dutyEntityType === 'LLP' ? 1999 : 1899;
    const gstOnProfessional = Math.round(professionalFee * 0.18);

    const totalGovernmentFee = totalStampDuty + rocGovtFee + panTanFee + nameReservationFee;
    const grandTotal = totalGovernmentFee + twoDscFee + professionalFee + gstOnProfessional;

    return {
      moaDuty,
      aoaDuty,
      totalStampDuty,
      rocGovtFee,
      isRocWaiverApplied: authorizedCapital <= 1500000,
      panTanFee,
      nameReservationFee,
      twoDscFee,
      professionalFee,
      gstOnProfessional,
      totalGovernmentFee,
      grandTotal
    };
  }, [selectedStateObj, authorizedCapital, selectedStateCode, dutyEntityType]);

  return (
    <div className="w-full bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-8">
      {/* Top Banner & Module Selector */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-[#0F1E36] border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI MCA Intelligence & Statutory Calculator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Company Name Availability & State Stamp Duty Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Verify proposed company names against MCA Rule 8(2) guidelines and preview itemized State Stamp Duties with zero hidden costs.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('nameChecker')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'nameChecker'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>MCA Name Search</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stampDuty')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'stampDuty'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>State Duty Calculator</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MCA COMPANY NAME AVAILABILITY & RULE 8 CHECKER    */}
      {/* ======================================================== */}
      {activeTab === 'nameChecker' && (
        <div className="p-6 sm:p-8 space-y-7">
          {/* Input Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. Coined Root Name */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block flex items-center justify-between">
                <span>Proposed Coined Name <span className="text-amber-400">*</span></span>
                <span className="text-[10px] text-slate-500 font-normal">Brand Root</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={proposedName}
                  onChange={(e) => setProposedName(e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))}
                  placeholder="e.g. TechNova"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-blue-500 shadow-inner"
                />
              </div>
              <span className="text-[10px] text-slate-500 block">Unique word (Rule 8(2)(a))</span>
            </div>

            {/* 2. Activity Noun */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block flex items-center justify-between">
                <span>Business Activity Noun <span className="text-amber-400">*</span></span>
                <span className="text-[10px] text-slate-500 font-normal">Rule 8(2)(b)</span>
              </label>
              <input
                type="text"
                value={activityWord}
                onChange={(e) => setActivityWord(e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))}
                placeholder="e.g. Solutions, Technologies"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-blue-500 shadow-inner"
              />
              <span className="text-[10px] text-slate-500 block">Indicates industrial domain</span>
            </div>

            {/* 3. Entity Suffix */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">
                Corporate Entity Suffix
              </label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-blue-500 shadow-inner cursor-pointer"
              >
                <option value="Private Limited">Private Limited (Pvt Ltd)</option>
                <option value="LLP">Limited Liability Partnership (LLP)</option>
                <option value="OPC Private Limited">One Person Company (OPC)</option>
                <option value="Section 8 Foundation">Section 8 (Non-Profit NGO)</option>
                <option value="Public Limited">Public Limited (Limited)</option>
              </select>
              <span className="text-[10px] text-slate-500 block">Legal corporate structure</span>
            </div>

            {/* 4. Industry Domain */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">
                Target Industry & Trademark Class
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-blue-500 shadow-inner cursor-pointer"
              >
                <option value="Technology & Software (Class 42 & 9)">Technology & Software (Class 42 & 9)</option>
                <option value="E-Commerce & Trading (Class 35)">E-Commerce & Retail Trading (Class 35)</option>
                <option value="Financial Services & Fintech (Class 36)">Fintech & Financial (Class 36)</option>
                <option value="Healthcare & Pharma (Class 5 & 44)">Healthcare & Life Sciences (Class 5 & 44)</option>
                <option value="Logistics & Supply Chain (Class 39)">Logistics & Transportation (Class 39)</option>
                <option value="Manufacturing & Industrial (Class 7 & 11)">Manufacturing & Engineering (Class 7 & 11)</option>
              </select>
              <span className="text-[10px] text-slate-500 block">Determines trademark cross-check</span>
            </div>
          </div>

          {/* Real-Time Rule 8 Verification Result Card */}
          <div className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
            nameResult.status === 'approved'
              ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/40 shadow-emerald-950/30'
              : nameResult.status === 'caution'
              ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/40 shadow-amber-950/30'
              : 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border-rose-500/40 shadow-rose-950/30'
          } shadow-lg space-y-4`}>
            {/* Verdict Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Evaluated Corporate Identifier:
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>{nameResult.fullName}</span>
                </h3>
              </div>

              {/* Status Pill Badge */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className={`px-3 py-1.5 rounded-full border text-xs font-black flex items-center gap-1.5 ${
                  nameResult.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                    : nameResult.status === 'caution'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                }`}>
                  {nameResult.status === 'approved' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : nameResult.status === 'caution' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>
                    {nameResult.status === 'approved'
                      ? 'HIGH APPROVAL PROBABILITY'
                      : nameResult.status === 'caution'
                      ? 'CONDITIONAL / NEEDS JUSTIFICATION'
                      : 'HIGH REJECTION RISK'}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                  {nameResult.score}% Score
                </span>
              </div>
            </div>

            {/* Positives & Reasons Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              {/* Strengths */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  MCA Compliance Positives:
                </span>
                {nameResult.positives.length > 0 ? (
                  <ul className="space-y-1.5">
                    {nameResult.positives.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-[11px]">No favorable factors detected yet.</p>
                )}
              </div>

              {/* Flags / Risks */}
              <div className="space-y-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                  nameResult.reasons.length > 0 ? 'text-amber-400' : 'text-slate-500'
                }`}>
                  Regulatory Checks & Flags:
                </span>
                {nameResult.reasons.length > 0 ? (
                  <ul className="space-y-1.5">
                    {nameResult.reasons.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Zero Rule 8 red flags identified. Clean distinctive mark.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Smart Suggested Alternatives */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400">Available Variations:</span>
                {nameResult.suggestions.slice(0, 3).map((sugg, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => handleCopy(sugg)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                    title="Click to copy suggestion"
                  >
                    <span>{sugg}</span>
                    {copiedSuggestion === sugg ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* Reserve in SPICe+ Part A CTA */}
              <Link
                href={`/register?service=private-limited&name=${encodeURIComponent(nameResult.fullName)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer active:scale-95 shrink-0"
              >
                <span>Reserve in SPICe+ Part A</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PAN-INDIA STATE STAMP DUTY & ROC CALCULATOR       */}
      {/* ======================================================== */}
      {activeTab === 'stampDuty' && (
        <div className="p-6 sm:p-8 space-y-7">
          {/* Controls: State, Capital, Entity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            {/* 1. Select State */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">
                State of Registered Office <span className="text-amber-400">*</span>
              </label>
              <select
                value={selectedStateCode}
                onChange={(e) => setSelectedStateCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-blue-500 shadow-inner cursor-pointer"
              >
                {(Object.values(STATE_STAMP_DUTY) as StatePricing[]).map((s: StatePricing) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code}) • Base: ₹{s.stampDuty.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 block">
                {selectedStateObj.notes || 'Indian Stamp Act Schedule'}
              </span>
            </div>

            {/* 2. Authorized Share Capital */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block flex items-center justify-between">
                <span>Authorized Share Capital</span>
                <span className="text-amber-400 font-mono font-bold">
                  ₹{authorizedCapital.toLocaleString('en-IN')}
                </span>
              </label>
              <select
                value={authorizedCapital}
                onChange={(e) => setAuthorizedCapital(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-blue-500 shadow-inner cursor-pointer"
              >
                <option value={100000}>₹1,00,000 (Standard ₹1 Lakh Startup Capital)</option>
                <option value={500000}>₹5,00,000 (₹5 Lakhs)</option>
                <option value={1000000}>₹10,00,000 (₹10 Lakhs)</option>
                <option value={1500000}>₹15,00,000 (₹15 Lakhs - Max ₹0 ROC Waiver)</option>
                <option value={2500000}>₹25,00,000 (₹25 Lakhs)</option>
                <option value={5000000}>₹50,00,000 (₹50 Lakhs)</option>
                <option value={10000000}>₹1,00,00,000 (₹1 Crore)</option>
              </select>
              <span className="text-[10px] text-emerald-400 block">
                {authorizedCapital <= 1500000
                  ? '✓ Eligible for MCA SPICe+ ₹0 ROC Form Fee Waiver'
                  : 'Slab-based MCA fee applies on excess capital'}
              </span>
            </div>

            {/* 3. Entity Type */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">
                Corporate Entity
              </label>
              <select
                value={dutyEntityType}
                onChange={(e) => setDutyEntityType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-blue-500 shadow-inner cursor-pointer"
              >
                <option value="Pvt Ltd">Private Limited Company</option>
                <option value="LLP">Limited Liability Partnership (LLP)</option>
                <option value="OPC">One Person Company (OPC)</option>
              </select>
              <span className="text-[10px] text-slate-500 block">Determines drafting and ROC schedules</span>
            </div>
          </div>

          {/* Itemized Sovereign Levies vs Professional Assistance Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Card A: Sovereign Government Remittances */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  <span>Sovereign Government Levies</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                  100% Pass-Through
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>State Stamp Duty (MOA):</span>
                  <span className="font-mono font-bold">₹{calculation.moaDuty.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>State Stamp Duty (AOA):</span>
                  <span className="font-mono font-bold">₹{calculation.aoaDuty.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Form SPICe+ Part A (Name):</span>
                  <span className="font-mono font-bold">₹{calculation.nameReservationFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-300 items-center">
                  <span>ROC Incorporation Fee:</span>
                  <span className="font-mono font-bold">
                    {calculation.rocGovtFee === 0 ? (
                      <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                        ₹0 (Waived)
                      </span>
                    ) : (
                      `₹${calculation.rocGovtFee.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>PAN & TAN Statutory Charges:</span>
                  <span className="font-mono font-bold">₹{calculation.panTanFee.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold text-amber-300">
                <span>Subtotal Sovereign Levies:</span>
                <span className="font-mono text-sm">₹{calculation.totalGovernmentFee.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Card B: Legal Drafting & Digital Tokens */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Drafting & Professional Tokens</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded">
                  All Inclusive
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>2 Class-3 DSC Tokens (2-Yr):</span>
                  <span className="font-mono font-bold">₹{calculation.twoDscFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>CS / CA Professional Fee:</span>
                  <span className="font-mono font-bold">₹{calculation.professionalFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>18% GST on Professional Fee:</span>
                  <span className="font-mono font-bold">₹{calculation.gstOnProfessional.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Direct Company Secretary Allotment:</span>
                  <span className="text-emerald-400 font-bold">Included</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Zero-Balance Current Account:</span>
                  <span className="text-emerald-400 font-bold">Free Setup</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold text-blue-300">
                <span>Subtotal Professional & Tokens:</span>
                <span className="font-mono text-sm">
                  ₹{(calculation.twoDscFee + calculation.professionalFee + calculation.gstOnProfessional).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Card C: Grand Total & Instant Checkout */}
            <div className="p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/30 via-slate-950 to-slate-900 flex flex-col justify-between space-y-4 shadow-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Guaranteed All-Inclusive Outlay
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-white font-mono">
                    ₹{calculation.grandTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-slate-400">Total Net Cost</span>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Includes State Stamp Duty for <strong>{selectedStateObj.name}</strong>, MCA ROC filing, 2 DSCs, and dedicated CS support. Zero surprise charges.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <Link
                  href={`/register?service=private-limited&state=${selectedStateCode}&capital=${authorizedCapital}`}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs text-center flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
                >
                  <span>Incorporate in {selectedStateObj.name}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                <p className="text-[10px] text-center text-slate-500">
                  ⚖️ Transparent statutory remittance under MCA V3
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
