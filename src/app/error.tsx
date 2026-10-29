'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, PhoneCall, Mail, ShieldCheck, Clock } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const [incidentId, setIncidentId] = useState<string>('INC-2026-MCA-SAFE');
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    // Generate safe anonymized incident reference without revealing any error trace
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    setIncidentId(`BF-SYS-${randomSuffix}`);
    setTimestamp(new Date().toUTCString());
    
    console.error('System safeguard captured an unexpected error.');
  }, [error]);

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F8FAFC] flex flex-col justify-between font-sans text-slate-900 select-none">
      {/* Top Institutional Bar */}
      <header className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="px-2.5 py-1 rounded-md border border-dashed border-slate-300 text-xs font-semibold text-slate-500 tracking-wide">
              Logo
            </div>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
              Corporate Services Desk
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Safeguard Activated</span>
          </div>
        </div>
      </header>

      {/* Main Downtime Card - Fits fully inside viewport with zero scrolling */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 text-center relative overflow-hidden">
          {/* Top Amber Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />

          {/* Warning Icon Graphic */}
          <div className="mx-auto w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 shadow-xs">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>

          {/* Status Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Website Down as Error Occurred</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            Platform Temporarily Unavailable
          </h1>

          <p className="mt-2 text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            An unexpected error occurred while processing this request. For your security, the session was safely paused and our engineering team has been notified.
          </p>

          {/* Safety Assurance Points */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-2.5 text-left">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Your Data is Safe</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                Forms, KYC documents & payments remain strictly encrypted.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Auto-Recovery Active</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                Engineering team actively resolving. Expected restore shortly.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => reset ? reset() : window.location.reload()}
              className="flex-1 py-2.5 px-4 bg-[#0B1528] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again / Refresh</span>
            </button>

            <Link
              href="/"
              className="flex-1 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-slate-600" />
              <span>Return to Home</span>
            </Link>
          </div>

          {/* Reference Stamp (No technical error details displayed) */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Reference ID: {incidentId}</span>
            <span>{timestamp || 'System Protected'}</span>
          </div>
        </div>
      </main>

      {/* Emergency Assistance Footer */}
      <footer className="bg-white border-t border-slate-200 py-2.5 px-4 sm:px-6 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">Urgent filing deadline?</span>
            <span>Support desk is operational.</span>
          </p>

          <div className="flex items-center gap-4 text-slate-700 font-semibold">
            <a
              href="tel:18008902849"
              className="flex items-center gap-1 hover:text-slate-900 transition"
            >
              <PhoneCall className="w-3 h-3 text-slate-500" />
              <span>1800-890-2849</span>
            </a>

            <a
              href="mailto:support@bharatfilings.in"
              className="flex items-center gap-1 hover:text-slate-900 transition"
            >
              <Mail className="w-3 h-3 text-slate-500" />
              <span>support@bharatfilings.in</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
