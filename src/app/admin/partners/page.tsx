'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Users, 
  ArrowLeft, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Briefcase, 
  Building2, 
  Search, 
  Phone, 
  Mail, 
  ExternalLink,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { PARTNERS_DATA } from '@/data/partnersData';

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState(PARTNERS_DATA);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [notification, setNotification] = useState('');

  const states = ['All', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat'];

  const filteredPartners = partners.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.councilNumber.toLowerCase().includes(q) ||
      p.specialization.toLowerCase().includes(q);

    const matchesState = selectedState === 'All' || p.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <AdminNavbar currentTitle="Verified CA/CS Roster" />

      {/* Main Body Workspace */}
      <div className="flex-1 flex flex-row min-w-0">
        <AdminSidebar activeItem="partners" />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Action Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                    Professional Counsel Network
                  </span>
                  <span className="text-[12px] text-slate-500 font-medium">
                    ICAI & ICSI Accredited Roster
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Verified CA & CS Counsel Directory
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-vetted practicing Chartered Accountants and Company Secretaries executing MCA SPICe+ drafting and ROC filings.
                </p>
              </div>

              {/* Network Health Strip */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">Active Counsel</span>
                  <span className="text-sm font-bold text-slate-900">{partners.length}</span>
                </div>
                <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                  <span className="text-[10px] uppercase font-semibold text-emerald-700 block">COP Validated</span>
                  <span className="text-sm font-bold text-emerald-800">{partners.length > 0 ? '100%' : '0%'}</span>
                </div>
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="max-w-7xl mx-auto mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-lg border border-slate-200/80 text-xs">
                {states.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedState(st)}
                    className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                      selectedState === st
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, COP or membership..."
                  className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Practitioner Cards Grid */}
          <main className="max-w-7xl mx-auto w-full py-6 px-4 sm:px-6">
            {filteredPartners.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
                <Users className="w-9 h-9 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No verified professionals found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  {search || selectedState !== 'All' 
                    ? "No legal or accounting partners match the selected filter criteria." 
                    : "No external CA/CS partners have been onboarded yet. Newly enrolled professionals will appear here."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPartners.map((ptr) => {
                  const activeCases = ptr.status === 'Available' ? 2 : 4;
                  const isAtCapacity = activeCases >= 4;

                  return (
                    <div 
                      key={ptr.id} 
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Header of Card */}
                        <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                              {ptr.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 leading-tight">{ptr.name}</h3>
                              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-block mt-0.5">
                                {ptr.title}
                              </span>
                            </div>
                          </div>

                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{ptr.copStatus}</span>
                          </span>
                        </div>

                        {/* Credential Details */}
                        <div className="py-3 space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 font-medium">Council Number:</span>
                            <span className="font-mono font-semibold text-slate-800">{ptr.councilNumber}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 font-medium">Experience:</span>
                            <span className="font-semibold text-slate-800">{ptr.experienceYears} Years Practicing</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 font-medium">Jurisdiction:</span>
                            <span className="font-medium text-slate-800 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {ptr.state}
                            </span>
                          </div>

                          {/* Workload Progress Bar */}
                          <div className="pt-2">
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-slate-500 font-medium">Active Docket Capacity:</span>
                              <span className={`font-semibold ${isAtCapacity ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {activeCases} / 5 Active
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${isAtCapacity ? 'bg-amber-500' : 'bg-blue-600'}`} 
                                style={{ width: `${(activeCases / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: Contact & Assign Action */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{ptr.copStatus || 'Verified Counsel'}</span>
                        </div>

                        <Link
                          href="/admin/orders"
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                        >
                          Assign Docket
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
