import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft, Search, PhoneCall } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F8FAFC] flex flex-col justify-between font-sans text-slate-900 select-none">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="px-2.5 py-1 rounded-md border border-dashed border-slate-300 text-xs font-semibold text-slate-500 tracking-wide">
              Logo
            </div>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
              Corporate Services Desk
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portal</span>
          </Link>
        </div>
      </header>

      {/* Main 404 Body - Zero scrolling */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 text-center relative overflow-hidden">
          <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-3">
            <FileQuestion className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Notice 404 • Resource Not Found</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            Page Not Found or Relocated
          </h1>

          <p className="mt-2 text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            The requested service link or document does not exist or has been moved to an updated statutory category.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2.5">
            <Link
              href="/"
              className="flex-1 py-2.5 px-4 bg-[#0B1528] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Go to Homepage</span>
            </Link>

            <Link
              href="/register"
              className="flex-1 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-600" />
              <span>Explore Services</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-2.5 px-4 sm:px-6 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 Corporate Services Platform.</p>
          <a href="tel:18008902849" className="flex items-center gap-1 hover:text-slate-800">
            <PhoneCall className="w-3 h-3" />
            <span>Toll-Free Helpline: 1800-890-2849</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
