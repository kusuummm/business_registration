'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Download, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Building2, 
  Users, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Lock,
  FileCheck
} from 'lucide-react';
import { RegistrationOrder } from '@/types';
import { STATE_STAMP_DUTY, ENTITY_TYPES } from '@/data/pricingData';

interface Step7Props {
  order: RegistrationOrder;
  onReset: () => void;
}

export default function Step7OrderSuccess({ order, onReset }: Step7Props) {
  const [liveOrder, setLiveOrder] = useState<RegistrationOrder>(order);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const isApproved = Boolean(
    liveOrder.adminApproved ||
    liveOrder.docVerificationStatus === 'Approved' ||
    (liveOrder.status && liveOrder.status.toLowerCase().includes('approved'))
  );

  // Poll for admin document approval
  useEffect(() => {
    if (isApproved) {
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
      return;
    }

    const interval = setInterval(async () => {
      try {
        const orderId = order.orderId;
        if (!orderId) return;
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setLiveOrder(data.data);
          if (data.data.adminApproved || data.data.docVerificationStatus === 'Approved') {
            try {
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
            } catch (e) {}
          }
        }
      } catch (e) {
        // quiet poll fail
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [order.orderId, isApproved]);

  const handleManualCheck = async () => {
    setIsCheckingStatus(true);
    setStatusMessage('');
    try {
      const res = await fetch(`/api/orders/${order.orderId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setLiveOrder(data.data);
        if (data.data.adminApproved || data.data.docVerificationStatus === 'Approved') {
          setStatusMessage('Verified & Approved! Your registration is now officially confirmed.');
          try {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
          } catch (e) {}
        } else {
          setStatusMessage('Documents are still pending Admin review. Admin has been notified.');
        }
      }
    } catch (e) {
      setStatusMessage('Unable to sync live status right now. Please try again.');
    } finally {
      setIsCheckingStatus(false);
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  const stateObj = STATE_STAMP_DUTY[order.company.stateCode] || STATE_STAMP_DUTY['MH'];
  const entityObj = ENTITY_TYPES.find((e) => e.id === order.company.entityType) || ENTITY_TYPES[0];

  const handleDownloadInvoice = () => {
    setDownloadSuccess(true);
    const invoiceContent = `
============================================================
              STATUTORY REGISTRATION RECEIPT
============================================================
Order Reference ID:     ${order.orderId}
Transaction ID:         ${order.paymentTransactionId}
Date:                   ${new Date(order.createdAt).toLocaleString('en-IN')}
Document Verification:  ${isApproved ? 'APPROVED BY ADMIN' : 'PENDING ADMIN APPROVAL'}
Registration Status:    ${isApproved ? 'CONFIRMED & ACTIVE' : 'PENDING ADMIN VERIFICATION'}
------------------------------------------------------------
Customer Details:
Name:                   ${order.auth.name}
Mobile:                 +91 ${order.auth.mobile}
Email:                  ${order.auth.email}
------------------------------------------------------------
Company Incorporation Dossier:
Proposed Name:          ${order.company.primaryName}
Backup Name:            ${order.company.secondaryName || 'N/A'}
Entity Type:            ${entityObj.name}
Registered State:       ${stateObj.name}
Authorized Capital:     ₹${order.company.authorizedCapital.toLocaleString('en-IN')}
Directors (${order.directors.length}):
${order.directors.map((d, i) => `  ${i + 1}. ${d.fullName} (PAN: ${d.panNumber}, Aadhaar: XXXX-XXXX-${d.aadhaarNumber.slice(-4)})`).join('\n')}

Registered Office Address:
${order.company.officeAddress.line1}, ${order.company.officeAddress.city}, ${stateObj.name} - ${order.company.officeAddress.pincode}
Utility Bill:           ${order.company.officeAddress.utilityBillDocName || 'Utility_Bill.pdf'} (MCA Rule 25 Compliant)
------------------------------------------------------------
FINANCIAL BREAKDOWN:
Base Professional & Drafting Fee:  ₹${order.pricing.baseFee.toLocaleString('en-IN')}
Class-3 DSC USB Tokens:            ₹${order.pricing.dscFee.toLocaleString('en-IN')}
Taxable Services Subtotal:         ₹${order.pricing.taxableSubtotal.toLocaleString('en-IN')}
GST (18% on Taxable Services):     ₹${order.pricing.gstAmount.toLocaleString('en-IN')}
State Sovereign Stamp Duty:        ₹${order.pricing.stampDuty.toLocaleString('en-IN')} (Statutory Non-Taxable)
MCA ROC Filing Govt Fee:           ₹${order.pricing.rocFee.toLocaleString('en-IN')} (Statutory Waiver)
------------------------------------------------------------
TOTAL PAID AMOUNT:                 ₹${order.pricing.totalAmount.toLocaleString('en-IN')}
============================================================
Assigned Desk: Legal Verification & Admin Desk
Corporate Compliance & Filings Services
CIN: U74140DL2024PTC998822 | GSTIN: 07AAACB2291Q1ZP
============================================================
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Registration_Receipt_${order.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const MILESTONES = [
    {
      id: 1,
      title: 'Payment & Application Submitted',
      sla: 'Completed Just Now',
      status: 'completed',
      detail: `Statutory payment of ₹${order.pricing.totalAmount.toLocaleString('en-IN')} verified. Dossier generated.`
    },
    {
      id: 2,
      title: 'Admin Document Verification',
      sla: isApproved ? 'Verified & Approved' : 'In Progress by Admin',
      status: isApproved ? 'completed' : 'in_progress',
      detail: isApproved 
        ? 'Admin has verified and approved all director KYC proofs and registered office address documents.'
        : 'Our compliance admin team is reviewing your uploaded PAN, Aadhaar identity documents, and registered office utility bills.'
    },
    {
      id: 3,
      title: 'Registration Confirmed & Active',
      sla: isApproved ? 'Confirmed' : 'Pending Admin Approval',
      status: isApproved ? 'completed' : 'upcoming',
      detail: isApproved
        ? 'Your company registration is confirmed. Assigned to practicing secretarial counsel for MCA filing.'
        : 'This milestone will be unlocked and your registration confirmed once Admin approves your documents.'
    },
    {
      id: 4,
      title: 'Class-3 DSC Video KYC & Token Dispatch',
      sla: isApproved ? 'Next Step: 4 Hours' : 'Locked',
      status: isApproved ? 'in_progress' : 'upcoming',
      detail: isApproved
        ? 'Digital signature authority triggers a 2-minute video verification link on director mobile numbers.'
        : 'Awaiting Admin document approval.'
    },
    {
      id: 5,
      title: 'SPICe+ Part A Name Reservation at CRC',
      sla: isApproved ? 'Day 1' : 'Locked',
      status: 'upcoming',
      detail: `Filing proposed name "${order.company.primaryName}" with Central Registration Centre under Rule 8.`
    },
    {
      id: 6,
      title: 'Issuance of COI, PAN & TAN by ROC',
      sla: isApproved ? 'Day 4-5 Working Days' : 'Locked',
      status: 'upcoming',
      detail: 'Official Government Certificate of Incorporation with CIN, PAN, and TAN delivered via email.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Dynamic Status Banner */}
      {isApproved ? (
        /* Approved Success Celebration Banner */
        <div className="bg-[#0B1528] text-white rounded-2xl p-6 sm:p-8 border border-emerald-500/40 shadow-sm relative overflow-hidden mb-8 animate-fade-in">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300 mb-3 border border-emerald-400/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Registration Successful • Documents Approved by Admin</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Congratulations, {order.auth.name}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Admin has verified and approved your documents. Your incorporation registration for <strong className="text-white font-mono">{order.company.primaryName}</strong> is officially confirmed and moving to MCA ROC submission!
            </p>

            {/* Reference Badges */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono">
              <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px] font-sans font-semibold uppercase">Order Reference</span>
                <span className="font-bold text-white text-sm">{order.orderId}</span>
              </div>
              <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px] font-sans font-semibold uppercase">Verification Status</span>
                <span className="font-bold text-emerald-400 text-sm">Approved by Admin</span>
              </div>
              <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px] font-sans font-semibold uppercase">Total Amount Paid</span>
                <span className="font-bold text-emerald-400 text-sm">₹{order.pricing.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Pending Verification Banner */
        <div className="bg-[#0B1528] text-white rounded-2xl p-6 sm:p-8 border border-amber-500/40 shadow-sm relative overflow-hidden mb-8">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-xs font-bold text-amber-300 mb-3 border border-amber-400/30 animate-pulse">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Registration Status: Pending Admin Document Verification</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Application Received — Verification Pending
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Hello <strong className="text-white">{order.auth.name}</strong>, your incorporation filing for <strong className="text-amber-300 font-mono">{order.company.primaryName}</strong> has been submitted. In accordance with platform governance, your submitted documents must be verified and approved by the <strong>Admin</strong> before registration is successful.
            </p>

            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-300">Registration is NOT yet confirmed</strong>
                <span>Till your KYC and address documents are verified by the Admin, your status will remain <strong>Pending</strong>. You will receive an update as soon as the Admin approves your dossier.</span>
              </div>
            </div>

            {/* Reference Badges */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono">
              <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px] font-sans font-semibold uppercase">Order Reference</span>
                <span className="font-bold text-white text-sm">{order.orderId}</span>
              </div>
              <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px] font-sans font-semibold uppercase">Current Status</span>
                <span className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Pending Admin Approval
                </span>
              </div>
              <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px] font-sans font-semibold uppercase">Fee Paid</span>
                <span className="font-bold text-emerald-400 text-sm">₹{order.pricing.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Status Notification if manual check */}
      {statusMessage && (
        <div className={`p-3 rounded-xl mb-6 text-xs font-bold flex items-center justify-center gap-2 ${
          isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {isApproved ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-blue-600" />}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Submitted Documents Docket Under Admin Verification */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Submitted Documents Docket</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isApproved ? 'All documents have been verified and approved by the Admin.' : 'These documents are currently being checked by the Admin.'}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
            isApproved 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {isApproved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-amber-600" />}
            <span>{isApproved ? 'Admin Approved' : 'Pending Admin Verification'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Directors KYC */}
          {order.directors.map((d, idx) => (
            <div key={d.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Director {idx + 1}: {d.fullName}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isApproved ? 'Verified' : 'Pending Review'}
                </span>
              </div>
              <p className="text-slate-500">
                PAN: <strong className="font-mono text-slate-800">{d.panNumber}</strong> ({d.panDocName || 'PAN_Card.pdf'})
              </p>
              <p className="text-slate-500">
                Aadhaar: <strong className="font-mono text-slate-800">XXXX-XXXX-{d.aadhaarNumber.slice(-4)}</strong> ({d.aadhaarDocName || 'Aadhaar_Card.pdf'})
              </p>
            </div>
          ))}

          {/* Registered Office Proof */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                Registered Office Premises
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isApproved ? 'Verified' : 'Pending Review'}
              </span>
            </div>
            <p className="text-slate-500">
              Address: <span className="font-medium text-slate-800">{order.company.officeAddress.line1}, {order.company.officeAddress.city}</span>
            </p>
            <p className="text-slate-500">
              Utility Proof: <strong className="text-slate-800">{order.company.officeAddress.utilityBillType.toUpperCase()}</strong> ({order.company.officeAddress.utilityBillDocName || 'Utility_Bill.pdf'})
            </p>
          </div>
        </div>

        {/* Live Admin Approval Poller */}
        {!isApproved && (
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Checking approval status automatically every few seconds...</span>
            </span>

            <button
              type="button"
              onClick={handleManualCheck}
              disabled={isCheckingStatus}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingStatus ? 'animate-spin' : ''}`} />
              <span>Check Live Approval Status</span>
            </button>
          </div>
        )}
      </div>

      {/* 6-Stage Milestone Tracker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Live MCA Incorporation Milestone Tracker
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isApproved 
                ? 'Your registration is approved. Tracking active government ROC dockets.' 
                : 'Registration status is currently pending Admin document verification.'}
            </p>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl ${
            isApproved ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{isApproved ? 'Target COI: 4-5 Working Days' : 'Awaiting Admin Approval'}</span>
          </div>
        </div>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {MILESTONES.map((milestone) => {
            const isDone = milestone.status === 'completed';
            const isInProgress = milestone.status === 'in_progress';

            return (
              <div key={milestone.id} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition shadow-sm ${
                    isDone
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : isInProgress
                      ? 'bg-amber-600 text-white ring-4 ring-amber-100 animate-pulse'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isInProgress ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px] font-bold">{milestone.id}</span>
                  )}
                </div>

                <div className="ml-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4
                      className={`text-sm font-bold ${
                        isDone || isInProgress ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {milestone.title}
                    </h4>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block w-fit ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-700'
                          : isInProgress
                          ? 'bg-amber-50 text-amber-700 font-bold'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {milestone.sla}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {milestone.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleDownloadInvoice}
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{downloadSuccess ? 'Receipt Downloaded!' : 'Download Application Receipt'}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start Another Incorporation Filing</span>
        </button>
      </div>
    </div>
  );
}
