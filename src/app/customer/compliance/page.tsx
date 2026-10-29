'use client';

import React, { useState, useMemo } from 'react';
import CustomerNavbar from '@/components/CustomerNavbar';
import CustomerSidebar from '@/components/CustomerSidebar';
import { 
  Calendar, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Check
} from 'lucide-react';

export default function CustomerCompliancePage() {
  const [statusNotice, setStatusNotice] = useState('');
  const [selectedAuthority, setSelectedAuthority] = useState<string>('All');
  const [activeReminders, setActiveReminders] = useState<Record<string, boolean>>({});

  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  const complianceItems = [
    { 
      id: 'dir3-kyc',
      name: 'Director DIR-3 KYC Verification', 
      due: '30 September 2027', 
      dueIso: '2027-09-30',
      penalty: '₹5,000 late fee per director & DIN deactivation', 
      status: 'Upcoming',
      authority: 'Ministry of Corporate Affairs (MCA)',
      riskLevel: 'High',
      desc: 'Annual identity verification for all DIN holders via web OTP authentication.'
    },
    { 
      id: 'aoc4-filing',
      name: 'Form AOC-4 Financial Statements Filing', 
      due: '30 October 2027', 
      dueIso: '2027-10-30',
      penalty: '₹100/day ongoing statutory penalty under Sec 137', 
      status: 'Scheduled',
      authority: 'Registrar of Companies (ROC)',
      riskLevel: 'Medium',
      desc: 'Balance sheet, profit & loss statement, auditor report, and board report submission.'
    },
    { 
      id: 'mgt7-filing',
      name: 'Form MGT-7 Annual Return Submission', 
      due: '29 November 2027', 
      dueIso: '2027-11-29',
      penalty: '₹100/day ongoing statutory penalty under Sec 92', 
      status: 'Scheduled',
      authority: 'Registrar of Companies (ROC)',
      riskLevel: 'Medium',
      desc: 'Annual return covering shareholding structure, indebtedness, and director meetings.'
    },
    { 
      id: 'gstr3b-monthly',
      name: 'Monthly GSTR-3B Return Filing', 
      due: '20th of Every Month', 
      dueIso: '2026-11-20',
      penalty: '₹50/day late fee + 18% annual interest', 
      status: 'Active',
      authority: 'GST Council / CBIC',
      riskLevel: 'High',
      desc: 'Summary return of outward and inward supplies along with payment of tax liability.'
    },
    {
      id: 'adt1-auditor',
      name: 'Form ADT-1 Statutory Auditor Appointment',
      due: 'Within 15 days of First AGM',
      dueIso: '2027-09-15',
      penalty: 'Default in ROC filing under Section 139',
      status: 'Scheduled',
      authority: 'Registrar of Companies (ROC)',
      riskLevel: 'Low',
      desc: 'Intimation of statutory auditor appointment for a 5-year block tenure.'
    },
    {
      id: 'itr6-corporate',
      name: 'Income Tax Return (ITR-6) Corporate Filing',
      due: '31 October 2027',
      dueIso: '2027-10-31',
      penalty: 'Interest u/s 234A/B/C + ₹50,000 penalty',
      status: 'Scheduled',
      authority: 'Income Tax Department (CBDT)',
      riskLevel: 'Medium',
      desc: 'Corporate tax computation and e-filing of audited books of accounts.'
    }
  ];

  // Filter compliance items
  const filteredItems = useMemo(() => {
    if (selectedAuthority === 'All') return complianceItems;
    return complianceItems.filter((i) => i.authority.includes(selectedAuthority));
  }, [selectedAuthority]);

  // One-Click .ICS Calendar Export
  const handleExportCalendar = () => {
    const calendarEvents = complianceItems.map((item) => {
      const cleanDate = item.dueIso.replace(/-/g, '');
      return `BEGIN:VEVENT
UID:${item.id}-${cleanDate}@corporatecompliance.in
SUMMARY:${item.name} (Statutory Due)
DESCRIPTION:${item.desc} Statutory Penalty: ${item.penalty}
DTSTART;VALUE=DATE:${cleanDate}
DTEND;VALUE=DATE:${cleanDate}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P5D
ACTION:DISPLAY
DESCRIPTION:Reminder: ${item.name} is due in 5 days!
END:VALARM
END:VEVENT`;
    }).join('\n');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Corporate LegalTech//Statutory Compliance Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:MCA & GST Statutory Compliance 2026-2027
${calendarEvents}
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Corporate_Statutory_Compliance_Calendar_${new Date().getFullYear()}.ics`;
    a.click();
    URL.revokeObjectURL(url);

    setStatusNotice('Compliance Calendar exported (.ics format). Ready to import into Google Calendar, Outlook, or Apple Calendar.');
    setTimeout(() => setStatusNotice(''), 5000);
  };

  const handleToggleReminder = (id: string, name: string) => {
    setActiveReminders((prev) => ({ ...prev, [id]: !prev[id] }));
    const isNowActive = !activeReminders[id];
    setStatusNotice(
      isNowActive
        ? `WhatsApp alert scheduled 5 days before ${name} deadline!`
        : `Reminder cancelled for ${name}.`
    );
    setTimeout(() => setStatusNotice(''), 4000);
  };

  return (
    <div style={segoeStyle} className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <CustomerNavbar currentTitle="Compliance Calendar & Health" />

      {statusNotice && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2.5 px-4 text-center flex items-center justify-center gap-2 animate-fadeIn shadow-xs sticky top-14 z-40">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      <div className="flex-1 flex flex-row min-w-0">
        <CustomerSidebar activeItem="compliance" />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="max-w-6xl mx-auto w-full py-6 px-4 sm:px-6 space-y-6">
            {/* Header & Quick Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Statutory Compliance Schedule & Health Index</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    MCA V3 & CBIC Synchronized
                  </span>
                </h1>
                <p className="text-xs text-slate-500">
                  Automated deadline tracking, compliance health evaluation, and penalty safeguards under the Companies Act 2013.
                </p>
              </div>

              {/* Sync Calendar Button */}
              <button
                type="button"
                onClick={handleExportCalendar}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Sync to Google / Outlook (.ics)</span>
              </button>
            </div>

            {/* FEATURE: CORPORATE COMPLIANCE HEALTH SCORE & RISK GAUGE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Health Meter (Left) */}
                <div className="flex items-center gap-4 sm:border-r sm:border-slate-100 sm:pr-6">
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    {/* Circular SVG Ring */}
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500"
                        strokeDasharray="94, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-black text-slate-900 leading-none">94</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Health</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">
                      Low Legal Risk
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      Active & In Good Standing
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Zero penal notices on MCA portal. All statutory filing milestones on track.
                    </p>
                  </div>
                </div>

                {/* Compliance Factors Breakdown (Center & Right) */}
                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">ROC Filings</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">100%</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">DIR-3 KYC Current</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">GST Returns</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">92%</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">GSTR-3B Filed</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Secretarial</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">95%</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Registers Ready</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">DSC Tokens</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">Valid</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Expires 2027</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Authority Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
              {['All', 'MCA', 'ROC', 'GST', 'Income Tax'].map((auth) => (
                <button
                  key={auth}
                  type="button"
                  onClick={() => setSelectedAuthority(auth)}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                    selectedAuthority === auth
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {auth === 'All' ? `All Statutory Dates (${complianceItems.length})` : auth}
                </button>
              ))}
            </div>

            {/* Compliance Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const isReminded = Boolean(activeReminders[item.id]);

                return (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-sm transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                          item.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">{item.authority}</span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                      
                      <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1">
                        <p className="text-slate-700">Due Date: <strong className="text-slate-900 font-mono">{item.due}</strong></p>
                        <p className="text-rose-600 text-[11px] font-semibold">Statutory default risk: {item.penalty}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleToggleReminder(item.id, item.name)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                          isReminded
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        {isReminded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                            <span>WhatsApp Alert Active</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-3.5 h-3.5 text-blue-600" />
                            <span>Set 5-Day WhatsApp Alert</span>
                          </>
                        )}
                      </button>

                      <a
                        href="https://wa.me/919820012849"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                      >
                        <span>File With CS</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
