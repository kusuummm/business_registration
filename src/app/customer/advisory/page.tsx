'use client';

import React, { useState } from 'react';
import CustomerNavbar from '@/components/CustomerNavbar';
import CustomerSidebar from '@/components/CustomerSidebar';
import { 
  PhoneCall, 
  Calendar, 
  Video, 
  Award, 
  Check, 
  CheckCircle2 
} from 'lucide-react';

export default function CustomerAdvisoryPage() {
  const [advisoryBooking, setAdvisoryBooking] = useState({
    counsel: 'CS Priya Sharma (FCS #11849)',
    topic: 'ESOP Structuring & Shareholder Agreement',
    date: '2026-11-02',
    time: '03:30 PM - 04:15 PM',
    mode: 'Google Meet Video Call'
  });
  const [advisorySuccess, setAdvisorySuccess] = useState(false);
  const [statusNotice, setStatusNotice] = useState('');

  const handleBookAdvisory = (e: React.FormEvent) => {
    e.preventDefault();
    setAdvisorySuccess(true);
    setTimeout(() => {
      setAdvisorySuccess(false);
      setStatusNotice(`Advisory session booked with ${advisoryBooking.counsel} for ${advisoryBooking.date} at ${advisoryBooking.time}! Calendar invite sent.`);
      setTimeout(() => setStatusNotice(''), 5500);
    }, 1200);
  };

  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  return (
    <div style={segoeStyle} className="h-screen max-h-screen overflow-hidden bg-slate-100 flex flex-col text-slate-900">
      <CustomerNavbar currentTitle="Book CA/CS Advisory" />

      {statusNotice && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusNotice}</span>
        </div>
      )}

      <div className="flex-1 flex flex-row min-w-0 overflow-hidden">
        <CustomerSidebar activeItem="advisory" />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overscroll-contain custom-scrollbar">
          <main className="max-w-6xl mx-auto w-full py-6 px-4 sm:px-6 space-y-6">
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">1-on-1 Legal & Secretarial Advisory</h1>
              <p className="text-xs text-slate-500">Book dedicated advisory sessions with senior practicing Company Secretaries and Chartered Accountants.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Booking Form */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                  <span>Schedule Advisory Consultation</span>
                </h3>

                {advisorySuccess ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="text-sm font-bold text-emerald-950">Consultation Confirmed!</h4>
                    <p className="text-xs text-emerald-800">
                      Your session with <strong>{advisoryBooking.counsel}</strong> has been scheduled for <strong>{advisoryBooking.date}</strong> at <strong>{advisoryBooking.time}</strong>.
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">Google Meet link sent to your registered email.</p>
                  </div>
                ) : (
                  <form onSubmit={handleBookAdvisory} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Select Counsel Specialization</label>
                      <select
                        value={advisoryBooking.counsel}
                        onChange={(e) => setAdvisoryBooking({ ...advisoryBooking, counsel: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-semibold focus:outline-none focus:border-blue-500"
                      >
                        <option value="CS Priya Sharma (FCS #11849)">CS Priya Sharma (FCS #11849) • Corporate Secretarial & ROC Filing</option>
                        <option value="CA Manish Agrawal (FCA #08291)">CA Manish Agrawal (FCA #08291) • Startup Tax, GST & ESOPs</option>
                        <option value="CS Rakesh Patel (ACS #29401)">CS Rakesh Patel (ACS #29401) • Cross-Border FDI & FEMA Compliance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Advisory Topic</label>
                      <select
                        value={advisoryBooking.topic}
                        onChange={(e) => setAdvisoryBooking({ ...advisoryBooking, topic: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-semibold focus:outline-none focus:border-blue-500"
                      >
                        <option value="ESOP Structuring & Shareholder Agreement">ESOP Structuring & Shareholder Agreement (SHA)</option>
                        <option value="Trademark, Copyright & IP Brand Protection">Trademark, Copyright & IP Brand Protection</option>
                        <option value="Angel Tax Exemption & DPIIT Startup India">Angel Tax Exemption & DPIIT Startup India Certification</option>
                        <option value="Annual ROC Compliance & Corporate Governance">Annual ROC Compliance & Corporate Governance</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                        <input
                          type="date"
                          value={advisoryBooking.date}
                          onChange={(e) => setAdvisoryBooking({ ...advisoryBooking, date: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-semibold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
                        <select
                          value={advisoryBooking.time}
                          onChange={(e) => setAdvisoryBooking({ ...advisoryBooking, time: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-semibold focus:outline-none focus:border-blue-500"
                        >
                          <option value="11:00 AM - 11:45 AM">11:00 AM - 11:45 AM</option>
                          <option value="03:30 PM - 04:15 PM">03:30 PM - 04:15 PM</option>
                          <option value="05:00 PM - 05:45 PM">05:00 PM - 05:45 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Meeting Mode</label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                          <input
                            type="radio"
                            name="mode"
                            checked={advisoryBooking.mode === 'Google Meet Video Call'}
                            onChange={() => setAdvisoryBooking({ ...advisoryBooking, mode: 'Google Meet Video Call' })}
                          />
                          <Video className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold text-slate-800">Google Meet</span>
                        </label>

                        <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                          <input
                            type="radio"
                            name="mode"
                            checked={advisoryBooking.mode === 'WhatsApp Voice / Call'}
                            onChange={() => setAdvisoryBooking({ ...advisoryBooking, mode: 'WhatsApp Voice / Call' })}
                          />
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold text-slate-800">WhatsApp Call</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Confirm & Schedule Advisory Consultation</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Right Column: Advisory Benefits Card */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Award className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Complimentary Founder Advisory</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Every incorporation order includes <strong>2 complimentary advisory sessions</strong> with a certified Company Secretary or CA for shareholding structuring and statutory governance.
                  </p>
                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Confidential 1-on-1 Consultation</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Personalized Statutory Checklist</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Direct Follow-up on WhatsApp</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
