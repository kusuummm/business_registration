'use client';

import React, { useState, useMemo } from 'react';
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
  Check,
  FileText,
  Award
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'customer' | 'admin' | 'partner'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Smooth smart role detection based on identifier input
  const detectedRole = useMemo(() => {
    const clean = identifier.trim().toLowerCase();
    if (!clean) return selectedTab;

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

    return selectedTab;
  }, [identifier, selectedTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId) {
      setErrorMsg('Please enter your registered mobile number, email, or admin ID.');
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
          mode: detectedRole
        })
      });

      const json = await res.json();

      if (!json.success) {
        setErrorMsg(json.error || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
        return;
      }

      if (json.role === 'admin') {
        sessionStorage.setItem('bharatfilings_admin_auth', 'true');
        localStorage.setItem('bharatfilings_admin_auth', 'true');
        setSuccessMsg('Administrator verified. Redirecting to Master Admin Console...');
        setTimeout(() => {
          router.push('/admin');
        }, 400);
      } else if (json.role === 'partner') {
        sessionStorage.setItem('bharatfilings_partner_auth', 'true');
        localStorage.setItem('bharatfilings_partner_auth', 'true');
        setSuccessMsg('Partner verified. Redirecting to CA/CS Workbench...');
        setTimeout(() => {
          router.push('/partner');
        }, 400);
      } else {
        localStorage.setItem('bharatfilings_customer_user', JSON.stringify(json.user));
        localStorage.setItem('bharatfilings_customer_auth', 'true');
        sessionStorage.setItem('bharatfilings_customer_auth', 'true');
        window.dispatchEvent(new CustomEvent('bf_customer_user_updated'));
        setSuccessMsg('Welcome back! Redirecting to Client Compliance Portal...');
        setTimeout(() => {
          router.push('/customer');
        }, 400);
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Network error connecting to login server.');
      setIsLoading(false);
    }
  };

  // 1-Click Demo Pre-Fill Handlers
  const handleFillCustomer = () => {
    setSelectedTab('customer');
    setIdentifier('9876543210');
    setPassword('client123');
    setErrorMsg('');
  };

  const handleFillAdmin = () => {
    setSelectedTab('admin');
    setIdentifier('admin@bharatfilings.com');
    setPassword('Admin@2026');
    setErrorMsg('');
  };

  const handleFillPartner = () => {
    setSelectedTab('partner');
    setIdentifier('partner.ca@bharatfilings.in');
    setPassword('partner123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans relative overflow-hidden">
      {/* Subtle Warm & Sapphire Ambient Highlights */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Clean Top Navigation Bar */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center space-x-2.5 cursor-pointer group">
          <div className="px-3 py-1 rounded-lg border border-slate-300 bg-white text-slate-800 flex items-center space-x-2 group-hover:border-blue-500 transition shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-xs" />
            <span className="text-xs sm:text-sm font-black tracking-wide text-slate-900">
              Logo
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline border-l border-slate-200 pl-2.5">
            BharatFilings Unified Access
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <a
            href="tel:18008892244"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition hidden sm:flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>1800-889-2244</span>
          </a>
          <span className="text-slate-200 hidden sm:inline">|</span>
          <Link
            href="/"
            className="text-xs font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-1 cursor-pointer"
          >
            <span>Back to Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Login Experience Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative z-10">
        <div className="w-full max-w-5xl rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-900/10 bg-white overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Rich Showcase & Trust Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1528] via-[#101F3C] to-[#0A1324] p-8 sm:p-10 text-white flex-col justify-between relative overflow-hidden hidden md:flex">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Brand & Badge */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>MCA V3 & Ministry of Corporate Affairs Direct Desk</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                India&apos;s Modern Legal & Corporate Filing Suite
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Fast, paperless company incorporation, statutory registers, annual ROC compliance, and direct CS officer advisory in one place.
              </p>
            </div>

            {/* Feature Highlights Cards */}
            <div className="relative z-10 my-8 space-y-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">SPICe+ Live Incorporation Tracking</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Real-time DIN, CIN, Corporate PAN & TAN issuance updates.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Class-3 Digital Cryptographic Vault</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Secure client-side storage for DSC tokens and verified MOA/AOA.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Fellow CS Officer Allocation</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Dedicated Company Secretary overseeing every statutory step.</p>
                </div>
              </div>
            </div>

            {/* Bottom Social Proof & Trust Badges */}
            <div className="relative z-10 pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-white">4.9 / 5.0</span>
                <span className="text-[11px] text-slate-400">by 12,000+ Founders & Firms</span>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-2">
                <span>• 256-Bit SSL Protection</span>
                <span>• DPDP Act 2023 Compliant</span>
                <span>• Zero Hidden Markups</span>
              </p>
            </div>
          </div>

          {/* Right Column: Clean, Attractive Interactive Form */}
          <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center bg-white">
            
            {/* Header Content */}
            <div className="space-y-1.5 mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold">
                <User className="w-3 h-3 text-blue-600" />
                <span>Unified Sign-In Portal</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sign in with your registered phone, email, or credentials to access your dashboard.
              </p>
            </div>

            {/* Apple/Stripe-Style Refined Segmented Role Selector */}
            <div className="mb-6 p-1 bg-slate-100 rounded-xl flex items-center gap-1 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setSelectedTab('customer')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  detectedRole === 'customer'
                    ? 'bg-white text-blue-700 shadow-sm font-extrabold'
                    : 'hover:text-slate-900 text-slate-500'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Founder / Client</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTab('admin')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  detectedRole === 'admin'
                    ? 'bg-white text-amber-700 shadow-sm font-extrabold'
                    : 'hover:text-slate-900 text-slate-500'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTab('partner')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  detectedRole === 'partner'
                    ? 'bg-white text-purple-700 shadow-sm font-extrabold'
                    : 'hover:text-slate-900 text-slate-500'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>CA / CS Desk</span>
              </button>
            </div>

            {/* Alert Messages */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 mb-5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 mb-5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">{successMsg}</span>
              </div>
            )}

            {/* Sign-In Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Input 1: Identifier */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>
                    {detectedRole === 'admin' 
                      ? 'Administrator Email / ID' 
                      : detectedRole === 'partner'
                      ? 'Partner Email / Desk ID'
                      : 'Registered Mobile Number or Email'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {detectedRole === 'customer' && '10-digit mobile or email'}
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    {detectedRole === 'admin' ? (
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                    ) : detectedRole === 'partner' ? (
                      <Building2 className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Mail className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder={
                      detectedRole === 'admin'
                        ? 'e.g. admin@bharatfilings.com'
                        : detectedRole === 'partner'
                        ? 'e.g. partner.ca@bharatfilings.in'
                        : 'e.g. 9876543210 or client@example.com'
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 font-semibold text-xs placeholder:text-slate-400 outline-none hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition duration-150"
                  />
                </div>
              </div>

              {/* Input 2: Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">
                    {detectedRole === 'admin' ? 'Security Password' : 'Password or PIN'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (detectedRole === 'admin') {
                        router.push('/admin');
                      } else {
                        setErrorMsg('If you forgot your password, contact your dedicated compliance officer or request an admin credential update.');
                      }
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold transition cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your confidential password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 font-semibold text-xs placeholder:text-slate-400 outline-none hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition duration-150"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Encryption Pill */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-xs">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit Encrypted
                </span>
              </div>

              {/* Dynamic Vibrant Gradient CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 text-white rounded-xl font-black text-xs shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50 ${
                  detectedRole === 'admin'
                    ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-800 shadow-amber-500/25'
                    : detectedRole === 'partner'
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 shadow-purple-500/25'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-500/25'
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
                        : 'Continue to Client Compliance Portal'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Elegant 1-Click Demo Pre-Fill Drawer */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                <span className="uppercase tracking-wider">Fast Test Credentials</span>
                <span className="text-slate-400 font-normal">Click to prefill</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleFillCustomer}
                  className="py-2 px-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] font-bold text-slate-700 hover:text-blue-700 transition cursor-pointer text-center"
                >
                  <span className="block text-[10px] text-blue-600 font-extrabold uppercase">Client</span>
                  <span className="text-[11px] font-mono text-slate-800">9876543210</span>
                </button>
                <button
                  type="button"
                  onClick={handleFillAdmin}
                  className="py-2 px-2.5 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-[11px] font-bold text-slate-700 hover:text-amber-800 transition cursor-pointer text-center"
                >
                  <span className="block text-[10px] text-amber-600 font-extrabold uppercase">Admin</span>
                  <span className="text-[11px] font-mono text-slate-800">admin@...</span>
                </button>
                <button
                  type="button"
                  onClick={handleFillPartner}
                  className="py-2 px-2.5 rounded-lg bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-[11px] font-bold text-slate-700 hover:text-purple-700 transition cursor-pointer text-center"
                >
                  <span className="block text-[10px] text-purple-600 font-extrabold uppercase">Partner</span>
                  <span className="text-[11px] font-mono text-slate-800">partner.ca</span>
                </button>
              </div>
            </div>

            {/* Bottom Registration Link */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                New founder or registering a new company?{' '}
                <Link href="/pricing" className="text-blue-600 font-bold hover:underline">
                  Browse Packages & Start Filing
                </Link>
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Subtle Institutional Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/60">
        <p>© 2026 BharatFilings Legal-Tech Platform • Government Authorized Corporate Compliance Partner</p>
      </footer>
    </div>
  );
}