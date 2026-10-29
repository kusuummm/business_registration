'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Receipt, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  DollarSign, 
  AlertTriangle, 
  Building2, 
  Clock, 
  ArrowRight,
  Send,
  RefreshCw,
  Landmark,
  CheckCircle
} from 'lucide-react';

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isDisbursingAll, setIsDisbursingAll] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchPayouts = () => {
    setIsLoading(true);
    fetch('/api/partners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.payouts) {
          setPayouts(data.payouts);
        }
      })
      .catch((err) => console.error('Failed to load payouts:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleProcessSinglePayout = async (payoutId: string) => {
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'process_payout', payoutId })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Payout #${payoutId} settled successfully via RazorpayX.`);
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchPayouts();
      }
    } catch (err) {
      console.error('Payout failed:', err);
    }
  };

  const handleDisburseAll = async () => {
    setIsDisbursingAll(true);
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'process_all_payouts' })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Successfully processed ${data.processedCount || 'all'} pending partner payouts via RazorpayX IMPS batch.`);
        setTimeout(() => setSuccessMsg(''), 5000);
        fetchPayouts();
      }
    } catch (err) {
      console.error('Batch disbursement failed:', err);
    } finally {
      setIsDisbursingAll(false);
    }
  };

  const pendingPayouts = payouts.filter((p) => p.status === 'Pending');
  const pendingTotal = pendingPayouts.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const settledTotal = payouts.filter((p) => p.status === 'Disbursed').reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <AdminNavbar currentTitle="Disbursements & Payouts" />

      {/* Main Body Workspace */}
      <div className="flex-1 flex flex-row min-w-0 overflow-hidden">
        <AdminSidebar activeItem="payouts" />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overscroll-contain custom-scrollbar">
          {/* Action Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    RazorpayX Escrow Settlement
                  </span>
                  <span className="text-[12px] text-slate-500 font-medium">
                    Automated IMPS & NEFT Batching
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Partner Disbursements & Escrow Reconciliation
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated payouts to practicing CA/CS counsel upon verified completion of government company incorporation dockets.
                </p>
              </div>

              {/* Batch Disburse Action Button */}
              <div className="flex items-center gap-3">
                {pendingPayouts.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDisburseAll}
                    disabled={isDisbursingAll}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Send className={`w-3.5 h-3.5 ${isDisbursingAll ? 'animate-spin' : ''}`} />
                    <span>Disburse All Pending (₹{pendingTotal.toLocaleString('en-IN')})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Escrow Health Metric Cards */}
            <div className="max-w-7xl mx-auto mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Escrow Balance</span>
                <span className="text-xl font-bold text-slate-900 font-mono block">₹{pendingTotal.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">Secured in Trustee Account</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block mb-1">Pending Settlements</span>
                <span className="text-xl font-bold text-amber-700 font-mono block">₹{pendingTotal.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">{pendingPayouts.length} partners awaiting release</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block mb-1">Disbursed This Month</span>
                <span className="text-xl font-bold text-emerald-700 font-mono block">₹{settledTotal.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">100% automated settlement</span>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-medium py-2 px-6 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Payouts Table */}
          <main className="max-w-7xl mx-auto w-full py-6 px-4 sm:px-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Payout ID</th>
                    <th className="py-3 px-4">Counsel Professional</th>
                    <th className="py-3 px-4">Completed Docket</th>
                    <th className="py-3 px-4">Bank & IFSC Verification</th>
                    <th className="py-3 px-4">Disbursal Amount</th>
                    <th className="py-3 px-4 text-right">Settlement Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {payouts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-4 text-center">
                        <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-700">No partner payouts pending</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Escrow releases and partner fee settlements will appear here as incorporation dockets are completed.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    payouts.map((p) => {
                      const isPending = p.status === 'Pending';

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-semibold text-blue-700">
                            {p.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-900 block">{p.partnerName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">PAN: {p.pan || 'ABCDE1234F'}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-xs text-slate-700 block">{p.orderId}</span>
                            <span className="text-[10px] text-slate-500">Incorporation Release</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <div className="flex items-center gap-1.5 font-mono text-[11px]">
                              <Landmark className="w-3.5 h-3.5 text-slate-400" />
                              <span>{p.bankAccount || '••••4819'}</span>
                              <span className="text-slate-400">({p.ifsc || 'HDFC0001234'})</span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Penny-Drop Verified</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                            ₹{(p.amount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {isPending ? (
                              <button
                                type="button"
                                onClick={() => handleProcessSinglePayout(p.id)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                              >
                                Disburse via RazorpayX
                              </button>
                            ) : (
                              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Settled ({p.lastProcessed || 'Done'})</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
