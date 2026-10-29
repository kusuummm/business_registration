import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "BharatFilings | Pan-India Business Registration & Corporate Compliance",
  description: "Official corporate secretarial desk, company registration (Private Limited, LLP, OPC), and statutory ROC compliance gateway.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
