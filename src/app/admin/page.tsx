'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Settings2, 
  DollarSign, 
  Users, 
  FileCheck, 
  Layers, 
  TrendingUp, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  ShieldCheck, 
  Building2, 
  Download, 
  Eye, 
  EyeOff,
  AlertTriangle,
  Sparkles,
  Lock,
  ArrowRight,
  ArrowLeft,
  PhoneCall,
  Clock,
  RefreshCw,
  KeyRound,
  Mail,
  LogOut,
  ShieldAlert,
  Check,
  Receipt,
  FileText,
  PanelLeft,
  Star,
  Award,
  Briefcase,
  Home,
  Files,
  PieChart,
  Contact,
  Search,
  Filter,
  UserPlus
} from 'lucide-react';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar, { AdminTab } from '@/components/AdminSidebar';
import { INITIAL_SERVICES, ServiceItem } from '@/data/servicesData';
import { STATE_STAMP_DUTY } from '@/data/pricingData';
import { PARTNERS_DATA, Partner } from '@/data/partnersData';

export default function AdminDashboardPage() {
  // Authentication & Security Guard States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@bharatfilings.com');
  const [adminPassword, setAdminPassword] = useState('Admin@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot Password Flow States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'success'>('email');
  const [forgotMessage, setForgotMessage] = useState('');

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [partners, setPartners] = useState<Partner[]>(PARTNERS_DATA);
  const [partnerSearch, setPartnerSearch] = useState('');
  const [partnerStateFilter, setPartnerStateFilter] = useState('All');
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccessBanner, setIsSuccessBanner] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [callbacks, setCallbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Customer Password Requests State
  const [passwordRequests, setPasswordRequests] = useState<any[]>([]);
  const [selectedPasswordRequest, setSelectedPasswordRequest] = useState<any | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminResetNotes, setAdminResetNotes] = useState('');
  const [isExecutingReset, setIsExecutingReset] = useState(false);
  const [dispatchedEmailPreview, setDispatchedEmailPreview] = useState<any | null>(null);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [passwordFilterStatus, setPasswordFilterStatus] = useState<string>('all');
  const [passwordSearchQuery, setPasswordSearchQuery] = useState<string>('');

  // Check URL tab query param on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as AdminTab;
      if (tabParam && ['overview', 'pricing', 'orders', 'callbacks', 'partners', 'payouts', 'logs', 'passwords', 'settings'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Handle in-page tab/view change without route reloading
  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState(null, '', url.toString());
    }
  };

  // Verify session on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('bharatfilings_admin_auth') || localStorage.getItem('bharatfilings_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Prevent any background scrolling while on login screen
  useEffect(() => {
    if (!isAuthenticated) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAuthenticated]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isEditModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isEditModalOpen]);

  // Handle Admin Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    setTimeout(() => {
      // Validate credentials
      if (!adminEmail.includes('@') || adminPassword.length < 5) {
        setLoginError('Invalid Administrator credentials. Please enter a valid email and password.');
        setIsLoggingIn(false);
        return;
      }

      // Successful authentication
      sessionStorage.setItem('bharatfilings_admin_auth', 'true');
      localStorage.setItem('bharatfilings_admin_auth', 'true');
      setIsAuthenticated(true);
      setIsLoggingIn(false);
      setIsSuccessBanner('Master Administrator authenticated successfully! Secure session initialized.');
      setTimeout(() => setIsSuccessBanner(''), 4000);
    }, 600);
  };

  // Handle Admin Sign Out
  const handleSignOut = () => {
    sessionStorage.removeItem('bharatfilings_admin_auth');
    localStorage.removeItem('bharatfilings_admin_auth');
    setIsAuthenticated(false);
    setAdminPassword('');
  };

  // Handle Forgot Password - Step 1: Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotMessage('Please enter a valid registered administrator email address.');
      return;
    }
    setForgotStep('otp');
    setForgotMessage('Security OTP has been dispatched to your administrator email.');
  };

  // Handle Forgot Password - Step 2: Verify & Reset
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotOtp.length < 6) {
      setForgotMessage('Please enter a valid 6-digit OTP code.');
      return;
    }
    if (newPassword.length < 6) {
      setForgotMessage('New password must be at least 6 characters.');
      return;
    }
    setForgotStep('success');
    setAdminPassword(newPassword);
    setForgotMessage('Administrator master credentials updated successfully! You can now log in.');
  };

  // Fetch all backend store data on mount
  const refreshAdminData = () => {
    setIsLoading(true);

    // 1. Fetch live dynamic services
    fetch('/api/services')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setServices(json.data);
        }
      })
      .catch((err) => console.log('Services API error:', err));

    // 2. Fetch live orders
    fetch('/api/orders')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setOrders(json.data);
        }
      })
      .catch((err) => console.log('Orders API error:', err));

    // 3. Fetch partners & payouts
    fetch('/api/partners')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.payouts) {
          setPayouts(json.data.payouts);
        }
      })
      .catch((err) => console.log('Partners API error:', err));

    // 4. Fetch callback leads
    fetch('/api/callbacks')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCallbacks(json.data);
        }
      })
      .catch((err) => console.log('Callbacks API error:', err))
      .finally(() => setIsLoading(false));

    // 5. Fetch Customer Password Reset Requests
    refreshPasswordRequests();
  };

  const refreshPasswordRequests = () => {
    fetch('/api/password-requests')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setPasswordRequests(json.data);
        }
      })
      .catch((err) => console.log('Password requests API error:', err));
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let pwd = '';
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAdminNewPassword(pwd);
  };

  const handleOpenResetModal = (req: any) => {
    setSelectedPasswordRequest(req);
    handleGeneratePassword();
    setAdminResetNotes('');
    setIsPasswordModalOpen(true);
  };

  const handleExecuteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPasswordRequest || !adminNewPassword) return;

    setIsExecutingReset(true);
    try {
      const res = await fetch('/api/password-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: selectedPasswordRequest.id,
          action: 'admin_reset',
          newPassword: adminNewPassword,
          adminEmail,
          adminNotes: adminResetNotes
        })
      });
      const json = await res.json();
      if (json.success) {
        setIsPasswordModalOpen(false);
        setIsSuccessBanner(json.message);
        setTimeout(() => setIsSuccessBanner(''), 6000);
        setDispatchedEmailPreview(json.data.emailDispatchDetails);
        setIsEmailPreviewOpen(true);
        refreshPasswordRequests();
      } else {
        alert(json.error || 'Failed to execute password reset');
      }
    } catch (err) {
      console.error('Password reset execution failed:', err);
      alert('Network error while processing request.');
    } finally {
      setIsExecutingReset(false);
    }
  };

  // Direct Customer Password Reset (no ticket required)
  const [isDirectResetOpen, setIsDirectResetOpen] = useState(false);
  const [directCustomerEmail, setDirectCustomerEmail] = useState('');
  const [directNewPassword, setDirectNewPassword] = useState('');
  const [allCustomersList, setAllCustomersList] = useState<any[]>([]);
  const [isExecutingDirectReset, setIsExecutingDirectReset] = useState(false);

  const fetchAllCustomers = () => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAllCustomersList(data.data);
        }
      })
      .catch((err) => console.log('Customers fetch error:', err));
  };

  const handleOpenDirectReset = () => {
    fetchAllCustomers();
    setDirectCustomerEmail('');
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let pwd = '';
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setDirectNewPassword(pwd);
    setIsDirectResetOpen(true);
  };

  const handleExecuteDirectReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directCustomerEmail || !directNewPassword) return;

    setIsExecutingDirectReset(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: directCustomerEmail,
          newPassword: directNewPassword,
          adminEmail
        })
      });
      const json = await res.json();
      if (json.success) {
        setIsDirectResetOpen(false);
        setIsSuccessBanner(json.message);
        setTimeout(() => setIsSuccessBanner(''), 6000);
        setDispatchedEmailPreview(json.email);
        setIsEmailPreviewOpen(true);
        refreshPasswordRequests();
        fetchAllCustomers();
      } else {
        alert(json.error || 'Failed to execute direct reset');
      }
    } catch (err) {
      console.error('Direct reset error:', err);
      alert('Network error while processing reset.');
    } finally {
      setIsExecutingDirectReset(false);
    }
  };

  useEffect(() => {
    refreshAdminData();
    fetchAllCustomers();

    // Dynamic live polling every 4 seconds to sync incoming customer password requests
    const poll = setInterval(() => {
      refreshPasswordRequests();
    }, 4000);
    return () => clearInterval(poll);
  }, []);

  // Handle Dynamic Service Edit Save -> PUT to backend API
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService)
      });
      const json = await res.json();
      if (json.success) {
        setServices((prev) =>
          prev.map((s) => (s.id === editingService.id ? editingService : s))
        );
      }
    } catch (err) {
      console.error('Failed to save service pricing to backend:', err);
    }

    setIsEditModalOpen(false);
    setIsSuccessBanner(`Service "${editingService.name}" updated successfully in the dynamic pricing engine!`);
    setTimeout(() => setIsSuccessBanner(''), 4000);
  };

  // Toggle active service -> PATCH /api/services/[id]
  const handleToggleServiceActive = async (id: string) => {
    const srv = services.find((s) => s.id === id);
    if (!srv) return;
    const newActiveState = !srv.isActive;

    try {
      await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newActiveState })
      });
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: newActiveState } : s))
      );
    } catch (err) {
      console.error('Failed to toggle service status:', err);
    }
  };

  // Assign Partner -> PATCH /api/orders/[id]
  const handleAssignPartner = async (orderId: string, newPartner: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedPartner: newPartner })
      });
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId || o.id === orderId ? { ...o, assignedPartner: newPartner } : o))
      );
      setIsSuccessBanner(`Order ${orderId} assigned to ${newPartner}!`);
      setTimeout(() => setIsSuccessBanner(''), 4000);
    } catch (err) {
      console.error('Failed to assign partner:', err);
    }
  };

  // Approve User Documents -> PATCH /api/orders/[id]
  const handleApproveDocuments = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminApproved: true,
          docVerificationStatus: 'Approved',
          status: 'Approved & Verified',
          docsPending: 'None (Verified by Admin)',
          adminApprovedAt: new Date().toISOString(),
          adminApprovedBy: 'Super Admin'
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId || o.id === orderId
              ? {
                  ...o,
                  adminApproved: true,
                  docVerificationStatus: 'Approved',
                  status: 'Approved & Verified',
                  docsPending: 'None (Verified by Admin)',
                  adminApprovedAt: new Date().toISOString(),
                  adminApprovedBy: 'Super Admin'
                }
              : o
          )
        );
        setIsSuccessBanner(`Order #${orderId} documents verified & approved! User registration is now successfully confirmed.`);
        setTimeout(() => setIsSuccessBanner(''), 5000);
      }
    } catch (err) {
      console.error('Failed to approve documents:', err);
    }
  };

  // Release Certificate -> PATCH /api/orders/[id]
  const handleSimulateCertificateUpload = async (orderId: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateUploaded: true,
          status: 'Incorporated',
          docsPending: 'None (All Verified)',
          certificateFileName: `Certificate_Of_Incorporation_${orderId}.pdf`
        })
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId || o.id === orderId
            ? { ...o, certificateUploaded: true, status: 'Incorporated', docsPending: 'None (All Verified)' }
            : o
        )
      );
      setIsSuccessBanner(`Official Certificate of Incorporation uploaded & released to Customer for Order ${orderId}!`);
      setTimeout(() => setIsSuccessBanner(''), 4000);
    } catch (err) {
      console.error('Failed to release certificate:', err);
    }
  };

  // Disburse Payout -> POST /api/partners
  const handleDisbursePayout = async (payoutId: string, feeEarned: number) => {
    try {
      await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'process_payout', payoutId })
      });
      setPayouts((prev) =>
        prev.map((p) => (p.id === payoutId ? { ...p, status: 'Processed' } : p))
      );
      setIsSuccessBanner(`Payout of ₹${feeEarned.toLocaleString('en-IN')} disbursed successfully via RazorpayX!`);
      setTimeout(() => setIsSuccessBanner(''), 4000);
    } catch (err) {
      console.error('Payout disbursement failed:', err);
    }
  };

  // Update Callback Status -> PATCH /api/callbacks
  const handleUpdateCallbackStatus = async (leadId: string, status: string) => {
    try {
      await fetch('/api/callbacks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status })
      });
      setCallbacks((prev) =>
        prev.map((c) => (c.id === leadId ? { ...c, status } : c))
      );
      setIsSuccessBanner(`Lead ${leadId} status updated to: ${status}!`);
      setTimeout(() => setIsSuccessBanner(''), 3000);
    } catch (err) {
      console.error('Failed to update lead:', err);
    }
  };

  // Tab Switch & Scroll Handler for KPI Cards
  const handleCardClick = (tab: 'pricing' | 'orders' | 'callbacks' | 'payouts' | 'logs' | 'passwords') => {
    setActiveTab(tab as AdminTab);
    const tabsElement = document.getElementById('admin-tabs');
    if (tabsElement) {
      tabsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Render Secure Super Admin Authentication Screen if not logged in
  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-blue-50/40 text-slate-900 flex flex-col justify-between font-sans no-scrollbar relative">
        {/* Ambient Subtle Color Accents */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Minimal Institutional Header */}
        <div className="border-b border-slate-800/90 bg-[#0B1528] px-4 sm:px-6 py-2.5 sm:py-3 shrink-0 shadow-md relative z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2.5 cursor-pointer">
              <div className="px-2.5 py-1 rounded-md border border-dashed border-slate-700 text-xs font-semibold text-slate-300 tracking-wide bg-slate-900">
                Logo
              </div>
              <span className="text-[10px] font-bold uppercase bg-amber-400/15 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded shadow-2xs">
                Super Admin
              </span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white transition px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-900/80 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back to Website</span>
            </Link>
          </div>
        </div>

        {/* Central Auth Container - Single Viewport Centered */}
        <div className="flex-1 flex items-center justify-center px-4 py-2 overflow-hidden relative z-10">
          {!isForgotPassword ? (
            /* Main Admin Login Card with Corporate Top Accent */
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden">
              {/* Colorful Corporate Top Banner Accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-500" />

              <div className="p-6 sm:p-7">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/80 rounded-2xl flex items-center justify-center mx-auto mb-2 text-blue-700 shadow-sm">
                    <KeyRound className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Security Tier 1 • Root Console</span>
                  </span>

                  <h2 className="text-xl font-black text-slate-900">Super Admin Access</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter master credentials to access platform operations & pricing engine.
                  </p>
                </div>

                {loginError && (
                  <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{loginError}</span>
                  </div>
                )}

                {forgotMessage && (
                  <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{forgotMessage}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Administrator Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@bharatfilings.com"
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Master Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setForgotStep('email');
                          setForgotEmail(adminEmail);
                          setForgotMessage('');
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline transition cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-9 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Demo Autofill Helper with Soft Tint */}
                  <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-800 block">Default Credentials:</span>
                      <span className="font-mono text-indigo-950 font-black text-[11px]">admin@bharatfilings.com / Admin@2026</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminEmail('admin@bharatfilings.com');
                        setAdminPassword('Admin@2026');
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-blue-300 text-blue-700 rounded text-[10px] font-bold transition shadow-2xs cursor-pointer"
                    >
                      Autofill
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-2.5 bg-gradient-to-r from-[#0B1528] via-[#11244A] to-[#1E3A8A] hover:from-[#11244A] hover:to-[#2563EB] text-white font-black rounded-xl text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                  >
                    {isLoggingIn ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Authenticate & Open Admin Console</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href="/login"
                      className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Single Login Portal (/login)</span>
                    </Link>

                    <Link
                      href="/"
                      className="w-full py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                      <span>Go Back to Website</span>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* Forgot Password Recovery Card */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden">
              {/* Colorful Corporate Top Banner Accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-500" />

              <div className="p-6 sm:p-7">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-2 text-amber-600 shadow-sm">
                    <KeyRound className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Reset Admin Password</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verify identity to regenerate Super Admin access credentials.
                  </p>
                </div>

                {forgotMessage && (
                  <div className={`mb-3 p-2.5 rounded-xl text-xs flex items-center gap-2 ${forgotStep === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-blue-50 border border-blue-200 text-blue-800'}`}>
                    {forgotStep === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 shrink-0 text-blue-600" />}
                    <span>{forgotMessage}</span>
                  </div>
                )}

                {forgotStep === 'email' && (
                  <form onSubmit={handleRequestOtp} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Registered Administrator Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="admin@bharatfilings.com"
                          required
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-black rounded-xl text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Send Verification OTP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="w-full py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold text-center block cursor-pointer transition"
                    >
                      Back to Admin Login
                    </button>
                  </form>
                )}

                {forgotStep === 'otp' && (
                  <form onSubmit={handleResetPassword} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        placeholder="Enter 6-digit code"
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 tracking-widest text-center focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                      />
                      <span className="text-[10px] text-slate-500 mt-0.5 block text-center">
                        Enter the 6-digit verification code sent to your registered email
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Set New Master Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Reset & Confirm New Password</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="w-full py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold text-center block cursor-pointer transition"
                    >
                      Cancel & Return to Login
                    </button>
                  </form>
                )}

                {forgotStep === 'success' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                      <p className="text-xs text-emerald-800 font-medium">
                        Your master credentials have been reset. You can now authenticate with your new password.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setForgotStep('email');
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-black rounded-xl text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Proceed to Admin Login</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Security Compliance Footer with Soft Color Badge */}
        <div className="py-2.5 px-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white/90 shrink-0 relative z-10 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>Protected by DPDP Act 2023 & MCA Audit Trails • SHA-256 Authenticated Root Session</span>
        </div>
      </div>
    );
  }

  const grossCollections = orders.reduce((sum, o) => sum + (o.amount || o.pricing?.totalAmount || 0), 0);
  const pendingPayoutsList = payouts.filter(p => (p.status || '').toLowerCase().includes('pending'));
  const pendingEscrowAmount = pendingPayoutsList.reduce((sum, p) => sum + (p.amount || p.feeEarned || 0), 0);
  const pendingEscrowBatches = pendingPayoutsList.length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Navbar: Spans 100% full width across top of screen */}
      <AdminNavbar
        currentTitle={
          activeTab === 'overview' ? 'Dashboard Overview' :
          activeTab === 'pricing' ? 'Revenue & Pricing Engine' :
          activeTab === 'orders' ? 'Orders & Govt Queue' :
          activeTab === 'callbacks' ? 'Consultation Leads' :
          activeTab === 'partners' ? 'Verified CA/CS Counsel Roster' :
          activeTab === 'payouts' ? 'Partner Payouts' :
          activeTab === 'passwords' ? 'Customer Passwords & Credential Dispatch' :
          'Audit Trail & RBAC'
        }
        onRefresh={refreshAdminData}
        isLoading={isLoading}
        onSignOut={handleSignOut}
      />

      {/* Main Body Workspace: Sidebar on left below navbar, Content on right */}
      <div className="flex-1 flex flex-row min-w-0">
        {/* Enterprise Admin Sidebar (Placed below top navbar on the left) */}
        <AdminSidebar
          activeItem={activeTab}
          onTabSelect={handleTabChange}
          ordersCount={orders.length}
          callbacksCount={callbacks.length}
          payoutsCount={payouts.filter(p => p.status === 'Pending').length}
          onSignOut={handleSignOut}
        />

        {/* Main Content Workspace (To the right of sidebar, below top navbar) */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Executive Overview Header */}
        <section className="bg-white border-b border-slate-200 px-6 py-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                    Central Operations Hub
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    MCA V3 CRC Gateway Live
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Executive Dashboard & Platform Oversight
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time operational KPIs, statutory filing throughput, legal counsel allocation, and escrow settlements.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg font-mono">
                  DPDP 2023 Sealed
                </span>
              </div>
            </div>

            {/* Metric KPI Cards (Clickable to switch tab) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Card 1: Gross Revenue */}
              <button
                type="button"
                onClick={() => handleTabChange('pricing')}
                className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-slate-300 text-left transition cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Gross Collections</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-xl font-bold text-slate-900 font-mono block">₹{grossCollections.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-emerald-600 font-medium mt-1 block flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {orders.length > 0 ? '+18.4% MoM' : 'Live Platform Metric'}
                </span>
              </button>

              {/* Card 2: Total Orders */}
              <button
                type="button"
                onClick={() => handleTabChange('orders')}
                className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-slate-300 text-left transition cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Active Filings</span>
                  <Layers className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xl font-bold text-slate-900 font-mono block">{orders.length} Filings</span>
                <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
                  {orders.filter(o => !o.adminApproved && o.docVerificationStatus !== 'Approved').length} pending verification
                </span>
              </button>

              {/* Card 3: Active Partners */}
              <button
                type="button"
                onClick={() => handleTabChange('partners')}
                className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-slate-300 text-left transition cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Counsel Network</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xl font-bold text-slate-900 font-mono block">{partners.length} Counselors</span>
                <span className="text-[11px] text-purple-600 font-medium mt-1 block">
                  {partners.length > 0 ? '100% Verified COP' : 'No Counsel Onboarded'}
                </span>
              </button>

              {/* Card 4: Pending Payouts */}
              <button
                type="button"
                onClick={() => handleTabChange('payouts')}
                className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-slate-300 text-left transition cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Pending Escrow</span>
                  <Receipt className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-xl font-bold text-slate-900 font-mono block">₹{pendingEscrowAmount.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-amber-600 font-medium mt-1 block">
                  {pendingEscrowBatches} batch settlements ready
                </span>
              </button>
            </div>
          </div>
        </section>



      {/* Success Notification */}
      {isSuccessBanner && (
        <div className="bg-emerald-600 text-white text-xs font-bold text-center py-2.5 px-4 animate-fade-in flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{isSuccessBanner}</span>
        </div>
      )}

      {/* Main Body */}
      <main className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6">
        {/* TAB 0: DASHBOARD OVERVIEW PAGE */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Live Operational Status Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">MCA CRC Gateway</span>
                  <span className="text-sm font-black text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Operational • V3 Live
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">99.98% SLA</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Verified CA/CS Network</span>
                  <span className="text-sm font-black text-slate-900 mt-0.5">{partners.length} Practicing Professionals</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('partners')}
                  className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg cursor-pointer transition"
                >
                  View Roster
                </button>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Batch Payouts</span>
                  <span className="text-sm font-black text-slate-900 mt-0.5 font-mono">₹{pendingEscrowAmount.toLocaleString('en-IN')} ({pendingEscrowBatches} Batches)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('payouts')}
                  className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg cursor-pointer transition"
                >
                  Disburse
                </button>
              </div>
            </div>

            {/* Recent Orders Filing Queue Snapshot */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                      Real-time Feed
                    </span>
                    <h3 className="text-base font-black text-slate-900">Recent Government Filings</h3>
                  </div>
                  <p className="text-xs text-slate-500">Live operational filings being fulfilled by verified partner CS/CA network.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('orders')}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Open Full Filing Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5 font-bold">Order ID</th>
                      <th className="p-3.5 font-bold">Customer & Company</th>
                      <th className="p-3.5 font-bold">Service Category</th>
                      <th className="p-3.5 font-bold">Assigned Counsel</th>
                      <th className="p-3.5 font-bold">Govt Filing Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-semibold text-slate-700">No active government filings</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Orders submitted by clients will appear here automatically.</p>
                        </td>
                      </tr>
                    ) : (
                      orders.slice(0, 4).map((ord) => {
                        const isApproved = Boolean(ord.adminApproved || ord.docVerificationStatus === 'Approved');
                        return (
                          <tr key={ord.orderId || ord.id} className="hover:bg-slate-50/70 transition">
                            <td className="p-3.5 font-mono font-bold text-blue-700">{ord.orderId || ord.id}</td>
                            <td className="p-3.5">
                              <p className="font-bold text-slate-900">{ord.companyName || ord.company?.primaryName || 'Proposed Entity'}</p>
                              <p className="text-[10px] text-slate-500">{ord.customerName || ord.auth?.name || 'Applicant'}</p>
                            </td>
                            <td className="p-3.5 font-semibold text-slate-700">{ord.serviceName || ord.service?.name || 'Corporate Registration'}</td>
                            <td className="p-3.5">
                              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-lg">
                                {ord.assignedPartner || 'Unassigned'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                !isApproved
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : (ord.status || '').toLowerCase().includes('complete') || (ord.status || '').toLowerCase().includes('incorporated')
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {!isApproved ? 'Pending Doc Verification' : (ord.status || 'Verified & Approved')}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Consultation Leads Snapshot */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Inbound Pipeline
                    </span>
                    <h3 className="text-base font-black text-slate-900">Recent Consultation Leads</h3>
                  </div>
                  <p className="text-xs text-slate-500">Inbound corporate inquiries requesting call assistance from CA/CS advisors.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('callbacks')}
                  className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Open Consultation Leads</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5 font-bold">Contact Name</th>
                      <th className="p-3.5 font-bold">Mobile & Email</th>
                      <th className="p-3.5 font-bold">Requested Service</th>
                      <th className="p-3.5 font-bold">Inbound Timestamp</th>
                      <th className="p-3.5 font-bold">Lead Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {callbacks.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          <PhoneCall className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-semibold text-slate-700">No consultation leads</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Leads generated from the website or partner portal will appear here.</p>
                        </td>
                      </tr>
                    ) : (
                      callbacks.slice(0, 3).map((cb) => (
                        <tr key={cb.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3.5 font-bold text-slate-900">{cb.name}</td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-600">{cb.mobile}</td>
                          <td className="p-3.5 font-semibold text-slate-800">{cb.service}</td>
                          <td className="p-3.5 text-slate-500 text-[11px]">{cb.requestedAt}</td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              cb.status === 'Contacted'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {cb.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: DYNAMIC SERVICE & PRICING ENGINE */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Dynamic Service Catalog & Cost Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Modify base consulting fees, govt fees, DSC token prices, partner payouts, and GST without developer code intervention.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingService({
                    id: `srv-custom-${Date.now().toString().slice(-4)}`,
                    slug: 'new-statutory-service',
                    name: 'New Custom Corporate Service',
                    category: 'incorporation',
                    categoryName: 'Company & LLP Incorporation',
                    shortDesc: 'Custom configurable service configured by Super Admin.',
                    fullDesc: 'Complete corporate compliance assistance.',
                    baseFee: 1999,
                    govFee: 1000,
                    caFee: 1000,
                    dscFee: 0,
                    gstRate: 0.18,
                    slaDays: '3-4 Days',
                    isActive: true,
                    inclusions: ['Statutory drafting', 'Filing with ROC'],
                    exclusions: [],
                    requiredDocuments: ['PAN Card', 'Aadhaar Card'],
                    faqs: []
                  });
                  setIsEditModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-200 transition cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Service</span>
              </button>
            </div>

            {/* Services Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4 font-bold">Service Name & Slug</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold">Base Fee (₹)</th>
                      <th className="p-4 font-bold">Govt / Stamp (₹)</th>
                      <th className="p-4 font-bold">Partner Payout (₹)</th>
                      <th className="p-4 font-bold">SLA Days</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {services.map((srv) => (
                      <tr key={srv.id} className="hover:bg-blue-50/30 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{srv.name}</p>
                          <p className="text-[10px] text-blue-600/80 font-mono">/services/{srv.slug}</p>
                        </td>
                        <td className="p-4">
                          {srv.category?.includes('incorporation') || srv.categoryName?.includes('Company') ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              {srv.categoryName}
                            </span>
                          ) : srv.category?.includes('tax') || srv.categoryName?.includes('GST') ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {srv.categoryName}
                            </span>
                          ) : srv.category?.includes('ip') || srv.categoryName?.includes('Trademark') ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                              {srv.categoryName}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              {srv.categoryName}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                            ₹{srv.baseFee.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
                            ₹{srv.govFee.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-indigo-800 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block">
                            ₹{srv.caFee.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">{srv.slaDays}</td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleToggleServiceActive(srv.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition flex items-center gap-1 ${
                              srv.isActive 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs' 
                                : 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${srv.isActive ? 'bg-white' : 'bg-rose-500'}`} />
                            <span>{srv.isActive ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingService({ ...srv });
                              setIsEditModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-xs font-bold transition border border-blue-200 hover:border-blue-600 flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
                          >
                            <span>Edit Pricing</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT & ALLOCATION */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    Filing Pipeline
                  </span>
                  <span className="text-xs font-bold text-slate-500">• {orders.length} Active Filings</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Order Assignment & Government Filing Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Allocate incoming orders to practicing CS/CAs, review document QC, and release final incorporation certificates.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-xs">
                <Layers className="w-9 h-9 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-800 text-sm">No filing orders recorded</p>
                <p className="text-xs text-slate-400 mt-1">Incoming client incorporations and filings will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const orderId = ord.orderId || ord.id;
                  const customerName = ord.customerName || ord.auth?.name || 'Applicant';
                  const companyName = ord.companyName || ord.company?.primaryName || 'Proposed Entity';
                  const state = ord.state || ord.company?.stateCode || 'MH';
                  const service = ord.service || ord.company?.entityType || 'Corporate Filing';
                  const amount = ord.amount || ord.pricing?.totalAmount || 0;
                  const status = ord.status || 'In Review';
                  const assignedPartner = ord.assignedPartner || ord.assignedCs?.name || 'Unassigned';
                  const docsPending = ord.docsPending || 'Pending Verification';
                  const certificateUploaded = ord.certificateUploaded;

                  const isCompleted = status.toLowerCase().includes('incorporated') || status.toLowerCase().includes('complete');
                  const isFiling = status.toLowerCase().includes('filing') || status.toLowerCase().includes('crc');
                  const isApproved = Boolean(ord.adminApproved || ord.docVerificationStatus === 'Approved');

                return (
                  <div key={orderId} className={`bg-white rounded-2xl border border-slate-200/90 border-l-4 ${isApproved ? 'border-l-emerald-500' : 'border-l-amber-500'} p-5 shadow-xs hover:shadow-md transition space-y-4`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">{orderId}</span>
                          <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
                            {state}
                          </span>
                          <span className="text-xs font-bold text-slate-900">• {customerName}</span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900 mt-1">{companyName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Service: <span className="text-slate-800 font-semibold">{service}</span> • Total Paid: <strong className="text-emerald-700 font-mono">₹{amount.toLocaleString('en-IN')}</strong>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Verification & Filing</span>
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full inline-block border ${
                          !isApproved
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : isCompleted
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : isFiling
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : 'bg-blue-100 text-blue-800 border-blue-300'
                        }`}>
                          {!isApproved ? 'Pending Admin Document Verification' : status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl border border-blue-100">
                        <span className="text-[10px] font-extrabold uppercase text-blue-900 block mb-1.5 flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-600" />
                          <span>Assigned Professional Partner</span>
                        </span>
                        <select
                          value={assignedPartner}
                          onChange={(e) => handleAssignPartner(orderId, e.target.value)}
                          className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 cursor-pointer shadow-2xs focus:border-blue-600 focus:outline-none"
                        >
                          <option value="CS Priya Sharma (FCS #11849)">CS Priya Sharma (FCS #11849)</option>
                          <option value="CA Manish Agrawal (FCA #08291)">CA Manish Agrawal (FCA #08291)</option>
                          <option value="CS Rakesh Patel (ACS #29401)">CS Rakesh Patel (ACS #29401)</option>
                        </select>
                      </div>

                      <div className="p-3.5 bg-gradient-to-br from-slate-50 to-amber-50/50 rounded-xl border border-amber-100 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-amber-900 block mb-1.5 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            <span>Document Verification QC</span>
                          </span>
                          <span className={`inline-block font-bold text-xs px-2.5 py-1 rounded-md border ${
                            isApproved
                              ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                              : 'text-amber-800 bg-amber-50 border-amber-300'
                          }`}>
                            {isApproved ? '✓ Documents Approved' : '⏳ Pending Admin Verification'}
                          </span>
                        </div>

                        {!isApproved ? (
                          <button
                            type="button"
                            onClick={() => handleApproveDocuments(orderId)}
                            className="mt-2 w-full py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verify & Approve Registration</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-700 mt-2 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Registration Confirmed
                          </span>
                        )}
                      </div>

                      <div className="p-3.5 bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-xl border border-emerald-100 flex flex-col justify-between">
                        <span className="text-[10px] font-extrabold uppercase text-emerald-900 block mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-emerald-600" />
                          <span>Government Certificate Release</span>
                        </span>
                        {certificateUploaded ? (
                          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> COI Released to Client
                          </span>
                        ) : !isApproved ? (
                          <div className="mt-1 p-2 bg-slate-100 border border-slate-200 rounded-lg text-center">
                            <span className="text-[11px] text-slate-500 font-medium">Verify documents before releasing COI</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSimulateCertificateUpload(orderId)}
                            className="mt-1 w-full py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload & Release COI</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONSULTATION LEADS (CALLBACKS) */}
        {activeTab === 'callbacks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Live Inquiries
                  </span>
                  <span className="text-xs font-bold text-slate-500">• {callbacks.length} Leads Logged</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Incoming Consultation Leads & Advisory Callbacks
                </h3>
                <p className="text-xs text-slate-500">
                  Leads captured in real-time from the public homepage hero consultation desk and advisory booking forms.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 font-bold">Lead ID & Date</th>
                    <th className="p-4 font-bold">Applicant Name</th>
                    <th className="p-4 font-bold">Phone Number</th>
                    <th className="p-4 font-bold">Service Requested</th>
                    <th className="p-4 font-bold">City</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {callbacks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">
                        <PhoneCall className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700">No consultation leads logged</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Callback requests from prospective clients will appear here in real-time.</p>
                      </td>
                    </tr>
                  ) : (
                    callbacks.map((c) => (
                      <tr key={c.id} className="hover:bg-blue-50/30 transition">
                        <td className="p-4 font-mono font-bold text-slate-900 bg-slate-50/50">{c.id}</td>
                        <td className="p-4 font-extrabold text-slate-900">{c.name}</td>
                        <td className="p-4">
                          <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block">
                            +91 {c.mobile}
                          </span>
                        </td>
                        <td className="p-4 text-slate-700 font-semibold">{c.service}</td>
                        <td className="p-4 text-slate-600">{c.city}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${
                            c.status === 'Converted' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                            c.status === 'Contacted' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            'bg-amber-100 text-amber-900 border-amber-300'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {c.status === 'Pending' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateCallbackStatus(c.id, 'Contacted')}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-[11px] font-bold border border-blue-200 hover:border-blue-600 transition cursor-pointer shadow-2xs"
                            >
                              Mark Contacted
                            </button>
                          )}
                          {c.status !== 'Converted' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateCallbackStatus(c.id, 'Converted')}
                              className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white rounded-lg text-[11px] font-bold transition shadow-2xs cursor-pointer"
                            >
                              Convert to Order
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PARTNER PAYOUTS */}
        {activeTab === 'payouts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                    CA/CS Financials
                  </span>
                  <span className="text-xs font-bold text-slate-500">• Automated RazorpayX Gateway</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Professional Partner Payouts & Commission Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Track professional fees earned by practicing CS and CAs based on completed order fulfillment.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 font-bold">Partner Name</th>
                    <th className="p-4 font-bold">Completed Filings</th>
                    <th className="p-4 font-bold">Total Fees Earned</th>
                    <th className="p-4 font-bold">Disbursement Account</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {payouts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-400">
                        <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700">No partner payouts pending</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Commission ledgers and counsel fee releases will appear here.</p>
                      </td>
                    </tr>
                  ) : (
                    payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-purple-50/30 transition">
                        <td className="p-4 font-extrabold text-slate-900">{p.partner}</td>
                        <td className="p-4 font-semibold text-slate-700">{p.orders} Orders</td>
                        <td className="p-4">
                          <span className="font-mono font-black text-emerald-800 text-sm bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                            ₹{p.feeEarned.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-600">{p.bank}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${
                            p.status === 'Processed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {p.status !== 'Processed' ? (
                            <button
                              type="button"
                              onClick={() => handleDisbursePayout(p.id, p.feeEarned)}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5 ml-auto"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Disburse via RazorpayX</span>
                            </button>
                          ) : (
                            <span className="text-emerald-700 font-bold text-xs inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: VERIFIED CA/CS PARTNER ROSTER PAGE */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 border border-purple-300 px-2.5 py-0.5 rounded-full">
                    Verified Professional Counsel
                  </span>
                  <span className="text-xs font-bold text-slate-500">• 100% ICAI / ICSI / Bar Council Verified</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Practicing Chartered Accountants & Company Secretaries
                </h3>
                <p className="text-xs text-slate-500">
                  Manage active practicing partners handling SPICe+ Part B drafting, MOA/AOA attestation, and DIN KYC.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={partnerSearch}
                    onChange={(e) => setPartnerSearch(e.target.value)}
                    placeholder="Search partner or council..."
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition shadow-2xs"
                  />
                </div>

                <select
                  value={partnerStateFilter}
                  onChange={(e) => setPartnerStateFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition shadow-2xs"
                >
                  <option value="All">All States</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </select>
              </div>
            </div>

            {/* Partners Roster Grid */}
            {partners.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <Users className="w-9 h-9 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No verified professionals found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  No external CA/CS partners have been onboarded yet. Newly enrolled professionals will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partners
                  .filter((p) => {
                    const matchesSearch = 
                      p.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
                      p.councilNumber.toLowerCase().includes(partnerSearch.toLowerCase()) ||
                      p.specialization.toLowerCase().includes(partnerSearch.toLowerCase());
                    const matchesState = partnerStateFilter === 'All' || p.state === partnerStateFilter;
                    return matchesSearch && matchesState;
                  })
                  .map((ptr) => (
                    <div key={ptr.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                              {ptr.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900">{ptr.name}</h4>
                              <p className="text-[11px] font-bold text-purple-700">{ptr.title}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                            {ptr.copStatus}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-semibold">Council ID:</span>
                            <span className="font-mono font-bold text-slate-900">{ptr.councilNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-semibold">Jurisdiction:</span>
                            <span className="font-semibold text-slate-900">{ptr.state}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-semibold">Completed Filings:</span>
                            <span className="font-bold text-slate-900">{ptr.completedFilings} MCA Orders</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-semibold">Council Status:</span>
                            <span className="font-bold text-emerald-700">
                              {ptr.copStatus || 'Active & Verified'}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mb-4">
                          <span className="font-bold text-slate-700">Specialization:</span> {ptr.specialization}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500 font-mono truncate max-w-[180px]">{ptr.contact.email}</span>
                        <a
                          href={`tel:${ptr.contact.phone}`}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg transition"
                        >
                          Contact
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: AUDIT LOGS & RBAC */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                    Statutory Compliance
                  </span>
                  <span className="text-xs font-bold text-slate-500">• DPDP Act 2023 Compliant</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Security Audit Trail & Role-Based Access Control (RBAC)
                </h3>
                <p className="text-xs text-slate-500">
                  Immutable activity logs recording administrative modifications, partner document accesses, and payment webhooks.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-800 text-sm">No security audit events recorded</p>
              <p className="text-xs text-slate-400 mt-1">
                DPDP Act 2023 compliant audit logs will appear here upon administrative modifications and security access events.
              </p>
            </div>
          </div>
        )}

        {/* TAB 7: CUSTOMER PASSWORDS & CREDENTIAL DISPATCH */}
        {activeTab === 'passwords' && (
          <div className="space-y-6">
            {/* Header with Regulatory Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    Statutory Credential Security
                  </span>
                  <span className="text-xs font-bold text-slate-500">• DPDP Act 2023 & MCA V3 Policy</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                  <span>Customer Credential & Password Management Desk</span>
                </h3>
                <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
                  Per security guidelines, customers cannot directly change passwords in their portal. Review incoming requests, regenerate access keys, and trigger automated emails containing the updated login credentials to the client.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenDirectReset}
                  className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Direct Customer Reset</span>
                </button>
                <button
                  type="button"
                  onClick={refreshPasswordRequests}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Requests</span>
                </button>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">Total Requests</span>
                <span className="text-2xl font-black text-slate-900">{passwordRequests.length}</span>
                <span className="text-[10px] text-slate-400 block">Logged in statutory audit register</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs space-y-1 bg-gradient-to-br from-amber-50/40 to-white">
                <span className="text-[11px] font-bold text-amber-800 block uppercase">Pending Admin Action</span>
                <span className="text-2xl font-black text-amber-600">
                  {passwordRequests.filter((r) => r.status !== 'Completed').length}
                </span>
                <span className="text-[10px] text-amber-700/80 block">Awaiting credential regeneration</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-1 bg-gradient-to-br from-emerald-50/40 to-white">
                <span className="text-[11px] font-bold text-emerald-800 block uppercase">Credentials Dispatched</span>
                <span className="text-2xl font-black text-emerald-600">
                  {passwordRequests.filter((r) => r.status === 'Completed').length}
                </span>
                <span className="text-[10px] text-emerald-700/80 block">Delivered via automated email</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs space-y-1 bg-gradient-to-br from-blue-50/40 to-white">
                <span className="text-[11px] font-bold text-blue-800 block uppercase">Statutory Delivery</span>
                <span className="text-2xl font-black text-blue-600">100%</span>
                <span className="text-[10px] text-blue-700/80 block">Zero direct client overwrites</span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setPasswordFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    passwordFilterStatus === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Requests ({passwordRequests.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPasswordFilterStatus('pending')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    passwordFilterStatus === 'pending'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pending Action ({passwordRequests.filter((r) => r.status !== 'Completed').length})
                </button>
                <button
                  type="button"
                  onClick={() => setPasswordFilterStatus('completed')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    passwordFilterStatus === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Completed & Dispatched ({passwordRequests.filter((r) => r.status === 'Completed').length})
                </button>
              </div>

              <div className="relative min-w-[260px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, email, ticket ID..."
                  value={passwordSearchQuery}
                  onChange={(e) => setPasswordSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Ticket ID</th>
                      <th className="py-3 px-4">Customer & Entity</th>
                      <th className="py-3 px-4">Registered Contact</th>
                      <th className="py-3 px-4">Reason & Urgency</th>
                      <th className="py-3 px-4">Requested At</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {passwordRequests
                      .filter((req) => {
                        const matchesFilter =
                          passwordFilterStatus === 'all'
                            ? true
                            : passwordFilterStatus === 'pending'
                            ? req.status !== 'Completed'
                            : req.status === 'Completed';

                        const query = passwordSearchQuery.toLowerCase().trim();
                        const matchesSearch =
                          !query ||
                          req.id.toLowerCase().includes(query) ||
                          req.customerName.toLowerCase().includes(query) ||
                          req.customerEmail.toLowerCase().includes(query) ||
                          req.companyName.toLowerCase().includes(query);

                        return matchesFilter && matchesSearch;
                      })
                      .map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{req.id}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">{req.customerName}</span>
                            <span className="text-[11px] text-slate-500 block">{req.companyName}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800 block flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{req.customerEmail}</span>
                            </span>
                            <span className="text-[11px] text-slate-500 block flex items-center gap-1 mt-0.5">
                              <PhoneCall className="w-3 h-3 text-slate-400" />
                              <span>{req.customerMobile || '9876543210'}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <span className="font-medium text-slate-800 block">{req.reason}</span>
                              {req.urgency === 'Urgent' ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                  <ShieldAlert className="w-3 h-3 text-rose-600" />
                                  <span>Urgent</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>Normal</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {new Date(req.createdAt).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </td>
                          <td className="py-3.5 px-4">
                            {req.status === 'Completed' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Reset & Emailed</span>
                              </span>
                            ) : req.status === 'Rejected' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>Rejected</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                <span>Pending Action</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {req.status === 'Completed' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                {req.emailDispatchDetails && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDispatchedEmailPreview(req.emailDispatchDetails);
                                      setIsEmailPreviewOpen(true);
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                    title="View Dispatched Email Details"
                                  >
                                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                                    <span>View Sent Email</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleOpenResetModal(req)}
                                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition cursor-pointer"
                                  title="Re-issue new password"
                                >
                                  <span>Re-issue</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenResetModal(req)}
                                className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 ml-auto cursor-pointer"
                              >
                                <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                                <span>Reset & Send Email</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}

                    {passwordRequests.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <KeyRound className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          <p className="font-bold text-slate-700">No customer password requests in queue</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Incoming requests submitted from customer portals will appear here.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Dynamic Pricing Engine Modal */}
      {isEditModalOpen && editingService && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overscroll-contain overflow-y-auto"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto overscroll-contain my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Colorful Modal Header Accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 rounded-t-2xl" />

            <div className="p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <DollarSign className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Configure Pricing & Terms
                    </h3>
                    <p className="text-[11px] text-slate-500">Super Admin Dynamic Cost Engine</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-base transition cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase text-slate-700 mb-1">Service Title</label>
                  <input
                    type="text"
                    required
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-semibold focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Platform Consultancy Fee (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={editingService.baseFee}
                      onChange={(e) => setEditingService({ ...editingService, baseFee: Number(e.target.value) })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 font-mono font-bold focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Govt Statutory / Stamp Fee (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={editingService.govFee}
                      onChange={(e) => setEditingService({ ...editingService, govFee: Number(e.target.value) })}
                      className="w-full py-2 px-3 rounded-xl border border-teal-300 font-mono font-bold text-teal-800 bg-teal-50/50 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Partner Payout Fee (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={editingService.caFee}
                      onChange={(e) => setEditingService({ ...editingService, caFee: Number(e.target.value) })}
                      className="w-full py-2 px-3 rounded-xl border border-indigo-300 font-mono font-bold text-indigo-800 bg-indigo-50/50 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      DSC Token Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={editingService.dscFee}
                      onChange={(e) => setEditingService({ ...editingService, dscFee: Number(e.target.value) })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 font-mono font-bold focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">SLA Turnaround Time</label>
                    <input
                      type="text"
                      value={editingService.slaDays}
                      onChange={(e) => setEditingService({ ...editingService, slaDays: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 font-semibold focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">GST Tax Rate</label>
                    <select
                      value={editingService.gstRate}
                      onChange={(e) => setEditingService({ ...editingService, gstRate: Number(e.target.value) })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 font-semibold bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value={0.18}>18% GST (Standard)</option>
                      <option value={0.12}>12% GST</option>
                      <option value={0.0}>0% (Tax Exempt)</option>
                    </select>
                  </div>
                </div>

                {/* Calculated Transparency Breakdown Preview */}
                <div className="p-3.5 bg-gradient-to-br from-slate-900 to-[#0B1528] text-white rounded-xl space-y-1.5 font-mono text-[11px] border border-slate-800 shadow-inner">
                  <p className="text-amber-400 font-sans font-bold uppercase text-[10px] tracking-wider">Real-time Customer Price Preview:</p>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Taxable Subtotal (Base + DSC):</span>
                    <span className="font-bold">₹{(editingService.baseFee + editingService.dscFee).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-blue-300">
                    <span>GST ({(editingService.gstRate * 100)}%):</span>
                    <span className="font-bold">₹{Math.round((editingService.baseFee + editingService.dscFee) * editingService.gstRate).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Statutory Govt Levy:</span>
                    <span className="font-bold">₹{editingService.govFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-black border-t border-slate-700/80 pt-1.5 text-xs text-white">
                    <span>Total Client Payable:</span>
                    <span className="text-amber-400">₹{(editingService.baseFee + editingService.dscFee + Math.round((editingService.baseFee + editingService.dscFee) * editingService.gstRate) + editingService.govFee).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-1/3 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 bg-gradient-to-r from-[#0B1528] via-[#11244A] to-[#1E3A8A] hover:from-[#11244A] hover:to-[#2563EB] text-white rounded-xl font-black shadow-md cursor-pointer transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Save & Apply Changes Instantly</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Customer Password Reset & Email Dispatch Modal */}
      {isPasswordModalOpen && selectedPasswordRequest && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overscroll-contain overflow-y-auto"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto overscroll-contain my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Accent Gradient */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-blue-600 rounded-t-2xl" />

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Reset Customer Password & Dispatch Email
                    </h3>
                    <p className="text-[11px] text-slate-500">MCA V3 Statutory Credential Generation</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-base transition cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* Customer Information Card */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Customer:</span>
                  <span className="font-bold text-slate-900">{selectedPasswordRequest.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Entity:</span>
                  <span className="font-bold text-slate-900">{selectedPasswordRequest.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Recipient Email:</span>
                  <span className="font-bold text-blue-700">{selectedPasswordRequest.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Reset Reason:</span>
                  <span className="font-semibold text-slate-800">{selectedPasswordRequest.reason}</span>
                </div>
              </div>

              <form onSubmit={handleExecuteReset} className="space-y-4 text-xs">
                {/* New Password Input with Generator */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">
                      New Customer Password <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Generate Strong Password</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={adminNewPassword}
                      onChange={(e) => setAdminNewPassword(e.target.value)}
                      placeholder="e.g. Nova#2026!Sec"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-xs focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Sender Email Address */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">
                    Administrator Dispatch Address
                  </label>
                  <input
                    type="text"
                    disabled
                    value="admin@bharatfilings.com (Master Admin Console)"
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-xs font-medium cursor-not-allowed"
                  />
                </div>

                {/* Automated Email Preview */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Automated Email Preview to Customer</span>
                  </label>
                  <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-1.5 border border-slate-800 shadow-inner">
                    <p className="text-slate-400"><strong>To:</strong> {selectedPasswordRequest.customerEmail}</p>
                    <p className="text-slate-400"><strong>From:</strong> admin@bharatfilings.com</p>
                    <p className="text-amber-300"><strong>Subject:</strong> [Security Notice] Your BharatFilings Portal Login Credentials Have Been Updated ({selectedPasswordRequest.id})</p>
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-300 leading-relaxed font-sans">
                      <p>Dear {selectedPasswordRequest.customerName},</p>
                      <p className="mt-1">
                        Pursuant to your request, the Security Administrator has verified your identity and updated your login credentials for <strong>{selectedPasswordRequest.companyName}</strong>.
                      </p>
                      <div className="my-2 p-2 bg-slate-800/80 rounded border border-slate-700 font-mono text-emerald-400">
                        <div>Portal: http://localhost:3000/login</div>
                        <div>User ID: {selectedPasswordRequest.customerEmail}</div>
                        <div>New Password: <span className="text-white font-bold">{adminNewPassword || '[Enter Password]'}</span></div>
                      </div>
                      <p className="text-slate-400 text-[9px]">
                        DPDP Act 2023 Notice: Do not share these credentials. If you did not authorize this change, alert support immediately.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admin Audit Notes */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Administrative Notes (Logged to Audit Trail)</label>
                  <input
                    type="text"
                    value={adminResetNotes}
                    onChange={(e) => setAdminResetNotes(e.target.value)}
                    placeholder="e.g. Identity verified via registered mobile OTP call."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="w-1/3 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isExecutingReset || !adminNewPassword}
                    className="w-2/3 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md cursor-pointer transition flex items-center justify-center gap-1.5"
                  >
                    {isExecutingReset ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Dispatching Email...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5 text-amber-300" />
                        <span>Confirm Reset & Dispatch Email</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sent Email Audit Log Modal */}
      {isEmailPreviewOpen && dispatchedEmailPreview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overscroll-contain overflow-y-auto"
          onClick={() => setIsEmailPreviewOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto overscroll-contain my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-2xl" />

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Dispatched Statutory Credential Email
                    </h3>
                    <p className="text-[11px] text-slate-500">Outbound Administrative Transmission Log</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEmailPreviewOpen(false)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-base transition cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Email dispatched successfully to <strong>{dispatchedEmailPreview.to}</strong>.</span>
              </div>

              {/* Email Envelope */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-50 p-3 border-b border-slate-200 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dispatched:</span>
                    <span className="text-slate-800 font-bold">{new Date(dispatchedEmailPreview.sentAt).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">From:</span>
                    <span className="text-slate-800 font-bold">{dispatchedEmailPreview.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">To:</span>
                    <span className="text-blue-700 font-bold">{dispatchedEmailPreview.to}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Subject:</span>
                    <span className="text-slate-900 font-bold">{dispatchedEmailPreview.subject}</span>
                  </div>
                </div>

                <div className="p-4 bg-white whitespace-pre-wrap font-mono text-[11px] text-slate-800 max-h-60 overflow-y-auto leading-relaxed">
                  {dispatchedEmailPreview.bodySnippet}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEmailPreviewOpen(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Customer Password Reset Modal */}
      {isDirectResetOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overscroll-contain overflow-y-auto"
          onClick={() => setIsDirectResetOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 rounded-t-2xl" />

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Direct Customer Password Reset
                    </h3>
                    <p className="text-[11px] text-slate-500">Generate Credentials & Dispatch Email to Client</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDirectResetOpen(false)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-base transition cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleExecuteDirectReset} className="space-y-4 text-xs">
                {/* Customer Selection or Input */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Select Existing Customer or Enter Email</label>
                  {allCustomersList.length > 0 && (
                    <select
                      onChange={(e) => setDirectCustomerEmail(e.target.value)}
                      value={directCustomerEmail}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs font-semibold mb-2"
                    >
                      <option value="">-- Choose from Registered Customer Roster --</option>
                      {allCustomersList.map((c) => (
                        <option key={c.id || c.email} value={c.email}>
                          {c.name} ({c.companyName}) - {c.email}
                        </option>
                      ))}
                    </select>
                  )}
                  <input
                    type="email"
                    required
                    placeholder="e.g. founder@company.in or client@example.com"
                    value={directCustomerEmail}
                    onChange={(e) => setDirectCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* New Password Input with Generator */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">New Password to Assign</label>
                    <button
                      type="button"
                      onClick={() => {
                        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
                        let pwd = '';
                        for (let i = 0; i < 12; i++) {
                          pwd += chars.charAt(Math.floor(Math.random() * chars.length));
                        }
                        setDirectNewPassword(pwd);
                      }}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Regenerate Password</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={directNewPassword}
                    onChange={(e) => setDirectNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Sender Email Info */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-slate-600 text-[11px]">
                  <p><strong>Outbound Email:</strong> admin@bharatfilings.com</p>
                  <p><strong>Statutory Notification:</strong> An encrypted credential dispatch will be delivered to <strong>{directCustomerEmail || '[Customer Email]'}</strong> containing portal URL and the new password.</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsDirectResetOpen(false)}
                    className="w-1/3 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700 text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isExecutingDirectReset || !directCustomerEmail || !directNewPassword}
                    className="w-2/3 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isExecutingDirectReset ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5 text-amber-300" />
                        <span>Reset & Dispatch Credentials</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
