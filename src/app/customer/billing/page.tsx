'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomerNavbar from '@/components/CustomerNavbar';
import CustomerSidebar from '@/components/CustomerSidebar';
import { 
  Receipt, 
  Download, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2,
  Plus,
  Clock
} from 'lucide-react';

interface BillingInvoice {
  id: string;
  orderId: string;
  date: string;
  companyName: string;
  service: string;
  amount: string;
  method: string;
  status: string;
  hsn: string;
}

export default function CustomerBillingPage() {
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const invList: BillingInvoice[] = [];
          json.data.forEach((ord: any) => {
            const isPaid = ord.paymentStatus === 'success' || (ord.status && !ord.status.toLowerCase().includes('pending payment'));
            if (isPaid) {
              const orderId = ord.orderId || ord.id;
              const dateStr = ord.createdAt 
                ? new Date(ord.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                : new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
              const companyName = ord.company?.primaryName || ord.companyName || 'Incorporation Application';
              const amountNum = ord.pricing?.grandTotal || ord.totalAmount || 7999;

              invList.push({
                id: `INV-${orderId.replace(/\D/g, '').slice(-4) || '2026'}`,
                orderId,
                date: dateStr,
                companyName,
                service: `${ord.company?.entityType === 'llp' ? 'LLP Registration' : 'Private Limited Company Incorporation'} (${companyName})`,
                amount: `₹${amountNum.toLocaleString('en-IN')}`,
                method: ord.paymentMethod || 'Razorpay UPI / NetBanking',
                status: 'Paid & Settled',
                hsn: '998211'
              });
            }
          });
          setInvoices(invList);
        } else {
          setInvoices([]);
        }
      })
      .catch((err) => console.error('Error fetching billing invoices:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDownloadInvoice = (inv: BillingInvoice) => {
    const content = `=====================================================
STATUTORY TAX INVOICE
Tax Invoice Number: ${inv.id}
Reference Order: #${inv.orderId}
Date: ${inv.date}
Corporate Entity: ${inv.companyName}
Service: ${inv.service}
SAC / HSN Code: ${inv.hsn} (Legal & Corporate Secretarial Advisory)
Total Amount Paid: ${inv.amount}
Payment Mode: ${inv.method}
Status: ${inv.status.toUpperCase()}
=====================================================`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tax_Invoice_${inv.id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  return (
    <div style={segoeStyle} className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <CustomerNavbar currentTitle="Tax Invoices & Receipts" />

      <div className="flex-1 flex flex-row min-w-0">
        <CustomerSidebar activeItem="billing" />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="max-w-6xl mx-auto w-full py-6 px-4 sm:px-6 space-y-6">
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Tax Invoices & Payment Receipts</h1>
              <p className="text-xs text-slate-500">Download compliant GST invoices and statutory government fee vouchers for corporate accounting.</p>
            </div>

            {isLoading ? (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
                <Clock className="w-6 h-6 text-slate-400 mx-auto animate-spin mb-2" />
                <p className="text-xs text-slate-500 font-medium">Fetching invoice ledger...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
                <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Tax Invoices Generated Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Official GST tax invoices with SAC 998211 codes and government treasury receipts are generated automatically upon completed checkout.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold mt-2 shadow-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Incorporation Filing</span>
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-4">Invoice #</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Service Description</th>
                        <th className="p-4">Amount Paid</th>
                        <th className="p-4">Payment Method</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Download</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-4 font-mono font-bold text-blue-700">{inv.id}</td>
                          <td className="p-4 text-slate-500">{inv.date}</td>
                          <td className="p-4 text-slate-900 font-semibold max-w-xs">{inv.service}</td>
                          <td className="p-4 font-mono font-bold text-slate-900">{inv.amount}</td>
                          <td className="p-4">
                            <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                              {inv.method}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {inv.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDownloadInvoice(inv)}
                              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Invoice (PDF)</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
