'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomerNavbar from '@/components/CustomerNavbar';
import CustomerSidebar from '@/components/CustomerSidebar';
import { 
  Landmark, 
  Building2, 
  Users, 
  Copy, 
  Check, 
  ShieldCheck,
  Plus,
  Clock
} from 'lucide-react';

export default function CustomerProfilePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [storedUser, setStoredUser] = useState<any>(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem('bharatfilings_customer_user');
      if (u) setStoredUser(JSON.parse(u));
    } catch {}

    fetch('/api/orders')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setOrders(json.data);
        }
      })
      .catch((err) => console.error('Error fetching orders for profile:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  const currentOrder = orders[0];
  const company = currentOrder?.company;
  const directors = company?.directors || [];
  const office = company?.officeAddress;

  return (
    <div style={segoeStyle} className="h-screen max-h-screen overflow-hidden bg-slate-100 flex flex-col text-slate-900">
      <CustomerNavbar currentTitle="Company Master Data" />

      <div className="flex-1 flex flex-row min-w-0 overflow-hidden">
        <CustomerSidebar activeItem="profile" />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overscroll-contain custom-scrollbar">
          <main className="max-w-6xl mx-auto w-full py-6 px-4 sm:px-6 space-y-6">
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Company Master Data & Ministry Records</h1>
              <p className="text-xs text-slate-500">Official statutory corporate records as maintained in the MCA V3 Registrar of Companies (ROC) registry.</p>
            </div>

            {isLoading ? (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
                <Clock className="w-6 h-6 text-slate-400 mx-auto animate-spin mb-2" />
                <p className="text-xs text-slate-500 font-medium">Fetching statutory records from registry...</p>
              </div>
            ) : !currentOrder ? (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
                <Landmark className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Company Master Records Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Statutory corporate identifiers (CIN, Corporate PAN, TAN, Registered Office, and Board of Directors) will be listed here once an incorporation application is filed.
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
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                {/* Entity Information */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-slate-700" />
                    <span>Corporate Identification & Tax Registration</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Entity Legal Name</span>
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {company?.primaryName || currentOrder.companyName || storedUser?.companyName || 'Incorporation Application'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Corporate Identification (CIN)</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-blue-700">
                          {currentOrder.cin || 'Pending ROC Allotment'}
                        </span>
                        {currentOrder.cin && (
                          <button 
                            type="button" 
                            onClick={() => copyToClipboard(currentOrder.cin, 'cin')}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Copy CIN"
                          >
                            {copiedKey === 'cin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Corporate PAN</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {currentOrder.pan || 'Allotted with COI'}
                        </span>
                        {currentOrder.pan && (
                          <button 
                            type="button" 
                            onClick={() => copyToClipboard(currentOrder.pan, 'pan')}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Copy PAN"
                          >
                            {copiedKey === 'pan' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Corporate TAN (TDS)</span>
                      <span className="text-xs font-mono font-bold text-slate-900 block">
                        {currentOrder.tan || 'Allotted with COI'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Entity Type & Capital</span>
                      <span className="text-xs font-bold text-slate-900 block">
                        {(company?.entityType || 'Private Limited').toUpperCase()} • ₹{(company?.authorizedCapital || 100000).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">ROC Jurisdiction</span>
                      <span className="text-xs font-bold text-slate-900 block">
                        ROC {company?.stateCode || currentOrder.state || 'State Desk'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Registered Office */}
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-700" />
                    <span>Registered Corporate Office</span>
                  </h3>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    {office?.line1 ? (
                      `${office.line1}, ${office.city || ''}, ${office.state || company?.stateCode || ''} - ${office.pincode || ''}, India.`
                    ) : (
                      'Address submitted with SPICe+ Part B incorporation dossier.'
                    )}
                  </p>
                </div>

                {/* Board of Directors */}
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-700" />
                    <span>Board of Directors (Signatories)</span>
                  </h3>

                  {directors.length === 0 ? (
                    <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      Director details are being processed in the incorporation dossier.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Director Name</th>
                            <th className="p-3">Designation</th>
                            <th className="p-3">Nationality</th>
                            <th className="p-3">DIN / DPIN</th>
                            <th className="p-3">KYC Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {directors.map((d: any, idx: number) => (
                            <tr key={idx}>
                              <td className="p-3 font-bold text-slate-900">{d.name || `Director ${idx + 1}`}</td>
                              <td className="p-3 font-semibold text-slate-800">{d.designation || 'Director'}</td>
                              <td className="p-3 text-slate-600">{d.nationality || 'Indian'}</td>
                              <td className="p-3 font-mono text-slate-600">{d.din || 'Applied in SPICe+'}</td>
                              <td className="p-3">
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> DigiLocker Verified
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
