'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft,
  Building,
  Check
} from 'lucide-react';
import { CompanyDetails } from '@/types';

interface Step3Props {
  company: CompanyDetails;
  onChange: (updated: Partial<CompanyDetails>) => void;
  onNext: () => void;
  onBack: () => void;
}

const INDUSTRIES = [
  { id: 'it', name: 'Software & Information Technology', keyword: 'Technologies / Tech' },
  { id: 'ecommerce', name: 'E-Commerce, Marketplace & Retail', keyword: 'Retail / Commerce' },
  { id: 'fintech', name: 'FinTech & Financial Technology Services', keyword: 'Fintech / Pay' },
  { id: 'healthcare', name: 'Healthcare, MedTech & BioTech', keyword: 'Healthcare / Health' },
  { id: 'logistics', name: 'Logistics, Supply Chain & Transport', keyword: 'Logistics / Supply' },
  { id: 'renewable', name: 'CleanTech, Solar & Renewable Energy', keyword: 'Energy / Clean' },
  { id: 'manufacturing', name: 'Manufacturing & Industrial Engineering', keyword: 'Enterprises / Industries' },
  { id: 'consulting', name: 'Corporate Advisory & Management Consulting', keyword: 'Consultancy / Advisory' },
];

export default function Step3CompanyNames({
  company,
  onChange,
  onNext,
  onBack
}: Step3Props) {
  const [primaryName, setPrimaryName] = useState(company.primaryName || '');
  const [secondaryName, setSecondaryName] = useState(company.secondaryName || '');
  const [industry, setIndustry] = useState(company.industry || INDUSTRIES[0].id);
  const [error, setError] = useState('');

  // Determine suffix based on entity
  const suffix = company.entityType === 'llp' 
    ? 'LLP' 
    : company.entityType === 'opc' 
    ? '(OPC) Private Limited' 
    : 'Private Limited';

  const formatCleanName = (name: string) => {
    // Strip redundant suffix if user typed it
    const trimmed = name.trim();
    const regex = new RegExp(`(\\s+${suffix}|\\s+pvt\\s+ltd|\\s+private\\s+limited)$`, 'i');
    return trimmed.replace(regex, '').trim();
  };

  const handleNext = () => {
    setError('');
    const cleanPrimary = formatCleanName(primaryName);
    if (!cleanPrimary || cleanPrimary.length < 3) {
      setError('Please provide a valid Primary Proposed Company Name (minimum 3 characters)');
      return;
    }

    onChange({
      primaryName: `${cleanPrimary} ${suffix}`,
      secondaryName: secondaryName ? `${formatCleanName(secondaryName)} ${suffix}` : '',
      industry
    });
    onNext();
  };

  // Rule 8 checks for guidance
  const cleanP = formatCleanName(primaryName);
  const hasMultipleWords = cleanP.split(/\s+/).filter(Boolean).length >= 2;
  const isTooGeneric = /^(india|national|global|international|bharat|prime|world)$/i.test(cleanP.trim());
  const selectedIndustryObj = INDUSTRIES.find((i) => i.id === industry);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>SPICe+ Part A — Ministry of Corporate Affairs</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Propose Company Names & Business Objects
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          The MCA Central Registration Centre (CRC) evaluates proposed names under the Companies (Incorporation) Rules, 2014. Suggest 2 preferences to ensure guaranteed approval.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            {/* Primary Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Preference 1: Primary Proposed Name <span className="text-red-500">*</span>
              </label>
              <div className="relative flex rounded-xl border border-slate-300 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-100 overflow-hidden">
                <input
                  type="text"
                  placeholder="e.g. AuraSoft Technologies"
                  value={primaryName}
                  onChange={(e) => setPrimaryName(e.target.value)}
                  className="flex-1 py-3 px-3.5 text-sm font-semibold outline-none text-slate-900"
                />
                <span className="bg-slate-100 px-3.5 flex items-center text-xs font-bold text-slate-600 border-l border-slate-200">
                  {suffix}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                We automatically append the statutory suffix <strong>&quot;{suffix}&quot;</strong> upon filing.
              </p>
            </div>

            {/* Secondary Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Preference 2: Alternative Backup Name (Optional but Recommended)
              </label>
              <div className="relative flex rounded-xl border border-slate-300 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-100 overflow-hidden">
                <input
                  type="text"
                  placeholder="e.g. AuraCloud Solutions"
                  value={secondaryName}
                  onChange={(e) => setSecondaryName(e.target.value)}
                  className="flex-1 py-3 px-3.5 text-sm font-semibold outline-none text-slate-900"
                />
                <span className="bg-slate-100 px-3.5 flex items-center text-xs font-bold text-slate-600 border-l border-slate-200">
                  {suffix}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                If the ROC officer rejects Preference 1 due to trademark overlap, Preference 2 will be approved without paying re-submission govt penalties.
              </p>
            </div>

            {/* Industry Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Main Business Activity / Objects of the Company <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INDUSTRIES.map((ind) => {
                  const isSel = ind.id === industry;
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setIndustry(ind.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSel
                          ? 'border-[#0B1528] bg-slate-50 ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900">{ind.name}</span>
                      <span className="text-[10px] text-slate-500 mt-1">Activity hint: {ind.keyword}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                {error}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 px-4 rounded-xl bg-[#0B1528] hover:bg-[#1E293B] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <span>Save Names & Proceed to Director KYC</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Rule 8 MCA Compliance Engine & SPICe+ Preview */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live CRC Name Preview Card */}
          <div className="bg-[#0B1528] text-white rounded-2xl p-6 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                MCA SPICe+ Part A Preview
              </span>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                CRC V3 Registry
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">1st Choice on Government File:</p>
                <p className="text-base font-extrabold text-white font-mono mt-0.5 break-words">
                  {cleanP ? `${cleanP} ${suffix}` : `[Enter Primary Name] ${suffix}`}
                </p>
              </div>

              {secondaryName && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">2nd Choice (Backup):</p>
                  <p className="text-xs font-semibold text-slate-300 font-mono mt-0.5 break-words">
                    {formatCleanName(secondaryName)} {suffix}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                <span className="text-slate-400">Main Industry:</span>
                <span className="font-semibold text-slate-200">{selectedIndustryObj?.name.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {/* Rule 8 Compliance Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>MCA Rule 8 Approval Formula</span>
            </h4>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Every compliant company name in India must consist of:
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 font-mono text-xs text-slate-800 text-center font-bold">
              [Distinct Unique Brand] + [Activity Word] + [{suffix}]
            </div>

            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                {hasMultipleWords ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <span className={hasMultipleWords ? 'text-slate-700' : 'text-amber-800'}>
                  <strong>Multi-word structure:</strong> Combine a unique brand name with an activity keyword (e.g. &quot;AuraSoft Technologies&quot;).
                </span>
              </li>

              <li className="flex items-start gap-2">
                {!isTooGeneric ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                )}
                <span className={!isTooGeneric ? 'text-slate-700' : 'text-red-700'}>
                  <strong>No single generic words:</strong> Names like &quot;India&quot; or &quot;Global&quot; are automatically rejected by MCA CRC.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">
                  <strong>Trademark search:</strong> Our in-house CS team verifies Class 9, 35, 42 TM databases before submitting to MCA.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
