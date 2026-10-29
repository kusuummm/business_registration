'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Scale, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      <Header />

      <main className="max-w-4xl mx-auto w-full py-12 px-4 sm:px-6 flex-1 space-y-8">
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Legal Terms & Refund Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms of Service & Statutory Fee Refund Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: October 2026 • Governed by the Laws of the Republic of India
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="text-base font-black text-slate-900">1. Nature of Services</h2>
            <p>
              This platform provides technology-enabled corporate secretarial, accounting, tax, trademark, and statutory regulatory filing assistance. Services are executed by and under the supervision of verified Company Secretaries (ICSI), Advocates (BCI), and Chartered Accountants (ICAI).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-slate-900">2. Distinction Between Professional Fees and Statutory Sovereign Levies</h2>
            <p>
              Every transaction made on this platform clearly delineates between:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Professional & Secretarial Service Fees:</strong> Amounts paid for name search, drafting of legal documents (MOA/AOA), form preparation, and expert filing representation. Subject to 18% GST.</li>
              <li><strong>Sovereign State Stamp Duties & MCA Statutory Fees:</strong> Direct government levies remitted to State Treasuries and the Ministry of Corporate Affairs (MCA). Completely exempt from GST.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-slate-900">3. Transparent Refund Policy</h2>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase">Government Statutory Fees:</h4>
              <p className="text-xs text-slate-600">
                Statutory fees (such as SPICe+ Part A ₹1,000 MCA fee, state sovereign stamp duties, and PAN/TAN government fees) once remitted through the MCA V3 portal or State Treasury e-Gras portals are <strong>strictly non-refundable by the government</strong>.
              </p>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
              <h4 className="font-extrabold text-blue-900 text-xs uppercase">Our Professional Service Fee Guarantee:</h4>
              <p className="text-xs text-blue-800">
                If our secretarial desk has not yet submitted your documents to the government portal and you request cancellation within 48 hours of payment, 100% of the professional fee will be refunded to your original payment method. If a company name is rejected by the CRC due to technical conflict, our desk provides <strong>one free resubmission</strong> with alternate name choices.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-slate-900">4. Turnaround Time & SLAs</h2>
            <p>
              Estimated timelines (e.g. 4-5 business days for incorporation) represent standard operational SLAs. Delays arising strictly from government server downtime (MCA V3 portal maintenance, State Treasury e-payment gateway delays, or CRC backlogs) are beyond our control, but our secretarial desk actively coordinates daily with CRC officers to expedite approvals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-black text-slate-900">5. Authenticity of Client Documents</h2>
            <p>
              Clients represent and warrant that all identity proof (PAN, Aadhaar, Passport), registered office proofs (Electricity Bill, NOC), and affidavits furnished are genuine and authentic. Submission of forged documents is a punishable statutory offense under the Indian Penal Code and Section 447 of the Companies Act, 2013.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
