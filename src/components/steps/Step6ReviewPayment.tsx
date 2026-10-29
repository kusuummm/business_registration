'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  QrCode, 
  Building, 
  Smartphone, 
  FileCheck, 
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { 
  CustomerAuth, 
  CompanyDetails, 
  DirectorKYC, 
  PricingBreakdown, 
  RegistrationOrder 
} from '@/types';
import { STATE_STAMP_DUTY, ENTITY_TYPES } from '@/data/pricingData';

interface Step6Props {
  auth: CustomerAuth;
  company: CompanyDetails;
  directors: DirectorKYC[];
  pricing: PricingBreakdown;
  onPaymentSuccess: (order: RegistrationOrder) => void;
  onBack: () => void;
}

export default function Step6ReviewPayment({
  auth,
  company,
  directors,
  pricing,
  onPaymentSuccess,
  onBack
}: Step6Props) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking' | 'card'>('upi');
  const [upiId, setUpiId] = useState('founder@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Discount & Coupon Engine
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [couponError, setCouponError] = useState('');

  const entityObj = ENTITY_TYPES.find((e) => e.id === company.entityType) || ENTITY_TYPES[0];
  const stateObj = STATE_STAMP_DUTY[company.stateCode] || STATE_STAMP_DUTY['MH'];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'STARTUP500') {
      setDiscountAmount(500);
      setCouponApplied('STARTUP500 (₹500 Instant Discount)');
    } else if (code === 'FOUNDER10' || code === 'BHARAT10') {
      const disc = Math.round(pricing.baseFee * 0.1);
      setDiscountAmount(disc);
      setCouponApplied(`${code} (10% Off Platform Fee)`);
    } else {
      setCouponError('Invalid coupon. Try STARTUP500 or BHARAT10');
    }
  };

  const finalTotal = Math.max(0, pricing.totalAmount - discountAmount);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowCheckoutModal(false);

      const randomOrderId = `BF-2026-MCA-${Math.floor(1000 + Math.random() * 9000)}`;
      const randomTxnId = `pay_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`;

      const order: RegistrationOrder = {
        orderId: randomOrderId,
        auth,
        company,
        directors,
        pricing: {
          ...pricing,
          totalAmount: finalTotal
        },
        paymentStatus: 'success',
        paymentMethod: paymentMethod.toUpperCase(),
        paymentTransactionId: randomTxnId,
        createdAt: new Date().toISOString(),
        assignedCs: {
          name: 'CS Priya Sharma',
          membershipNumber: 'FCS #11849',
          email: 'priya.sharma@bharatfilings.in',
          phone: '+91 98200 12849'
        }
      };

      onPaymentSuccess(order);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Final Statutory Dossier Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Review Application Dossier & Complete Payment
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Carefully inspect the verified incorporation details before your order is assigned to our Corporate Secretarial (CS) filing desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Dossier Summary */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dossier Card 1: Corporate Entity & Names */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Entity & SPICe+ Name Reservations</span>
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                {entityObj.name}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">1st Preference Name:</span>
                <span className="font-mono font-bold text-slate-900">{company.primaryName}</span>
              </div>
              {company.secondaryName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">2nd Preference (Backup):</span>
                  <span className="font-mono font-semibold text-slate-700">{company.secondaryName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">State of Incorporation:</span>
                <span className="font-semibold text-slate-900">{stateObj.name} (Stamp Duty: ₹{stateObj.stampDuty})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Authorized Capital:</span>
                <span className="font-semibold text-slate-900">₹{company.authorizedCapital.toLocaleString('en-IN')} (ROC Fee: ₹0)</span>
              </div>
            </div>
          </div>

          {/* Dossier Card 2: Directors List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Directors & Promoters ({directors.length})</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" /> UIDAI Masked
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {directors.map((dir, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{dir.fullName}</p>
                    <p className="text-slate-500 font-mono text-[11px]">
                      PAN: <span className="font-bold text-slate-700">{dir.panNumber}</span> • Aadhaar: <span className="text-slate-700">XXXX-XXXX-{dir.aadhaarNumber.slice(-4)}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {dir.hasExistingDin ? `DIN: ${dir.dinNumber}` : 'Fresh DIN (SPICe+)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dossier Card 3: Registered Office */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Registered Office & Utility Compliance</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                MCA Rule 25 Compliant
              </span>
            </div>

            <div className="text-xs space-y-2">
              <p className="text-slate-800 font-semibold">{company.officeAddress.line1}</p>
              <p className="text-slate-600">
                {company.officeAddress.city}, {stateObj.name} - {company.officeAddress.pincode}
              </p>
              <div className="pt-2 flex items-center justify-between text-slate-500 border-t border-slate-100">
                <span>Utility Proof Attached:</span>
                <span className="font-mono text-slate-800">{company.officeAddress.utilityBillDocName}</span>
              </div>
            </div>
          </div>

          {/* Navigation Back */}
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Modify Any Previous Information</span>
          </button>
        </div>

        {/* Right Column: Checkout & Itemized Billing */}
        <div className="lg:col-span-5 sticky top-36 space-y-5">
          <div className="bg-[#0B1528] text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  Payment Summary
                </span>
                <h3 className="text-lg font-extrabold text-white">Direct Treasury & CS Fee</h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>Base Platform & Drafting Fee:</span>
                <span className="font-semibold text-white">₹{pricing.baseFee.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Class-3 DSC Cryptographic Tokens:</span>
                <span className="font-semibold text-white">₹{pricing.dscFee.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>GST (18% on Services):</span>
                <span className="font-semibold text-slate-200">₹{pricing.gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300 border-t border-slate-800 pt-3">
                <div>
                  <span>Sovereign State Stamp Duty:</span>
                  <p className="text-[10px] text-emerald-400">Statutory Treasury Fee (No GST)</p>
                </div>
                <span className="font-semibold text-emerald-400">₹{pricing.stampDuty.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <div>
                  <span>MCA ROC Govt Fee:</span>
                  <p className="text-[10px] text-emerald-400">Statutory 100% Waiver</p>
                </div>
                <span className="font-semibold text-emerald-400">₹ 0</span>
              </div>
            </div>

            {/* Promo Code / Coupon Section */}
            <div className="border-t border-slate-800 pt-3">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon (e.g. STARTUP500)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white placeholder:text-slate-500 uppercase outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {couponApplied && (
                <p className="text-[11px] text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {couponApplied}
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-red-400 font-semibold mt-1.5">
                  {couponError}
                </p>
              )}
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-emerald-400 pt-2">
                <span>Promotional Voucher Discount:</span>
                <span className="font-bold font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {/* Total */}
            <div className="mt-6 pt-4 border-t-2 border-slate-700/80 flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Total Amount Due:</span>
                <p className="text-[10px] text-slate-400">Includes all Govt Taxes & Fees</p>
              </div>
              <span className="text-3xl font-black text-white tracking-tight">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Trigger Checkout Modal */}
            <button
              type="button"
              onClick={() => setShowCheckoutModal(true)}
              className="mt-6 w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Proceed to Razorpay Checkout (₹{finalTotal.toLocaleString('en-IN')})</span>
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Instant Tax Invoice & Dedicated CS Allotment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Razorpay Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#0B1528] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold">
                  BF
                </div>
                <div>
                  <h4 className="font-bold text-sm">BharatFilings Secure Checkout</h4>
                  <p className="text-[11px] text-slate-400">Order Amount: ₹{finalTotal.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-3 px-4 text-center border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'upi'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent hover:bg-slate-100'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex-1 py-3 px-4 text-center border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'netbanking'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent hover:bg-slate-100'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 px-4 text-center border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cards</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {paymentMethod === 'upi' && (
                <div className="text-center space-y-4">
                  {/* Dynamic QR Mock */}
                  <div className="w-44 h-44 mx-auto p-3 bg-white border-2 border-slate-900 rounded-2xl flex flex-col items-center justify-center shadow-md">
                    <QrCode className="w-32 h-32 text-slate-900" />
                    <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">
                      Scan with any UPI App
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3 text-xs font-semibold text-slate-600">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg">Google Pay</span>
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg">PhonePe</span>
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg">Paytm</span>
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg">BHIM</span>
                  </div>

                  <div className="pt-2 text-left">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Or Enter UPI VPA ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">Select your corporate or retail bank:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Bank of Baroda'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                          selectedBank === bank
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Expiry MM/YY</label>
                      <input
                        type="text"
                        placeholder="08/28"
                        className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="•••"
                        className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Simulation Action */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSimulatePayment}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Simulating Bank Approval...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Simulate Successful Payment (₹{finalTotal.toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Razorpay Secure Gateway • Instant Encrypted Settlement
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
