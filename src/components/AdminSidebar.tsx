'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Files, 
  PhoneCall, 
  PieChart, 
  Contact, 
  Receipt, 
  ShieldCheck, 
  Settings,
  Sparkles, 
  Globe, 
  PanelLeftClose,
  PanelLeftOpen,
  EyeOff,
  ExternalLink,
  KeyRound
} from 'lucide-react';

export type AdminTab = 'overview' | 'pricing' | 'orders' | 'callbacks' | 'partners' | 'payouts' | 'logs' | 'settings' | 'passwords';

interface AdminSidebarProps {
  activeItem?: AdminTab;
  onTabSelect?: (tab: AdminTab) => void;
  ordersCount?: number;
  callbacksCount?: number;
  payoutsCount?: number;
  onSignOut?: () => void;
}

export default function AdminSidebar({
  activeItem = 'overview',
  onTabSelect,
  onSignOut
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Desktop Collapsed State (w-[64px] mini-rail)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  // Desktop Completely Hidden State (w-0)
  const [isCompletelyHidden, setIsCompletelyHidden] = useState<boolean>(false);

  // Load persisted preference immediately on mount
  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem('bharatfilings_admin_sidebar_collapsed');
      if (savedCollapsed === 'true') {
        setIsCollapsed(true);
      }
      const savedHidden = localStorage.getItem('bharatfilings_admin_sidebar_hidden');
      if (savedHidden === 'true') {
        setIsCompletelyHidden(true);
      }
    } catch {}
  }, []);

  // Persist states non-blockingly
  useEffect(() => {
    try {
      localStorage.setItem('bharatfilings_admin_sidebar_collapsed', String(isCollapsed));
    } catch {}
  }, [isCollapsed]);

  useEffect(() => {
    try {
      localStorage.setItem('bharatfilings_admin_sidebar_hidden', String(isCompletelyHidden));
    } catch {}
  }, [isCompletelyHidden]);

  // Keyboard shortcut listener: Ctrl+B or Cmd+B to toggle sidebar instantly
  // Also listens to 'bf_toggle_sidebar' event triggered by Top Navbar hamburger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    const handleExternalToggle = () => {
      toggleSidebar();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('bf_toggle_sidebar', handleExternalToggle);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('bf_toggle_sidebar', handleExternalToggle);
    };
  }, [isCollapsed, isCompletelyHidden]);

  // Instant zero-delay toggle
  const toggleSidebar = () => {
    if (isCompletelyHidden) {
      setIsCompletelyHidden(false);
      setIsCollapsed(false);
      return;
    }
    setIsCollapsed((prev) => !prev);
  };

  const handleHideCompletely = () => {
    setIsCompletelyHidden(true);
  };

  const handleRestoreSidebar = () => {
    setIsCompletelyHidden(false);
    setIsCollapsed(false);
  };

  // Determine current active item based on prop or pathname
  let currentActive: AdminTab = activeItem || 'overview';
  if (pathname === '/admin/revenue') currentActive = 'pricing';
  else if (pathname === '/admin/orders') currentActive = 'orders';
  else if (pathname === '/admin/callbacks') currentActive = 'callbacks';
  else if (pathname === '/admin/partners') currentActive = 'partners';
  else if (pathname === '/admin/payouts') currentActive = 'payouts';
  else if (pathname === '/admin/logs') currentActive = 'logs';
  else if (pathname === '/admin/settings') currentActive = 'settings';
  else if (pathname === '/admin/passwords') currentActive = 'passwords';

  // Standard Segoe UI style configuration
  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    letterSpacing: '0px'
  };

  // Navigation Items - Counts removed entirely per user request
  const navGroups = [
    {
      groupTitle: 'Operations & Filing',
      items: [
        {
          id: 'overview' as const,
          label: 'Dashboard Overview',
          href: '/admin',
          icon: Home
        },
        {
          id: 'orders' as const,
          label: 'Orders & Filing Queue',
          href: '/admin/orders',
          icon: Files
        },
        {
          id: 'callbacks' as const,
          label: 'Consultation Leads',
          href: '/admin/callbacks',
          icon: PhoneCall
        },
        {
          id: 'pricing' as const,
          label: 'Revenue & Pricing',
          href: '/admin/revenue',
          icon: PieChart
        }
      ]
    },
    {
      groupTitle: 'Partner Ecosystem',
      items: [
        {
          id: 'partners' as const,
          label: 'Verified CA/CS Roster',
          href: '/admin/partners',
          icon: Contact
        },
        {
          id: 'payouts' as const,
          label: 'Disbursements & Payouts',
          href: '/admin/payouts',
          icon: Receipt
        }
      ]
    },
    {
      groupTitle: 'Governance & Security',
      items: [
        {
          id: 'passwords' as const,
          label: 'Customer Passwords',
          href: '/admin?tab=passwords',
          icon: KeyRound
        },
        {
          id: 'logs' as const,
          label: 'Security Audit & RBAC',
          href: '/admin/logs',
          icon: ShieldCheck
        },
        {
          id: 'settings' as const,
          label: 'Settings',
          href: '/admin/settings',
          icon: Settings
        }
      ]
    }
  ];

  // ==========================================
  // RENDER: Collapsed Mini-Rail Mode (w-[64px])
  // ==========================================
  const renderCollapsedContent = (
    <div 
      style={segoeStyle}
      className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200 select-none shadow-xs w-[64px]"
    >
      {/* Navigation Icons (No counts) */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 no-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {gIdx > 0 && <div className="w-8 h-px bg-slate-200 mx-auto my-2" />}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentActive === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={item.label}
                  className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center relative cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-600'
                      : 'text-[#000000E0] admin-nav-inactive hover:bg-slate-100/70 hover:text-black'
                  }`}
                  style={{ color: isActive ? '#2563eb' : undefined }}
                >
                  <Icon 
                    className={`w-5 h-5 ${
                      isActive ? 'text-blue-600 stroke-[2]' : 'stroke-[1.8]'
                    }`} 
                  />
                </Link>
              );
            })}
          </div>
        ))}

        {/* Portals Section */}
        <div className="pt-2 border-t border-slate-200 space-y-1">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Public Website (Opens in new page)"
            className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-[#000000E0] hover:text-black hover:bg-slate-100 transition-colors"
          >
            <Globe className="w-5 h-5 stroke-[1.8]" />
          </Link>
          <Link
            href="/partner"
            target="_blank"
            rel="noopener noreferrer"
            title="CA/CS Workbench (Opens in new page)"
            className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-[#000000E0] hover:text-black hover:bg-slate-100 transition-colors"
          >
            <Sparkles className="w-5 h-5 stroke-[1.8]" />
          </Link>
        </div>
      </div>

      {/* Mini-rail bottom controls */}
      <div className="p-2 border-t border-slate-200 flex flex-col items-center gap-1.5 shrink-0 bg-slate-50/50">
        <button
          type="button"
          onClick={toggleSidebar}
          title="Expand Sidebar"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#000000E0] hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
        >
          <PanelLeftOpen className="w-4 h-4 stroke-[1.8]" />
        </button>

        <button
          type="button"
          onClick={handleHideCompletely}
          title="Hide sidebar completely"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <EyeOff className="w-4 h-4 stroke-[1.8]" />
        </button>
      </div>
    </div>
  );

  // ==========================================
  // RENDER: Full Expanded Sidebar (w-64)
  // Font: Segoe UI, 14px, 400 weight, 40px line-height, #000000E0
  // NO COUNTS (Clean, crisp navigation)
  // ==========================================
  const renderExpandedContent = (
    <div 
      style={segoeStyle}
      className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200 select-none shadow-xs w-full"
    >
      {/* Navigation List - Font 14px, 40px item row height */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 no-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-0.5">
            <div className="px-3 pt-1 pb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {group.groupTitle}
            </div>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentActive === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={item.label}
                  className={`w-full h-[40px] flex items-center justify-between px-3 rounded-lg text-[14px] leading-[40px] transition-colors cursor-pointer group ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-600 font-medium'
                      : 'text-[#000000E0] admin-nav-inactive hover:text-black hover:bg-slate-100/70 font-normal'
                  }`}
                  style={{ color: isActive ? '#2563eb' : undefined }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Monochrome outline icon: Blue when active */}
                    <Icon 
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? 'text-blue-600 stroke-[2]' : 'stroke-[1.8]'
                      }`} 
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}

        {/* Platform Portals Section (Including Public Website) */}
        <div className="pt-2 border-t border-slate-200 space-y-0.5">
          <div className="px-3 pt-1 pb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Portals
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Public Website (Opens in new page)"
            className="w-full h-[40px] flex items-center justify-between px-3 rounded-lg text-[14px] leading-[40px] text-[#000000E0] admin-nav-inactive hover:text-black hover:bg-slate-100/70 transition-colors font-normal group"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 stroke-[1.8]" />
              <span>Public Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-black" />
          </Link>

          <Link
            href="/partner"
            target="_blank"
            rel="noopener noreferrer"
            title="CA/CS Workbench (Opens in new page)"
            className="w-full h-[40px] flex items-center justify-between px-3 rounded-lg text-[14px] leading-[40px] text-[#000000E0] admin-nav-inactive hover:text-black hover:bg-slate-100/70 transition-colors font-normal group"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 stroke-[1.8]" />
              <span>CA/CS Workbench</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-black" />
          </Link>
        </div>
      </div>

      {/* Expanded sidebar bottom bar with quick toggle & hide controls */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 shrink-0 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-medium">Ctrl+B to toggle</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleSidebar}
            title="Collapse to mini-rail"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleHideCompletely}
            title="Hide completely"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR: Placed directly below the Top Navbar on the left */}
      <aside 
        className={`hidden md:block shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] z-30 select-none bg-white ${
          isCompletelyHidden 
            ? 'w-0 overflow-hidden border-none' 
            : isCollapsed 
              ? 'w-[64px]' 
              : 'w-64'
        }`}
      >
        {isCollapsed ? renderCollapsedContent : renderExpandedContent}
      </aside>

      {/* Floating Restore Button when completely hidden */}
      {isCompletelyHidden && (
        <button
          type="button"
          onClick={handleRestoreSidebar}
          title="Restore Sidebar (Ctrl+B)"
          className="fixed bottom-4 left-4 z-50 bg-slate-900 text-white p-2.5 rounded-xl shadow-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer border border-slate-700"
        >
          <PanelLeftOpen className="w-4 h-4" />
          <span>Show Sidebar</span>
        </button>
      )}
    </>
  );
}
