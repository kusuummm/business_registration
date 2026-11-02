'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Building2, 
  Phone, 
  Mail,
  ChevronRight,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  // Strict page scroll lock - guarantees 1-page display with zero window scrolling
  useEffect(() => {
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;
    const origHtmlHeight = document.documentElement.style.height;
    const origBodyHeight = document.body.style.height;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';

    return () => {
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.style.overflow = origBodyOverflow;
      document.documentElement.style.height = origHtmlHeight;
      document.body.style.height = origBodyHeight;
    };
  }, []);

  // Smart role detection based on entered credentials
  const detectedRole = useMemo(() => {
    const clean = identifier.trim().toLowerCase();
    if (!clean) return null;

    if (
      clean.includes('admin') || 
      clean === 'root' || 
      clean.startsWith('adm-') || 
      clean.startsWith('adm_')
    ) {
      return 'admin';
    }

    if (
      clean.includes('partner') || 
      clean.startsWith('ca.') || 
      clean.startsWith('cs.') || 
      clean.startsWith('adv.')
    ) {
      return 'partner';
    }

    return 'customer';
  }, [identifier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId) {
      setErrorMsg('Please enter your registered mobile number, email, or user ID.');
      return;
    }

    if (!cleanPass) {
      setErrorMsg('Please enter your password or verification PIN.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: cleanId,
          password: cleanPass,
          mode: detectedRole || undefined
        })
      });

      const json = await res.json();

      if (!json.success) {
        setErrorMsg(json.error || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
        return;
      }

      if (json.role === 'admin') {
        sessionStorage.setItem('app_admin_auth', 'true');
        localStorage.setItem('app_admin_auth', 'true');
        setSuccessMsg('Administrator verified! Redirecting to Master Admin Console...');
        setTimeout(() => {
          router.push('/admin');
        }, 350);
      } else if (json.role === 'partner') {
        sessionStorage.setItem('app_partner_auth', 'true');
        localStorage.setItem('app_partner_auth', 'true');
        setSuccessMsg('Partner verified! Redirecting to CA/CS Workbench...');
        setTimeout(() => {
          router.push('/partner');
        }, 350);
      } else {
        localStorage.setItem('app_customer_user', JSON.stringify(json.user));
        localStorage.setItem('app_customer_auth', 'true');
        sessionStorage.setItem('app_customer_auth', 'true');
        window.dispatchEvent(new CustomEvent('bf_customer_user_updated'));
        setSuccessMsg('Welcome back! Redirecting to Client Compliance Portal...');
        setTimeout(() => {
          router.push('/customer');
        }, 350);
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Network error connecting to login server.');
      setIsLoading(false);
    }
  };

  // 1-Click Demo Pre-Fill Handlers
  const handleFillCustomer = () => {
    setIdentifier('9876543210');
    setPassword('client123');
    setErrorMsg('');
    setActiveDemo('client');
  };

  const handleFillAdmin = () => {
    setIdentifier('admin@corporatefilings.in');
    setPassword('Admin@2026');
    setErrorMsg('');
    setActiveDemo('admin');
  };

  const handleFillPartner = () => {
    setIdentifier('partner.ca@corporatefilings.in');
    setPassword('partner123');
    setErrorMsg('');
    setActiveDemo('partner');
  };

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-gradient-to-br from-sky-100/90 via-blue-50 to-indigo-100/80 text-slate-800 flex flex-col font-sans select-none relative">
      {/* Absolute CSS guarantee against document scrolling */}
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          overflow: hidden !important;
          height: 100% !important;
          max-height: 100vh !important;
        }
      `}} />

      {/* Colorful Ambient Light Blue Background Auras */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-400/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Corporate Deep Navy Top Header Bar (Height: 44px, Matches Website Theme) */}
      <header className="h-11 px-4 sm:px-6 md:px-8 bg-[#0F2744] border-b border-blue-900/60 text-white flex items-center justify-between relative z-10 shrink-0 shadow-sm">
        <Link href="/" className="flex items-center cursor-pointer group min-w-[100px] h-7" aria-label="Home">
          {/* Empty space reserved for future logo */}
          <div className="w-28 sm:w-32 h-6" />
        </Link>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MCA V3 Portal Operational</span>
          </div>

          <a
            href="tel:18008892244"
            className="text-[11px] font-semibold text-sky-300 hover:text-white transition flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5 text-sky-400" />
            <span>1800-889-2244</span>
          </a>

          <span className="text-blue-800 hidden sm:inline">|</span>

          <Link
            href="/"
            className="text-[11px] font-bold text-slate-200 hover:text-amber-300 transition flex items-center gap-0.5 cursor-pointer"
          >
            <span>Back to Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container: Exact-fit, perfectly centered in remaining viewport */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-3 md:p-4 min-h-0 overflow-hidden relative z-10">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-[940px] rounded-2xl border border-sky-200 shadow-2xl shadow-sky-900/15 bg-white overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-full relative">
          
          {/* Top Colorful Accent Stripe (Matches Website Theme) */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 z-20" />

          {/* Left Column: Rich Light Blue Corporate Showcase */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD]/85 to-[#BFDBFE] p-5 lg:p-6 text-slate-800 flex flex-col justify-between border-r border-sky-300 relative hidden md:flex">
            
            {/* Top Header & Official Context */}
            <div className="space-y-2 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-sky-300 text-sky-950 text-[10px] font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>MCA V3 Certified Portal</span>
              </div>

              <h2 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight leading-snug">
                Company Incorporation & <br />
                <span className="text-blue-700">Statutory Filings</span>
              </h2>

              <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                Centralized secretarial desk for Private Limited, LLP, and OPC statutory dockets with certified Company Secretaries.
              </p>
            </div>

            {/* Middle: Filing Lifecycle Tracker (Crisp Floating White Card on Light Blue) */}
            <div className="my-auto py-3">
              <div className="rounded-xl border border-sky-200 bg-white/95 p-3.5 space-y-3 shadow-md shadow-sky-900/10">
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-mono text-slate-800 font-bold">
                    <span className="text-slate-500">SRN:</span>
                    <span className="text-blue-700 font-bold">AA92841029</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                    Active Filing
                  </span>
                </div>

                <div className="space-y-2.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>SPICe+ Part A Name Approval</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Approved
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>DSC Tokens & Director DINs</span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      Completed
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-800 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>ROC Scrutiny & Certificate</span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      In Scrutiny
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                  <span>Assigned Professional:</span>
                  <span className="font-bold text-blue-700">CS Advisory Desk</span>
                </div>
              </div>
            </div>

            {/* Bottom Institutional Trust Notes */}
            <div className="pt-3 border-t border-sky-300/80 space-y-1.5 text-[10px] text-slate-700 font-medium">
              <div className="flex items-center justify-between">
                <span>Governing Authority:</span>
                <span className="text-slate-900 font-bold">Ministry of Corporate Affairs</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Security Standard:</span>
                <span className="text-slate-900 font-bold">256-Bit SSL • UIDAI Privacy Masking</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Assistance Line:</span>
                <span className="text-blue-700 font-bold font-mono">1800-889-2244 (Toll-Free)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Single Unified Interactive Form (No Separate Columns/Tabs) */}
          <div className="md:col-span-7 p-4 sm:p-5 lg:p-6 flex flex-col justify-center bg-white overflow-y-auto no-scrollbar">
            
            {/* Header Content */}
            <div className="space-y-1 mb-3">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Sign In
              </h1>
              <p className="text-xs text-slate-500">
                Enter your registered mobile number, email, or credentials to access your dashboard.
              </p>
            </div>

            {/* Alert Messages */}
            {errorMsg && (
              <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-1.5 text-[11px] text-rose-700 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-1.5 text-[11px] text-emerald-800 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold">{successMsg}</span>
              </div>
            )}

            {/* Single Unified Sign-In Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
              {/* Input 1: Identifier */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center justify-between text-[11px]">
                  <span>Registered Mobile, Email, or User ID</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {detectedRole === 'admin' ? (
                      <span className="text-amber-600 font-semibold">Admin Detected</span>
                    ) : detectedRole === 'partner' ? (
                      <span className="text-purple-600 font-semibold">Partner Detected</span>
                    ) : (
                      'auto-routes to portal'
                    )}
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    {detectedRole === 'admin' ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    ) : detectedRole === 'partner' ? (
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    ) : (
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210 or yourname@company.com"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setActiveDemo(null);
                    }}
                    className="w-full pl-8 pr-2.5 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 font-semibold text-xs placeholder:text-slate-400 outline-none hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition duration-150"
                  />
                </div>
              </div>

              {/* Input 2: Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 text-[11px]">
                    Password or PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('If you forgot your password, contact your dedicated officer or administrator.');
                    }}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold transition cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your confidential password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setActiveDemo(null);
                    }}
                    className="w-full pl-8 pr-8 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 font-semibold text-xs placeholder:text-slate-400 outline-none hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition duration-150"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & 256-Bit Pill */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 text-[10px]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit Encrypted
                </span>
              </div>

              {/* Primary Action Button (Matches Website Theme) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white rounded-lg font-bold text-xs shadow-md shadow-blue-500/20 transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>
                      {detectedRole === 'admin'
                        ? 'Continue to Admin Console'
                        : detectedRole === 'partner'
                        ? 'Continue to Partner Workbench'
                        : 'Continue to Portal'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Reviewer Test Credentials */}
            <div className="mt-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-1">
                <span className="uppercase tracking-wider text-slate-600">
                  Reviewer Demo Accounts
                </span>
                <span className="text-slate-400 font-normal">1-Click Prefill</span>
              </div>

              {/* Compact 3-Column Demo Credentials */}
              <div className="grid grid-cols-3 gap-1.5">
                {/* Client Demo */}
                <button
                  type="button"
                  onClick={handleFillCustomer}
                  className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                    activeDemo === 'client'
                      ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300 shadow-sm'
                      : 'bg-gradient-to-br from-blue-50 to-blue-100/60 hover:from-blue-100 hover:to-blue-200/70 border-blue-200 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center mb-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-white bg-blue-600 px-1.5 py-0.5 rounded shadow-2xs">
                      Client
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-700 leading-tight">
                    ID: <span className="font-mono font-bold text-blue-950">9876543210</span>
                  </div>
                  <div className="text-[10px] text-slate-600 leading-tight mt-0.5">
                    Pass: <span className="font-mono font-bold text-slate-800">client123</span>
                  </div>
                </button>

                {/* Admin Demo */}
                <button
                  type="button"
                  onClick={handleFillAdmin}
                  className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                    activeDemo === 'admin'
                      ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-300 shadow-sm'
                      : 'bg-gradient-to-br from-amber-50 to-amber-100/60 hover:from-amber-100 hover:to-amber-200/70 border-amber-200 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center mb-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-white bg-amber-600 px-1.5 py-0.5 rounded shadow-2xs">
                      Admin
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-700 leading-tight truncate" title="admin@corporatefilings.in">
                    ID: <span className="font-mono font-bold text-amber-950">admin@...</span>
                  </div>
                  <div className="text-[10px] text-slate-600 leading-tight mt-0.5">
                    Pass: <span className="font-mono font-bold text-slate-800">Admin@2026</span>
                  </div>
                </button>

                {/* Partner Demo */}
                <button
                  type="button"
                  onClick={handleFillPartner}
                  className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                    activeDemo === 'partner'
                      ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-300 shadow-sm'
                      : 'bg-gradient-to-br from-purple-50 to-purple-100/60 hover:from-purple-100 hover:to-purple-200/70 border-purple-200 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-center mb-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-white bg-purple-600 px-1.5 py-0.5 rounded shadow-2xs">
                      Partner
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-700 leading-tight truncate" title="partner.ca@corporatefilings.in">
                    ID: <span className="font-mono font-bold text-purple-950">partner.ca</span>
                  </div>
                  <div className="text-[10px] text-slate-600 leading-tight mt-0.5">
                    Pass: <span className="font-mono font-bold text-slate-800">partner123</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Registration Link */}
            <div className="mt-2 pt-1.5 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-600">
                New founder or registering a new company?{' '}
                <Link href="/pricing" className="text-blue-600 font-bold hover:underline">
                  Browse Packages & Start Filing
                </Link>
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Slim Institutional Footer (Height: 28px) */}
      <footer className="h-7 px-4 flex items-center justify-center text-[10px] text-slate-400 border-t border-slate-200/60 bg-white/60 shrink-0">
        <p>© 2026 Corporate Filings Legal-Tech Platform • Government Authorized Corporate Compliance Partner</p>
      </footer>
    </div>
  );
}
