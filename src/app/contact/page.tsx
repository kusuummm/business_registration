'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Building2,
  FileText
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    city: '',
    service: 'Private Limited Company Registration',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.mobile.length < 10) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/callbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      console.error('Callback error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          mobile: '',
          email: '',
          city: '',
          service: 'Private Limited Company Registration',
          message: ''
        });
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      <Header />

      {/* Hero Banner with Subtle Gradients */}
      <section className="bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-white border-b border-slate-200 py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Dedicated Secretarial Desk • 15-Minute Guaranteed Response</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Connect with our Secretarial & Compliance Desk
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have questions regarding company name reservation, MCA CRC filings, or state stamp duties? Our certified Company Secretaries and legal counsel are here to help.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <main className="max-w-7xl mx-auto w-full py-12 px-4 sm:px-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Helplines & Statutory Disclosures */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-black text-slate-900">
              Direct Channels of Assistance
            </h2>

            {/* Helpline 1: Phone */}
            <a
              href="tel:18008892244"
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 flex items-start gap-4 block shadow-xs group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/25">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Toll-Free Hotline
                </span>
                <h4 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  1800-889-2244
                </h4>
                <p className="text-xs text-slate-500">
                  Mon – Sat, 9:00 AM – 8:00 PM IST. Direct connect with Fellow CS desk.
                </p>
              </div>
            </a>

            {/* Helpline 2: WhatsApp */}
            <a
              href="https://wa.me/919820012849?text=Hi%2C%20I%20need%20assistance%20with%20company%20registration"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 flex items-start gap-4 block shadow-xs group"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/25">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Instant WhatsApp Desk
                </span>
                <h4 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  +91 98200 12849
                </h4>
                <p className="text-xs text-slate-500">
                  Average response under 5 minutes for document verification and queries.
                </p>
              </div>
            </a>

            {/* Helpline 3: Email */}
            <a
              href="mailto:support@bharatfilings.in"
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 flex items-start gap-4 block shadow-xs group"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/25">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Priority Secretarial Email
                </span>
                <h4 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  support@bharatfilings.in
                </h4>
                <p className="text-xs text-slate-500">
                  Send draft MOA/AOA or complex ROC matters for expert legal review.
                </p>
              </div>
            </a>

            {/* Statutory Grievance Redressal Card (DPDP Act 2023 Mandatory Disclosure) */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2.5 shadow-md">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Grievance Redressal Officer</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Appointed in compliance with the Digital Personal Data Protection Act, 2023 & Information Technology (Intermediary Guidelines) Rules, 2021:
              </p>
              <div className="text-xs text-slate-300 space-y-0.5 pt-1 border-t border-slate-800">
                <p><strong>Name:</strong> CS Vikramaditya Sen (FCS No. 9812)</p>
                <p><strong>Designation:</strong> Head of Governance & Grievance Redressal</p>
                <p><strong>Direct Email:</strong> <span className="text-blue-300">grievance@bharatfilings.in</span></p>
                <p><strong>SLA for Grievance Acknowledgment:</strong> 24 Hours</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation & Callback Form */}
          <div className="lg:col-span-7">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 relative overflow-hidden">
              {/* Top Colorful Accent Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400" />

              <div className="border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100/70 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    Secretarial Consultation
                  </span>
                  <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> 15-Minute Guaranteed Callback
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  Request a Free Callback from a Company Secretary
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Discuss corporate structure, MCA name feasibility, and sovereign stamp duties before filing.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-base text-slate-900">Consultation Request Received!</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Our secretarial officer will connect with you shortly at <strong className="font-mono text-slate-900">+91 {formData.mobile}</strong>. A confirmation SMS has also been dispatched.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Full Legal Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-600 font-bold text-xs">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          placeholder="98765 43210"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                          className="w-full py-2.5 px-3 rounded-r-xl border border-slate-300 font-mono font-bold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="rahul@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-700 mb-1">City / State</label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, MH"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Statutory Service Needed</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white outline-none cursor-pointer focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition"
                    >
                      <option value="Private Limited Company Registration">Private Limited Company Registration</option>
                      <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                      <option value="One Person Company (OPC)">One Person Company (OPC)</option>
                      <option value="Section 8 Non-Profit Company">Section 8 Non-Profit Company</option>
                      <option value="GST Registration & Filing">GST Registration & Filing</option>
                      <option value="Trademark (TM) Application">Trademark (TM) Application</option>
                      <option value="FSSAI Food Business License">FSSAI Food Business License</option>
                      <option value="Annual ROC Filing & Compliance">Annual ROC Filing & Compliance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">Specific Query / Proposed Company Name</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. We are building an AI software company and want to check if the name 'CogniCore Technologies Pvt Ltd' is eligible..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white rounded-xl font-black text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Scheduling Secretarial Desk...' : 'Book Free Secretarial Consultation'}
                  </button>

                  <p className="text-[10px] text-center text-slate-500 pt-1">
                    🔒 No spam. Data is strictly processed under the Digital Personal Data Protection Act 2023.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
