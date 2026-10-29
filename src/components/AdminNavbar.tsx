'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Menu, 
  RefreshCw, 
  LogOut
} from 'lucide-react';

interface AdminNavbarProps {
  currentTitle?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
  onSignOut?: () => void;
  onToggleSidebar?: () => void;
}

export default function AdminNavbar({
  currentTitle = 'Dashboard Overview',
  onRefresh,
  isLoading = false,
  onSignOut,
  onToggleSidebar
}: AdminNavbarProps) {
  const handleToggle = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    } else {
      window.dispatchEvent(new CustomEvent('bf_toggle_sidebar'));
    }
  };

  const handleDefaultSignOut = () => {
    if (onSignOut) {
      onSignOut();
      return;
    }
    try {
      localStorage.removeItem('bharatfilings_admin_auth');
      sessionStorage.removeItem('bharatfilings_admin_auth');
    } catch {}
    window.location.reload();
  };

  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
  };

  return (
    <header 
      style={segoeStyle}
      className="w-full h-14 bg-white border-b border-slate-200 sticky top-0 z-50 flex items-center justify-between px-3 sm:px-6 shadow-xs select-none shrink-0"
    >
      {/* LEFT SECTION: Brand Logo + Sidebar Toggle Hamburger + View Title */}
      <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
        {/* Brand Logo Placeholder */}
        <Link 
          href="/admin" 
          title="Admin Console"
          className="flex items-center space-x-2 cursor-pointer group shrink-0"
        >
          <div className="px-2.5 py-1 rounded-md border border-dashed border-slate-300 text-xs font-semibold text-slate-500 tracking-wide">
            Logo
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-l border-slate-200 pl-2 hidden xs:inline">
            Admin Console
          </span>
        </Link>

        {/* Sidebar Toggle Hamburger (Directly next to logo) */}
        <button
          type="button"
          onClick={handleToggle}
          title="Toggle Sidebar (Ctrl+B)"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Fixed Breadcrumb Context Badge */}
        {currentTitle && (
          <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-slate-200 shrink-0">
            <span className="text-[12px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md truncate max-w-[200px]">
              {currentTitle}
            </span>
          </div>
        )}
      </div>

      {/* CENTER SECTION: Fixed Live CRC Gateway Status Pill */}
      <div className="hidden lg:flex items-center shrink-0">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-medium shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>MCA V3 CRC Gateway Live</span>
        </div>
      </div>

      {/* RIGHT SECTION: Refresh Action + User Profile + Logout */}
      <div className="flex items-center space-x-2 sm:space-x-3 text-xs shrink-0">
        {/* Refresh Live Data */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Live Data"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}

        {/* Admin User Details */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
            A
          </div>
          <div className="hidden sm:block text-left text-[11px] leading-tight shrink-0">
            <span className="font-semibold text-slate-900 block">Master Admin</span>
            <span className="text-[10px] text-emerald-600 block font-normal flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Active Session
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleDefaultSignOut}
          title="Sign Out of Admin"
          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-rose-600 text-[12px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
