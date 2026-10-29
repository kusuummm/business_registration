import React from 'react';
import AdminThemeWrapper from '@/components/AdminThemeWrapper';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AdminThemeWrapper>{children}</AdminThemeWrapper>;
}
