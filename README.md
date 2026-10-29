# BharatFilings - Business Registration & Corporate Compliance Platform

A modern, full-stack enterprise platform for Indian corporate filings, company registrations (Private Limited, LLP, OPC, Section 8), statutory compliance, and digital governance.

## 🚀 Key Modules & Portals

### 1. Executive Operations & Admin Hub (`/admin`)
- **Central Oversight Dashboard:** Live monitoring of statutory filings, CRC approvals, revenue, and pending payouts.
- **Dynamic Pricing & Service Engine:** Configure base fees, MCA government fees, CA/CS payouts, and GST rates without code changes.
- **Counsel Allocation:** Assign incoming corporate registrations to verified CS/CA partners.
- **KYC & Document QC Desk:** Review and verify director Aadhaar/PAN dossiers and release Certificates of Incorporation (COI).
- **Callback Inquiries & CRM:** Real-time consultation lead tracking with conversion analytics.

### 2. Corporate Secretarial Partner Desk (`/partner`)
- **Assigned Filings Queue:** Multi-mode workspace (Table Grid & Detailed Cards) with live SLA countdowns.
- **Sovereign Client KYC Inspection:** Decrypt and examine verified director identification files and landlord NOCs.
- **MCA V3 CRC Gateway Synchronization:** Update statutory stages (SPICe+ Part A/B, DSC Signing, CRC Review) with automated client alerts.
- **MoA / AoA Statutory Studio:** Interactive Schedule I Table A-F generator with industry-standard objects and ancillary clauses.
- **Statutory Compliance Calendar:** ROC annual compliance deadline tracking (INC-20A, Form 11, DIR-3 KYC, AOC-4, MGT-7).
- **DSC Cryptographic Token Desk:** Class-3 USB hardware token handshake testing and Aadhaar eSign link dispatch.
- **Settlement & Payout Ledger:** Track professional fee remittances with 10% TDS (u/s 194J) and instant IMPS/NEFT bank withdrawals.

### 3. Customer & Founder Portal (`/customer`)
- **Real-Time Incorporation Timeline:** Step-by-step statutory progress tracking.
- **Company Identity Vault:** Download verified MoA, AoA, PAN, TAN, and Certificate of Incorporation.
- **Statutory Compliance Checklist:** Post-incorporation compliance management.
- **Admin Password Reset Request Desk:** Secure credential updates handled via centralized admin verification with automated email alerts.

### 4. Public Portals & Business Tools
- **Corporate Registration Flow:** Step-by-step incorporation wizard for Private Limited, LLP, and OPC.
- **Statutory Cost Calculator (`/calculator`):** Instant fee estimates breakdown across government stamp duty, secretarial fees, and GST.
- **Public Website & Service Catalog (`/services`):** Full breakdown of legal, tax, trademark, and ROC services.
- **Authentication & Security (`/login`, `/register`):** Role-based access control (Admin, Partner, Customer) with secure session handling.

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router, Server Components & Route Handlers)
- **UI Library:** React 19, Tailwind CSS, Lucide Icons
- **Typography:** Microsoft Segoe UI Executive Typography System
- **Database Architecture:** SQLite / Relational Schema with Structured SQL Migrations
- **Security:** Sovereign KYC encryption, masked PAN/Aadhaar handling, DPDP 2023 compliance

## 📦 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/kusuummm/business_registration.git

# Navigate into the project
cd business_registration

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the platform.

### Primary Routes
- `/` - Public Homepage & Consultation Portal
- `/login` - Unified Multi-Role Authentication Portal
- `/admin` - Central Operations Hub & Pricing Engine
- `/partner` - Corporate Secretarial Workbench (CS Priya Sharma)
- `/customer` - Founder Incorporation Tracking Dashboard
- `/calculator` - Statutory Incorporation Fee Calculator
