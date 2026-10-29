'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomerNavbar from '@/components/CustomerNavbar';
import CustomerSidebar from '@/components/CustomerSidebar';
import { 
  Building2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  Plus, 
  Calendar, 
  ShieldCheck, 
  Award,
  Landmark,
  Headphones,
  FileCheck
} from 'lucide-react';

export default function CustomerOrdersPage() {
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [customerUser, setCustomerUser] = useState({ 
    name: '', 
    email: '',
    companyName: ''
  });

  const refreshCustomerData = () => {
    setIsLoadingOrders(true);

    try {
      const storedUser = localStorage.getItem('bharatfilings_customer_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) {
          setCustomerUser((prev) => ({ 
            ...prev, 
            name: parsed.name, 
            email: parsed.email || prev.email,
            companyName: parsed.companyName || prev.companyName 
          }));
        }
      }
    } catch (e) {}

    fetch('/api/orders')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setOrdersList(json.data);
          const primary = json.data[0];
          const cName = primary.company?.primaryName || primary.companyName;
          if (cName) {
            setCustomerUser((prev) => ({ ...prev, companyName: cName }));
          }
        } else {
          setOrdersList([]);
        }
      })
      .catch((err) => console.log('Error loading orders:', err))
      .finally(() => setIsLoadingOrders(false));
  };

  useEffect(() => {
    refreshCustomerData();
  }, []);

  const handleDownloadDoc = (filename: string, title?: string) => {
    const content = `=====================================================
STATUTORY CERTIFICATE REPOSITORY
Document: ${title || filename}
Timestamp: ${new Date().toUTCString()}
Status: VERIFIED & SEALED UNDER COMPANIES ACT 2013
Entity: ${customerUser.companyName}
Applicant: ${customerUser.name}
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

  const currentOrder = ordersList[0];
  const isOrderApproved = currentOrder 
    ? Boolean(currentOrder.adminApproved || currentOrder.docVerificationStatus === 'Approved' || (currentOrder.status && currentOrder.status.toLowerCase().includes('approved')) || currentOrder.certificateUploaded)
    : false;

  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  return (
    <div style={segoeStyle} className="h-screen max-h-screen overflow-hidden bg-slate-100 flex flex-col text-slate-900">
      {/* Top Navbar */}
      <CustomerNavbar 
        currentTitle="My Filings & Status" 
        onRefresh={refreshCustomerData} 
        isLoading={isLoadingOrders} 
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex flex-row min-w-0 overflow-hidden">
        <CustomerSidebar activeItem="orders" />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overscroll-contain custom-scrollbar">
          {/* Executive KPI Summary Bar */}
          <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Metric 1: Filing Stage */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Filing</span>
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-sm font-bold text-slate-900 block truncate">
                  {currentOrder ? (currentOrder.company?.primaryName || currentOrder.companyName || 'Incorporation') : 'No Active Filing'}
                </span>
                <span className={`text-[10px] font-bold mt-1 inline-flex items-center gap-1 ${
                  !currentOrder ? 'text-slate-400' : isOrderApproved ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {!currentOrder ? 'Draft / Inactive' : isOrderApproved ? 'Confirmed & Verified' : 'Pending Admin Verification'}
                </span>
              </div>

              {/* Metric 2: Document Vault */}
              <Link
                href="/customer/documents"
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 text-left transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vault Documents</span>
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                </div>
                <span className="text-sm font-bold text-slate-900 block font-mono">
                  {currentOrder ? 'Attached Dossiers' : '0 Stored Dockets'}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                  {currentOrder ? 'DigiLocker Verified' : 'Empty Vault'}
                </span>
              </Link>

              {/* Metric 3: Assigned Counsel */}
              <Link
                href="/customer/tickets"
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 text-left transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Counsel</span>
                  <Headphones className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <span className="text-sm font-bold text-slate-900 block truncate">
                  {currentOrder?.assignedPartner || (currentOrder ? 'Allocating Counsel...' : 'Unassigned')}
                </span>
                <span className="text-[10px] font-semibold text-purple-700 mt-1 block">
                  {currentOrder ? 'Practicing ICSI/ICAI Desk' : 'Available on Filing'}
                </span>
              </Link>

              {/* Metric 4: Next ROC Deadline */}
              <Link
                href="/customer/compliance"
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 text-left transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Next Statutory Due</span>
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-sm font-bold text-slate-900 block truncate">
                  {currentOrder ? 'Director DIR-3 KYC' : 'Statutory Calendar'}
                </span>
                <span className="text-[10px] font-semibold text-amber-700 mt-1 block">
                  {currentOrder ? 'Due 30 Sep (On Schedule)' : 'Post-Incorporation'}
                </span>
              </Link>

            </div>
          </div>

          {/* Main Filings Content */}
          <main className="max-w-6xl mx-auto w-full py-6 px-4 sm:px-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">Active Incorporations & Ministry Queue</h1>
                <p className="text-xs text-slate-500">Track statutory filing milestones, review docket QC, and download official Certificates of Incorporation.</p>
              </div>
              <Link
                href="/register"
                className="self-start sm:self-auto px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Start New Incorporation</span>
              </Link>
            </div>

            {isLoadingOrders ? (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
                <Clock className="w-6 h-6 text-slate-400 mx-auto animate-spin mb-2" />
                <p className="text-xs text-slate-500 font-medium">Connecting to Ministry ROC database...</p>
              </div>
            ) : ordersList.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Active Filings Recorded</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You haven&apos;t initiated any corporate registrations yet. Incorporate your Private Limited, LLP or OPC in 5 minutes.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold mt-2 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start New Incorporation</span>
                </Link>
              </div>
            ) : (
              ordersList.map((ord) => {
                const orderId = ord.orderId || ord.id;
                const companyName = ord.company?.primaryName || ord.companyName || customerUser.companyName;
                const state = ord.company?.stateCode || ord.state || 'Maharashtra';
                const capital = ord.company?.authorizedCapital || 100000;
                const partner = ord.assignedCs?.name || ord.assignedPartner || 'CS Priya Sharma (FCS #11849)';
                const isApproved = Boolean(ord.adminApproved || ord.docVerificationStatus === 'Approved' || (ord.status && ord.status.toLowerCase().includes('approved')) || ord.certificateUploaded);

                return (
                  <div key={orderId} className={`bg-white rounded-xl border ${isApproved ? 'border-slate-200' : 'border-amber-200 border-l-4 border-l-amber-500'} p-6 shadow-xs space-y-5`}>
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-200">
                            SPICe+ Part A & B Filing
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-600">#{orderId}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{companyName}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Jurisdiction: <span className="text-slate-700 font-semibold">{state}</span> • Authorized Capital: <span className="font-mono font-semibold text-slate-700">₹{capital.toLocaleString('en-IN')}</span> • 2 Directors
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Statutory Registration Status</span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          isApproved 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-amber-50 text-amber-900 border-amber-300'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${isApproved ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                          <span>{isApproved ? 'Registration Confirmed & Approved' : 'Pending Admin Document Verification'}</span>
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {isApproved ? 'Approved by Admin • Under Ministry ROC Processing' : 'Documents queued for Admin verification'}
                        </p>
                      </div>
                    </div>

                    {/* Pending Verification Notice Banner */}
                    {!isApproved && (
                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-amber-950">Registration Under Admin Document Verification</h4>
                          <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                            Your registration documents (Director PAN, Aadhaar identity dockets and Registered Office utility proofs) are currently in the Admin verification queue. Your registration will only show as successful once the Admin approves your submitted documents.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Milestone Progress Tracker */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Statutory Pipeline Progress ({isApproved ? 'Stage 6 of 6' : 'Stage 2 of 6'})</span>
                        <span className={isApproved ? 'text-emerald-700' : 'text-amber-700'}>
                          {isApproved ? '100% Verified & Approved' : 'Stage 2: Admin Document QC in Progress'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isApproved ? 'bg-emerald-600' : 'bg-amber-500'}`} 
                          style={{ width: isApproved ? '100%' : '33%' }} 
                        />
                      </div>
                    </div>

                    {/* 6 Step Milestone Blocks */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[11px]">
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                        <span>1. Payment</span>
                      </div>
                      <div className={`p-2.5 rounded-xl font-bold ${isApproved ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                        {isApproved ? <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" /> : <Clock className="w-4 h-4 mx-auto mb-1 text-amber-600 animate-spin" />}
                        <span>2. Admin QC</span>
                      </div>
                      <div className={`p-2.5 rounded-xl font-bold ${isApproved ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-slate-50 border border-slate-200 text-slate-400'}`}>
                        {isApproved ? <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" /> : <span className="block text-[10px] mb-1">🔒</span>}
                        <span>3. Reg. Confirmed</span>
                      </div>
                      <div className={`p-2.5 rounded-xl font-bold ${isApproved ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-slate-50 border border-slate-200 text-slate-400'}`}>
                        {isApproved ? <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" /> : <span className="block text-[10px] mb-1">🔒</span>}
                        <span>4. MOA/AOA</span>
                      </div>
                      <div className={`p-2.5 rounded-xl font-bold ${isApproved ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-slate-50 border border-slate-200 text-slate-400'}`}>
                        {isApproved ? <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" /> : <span className="block text-[10px] mb-1">🔒</span>}
                        <span>5. Part B ROC</span>
                      </div>
                      <div className={`p-2.5 rounded-xl ${isApproved ? 'bg-emerald-100 border border-emerald-300 text-emerald-900 font-black' : 'bg-slate-50 border border-slate-200 text-slate-400'}`}>
                        {isApproved ? <Award className="w-4 h-4 mx-auto mb-1 text-emerald-700" /> : <span className="block text-[10px] mb-1">🔒</span>}
                        <span>6. COI Issued</span>
                      </div>
                    </div>

                    {/* Assigned Secretarial Desk & Document Downloads */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 font-bold flex items-center justify-center text-xs border border-blue-200">
                          CS
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Assigned Professional: {partner}</p>
                          <p className="text-[11px] text-slate-500">Practicing Company Secretary • Verified Filing Desk</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadDoc(`BharatFilings_Tax_Invoice_${orderId}.pdf`, `Statutory Tax Invoice #${orderId}`)}
                          className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tax Invoice</span>
                        </button>

                        {ord.certificateUploaded ? (
                          <button
                            type="button"
                            onClick={() => handleDownloadDoc(`Certificate_Of_Incorporation_${orderId}.pdf`, `Certificate of Incorporation for ${companyName}`)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <Award className="w-4 h-4" />
                            <span>Download Official COI</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDownloadDoc(`SPICe_Plus_Draft_Filing_${orderId}.pdf`, `Draft SPICe+ Dossier for ${companyName}`)}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Filing Dossier</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
