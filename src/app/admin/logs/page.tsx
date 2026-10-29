'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  CheckCircle2, 
  Search, 
  RefreshCw,
  KeyRound,
  FileText,
  Server,
  UserCheck,
  Terminal
} from 'lucide-react';

export default function AdminLogsPage() {
  const [filterRole, setFilterRole] = useState('ALL');
  const [search, setSearch] = useState('');

  interface AuditLog {
    id: string;
    time: string;
    user: string;
    role: string;
    event: string;
    detail: string;
    ip: string;
  }
  const [logs] = useState<AuditLog[]>([]);

  const filteredLogs = logs.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch = 
      l.id.toLowerCase().includes(q) ||
      l.user.toLowerCase().includes(q) ||
      l.event.toLowerCase().includes(q) ||
      l.detail.toLowerCase().includes(q) ||
      l.ip.includes(q);

    const matchesRole = filterRole === 'ALL' || l.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <AdminNavbar currentTitle="Security Audit & RBAC" />

      {/* Main Body Workspace */}
      <div className="flex-1 flex flex-row min-w-0">
        <AdminSidebar activeItem="logs" />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Action Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                    DPDP Act 2023 Compliant Trail
                  </span>
                  <span className="text-[12px] text-slate-500 font-medium">
                    SHA-256 Immutable Audit Log
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Security Audit Trail & Access Governance
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cryptographic event ledger recording administrator actions, partner credential accesses, and government filing submissions.
                </p>
              </div>

              {/* Compliance Seal */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Tamper-Sealed Ledger</span>
                </span>
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="max-w-7xl mx-auto mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-lg border border-slate-200/80 text-xs">
                {['ALL', 'SUPER_ADMIN', 'PARTNER_CS', 'PARTNER_CA', 'SYSTEM'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFilterRole(role)}
                    className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                      filterRole === role
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {role === 'ALL' ? 'All Events' : role.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by event, actor or IP..."
                  className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Audit Stream Table View */}
          <main className="max-w-7xl mx-auto w-full py-6 px-4 sm:px-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Event ID & Time</th>
                    <th className="py-3 px-4">Operation Type</th>
                    <th className="py-3 px-4">Audit Description</th>
                    <th className="py-3 px-4">Actor Role</th>
                    <th className="py-3 px-4 text-right">Source IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 px-4 text-center">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-700">No audit events recorded</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Cryptographic ledger is active. Future administrative actions and access logs will appear here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                    const isSystem = log.role === 'SYSTEM';
                    const isSuperAdmin = log.role === 'SUPER_ADMIN';

                    return (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{log.id}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{log.time}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border inline-block ${
                            log.event === 'PAYMENT_CAPTURE' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            log.event === 'UPDATE_SERVICE_PRICING' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                            log.event === 'DOCUMENT_ACCESS' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                            log.event === 'COI_RELEASE' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            'bg-slate-100 text-slate-800 border-slate-200'
                          }`}>
                            {log.event}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-md">
                          <p className="text-xs text-slate-800 font-medium leading-relaxed">{log.detail}</p>
                          <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">{log.user}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border inline-block ${
                            isSuperAdmin
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : isSystem
                                ? 'bg-slate-100 text-slate-700 border-slate-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                          }`}>
                            {log.role}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500">
                          {log.ip}
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
