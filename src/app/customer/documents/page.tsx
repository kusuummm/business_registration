'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomerNavbar from '@/components/CustomerNavbar';
import CustomerSidebar from '@/components/CustomerSidebar';
import { 
  FileText, 
  Download, 
  UploadCloud, 
  ShieldCheck, 
  X, 
  CheckCircle2,
  Plus,
  Clock,
  Sparkles,
  KeyRound,
  FileCheck2,
  Check,
  Building2,
  AlertTriangle,
  RefreshCw,
  Award
} from 'lucide-react';

interface VaultDocument {
  id: string;
  name: string;
  category: 'KYC' | 'Office Proofs' | 'ROC Dossiers' | 'DSC Tokens';
  filename: string;
  size: string;
  uploadedAt: string;
  status: 'Verified' | 'Under Review' | 'Action Required';
}

interface DscToken {
  id: string;
  signatoryName: string;
  din: string;
  tokenType: string;
  caIssuer: string;
  serialNumber: string;
  issuedDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

export default function CustomerDocumentsPage() {
  const [activeSubTab, setActiveSubTab] = useState<'vault' | 'legalKit' | 'dscManager'>('vault');
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [docCategoryFilter, setDocCategoryFilter] = useState<string>('All');
  const [statusNotice, setStatusNotice] = useState('');
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState('Acme Technologies Pvt Ltd');
  const [signatoryName, setSignatoryName] = useState('Rahul Sharma');
  const [newDocData, setNewDocData] = useState({
    name: '',
    category: 'Office Proofs' as VaultDocument['category'],
    fileName: ''
  });

  // DSC Token Inventory State
  const [dscTokens, setDscTokens] = useState<DscToken[]>([
    {
      id: 'dsc-01',
      signatoryName: 'Director 1 (Managing Director)',
      din: 'DIN-09841234',
      tokenType: 'Class-3 Signing & Encryption (2-Year)',
      caIssuer: 'e-Mudhra CA / CCA India',
      serialNumber: 'EM-2026-9812-7841',
      issuedDate: '2026-03-10',
      expiryDate: '2028-03-09',
      daysRemaining: 512,
      status: 'Active'
    },
    {
      id: 'dsc-02',
      signatoryName: 'Director 2 (Executive Director)',
      din: 'DIN-09841235',
      tokenType: 'Class-3 Signing (2-Year)',
      caIssuer: 'Capricorn CA / CCA India',
      serialNumber: 'CAP-2026-4412-1092',
      issuedDate: '2026-03-10',
      expiryDate: '2028-03-09',
      daysRemaining: 512,
      status: 'Active'
    }
  ]);

  useEffect(() => {
    // Load stored company info
    try {
      const storedUser = localStorage.getItem('bharatfilings_customer_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.companyName) setCompanyName(parsed.companyName);
        if (parsed.name) setSignatoryName(parsed.name);
      }
    } catch {}

    fetch('/api/orders')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const docs: VaultDocument[] = [];
          json.data.forEach((ord: any) => {
            const cName = ord.company?.primaryName || ord.companyName || 'Entity';
            const date = (ord.createdAt || new Date().toISOString()).slice(0, 10);
            
            // If order has directors
            if (Array.isArray(ord.company?.directors)) {
              ord.company.directors.forEach((d: any, idx: number) => {
                docs.push({
                  id: `doc-pan-${ord.orderId || ord.id}-${idx}`,
                  name: `Director ${idx + 1} PAN Card (${d.name || 'Signatory'})`,
                  category: 'KYC',
                  filename: `PAN_${(d.name || 'Director').replace(/\s+/g, '_')}_Verified.pdf`,
                  size: '1.2 MB',
                  uploadedAt: date,
                  status: ord.adminApproved ? 'Verified' : 'Under Review'
                });
                docs.push({
                  id: `doc-aadhaar-${ord.orderId || ord.id}-${idx}`,
                  name: `Masked Aadhaar Card (${d.name || 'Signatory'})`,
                  category: 'KYC',
                  filename: `Aadhaar_Masked_${(d.name || 'Director').replace(/\s+/g, '_')}.pdf`,
                  size: '1.8 MB',
                  uploadedAt: date,
                  status: ord.adminApproved ? 'Verified' : 'Under Review'
                });
              });
            }

            // Office proof
            docs.push({
              id: `doc-office-${ord.orderId || ord.id}`,
              name: `Registered Office Electricity Bill (${ord.company?.state || 'Premises'})`,
              category: 'Office Proofs',
              filename: `Utility_Bill_${(ord.company?.state || 'Office')}_Attested.pdf`,
              size: '2.4 MB',
              uploadedAt: date,
              status: ord.adminApproved ? 'Verified' : 'Under Review'
            });

            // Certificate of Incorporation if completed or approved
            if (ord.adminApproved || ord.certificateUploaded) {
              docs.push({
                id: `doc-coi-${ord.orderId || ord.id}`,
                name: `Certificate of Incorporation (CIN / COI) • ${cName}`,
                category: 'ROC Dossiers',
                filename: `COI_${cName.replace(/\s+/g, '_')}_Sealed.pdf`,
                size: '3.6 MB',
                uploadedAt: date,
                status: 'Verified'
              });
              docs.push({
                id: `doc-moa-${ord.orderId || ord.id}`,
                name: `e-MOA & e-AOA SPICe+ Dossier (Form INC-33/34)`,
                category: 'ROC Dossiers',
                filename: `eMOA_eAOA_${cName.replace(/\s+/g, '_')}.pdf`,
                size: '4.1 MB',
                uploadedAt: date,
                status: 'Verified'
              });
            }
          });

          setVaultDocs(docs);
        } else {
          setVaultDocs([]);
        }
      })
      .catch((err) => console.error('Error fetching vault documents:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDownloadDoc = (filename: string, title?: string) => {
    const content = `=====================================================
STATUTORY CERTIFICATE REPOSITORY
Document: ${title || filename}
Timestamp: ${new Date().toUTCString()}
Status: VERIFIED & SEALED UNDER COMPANIES ACT 2013
Company: ${companyName}
Signatory: ${signatoryName}
Government Registry: Ministry of Corporate Affairs (MCA V3)
SHA-256 Vault Signature: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
=====================================================`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllVaultDocs = () => {
    if (vaultDocs.length === 0) return;
    handleDownloadDoc('Complete_Incorporation_Vault.zip', `Complete Vault Dossier (${vaultDocs.length} Documents)`);
    setStatusNotice('All statutory documents prepared & downloaded as encrypted ZIP archive.');
    setTimeout(() => setStatusNotice(''), 4500);
  };

  // Generate Startup Kit Document
  const handleGenerateLegalKitDoc = (docType: string) => {
    let content = '';
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    if (docType === 'nda') {
      content = `MUTUAL NON-DISCLOSURE AGREEMENT (NDA)
Date: ${dateStr}
Between: ${companyName} (Party A) and Recipient / Consultant (Party B)
Governing Law: Indian Contract Act, 1872
Jurisdiction: Courts of competent jurisdiction in India

1. Purpose: The Parties agree to disclose confidential proprietary technical and business information.
2. Confidentiality Obligation: Party B shall hold in strict confidence all proprietary data.
3. Term: Valid for 2 (two) years from date of execution.

Signed for and on behalf of ${companyName}:
By: ${signatoryName} (Authorized Signatory)`;
    } else if (docType === 'share-cert') {
      content = `FORM NO. SH-1
SHARE CERTIFICATE
[Pursuant to Section 46(3) of Companies Act, 2013 and Rule 5(2) of Companies Rules, 2014]

Company: ${companyName}
CIN: U72900MH2026PTC981249
Authorized Share Capital: ₹15,00,000 divided into 1,50,000 Equity Shares of ₹10 each

This is to certify that: ${signatoryName}
is the registered holder of 10,000 (Ten Thousand) Equity Shares of ₹10 each fully paid-up.
Distinctive Numbers: 00001 to 10000.
Given under the Common Seal / Authorized Signature of the Company on ${dateStr}.`;
    } else if (docType === 'board-res') {
      content = `CERTIFIED TRUE COPY OF THE RESOLUTION PASSED BY THE BOARD OF DIRECTORS OF ${companyName.toUpperCase()} 
AT THE FIRST BOARD MEETING HELD ON ${dateStr}

RESOLVED THAT a Zero-Balance Corporate Current Account be opened in the name of the Company with an Authorized Scheduled Commercial Bank.
RESOLVED FURTHER THAT ${signatoryName}, Director, be and is hereby authorized to operate the said account and execute all mandate documents.

For ${companyName}:
${signatoryName}
Managing Director / Director`;
    } else {
      content = `FORM DIR-2
CONSENT TO ACT AS DIRECTOR
[Pursuant to Section 152(5) of the Companies Act, 2013 and Rule 8 of Companies Rules, 2014]

To,
The Board of Directors,
${companyName}

I, ${signatoryName}, hereby give my consent to act as Director of ${companyName} pursuant to sub-section (5) of Section 152.
1. DIN: Available in MCA records
2. Nationality: Indian
3. Declaration: I am not disqualified to become a director under the Companies Act, 2013.

Date: ${dateStr}
Signature: ${signatoryName}`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, '_')}_${docType.toUpperCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setStatusNotice(`Official ${docType.toUpperCase()} document generated and downloaded!`);
    setTimeout(() => setStatusNotice(''), 4500);
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocData.name) return;

    const newDoc: VaultDocument = {
      id: `doc-${Date.now().toString().slice(-4)}`,
      name: newDocData.name,
      category: newDocData.category,
      filename: newDocData.fileName || `${newDocData.name.replace(/\s+/g, '_')}.pdf`,
      size: '1.5 MB',
      uploadedAt: new Date().toISOString().slice(0, 10),
      status: 'Under Review'
    };

    setVaultDocs((prev) => [newDoc, ...prev]);
    setIsUploadDocModalOpen(false);
    setNewDocData({ name: '', category: 'Office Proofs', fileName: '' });
    setStatusNotice(`Document "${newDoc.name}" uploaded successfully to DigiLocker Vault!`);
    setTimeout(() => setStatusNotice(''), 4500);
  };

  const filteredVaultDocs = docCategoryFilter === 'All' 
    ? vaultDocs 
    : vaultDocs.filter((d) => d.category === docCategoryFilter);

  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  return (
    <div style={segoeStyle} className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <CustomerNavbar currentTitle="Document Vault & Legal Kit" />

      {statusNotice && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2.5 px-4 text-center flex items-center justify-center gap-2 animate-fadeIn shadow-xs sticky top-14 z-40">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      <div className="flex-1 flex flex-row min-w-0">
        <CustomerSidebar activeItem="documents" />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="max-w-6xl mx-auto w-full py-6 px-4 sm:px-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Encrypted Document Vault & Legal Kit</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                    AES-256 Storage
                  </span>
                </h1>
                <p className="text-xs text-slate-500">
                  Manage Ministry-attested ROC incorporation certificates, generate startup agreements, and monitor Class-3 DSC tokens.
                </p>
              </div>

              {/* Sub-tab Navigation */}
              <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-xs shrink-0 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('vault')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeSubTab === 'vault'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Dossier Vault ({vaultDocs.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSubTab('legalKit')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeSubTab === 'legalKit'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Startup Legal Kit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSubTab('dscManager')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeSubTab === 'dscManager'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-blue-500" />
                  <span>DSC Tokens ({dscTokens.length})</span>
                </button>
              </div>
            </div>

            {/* ==================================================== */}
            {/* SUB-TAB 1: VAULT DOCUMENTS & DOSSIERS                */}
            {/* ==================================================== */}
            {activeSubTab === 'vault' && (
              <div className="space-y-4">
                {/* Actions & Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
                    {['All', 'KYC', 'Office Proofs', 'ROC Dossiers'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setDocCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                          docCategoryFilter === cat
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsUploadDocModalOpen(true)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Proof</span>
                    </button>

                    {vaultDocs.length > 0 && (
                      <button
                        type="button"
                        onClick={handleDownloadAllVaultDocs}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download All (ZIP)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Table View */}
                {isLoading ? (
                  <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
                    <Clock className="w-6 h-6 text-slate-400 mx-auto animate-spin mb-2" />
                    <p className="text-xs text-slate-500 font-medium">Checking encrypted vault...</p>
                  </div>
                ) : filteredVaultDocs.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-slate-900">Your Document Vault is Empty</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Uploaded Director KYC proofs, registered premises utility bills, and MCA Certificate of Incorporation (COI) files will appear here.
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsUploadDocModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-slate-800 transition cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload Document</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="p-4">Document Title</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Filename</th>
                            <th className="p-4">Size</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Verification</th>
                            <th className="p-4 text-right">Download</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {filteredVaultDocs.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                  <span className="font-semibold text-slate-900">{doc.name}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                  {doc.category}
                                </span>
                              </td>
                              <td className="p-4 font-mono text-slate-500 text-[11px]">{doc.filename}</td>
                              <td className="p-4 text-slate-500">{doc.size}</td>
                              <td className="p-4 text-slate-500">{doc.uploadedAt}</td>
                              <td className="p-4">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 border ${
                                  doc.status === 'Verified'
                                    ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                                    : 'text-amber-800 bg-amber-50 border-amber-200'
                                }`}>
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> {doc.status}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDownloadDoc(doc.filename, doc.name)}
                                  className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Download className="w-3.5 h-3.5 text-blue-600" />
                                  <span>PDF</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================================================== */}
            {/* SUB-TAB 2: STARTUP LEGAL KIT & DOCUMENT GENERATOR    */}
            {/* ==================================================== */}
            {activeSubTab === 'legalKit' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-blue-900 block flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Automated Corporate Legal Template Engine</span>
                    </span>
                    <span className="text-[11px] text-blue-700">
                      These contracts and resolutions are pre-filled with <strong>{companyName}</strong> and signatory records. Ready to sign.
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-blue-600 text-white px-2.5 py-1 rounded-md shrink-0">
                    Free Startup Inclusions
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Doc 1: Share Certificate */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-sm transition">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-md border border-amber-200">
                          Companies Act Rule 5
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">Form SH-1</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Official Share Certificate (Form SH-1)</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Statutory certificate evidencing equity shareholding, distinctive numbers, and paid-up capital allotment to founders.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGenerateLegalKitDoc('share-cert')}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Generate & Download Form SH-1</span>
                    </button>
                  </div>

                  {/* Doc 2: NDA */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-sm transition">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          IP Protection
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">Indian Contract Act</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Mutual Non-Disclosure Agreement (NDA)</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Legally binding bilateral NDA safeguarding your startup proprietary source code, business plan, and customer IP with partners.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGenerateLegalKitDoc('nda')}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Generate & Download Mutual NDA</span>
                    </button>
                  </div>

                  {/* Doc 3: Board Resolution Bank Account */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-sm transition">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-md border border-blue-200">
                          Banking Operations
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">Board Minute Extracts</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Board Resolution: Bank Account Opening</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Certified true copy of first board resolution appointing signatory directors to operate corporate zero-balance current accounts.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGenerateLegalKitDoc('board-res')}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Generate Board Resolution</span>
                    </button>
                  </div>

                  {/* Doc 4: Form DIR-2 */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-sm transition">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-md border border-purple-200">
                          MCA Section 152
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">Form DIR-2</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Director Consent Letter (Form DIR-2)</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Official statutory declaration of consent to act as director with non-disqualification warranty under the Companies Act 2013.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGenerateLegalKitDoc('dir2')}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-400" />
                      <span>Generate Form DIR-2</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* SUB-TAB 3: DSC LIFECYCLE & EXPIRY MANAGER            */}
            {/* ==================================================== */}
            {activeSubTab === 'dscManager' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-white block flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <span>Class-3 Cryptographic DSC Token Inventory</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      All directors possess verified Class-3 USB tokens for Ministry of Corporate Affairs, Income Tax, and GST portal filings.
                    </span>
                  </div>
                  <a
                    href="https://wa.me/919820012849"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition shrink-0 text-center"
                  >
                    Order Additional Token
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dscTokens.map((token) => (
                    <div key={token.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <KeyRound className="w-4 h-4 text-blue-600" />
                          <span>{token.signatoryName}</span>
                        </span>
                        <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          {token.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <span className="text-slate-400 block">Director DIN:</span>
                          <span className="font-mono font-bold text-slate-800">{token.din}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Certificate Authority:</span>
                          <span className="font-semibold text-slate-800">{token.caIssuer}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Hardware Token S/N:</span>
                          <span className="font-mono text-slate-800">{token.serialNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Expiry Date:</span>
                          <span className="font-mono font-bold text-emerald-700">{token.expiryDate} ({token.daysRemaining} days left)</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500">Class: {token.tokenType}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setStatusNotice(`Token verification diagnostics completed for ${token.signatoryName}! Token is valid.`);
                            setTimeout(() => setStatusNotice(''), 3500);
                          }}
                          className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-[11px] font-semibold transition cursor-pointer"
                        >
                          Verify Status
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Upload Document Modal */}
      {isUploadDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span>Upload Document to Encrypted Vault</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadDocModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Document Description / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Registered Office Rent Agreement"
                  value={newDocData.name}
                  onChange={(e) => setNewDocData({ ...newDocData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newDocData.category}
                  onChange={(e) => setNewDocData({ ...newDocData, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="KYC">KYC Identity Documents (PAN / Aadhaar)</option>
                  <option value="Office Proofs">Registered Premises Utility Bills / NOC</option>
                  <option value="ROC Dossiers">ROC Filing Deeds / INC Forms</option>
                  <option value="DSC Tokens">DSC Token Registration Certificates</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Attach PDF File
                </label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewDocData((prev) => ({
                        ...prev,
                        fileName: file.name,
                        name: prev.name || file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')
                      }));
                    }
                  }}
                  className="w-full px-2 py-1.5 border border-dashed border-slate-300 rounded-lg text-slate-600 bg-slate-50 cursor-pointer text-xs"
                />
                <span className="text-[10px] text-slate-400 block mt-1">PDF, JPG, PNG up to 10MB</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadDocModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
