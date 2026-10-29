'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  RefreshCw, 
  LogOut, 
  ExternalLink, 
  Bell, 
  Phone,
  Briefcase,
  Sparkles,
  Menu
} from 'lucide-react';

interface PartnerNavbarProps {
  currentTitle?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function PartnerNavbar({
  currentTitle = 'Corporate Secretarial Workbench',
  onRefresh,
  isLoading = false
}: PartnerNavbarProps) {
  const handleSignOut = () => {
    try {
      localStorage.removeItem('bharatfilings_partner_auth');
      sessionStorage.removeItem('bharatfilings_partner_auth');
    } catch {}
    window.location.href = '/login';
  };

  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
  };

  return (
    <header 
      style={segoeStyle}
      className="w-full h-14 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-3 sm:px-6 shadow-xs select-none shrink-0"
    >
      {/* Top Colorful Accent Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-600 to-emerald-500 shadow-2xs" />

      {/* LEFT SECTION: Logo + Sidebar Toggle Hamburger + Portal Title + Breadcrumb */}
      <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
        <Link 
          href="/partner" 
          className="flex items-center space-x-2 text-slate-900 group"
        >
          <div className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white shadow-xs text-xs font-black text-slate-800 tracking-wide flex items-center gap-1.5 group-hover:border-blue-500 transition">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-2xs animate-pulse" />
            <span>Logo</span>
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 border-l border-slate-200 pl-2 hidden xs:inline">
            Partner Desk
          </span>
        </Link>

        {/* Sidebar Toggle Hamburger (Matches Admin) */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('bf_toggle_partner_sidebar'))}
          title="Toggle Sidebar (Ctrl+B)"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Fixed Breadcrumb Context Badge matching Admin */}
        {currentTitle && (
          <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-slate-200 shrink-0">
            <span className="text-[12px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md truncate max-w-[240px]">
              {currentTitle}
            </span>
          </div>
        )}
      </div>

      {/* CENTER SECTION: Live CRC Gateway Status Pill */}
      <div className="hidden lg:flex items-center shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>MCA V3 CRC Gateway Live</span>
        </div>
      </div>

      {/* RIGHT SECTION: Quick Tools, Support, User Chip & Logout */}
      <div className="flex items-center space-x-2 sm:space-x-3 text-xs shrink-0">
        {/* Support Hotline */}
        <a
          href="tel:18008892244"
          className="hidden xl:flex items-center gap-1.5 text-slate-700 hover:text-blue-600 font-bold px-2.5 py-1 rounded-lg hover:bg-blue-50/60 transition"
        >
          <Phone className="w-3.5 h-3.5 text-blue-600" />
          <span>1800-889-2244</span>
        </a>

        {/* Public Website Preview Link */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1 text-slate-700 hover:text-blue-700 font-bold px-2.5 py-1 rounded-lg hover:bg-slate-100 transition"
          title="Return to Public Website"
        >
          <span>Website</span>
          <ExternalLink className="w-3 h-3 text-blue-600" />
        </Link>

        {/* Refresh Sync Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Live Data"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}

        {/* Partner Profile Badge */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs ring-2 ring-blue-100 shrink-0">
            PS
          </div>
          <div className="hidden sm:block text-left text-[11px] leading-tight shrink-0">
            <span className="font-extrabold text-slate-900 block">CS Priya Sharma</span>
            <span className="text-[10px] text-emerald-700 font-bold block flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Verified ICSI Fellow
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleSignOut}
          title="Sign Out of Partner Portal"
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}