'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { 
  Calendar, 
  CalendarCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  Filter, 
  Sparkles, 
  ShieldAlert, 
  Download,
  Building2,
  Receipt,
  Calculator
} from 'lucide-react';

interface StatutoryEvent {
  id: string;
  dueDate: string;
  formName: string;
  category: 'ROC' | 'GST' | 'ITR_TDS' | 'LLP';
  title: string;
  description: string;
  targetEntity: string;
  statutoryPenalty: string;
  urgency: 'high' | 'medium' | 'normal';
  serviceSlug: string;
}

const STATUTORY_EVENTS_2026: StatutoryEvent[] = [
  {
    id: 'gst-gstr1-monthly',
    dueDate: '11th of every month',
    formName: 'GSTR-1',
    category: 'GST',
    title: 'Monthly Outward Supplies Return',
    description: 'Mandatory monthly reporting of all sales invoices, debit/credit notes, and B2B supplies for standard taxpayers.',
    targetEntity: 'Regular GST Taxpayers (Turnover > ₹5 Cr or monthly filers)',
    statutoryPenalty: '₹50/day (₹20/day for NIL return) under Sec 47 of CGST Act',
    urgency: 'high',
    serviceSlug: 'gst-returns'
  },
  {
    id: 'gst-gstr3b-monthly',
    dueDate: '20th of every month',
    formName: 'GSTR-3B',
    category: 'GST',
    title: 'Monthly Self-Assessed Tax Summary & Payment',
    description: 'Monthly summary return for claiming Input Tax Credit (ITC) and paying net outward GST liability.',
    targetEntity: 'All Regular GST Registered Entities',
    statutoryPenalty: '18% p.a. interest on delayed tax liability + ₹50/day late fee',
    urgency: 'high',
    serviceSlug: 'gst-returns'
  },
  {
    id: 'tds-monthly-challan',
    dueDate: '7th of every month',
    formName: 'Challan 281',
    category: 'ITR_TDS',
    title: 'Monthly TDS / TCS Statutory Remittance',
    description: 'Deposit of tax deducted at source for salaries, contractor payments, rent, and professional fees deducted during prior month.',
    targetEntity: 'All Entities with Active TAN',
    statutoryPenalty: '1.5% per month interest under Section 201(1A) from date of deduction',
    urgency: 'medium',
    serviceSlug: 'tds-return-filing'
  },
  {
    id: 'advance-tax-q1',
    dueDate: '15 June 2026',
    formName: 'ITNS 280 (15%)',
    category: 'ITR_TDS',
    title: 'Advance Tax Installment - Q1 (15%)',
    description: 'First quarterly installment of advance tax on estimated annual corporate taxable income.',
    targetEntity: 'Companies, LLPs & Taxpayers with Tax Liability > ₹10,000',
    statutoryPenalty: '1% per month interest under Section 234B & 234C',
    urgency: 'normal',
    serviceSlug: 'corporate-itr'
  },
  {
    id: 'llp-form-11',
    dueDate: '30 May 2026',
    formName: 'Form 11 (LLP)',
    category: 'LLP',
    title: 'Annual Return of Limited Liability Partnership',
    description: 'Mandatory annual summary of partner contributions and management details filed with MCA CRC.',
    targetEntity: 'All Registered LLPs (regardless of turnover or activity)',
    statutoryPenalty: '₹100 per day of default with no upper cap under Section 35 of LLP Act',
    urgency: 'high',
    serviceSlug: 'llp-annual-filing'
  },
  {
    id: 'dpt-3',
    dueDate: '30 June 2026',
    formName: 'Form DPT-3',
    category: 'ROC',
    title: 'Return of Deposits & Non-Deposit Loans',
    description: 'Annual disclosure of outstanding loans from directors, shareholders, and financial institutions as on 31 March.',
    targetEntity: 'All Companies (Private Limited, Public Limited, OPC)',
    statutoryPenalty: 'Fine up to ₹5,000 + ₹500/day for continuing default',
    urgency: 'normal',
    serviceSlug: 'annual-roc-filing'
  },
  {
    id: 'advance-tax-q2',
    dueDate: '15 September 2026',
    formName: 'ITNS 280 (45%)',
    category: 'ITR_TDS',
    title: 'Advance Tax Installment - Q2 (Cumulative 45%)',
    description: 'Second quarterly installment for advance tax liability on corporate profits.',
    targetEntity: 'All Taxable Companies and LLPs',
    statutoryPenalty: '1% per month interest under Section 234C',
    urgency: 'normal',
    serviceSlug: 'corporate-itr'
  },
  {
    id: 'dir3-kyc',
    dueDate: '30 September 2026',
    formName: 'DIR-3 KYC / Web-KYC',
    category: 'ROC',
    title: 'Annual Director Identification Number (DIN) KYC',
    description: 'Mandatory annual personal biometric / OTP verification for every DIN holder to keep DIN active on MCA V3.',
    targetEntity: 'All Directors and Designated Partners with active DIN/DPIN',
    statutoryPenalty: 'DIN Deactivation + ₹5,000 MCA late fee per director for reactivation',
    urgency: 'high',
    serviceSlug: 'director-kyc'
  },
  {
    id: 'llp-form-8',
    dueDate: '30 October 2026',
    formName: 'Form 8 (LLP)',
    category: 'LLP',
    title: 'Statement of Account & Solvency (LLP)',
    description: 'Annual declaration of financial health, balance sheet, and declaration of solvency by designated partners.',
    targetEntity: 'All Registered LLPs',
    statutoryPenalty: '₹100 per day of default under Section 34 of LLP Act',
    urgency: 'high',
    serviceSlug: 'llp-annual-filing'
  },
  {
    id: 'roc-aoc-4',
    dueDate: '30 October 2026',
    formName: 'Form AOC-4',
    category: 'ROC',
    title: 'Filing of Audited Financial Statements with ROC',
    description: 'Statutory submission of balance sheet, profit and loss statement, auditor report, and directors report within 30 days of AGM.',
    targetEntity: 'All Private Limited, Public Limited & Section 8 Companies',
    statutoryPenalty: '₹100 per day continuing penalty + Director disqualification risk',
    urgency: 'high',
    serviceSlug: 'annual-roc-filing'
  },
  {
    id: 'corporate-itr',
    dueDate: '31 October 2026',
    formName: 'ITR-6 (Corporate)',
    category: 'ITR_TDS',
    title: 'Corporate Income Tax Return (Audited Entities)',
    description: 'Annual ITR filing for companies requiring statutory tax audit under Section 44AB of the Income Tax Act.',
    targetEntity: 'All Incorporated Companies',
    statutoryPenalty: '₹5,000 late fee under Section 234F + loss of business loss carryforward',
    urgency: 'high',
    serviceSlug: 'corporate-itr'
  },
  {
    id: 'roc-mgt-7',
    dueDate: '29 November 2026',
    formName: 'Form MGT-7 / MGT-7A',
    category: 'ROC',
    title: 'Annual Return of Company to Registrar of Companies',
    description: 'Comprehensive statutory return containing details of shareholders, board meetings, director remuneration, and transfers.',
    targetEntity: 'All Companies (MGT-7 for Pvt Ltd; MGT-7A for OPC & Small Companies)',
    statutoryPenalty: '₹100 per day of continuing delay under Section 92 of Companies Act 2013',
    urgency: 'high',
    serviceSlug: 'annual-roc-filing'
  }
];

export default function ComplianceCalendarPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = useMemo(() => {
    return STATUTORY_EVENTS_2026.filter((ev) => {
      const matchesCat = selectedCategory === 'all' || ev.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        ev.formName.toLowerCase().includes(q) ||
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.targetEntity.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getCategoryPill = (cat: string) => {
    switch (cat) {
      case 'ROC':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'GST':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'ITR_TDS':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'LLP':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

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
            <span>2026 Statutory Compliance Master Schedule • Updated with Latest MCA V3 Notifications</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Statutory ROC, GST & Tax Due Date Calendar
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Never miss a mandatory government filing. Track all corporate due dates, statutory penalties under the Companies Act 2013, and file seamlessly with our Secretarial Desk.
          </p>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto w-full py-10 px-4 sm:px-6 flex-1">
        {/* Statutory Warning Notice */}
        <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 mb-8 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold uppercase tracking-wide text-amber-950 block">
              MCA Compliance Notice (Section 403 & 92 of Companies Act 2013):
            </span>
            <p className="leading-relaxed">
              Delay in filing annual returns (AOC-4 and MGT-7) incurs a recurring statutory penalty of <strong>₹100 per day of default</strong> with no maximum upper cap. Continued failure triggers director disqualification under Section 164(2) for 5 years.
            </p>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              All Due Dates ({STATUTORY_EVENTS_2026.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('ROC')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === 'ROC'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              MCA / ROC Filings
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('GST')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === 'GST'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              GST Returns
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('ITR_TDS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === 'ITR_TDS'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              ITR & TDS Challans
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('LLP')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === 'LLP'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              LLP Returns
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search form e.g. AOC-4, GSTR-1..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-1.5 px-3 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Due Dates List */}
        <div className="mt-8 space-y-4">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs"
            >
              {/* Left Column: Date & Title */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryPill(ev.category)}`}>
                    {ev.category}
                  </span>
                  <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                    {ev.formName}
                  </span>
                  <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" /> Due: {ev.dueDate}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  {ev.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {ev.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                  <span><strong>Applies to:</strong> {ev.targetEntity}</span>
                </div>
              </div>

              {/* Right Column: Statutory Penalty & Action */}
              <div className="lg:text-right shrink-0 lg:max-w-xs space-y-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-red-600 block flex lg:justify-end items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Statutory Late Penalty:
                  </span>
                  <span className="text-xs font-bold text-slate-800 block">
                    {ev.statutoryPenalty}
                  </span>
                </div>

                <Link
                  href={`/register?service=${ev.serviceSlug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/20 transition cursor-pointer active:scale-95"
                >
                  <span>File with Secretarial Desk</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
