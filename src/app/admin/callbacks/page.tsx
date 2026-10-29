'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  PhoneCall, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  Clock, 
  Phone,
  MessageSquare,
  CheckCircle,
  ExternalLink,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function AdminCallbacksPage() {
  const [callbacks, setCallbacks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');

  const fetchCallbacks = () => {
    setIsLoading(true);
    fetch('/api/callbacks')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.callbacks) {
          setCallbacks(data.callbacks);
        }
      })
      .catch((err) => console.error('Error fetching callbacks:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCallbacks();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/callbacks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setNotification(`Lead #${id} updated to "${status}"`);
        setTimeout(() => setNotification(''), 3500);
        fetchCallbacks();
      }
    } catch (err) {
      console.error('Error updating callback:', err);
    }
  };

  const filteredCallbacks = callbacks.filter((cb) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (cb.name || '').toLowerCase().includes(q) ||
      (cb.phone || '').includes(q) ||
      (cb.service || '').toLowerCase().includes(q) ||
      (cb.id || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    return (cb.status || '').toLowerCase() === filterStatus.toLowerCase();
  });

  const pendingCount = callbacks.filter(c => (c.status || '').toLowerCase() === 'pending').length;
  const contactedCount = callbacks.filter(c => (c.status || '').toLowerCase() === 'contacted').length;
  const convertedCount = callbacks.filter(c => (c.status || '').toLowerCase() === 'converted').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <AdminNavbar 
        currentTitle="Consultation Leads" 
        onRefresh={fetchCallbacks} 
        isLoading={isLoading} 
      />

      {/* Main Body Workspace */}
      <div className="flex-1 flex flex-row min-w-0">
        <AdminSidebar activeItem="callbacks" callbacksCount={callbacks.length} />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Action Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Inbound CRM Desk
                  </span>
                  <span className="text-[12px] text-slate-500 font-medium">
                    Total Inquiries: {callbacks.length}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Consultation Inquiries & Leads Desk
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct client callback requests for company registration, GST licensing, and compliance counsel.
                </p>
              </div>

              {/* CRM Key Metrics Strip */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-center">
                  <span className="text-[10px] uppercase font-semibold text-amber-700 block">Pending</span>
                  <span className="text-sm font-bold text-amber-800">{pendingCount}</span>
                </div>
                <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <span className="text-[10px] uppercase font-semibold text-blue-700 block">Contacted</span>
                  <span className="text-sm font-bold text-blue-800">{contactedCount}</span>
                </div>
                <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                  <span className="text-[10px] uppercase font-semibold text-emerald-700 block">Converted</span>
                  <span className="text-sm font-bold text-emerald-800">{convertedCount}</span>
                </div>
              </div>
            </div>

            {/* Filter Tabs & Search */}
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
                  All Inquiries ({callbacks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('pending')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    filterStatus === 'pending'
                      ? 'bg-white text-amber-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Pending Call ({pendingCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('contacted')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    filterStatus === 'contacted'
                      ? 'bg-white text-blue-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Contacted ({contactedCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('converted')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    filterStatus === 'converted'
                      ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Converted to Order ({convertedCount})</span>
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone or service..."
                  className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Alert Notification */}
          {notification && (
            <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-medium py-2 px-6 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{notification}</span>
            </div>
          )}

          {/* CRM Leads Table/Card View */}
          <main className="max-w-7xl mx-auto w-full py-6 px-4 sm:px-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Lead ID & Customer</th>
                    <th className="py-3 px-4">Service of Interest</th>
                    <th className="py-3 px-4">Preferred Slot</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Quick Contact & Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCallbacks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 px-4 text-center">
                        <PhoneCall className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-700">No consultation inquiries</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          New callback requests and leads from the portal will appear here in real-time.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredCallbacks.map((cb) => {
                      const isPending = (cb.status || '').toLowerCase() === 'pending';
                      const isContacted = (cb.status || '').toLowerCase() === 'contacted';
                      const isConverted = (cb.status || '').toLowerCase() === 'converted';

                      return (
                        <tr key={cb.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                                {(cb.name || 'C').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 block">{cb.name}</span>
                                <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] mt-0.5">
                                  <span>{cb.phone}</span>
                                  <span>•</span>
                                  <span className="text-[10px] text-slate-400">{cb.id}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 inline-block text-[11px]">
                              {cb.service || 'Private Limited Incorporation'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{cb.timeSlot || 'Anytime Today'}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{cb.timestamp || 'Just now'}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border inline-flex items-center gap-1.5 ${
                              isConverted
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isContacted
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isConverted ? 'bg-emerald-500' : isContacted ? 'bg-blue-500' : 'bg-amber-500'
                              }`} />
                              <span>{cb.status || 'Pending'}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Direct Dial Link */}
                              <a
                                href={`tel:${cb.phone}`}
                                title={`Call ${cb.name}`}
                                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition shadow-2xs"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>

                              {/* WhatsApp Chat Link */}
                              <a
                                href={`https://wa.me/91${(cb.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${cb.name}, this is BharatFilings reaching out regarding your inquiry on ${cb.service || 'company incorporation'}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Chat on WhatsApp"
                                className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition shadow-2xs"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>

                              {/* Status Action Buttons */}
                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(cb.id, 'Contacted')}
                                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                                >
                                  Mark Contacted
                                </button>
                              )}

                              {!isConverted && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(cb.id, 'Converted')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                                >
                                  Convert to Order
                                </button>
                              )}
                            </div>
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
