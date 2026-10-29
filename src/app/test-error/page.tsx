'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function TestErrorPage() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    // This will throw a runtime error, triggering src/app/error.tsx
    throw new Error('SIMULATED_DATABASE_TIMEOUT_EXCEPTION_CODE_500');
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F8FAFC] flex flex-col justify-center items-center font-sans text-slate-900 p-4 select-none">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 mb-5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3.5 border border-red-200">
          <ShieldAlert className="w-5 h-5" />
        </div>

        <h1 className="text-xl font-black text-slate-900">
          Error Boundary Test Console
        </h1>
        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
          This test console demonstrates how the platform handles runtime crashes without exposing stack traces or error types.
        </p>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
          <strong>Safeguard Rule:</strong> No stack trace, no error code, and zero technical details will be shown. The screen cleanly switches to the compact, non-scrolling safeguard downtime screen.
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShouldThrow(true)}
            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Simulate Runtime Error</span>
          </button>
        </div>
      </div>
    </div>
  );
}
