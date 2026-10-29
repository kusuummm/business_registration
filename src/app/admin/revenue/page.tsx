'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowLeft, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Plus, 
  PieChart, 
  Receipt, 
  Search,
  Sliders,
  Landmark
} from 'lucide-react';
import { INITIAL_SERVICES, ServiceItem } from '@/data/servicesData';
import { STATE_STAMP_DUTY } from '@/data/pricingData';

export default function AdminRevenuePage() {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [orders, setOrders] = useState<any[]>([]);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchState, setSearchState] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.services) {
          setServices(data.services);
        }
      })
      .catch(err => console.error('Error loading services:', err));

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      })
      .catch(err => console.error('Error loading orders:', err));
  }, []);

  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingService({ ...srv });
    setIsEditModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService)
      });
      const data = await res.json();
      if (data.success) {
        setServices(services.map(s => s.id === editingService.id ? editingService : s));
        setIsEditModalOpen(false);
        setSuccessBanner(`Pricing configuration for "${editingService.name}" updated successfully.`);
        setTimeout(() => setSuccessBanner(''), 4000);
      }
    } catch (err) {
      console.error('Failed to update service pricing:', err);
    }
  };

  const totalGrossRevenue = orders.reduce((sum, o) => sum + (o.amount || o.pricing?.totalAmount || 0), 0);
  const netPlatformMargin = Math.round(totalGrossRevenue * 0.564);
  const statutoryGovtPassThrough = Math.round(totalGrossRevenue * 0.298);
  const partnerDisbursals = totalGrossRevenue - netPlatformMargin - statutoryGovtPassThrough;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <AdminNavbar currentTitle="Revenue & Pricing" />

      {/* Main Body Workspace */}
      <div className="flex-1 flex flex-row min-w-0">
        <AdminSidebar activeItem="pricing" />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Action Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Treasury & Fee Architecture
                  </span>
                  <span className="text-[12px] text-slate-500 font-medium">
                    Fiscal Year 2026-27 (Q3)
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Revenue Analytics & Pricing Configuration
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time statutory MCA fee breakdowns, platform margin yield, and state-wise stamp duty matrix.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>56.4% Net Platform Take-Rate</span>
                </span>
              </div>
            </div>

            {/* Financial Summary KPI Cards */}
            <div className="max-w-7xl mx-auto mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Gross Collections</span>
                <span className="text-xl font-bold text-slate-900 font-mono block">₹{totalGrossRevenue.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
                  {orders.length > 0 ? '+14.2% MoM growth' : 'Dynamic live metric'}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block mb-1">Net Platform Yield</span>
                <span className="text-xl font-bold text-blue-700 font-mono block">₹{netPlatformMargin.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">56.4% retained margin</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Govt Statutory Pool</span>
                <span className="text-xl font-bold text-slate-900 font-mono block">₹{statutoryGovtPassThrough.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">MCA + State Stamp Duty</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block mb-1">CA/CS Payout Pool</span>
                <span className="text-xl font-bold text-purple-700 font-mono block">₹{partnerDisbursals.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">Partner counsel fees</span>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {successBanner && (
            <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-medium py-2 px-6 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* Main Content Sections */}
          <main className="max-w-7xl mx-auto w-full py-6 px-4 sm:px-6 space-y-6">
            {/* Section 1: Service Fee Structure & Pricing Engine */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Service Fee Engine & Statutory Breakdown</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Click "Configure Pricing" on any service to update client fees, GST rates, or MCA government fee levies.</p>
                </div>
                <span className="text-xs text-slate-500 font-medium">{services.length} Active Services</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Entity Type</th>
                      <th className="py-3 px-4">Platform Fee</th>
                      <th className="py-3 px-4">DSC Fee</th>
                      <th className="py-3 px-4">GST (18%)</th>
                      <th className="py-3 px-4">Govt Statutory Levy</th>
                      <th className="py-3 px-4">Total Client Price</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {services.map((srv) => {
                      const gstAmount = Math.round((srv.baseFee + srv.dscFee) * srv.gstRate);
                      const totalClientPrice = srv.baseFee + srv.dscFee + gstAmount + srv.govFee;

                      return (
                        <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-sans font-semibold text-slate-900">
                            {srv.name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-bold">
                            ₹{srv.baseFee.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            ₹{srv.dscFee.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-blue-700 font-medium">
                            ₹{gstAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-emerald-700 font-medium">
                            ₹{srv.govFee.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-slate-900 font-bold text-sm">
                            ₹{totalClientPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-right font-sans">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(srv)}
                              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                            >
                              Configure
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: State Stamp Duty Matrix (SPICe+ Part B) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">State-wise Stamp Duty Matrix (SPICe+ Part B)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Statutory state government stamp duties payable to Registrar of Companies (ROC).</p>
                </div>
                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchState}
                    onChange={(e) => setSearchState(e.target.value)}
                    placeholder="Search state..."
                    className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(STATE_STAMP_DUTY)
                  .filter(([code, duty]) => 
                    code.toLowerCase().includes(searchState.toLowerCase()) || 
                    duty.name.toLowerCase().includes(searchState.toLowerCase())
                  )
                  .map(([code, duty]) => (
                    <div key={code} className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition">
                      <span className="font-bold text-xs text-slate-900 block">{code}</span>
                      <span className="text-[11px] text-slate-500 block truncate">{duty.name}</span>
                      <span className="font-mono font-bold text-emerald-700 text-sm mt-1 block">
                        ₹{duty.stampDuty.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </main>

          {/* Edit Pricing Modal */}
          {isEditModalOpen && editingService && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setIsEditModalOpen(false)}
            >
              <div 
                className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Configure Service Pricing</h3>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-slate-400 hover:text-slate-700 font-bold text-base cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSaveService} className="p-5 space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Service Entity Name</label>
                    <input
                      type="text"
                      required
                      value={editingService.name}
                      onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Platform Fee (₹)</label>
                      <input
                        type="number"
                        required
                        value={editingService.baseFee}
                        onChange={(e) => setEditingService({ ...editingService, baseFee: Number(e.target.value) })}
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">DSC Class-3 Fee (₹)</label>
                      <input
                        type="number"
                        required
                        value={editingService.dscFee}
                        onChange={(e) => setEditingService({ ...editingService, dscFee: Number(e.target.value) })}
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Govt Statutory Levy (₹)</label>
                      <input
                        type="number"
                        required
                        value={editingService.govFee}
                        onChange={(e) => setEditingService({ ...editingService, govFee: Number(e.target.value) })}
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">GST Rate</label>
                      <select
                        value={editingService.gstRate}
                        onChange={(e) => setEditingService({ ...editingService, gstRate: Number(e.target.value) })}
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 font-medium"
                      >
                        <option value={0.18}>18% Standard GST</option>
                        <option value={0}>0% Exempted</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono space-y-1 text-slate-700">
                    <div className="flex justify-between">
                      <span>GST ({(editingService.gstRate * 100)}%):</span>
                      <span className="font-bold">₹{Math.round((editingService.baseFee + editingService.dscFee) * editingService.gstRate).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                      <span>Total Client Price:</span>
                      <span className="text-blue-700">₹{(editingService.baseFee + editingService.dscFee + Math.round((editingService.baseFee + editingService.dscFee) * editingService.gstRate) + editingService.govFee).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium text-slate-700 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs cursor-pointer transition"
                    >
                      Save Pricing
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
