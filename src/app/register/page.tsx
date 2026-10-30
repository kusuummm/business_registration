'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import StepProgress from '@/components/StepProgress';
import Step1AuthOTP from '@/components/steps/Step1AuthOTP';
import Step2ServiceCalculator from '@/components/steps/Step2ServiceCalculator';
import Step3CompanyNames from '@/components/steps/Step3CompanyNames';
import Step4DirectorKYC from '@/components/steps/Step4DirectorKYC';
import Step5OfficeDocs from '@/components/steps/Step5OfficeDocs';
import Step6ReviewPayment from '@/components/steps/Step6ReviewPayment';
import Step7OrderSuccess from '@/components/steps/Step7OrderSuccess';

import { 
  CustomerAuth, 
  CompanyDetails, 
  DirectorKYC, 
  PricingBreakdown, 
  RegistrationOrder 
} from '@/types';
import { 
  STATE_STAMP_DUTY, 
  DSC_TOKEN_UNIT_PRICE, 
  GST_RATE 
} from '@/data/pricingData';
import { INITIAL_SERVICES } from '@/data/servicesData';
import { ShieldCheck } from 'lucide-react';

const INITIAL_AUTH: CustomerAuth = {
  mobile: '',
  email: '',
  name: '',
  isVerified: false
};

const INITIAL_COMPANY: CompanyDetails = {
  entityType: 'pvt_ltd',
  stateCode: 'MH',
  authorizedCapital: 100000,
  directorCount: 2,
  primaryName: '',
  secondaryName: '',
  industry: 'it',
  officeAddress: {
    line1: '',
    city: '',
    pincode: '',
    utilityBillType: 'electricity',
    utilityBillDate: '2026-10-10',
    utilityBillDocName: '',
    hasNoc: true
  }
};

const INITIAL_DIRECTORS: DirectorKYC[] = [
  {
    id: 'dir-1',
    fullName: '',
    panNumber: '',
    aadhaarNumber: '',
    hasExistingDin: false,
    dinNumber: '',
    isDigiLockerVerified: false
  },
  {
    id: 'dir-2',
    fullName: '',
    panNumber: '',
    aadhaarNumber: '',
    hasExistingDin: false,
    dinNumber: '',
    isDigiLockerVerified: false
  }
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState<number>(1);
  const [selectedPackageTitle, setSelectedPackageTitle] = useState<string>('Starter Pack');

  // Core Registration State
  const [auth, setAuth] = useState<CustomerAuth>(INITIAL_AUTH);
  const [company, setCompany] = useState<CompanyDetails>(INITIAL_COMPANY);
  const [directors, setDirectors] = useState<DirectorKYC[]>(INITIAL_DIRECTORS);
  const [order, setOrder] = useState<RegistrationOrder | null>(null);

  // Initial pricing calculated based on defaults
  const [pricing, setPricing] = useState<PricingBreakdown>(() => {
    const baseFee = 2499;
    const stampDuty = STATE_STAMP_DUTY['MH'].stampDuty;
    const rocFee = 0;
    const dscFee = 2 * DSC_TOKEN_UNIT_PRICE;
    const taxableSubtotal = baseFee + dscFee;
    const gstAmount = Math.round(taxableSubtotal * GST_RATE);
    const totalAmount = taxableSubtotal + gstAmount + stampDuty + rocFee;
    return {
      baseFee,
      stampDuty,
      rocFee,
      dscFee,
      taxableSubtotal,
      gstAmount,
      totalAmount
    };
  });

  // Read URL query parameter for chosen package or specific service (from homepage click)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get('service');
      const pkg = params.get('package');

      if (serviceParam) {
        const found = INITIAL_SERVICES.find(s => s.slug === serviceParam || s.id === serviceParam);
        if (found) {
          setSelectedPackageTitle(`${found.name} Filing (₹${found.baseFee.toLocaleString('en-IN')})`);
          setCompany((prev) => ({
            ...prev,
            entityType: found.name.includes('LLP') ? 'LLP' :
                        found.name.includes('One Person') ? 'OPC' :
                        found.name.includes('Private') ? 'Pvt Ltd' : found.name
          }));
          setPricing((prev) => {
            const baseFee = found.baseFee;
            const dscFee = found.dscFee || 0;
            const taxableSubtotal = baseFee + dscFee;
            const gstAmount = Math.round(taxableSubtotal * GST_RATE);
            const rocFee = found.govFee || 0;
            return {
              ...prev,
              baseFee,
              dscFee,
              taxableSubtotal,
              gstAmount,
              rocFee,
              totalAmount: taxableSubtotal + gstAmount + prev.stampDuty + rocFee
            };
          });
          return;
        }
      }

      if (pkg === 'growth') {
        setSelectedPackageTitle('Fast-Track Growth Pack (₹4,999)');
        setPricing((prev) => {
          const baseFee = 4999;
          const taxableSubtotal = baseFee + prev.dscFee;
          const gstAmount = Math.round(taxableSubtotal * GST_RATE);
          return {
            ...prev,
            baseFee,
            taxableSubtotal,
            gstAmount,
            totalAmount: taxableSubtotal + gstAmount + prev.stampDuty + prev.rocFee
          };
        });
      } else if (pkg === 'shield') {
        setSelectedPackageTitle('Compliance & IP Shield (₹9,999)');
        setPricing((prev) => {
          const baseFee = 9999;
          const taxableSubtotal = baseFee + prev.dscFee;
          const gstAmount = Math.round(taxableSubtotal * GST_RATE);
          return {
            ...prev,
            baseFee,
            taxableSubtotal,
            gstAmount,
            totalAmount: taxableSubtotal + gstAmount + prev.stampDuty + prev.rocFee
          };
        });
      } else {
        setSelectedPackageTitle('Starter Pack (₹2,499)');
      }
    }
  }, []);

  const advanceToStep = (step: number) => {
    setCurrentStep(step);
    if (step > maxAccessibleStep) {
      setMaxAccessibleStep(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 1 Success Handler
  const handleAuthSuccess = (verifiedAuth: CustomerAuth) => {
    setAuth(verifiedAuth);
    // If director 1 has no name yet, pre-populate with customer name
    if (!directors[0].fullName && verifiedAuth.name) {
      setDirectors((prev) => {
        const next = [...prev];
        next[0] = { ...next[0], fullName: verifiedAuth.name || '' };
        return next;
      });
    }
    advanceToStep(2);
  };

  // Step 2 Change & Next
  const handleCompanyChange = (updated: Partial<CompanyDetails>, newPricing: PricingBreakdown) => {
    setCompany((prev) => ({ ...prev, ...updated }));
    setPricing(newPricing);
  };

  // Step 6 Payment Success - Order placed, document verification is assigned to Admin
  const handlePaymentSuccess = async (confirmedOrder: RegistrationOrder) => {
    const pendingOrder: RegistrationOrder = {
      ...confirmedOrder,
      status: 'Pending Admin Verification',
      adminApproved: false,
      docVerificationStatus: 'Pending Admin Verification',
      assignedPartner: 'Unassigned',
      docsPending: 'Pending Admin Document Verification',
      certificateUploaded: false
    };

    setOrder(pendingOrder);
    
    // Save to server-side backend API database
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingOrder)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('bharatfilings_current_order', JSON.stringify(data.data));
          localStorage.setItem('bharatfilings_customer_user', JSON.stringify(data.data.auth));
        }
      }
    } catch (err) {
      console.error('Failed to persist order to backend API:', err);
    }

    // Cache customer session in browser storage for instant portal sync
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bharatfilings_current_order', JSON.stringify(pendingOrder));
        localStorage.setItem('bharatfilings_customer_user', JSON.stringify(pendingOrder.auth));
      }
    } catch (e) {
      console.warn('Storage sync notice:', e);
    }

    advanceToStep(7);
  };

  // Reset to Step 1 for fresh filing
  const handleResetFlow = () => {
    setAuth(INITIAL_AUTH);
    setCompany(INITIAL_COMPANY);
    setDirectors(INITIAL_DIRECTORS);
    setOrder(null);
    setCurrentStep(1);
    setMaxAccessibleStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Universal Top Header */}
      <Header currentStep={currentStep} />

      {/* Package Notification Bar */}
      <div className="bg-[#0B1528] text-white py-2 px-4 border-b border-slate-800 text-center text-xs flex items-center justify-center gap-2 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>Selected Package Tier: <strong className="text-amber-300 font-bold">{selectedPackageTitle}</strong></span>
        <span className="text-slate-400 hidden sm:inline">• 100% Sovereign Stamp Duty Guaranteed</span>
      </div>

      {/* 7-Step Interactive Progress Tracker */}
      <StepProgress
        currentStep={currentStep}
        onStepClick={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        maxAccessibleStep={maxAccessibleStep}
      />

      {/* Main Step Body */}
      <main className="flex-1 pb-16">
        {currentStep === 1 && (
          <Step1AuthOTP auth={auth} onSuccess={handleAuthSuccess} />
        )}

        {currentStep === 2 && (
          <Step2ServiceCalculator
            company={company}
            onChange={handleCompanyChange}
            onNext={() => advanceToStep(3)}
            onBack={() => advanceToStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3CompanyNames
            company={company}
            onChange={(updated) => setCompany((prev) => ({ ...prev, ...updated }))}
            onNext={() => advanceToStep(4)}
            onBack={() => advanceToStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4DirectorKYC
            directorCount={company.directorCount}
            directors={directors}
            onChange={setDirectors}
            onNext={() => advanceToStep(5)}
            onBack={() => advanceToStep(3)}
          />
        )}

        {currentStep === 5 && (
          <Step5OfficeDocs
            company={company}
            onChange={(updated) => setCompany((prev) => ({ ...prev, ...updated }))}
            onNext={() => advanceToStep(6)}
            onBack={() => advanceToStep(4)}
          />
        )}

        {currentStep === 6 && (
          <Step6ReviewPayment
            auth={auth}
            company={company}
            directors={directors}
            pricing={pricing}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => advanceToStep(5)}
          />
        )}

        {currentStep === 7 && order && (
          <Step7OrderSuccess order={order} onReset={handleResetFlow} />
        )}
      </main>

      {/* Universal Footer */}
      <footer className="bg-[#0B1528] text-slate-300 border-t border-slate-800 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800 text-xs">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="px-2.5 py-1 rounded-md border border-dashed border-slate-700 text-xs font-semibold text-slate-300 tracking-wide bg-slate-900/60">
                  Logo
                </div>
                <span className="text-sm font-bold text-white">
                  Corporate Registration & Compliance
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                India&apos;s most transparent legal-tech platform for company registration, ROC filings, and corporate governance.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-2.5">
                Statutory Compliance
              </h5>
              <ul className="space-y-1.5 text-slate-400">
                <li>MCA V3 Portal Integration</li>
                <li>Digital Personal Data Protection Act 2023</li>
                <li>UIDAI Aadhaar Masking Standard</li>
                <li>Companies (Incorporation) Rules, 2014</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-2.5">
                Direct Sovereign Levies
              </h5>
              <ul className="space-y-1.5 text-slate-400">
                <li>Maharashtra Stamp Act Art. 20</li>
                <li>Delhi Stamp Rules 1911</li>
                <li>Karnataka Stamp Act Sch. Art 20(2)</li>
                <li>Punjab Stamp Rules (1% Threshold)</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-2.5">
                Support & Contact
              </h5>
              <p className="text-slate-400 leading-relaxed">
                MCA Certified Secretarial Desk<br />
                Email: support@bharatfilings.in<br />
                WhatsApp: +91 98200 12849
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
            <p>
              &copy; 2026 Corporate LegalTech & Compliance Services. All rights reserved.
            </p>
            <p className="text-center sm:text-right">
              Statutory fees are directly remitted to the Ministry of Corporate Affairs and respective State Treasuries.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
