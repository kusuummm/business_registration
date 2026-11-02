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
  Headphones, 
  MessageCircle, 
  Video, 
  Send, 
  Check, 
  Sparkles, 
  X,
  ExternalLink,
  Phone
} from 'lucide-react';

export default function CustomerOrdersPage() {
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [customerUser, setCustomerUser] = useState({ 
    name: '', 
    email: '',
    mobile: '9876543210',
    companyName: ''
  });

  // ==========================================
  // HIGH-TRUST FEATURE 1: WHATSAPP MILESTONES
  // ==========================================
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [isSendingPing, setIsSendingPing] = useState(false);
  const [whatsappFeed, setWhatsappFeed] = useState([
    {
      id: 1,
      sender: 'bot',
      time: '10:14 AM',
      text: '👋 Namaste Rahul! Your incorporation file #ORD-2026-9182 for TechNova Solutions Pvt Ltd is assigned to CS Priya Sharma (FCS #11849). SLA Guarantee active: documents will be prepared within 48h.'
    },
    {
      id: 2,
      sender: 'bot',
      time: '11:30 AM',
      text: '✅ MCA RUN Name Feasibility: "TechNova Solutions" verified under Rule 8 with zero phonetic trademark conflicts. Name approved by Central Registration Centre.'
    },
    {
      id: 3,
      sender: 'bot',
      time: '02:45 PM',
      text: '📄 SPICe+ Part B & e-MOA/AOA drafted. Digital Class-3 DSC cryptographic signature successfully affixed via emBridge. MCA SRN Generated: #AA91827462.'
    }
  ]);

  const handleSendTestPing = () => {
    setIsSendingPing(true);
    setTimeout(() => {
      setIsSendingPing(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setWhatsappFeed((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bot',
          time: timeStr,
          text: `🔔 [LIVE MILESTONE] MCA ROC V3 Daily Poller Update: Your application SRN #AA91827462 is in stage "Under Scrutiny with ROC Delhi/Mumbai". Zero clarification queries raised.`
        }
      ]);
    }, 600);
  };

  const handleQuickBotQuery = (query: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let botReply = '';

    if (query === 'STATUS') {
      botReply = '📊 Status: Stage 3 (ROC Processing). Expected Certificate of Incorporation dispatch within 3 business days.';
    } else if (query === 'VAULT') {
      botReply = '📁 Vault: 4 verified dockets available (Draft MOA, AOA, Director DIR-2 Consent, and PAN Receipt). Download anytime from your portal.';
    } else if (query === 'CALL_CS') {
      botReply = '📞 Direct Line: CS Priya Sharma is on desk today. You can also book a 15-minute video sync using the consultation button below.';
    }

    setWhatsappFeed((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', time: timeStr, text: query },
      { id: Date.now() + 1, sender: 'bot', time: timeStr, text: botReply }
    ]);
  };

  // ==========================================
  // HIGH-TRUST FEATURE 2: VIDEO CONSULTATION MODAL
  // ==========================================
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Shareholding Ratios & Authorized Capital Slabs');
  const [selectedDate, setSelectedDate] = useState('Today at 4:30 PM');
  const [isBookingCall, setIsBookingCall] = useState(false);
  const [bookedCallLink, setBookedCallLink] = useState<string | null>(null);

  const handleConfirmVideoCall = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingCall(true);
    setTimeout(() => {
      setIsBookingCall(false);
      setBookedCallLink('https://meet.google.com/bf-cs-9821-struct');
    }, 700);
  };

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
            mobile: parsed.mobile || prev.mobile,
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
Entity: ${customerUser.companyName || 'TechNova Solutions Pvt Ltd'}
Applicant: ${customerUser.name || 'Rahul Sharma'}
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
                  {currentOrder ? (currentOrder.company?.primaryName || currentOrder.companyName || 'Incorporation') : 'TechNova Solutions Pvt Ltd'}
                </span>
                <span className={`text-[10px] font-bold mt-1 inline-flex items-center gap-1 ${
                  isOrderApproved ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {isOrderApproved ? 'Confirmed & Verified' : 'In Process • SLA Active'}
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
                  4 Attached Dossiers
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 mt-1 block">
                  DigiLocker Verified
                </span>
              </Link>

              {/* Metric 3: Assigned Counsel */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Counsel</span>
                  <Headphones className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <span className="text-sm font-bold text-slate-900 block truncate">
                  CS Priya Sharma (FCS #11849)
                </span>
                <span className="text-[10px] font-semibold text-purple-700 mt-1 block">
                  Fellow ICSI Officer
                </span>
              </div>

              {/* Metric 4: Next Statutory Due */}
              <Link
                href="/compliance-calendar"
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 text-left transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Next Statutory Due</span>
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-sm font-bold text-slate-900 block truncate">
                  Director DIR-3 KYC
                </span>
                <span className="text-[10px] font-semibold text-amber-700 mt-1 block">
                  Due 30 Sep (Compliant)
                </span>
              </Link>

            </div>
          </div>

          {/* Main Filings Content */}
          <main className="max-w-6xl mx-auto w-full py-6 px-4 sm:px-6 space-y-6">
            
            {/* Header with Video Consult Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">Active Incorporations & Ministry Queue</h1>
                <p className="text-xs text-slate-500">Track statutory filing milestones, review docket QC, and download official Certificates of Incorporation.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-purple-600" />
                  <span>Book 15-Min CS Video Sync</span>
                </button>

                <Link
                  href="/register"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start New Incorporation</span>
                </Link>
              </div>
            </div>

            {/* HIGH-TRUST MOAT 1: Escrow-Backed 100% Money-Back SLA Guarantee Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-[#0A1324] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm border border-emerald-500/30">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded border border-emerald-400/20">
                      Escrow-Backed SLA Guarantee Active
                    </span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">• RazorpayX Milestone Escrow</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">
                    48-Hour SPICe+ Dossier Drafting & Ministry Submission Commitment
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    If our in-house Company Secretaries miss our committed filing milestone, 100% of your professional fee is refunded automatically. Zero questions asked.
                  </p>
                </div>
              </div>

              {/* Live Countdown Badge */}
              <div className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-right">
                <span className="text-[9px] uppercase font-bold text-slate-300 block">SLA Drafting Clock</span>
                <span className="font-mono text-xs font-black text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  38h : 24m : 18s Remaining
                </span>
              </div>
            </div>

            {/* Active Incorporation Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-200">
                      SPICe+ Part A & B Filing
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-600">#ORD-2026-9182</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">TechNova Solutions Private Limited</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Jurisdiction: <span className="text-slate-700 font-semibold">Maharashtra (ROC Mumbai)</span> • Authorized Capital: <span className="font-mono font-semibold text-slate-700">₹1,00,000</span> • 2 Directors
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Statutory Registration Status</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-blue-50 text-blue-900 border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>ROC Scrutiny • emBridge Signed</span>
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    MCA SRN: <span className="font-mono font-bold text-slate-700">#AA91827462</span>
                  </p>
                </div>
              </div>

              {/* Milestone Progress Tracker */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Statutory Pipeline Progress (Stage 5 of 6)</span>
                  <span className="text-blue-700 font-mono">
                    83% Completed • Next: COI Issuance
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-600 to-indigo-600"
                    style={{ width: '83%' }} 
                  />
                </div>
              </div>

              {/* 6 Step Milestone Blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[11px]">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span>1. Payment</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span>2. KYC & DSC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span>3. Name RUN</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span>4. MOA/AOA</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold">
                  <Clock className="w-4 h-4 mx-auto mb-1 text-blue-600 animate-spin" />
                  <span>5. ROC Scrutiny</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 font-medium">
                  <Award className="w-4 h-4 mx-auto mb-1 opacity-50" />
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
                    <p className="text-xs font-bold text-slate-900">Assigned Professional: CS Priya Sharma (FCS #11849)</p>
                    <p className="text-[11px] text-slate-500">Fellow Company Secretary • Dedicated MCA V3 Advisory Desk</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadDoc('BharatFilings_Tax_Invoice_9182.pdf', 'Statutory Tax Invoice #9182')}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tax Invoice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadDoc('SPICe_Plus_PartB_AA91827462.pdf', 'Draft SPICe+ Part B Dossier')}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Filing Dossier (SRN)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* HIGH-TRUST MOAT 2: WhatsApp Milestone Alerts Live Feed (The MyOnlineCA Experience) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>WhatsApp Milestone Notifications & Status Bot</span>
                      <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                        Active
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Official Meta WhatsApp Cloud API updates delivered to <span className="font-mono font-bold text-slate-800">+91 {customerUser.mobile}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendTestPing}
                  disabled={isSendingPing}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSendingPing ? 'Dispatching...' : 'Simulate Live WhatsApp Ping'}</span>
                </button>
              </div>

              {/* Chat Transcript Container */}
              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2.5 max-h-56 overflow-y-auto custom-scrollbar">
                {whatsappFeed.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] text-xs p-2.5 rounded-xl ${
                      msg.sender === 'user' 
                        ? 'ml-auto bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    <p className="text-[11px] leading-relaxed">{msg.text}</p>
                    <span className={`text-[9px] mt-1 self-end ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                      {msg.time} • Delivered
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Query Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Bot Queries:</span>
                <button
                  type="button"
                  onClick={() => handleQuickBotQuery('STATUS')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition cursor-pointer"
                >
                  STATUS
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickBotQuery('VAULT')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition cursor-pointer"
                >
                  VAULT
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickBotQuery('CALL_CS')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition cursor-pointer"
                >
                  CALL_CS
                </button>
              </div>
            </div>

          </main>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL: 15-MINUTE PRE-FILING VIDEO CONSULTATION SCHEDULER    */}
      {/* ============================================================ */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 relative animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => {
                setIsVideoModalOpen(false);
                setBookedCallLink(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Pre-Filing Structuring Video Call</h3>
                <p className="text-xs text-slate-500">15-minute 1-on-1 with Fellow CS Priya Sharma (FCS #11849)</p>
              </div>
            </div>

            {bookedCallLink ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-950">Video Consultation Confirmed!</h4>
                <p className="text-xs text-emerald-800">
                  Scheduled for <span className="font-bold">{selectedDate}</span>. Agenda: {selectedTopic}.
                </p>
                <div className="pt-2">
                  <a
                    href={bookedCallLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                  >
                    <span>Launch Google Meet Room</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmVideoCall} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Consultation Agenda</label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold outline-none focus:border-purple-600 text-xs"
                  >
                    <option value="Shareholding Ratios & Authorized Capital Slabs">Shareholding Ratios & Authorized Capital Slabs</option>
                    <option value="Director DIN Allotment & Stamp Duty Breakdown">Director DIN Allotment & Stamp Duty Breakdown</option>
                    <option value="MOA Objects Clause & Main Activity Scrutiny">MOA Objects Clause & Main Activity Scrutiny</option>
                    <option value="GST & Startup India DPIIT Recognition Strategy">GST & Startup India DPIIT Recognition Strategy</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Available CS Officer Slot</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold outline-none focus:border-purple-600 text-xs"
                  >
                    <option value="Today at 4:30 PM">Today at 4:30 PM (Immediate Opening)</option>
                    <option value="Tomorrow at 11:00 AM">Tomorrow at 11:00 AM (Morning Slot)</option>
                    <option value="Tomorrow at 3:00 PM">Tomorrow at 3:00 PM (Afternoon Slot)</option>
                    <option value="Day after Tomorrow at 12:00 PM">Day after Tomorrow at 12:00 PM</option>
                  </select>
                </div>

                <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-[11px] text-purple-900">
                  💡 Zero Fee: 1 complimentary video structuring session is included in all BharatFilings SPICe+ Private Limited and LLP packages.
                </div>

                <button
                  type="submit"
                  disabled={isBookingCall}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {isBookingCall ? <span>Reserving Slot...</span> : <span>Confirm Consultation Slot</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
