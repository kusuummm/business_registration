-- =========================================================================
-- MASTER PRODUCTION DATABASE SCHEMA (PostgreSQL 16)
-- BharatFilings: Pan-India Legal, Tax, Registration & Compliance Platform
-- =========================================================================

-- Enable UUID extension for cryptographically secure identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------------------
-- 1. ENUM TYPES & STATIC DOMAINS
-- -------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'operations_manager', 'legal_reviewer', 'partner_counsel', 'client');
    CREATE TYPE entity_type AS ENUM ('private_limited', 'public_limited', 'opc', 'llp', 'partnership', 'sole_proprietorship', 'section_8');
    CREATE TYPE payment_gateway AS ENUM ('razorpay', 'cashfree', 'direct_imps');
    CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'captured', 'failed', 'refunded');
    CREATE TYPE order_status AS ENUM ('draft', 'payment_pending', 'pending_admin_verification', 'approved_verified', 'drafting_docs', 'filing_in_progress', 'incorporated', 'cancelled');
    CREATE TYPE doc_qc_status AS ENUM ('pending_verification', 'verified', 'query_raised', 'rejected');
    CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -------------------------------------------------------------------------
-- 2. CORE USERS & AUTHENTICATION TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role user_role DEFAULT 'client',
    is_verified BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- -------------------------------------------------------------------------
-- 3. REGISTERED ENTITIES (CUSTOMER BUSINESSES)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customer_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    legal_name VARCHAR(255) NOT NULL,
    entity_type entity_type NOT NULL,
    cin VARCHAR(21) UNIQUE,
    pan VARCHAR(10) UNIQUE,
    tan VARCHAR(10),
    gstin VARCHAR(15) UNIQUE,
    state_code VARCHAR(5) NOT NULL,
    roc_jurisdiction VARCHAR(100) NOT NULL,
    authorized_capital NUMERIC(15, 2) DEFAULT 100000.00,
    paid_up_capital NUMERIC(15, 2) DEFAULT 100000.00,
    registered_office_address TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    incorporation_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 4. SERVICE CATALOG & TAXONOMY
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50) REFERENCES service_categories(id),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_desc TEXT,
    full_desc TEXT,
    base_fee NUMERIC(10, 2) NOT NULL,
    gov_fee NUMERIC(10, 2) DEFAULT 0.00,
    ca_fee NUMERIC(10, 2) DEFAULT 0.00,
    dsc_fee NUMERIC(10, 2) DEFAULT 0.00,
    gst_rate NUMERIC(4, 2) DEFAULT 0.18,
    sla_working_days VARCHAR(50) DEFAULT '4-6 Working Days',
    is_active BOOLEAN DEFAULT TRUE,
    badge VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 5. DYNAMIC STATE STAMP DUTY LOOKUP MATRIX
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id VARCHAR(50) REFERENCES services(id),
    state_code VARCHAR(5) NOT NULL,
    min_capital NUMERIC(15, 2) DEFAULT 0.00,
    max_capital NUMERIC(15, 2) DEFAULT 10000000.00,
    stamp_duty_moa NUMERIC(10, 2) NOT NULL,
    stamp_duty_aoa NUMERIC(10, 2) NOT NULL,
    total_stamp_duty NUMERIC(10, 2) NOT NULL,
    mca_roc_fee NUMERIC(10, 2) DEFAULT 0.00,
    legal_citation VARCHAR(255),
    UNIQUE(service_id, state_code, min_capital, max_capital)
);

-- -------------------------------------------------------------------------
-- 6. PRACTICING CA / CS PARTNERS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    full_name VARCHAR(150) NOT NULL,
    title VARCHAR(100) NOT NULL,
    profession VARCHAR(50) NOT NULL, -- 'CS', 'CA', 'Advocate'
    cop_number VARCHAR(50) UNIQUE NOT NULL, -- Certificate of Practice
    is_verified BOOLEAN DEFAULT FALSE,
    wallet_balance NUMERIC(12, 2) DEFAULT 0.00,
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    bank_name VARCHAR(100),
    active_orders_count INT DEFAULT 0,
    completed_orders_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 7. ORDERS & FILING PIPELINE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    partner_id UUID REFERENCES partners(id),
    company_name VARCHAR(255) NOT NULL,
    service_slug VARCHAR(100) NOT NULL,
    state_code VARCHAR(5) NOT NULL,
    authorized_capital NUMERIC(15, 2) DEFAULT 100000.00,
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    
    -- Mandatory Admin Verification Gate
    admin_approved BOOLEAN DEFAULT FALSE,
    doc_verification_status VARCHAR(50) DEFAULT 'Pending Admin Verification',
    admin_approved_at TIMESTAMP WITH TIME ZONE,
    admin_approved_by VARCHAR(100),
    admin_notes TEXT,
    
    status order_status DEFAULT 'pending_admin_verification',
    certificate_uploaded BOOLEAN DEFAULT FALSE,
    certificate_file_name TEXT,
    cin_allotted VARCHAR(21),
    pan_allotted VARCHAR(10),
    tan_allotted VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_admin_approved ON orders(admin_approved);

-- -------------------------------------------------------------------------
-- 8. ORDER DOCUMENTS & ENCRYPTED VAULT
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(50) REFERENCES orders(order_id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    sha256_hash VARCHAR(64) NOT NULL,
    is_digilocker_verified BOOLEAN DEFAULT FALSE,
    qc_status doc_qc_status DEFAULT 'pending_verification',
    qc_reviewed_at TIMESTAMP WITH TIME ZONE,
    qc_notes TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 9. PAYMENTS & GATEWAY RECONCILIATION
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(50) REFERENCES orders(order_id),
    gateway payment_gateway DEFAULT 'razorpay',
    gateway_payment_id VARCHAR(100) UNIQUE,
    gateway_order_id VARCHAR(100),
    gateway_signature VARCHAR(255),
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'INR',
    status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    raw_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 10. GST TAX INVOICES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
    invoice_number VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(order_id),
    customer_name VARCHAR(150) NOT NULL,
    customer_gstin VARCHAR(15),
    company_name VARCHAR(255) NOT NULL,
    sac_code VARCHAR(10) DEFAULT '998211',
    taxable_amount NUMERIC(12, 2) NOT NULL,
    cgst_amount NUMERIC(12, 2) DEFAULT 0.00,
    sgst_amount NUMERIC(12, 2) DEFAULT 0.00,
    igst_amount NUMERIC(12, 2) DEFAULT 0.00,
    total_tax NUMERIC(12, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    pdf_download_url TEXT,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 11. PARTNER DISBURSEMENTS & ESCROW
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS partner_payouts (
    payout_id VARCHAR(50) PRIMARY KEY,
    partner_id UUID REFERENCES partners(id),
    order_id VARCHAR(50) REFERENCES orders(order_id),
    fee_earned NUMERIC(10, 2) NOT NULL,
    tds_deducted NUMERIC(10, 2) DEFAULT 0.00,
    net_disbursed NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending Payout',
    bank_utr_number VARCHAR(100),
    disbursed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 12. SUPPORT TICKETS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    customer_name VARCHAR(150) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status ticket_status DEFAULT 'open',
    assigned_to VARCHAR(150) DEFAULT 'Corporate Secretarial Desk',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 13. AUDIT LOGS & DPDP ACT 2023 TAMPER EVIDENCE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    payload_snapshot JSONB,
    sha256_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
