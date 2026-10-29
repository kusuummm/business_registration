import React from 'react';
import CustomerThemeWrapper from '@/components/CustomerThemeWrapper';

export default function CustomerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <CustomerThemeWrapper>{children}</CustomerThemeWrapper>;
}
