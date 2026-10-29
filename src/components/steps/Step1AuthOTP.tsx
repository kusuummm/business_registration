'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Shield, Smartphone, Mail, User, CheckCircle2, ArrowRight, MessageSquare, RefreshCw } from 'lucide-react';
import { CustomerAuth } from '@/types';

interface Step1Props {
  auth: CustomerAuth;
  onSuccess: (auth: CustomerAuth) => void;
}

export default function Step1AuthOTP({ auth, onSuccess }: Step1Props) {
  const [mobile, setMobile] = useState(auth.mobile || '');
  const [email, setEmail] = useState(auth.email || '');
  const [name, setName] = useState(auth.name || '');
  
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [mockGeneratedOtp, setMockGeneratedOtp] = useState('8492');
  const [timer, setTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid business or personal email address');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your full legal name');
      return;
    }

    // Generate random 4 digit OTP for realistic demo
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setMockGeneratedOtp(newOtp);
    setIsOtpSent(true);
    setTimer(30);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto advance
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    const digits = mockGeneratedOtp.split('');
    setOtpCode(digits);
    inputRefs[3].current?.focus();
  };

  const handleVerifyOtp = () => {
    const entered = otpCode.join('');
    if (entered.length < 4) {
      setError('Please enter the full 4-digit OTP code');
      return;
    }

    if (entered !== mockGeneratedOtp && entered !== '1234') {
      setError(`Invalid OTP code entered. (Demo OTP is ${mockGeneratedOtp})`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess({
        mobile,
        email,
        name,
        isVerified: true
      });
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Header card */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-800 mb-3 border border-slate-200">
          <Shield className="w-6 h-6 text-slate-700" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Initiate Company Registration
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
          Start your SPICe+ MCA filing in under 3 minutes. Verify your mobile number for secure instant status alerts and government filing tokens.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        {!isOtpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name (As on PAN Card) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100 outline-none text-sm font-medium transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Indian Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative flex">
                <div className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-600 text-sm font-semibold">
                  +91
                </div>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="98765 43210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-r-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100 outline-none text-sm font-mono font-medium transition"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                We will send official MCA status notifications and DSC signing alerts via WhatsApp & SMS.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="rahul@aurasoft.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100 outline-none text-sm font-medium transition"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Draft MOA/AOA, CIN Certificate and Tax Invoices will be emailed here.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#0B1528] hover:bg-[#1E293B] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <span>Continue & Get 4-Digit OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Mock WhatsApp Notification Banner */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-4 flex items-start gap-3 shadow-xs">
              <div className="p-2 bg-emerald-700 text-white rounded-lg shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                    WhatsApp Mock Simulator
                  </p>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-semibold">
                    Instant Demo
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  Your BharatFilings OTP is <span className="font-mono font-bold text-emerald-950 text-sm tracking-wider">{mockGeneratedOtp}</span>. Valid for 10 minutes.
                </p>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1 cursor-pointer"
                >
                  Click to Auto-fill OTP ({mockGeneratedOtp})
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold text-slate-800">
                Enter the 4-digit code sent to
              </p>
              <p className="text-sm font-mono text-slate-900 font-bold mt-0.5">
                +91 {mobile}
              </p>
              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="text-xs text-slate-500 hover:text-slate-800 underline mt-1 cursor-pointer"
              >
                Change mobile number
              </button>
            </div>

            {/* OTP Boxes */}
            <div className="flex justify-center gap-3">
              {otpCode.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold font-mono rounded-xl border-2 border-slate-300 focus:border-[#0B1528] focus:ring-4 focus:ring-slate-100 outline-none transition bg-white text-slate-900"
                />
              ))}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                disabled={timer > 0}
                onClick={handleSendOtp}
                className={`text-xs font-semibold flex items-center gap-1.5 ${
                  timer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:underline cursor-pointer'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>
                  {timer > 0 ? `Resend code in ${timer}s` : 'Resend OTP via SMS / WhatsApp'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0B1528] hover:bg-[#1E293B] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Proceed to Entity Setup</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security note */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <Shield className="w-4 h-4 text-emerald-600" />
        <span>End-to-End Encrypted. 256-Bit TLS Security under DPDP Act 2023.</span>
      </div>
    </div>
  );
}
