'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  KeyRound, 
  Wallet, 
  Share2, 
  Globe, 
  Building2, 
  ShieldCheck, 
  PanelLeftClose, 
  PanelLeftOpen, 
  EyeOff, 
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';

export type PartnerTab = 'workbench' | 'drafting' | 'calendar' | 'dsc' | 'wallet' | 'referral';

interface PartnerSidebarProps {
  activeItem?: PartnerTab;
  onTabSelect?: (tab: PartnerTab) => void;
  filingsCount?: number;
}

export default function PartnerSidebar({
  activeItem = 'workbench',
  onTabSelect,
  filingsCount = 4
}: PartnerSidebarProps) {
  // Desktop Collapsed State (w-[64px] mini-rail)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  // Completely Hidden State (w-0)
  const [isCompletelyHidden, setIsCompletelyHidden] = useState<boolean>(false);

  // Load persisted preference on mount
  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem('bharatfilings_partner_sidebar_collapsed');
      if (savedCollapsed === 'true') {
        setIsCollapsed(true);
      }
      const savedHidden = localStorage.getItem('bharatfilings_partner_sidebar_hidden');
      if (savedHidden === 'true') {
        setIsCompletelyHidden(true);
      }
    } catch {}
  }, []);

  // Persist states
  useEffect(() => {
    try {
      localStorage.setItem('bharatfilings_partner_sidebar_collapsed', String(isCollapsed));
    } catch {}
  }, [isCollapsed]);

  useEffect(() => {
    try {
      localStorage.setItem('bharatfilings_partner_sidebar_hidden', String(isCompletelyHidden));
    } catch {}
  }, [isCompletelyHidden]);

  // Keyboard shortcut listener: Ctrl+B or Cmd+B to toggle sidebar instantly
  // Also listens to 'bf_toggle_partner_sidebar' event triggered by Top Navbar hamburger
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
    window.addEventListener('bf_toggle_partner_sidebar', handleExternalToggle);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('bf_toggle_partner_sidebar', handleExternalToggle);
    };
  }, [isCollapsed, isCompletelyHidden]);

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

  // Standard Segoe UI style configuration matching Admin
  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    letterSpacing: '0px'
  };

  interface NavItem {
    id: PartnerTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }

  interface NavGroup {
    groupTitle: string;
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'Secretarial Desk',
      items: [
        {
          id: 'workbench' as const,
          label: 'Assigned Filings',
          icon: Briefcase,
          count: filingsCount
        },
        {
          id: 'drafting' as const,
          label: 'MoA / AoA Studio',
          icon: FileText
        }
      ]
    },
    {
      groupTitle: 'Statutory & Compliance',
      items: [
        {
          id: 'calendar' as const,
          label: 'Due Date Calendar',
          icon: Calendar
        },
        {
          id: 'dsc' as const,
          label: 'DSC Cryptographic Desk',
          icon: KeyRound
        }
      ]
    },
    {
      groupTitle: 'Revenue & Network',
      items: [
        {
          id: 'wallet' as const,
          label: 'Fees & Wallet Ledger',
          icon: Wallet
        },
        {
          id: 'referral' as const,
          label: 'Partner Referral Network',
          icon: Share2
        }
      ]
    }
  ];

  const handleItemClick = (tabId: PartnerTab) => {
    if (onTabSelect) {
      onTabSelect(tabId);
    }
  };

  // ==========================================
  // RENDER: Collapsed Mini-Rail Mode (w-[64px])
  // ==========================================
  const renderCollapsedContent = (
    <div 
      style={segoeStyle}
      className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200 select-none shadow-xs w-[64px]"
    >
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 no-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {gIdx > 0 && <div className="w-8 h-px bg-slate-200 mx-auto my-2" />}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  title={item.label}
                  className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center relative cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-600'
                      : 'text-[#000000E0] hover:bg-slate-100/70 hover:text-black'
                  }`}
                  style={{ color: isActive ? '#2563eb' : undefined }}
                >
                  <Icon 
                    className={`w-5 h-5 ${
                      isActive ? 'text-blue-600 stroke-[2]' : 'stroke-[1.8]'
                    }`} 
                  />
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* External Portals Section */}
        <div className="pt-2 border-t border-slate-200 space-y-1">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Public Website (Opens in new tab)"
            className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-[#000000E0] hover:text-black hover:bg-slate-100 transition-colors"
          >
            <Globe className="w-5 h-5 stroke-[1.8]" />
          </Link>
          <Link
            href="/customer"
            target="_blank"
            rel="noopener noreferrer"
            title="Client Portal (Opens in new tab)"
            className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-[#000000E0] hover:text-black hover:bg-slate-100 transition-colors"
          >
            <Building2 className="w-5 h-5 stroke-[1.8]" />
          </Link>
          <Link
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            title="Admin Console (Opens in new tab)"
            className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-[#000000E0] hover:text-black hover:bg-slate-100 transition-colors"
          >
            <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
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
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  title={item.label}
                  className={`w-full h-[40px] flex items-center justify-between px-3 rounded-lg text-[14px] leading-[40px] transition-colors cursor-pointer group text-left ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-600 font-medium'
                      : 'text-[#000000E0] hover:text-black hover:bg-slate-100/70 font-normal'
                  }`}
                  style={{ color: isActive ? '#2563eb' : undefined }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon 
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? 'text-blue-600 stroke-[2]' : 'stroke-[1.8]'
                      }`} 
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-700">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Connected Portals Section */}
        <div className="pt-2 border-t border-slate-200 space-y-0.5">
          <div className="px-3 pt-1 pb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Connected Systems
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Public Website (Opens in new page)"
            className="w-full h-[40px] flex items-center justify-between px-3 rounded-lg text-[14px] leading-[40px] text-[#000000E0] hover:text-black hover:bg-slate-100/70 transition-colors font-normal group"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 stroke-[1.8]" />
              <span>Public Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-black" />
          </Link>

          <Link
            href="/customer"
            target="_blank"
            rel="noopener noreferrer"
            title="Client Portal (Opens in new page)"
            className="w-full h-[40px] flex items-center justify-between px-3 rounded-lg text-[14px] leading-[40px] text-[#000000E0] hover:text-black hover:bg-slate-100/70 transition-colors font-normal group"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 stroke-[1.8]" />
              <span>Client Portal</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-black" />
          </Link>

          <Link
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            title="Master Admin Console (Opens in new page)"
            className="w-full h-[40px] flex items-center justify-between px-3 rounded-lg text-[14px] leading-[40px] text-[#000000E0] hover:text-black hover:bg-slate-100/70 transition-colors font-normal group"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
              <span>Admin Console</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-black" />
          </Link>
        </div>
      </div>

      {/* Expanded bottom controls */}
      <div className="p-2 border-t border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50 px-3">
        <button
          type="button"
          onClick={toggleSidebar}
          title="Collapse to mini-rail"
          className="flex items-center gap-2 text-xs text-[#000000E0] hover:text-blue-600 transition-colors cursor-pointer py-1"
        >
          <PanelLeftClose className="w-4 h-4 stroke-[1.8]" />
          <span>Collapse</span>
        </button>

        <button
          type="button"
          onClick={handleHideCompletely}
          title="Hide sidebar completely"
          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <EyeOff className="w-4 h-4 stroke-[1.8]" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Restore Floating Button when Completely Hidden */}
      {isCompletelyHidden && (
        <button
          type="button"
          onClick={handleRestoreSidebar}
          title="Show Sidebar (Ctrl+B)"
          className="fixed bottom-4 left-4 z-50 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg border border-blue-500 cursor-pointer transition-transform hover:scale-105 flex items-center gap-2 text-xs font-bold"
        >
          <PanelLeftOpen className="w-4 h-4" />
          <span>Show Sidebar</span>
        </button>
      )}

      {/* Main Sidebar Wrapper */}
      {!isCompletelyHidden && (
        <aside 
          className={`shrink-0 transition-all duration-200 h-[calc(100vh-3.5rem)] sticky top-14 z-30 hidden md:block ${
            isCollapsed ? 'w-[64px]' : 'w-64'
          }`}
        >
          {isCollapsed ? renderCollapsedContent : renderExpandedContent}
        </aside>
      )}
    </>
  );
}