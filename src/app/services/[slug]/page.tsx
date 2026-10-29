import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { notFound } from 'next/navigation';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle, 
  Download,
  PhoneCall,
  CalendarCheck,
  ChevronRight
} from 'lucide-react';
import { INITIAL_SERVICES, ServiceItem } from '@/data/servicesData';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return INITIAL_SERVICES.map((srv) => ({
    slug: srv.slug,
  }));
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = INITIAL_SERVICES.find((s) => s.slug === slug) || INITIAL_SERVICES[0];

  if (!service) {
    notFound();
  }

  // Calculate pricing breakdown
  const taxableSubtotal = service.baseFee + service.dscFee;
  const gstAmount = Math.round(taxableSubtotal * service.gstRate);
  const totalAmount = taxableSubtotal + gstAmount + service.govFee;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      {/* Hero Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Services</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-400">{service.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
                  {service.categoryName}
                </span>
                {service.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                    {service.badge}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {service.name}
              </h1>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-2xl">
                {service.fullDesc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href="/register"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition"
              >
                <span>Start Filing Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <span className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-semibold">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Turnaround Time: {service.slaDays}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto w-full py-10 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details, Inclusions, Documents, FAQs */}
          <div className="lg:col-span-8 space-y-8">
            {/* Inclusions & Exclusions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>What is Included in Our Package</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {service.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{inc}</span>
                  </div>
                ))}
              </div>

              {service.exclusions.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-slate-400" />
                    <span>Statutory Exclusions (If Applicable)</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {service.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-400">•</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Required Documents Checklist */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Mandatory Documents Checklist</span>
                </h2>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Paperless Digital Filing
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {service.requiredDocuments.map((doc, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5 text-xs">
                    <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      {i + 1}
                    </div>
                    <span className="font-semibold text-slate-800 leading-snug">{doc}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Statutory Tip:</strong> In compliance with MCA Rule 25, utility bills must not be older than 60 days. Aadhaar numbers are automatically masked on our platform.
                </span>
              </div>
            </div>

            {/* Service FAQs */}
            {service.faqs.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  <span>Frequently Asked Questions</span>
                </h2>

                <div className="space-y-4">
                  {service.faqs.map((faq, i) => (
                    <div key={i} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                      <h4 className="text-xs font-bold text-slate-900">{faq.q}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Transparent Quotation & Lead Box */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                  Itemized Statutory Fee
                </span>
                <span className="text-xs text-emerald-400 font-bold">100% Transparent</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Professional & Drafting Fee:</span>
                  <span className="font-semibold text-white">₹{service.baseFee.toLocaleString('en-IN')}</span>
                </div>

                {service.dscFee > 0 && (
                  <div className="flex justify-between">
                    <span>DSC Cryptographic Tokens:</span>
                    <span className="font-semibold text-white">₹{service.dscFee.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>GST (18% on Services):</span>
                  <span className="font-semibold text-blue-300">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between border-t border-slate-800 pt-2 text-slate-300">
                  <div>
                    <span>Govt Statutory / Stamp Duty:</span>
                    <p className="text-[10px] text-emerald-400">Zero GST on Sovereign Fees</p>
                  </div>
                  <span className="font-semibold text-emerald-400">
                    {service.govFee === 0 ? '₹ 0 (Free)' : `₹${service.govFee.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="mt-5 pt-3 border-t-2 border-slate-700/80 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Estimated:</span>
                  <p className="text-[10px] text-slate-500">All Taxes & Levies Included</p>
                </div>
                <span className="text-2xl font-black text-white">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <Link
                href="/register"
                className="mt-6 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition text-center"
              >
                <span>Proceed to Online Filing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Fast Assistance Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center">
              <PhoneCall className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-900">Have Questions Before Filing?</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Chat directly with our corporate advisory team on WhatsApp.
              </p>
              <a
                href="https://wa.me/919820012849"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <span>WhatsApp Advisory Desk</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
