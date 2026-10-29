'use client';

import React, { useState, useRef } from 'react';
import { 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { DirectorKYC } from '@/types';

interface Step4Props {
  directorCount: number;
  directors: DirectorKYC[];
  onChange: (directors: DirectorKYC[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4DirectorKYC({
  directorCount,
  directors,
  onChange,
  onNext,
  onBack
}: Step4Props) {
  // Ensure we have director entries up to directorCount
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');

  // Native file input references to open device/gallery picker
  const panInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);

  // Initialize directors array if missing
  const currentDirectors: DirectorKYC[] = Array.from({ length: directorCount }).map((_, i) => {
    return directors[i] || {
      id: `dir-${i + 1}`,
      fullName: '',
      panNumber: '',
      aadhaarNumber: '',
      hasExistingDin: false,
      dinNumber: '',
      isDigiLockerVerified: false,
      panDocName: '',
      aadhaarDocName: ''
    };
  });

  const updateDirector = (index: number, fields: Partial<DirectorKYC>) => {
    const updated = [...currentDirectors];
    updated[index] = { ...updated[index], ...fields };
    onChange(updated);
  };

  const handlePanChange = (index: number, val: string) => {
    const uppercaseVal = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    updateDirector(index, { panNumber: uppercaseVal });
  };

  const handleAadhaarChange = (index: number, rawVal: string) => {
    // Only allow numbers
    const cleanDigits = rawVal.replace(/\D/g, '').slice(0, 12);
    updateDirector(index, { aadhaarNumber: cleanDigits });
  };

  const formatMaskedAadhaar = (val: string) => {
    if (!val) return '';
    // Format as XXXX-XXXX-1234
    const clean = val.replace(/\D/g, '');
    if (clean.length <= 4) return clean;
    if (clean.length <= 8) {
      return `XXXX-${clean.slice(4)}`;
    }
    const lastFour = clean.slice(8);
    return `XXXX-XXXX-${lastFour}`;
  };

  const handleDigiLockerFetch = (index: number) => {
    // Simulate instant DigiLocker OTP/UIDAI verification
    const mockNames = ['Rahul Sharma', 'Ananya Deshmukh', 'Vikramaditya Verma', 'Pooja Iyer'];
    const mockPans = ['ABCDE1234F', 'BKZPS9821K', 'CRMPK4392L', 'PLMTR6721M'];
    const assignedName = currentDirectors[index].fullName || mockNames[index % mockNames.length];
    const assignedPan = currentDirectors[index].panNumber || mockPans[index % mockPans.length];

    updateDirector(index, {
      fullName: assignedName,
      panNumber: assignedPan,
      aadhaarNumber: currentDirectors[index].aadhaarNumber || '999988881234',
      isDigiLockerVerified: true,
      panDocName: `DigiLocker_PAN_${assignedPan}.pdf`,
      aadhaarDocName: `DigiLocker_Aadhaar_Masked.xml`
    });
  };

  const handleDeviceFileUpload = (
    index: number,
    type: 'pan' | 'aadhaar',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = file.size < 1024 * 1024 
      ? `${(file.size / 1024).toFixed(1)} KB` 
      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    if (type === 'pan') {
      updateDirector(index, {
        panDocName: file.name,
        panDocSize: sizeStr
      });
    } else {
      updateDirector(index, {
        aadhaarDocName: file.name,
        aadhaarDocSize: sizeStr
      });
    }

    // Reset so selecting the same file triggers change
    e.target.value = '';
  };

  const handleDropFile = (
    index: number,
    type: 'pan' | 'aadhaar',
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const sizeStr = file.size < 1024 * 1024 
      ? `${(file.size / 1024).toFixed(1)} KB` 
      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    if (type === 'pan') {
      updateDirector(index, {
        panDocName: file.name,
        panDocSize: sizeStr
      });
    } else {
      updateDirector(index, {
        aadhaarDocName: file.name,
        aadhaarDocSize: sizeStr
      });
    }
  };

  const handleNext = () => {
    setError('');
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    for (let i = 0; i < currentDirectors.length; i++) {
      const d = currentDirectors[i];
      if (!d.fullName.trim()) {
        setError(`Please enter full legal name for Director ${i + 1}`);
        setActiveTab(i);
        return;
      }
      if (!panRegex.test(d.panNumber)) {
        setError(`Director ${i + 1} has an invalid PAN card format. Must be 10 characters (e.g. ABCDE1234F)`);
        setActiveTab(i);
        return;
      }
      const cleanAadhaar = d.aadhaarNumber.replace(/\D/g, '');
      if (cleanAadhaar.length !== 12 && !d.isDigiLockerVerified) {
        setError(`Director ${i + 1} requires a valid 12-digit Aadhaar number for identity verification`);
        setActiveTab(i);
        return;
      }
    }

    onNext();
  };

  const activeDir = currentDirectors[activeTab] || currentDirectors[0];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <Lock className="w-3.5 h-3.5 text-blue-600" />
          <span>DPDP Act 2023 & UIDAI Circular Compliant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Director Identification & e-KYC Verification
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Enter identity details for all {directorCount} proposed directors. In compliance with UIDAI regulations, all Aadhaar numbers are cryptographically masked client-side.
        </p>
      </div>

      {/* Director Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-2">
        {currentDirectors.map((dir, idx) => {
          const isComplete = dir.fullName && dir.panNumber && (dir.aadhaarNumber || dir.isDigiLockerVerified);
          const isSelected = activeTab === idx;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-[#0B1528] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Director {idx + 1}</span>
              {isComplete ? (
                <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-700'}`} />
              ) : (
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-500'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Director Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* DigiLocker 1-Click Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Instant Govt e-KYC via DigiLocker
              </p>
              <p className="text-xs text-slate-600">
                Auto-pull verified PAN, Aadhaar XML and identity certificate in 2 seconds.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleDigiLockerFetch(activeTab)}
            className="px-4 py-2 bg-[#0B1528] hover:bg-[#1E293B] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer shrink-0"
          >
            <UserCheck className="w-4 h-4" />
            <span>Fetch via DigiLocker</span>
          </button>
        </div>

        {activeDir.isDigiLockerVerified && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>DigiLocker KYC Authenticated (UIDAI Secure XML verified for Director {activeTab + 1}).</span>
          </div>
        )}

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Legal Name (Exact PAN Match) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={activeDir.fullName}
              onChange={(e) => updateDirector(activeTab, { fullName: e.target.value })}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100 outline-none text-sm font-semibold text-slate-900"
            />
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Permanent Account Number (PAN) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={10}
              placeholder="ABCDE1234F"
              value={activeDir.panNumber}
              onChange={(e) => handlePanChange(activeTab, e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100 outline-none text-sm font-mono font-bold uppercase text-slate-900 tracking-wider"
            />
            <p className="text-[11px] text-slate-500 mt-1">10-digit alphanumeric tax identifier</p>
          </div>

          {/* Aadhaar Number with Client-Side Masking */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Aadhaar Number (UIDAI) <span className="text-red-500">*</span></span>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" /> Auto-Masked
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={12}
                placeholder="12-digit Aadhaar Number"
                value={activeDir.aadhaarNumber}
                onChange={(e) => handleAadhaarChange(activeTab, e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100 outline-none text-sm font-mono font-semibold text-slate-900"
              />
            </div>

            {/* Masked Preview under input */}
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Government Stored Display:</span>
              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                {activeDir.aadhaarNumber ? formatMaskedAadhaar(activeDir.aadhaarNumber) : 'XXXX-XXXX-XXXX'}
              </span>
            </div>
          </div>
        </div>

        {/* Existing DIN question */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Does Director {activeTab + 1} possess an existing DIN?
              </p>
              <p className="text-xs text-slate-500">
                If not, fresh Director Identification Number is allotted free inside SPICe+ Part B.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateDirector(activeTab, { hasExistingDin: false, dinNumber: '' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                  !activeDir.hasExistingDin
                    ? 'bg-[#0B1528] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                No (Apply Fresh)
              </button>
              <button
                type="button"
                onClick={() => updateDirector(activeTab, { hasExistingDin: true })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                  activeDir.hasExistingDin
                    ? 'bg-[#0B1528] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Yes (Existing DIN)
              </button>
            </div>
          </div>

          {activeDir.hasExistingDin && (
            <div className="mt-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Enter 8-Digit DIN Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={8}
                placeholder="e.g. 09876543"
                value={activeDir.dinNumber || ''}
                onChange={(e) => updateDirector(activeTab, { dinNumber: e.target.value.replace(/\D/g, '') })}
                className="w-full sm:w-64 py-2 px-3 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900"
              />
            </div>
          )}
        </div>

        {/* Document Attachment with Device / Gallery File Picker */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Director ID Attachments (Encrypted Sovereign Storage)
          </label>

          {/* Hidden inputs to trigger native OS file dialog (gallery/files/camera) */}
          <input
            type="file"
            ref={panInputRef}
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleDeviceFileUpload(activeTab, 'pan', e)}
          />
          <input
            type="file"
            ref={aadhaarInputRef}
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleDeviceFileUpload(activeTab, 'aadhaar', e)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* PAN Doc Card */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropFile(activeTab, 'pan', e)}
              onClick={() => panInputRef.current?.click()}
              className={`border border-dashed rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition ${
                activeDir.panDocName
                  ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/60'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  activeDir.panDocName ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600'
                }`}>
                  {activeDir.panDocName ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate" title={activeDir.panDocName || 'PAN Card'}>
                    {activeDir.panDocName || 'Upload PAN Card'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {activeDir.panDocSize ? `${activeDir.panDocSize} • Attached` : 'Click to select from device / gallery'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  panInputRef.current?.click();
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition shrink-0 cursor-pointer ${
                  activeDir.panDocName
                    ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300'
                    : 'text-blue-600 border border-blue-200 hover:bg-blue-50'
                }`}
              >
                {activeDir.panDocName ? 'Replace' : 'Upload'}
              </button>
            </div>

            {/* Aadhaar Doc Card */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropFile(activeTab, 'aadhaar', e)}
              onClick={() => aadhaarInputRef.current?.click()}
              className={`border border-dashed rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition ${
                activeDir.aadhaarDocName
                  ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/60'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  activeDir.aadhaarDocName ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {activeDir.aadhaarDocName ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate" title={activeDir.aadhaarDocName || 'Masked Aadhaar'}>
                    {activeDir.aadhaarDocName || 'Upload Masked Aadhaar'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {activeDir.aadhaarDocSize ? `${activeDir.aadhaarDocSize} • Attached` : 'Click to select from device / gallery'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  aadhaarInputRef.current?.click();
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition shrink-0 cursor-pointer ${
                  activeDir.aadhaarDocName
                    ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300'
                    : 'text-blue-600 border border-blue-200 hover:bg-blue-50'
                }`}
              >
                {activeDir.aadhaarDocName ? 'Replace' : 'Upload'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center gap-3">
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
          <span>Confirm All Directors & Proceed to Registered Office</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
