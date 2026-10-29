'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { ShieldCheck, Lock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      <Header />

      <main className="max-w-4xl mx-auto w-full py-12 px-4 sm:px-6 flex-1 space-y-8">
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Statutory Legal Disclosure
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy & Data Protection Policy
          </h1>
          <p className="text-xs text-slate-500">
            Compliant with the Digital Personal Data Protection Act, 2023 (DPDP Act) & UIDAI Aadhaar Masking Standard • Last Updated: October 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="text-base font-black text-slate-900">1. Commitment to Personal Data Protection</h2>
            <p>
              This platform operates as a Data Fiduciary under the provisions of the Digital Personal Data Protection Act, 2023 (&quot;DPDP Act&quot;). We recognize the sensitivity of corporate formation documents, director identity records, and tax filings, and are committed to maintaining the highest level of security, encryption, and confidentiality.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-slate-900">2. Client-Side UIDAI Aadhaar Masking</h2>
            <p>
              In strict compliance with the Unique Identification Authority of India (UIDAI) regulations and Section 8(1) of the Aadhaar Act, 2016, our platform utilizes client-side cryptographic technology to automatically redact the first 8 digits of any Aadhaar card uploaded by directors or partners. Only the last 4 digits are visible for government verification, ensuring that full Aadhaar numbers are never transmitted or stored in raw plaintext.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-slate-900">3. Purpose of Data Collection</h2>
            <p>
              We collect personal and corporate data solely for legitimate and statutory purposes, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Drafting and filing statutory SPICe+ Part A, Part B, and AGILE-PRO-S forms with the Ministry of Corporate Affairs (MCA).</li>
              <li>Verification of Director Identification Numbers (DIN) and Digital Signature Certificates (DSC).</li>
              <li>GST registration (REG-01) and MSME Udyam registration with respective sovereign authorities.</li>
              <li>Remittance of exact statutory stamp duty to relevant State Treasuries.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-slate-900">4. No Sale or Commercial Exploitation of Data</h2>
            <p>
              We strictly uphold a <strong>zero-data-selling guarantee</strong>. Your confidential company records, director identity documents, capitalization schedules, and contact details are never monetized, rented, or shared with third-party telemarketers or credit bureaus.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-slate-900">5. Data Retention & Right to Erasure</h2>
            <p>
              Under Section 12 of the DPDP Act 2023, Data Principals (our customers) retain the statutory right to request erasure or correction of their personal data once statutory government filings have been completed and legally mandated retention periods (under the Companies Act 2013) have expired.
            </p>
          </section>

          <section className="space-y-3 p-5 bg-blue-50/70 border border-blue-200 rounded-xl">
            <h3 className="text-sm font-bold text-blue-900">Grievance Redressal Officer Contact:</h3>
            <p className="text-xs text-blue-800">
              In accordance with DPDP Act 2023 Section 13, for any queries or grievances regarding data protection, please write directly to our designated Grievance Officer: <strong className="font-mono">grievance@bharatfilings.in</strong>. Acknowledgment will be furnished within 24 hours.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
