'use client';

import React from 'react';
import { 
  UserCheck, 
  Building2, 
  FileText, 
  Users, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  maxAccessibleStep: number;
}

const STEPS = [
  { id: 1, label: 'Account', shortLabel: 'Auth', icon: UserCheck },
  { id: 2, label: 'Entity & State', shortLabel: 'Entity', icon: Building2 },
  { id: 3, label: 'Company Names', shortLabel: 'Names', icon: FileText },
  { id: 4, label: 'Director KYC', shortLabel: 'KYC', icon: Users },
  { id: 5, label: 'Registered Office', shortLabel: 'Office', icon: MapPin },
  { id: 6, label: 'Review & Pay', shortLabel: 'Payment', icon: CreditCard },
  { id: 7, label: 'Track Order', shortLabel: 'Status', icon: CheckCircle2 }
];

export default function StepProgress({
  currentStep,
  onStepClick,
  maxAccessibleStep
}: StepProgressProps) {
  return (
    <div className="w-full bg-white border-b border-slate-200 py-3 px-4 sm:px-6 shadow-sm sticky top-16 sm:top-20 z-40">
      <div className="max-w-7xl mx-auto">
        {/* Mobile View: Compact Progress Bar */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-900 font-bold">
              <span className="w-5 h-5 rounded-full bg-[#0B1528] text-white flex items-center justify-center text-[10px] font-bold">
                {currentStep}
              </span>
              <span>Step {currentStep} of 7: {STEPS[currentStep - 1]?.label}</span>
            </span>
            <span className="text-slate-400 font-mono">
              {Math.round(((currentStep - 1) / 6) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#0B1528] h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop View: Interactive Horizontal Stepper */}
        <nav aria-label="Progress" className="hidden sm:block">
          <ol className="flex items-center justify-between">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              const isAccessible = step.id <= maxAccessibleStep;

              return (
                <li key={step.id} className="relative flex-1 flex items-center">
                  <button
                    type="button"
                    disabled={!isAccessible}
                    onClick={() => isAccessible && onStepClick(step.id)}
                    className={`group flex items-center w-full focus:outline-none transition-colors ${
                      isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                          isCompleted
                            ? 'bg-emerald-700 text-white'
                            : isCurrent
                            ? 'bg-[#0B1528] text-white ring-4 ring-slate-200'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="text-left">
                        <p
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            isCurrent
                              ? 'text-[#0B1528]'
                              : isCompleted
                              ? 'text-emerald-800'
                              : 'text-slate-400'
                          }`}
                        >
                          Step {step.id}
                        </p>
                        <p
                          className={`text-xs font-semibold whitespace-nowrap ${
                            isCurrent
                              ? 'text-slate-900 font-black'
                              : isCompleted
                              ? 'text-slate-700 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  </button>

                  {idx !== STEPS.length - 1 && (
                    <div
                      className={`hidden md:block flex-1 mx-3 h-0.5 transition-colors ${
                        step.id < currentStep ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
