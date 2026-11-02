'use client';

import React, { useState } from 'react';
import CustomerSidebar from '@/components/CustomerSidebar';
import CustomerNavbar from '@/components/CustomerNavbar';
import { 
  Landmark, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  Zap,
  Globe,
  FileCheck2,
  Copy,
  Check
} from 'lucide-react';

interface PartnerBank {
  id: string;
  name: string;
  badge: string;
  benefits: string[];
  features: string[];
  avgTime: string;
  recommendedFor: string;
}

const PARTNER_BANKS: PartnerBank[] = [
  {
    id: 'icici',
    name: 'ICICI Bank Smart Business Current Account',
    badge: 'Official API Partner',
    benefits: [
      'Zero Minimum Balance commitment for first 12 months for registered startups',
      'Instant Corporate Platinum Debit Card with ₹2.5L daily ATM & POS limit',
      'Connected Banking APIs directly integrated with GST and ERP software',
      'Free corporate cheque book (100 leaves) dispatched to registered office'
    ],
    features: ['API Banking', 'Forex Inward Support', 'Free NEFT/RTGS', 'POS & QR Machine'],
    avgTime: '24-48 Hours',
    recommendedFor: 'Best for Tech Startups, SaaS & E-Commerce'
  },
  {
    id: 'axis',
    name: 'Axis Bank Neo for Business Current Account',
    badge: 'Popular Choice',
    benefits: [
      'Digital video KYC account opening without physical branch visits',
      'Unlimited digital cash deposits across 4,500+ pan-India branches',
      'Complimentary access to business payroll tools & vendor payments',
      'Cashback on statutory tax payments and utility bill remittances'
    ],
    features: ['Instant Digital Onboarding', 'Zero MAB Slabs', 'Multi-User NetBanking'],
    avgTime: '24 Hours',
    recommendedFor: 'Best for Manufacturing, Retail & Local Trade'
  },
  {
    id: 'kotak',
    name: 'Kotak Mahindra Bank Startup Active Account',
    badge: 'Fast-Track Desk',
    benefits: [
      'Preferential forex trade rates for IT/ITeS exporters and service exporters',
      'Dedicated Relationship Manager assigned to corporate accounts',
      'Zero-charge demand drafts and pay orders up to ₹25 Lakhs per month',
      'Direct integration with payment gateways for auto-reconciliation'
    ],
    features: ['Dedicated RM', 'Trade & Forex Desk', 'Custom Virtual Accounts'],
    avgTime: '48 Hours',
    recommendedFor: 'Best for Professional Services & Agencies'
  },
  {
    id: 'dbs',
    name: 'DBS Bank India IDEAL Digital Account',
    badge: 'Global Fintech Desk',
    benefits: [
      'Asia’s Safest Bank for 14 consecutive years with Singapore grade security',
      'Effortless international cross-border payments with real-time tracking',
      'Zero maintenance charges on maintainable foreign inward remittances',
      'Integrated corporate treasury and multi-currency foreign exchange'
    ],
    features: ['Global Multi-Currency', 'SWIFT Inward Tracker', 'High Forex Limits'],
    avgTime: '48-72 Hours',
    recommendedFor: 'Best for International Exporters & Cross-Border SaaS'
  }
];

export default function CustomerBankingPage() {
  const [selectedBank, setSelectedBank] = useState('icici');
  const [appliedStatus, setAppliedStatus] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = (bankId: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setAppliedStatus((prev) => ({ ...prev, [bankId]: true }));
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col font-sans">
      <CustomerNavbar />

      <div className="flex flex-1">
        <CustomerSidebar activeItem="banking" />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-8 w-full">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-950 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Zero-Branch Visit Digital Current Account Facility</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Partner Banking & FinTech Gateway
              </h1>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Connect your newly incorporated corporate entity directly with Tier-1 Indian scheduled commercial banks. We automatically assemble and forward your verified MCA Certificate of Incorporation, MOA, AOA, and Director PAN dossiers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center shrink-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Dossier Readiness</span>
              <span className="text-emerald-400 font-black text-base flex items-center justify-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>100% KYC Complete</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">MCA COI & MOA/AOA Attached</span>
            </div>
          </div>

          {/* Stepper Process Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Digital Current Account Onboarding Pipeline
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-1">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                  <span>Select Partner Bank</span>
                </div>
                <p className="text-[11px] text-slate-400">Choose your preferred current account partner bank.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-300 font-bold">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-black">2</span>
                  <span>Auto-Pass Dossier</span>
                </div>
                <p className="text-[11px] text-slate-400">System securely forwards stamped COI and director KYC via API.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-300 font-bold">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-black">3</span>
                  <span>10-Min Video KYC</span>
                </div>
                <p className="text-[11px] text-slate-400">Bank compliance team conducts instant digital identity confirmation.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">4</span>
                  <span>Account Active</span>
                </div>
                <p className="text-[11px] text-slate-400">Receive Account Number, IFSC, NetBanking login & Debit Card.</p>
              </div>
            </div>
          </div>

          {/* Banks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARTNER_BANKS.map((bank) => {
              const isApplied = appliedStatus[bank.id];
              return (
                <div
                  key={bank.id}
                  className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-950/60 border border-blue-800/80 px-2 py-0.5 rounded">
                          {bank.badge}
                        </span>
                        <h3 className="text-base font-black text-white pt-1">
                          {bank.name}
                        </h3>
                        <span className="text-[11px] text-amber-400 font-medium block">
                          {bank.recommendedFor}
                        </span>
                      </div>

                      <div className="text-right text-[11px] text-slate-500 shrink-0">
                        <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                        <span>{bank.avgTime}</span>
                      </div>
                    </div>

                    {/* Benefits List */}
                    <ul className="space-y-2 text-xs text-slate-300">
                      {bank.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Features Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {bank.features.map((f, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-md"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-900 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      Zero Processing Fee
                    </span>

                    {isApplied ? (
                      <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Dossier Dispatched to Bank</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApply(bank.id)}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                      >
                        <span>Apply Online via API</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* FinTech Payment Gateway Section */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-950 to-slate-900 border border-purple-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 block">
                  Integrated Payment Acceptance
                </span>
                <h3 className="text-lg font-black text-white">
                  Corporate Payment Gateways (Razorpay & Cashfree)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Start collecting client payments across UPI (Google Pay, PhonePe), Cards, and NetBanking on day 1 of incorporation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://razorpay.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <span>Open Razorpay</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
