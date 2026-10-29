'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Layers, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  Clock, 
  Search, 
  Filter, 
  Users, 
  FileText, 
  ExternalLink,
  Building2,
  RefreshCw,
  AlertTriangle,
  Download,
  CheckCircle,
  Clock4,
  FileCheck,
  Check,
  Eye,
  X
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSuccessBanner, setIsSuccessBanner] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inspectDocOrder, setInspectDocOrder] = useState<any | null>(null);

  const fetchOrders = () => {
    setIsLoading(true);
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) {
          setOrders(data.orders);
        } else if (data.success && data.data) {
          setOrders(data.data);
        }
      })
      .catch((err) => console.error('Error fetching admin orders:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Admin Document Verification Approval Handler
  const handleApproveDocuments = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          adminApproved: true,
          docVerificationStatus: 'Approved',
          status: 'Approved & Verified',
          docsPending: 'None (Verified by Admin)',
          adminApprovedAt: new Date().toISOString(),
          adminApprovedBy: 'Super Admin'
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccessBanner(`Order #${orderId} documents verified and approved! User registration is now successfully confirmed.`);
        setTimeout(() => setIsSuccessBanner(''), 5000);
        if (inspectDocOrder && (inspectDocOrder.orderId === orderId || inspectDocOrder.id === orderId)) {
          setInspectDocOrder(null);
        }
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to approve documents:', err);
    }
  };

  const handleAssignPartner = async (orderId: string, partnerName: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, assignedPartner: partnerName })
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccessBanner(`Successfully assigned ${partnerName} to order ${orderId}`);
        setTimeout(() => setIsSuccessBanner(''), 4000);
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to assign partner:', err);
    }
  };

  const handleReleaseCOI = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'release_certificate',
          cin: 'U72900MH2026PTC' + Math.floor(100000 + Math.random() * 900000),
          pan: 'AAACB' + Math.floor(1000 + Math.random() * 9000) + 'P',
          tan: 'MUMB' + Math.floor(10000 + Math.random() * 90000) + 'C'
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccessBanner(`Government Certificate of Incorporation (COI) released for order ${orderId}!`);
        setTimeout(() => setIsSuccessBanner(''), 4000);
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to release certificate:', err);
    }
  };

  const pendingApprovalCount = orders.filter(o => !o.adminApproved && (o.docVerificationStatus !== 'Approved')).length;
  const approvedCount = orders.filter(o => (o.adminApproved || o.docVerificationStatus === 'Approved') && !o.certificateUploaded).length;
  const completedCount = orders.filter(o => (o.status || '').toLowerCase().includes('incorporated') || (o.status || '').toLowerCase().includes('complete') || o.certificateUploaded).length;

  const filteredOrders = orders.filter((ord) => {
    const orderId = ord.orderId || ord.id || '';
    const customerName = ord.customerName || ord.auth?.name || '';
    const companyName = ord.companyName || ord.company?.primaryName || '';
    const isApproved = Boolean(ord.adminApproved || ord.docVerificationStatus === 'Approved');

    const matchesSearch = 
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      companyName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending_approval') return !isApproved;
    if (filterStatus === 'approved') return isApproved && !ord.certificateUploaded;
    if (filterStatus === 'completed') return ord.certificateUploaded || (ord.status || '').toLowerCase().includes('incorporated') || (ord.status || '').toLowerCase().includes('complete');
    return true;
  });

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <AdminNavbar 
        currentTitle="Orders & Filing Queue" 
        onRefresh={fetchOrders} 
        isLoading={isLoading} 
      />

      {/* Main Body Workspace */}
      <div className="flex-1 flex flex-row min-w-0 overflow-hidden">
        <AdminSidebar activeItem="orders" ordersCount={orders.length} />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overscroll-contain custom-scrollbar">
          {/* Action Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                    Admin Verification & Filing Desk
                  </span>
                  <span className="text-[12px] text-slate-500 font-medium">
                    Total Registrations: {orders.length}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Orders & Statutory Filing Queue
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify user-submitted KYC documents, approve registrations, allocate verified dockets to CA/CS counsel, and release government certificates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchOrders}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Sync Queue</span>
                </button>
              </div>
            </div>

            {/* Segmented Pipeline Stage Filter Tabs */}
            <div className="max-w-7xl mx-auto mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-lg border border-slate-200/80 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                    filterStatus === 'all'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Orders ({orders.length})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterStatus('pending_approval')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    filterStatus === 'pending_approval'
                      ? 'bg-white text-amber-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${pendingApprovalCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
                  <span>Pending Admin Verification ({pendingApprovalCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterStatus('approved')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    filterStatus === 'approved'
                      ? 'bg-white text-blue-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Approved & Active ({approvedCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterStatus('completed')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    filterStatus === 'completed'
                      ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>COI Released ({completedCount})</span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Order ID, Company, or Client..."
                  className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Alert Banner */}
          {isSuccessBanner && (
            <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-medium py-2.5 px-6 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{isSuccessBanner}</span>
            </div>
          )}

          {/* Orders Workspace Content */}
          <main className="max-w-7xl mx-auto w-full py-6 px-4 sm:px-6 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 shadow-xs">
                <Layers className="w-9 h-9 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-800 text-sm">No filing orders match this filter.</p>
                <p className="text-xs text-slate-400 mt-1">Try switching tabs or resetting your search query.</p>
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const orderId = ord.orderId || ord.id;
                const customerName = ord.customerName || ord.auth?.name || 'Applicant';
                const customerMobile = ord.auth?.mobile || ord.mobile || '';
                const customerEmail = ord.auth?.email || ord.email || '';
                const companyName = ord.companyName || ord.company?.primaryName || 'Proposed Entity';
                const state = ord.state || ord.company?.stateCode || 'MH';
                const service = ord.service || ord.company?.entityType || 'Corporate Registration';
                const amount = ord.amount || ord.pricing?.totalAmount || 0;
                const assignedPartner = ord.assignedPartner || ord.assignedCs?.name || 'Unassigned';
                const certificateUploaded = ord.certificateUploaded;

                const isApproved = Boolean(ord.adminApproved || ord.docVerificationStatus === 'Approved');
                const isCompleted = certificateUploaded || (ord.status || '').toLowerCase().includes('incorporated') || (ord.status || '').toLowerCase().includes('complete');

                return (
                  <div 
                    key={orderId} 
                    className={`bg-white rounded-xl border p-5 shadow-xs transition flex flex-col space-y-4 ${
                      !isApproved ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Top Row: Identification, Verification Status & Key Details */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {orderId}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            State: {state}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            Applicant: <strong className="text-slate-800">{customerName}</strong>
                            {customerMobile && <span className="font-mono text-slate-500"> (+91 {customerMobile})</span>}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                          {companyName}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>{service}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-800">Fee Paid: ₹{amount.toLocaleString('en-IN')}</span>
                        </p>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {isApproved ? (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Registration Approved by Admin</span>
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-800 bg-amber-100/80 border border-amber-300 px-3 py-1 rounded-full inline-flex items-center gap-1.5 animate-pulse">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending Admin Document Verification</span>
                          </span>
                        )}

                        {isCompleted && (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>COI Issued</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle Row: Document Docket Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Director KYC Proofs
                        </span>
                        <div className="text-slate-700 space-y-0.5">
                          {ord.directors && ord.directors.length > 0 ? (
                            ord.directors.map((d: any, i: number) => (
                              <p key={i} className="truncate">
                                <strong>{d.fullName || `Director ${i + 1}`}:</strong> PAN {d.panNumber || 'Submitted'} • Aadhaar {d.aadhaarNumber ? `XXXX-${d.aadhaarNumber.slice(-4)}` : 'Submitted'}
                              </p>
                            ))
                          ) : (
                            <p className="text-slate-500">2 Director Identity Dockets Attached</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Registered Office Proof
                        </span>
                        <p className="text-slate-700 truncate">
                          {ord.company?.officeAddress?.city || 'City'}, {state} • {ord.company?.officeAddress?.utilityBillType ? `${ord.company.officeAddress.utilityBillType.toUpperCase()} Bill` : 'Utility Proof Attached'}
                        </p>
                        <p className="text-[11px] text-slate-500">Owner NOC: {ord.company?.officeAddress?.hasNoc !== false ? 'Confirmed' : 'Pending'}</p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Legal Verification Status
                        </span>
                        <p className={`font-semibold ${isApproved ? 'text-emerald-700' : 'text-amber-800'}`}>
                          {isApproved 
                            ? `✓ Approved on ${ord.adminApprovedAt ? new Date(ord.adminApprovedAt).toLocaleDateString() : 'Today'}` 
                            : '⚠️ Requires Admin Approval to Complete User Registration'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Actions Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-medium">Assigned Counsel:</span>
                        <select
                          value={assignedPartner}
                          onChange={(e) => handleAssignPartner(orderId, e.target.value)}
                          className="text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                        >
                          <option value="Unassigned">Unassigned</option>
                          <option value="CS Priya Sharma (FCS #11849)">CS Priya Sharma (FCS #11849)</option>
                          <option value="CA Rajesh Varma (FCA #084920)">CA Rajesh Varma (FCA #084920)</option>
                          <option value="CS Amit Kulkarni (ACS #29381)">CS Amit Kulkarni (ACS #29381)</option>
                          <option value="CA Neha Gupta (FCA #104822)">CA Neha Gupta (FCA #104822)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {/* Inspect Docket Modal Trigger */}
                        <button
                          type="button"
                          onClick={() => setInspectDocOrder(ord)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                          <span>Inspect Submitted Docket</span>
                        </button>

                        {/* Admin Document Verification & Approval Button */}
                        {!isApproved ? (
                          <button
                            type="button"
                            onClick={() => handleApproveDocuments(orderId)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                            <span>Verify & Approve Registration</span>
                          </button>
                        ) : isCompleted ? (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>COI Released</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleReleaseCOI(orderId)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload & Release COI</span>
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

      {/* Inspect Document Docket Modal */}
      {inspectDocOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto"
          onClick={() => setInspectDocOrder(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto my-auto p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {inspectDocOrder.orderId || inspectDocOrder.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Submitted KYC & Corporate Address Docket
                </h3>
                <p className="text-xs text-slate-500">
                  {inspectDocOrder.company?.primaryName || inspectDocOrder.companyName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectDocOrder(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Applicant Details */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Applicant</span>
              <p className="font-semibold text-slate-900">
                {inspectDocOrder.auth?.name || inspectDocOrder.customerName || 'Applicant'} • {inspectDocOrder.auth?.email} • +91 {inspectDocOrder.auth?.mobile}
              </p>
            </div>

            {/* Directors KYC List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Director Identification Documents
              </h4>
              <div className="space-y-2">
                {(inspectDocOrder.directors || [
                  { fullName: 'Director 1', panNumber: 'ABCDE1234F', aadhaarNumber: 'XXXX-XXXX-8921', panDocName: 'PAN_Copy.pdf', aadhaarDocName: 'Aadhaar_Copy.pdf' }
                ]).map((dir: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{dir.fullName || `Director ${idx + 1}`}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        DigiLocker Attached
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-600 mt-1">
                      <div>
                        <span className="text-slate-400 block text-[11px]">PAN Proof:</span>
                        <span className="font-mono font-semibold text-slate-800">{dir.panNumber}</span> ({dir.panDocName || 'PAN_Document.pdf'})
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Aadhaar Proof:</span>
                        <span className="font-mono font-semibold text-slate-800">XXXX-XXXX-{String(dir.aadhaarNumber || '8921').slice(-4)}</span> ({dir.aadhaarDocName || 'Aadhaar_Document.pdf'})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Office Address Proof */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Registered Office Premises Proof
              </h4>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <p className="text-slate-800">
                  <strong>Premises Address:</strong> {inspectDocOrder.company?.officeAddress?.line1 || 'Registered Office'}, {inspectDocOrder.company?.officeAddress?.city || 'Mumbai'}, {inspectDocOrder.company?.stateCode || 'MH'} - {inspectDocOrder.company?.officeAddress?.pincode || '400001'}
                </p>
                <div className="flex items-center gap-4 text-slate-600">
                  <span><strong>Utility Bill:</strong> {inspectDocOrder.company?.officeAddress?.utilityBillType || 'Electricity'} ({inspectDocOrder.company?.officeAddress?.utilityBillDocName || 'Utility_Bill.pdf'})</span>
                  <span><strong>Landlord NOC:</strong> {inspectDocOrder.company?.officeAddress?.hasNoc !== false ? '✓ Attached' : 'Pending'}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setInspectDocOrder(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>

              {!inspectDocOrder.adminApproved && inspectDocOrder.docVerificationStatus !== 'Approved' ? (
                <button
                  type="button"
                  onClick={() => handleApproveDocuments(inspectDocOrder.orderId || inspectDocOrder.id)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Verify & Approve All Documents</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Documents Already Approved</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
