'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  FileText, 
  Calendar, 
  Receipt, 
  MessageSquare, 
  PhoneCall, 
  Landmark, 
  ShieldCheck, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Globe, 
  Sparkles, 
  ExternalLink,
  EyeOff,
  Settings
} from 'lucide-react';

export type CustomerTab = 'orders' | 'profile' | 'documents' | 'compliance' | 'billing' | 'tickets' | 'advisory' | 'settings';

interface CustomerSidebarProps {
  activeItem?: CustomerTab;
}

export default function CustomerSidebar({
  activeItem
}: CustomerSidebarProps) {
  const pathname = usePathname();

  // Desktop Collapsed State (w-[64px] mini-rail)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  // Desktop Completely Hidden State (w-0)
  const [isCompletelyHidden, setIsCompletelyHidden] = useState<boolean>(false);

  // Load persisted collapse preference
  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem('bharatfilings_customer_sidebar_collapsed');
      if (savedCollapsed === 'true') setIsCollapsed(true);
      const savedHidden = localStorage.getItem('bharatfilings_customer_sidebar_hidden');
      if (savedHidden === 'true') setIsCompletelyHidden(true);
    } catch {}
  }, []);

  // Persist states non-blockingly
  useEffect(() => {
    try {
      localStorage.setItem('bharatfilings_customer_sidebar_collapsed', String(isCollapsed));
    } catch {}
  }, [isCollapsed]);

  useEffect(() => {
    try {
      localStorage.setItem('bharatfilings_customer_sidebar_hidden', String(isCompletelyHidden));
    } catch {}
  }, [isCompletelyHidden]);

  // Keyboard shortcut listener: Ctrl+B or Cmd+B to toggle sidebar instantly
  // Also listens to 'bf_toggle_customer_sidebar' event triggered by Top Navbar hamburger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    const handleExternalToggle = () => {
      if (isCompletelyHidden) {
        setIsCompletelyHidden(false);
      } else {
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('bf_toggle_customer_sidebar', handleExternalToggle);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('bf_toggle_customer_sidebar', handleExternalToggle);
    };
  }, [isCollapsed, isCompletelyHidden]);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const handleHideCompletely = () => {
    setIsCompletelyHidden(true);
  };

  const handleUnhide = () => {
    setIsCompletelyHidden(false);
  };

  // Determine current active item from route pathname or fallback prop
  let currentActive: CustomerTab = activeItem || 'orders';
  if (pathname === '/customer' || pathname === '/customer/orders') currentActive = 'orders';
  else if (pathname === '/customer/profile') currentActive = 'profile';
  else if (pathname === '/customer/documents') currentActive = 'documents';
  else if (pathname === '/customer/compliance') currentActive = 'compliance';
  else if (pathname === '/customer/billing') currentActive = 'billing';
  else if (pathname === '/customer/tickets') currentActive = 'tickets';
  else if (pathname === '/customer/advisory') currentActive = 'advisory';
  else if (pathname === '/customer/settings') currentActive = 'settings';

  // Standard Segoe UI style configuration (Exact match to Admin panel)
  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    letterSpacing: '0px'
  };

  // Navigation Items - Pure black & white outline icons, NO COUNTS per style standard
  const navGroups = [
    {
      groupTitle: 'Corporate Filings',
      items: [
        {
          id: 'orders' as const,
          label: 'My Filings & Status',
          href: '/customer',
          icon: Building2
        },
        {
          id: 'profile' as const,
          label: 'Company Master Data',
          href: '/customer/profile',
          icon: Landmark
        },
        {
          id: 'documents' as const,
          label: 'DigiLocker Document Vault',
          href: '/customer/documents',
          icon: FileText
        }
      ]
    },
    {
      groupTitle: 'Statutory & Finance',
      items: [
        {
          id: 'compliance' as const,
          label: 'Compliance Calendar',
          href: '/customer/compliance',
          icon: Calendar
        },
        {
          id: 'billing' as const,
          label: 'Tax Invoices & Receipts',
          href: '/customer/billing',
          icon: Receipt
        }
      ]
    },
    {
      groupTitle: 'Counsel Desk',
      items: [
        {
          id: 'tickets' as const,
          label: 'Support Tickets',
          href: '/customer/tickets',
          icon: MessageSquare
        },
        {
          id: 'advisory' as const,
          label: 'Book CA/CS Advisory',
          href: '/customer/advisory',
          icon: PhoneCall
        }
      ]
    },
    {
      groupTitle: 'Preferences',
      items: [
        {
          id: 'settings' as const,
          label: 'Account & Settings',
          href: '/customer/settings',
          icon: Settings
        }
      ]
    }
  ];

  // If completely hidden, render nothing except the unhide trigger
  if (isCompletelyHidden) {
    return (
      <div 
        style={segoeStyle}
        className="fixed bottom-4 left-4 z-40"
      >
        <button
          type="button"
          onClick={handleUnhide}
          title="Show sidebar (Ctrl+B)"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-black hover:bg-slate-50 text-[12px] font-medium rounded-lg shadow-md cursor-pointer transition"
        >
          <PanelLeftOpen className="w-4 h-4 text-blue-600 stroke-[1.8]" />
          <span>Show Sidebar</span>
        </button>
      </div>
    );
  }

  // ==========================================
  // RENDER: Collapsed Mini-Rail Mode (w-[64px])
  // ==========================================
  const renderCollapsedContent = (
    <div 
      style={segoeStyle}
      className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200 select-none shadow-xs w-16"
    >
      {/* Navigation Icons Column */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4 no-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentActive === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={item.label}
                  className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center transition-colors cursor-pointer group ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-600'
                      : 'text-[#000000E0] customer-nav-inactive hover:text-black hover:bg-slate-100/70'
                  }`}
                  style={{ color: isActive ? '#2563eb' : undefined }}
                >
                  <Icon 
                    className={`w-5 h-5 shrink-0 ${
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
            title="Public Website"
            className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-[#000000E0] hover:text-black hover:bg-slate-100 transition-colors"
          >
            <Globe className="w-5 h-5 stroke-[1.8]" />
          </Link>
          <a
            href="https://wa.me/919820012849"
            target="_blank"
            rel="noopener noreferrer"
            title="CS WhatsApp Desk"
            className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-[#000000E0] hover:text-black hover:bg-slate-100 transition-colors"
          >
            <Sparkles className="w-5 h-5 stroke-[1.8]" />
          </a>
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
  // NO COUNTS (Exact Admin Panel Typography & Style)
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
                      : 'text-[#000000E0] customer-nav-inactive hover:text-black hover:bg-slate-100/70 font-normal'
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

        {/* Platform Portals Section */}
        <div className="pt-2 border-t border-slate-200 space-y-0.5">
          <div className="px-3 pt-1 pb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Portals & Helpdesk
          </div>

          <Link
            href="/"
            title="Public Homepage"
            className="w-full h-[40px] flex items-center justify-between px-3 rounded-lg text-[14px] leading-[40px] text-[#000000E0] customer-nav-inactive hover:text-black hover:bg-slate-100/70 transition-colors font-normal group"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 stroke-[1.8]" />
              <span>Public Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-black" />
          </Link>

          <a
            href="https://wa.me/919820012849"
            target="_blank"
            rel="noopener noreferrer"
            title="Chat with assigned Company Secretary on WhatsApp"
            className="w-full h-[40px] flex items-center justify-between px-3 rounded-lg text-[14px] leading-[40px] text-[#000000E0] customer-nav-inactive hover:text-black hover:bg-slate-100/70 transition-colors font-normal group"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 stroke-[1.8]" />
              <span>CS WhatsApp Desk</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-black" />
          </a>
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
            title="Hide sidebar completely"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <aside 
      style={segoeStyle}
      className={`relative shrink-0 select-none transition-all duration-300 z-30 flex ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {isCollapsed ? renderCollapsedContent : renderExpandedContent}
    </aside>
  );
}
