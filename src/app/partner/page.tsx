'use client';

import React, { useState, useEffect } from 'react';
import PartnerNavbar from '@/components/PartnerNavbar';
import PartnerSidebar, { PartnerTab } from '@/components/PartnerSidebar';
import { 
  Briefcase, 
  Award, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  Lock, 
  ShieldCheck, 
  Wallet, 
  Share2, 
  Copy, 
  ExternalLink,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Building2,
  RefreshCw,
  Calendar,
  Key,
  Check,
  Search,
  Filter,
  ArrowUpRight,
  Eye,
  Send,
  Sparkles,
  ChevronRight,
  Info,
  Users,
  Printer,
  X,
  MapPin,
  User,
  Phone,
  LayoutGrid,
  List
} from 'lucide-react';

interface PartnerOrder {
  id: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  companyName: string;
  service: string;
  state: string;
  earnedFee: number;
  currentStatus: string;
  docsReceived: number;
  deadline: string;
  isAccepted: boolean;
  directors: string[];
  authorizedCapital: string;
  cinStatus: string;
  lastUpdated: string;
}

const DEFAULT_PARTNER_ORDERS: PartnerOrder[] = [
  {
    id: 'ORD-2026-9041',
    customerName: 'Rahul Sharma',
    customerMobile: '+91 98765 43210',
    customerEmail: 'rahul.sharma@technova.in',
    companyName: 'TechNova Solutions Pvt Ltd',
    service: 'Private Limited Company (SPICe+ Part A & B)',
    state: 'Maharashtra (ROC Mumbai)',
    earnedFee: 1500,
    currentStatus: 'Drafting MOA & AOA',
    docsReceived: 6,
    deadline: 'Within 24 Hours',
    isAccepted: true,
    directors: ['Rahul Sharma (Managing Director)', 'Pooja Sharma (Director)'],
    authorizedCapital: '₹10,00,000',
    cinStatus: 'Part A Approved (ROC/2026/0912)',
    lastUpdated: 'Today, 10:45 AM'
  },
  {
    id: 'ORD-2026-8812',
    customerName: 'Vikramaditya Roy',
    customerMobile: '+91 98112 34567',
    customerEmail: 'vikram@zenithagro.com',
    companyName: 'Zenith Organic Foods LLP',
    service: 'Limited Liability Partnership (FiLLiP)',
    state: 'Karnataka (ROC Bangalore)',
    earnedFee: 1200,
    currentStatus: 'Pending Director DSC Signing',
    docsReceived: 4,
    deadline: 'Within 36 Hours',
    isAccepted: true,
    directors: ['Vikramaditya Roy (Designated Partner)', 'Neha Roy (Designated Partner)'],
    authorizedCapital: '₹5,00,000',
    cinStatus: 'Name Allocated (LLP-IN-9921)',
    lastUpdated: 'Yesterday, 04:15 PM'
  },
  {
    id: 'ORD-2026-8740',
    customerName: 'Dr. Arjun Mehta',
    customerMobile: '+91 97234 56789',
    customerEmail: 'arjun@biohealthai.in',
    companyName: 'BioHealth Diagnostic Labs Pvt Ltd',
    service: 'Private Limited Company (Fast-Track Kit)',
    state: 'Delhi (ROC Delhi & Haryana)',
    earnedFee: 2000,
    currentStatus: 'SPICe+ Part B Treasury Paid',
    docsReceived: 8,
    deadline: 'CRC Final Review',
    isAccepted: true,
    directors: ['Dr. Arjun Mehta (Director)', 'Dr. Kavita Singhal (Director)'],
    authorizedCapital: '₹15,00,000',
    cinStatus: 'Challan Generated (CRN-2026-781)',
    lastUpdated: '2 days ago'
  },
  {
    id: 'ORD-2026-9155',
    customerName: 'Sanjay Deshmukh',
    customerMobile: '+91 98450 12345',
    customerEmail: 'sanjay@finpulse.io',
    companyName: 'FinPulse Digital Payments Pvt Ltd',
    service: 'Private Limited Company (FinTech Shield)',
    state: 'Telangana (ROC Hyderabad)',
    earnedFee: 2500,
    currentStatus: 'New Allocation Awaiting Acceptance',
    docsReceived: 5,
    deadline: 'Action Required within 12h',
    isAccepted: false,
    directors: ['Sanjay Deshmukh', 'Aditya Kulkarni'],
    authorizedCapital: '₹25,00,000',
    cinStatus: 'SPICe+ Part A Submitted',
    lastUpdated: 'Just now'
  }
];

const MOA_TEMPLATES = [
  {
    industry: 'Information Technology, Software & AI',
    title: 'Clause III (A): Main Objects - IT & AI Solutions',
    clause: `To carry on the business of software development, designing, developing, testing, deploying, maintaining, and marketing computer software applications, artificial intelligence models, cloud-hosted SaaS platforms, enterprise data infrastructure, mobile applications, web portals, algorithmic systems, and to provide data processing, information technology consulting, systems integration, and cyber security services to commercial, institutional, and government clients in India and abroad.`,
    ancillary: `(a) To acquire, register, protect, prolong, and renew patents, patent rights, trademarks, trade names, copyrights, and intellectual property.\n(b) To purchase, take on lease, exchange, hire, or otherwise acquire any real or personal property necessary for the business.\n(c) To enter into partnerships, joint ventures, or reciprocal agreements for sharing profits or cooperation with any person, firm, or entity.`
  },
  {
    industry: 'FinTech, Payments & Neo-Banking',
    title: 'Clause III (A): Main Objects - Financial Technology',
    clause: `To engage in the business of financial technology architecture, digital payment gateways, peer-to-peer transaction interfaces, algorithmic credit assessment systems, automated account aggregation, compliance software, and to develop, operate, and maintain software engines for processing secure electronic payments, digital wallets, and financial analytics platforms subject to regulatory approvals.`,
    ancillary: `(a) To develop and licence proprietary cryptographic verification protocols and fraud-detection engines.\n(b) To establish correspondent technical arrangements with scheduled commercial banks, non-banking financial corporations, and clearing houses.\n(c) To invest in modern server infrastructure, high-throughput data pipelines, and disaster-recovery systems.`
  },
  {
    industry: 'E-Commerce, Retail & Marketplace',
    title: 'Clause III (A): Main Objects - Online Marketplace & D2C',
    clause: `To establish, operate, manage, and facilitate online electronic commerce trading platforms, virtual marketplaces, direct-to-consumer digital storefronts, supply chain software, inventory management systems, and to act as merchants, distributors, retailers, wholesalers, import-export agents, and logistics coordinators for consumer goods, merchandise, and commodities.`,
    ancillary: `(a) To construct, acquire, manage, and operate cold storage warehouses, automated fulfillment centers, and distribution hubs.\n(b) To provide white-glove packaging, delivery coordination, and returns handling services.\n(c) To enter into franchising and vendor distribution agreements across states and union territories.`
  },
  {
    industry: 'Renewable Energy, CleanTech & Solar',
    title: 'Clause III (A): Main Objects - Clean Energy Infrastructure',
    clause: `To carry on in India or elsewhere the business of generation, harvesting, accumulation, transmission, distribution, and supply of electrical power derived from renewable sources including solar photovoltaic, wind energy, biomass, green hydrogen, and battery energy storage systems, and to design, fabricate, install, and operate renewable power generation plants and transmission grids.`,
    ancillary: `(a) To apply for statutory state electricity regulatory commission permits, open-access grid approvals, and feed-in tariffs.\n(b) To import solar inverters, PV modules, battery cells, and step-up transformers.\n(c) To undertake turnkey EPC contracts and long-term Power Purchase Agreements (PPAs) with public and private off-takers.`
  },
  {
    industry: 'Corporate Advisory & Secretarial Consulting',
    title: 'Clause III (A): Main Objects - Corporate Secretarial Services',
    clause: `To carry on the business of providing corporate secretarial, legal-tech compliance, managerial, financial, strategic advisory, business process re-engineering, merger and acquisition diligence, statutory audit assistance, and enterprise risk consulting services to commercial, industrial, and technology enterprises across global jurisdictions.`,
    ancillary: `(a) To draft resolutions, secretarial minutes, statutory filings, and represent corporate clients before regulatory tribunals.\n(b) To provide intellectual property valuation, brand registration, and legal due-diligence certifications.\n(c) To organize legal seminars, director masterclasses, and corporate governance training workshops.`
  }
];

export default function PartnerPortalPage() {
  const [activeTab, setActiveTab] = useState<'workbench' | 'drafting' | 'calendar' | 'dsc' | 'wallet' | 'referral'>('workbench');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMoa, setCopiedMoa] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Interactive Modals
  const [previewDossierOrder, setPreviewDossierOrder] = useState<PartnerOrder | null>(null);
  const [resubmitModalOrder, setResubmitModalOrder] = useState<PartnerOrder | null>(null);
  const [resubmitReason, setResubmitReason] = useState('Utility bill older than 60 days. Please upload latest electricity or gas bill.');

  // MoA Generator State
  const [selectedIndustryIdx, setSelectedIndustryIdx] = useState(0);

  // Assigned Orders State
  const [assignedOrders, setAssignedOrders] = useState<PartnerOrder[]>(DEFAULT_PARTNER_ORDERS);

  // Fetch live orders from backend API on mount
  const refreshPartnerOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: PartnerOrder[] = json.data.map((o: any, idx: number) => ({
            id: o.orderId || o.id || `ORD-2026-${9100 + idx}`,
            customerName: o.auth?.name || o.customerName || 'Founder',
            customerMobile: o.auth?.mobile || o.customerMobile || '+91 98765 43210',
            customerEmail: o.auth?.email || o.customerEmail || 'client@example.com',
            companyName: o.company?.primaryName || o.companyName || 'Corporate Venture',
            service: o.company?.entityType === 'llp' ? 'LLP Registration' : 'Private Limited Company (SPICe+)',
            state: o.company?.stateCode || o.state || 'Maharashtra (ROC Mumbai)',
            earnedFee: o.pricing?.caFee || 1500,
            currentStatus: o.status || 'In Review',
            docsReceived: Array.isArray(o.company?.directors) ? o.company.directors.length * 2 + 2 : 4,
            deadline: 'Within 48 Hours',
            isAccepted: Boolean(o.adminApproved || o.status !== 'Pending Admin Verification'),
            directors: Array.isArray(o.company?.directors) 
              ? o.company.directors.map((d: any) => d.name || 'Director') 
              : ['Director 1', 'Director 2'],
            authorizedCapital: o.company?.authorizedCapital ? `₹${Number(o.company.authorizedCapital).toLocaleString('en-IN')}` : '₹10,00,000',
            cinStatus: 'SPICe+ In Progress',
            lastUpdated: 'Recently'
          }));
          
          // Merge with demo orders for a rich portal experience
          const existingIds = new Set(mapped.map(m => m.id));
          const uniqueDemos = DEFAULT_PARTNER_ORDERS.filter(d => !existingIds.has(d.id));
          setAssignedOrders([...mapped, ...uniqueDemos]);
        } else {
          setAssignedOrders(DEFAULT_PARTNER_ORDERS);
        }
      })
      .catch((err) => {
        console.log('Partner orders load error, using default seed:', err);
        setAssignedOrders(DEFAULT_PARTNER_ORDERS);
      });
  };

  useEffect(() => {
    refreshPartnerOrders();
  }, []);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Drafting MOA & AOA' })
      });
    } catch {}
    
    setAssignedOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, isAccepted: true, currentStatus: 'Drafting MOA & AOA' } : o))
    );
    setSuccessMsg(`Order ${orderId} accepted! You now have sovereign decrypted access to client documents.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch {}

    setAssignedOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, currentStatus: status } : o))
    );
    setSuccessMsg(`Filing status for ${orderId} updated to: "${status}". Founder and Admin notified.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSendResubmitNotice = () => {
    if (!resubmitModalOrder) return;
    setSuccessMsg(`Statutory clarification notice sent to ${resubmitModalOrder.customerName} (${resubmitModalOrder.customerEmail}) via Email & WhatsApp!`);
    setResubmitModalOrder(null);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCopyReferral = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText('https://bharatfilings.in/ref/CS-PRIYA-11849');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMoaClause = (text: string) => {
    setCopiedMoa(true);
    navigator.clipboard?.writeText(text);
    setTimeout(() => setCopiedMoa(false), 2500);
  };

  // Filtered orders
  const filteredOrders = assignedOrders.filter(order => {
    const matchesSearch = 
      order.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'pending') return matchesSearch && !order.isAccepted;
    if (statusFilter === 'active') return matchesSearch && order.isAccepted && order.currentStatus !== 'Completed (COI Issued)';
    if (statusFilter === 'completed') return matchesSearch && order.currentStatus === 'Completed (COI Issued)';
    return matchesSearch;
  });

  const totalEarned = assignedOrders.reduce((acc, curr) => acc + (curr.earnedFee || 0), 0);

  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
  };

  return (
    <div style={segoeStyle} className="h-screen max-h-screen overflow-hidden bg-[#F8FAFC] flex flex-col text-slate-900">
      {/* Top Navigation Bar with Refresh, Shortcuts & Context Breadcrumb */}
      <PartnerNavbar
        currentTitle={
          activeTab === 'workbench' ? 'Assigned Filings Queue' :
          activeTab === 'drafting' ? 'MoA / AoA Statutory Studio' :
          activeTab === 'calendar' ? 'Due Date Compliance Calendar' :
          activeTab === 'dsc' ? 'DSC Cryptographic Desk' :
          activeTab === 'wallet' ? 'Fees & Wallet Ledger' :
          'Referral & Partner Network'
        }
        onRefresh={refreshPartnerOrders}
      />

      {/* Main Body Workspace: Sidebar on left below navbar, Content on right */}
      <div className="flex-1 flex flex-row min-w-0 overflow-hidden">
        {/* Partner Sidebar (Segoe UI font style, matching Admin exactly) */}
        <PartnerSidebar
          activeItem={activeTab}
          onTabSelect={(tab) => setActiveTab(tab)}
          filingsCount={assignedOrders.length}
        />

        {/* Main Content Workspace to the right of sidebar (independent scroll) */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overscroll-contain bg-[#F8FAFC] custom-scrollbar">
          {/* Executive Overview Header (Unified Architecture Matching Admin) */}
          <section className="bg-white border-b border-slate-200 px-4 sm:px-6 py-5 shadow-xs">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                      Secretarial Counsel Desk
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      MCA V3 CRC Gateway Live
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md hidden md:inline">
                      FCS #11849 • Verified ICSI Fellow
                    </span>
                    <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md hidden lg:inline">
                      Active COP #2027
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>CS Priya Sharma</span>
                    <span className="text-xs font-normal text-slate-400">|</span>
                    <span className="text-sm font-semibold text-slate-600">Corporate Secretarial Workbench</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time statutory filing queue, MoA/AoA statutory studio, compliance calendar, and digital token cryptography.
                  </p>
                </div>

                {/* Available Escrow Payout with direct withdraw action */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">Available Remittance</span>
                      <span className="text-lg font-bold text-emerald-700 font-mono block leading-none mt-0.5">
                        ₹{totalEarned.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('wallet')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>Withdraw</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Metric KPI Cards (Clickable to switch tab) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Card 1: Active Secretarial Queue */}
                <button
                  type="button"
                  onClick={() => setActiveTab('workbench')}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer shadow-xs group ${
                    activeTab === 'workbench'
                      ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Active Queue</span>
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 font-mono block">{assignedOrders.length} Filings</span>
                  <span className="text-[11px] text-blue-600 font-medium mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    100% SLA Maintained
                  </span>
                </button>

                {/* Card 2: MoA / AoA Studio */}
                <button
                  type="button"
                  onClick={() => setActiveTab('drafting')}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer shadow-xs group ${
                    activeTab === 'drafting'
                      ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">MoA / AoA Studio</span>
                    <FileText className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 font-mono block">5 Industry Standard</span>
                  <span className="text-[11px] text-amber-700 font-medium mt-1 block">
                    Schedule I Table A Compliant
                  </span>
                </button>

                {/* Card 3: Due Date Calendar */}
                <button
                  type="button"
                  onClick={() => setActiveTab('calendar')}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer shadow-xs group ${
                    activeTab === 'calendar'
                      ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Due Date Calendar</span>
                    <Calendar className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 font-mono block">4 ROC Deadlines</span>
                  <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                    INC-20A Due in 14 Days
                  </span>
                </button>

                {/* Card 4: DSC Cryptographic Desk */}
                <button
                  type="button"
                  onClick={() => setActiveTab('dsc')}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer shadow-xs group ${
                    activeTab === 'dsc'
                      ? 'bg-purple-50/80 border-purple-400 ring-2 ring-purple-500/20'
                      : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">DSC Crypto Station</span>
                    <Key className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 font-mono block">2 Active Tokens</span>
                  <span className="text-[11px] text-purple-700 font-medium mt-1 block">
                    eMudhra & mToken Class 3
                  </span>
                </button>
              </div>
            </div>
          </section>

      {/* Success Notification Bar */}
      {successMsg && (
        <div className="bg-emerald-600 text-white text-xs font-bold text-center py-2.5 px-4 flex items-center justify-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 flex-1">
        
        {/* ======================================================== */}
        {/* TAB 1: ASSIGNED FILINGS WORKBENCH */}
        {/* ======================================================== */}
        {activeTab === 'workbench' && (
          <div className="space-y-6">
            {/* Header & Filter Controls with Quick Filter Badges and View Toggle */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      Real-time Feed
                    </span>
                    <span className="text-xs font-bold text-slate-500">• {assignedOrders.length} Allocated Filings</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Assigned Corporate Secretarial Queue
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review client dossiers, access encrypted Aadhaar/PAN attachments, draft MoA/AoA, and update MCA V3 CRC status.
                  </p>
                </div>

                {/* Right controls: Search, View Mode Toggle, Refresh */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search filing by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold placeholder:text-slate-400 outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* View Mode Toggle: Cards vs Table */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setViewMode('cards')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        viewMode === 'cards'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Card View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Cards</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        viewMode === 'table'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Table View"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Table</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={refreshPartnerOrders}
                    className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl cursor-pointer transition shadow-2xs"
                    title="Refresh Queue"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Status Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                    statusFilter === 'all'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  All Filings ({assignedOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                    statusFilter === 'pending'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  Awaiting Acceptance ({assignedOrders.filter(o => !o.isAccepted).length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                    statusFilter === 'active'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-blue-800 border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  Active In Progress ({assignedOrders.filter(o => o.isAccepted && o.currentStatus !== 'Completed (COI Issued)').length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('completed')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                    statusFilter === 'completed'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  Completed ({assignedOrders.filter(o => o.currentStatus === 'Completed (COI Issued)').length})
                </button>
              </div>
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">No Filings Found</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No filings matched your filter criteria. Reset the filter or check back as new orders are assigned by the central desk.
                </p>
              </div>
            ) : viewMode === 'table' ? (
              /* TABULAR VIEW (Matches Admin Table Architecture) */
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4 font-bold">Filing Ref</th>
                        <th className="p-4 font-bold">Company & Founder</th>
                        <th className="p-4 font-bold">Service Category</th>
                        <th className="p-4 font-bold">ROC State</th>
                        <th className="p-4 font-bold">Capital & Fee</th>
                        <th className="p-4 font-bold">Statutory Stage</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-4 font-mono font-bold text-blue-700 bg-slate-50/40">{ord.id}</td>
                          <td className="p-4">
                            <p className="font-bold text-slate-900">{ord.companyName}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Founder: {ord.customerName} ({ord.customerMobile})</p>
                          </td>
                          <td className="p-4 font-semibold text-slate-700">{ord.service}</td>
                          <td className="p-4">
                            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                              {ord.state}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-mono font-bold text-slate-900">{ord.authorizedCapital}</span>
                            <span className="block text-[10px] text-emerald-700 font-bold font-mono">Fee: ₹{ord.earnedFee}</span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              !ord.isAccepted
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : ord.currentStatus.includes('Completed')
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-blue-100 text-blue-800 border-blue-300'
                            }`}>
                              {!ord.isAccepted ? 'Awaiting Acceptance' : ord.currentStatus}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">SLA: {ord.deadline}</span>
                          </td>
                          <td className="p-4 text-right">
                            {!ord.isAccepted ? (
                              <button
                                type="button"
                                onClick={() => handleAcceptOrder(ord.id)}
                                className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs whitespace-nowrap"
                              >
                                Accept Allocation
                              </button>
                            ) : (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setPreviewDossierOrder(ord)}
                                  className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-blue-600 rounded-lg cursor-pointer transition shadow-2xs"
                                  title="Inspect Dossier"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <a
                                  href={`https://wa.me/${ord.customerMobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(ord.customerName)},%20this%20is%20CS%20Priya%20Sharma%20from%20BharatFilings%20regarding%20${encodeURIComponent(ord.companyName)}.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 rounded-lg cursor-pointer transition shadow-2xs"
                                  title="WhatsApp Founder"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* CARD VIEW (Matches Admin 3-Box Architecture) */
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isPending = !order.isAccepted;
                  const isCompleted = order.currentStatus.includes('Completed');

                  return (
                    <div 
                      key={order.id} 
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
                    >
                      {/* Top Row: IDs, Service & Current Stage */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-black text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                              {order.id}
                            </span>
                            <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded">
                              {order.state}
                            </span>
                            <span className="text-xs font-bold text-slate-900">• Founder: {order.customerName}</span>
                            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">({order.customerMobile})</span>
                          </div>
                          <h4 className="text-base font-extrabold text-slate-900 mt-1">{order.companyName}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-semibold text-slate-700">{order.service}</span>
                            <span>•</span>
                            <span>Authorized Capital: <strong className="text-slate-800">{order.authorizedCapital}</strong></span>
                            <span>•</span>
                            <span>Counsel Fee: <strong className="text-emerald-700 font-mono font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">₹{order.earnedFee.toLocaleString('en-IN')}</strong></span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Statutory Filing Stage</span>
                          <span className={`text-xs font-extrabold px-3 py-1 rounded-full inline-block border ${
                            isPending
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : isCompleted
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : order.currentStatus.includes('Treasury')
                              ? 'bg-purple-100 text-purple-800 border-purple-300'
                              : order.currentStatus.includes('Clarification')
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-blue-100 text-blue-800 border-blue-300'
                          }`}>
                            {isPending ? 'Awaiting Counsel Acceptance' : order.currentStatus}
                          </span>
                          <p className="text-[11px] text-amber-800 font-bold mt-1 flex items-center gap-1 sm:justify-end">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span className="bg-amber-50 px-2 py-0.5 rounded border border-amber-200">SLA: {order.deadline}</span>
                          </p>
                        </div>
                      </div>

                      {/* 3-Column Structured Action Grid (Identical to Admin Architecture) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        {/* Box 1: Encrypted Client Dossier */}
                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase text-slate-800 block mb-1 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Encrypted Client Dossier</span>
                            </span>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                              {order.docsReceived} Sovereign Files (PAN, Aadhaar XML, NOC, Form DIR-2)
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setPreviewDossierOrder(order)}
                            className="mt-3 w-full py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>Inspect & Decrypt Dossier</span>
                          </button>
                        </div>

                        {/* Box 2: Filing Allocation & MCA V3 Controller */}
                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase text-slate-800 block mb-1 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                              <span>Filing Status & Acceptance</span>
                            </span>

                            {isPending ? (
                              <span className="inline-block font-bold text-xs px-2.5 py-1 rounded-md border text-amber-800 bg-amber-50 border-amber-300 mt-0.5">
                                ⏳ Allocation Awaiting Acceptance
                              </span>
                            ) : (
                              <select
                                value={order.currentStatus}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                className="w-full mt-1 py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 cursor-pointer shadow-2xs focus:border-blue-600 focus:outline-none"
                              >
                                <option value="SPICe+ Part A Submitted to CRC">SPICe+ Part A Submitted</option>
                                <option value="Drafting MOA & AOA">Drafting MOA & AOA</option>
                                <option value="Pending Director DSC Signing">Pending Director DSC</option>
                                <option value="SPICe+ Part B Treasury Paid">SPICe+ Part B Treasury Paid</option>
                                <option value="ROC Clarification / Resubmission Required">ROC Clarification Required</option>
                                <option value="Completed (COI Issued)">Completed (COI Issued)</option>
                              </select>
                            )}
                          </div>

                          {isPending ? (
                            <button
                              type="button"
                              onClick={() => handleAcceptOrder(order.id)}
                              className="mt-3 w-full py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accept Filing Allocation</span>
                            </button>
                          ) : (
                            <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                              <span>Tracking Ref:</span>
                              <span className="font-bold text-slate-800">{order.cinStatus}</span>
                            </div>
                          )}
                        </div>

                        {/* Box 3: Client Escalation & WhatsApp */}
                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase text-slate-800 block mb-1 flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Founder Consultation Desk</span>
                            </span>
                            <p className="text-[11px] text-slate-600">
                              Direct WhatsApp channel & ROC clarification notice dispatch.
                            </p>
                          </div>

                          <div className="mt-3 space-y-1.5">
                            <button
                              type="button"
                              onClick={() => setResubmitModalOrder(order)}
                              className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              <span>Raise Resubmission Requirement</span>
                            </button>

                            <a
                              href={`https://wa.me/${order.customerMobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(order.customerName)},%20this%20is%20CS%20Priya%20Sharma%20from%20BharatFilings%20regarding%20${encodeURIComponent(order.companyName)}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 text-center shadow-xs"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Message on WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MOA / AOA STATUTORY STUDIO (NEW POWERFUL TOOL) */}
        {/* ======================================================== */}
        {activeTab === 'drafting' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Schedule I Table A Compliant Generator</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1.5">
                    MoA & AoA Statutory Clause Drafting Studio
                  </h3>
                  <p className="text-xs text-slate-500">
                    Draft, tailor, and copy standard SPICe+ Part B main object clauses (Clause III A) and ancillary powers.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyMoaClause(MOA_TEMPLATES[selectedIndustryIdx].clause)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedMoa ? 'Copied Clause!' : 'Copy Clause Text'}</span>
                  </button>
                </div>
              </div>

              {/* Industry Selector Pills */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                  Select Corporate Domain / NIC Code Industry:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {MOA_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={tmpl.industry}
                      type="button"
                      onClick={() => setSelectedIndustryIdx(idx)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        selectedIndustryIdx === idx
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/10'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 block truncate">{tmpl.industry}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Companies Act 2013</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Panel */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-4 relative overflow-hidden border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>{MOA_TEMPLATES[selectedIndustryIdx].title}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">CRC Approved Phrasing</span>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">1. Main Objects to be Pursued:</h5>
                    <p className="text-slate-200 leading-relaxed text-xs whitespace-pre-wrap">
                      {MOA_TEMPLATES[selectedIndustryIdx].clause}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <h5 className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">2. Matters in Furtherance of the Main Objects:</h5>
                    <p className="text-slate-300 leading-relaxed text-[11px] whitespace-pre-wrap">
                      {MOA_TEMPLATES[selectedIndustryIdx].ancillary}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Complies with Section 4(1)(c) of the Companies Act, 2013 & MCA SPICe+ MOA e-Form standard.</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => alert('Exporting full Draft Memorandum of Association to Word (.docx)...')}
                    className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Complete e-MOA (.docx)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: STATUTORY DUE DATE COMPLIANCE CALENDAR */}
        {/* ======================================================== */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Client Statutory Due Date & ROC Calendar
                  </h3>
                  <p className="text-xs text-slate-500">
                    Keep assigned client companies compliant with annual filing deadlines and statutory MCA circulars.
                  </p>
                </div>

                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 w-fit">
                  Fiscal Year 2026-2027 Active
                </span>
              </div>

              {/* Compliance Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Entity Name</th>
                      <th className="py-3 px-4">Statutory Form</th>
                      <th className="py-3 px-4">Statutory Deadline</th>
                      <th className="py-3 px-4">Purpose / Inclusions</th>
                      <th className="py-3 px-4">Compliance Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-slate-900">TechNova Solutions Pvt Ltd</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">Form INC-20A</td>
                      <td className="py-3.5 px-4 font-semibold text-amber-700">Due in 14 Days</td>
                      <td className="py-3.5 px-4 text-slate-500">Commencement of Business & Capital Receipt Verification</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Urgent Follow-up
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => alert('Statutory INC-20A reminder notice dispatched to directors.')}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Send Notice
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3.5 px-4 font-bold text-slate-900">Zenith Organic Foods LLP</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">Form 11 (LLP)</td>
                      <td className="py-3.5 px-4 text-slate-600">May 30, 2026</td>
                      <td className="py-3.5 px-4 text-slate-500">Annual Return of Limited Liability Partnership</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          Scheduled
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => alert('Preparation checklist opened.')}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Prepare Draft
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3.5 px-4 font-bold text-slate-900">BioHealth Diagnostic Labs</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">DIR-3 KYC (2 Dirs)</td>
                      <td className="py-3.5 px-4 text-slate-600">September 30, 2026</td>
                      <td className="py-3.5 px-4 text-slate-500">Annual Director e-KYC & Mobile/Email OTP verification</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Compliant
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => alert('KYC already verified for all active DINs.')}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3.5 px-4 font-bold text-slate-900">TechNova Solutions Pvt Ltd</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">AOC-4 & MGT-7</td>
                      <td className="py-3.5 px-4 text-slate-600">October 30, 2026</td>
                      <td className="py-3.5 px-4 text-slate-500">Annual Financial Statement & ROC Annual Return</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          Upcoming FY Close
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => alert('Pre-audit secretarial checklist initiated.')}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Pre-Audit
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: DSC CRYPTOGRAPHIC TOKEN DESK */}
        {/* ======================================================== */}
        {activeTab === 'dsc' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    DSC Cryptographic Tokens & Attestation Station
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage Class-3 digital signatures for client directors, verify driver connectivity, and dispatch signing links.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    CCA Govt Licensed CA Sync
                  </span>
                </div>
              </div>

              {/* Tokens Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                        Hardware USB Token
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-2">Rahul Sharma (Managing Director)</h4>
                      <p className="text-xs text-slate-500 font-mono">DIN: 09812410 • PAN: ABCPS1234F</p>
                    </div>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" title="Active Token" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-200 py-3 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-sans">Token Model</span>
                      <span className="text-slate-800 font-bold">ePass 2003 Auto</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-sans">Cert Authority</span>
                      <span className="text-slate-800 font-bold">eMudhra Class 3</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-sans">Valid Till</span>
                      <span className="text-emerald-700 font-bold">October 2028 (720d)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-sans">Serial Hash</span>
                      <span className="text-slate-800 truncate block">0x9F41E8019B</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert('Cryptographic handshake test successful! Token is ready for signing SPICe+ Part B.')}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer text-center"
                    >
                      Test Token Driver
                    </button>
                    <button
                      type="button"
                      onClick={() => alert('One-time remote Aadhaar eSign link sent to Director mobile.')}
                      className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Send eSign Link
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                        Hardware USB Token
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-2">Vikramaditya Roy (Designated Partner)</h4>
                      <p className="text-xs text-slate-500 font-mono">DPIN: 08419201 • PAN: BPYVR9812A</p>
                    </div>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" title="Active Token" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-200 py-3 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-sans">Token Model</span>
                      <span className="text-slate-800 font-bold">mToken CryptoID</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-sans">Cert Authority</span>
                      <span className="text-slate-800 font-bold">Capricorn CA</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-sans">Valid Till</span>
                      <span className="text-emerald-700 font-bold">August 2027 (640d)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-sans">Serial Hash</span>
                      <span className="text-slate-800 truncate block">0x7B29F4018C</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert('Cryptographic handshake test successful! Token is ready for signing LLP FiLLiP.')}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer text-center"
                    >
                      Test Token Driver
                    </button>
                    <button
                      type="button"
                      onClick={() => alert('One-time remote Aadhaar eSign link sent to Partner mobile.')}
                      className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Send eSign Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: WALLET & EARNINGS */}
        {/* ======================================================== */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Lifetime Remittance Balance</span>
                  <h3 className="text-3xl font-black text-slate-900 mt-1 font-mono">
                    ₹{totalEarned.toLocaleString('en-IN')}
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                    {assignedOrders.length} Corporate Filings Executed • 100% Tax Deducted at Source
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Bank Account for Payouts</span>
                  <p className="font-bold text-slate-900 font-mono mt-0.5">HDFC Bank Ltd • A/C #****8849</p>
                  <p className="text-[10px] text-emerald-700 font-bold">ICSI Verified Professional Escrow</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div>
                  <span className="text-xs font-bold text-emerald-950">Available for Instant Remittance:</span>
                  <span className="text-xl font-black text-emerald-800 ml-2 font-mono">
                    ₹{totalEarned.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Withdrawal request of ₹${totalEarned} submitted! Funds credited to your ICSI escrow account via IMPS/NEFT within 2 hours.`)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Request Instant Bank Transfer
                </button>
              </div>

              {/* Payout History Ledger */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900">Professional Settlement Ledger (Form 16A Audit Trail)</h4>
                  <button
                    type="button"
                    onClick={() => alert('Downloading official TDS Form 16A Certificate...')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Form 16A Certificate</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold text-[10px] uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Filing Reference</th>
                        <th className="py-2.5 px-3">Entity Name</th>
                        <th className="py-2.5 px-3 text-right">Gross Fee</th>
                        <th className="py-2.5 px-3 text-right">TDS (10% u/s 194J)</th>
                        <th className="py-2.5 px-3 text-right">Net Remitted</th>
                        <th className="py-2.5 px-3 text-right">Settlement Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                      <tr>
                        <td className="py-2.5 px-3 font-sans">Oct 28, 2026</td>
                        <td className="py-2.5 px-3 text-blue-600">ORD-2026-8740</td>
                        <td className="py-2.5 px-3 font-sans font-bold">BioHealth Diagnostic Labs</td>
                        <td className="py-2.5 px-3 text-right font-bold">₹2,000</td>
                        <td className="py-2.5 px-3 text-right text-slate-500">₹200</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">₹1,800</td>
                        <td className="py-2.5 px-3 text-right font-sans"><span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Settled (IMPS)</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans">Oct 26, 2026</td>
                        <td className="py-2.5 px-3 text-blue-600">ORD-2026-8812</td>
                        <td className="py-2.5 px-3 font-sans font-bold">Zenith Organic Foods LLP</td>
                        <td className="py-2.5 px-3 text-right font-bold">₹1,200</td>
                        <td className="py-2.5 px-3 text-right text-slate-500">₹120</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">₹1,080</td>
                        <td className="py-2.5 px-3 text-right font-sans"><span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Settled (IMPS)</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans">Oct 24, 2026</td>
                        <td className="py-2.5 px-3 text-blue-600">ORD-2026-9041</td>
                        <td className="py-2.5 px-3 font-sans font-bold">TechNova Solutions Pvt Ltd</td>
                        <td className="py-2.5 px-3 text-right font-bold">₹1,500</td>
                        <td className="py-2.5 px-3 text-right text-slate-500">₹150</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">₹1,350</td>
                        <td className="py-2.5 px-3 text-right font-sans"><span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">In Escrow</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: BUSINESS ASSOCIATE & REFERRAL */}
        {/* ======================================================== */}
        {activeTab === 'referral' && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Partner Affiliate Program
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Refer Clients & Earn 10% Advisory Commission
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Refer startup founders or corporate clients to BharatFilings using your unique partner link. Earn ongoing revenue on GST, Trademark, and Annual ROC compliance filings.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-slate-800 truncate">
                  https://bharatfilings.in/ref/CS-PRIYA-11849
                </span>
                <button
                  type="button"
                  onClick={handleCopyReferral}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer transition shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Referred Founders</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">18 Founders</span>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-1">+4 this month</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Referral Bonus Earned</span>
                  <span className="text-2xl font-black text-emerald-700 mt-1 block font-mono">₹11,500</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Paid directly to wallet</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: INSPECT & DECRYPT DOSSIER */}
      {/* ======================================================== */}
      {previewDossierOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Client-Side Decrypted Sovereign Dossier
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {previewDossierOrder.companyName} ({previewDossierOrder.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDossierOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Registered Corporate Directors</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {previewDossierOrder.directors.map((dir, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-800">
                      {dir}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block font-sans">Managing Director PAN</span>
                  <span className="font-bold text-slate-800">ABCPS****F (Masked)</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block font-sans">Aadhaar e-KYC Verification</span>
                  <span className="text-emerald-700 font-bold">UIDAI Validated (XML)</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block font-sans">Registered Office Address</span>
                  <span className="font-bold text-slate-800">{previewDossierOrder.state}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block font-sans">Utility Electricity Bill</span>
                  <span className="text-emerald-700 font-bold">Valid (&lt;30 days old)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewDossierOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close Viewer
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Downloading zipped official SPICe+ dossier for ${previewDossierOrder.companyName}`);
                  setPreviewDossierOrder(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Full Dossier Bundle (.zip)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: RAISE RESUBMISSION REQUIREMENT */}
      {/* ======================================================== */}
      {resubmitModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-slate-900">
                  Raise ROC Defect / Resubmission Requirement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setResubmitModalOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Notify <strong>{resubmitModalOrder.customerName}</strong> for filing <strong>{resubmitModalOrder.id}</strong> ({resubmitModalOrder.companyName}).
            </p>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">Specific Clarification or Document Needed:</label>
              <textarea
                rows={3}
                value={resubmitReason}
                onChange={(e) => setResubmitReason(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold outline-none focus:border-amber-500 focus:bg-white"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setResubmitReason('Electricity bill older than 60 days. Please upload latest utility bill.')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                >
                  Old Utility Bill
                </button>
                <button
                  type="button"
                  onClick={() => setResubmitReason('Proposed company name conflicts with existing trademark Class 35. Please furnish TM NOC or choose alternate suffix.')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                >
                  Name Conflict
                </button>
                <button
                  type="button"
                  onClick={() => setResubmitReason('Director PAN signature mismatch. Please re-sign Form DIR-2.')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                >
                  DIR-2 Mismatch
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setResubmitModalOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendResubmitNotice}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send WhatsApp & Email Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}