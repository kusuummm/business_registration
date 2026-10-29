'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPasswordsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin?tab=passwords');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-500 font-sans text-xs">
      <span>Redirecting to Customer Credential & Password Management Desk...</span>
    </div>
  );
}
