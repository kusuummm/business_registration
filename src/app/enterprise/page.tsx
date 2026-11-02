'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { 
  Building2, 
  Radio, 
  Landmark, 
  Activity, 
  Recycle, 
  ShieldCheck, 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Download, 
  Sparkles, 
  Briefcase,
  Layers,
  ChevronRight,
  Clock
} from 'lucide-react';

interface EnterpriseService {
  id: string;
  category: string;
  title: string;
  department: string;
  aovRange: string;
  turnaroundTime: string;
  minNetWorth: string;
  bankGuarantee: string;
  description: string;
  statutoryChecklist: string[];
  keyDeliverable: string;
}

const ENTERPRISE_SERVICES: EnterpriseService[] = [
  {
    id: 'dot-isp',
    category: 'Telecom & Networks',
    title: 'DoT Unified License (ISP / VNO Telecom)',
    department: 'Department of Telecommunications (DoT), Sanchar Bhawan',
    aovRange: '₹85,000 – ₹1,80,000',
    turnaroundTime: '45–60 Working Days',
    minNetWorth: '₹2.5 Crore (Category A) / ₹50 Lakhs (Category B)',
    bankGuarantee: 'Performance Bank Guarantee (PBG) & Financial BG as per DoT norms',
    description: 'Mandatory statutory authorization for Internet Service Providers (ISP) and Virtual Network Operators (VNO) for high-speed fiber, broadband, and telecom operations across Pan-India or State circles.',
    statutoryChecklist: [
      'Private Limited or Public Limited Company under Companies Act 2013',
      'FDI Approval dossier under Automatic / Approval Route',
      'Certified Net Worth Certificate from practicing Chartered Accountant',
      'Detailed Network Architecture & Point-of-Presence (PoP) layout',
      'SARAL SANCHAR Department Portal Online Application with Cryptographic DSC'
    ],
    keyDeliverable: 'Official Department of Telecom 20-Year Authorization Letter & Security Clearance'
  },
  {
    id: 'rbi-nbfc',
    category: 'Banking & NBFC',
    title: 'RBI Non-Banking Financial Company (NBFC-ND)',
    department: 'Reserve Bank of India (RBI), Department of Non-Banking Supervision',
    aovRange: '₹2,50,000 – ₹4,50,000',
    turnaroundTime: '90–120 Working Days',
    minNetWorth: '₹10 Crore Net Owned Funds (NOF) in unencumbered fixed deposits',
    bankGuarantee: 'Statutory Capital Escrow Account with Scheduled Commercial Bank',
    description: 'Full regulatory setup, business plan preparation, CIBIL background vetting, and compliance dossier for Investment and Credit Companies (NBFC-ICC) seeking Section 45-IA registration.',
    statutoryChecklist: [
      'Minimum ₹10 Crore Net Owned Funds (NOF) deposited in bank escrow',
      'Clean CIBIL track record & Fit and Proper Director criteria',
      '3-Year Viable Financial Projections & Credit Underwriting Business Plan',
      'RBI SARAMS V2 Portal Filing with Corporate Secretary Verification',
      'Bankers Confidential Report on Financial Standing'
    ],
    keyDeliverable: 'RBI Certificate of Registration (CoR) to commence non-banking lending business'
  },
  {
    id: 'cdsco-medical',
    category: 'Healthcare & Pharma',
    title: 'CDSCO Medical Device & In-Vitro Diagnostic (IVD) License',
    department: 'Central Drugs Standard Control Organization (CDSCO), Ministry of Health',
    aovRange: '₹55,000 – ₹1,20,000',
    turnaroundTime: '30–45 Working Days',
    minNetWorth: 'Valid Wholesale Drug License / Device Import Dossier',
    bankGuarantee: 'N/A (Testing & Statutory Audit Fees Applicable)',
    description: 'Regulatory marketing authorization and import permits (Form MD-14 / MD-15) for Class A, B, C, and D medical equipment, diagnostic consumables, and cosmetic formulation dossiers under Medical Device Rules 2017.',
    statutoryChecklist: [
      'ISO 13485:2016 Certified Quality Management System (QMS)',
      'Device Master File (DMF) & Plant Master File (PMF)',
      'Free Sale Certificate (FSC) from National Regulatory Authority',
      'SUGAM CDSCO Portal Filing with Registered Authorized Indian Agent',
      'Biocompatibility and Clinical Performance Evaluation Reports'
    ],
    keyDeliverable: 'Form MD-15 Import License / Wholesale Device Sale Approval'
  },
  {
    id: 'cpcb-epr',
    category: 'Sustainability & ESG',
    title: 'CPCB Extended Producer Responsibility (EPR) Certificate',
    department: 'Central Pollution Control Board (CPCB), MoEFCC',
    aovRange: '₹45,000 – ₹95,000',
    turnaroundTime: '20–30 Working Days',
    minNetWorth: 'Valid Import-Export Code (IEC) & State PCB Consent to Operate',
    bankGuarantee: 'Annual Waste Collection & Recycler Escrow Tie-Up',
    description: 'Statutory compliance for Producers, Importers, and Brand Owners (PIBOs) handling Plastic Packaging Waste, E-Waste (Electronic Equipment), and Battery Waste under national EPR guidelines.',
    statutoryChecklist: [
      'Audited Annual Procurement Volume of Packaging & Electric Materials',
      'CPCB National Portal Online Filing with State PCB CTE/CTO proofs',
      'Formal Agreement with CPCB Authorized Recyclers and Waste Collectors',
      'Action Plan for Recycling Targets & Reverse Logistics Protocol'
    ],
    keyDeliverable: 'CPCB Central Extended Producer Responsibility Registration Certificate'
  }
];

export default function EnterpriseLicensingPage() {
  const [selectedService, setSelectedService] = useState<EnterpriseService>(ENTERPRISE_SERVICES[0]);
  const [ispCircle, setIspCircle] = useState<'A' | 'B' | 'C'>('B');
  const [companyStatus, setCompanyStatus] = useState('Pvt Ltd Incorporated');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dynamic ISP Fee and BG Calculator
  const ispCalculations = useMemo(() => {
    let entryFee = 1500000; // Cat A (National)
    let pbg = 2000000;
    let minNetWorth = 25000000;
    let profFee = '₹1,50,000';

    if (ispCircle === 'B') {
      entryFee = 300000; // Cat B (State / Telecom Circle)
      pbg = 1000000;
      minNetWorth = 5000000;
      profFee = '₹85,000';
    } else if (ispCircle === 'C') {
      entryFee = 40000; // Cat C (Secondary Switching Area)
      pbg = 200000;
      minNetWorth = 1000000;
      profFee = '₹60,000';
    }

    return {
      entryFee: entryFee.toLocaleString('en-IN'),
      pbg: pbg.toLocaleString('en-IN'),
      minNetWorth: minNetWorth.toLocaleString('en-IN'),
      profFee
    };
  }, [ispCircle]);

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0B1528] via-[#101F3C] to-[#0A1324] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>RegistrationWala-Tier Enterprise Regulatory Practice</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
            High-Ticket Regulatory Licensing & Statutory Enterprise Desk
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-3 leading-relaxed">
            Direct counsel, net-worth audits, and ministry liaison for telecom operators, non-banking financial institutions, pharmaceutical importers, and corporate PIBOs.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-white/10 max-w-4xl text-left">
            <div>
              <span className="text-xl sm:text-2xl font-black text-amber-400">₹2.5 Cr+</span>
              <p className="text-xs text-slate-400 mt-0.5">Telecom Net-Worth Audits</p>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-blue-400">DoT & SARAL</span>
              <p className="text-xs text-slate-400 mt-0.5">Direct Sanchar Bhawan Desk</p>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">100% Escrow</span>
              <p className="text-xs text-slate-400 mt-0.5">Milestone SLA Security</p>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-purple-400">FCS Officers</span>
              <p className="text-xs text-slate-400 mt-0.5">Fellow Secretarial Oversight</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Workbench */}
      <main className="max-w-7xl mx-auto w-full py-10 px-4 sm:px-6 lg:px-8 flex-1">
        
        {/* Navigation Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
          {ENTERPRISE_SERVICES.map((srv) => (
            <button
              key={srv.id}
              onClick={() => {
                setSelectedService(srv);
                setSubmitSuccess(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                selectedService.id === srv.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {srv.id === 'dot-isp' && <Radio className="w-3.5 h-3.5" />}
              {srv.id === 'rbi-nbfc' && <Landmark className="w-3.5 h-3.5" />}
              {srv.id === 'cdsco-medical' && <Activity className="w-3.5 h-3.5" />}
              {srv.id === 'cpcb-epr' && <Recycle className="w-3.5 h-3.5" />}
              <span>{srv.title.split('(')[0]}</span>
            </button>
          ))}
        </div>

        {/* Detailed Service Dossier & Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 7 Columns: Dossier Requirements & Statutory Checklist */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                {selectedService.category} • {selectedService.department}
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {selectedService.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedService.description}
              </p>
            </div>

            {/* Financial Parameters Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Turnaround Time</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {selectedService.turnaroundTime}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Average Professional Fee</span>
                <span className="font-bold text-slate-900 font-mono text-emerald-700">{selectedService.aovRange}</span>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Mandatory Net-Worth Threshold</span>
                <span className="font-bold text-slate-800">{selectedService.minNetWorth}</span>
              </div>
            </div>

            {/* Dynamic DoT ISP Circle & Bank Guarantee Calculator (If DoT Selected) */}
            {selectedService.id === 'dot-isp' && (
              <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-700" />
                    <h4 className="font-bold text-xs text-blue-950 uppercase tracking-wide">
                      Interactive DoT Circle & Statutory BG Calculator
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded">
                    Sanchar Bhawan 2026 Norms
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setIspCircle('A')}
                    className={`p-2.5 rounded-lg border text-center transition cursor-pointer ${
                      ispCircle === 'A'
                        ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 font-medium'
                    }`}
                  >
                    <span className="block text-xs">Category A</span>
                    <span className="text-[10px] opacity-80">All-India Metro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIspCircle('B')}
                    className={`p-2.5 rounded-lg border text-center transition cursor-pointer ${
                      ispCircle === 'B'
                        ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 font-medium'
                    }`}
                  >
                    <span className="block text-xs">Category B</span>
                    <span className="text-[10px] opacity-80">Telecom Circle / State</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIspCircle('C')}
                    className={`p-2.5 rounded-lg border text-center transition cursor-pointer ${
                      ispCircle === 'C'
                        ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 font-medium'
                    }`}
                  >
                    <span className="block text-xs">Category C</span>
                    <span className="text-[10px] opacity-80">Secondary Switching</span>
                  </button>
                </div>

                {/* Calculation Receipt */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-blue-200/60">
                  <div>
                    <span className="text-[10px] text-blue-800 uppercase font-semibold block">Non-Refundable Entry Fee:</span>
                    <span className="font-mono font-bold text-slate-900">₹{ispCalculations.entryFee}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-800 uppercase font-semibold block">Performance Bank Guarantee:</span>
                    <span className="font-mono font-bold text-slate-900">₹{ispCalculations.pbg}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-800 uppercase font-semibold block">Min. Paid-Up Capital / Net Worth:</span>
                    <span className="font-mono font-bold text-slate-900">₹{ispCalculations.minNetWorth}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-800 uppercase font-semibold block">Statutory Advisory Fee:</span>
                    <span className="font-mono font-bold text-emerald-700">{ispCalculations.profFee}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Statutory Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Mandatory Regulatory Prerequisites & Submission Dossier:
              </h4>
              <ul className="space-y-2 text-xs">
                {selectedService.statutoryChecklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Deliverable Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950 block">Official Department Certificate Deliverable:</span>
                <p className="text-[11px] text-amber-800 mt-0.5">{selectedService.keyDeliverable}</p>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Request Scope Dossier & Consultation Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 sticky top-24">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold mb-2">
                <Briefcase className="w-3 h-3 text-emerald-600" />
                <span>Senior Regulatory Partner Allocation</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Request Scope Dossier & Quotation
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Speak directly with an ex-ministry consultant or Fellow Company Secretary.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-950">Dossier Request Registered</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  A Senior Associate from our {selectedService.category} practice will call you within 3 business hours with a formal proforma and checklist.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold mt-2"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company / Entity Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FiberNet Telecom Pvt Ltd"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold outline-none focus:border-blue-600 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Entity Incorporation Standing</label>
                  <select
                    value={companyStatus}
                    onChange={(e) => setCompanyStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold outline-none focus:border-blue-600 text-xs"
                  >
                    <option value="Pvt Ltd Incorporated">Private Limited Company (Active)</option>
                    <option value="Public Limited">Public Limited Company</option>
                    <option value="LLP">Limited Liability Partnership (LLP)</option>
                    <option value="Proposed New Entity">Incorporation Pending (Need Joint Package)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contact Person</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Director Name"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold outline-none focus:border-blue-600 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Direct Mobile</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold outline-none focus:border-blue-600 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Corporate Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="director@company.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold outline-none focus:border-blue-600 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Dossier...</span>
                  ) : (
                    <>
                      <span>Request Dossier & NDA Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  🔒 Strictly Confidential. All proprietary net-worth figures protected under Non-Disclosure Agreement (NDA).
                </p>
              </form>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                Enterprise Advisory Hotline:
              </span>
              <p className="text-slate-600 font-mono text-[11px]">1800-889-2244 (Ext. 4 - Enterprise)</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
