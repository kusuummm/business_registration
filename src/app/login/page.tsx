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
  User, 
  KeyRound, 
  Building2, 
  Sparkles, 
  Phone, 
  Mail,
  ChevronRight,
  Eye,
  EyeOff,
  Star,
  FileText,
  Award
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
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-[#F8FAFC] text-slate-800 flex flex-col font-sans select-none relative">
      {/* Absolute CSS guarantee against document scrolling */}
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          overflow: hidden !important;
          height: 100% !important;
          max-height: 100vh !important;
        }
      `}} />

      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-6 left-10 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Slim Top Navigation Bar (Height: 40px) */}
      <header className="h-10 px-4 sm:px-6 md:px-8 border-b border-slate-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between relative z-10 shrink-0">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer group">
          <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            Corporate<span className="text-blue-600">Filings</span>
          </span>
          <span className="text-[10px] font-bold text-slate-500 hidden sm:inline border-l border-slate-200 pl-2">
            Unified Access
          </span>
        </Link>

        <div className="flex items-center space-x-3">
          <a
            href="tel:18008892244"
            className="text-[11px] font-semibold text-slate-600 hover:text-blue-600 transition hidden sm:flex items-center gap-1"
          >
            <Phone className="w-3 h-3 text-blue-600" />
            <span>1800-889-2244</span>
          </a>
          <span className="text-slate-200 hidden sm:inline">|</span>
          <Link
            href="/"
            className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-0.5 cursor-pointer"
          >
            <span>Back to Home</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main Container: Exact-fit, perfectly centered in remaining viewport */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-3 md:p-4 min-h-0 overflow-hidden relative z-10">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-[940px] rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/5 bg-white overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-full">
          
          {/* Left Column: Rich Showcase & Trust Panel */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#0B1528] via-[#101F3C] to-[#0A1324] p-4 lg:p-6 text-white flex-col justify-between relative overflow-hidden hidden md:flex">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Brand & Badge Header */}
            <div className="relative z-10 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[10px] font-bold">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>MCA V3 & Direct Corporate Affairs Desk</span>
              </div>

              <h2 className="text-lg lg:text-xl font-black text-white tracking-tight leading-snug">
                India&apos;s Modern Legal & Corporate Filing Suite
              </h2>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Fast company incorporation, statutory registers, and direct CS officer advisory in one place.
              </p>
            </div>

            {/* Feature Highlights Cards */}
            <div className="relative z-10 my-2.5 lg:my-3 space-y-2">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-3 h-3 text-blue-300" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white">SPICe+ Incorporation Tracking</h4>
                  <p className="text-[10px] text-slate-400">Real-time DIN, CIN, Corporate PAN & TAN issuance.</p>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white">Class-3 Cryptographic Vault</h4>
                  <p className="text-[10px] text-slate-400">Secure storage for client DSC tokens and MOA/AOA.</p>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-3 h-3 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white">Fellow CS Officer Allocation</h4>
                  <p className="text-[10px] text-slate-400">Dedicated Company Secretary overseeing statutory steps.</p>
                </div>
              </div>
            </div>

            {/* Bottom Social Proof & Trust Badges */}
            <div className="relative z-10 pt-2 border-t border-white/10 space-y-1">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] font-extrabold text-white">4.9 / 5.0</span>
                <span className="text-[10px] text-slate-400">by 12,000+ Founders & Firms</span>
              </div>
              <p className="text-[10px] text-slate-400">
                • 256-Bit SSL • DPDP Act Compliant • Zero Hidden Markups
              </p>
            </div>
          </div>

          {/* Right Column: Single Unified Interactive Form (No Separate Columns/Tabs) */}
          <div className="md:col-span-7 p-4 sm:p-5 lg:p-6 flex flex-col justify-center bg-white overflow-y-auto no-scrollbar">
            
            {/* Header Content */}
            <div className="space-y-0.5 mb-2.5">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold">
                <User className="w-3 h-3 text-blue-600" />
                <span>Unified Sign-In Portal</span>
              </div>

              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-[11px] text-slate-500">
                Sign in with your registered phone, email, or credentials to access your dashboard.
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

              {/* Dynamic Vibrant Gradient CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 text-white rounded-lg font-bold text-xs shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99] disabled:opacity-50 ${
                  detectedRole === 'admin'
                    ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-800 shadow-amber-500/20'
                    : detectedRole === 'partner'
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 shadow-purple-500/20'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-500/20'
                }`}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>
                      {detectedRole === 'admin'
                        ? 'Sign In to Master Admin Console'
                        : detectedRole === 'partner'
                        ? 'Sign In to CA / CS Workbench'
                        : 'Sign In to Dashboard'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Clear Demo Login ID & Password Box for Demo Reviews */}
            <div className="mt-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-1">
                <span className="uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Demo Review Credentials
                </span>
                <span className="text-slate-400 font-normal">Click to 1-click test</span>
              </div>

              {/* Compact 3-Column Demo Credentials */}
              <div className="grid grid-cols-3 gap-1.5">
                {/* Client Demo */}
                <button
                  type="button"
                  onClick={handleFillCustomer}
                  className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                    activeDemo === 'client'
                      ? 'bg-blue-50/90 border-blue-400 ring-1 ring-blue-200'
                      : 'bg-slate-50/80 hover:bg-blue-50/60 border-slate-200/90 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center mb-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 bg-blue-100/80 px-1 py-0.2 rounded">
                      Client
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 leading-tight">
                    ID: <span className="font-mono font-bold text-slate-900">9876543210</span>
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                    Pass: <span className="font-mono font-bold text-slate-700">client123</span>
                  </div>
                </button>

                {/* Admin Demo */}
                <button
                  type="button"
                  onClick={handleFillAdmin}
                  className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                    activeDemo === 'admin'
                      ? 'bg-amber-50/90 border-amber-400 ring-1 ring-amber-200'
                      : 'bg-slate-50/80 hover:bg-amber-50/60 border-slate-200/90 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center mb-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-1 py-0.2 rounded">
                      Admin
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 leading-tight truncate" title="admin@corporatefilings.in">
                    ID: <span className="font-mono font-bold text-slate-900">admin@...</span>
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                    Pass: <span className="font-mono font-bold text-slate-700">Admin@2026</span>
                  </div>
                </button>

                {/* Partner Demo */}
                <button
                  type="button"
                  onClick={handleFillPartner}
                  className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                    activeDemo === 'partner'
                      ? 'bg-purple-50/90 border-purple-400 ring-1 ring-purple-200'
                      : 'bg-slate-50/80 hover:bg-purple-50/60 border-slate-200/90 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center mb-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/80 px-1 py-0.2 rounded">
                      Partner
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 leading-tight truncate" title="partner.ca@corporatefilings.in">
                    ID: <span className="font-mono font-bold text-slate-900">partner.ca</span>
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                    Pass: <span className="font-mono font-bold text-slate-700">partner123</span>
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
