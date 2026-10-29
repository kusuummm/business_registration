'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  RefreshCw, 
  Plus, 
  PhoneCall, 
  ShieldCheck, 
  Globe, 
  Bell, 
  Settings,
  Mail,
  Key,
  Copy,
  Check,
  ExternalLink,
  Lock,
  X,
  AlertCircle
} from 'lucide-react';

interface CustomerNavbarProps {
  currentTitle?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function CustomerNavbar({
  currentTitle = 'Corporate Filings Desk',
  onRefresh,
  isLoading = false
}: CustomerNavbarProps) {
  const [userName, setUserName] = useState('Client User');
  const [userEmail, setUserEmail] = useState('');
  const [initials, setInitials] = useState('CU');
  const [emails, setEmails] = useState<any[]>([]);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [copiedPassId, setCopiedPassId] = useState<string | null>(null);
  const [selectedEmailModal, setSelectedEmailModal] = useState<any | null>(null);
  const inboxRef = useRef<HTMLDivElement>(null);

  const fetchEmails = (targetEmail?: string) => {
    const emailToUse = targetEmail || userEmail || 'client@example.com';
    fetch(`/api/customer/emails?email=${encodeURIComponent(emailToUse)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setEmails(json.data);
        }
      })
      .catch((err) => console.log('Emails error:', err));
  };

  const updateProfileFromStorage = () => {
    try {
      const stored = localStorage.getItem('bharatfilings_customer_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          setUserName(parsed.name);
          const parts = parsed.name.trim().split(/\s+/);
          if (parts.length >= 2) {
            setInitials((parts[0][0] + parts[parts.length - 1][0]).toUpperCase());
          } else if (parts[0]) {
            setInitials(parts[0].slice(0, 2).toUpperCase());
          }
        }
        if (parsed.email) {
          setUserEmail(parsed.email);
          fetchEmails(parsed.email);
        } else {
          fetchEmails();
        }
      } else {
        fetchEmails();
      }
    } catch {}
  };

  useEffect(() => {
    updateProfileFromStorage();
    const handleUpdate = () => updateProfileFromStorage();
    window.addEventListener('bf_customer_user_updated', handleUpdate);

    // Live dynamic polling every 4 seconds for admin dispatches & updated credentials
    const timer = setInterval(() => {
      fetchEmails();
    }, 4000);

    return () => {
      window.removeEventListener('bf_customer_user_updated', handleUpdate);
      clearInterval(timer);
    };
  }, [userEmail]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inboxRef.current && !inboxRef.current.contains(e.target as Node)) {
        setIsInboxOpen(false);
      }
    };
    if (isInboxOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isInboxOpen]);

  const handleCopyPassword = (pass: string, id: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedPassId(id);
    setTimeout(() => setCopiedPassId(null), 2500);
  };

  const handleToggle = () => {
    window.dispatchEvent(new CustomEvent('bf_toggle_customer_sidebar'));
  };

  const unreadCount = emails.filter((e) => !e.read).length;

  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    letterSpacing: '0px'
  };

  return (
    <>
      <header 
        style={segoeStyle}
        className="w-full h-14 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-3 sm:px-6 shadow-xs select-none shrink-0 relative"
      >
        {/* LEFT SECTION: Brand Logo + Sidebar Toggle Hamburger + View Title */}
        <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
          {/* Brand Logo Placeholder */}
          <Link 
            href="/customer" 
            className="flex items-center space-x-2 text-slate-900 group"
          >
            <div className="px-2.5 py-1 rounded-md border border-dashed border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-500 tracking-wide">
              Logo
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-l border-slate-200 pl-2 hidden xs:inline">
              Client Portal
            </span>
          </Link>

          {/* Vertical Divider */}
          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Sidebar Toggle Hamburger Button */}
          <button
            type="button"
            onClick={handleToggle}
            title="Toggle Sidebar (Ctrl+B)"
            className="p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Current View Title Tag */}
          <div className="hidden md:flex items-center space-x-2 pl-1">
            <span className="text-slate-400 text-xs">/</span>
            <span className="text-xs font-semibold text-slate-800">{currentTitle}</span>
          </div>
        </div>

        {/* RIGHT SECTION: Quick Actions, Dynamic Mailbox & User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Refresh Sync Button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh latest filings & notifications"
              className="p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 stroke-[1.8] ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          )}

          {/* DYNAMIC MAILBOX / DISPATCH NOTIFICATIONS */}
          <div className="relative" ref={inboxRef}>
            <button
              type="button"
              onClick={() => setIsInboxOpen(!isInboxOpen)}
              title="Official Admin Dispatches & Credentials Email"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer relative ${
                isInboxOpen 
                  ? 'bg-blue-50 text-blue-700' 
                  : unreadCount > 0 
                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' 
                  : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              <Mail className="w-4 h-4 stroke-[1.8]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dynamic Mailbox Dropdown Flyout */}
            {isInboxOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fade-in text-xs">
                {/* Header */}
                <div className="p-3 bg-gradient-to-r from-slate-900 to-[#0B1528] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="font-bold block text-xs">Statutory Dispatches Inbox</span>
                      <span className="text-[10px] text-slate-300 block">MCA V3 & Security Admin Emails</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                    {emails.length} message{emails.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Body List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {emails.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 space-y-1">
                      <Mail className="w-6 h-6 mx-auto opacity-30" />
                      <p className="font-semibold text-slate-600">No admin credential emails yet</p>
                      <p className="text-[10px]">When an administrator resets your password, updated credentials will appear here.</p>
                    </div>
                  ) : (
                    emails.map((m) => (
                      <div 
                        key={m.id} 
                        className={`p-3.5 hover:bg-slate-50 transition space-y-2 cursor-pointer ${!m.read ? 'bg-amber-50/30' : ''}`}
                        onClick={() => setSelectedEmailModal(m)}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                            {m.from}
                          </span>
                          <span className="text-slate-400">
                            {new Date(m.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="font-bold text-slate-900 text-xs line-clamp-1">
                          {m.subject}
                        </div>

                        {/* Credential Highlight Box if password is in email */}
                        {m.plainPassword && (
                          <div 
                            className="p-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg flex items-center justify-between"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="space-y-0.5">
                              <span className="text-[9px] uppercase font-bold text-emerald-800 block">New Password:</span>
                              <span className="font-mono font-bold text-emerald-950 text-xs">{m.plainPassword}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyPassword(m.plainPassword, m.id)}
                              className="px-2 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              {copiedPassId === m.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        <div className="text-[10px] text-blue-600 font-semibold hover:underline flex items-center gap-1">
                          <span>View Full Official Notice</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Synced in real-time with master admin desk</span>
                  <Link href="/customer/settings" onClick={() => setIsInboxOpen(false)} className="text-blue-600 font-bold hover:underline">
                    Security Settings
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Assigned CS Desk */}
          <a
            href="https://wa.me/919820012849"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>CS Desk (Priya S.)</span>
          </a>

          {/* New Incorporation CTA */}
          <Link
            href="/register"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2]" />
            <span className="hidden sm:inline">New Filing</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Quick Settings Icon Button */}
          <Link
            href="/customer/settings"
            title="Account & Portal Settings"
            className="p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 stroke-[1.8]" />
          </Link>

          {/* Client User Profile Pill */}
          <Link
            href="/customer/settings"
            title="Account & Settings (Click to Edit Profile)"
            className="flex items-center gap-2 pl-1 hover:opacity-80 transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center border border-slate-800 shadow-2xs group-hover:ring-2 group-hover:ring-blue-500/20">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight group-hover:text-blue-600 transition-colors">{userName}</span>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 leading-none mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> DigiLocker Verified
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Full Official Email Modal */}
      {selectedEmailModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedEmailModal(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Official Security Notice from Admin
                    </h3>
                    <p className="text-[11px] text-slate-500">Ministry of Corporate Affairs (MCA V3) Direct Delivery</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEmailModal(null)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-base transition cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* Email Envelope Header */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">From:</span>
                  <span className="text-slate-900 font-bold">{selectedEmailModal.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">To:</span>
                  <span className="text-blue-700 font-bold">{selectedEmailModal.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="text-slate-700">{new Date(selectedEmailModal.sentAt).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Subject:</span>
                  <span className="text-slate-900 font-bold">{selectedEmailModal.subject}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed border border-slate-800">
                {selectedEmailModal.bodySnippet}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                {selectedEmailModal.plainPassword && (
                  <button
                    type="button"
                    onClick={() => handleCopyPassword(selectedEmailModal.plainPassword, 'modal')}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {copiedPassId === 'modal' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Newly Assigned Password</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedEmailModal(null)}
                  className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700 text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
