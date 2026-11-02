'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Printer, 
  Download, 
  Scale, 
  Building2, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';

type AgreementType = 'founders' | 'nda' | 'terms_privacy' | 'contractor' | 'employment';

export default function ContractsStudioPage() {
  const [agreementType, setAgreementType] = useState<AgreementType>('founders');
  const [copied, setCopied] = useState(false);

  // Common Form State
  const [effectiveDate, setEffectiveDate] = useState('01 November 2026');
  const [companyName, setCompanyName] = useState('Acme Technologies Private Limited');
  const [stateJurisdiction, setStateJurisdiction] = useState('Karnataka');
  const [governingCity, setGoverningCity] = useState('Bengaluru');

  // Founders Agreement State
  const [founder1Name, setFounder1Name] = useState('Aarav Sharma');
  const [founder1Equity, setFounder1Equity] = useState(60);
  const [founder2Name, setFounder2Name] = useState('Pooja Patel');
  const [founder2Equity, setFounder2Equity] = useState(40);
  const [vestingPeriodYears, setVestingPeriodYears] = useState(4);
  const [cliffMonths, setCliffMonths] = useState(12);

  // NDA State
  const [disclosingParty, setDisclosingParty] = useState('Acme Technologies Private Limited');
  const [receivingParty, setReceivingParty] = useState('NexGen Innovations LLP');
  const [ndaDurationYears, setNdaDurationYears] = useState(2);
  const [purpose, setPurpose] = useState('evaluating a strategic B2B software partnership');

  // Contractor State
  const [contractorName, setContractorName] = useState('Vikram Verma');
  const [contractorRole, setContractorRole] = useState('Senior Full-Stack Cloud Consultant');
  const [contractorFee, setContractorFee] = useState(150000);
  const [noticeDays, setNoticeDays] = useState(15);

  // Employment State
  const [employeeName, setEmployeeName] = useState('Rohan Sen');
  const [employeeDesignation, setEmployeeDesignation] = useState('Product Lead');
  const [annualCtc, setAnnualCtc] = useState(1800000);
  const [probationMonths, setProbationMonths] = useState(3);

  // Generate dynamic legal text based on agreement type
  const generateLegalText = () => {
    switch (agreementType) {
      case 'founders':
        return `CO-FOUNDERS' RESTRICTIVE COVENANT & EQUITY VESTING AGREEMENT

THIS CO-FOUNDERS' AGREEMENT (the "Agreement") is entered into on this ${effectiveDate}, by and between:

1. ${founder1Name}, residing in India (hereinafter referred to as "Founder 1", which expression shall include their legal heirs and assigns); and
2. ${founder2Name}, residing in India (hereinafter referred to as "Founder 2", which expression shall include their legal heirs and assigns).

Individually referred to as a "Founder" and collectively as the "Founders", with respect to the equity ownership, governance, and IP assignment of ${companyName} (the "Company").

WHEREAS:
A. The Founders have conceived, developed, and agreed to launch a technology and commercial business under the name and style of ${companyName}.
B. The Founders desire to record their mutual rights, equity allocation, reverse vesting schedules, and intellectual property assignments under Indian corporate law.

NOW, THEREFORE, IN CONSIDERATION OF MUTUAL PROMISES AND STATUTORY CONSIDERATION, THE PARTIES AGREE AS FOLLOWS:

1. EQUITY SHAREHOLDING & CAPITALIZATION
1.1 The initial authorized and issued share capital of the Company shall be divided among the Founders as follows:
    - ${founder1Name}: ${founder1Equity}% (${founder1Equity * 100} Equity Shares)
    - ${founder2Name}: ${founder2Equity}% (${founder2Equity * 100} Equity Shares)
    Total: 100% Equity Ownership.

2. REVERSE VESTING SCHEDULE & CLIFF
2.1 All equity shares held by the Founders shall be subject to a ${vestingPeriodYears}-year vesting schedule with a mandatory ${cliffMonths}-month cliff period starting from ${effectiveDate}.
2.2 If a Founder ceases to provide active executive services before the expiration of the ${cliffMonths}-month cliff, 100% of their unvested shares shall be repurchased by the Company at nominal face value (₹10 per share).
2.3 Following the cliff, the remaining shares shall vest in equal monthly installments over the remaining ${vestingPeriodYears * 12 - cliffMonths} months.

3. COMPLETE ASSIGNMENT OF INTELLECTUAL PROPERTY
3.1 Each Founder hereby unconditionally and irrevocably assigns, transfers, and conveys to ${companyName} all worldwide right, title, and interest in and to all software code, inventions, patentable designs, trademarks, trade secrets, and domain names developed prior to or during the term of this Agreement.
3.2 In accordance with Section 19(4) of the Indian Copyright Act, 1957, the assignment shall not lapse in the event the Company does not exercise the rights within one year.

4. NON-COMPETE AND NON-SOLICITATION
4.1 During the term of this Agreement and for a period of twelve (12) months following departure, no Founder shall directly or indirectly engage in, advise, or invest in any competing commercial entity within India.
4.2 Neither Founder shall solicit, hire, or induce any employee, engineer, or contractor of the Company to terminate their engagement.

5. GOVERNING LAW AND DISPUTE RESOLUTION
5.1 This Agreement shall be governed by and construed in accordance with the substantive laws of the Republic of India.
5.2 Any dispute arising out of this Agreement shall be referred to sole arbitration seated in ${governingCity}, ${stateJurisdiction}, in accordance with the Arbitration and Conciliation Act, 1996. The Courts of ${governingCity} shall have exclusive territorial jurisdiction.

IN WITNESS WHEREOF, the Founders have executed this Agreement on the date first written above.


___________________________                    ___________________________
${founder1Name}                                ${founder2Name}
Founder 1 (Signature)                          Founder 2 (Signature)
Date: ${effectiveDate}                         Date: ${effectiveDate}

WITNESS 1:                                     WITNESS 2:
Name: ______________________                   Name: ______________________
Signature: _________________                   Signature: _________________`;

      case 'nda':
        return `MUTUAL NON-DISCLOSURE & PROPRIETARY INFORMATION AGREEMENT

THIS NON-DISCLOSURE AGREEMENT (the "Agreement") is entered into on ${effectiveDate}, by and between:

DISCLOSING PARTY:
${disclosingParty}, a commercial enterprise having its principal place of business in India; and

RECEIVING PARTY:
${receivingParty}, a commercial entity organized under the laws of India.

Collectively referred to as the "Parties" and individually as a "Party".

1. PURPOSE OF DISCLOSURE
The Parties intend to disclose confidential business plans, proprietary software architectures, commercial models, and customer data solely for the purpose of: ${purpose} (the "Permitted Purpose").

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means all non-public technical, algorithmic, operational, financial, and legal information disclosed by either Party, whether orally, in writing, electronically, or through inspection of software repositories, source code, and premises.

3. NON-DISCLOSURE OBLIGATIONS
The Receiving Party agrees:
a) To hold the Disclosing Party's Confidential Information in strictest confidence and exercise the same degree of care (not less than reasonable care) as it uses for its own confidential assets;
b) Not to disclose such information to any third party without prior written consent, except to employees, directors, and legal advisors with a strict "need to know";
c) Not to reverse engineer, decompile, or copy any source code, database architectures, or proprietary protocols.

4. EXCLUSIONS FROM CONFIDENTIALITY
Confidentiality obligations shall not apply to information that:
a) Is or becomes publicly available through no breach of this Agreement;
b) Was already lawfully in the possession of the Receiving Party prior to disclosure;
c) Is required to be disclosed by order of a competent court or statutory authority, provided prompt written notice is given to the Disclosing Party.

5. DURATION OF OBLIGATION
The obligations under this Agreement shall endure for a term of ${ndaDurationYears} (${ndaDurationYears === 1 ? 'One' : 'Two'}) years from the date of disclosure.

6. GOVERNING LAW & JURISDICTION
This Agreement shall be governed by the laws of India. The courts of ${governingCity}, ${stateJurisdiction} shall have exclusive jurisdiction over all claims arising hereunder.

IN WITNESS WHEREOF, the Parties have executed this Mutual Non-Disclosure Agreement as of the Effective Date.


FOR ${disclosingParty}:                        FOR ${receivingParty}:
By: ___________________________                By: ___________________________
Authorized Signatory                           Authorized Signatory
Designation: Director                          Designation: Managing Partner`;

      case 'terms_privacy':
        return `WEBSITE TERMS OF SERVICE & DPDP ACT 2023 PRIVACY POLICY

LAST UPDATED: ${effectiveDate}
PLATFORM OPERATOR: ${companyName}
HEADQUARTERS: ${governingCity}, ${stateJurisdiction}, India

PART 1: TERMS OF SERVICE (USER AGREEMENT)
1. ACCEPTANCE OF TERMS
By accessing or using the web portals, APIs, or mobile applications operated by ${companyName} (the "Company", "we", "us"), you agree to be bound by these Terms of Service. If you do not agree, you must immediately terminate platform access.

2. SERVICES OFFERED & STATUTORY DISCLAIMER
2.1 The platform provides software tools, statutory compliance calculators, and facilitation of corporate filings with government bodies like the Ministry of Corporate Affairs (MCA) and GSTN.
2.2 The platform is an independent corporate secretarial facilitation platform and not a sovereign government department. Government filing fees are remitted directly to State and Central Treasuries.

3. INTELLECTUAL PROPERTY
All logos, algorithms, user interface designs, and proprietary software code are the exclusive property of ${companyName} protected under the Indian Copyright Act, 1957.

PART 2: PRIVACY POLICY (DIGITAL PERSONAL DATA PROTECTION ACT, 2023 COMPLIANT)
4. DATA WE COLLECT & STATUTORY PURPOSE
We collect personal identification data (PAN, masked Aadhaar, director DIN, corporate email, mobile phone) solely for:
a) Fulfilling MCA SPICe+ company registrations and GST registrations;
b) Generating sovereign KYC dossiers and filing challans;
c) Complying with Prevention of Money Laundering Act (PMLA) regulations.

5. CONSENT & AUTOMATED AADHAAR MASKING
In strict compliance with UIDAI guidelines and the Digital Personal Data Protection Act, 2023 (DPDP Act):
a) The first eight (8) digits of Aadhaar numbers are automatically masked;
b) User data is stored in encrypted relational vaults with AES-256 encryption at rest;
c) Personal data is never sold, leased, or rented to third-party telemarketers.

6. GRIEVANCE REDRESSAL OFFICER
Under the Information Technology (Intermediary Guidelines) Rules, 2021:
Grievance Officer: Compliance Legal Desk, ${companyName}
Official Email: privacy@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
Jurisdiction: ${governingCity}, ${stateJurisdiction}, India.`;

      case 'contractor':
        return `INDEPENDENT CONTRACTOR & PROFESSIONAL CONSULTING AGREEMENT

THIS CONTRACTOR AGREEMENT is made on this ${effectiveDate}, between:

CLIENT: ${companyName}, having its registered office in ${governingCity}, ${stateJurisdiction}; and
CONTRACTOR: ${contractorName}, an independent specialist residing in India.

1. SCOPE OF SERVICES
The Client engages the Contractor to render professional consulting services as: ${contractorRole}. Deliverables shall be provided in accordance with agreed technical milestones.

2. INDEPENDENT CONTRACTOR STATUS
The Contractor shall perform all services as an independent contractor and not as an employee, agent, or partner of the Client. The Contractor shall not be entitled to statutory PF, ESIC, or gratuity benefits.

3. COMPENSATION & PROFESSIONAL FEES
3.1 The Client shall pay the Contractor a professional fee of ₹${contractorFee.toLocaleString('en-IN')} per month upon approval of deliverables.
3.2 The Client shall deduct applicable Tax Deducted at Source (TDS) under Section 194J of the Income Tax Act, 1961, and furnish Form 16A quarterly.

4. WORK FOR HIRE & IP ASSIGNMENT
All software codes, architectures, graphic assets, and technical documentation produced by the Contractor shall be considered "work made for hire" and shall instantly become the sole and exclusive property of ${companyName}.

5. TERMINATION & NOTICE
Either party may terminate this Agreement without cause by providing a minimum of ${noticeDays} days written notice.

6. GOVERNING LAW
This Agreement shall be governed by the laws of India, with exclusive jurisdiction in ${governingCity}, ${stateJurisdiction}.

SIGNED AND EXECUTED:


FOR CLIENT (${companyName}):                   FOR CONTRACTOR:
___________________________                    ___________________________
Authorized Representative                      ${contractorName}
Date: ${effectiveDate}                         Date: ${effectiveDate}`;

      case 'employment':
        return `EMPLOYMENT OFFER & PROPRIETARY RIGHTS AGREEMENT

DATE: ${effectiveDate}
TO: ${employeeName}
POSITION: ${employeeDesignation}
COMPANY: ${companyName}

Dear ${employeeName},

On behalf of ${companyName}, we are pleased to offer you full-time employment as ${employeeDesignation} on the following terms:

1. COMMENCEMENT & PROBATION
Your employment will commence on ${effectiveDate}. You will serve an initial probation period of ${probationMonths} months, during which performance shall be evaluated.

2. REMUNERATION (CTC)
Your Total Cost to Company (CTC) shall be ₹${annualCtc.toLocaleString('en-IN')} per annum, subject to statutory deductions (Employee Provident Fund u/s EPF Act, Professional Tax, and Income Tax TDS u/s 192).

3. CONFIDENTIALITY & IP ASSIGNMENT
You acknowledge that all inventions, algorithms, designs, customer databases, and software created during your working hours belong unconditionally and exclusively to ${companyName}.

4. NOTICE PERIOD
Following probation confirmation, employment may be terminated by either party upon giving thirty (30) days written notice or payment of basic salary in lieu thereof.

Please sign and return the duplicate copy of this letter as confirmation of your acceptance.


FOR ${companyName}:                            ACCEPTED & AGREED:
___________________________                    ___________________________
HR & Legal Counsel                             ${employeeName}
Date: ${effectiveDate}                         Date: ${effectiveDate}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateLegalText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-white border-b border-slate-200 py-10 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Legal Studio • Compliant with Indian Contract Act 1872 & DPDP 2023</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Self-Serve Legal Agreement & Contract Studio
          </h1>

          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Generate legally vetted, enforceable agreements in seconds. Complete with equity vesting, reverse covenants, and dispute resolution clauses tailored for Indian startups.
          </p>
        </div>
      </section>

      {/* Main Studio Container */}
      <main className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 flex-1 space-y-6">
        {/* Template Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: 'founders', label: "Co-Founders' Agreement", icon: Users },
            { id: 'nda', label: 'Mutual NDA Agreement', icon: ShieldCheck },
            { id: 'terms_privacy', label: 'Terms of Service & DPDP Policy', icon: Scale },
            { id: 'contractor', label: 'Freelancer / Contractor Agreement', icon: FileText },
            { id: 'employment', label: 'Employment Offer & IP Contract', icon: Building2 }
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = agreementType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setAgreementType(t.id as AgreementType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Studio: Left Configuration / Right Live Document */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Questionnaire */}
          <div className="lg:col-span-5 space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Contract Variables</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-500 uppercase">
                Instant Live Render
              </span>
            </div>

            {/* Common Inputs */}
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Entity Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Governing City</label>
                  <input
                    type="text"
                    value={governingCity}
                    onChange={(e) => setGoverningCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State Jurisdiction</label>
                  <input
                    type="text"
                    value={stateJurisdiction}
                    onChange={(e) => setStateJurisdiction(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Effective Date</label>
                <input
                  type="text"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Template Specific Inputs */}
            <div className="pt-3 border-t border-slate-100 space-y-3.5 text-xs">
              {agreementType === 'founders' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Founder 1 Name</label>
                      <input
                        type="text"
                        value={founder1Name}
                        onChange={(e) => setFounder1Name(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Founder 1 Equity (%)</label>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={founder1Equity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setFounder1Equity(val);
                          setFounder2Equity(100 - val);
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Founder 2 Name</label>
                      <input
                        type="text"
                        value={founder2Name}
                        onChange={(e) => setFounder2Name(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Founder 2 Equity (%)</label>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={founder2Equity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setFounder2Equity(val);
                          setFounder1Equity(100 - val);
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Vesting (Years)</label>
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={vestingPeriodYears}
                        onChange={(e) => setVestingPeriodYears(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Cliff Period (Months)</label>
                      <input
                        type="number"
                        min={0}
                        max={24}
                        value={cliffMonths}
                        onChange={(e) => setCliffMonths(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {agreementType === 'nda' && (
                <>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Disclosing Party</label>
                    <input
                      type="text"
                      value={disclosingParty}
                      onChange={(e) => setDisclosingParty(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Receiving Party</label>
                    <input
                      type="text"
                      value={receivingParty}
                      onChange={(e) => setReceivingParty(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Permitted Purpose</label>
                    <input
                      type="text"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Confidentiality Term (Years)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={ndaDurationYears}
                      onChange={(e) => setNdaDurationYears(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </>
              )}

              {agreementType === 'contractor' && (
                <>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contractor Full Name</label>
                    <input
                      type="text"
                      value={contractorName}
                      onChange={(e) => setContractorName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contractor Role / Title</label>
                    <input
                      type="text"
                      value={contractorRole}
                      onChange={(e) => setContractorRole(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Monthly Fee (₹)</label>
                      <input
                        type="number"
                        step={5000}
                        value={contractorFee}
                        onChange={(e) => setContractorFee(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Notice Days</label>
                      <input
                        type="number"
                        min={0}
                        max={60}
                        value={noticeDays}
                        onChange={(e) => setNoticeDays(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {agreementType === 'employment' && (
                <>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Employee Full Name</label>
                    <input
                      type="text"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Designation</label>
                    <input
                      type="text"
                      value={employeeDesignation}
                      onChange={(e) => setEmployeeDesignation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Annual CTC (₹)</label>
                      <input
                        type="number"
                        step={50000}
                        value={annualCtc}
                        onChange={(e) => setAnnualCtc(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Probation (Months)</label>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={probationMonths}
                        onChange={(e) => setProbationMonths(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Live Rendered Legal Document */}
          <div className="lg:col-span-7 space-y-4">
            {/* Action Bar */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Enforceable Indian Legal Draft</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
              </div>
            </div>

            {/* Simulated Legal Paper Document */}
            <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-sm font-serif text-slate-900 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap selection:bg-blue-100">
              {/* Simulated Non-Judicial Stamp Paper Header */}
              <div className="mb-8 p-4 border-2 border-dashed border-amber-300 rounded-xl bg-amber-50/50 text-center text-xs font-sans text-amber-900 space-y-1">
                <span className="font-black uppercase tracking-wider block text-[11px]">
                  [NON-JUDICIAL STAMP PAPER OR STATUTORY E-STAMP HEADER]
                </span>
                <p className="text-[11px] text-amber-800">
                  Execute on e-Stamp of appropriate value as per {stateJurisdiction} Stamp Act before execution.
                </p>
              </div>

              {generateLegalText()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
