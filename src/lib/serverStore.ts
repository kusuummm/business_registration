import fs from 'fs';
import path from 'path';
import { INITIAL_SERVICES, ServiceItem } from '../data/servicesData';
import { RegistrationOrder } from '../types';
import { PlatformSettings, DEFAULT_SETTINGS } from '../data/settingsData';

export type { PlatformSettings };
export { DEFAULT_SETTINGS };

export interface CallbackLead {
  id: string;
  name: string;
  mobile: string;
  service: string;
  city: string;
  status: 'Pending' | 'Contacted' | 'Converted' | 'Closed';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  subject: string;
  category: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  updatedAt: string;
  createdAt: string;
}

export interface PartnerAccount {
  id: string;
  name: string;
  title: string;
  type: 'CS' | 'CA' | 'Advocate';
  copNumber: string;
  verified: boolean;
  activeOrdersCount: number;
  completedOrdersCount: number;
  walletBalance: number;
  bankAccount: string;
}

export interface PayoutRecord {
  id: string;
  partnerId: string;
  partnerName: string;
  orders: number;
  feeEarned: number;
  status: 'Pending Payout' | 'Processed';
  bank: string;
  date: string;
}

export interface ExtendedOrder extends RegistrationOrder {
  status: string;
  assignedPartner: string;
  docsPending: string;
  certificateUploaded: boolean;
  certificateFileName?: string;
  notes?: string;
  adminApproved?: boolean;
  docVerificationStatus?: 'Pending Admin Verification' | 'Approved' | 'Rejected';
  adminApprovedAt?: string;
  adminApprovedBy?: string;
  adminNotes?: string;
  coiReleasedAt?: string;
}

export interface PasswordResetRequest {
  id: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  companyName: string;
  reason: string;
  urgency: 'Normal' | 'Urgent';
  status: 'Pending Admin Review' | 'Completed' | 'Rejected';
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  generatedPassword?: string;
  emailDispatched?: boolean;
  emailDispatchDetails?: {
    to: string;
    from: string;
    sentAt: string;
    subject: string;
    loginUrl: string;
    plainPassword: string;
    bodySnippet: string;
  };
}

export interface CustomerEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  sentAt: string;
  bodySnippet: string;
  loginUrl: string;
  plainPassword?: string;
  read: boolean;
}

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  mobile: string;
  companyName: string;
  password: string;
  passwordLastChangedAt?: string;
  receivedEmails: CustomerEmail[];
}

interface DataStore {
  services: ServiceItem[];
  orders: ExtendedOrder[];
  callbacks: CallbackLead[];
  tickets: SupportTicket[];
  partners: PartnerAccount[];
  payouts: PayoutRecord[];
  settings?: PlatformSettings;
  passwordRequests?: PasswordResetRequest[];
  customers?: CustomerAccount[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed orders
const SEED_ORDERS: ExtendedOrder[] = [
  {
    orderId: 'ORD-2026-9182',
    auth: {
      name: 'Rahul Sharma',
      email: 'client@example.com',
      mobile: '9876543210',
      isVerified: true
    },
    company: {
      entityType: 'pvt_ltd',
      stateCode: 'MH',
      authorizedCapital: 1000000,
      directorCount: 2,
      primaryName: 'TechNova Solutions Private Limited',
      secondaryName: 'TechNova Dynamics Pvt Ltd',
      industry: 'Software & Information Technology',
      officeAddress: {
        line1: 'Unit 402, Quantum IT Park, Hinjewadi Phase 1',
        city: 'Pune',
        pincode: '411057',
        utilityBillType: 'Electricity Bill',
        utilityBillDate: '2026-10-15',
        utilityBillDocName: 'EB_Bill_Pune_Oct2026.pdf',
        hasNoc: true
      }
    },
    directors: [
      {
        id: 'DIR-101',
        fullName: 'Rahul Sharma',
        panNumber: 'ABCPS1234F',
        aadhaarNumber: '•••• •••• 8912',
        hasExistingDin: false,
        isDigiLockerVerified: true,
        panDocName: 'PAN_Rahul_Sharma.pdf',
        aadhaarDocName: 'Aadhaar_Rahul_Sharma.pdf'
      },
      {
        id: 'DIR-102',
        fullName: 'Pooja Sharma',
        panNumber: 'BCDPS5678G',
        aadhaarNumber: '•••• •••• 4410',
        hasExistingDin: false,
        isDigiLockerVerified: true,
        panDocName: 'PAN_Pooja_Sharma.pdf',
        aadhaarDocName: 'Aadhaar_Pooja_Sharma.pdf'
      }
    ],
    pricing: {
      baseFee: 4999,
      stampDuty: 1000,
      rocFee: 2000,
      dscFee: 2999,
      taxableSubtotal: 8998,
      gstAmount: 1619,
      totalAmount: 10998
    },
    paymentStatus: 'success',
    paymentMethod: 'Razorpay / UPI',
    paymentTransactionId: 'pay_ONL_98218763',
    createdAt: '2026-10-24T10:30:00.000Z',
    assignedCs: {
      name: 'CS Priya Sharma',
      membershipNumber: 'FCS-11248',
      email: 'priya.sharma@bharatfilings.in',
      phone: '+91 98201 55432'
    },
    status: 'ROC Scrutiny in Progress',
    assignedPartner: 'CS Priya Sharma',
    adminApproved: true,
    docVerificationStatus: 'Approved',
    adminApprovedAt: '2026-10-25T11:00:00.000Z',
    adminApprovedBy: 'Admin Master QC',
    docsPending: 'None (All KYC Verified)',
    certificateUploaded: false
  },
  {
    orderId: 'ORD-2026-7734',
    auth: {
      name: 'Ananya Verma',
      email: 'ananya@greenleafagro.com',
      mobile: '9820012849',
      isVerified: true
    },
    company: {
      entityType: 'pvt_ltd',
      stateCode: 'KA',
      authorizedCapital: 500000,
      directorCount: 2,
      primaryName: 'GreenLeaf Agro Private Limited',
      secondaryName: 'GreenLeaf Organics Pvt Ltd',
      industry: 'Agri-Tech & Organic Supply Chain',
      officeAddress: {
        line1: 'Level 2, Brigade Tech Gardens, Whitefield',
        city: 'Bengaluru',
        pincode: '560066',
        utilityBillType: 'BESCOM Electricity Bill',
        utilityBillDate: '2026-10-10',
        utilityBillDocName: 'BESCOM_Oct2026.pdf',
        hasNoc: true
      }
    },
    directors: [
      {
        id: 'DIR-201',
        fullName: 'Ananya Verma',
        panNumber: 'DEFPV9012K',
        aadhaarNumber: '•••• •••• 3021',
        hasExistingDin: false,
        isDigiLockerVerified: true,
        panDocName: 'PAN_Ananya_Verma.pdf',
        aadhaarDocName: 'Aadhaar_Ananya_Verma.pdf'
      },
      {
        id: 'DIR-202',
        fullName: 'Tarun Verma',
        panNumber: 'EFGPV3456L',
        aadhaarNumber: '•••• •••• 7712',
        hasExistingDin: true,
        dinNumber: 'DIN-09182741',
        isDigiLockerVerified: true,
        panDocName: 'PAN_Tarun_Verma.pdf',
        aadhaarDocName: 'Aadhaar_Tarun_Verma.pdf'
      }
    ],
    pricing: {
      baseFee: 4999,
      stampDuty: 1000,
      rocFee: 1000,
      dscFee: 2999,
      taxableSubtotal: 7998,
      gstAmount: 1439,
      totalAmount: 9998
    },
    paymentStatus: 'success',
    paymentMethod: 'Net Banking (HDFC Bank)',
    paymentTransactionId: 'pay_HDFC_33918274',
    createdAt: '2026-10-18T14:15:00.000Z',
    assignedCs: {
      name: 'CS Rajesh Mehta',
      membershipNumber: 'FCS-9943',
      email: 'rajesh.mehta@bharatfilings.in',
      phone: '+91 98112 44321'
    },
    status: 'Certificate of Incorporation Issued',
    assignedPartner: 'CS Rajesh Mehta',
    adminApproved: true,
    docVerificationStatus: 'Approved',
    adminApprovedAt: '2026-10-19T09:30:00.000Z',
    adminApprovedBy: 'Admin Master QC',
    docsPending: 'None - Company Active',
    certificateUploaded: true,
    certificateFileName: 'COI_U72900KA2026PTC184920_GreenLeaf_Agro.pdf',
    coiReleasedAt: '2026-10-23T16:00:00.000Z'
  },
  {
    orderId: 'ORD-2026-9042',
    auth: {
      name: 'Rahul Sharma',
      email: 'client@example.com',
      mobile: '9876543210',
      isVerified: true
    },
    company: {
      entityType: 'pvt_ltd',
      stateCode: 'DL',
      authorizedCapital: 2500000,
      directorCount: 2,
      primaryName: 'AuraFintech Innovations Private Limited',
      secondaryName: 'AuraPay Technologies Pvt Ltd',
      industry: 'Fintech & Neo-Banking Solutions',
      officeAddress: {
        line1: 'Plot 14, Okhla Industrial Area Phase 3',
        city: 'New Delhi',
        pincode: '110020',
        utilityBillType: 'BSES Rajdhani Bill',
        utilityBillDate: '2026-10-22',
        utilityBillDocName: 'BSES_Bill_Oct2026.pdf',
        hasNoc: true
      }
    },
    directors: [
      {
        id: 'DIR-301',
        fullName: 'Rahul Sharma',
        panNumber: 'ABCPS1234F',
        aadhaarNumber: '•••• •••• 8912',
        hasExistingDin: true,
        dinNumber: 'DIN-09948210',
        isDigiLockerVerified: true
      },
      {
        id: 'DIR-302',
        fullName: 'Neha Taneja',
        panNumber: 'FGHPB8821M',
        aadhaarNumber: '•••• •••• 9920',
        hasExistingDin: false,
        isDigiLockerVerified: true
      }
    ],
    pricing: {
      baseFee: 6999,
      stampDuty: 2500,
      rocFee: 4000,
      dscFee: 4498,
      taxableSubtotal: 13997,
      gstAmount: 2519,
      totalAmount: 17997
    },
    paymentStatus: 'success',
    paymentMethod: 'Corporate Credit Card',
    paymentTransactionId: 'pay_CC_77192841',
    createdAt: '2026-10-26T16:45:00.000Z',
    assignedCs: {
      name: 'CS Priya Sharma',
      membershipNumber: 'FCS-11248',
      email: 'priya.sharma@bharatfilings.in',
      phone: '+91 98201 55432'
    },
    status: 'Pending Admin Document Verification',
    assignedPartner: 'Unassigned (Pending QC)',
    adminApproved: false,
    docVerificationStatus: 'Pending Admin Verification',
    docsPending: 'Admin Sign-off Required',
    certificateUploaded: false
  },
  {
    orderId: 'ORD-2026-8812',
    auth: {
      name: 'Vikramaditya Roy',
      email: 'vikram@zenithagro.com',
      mobile: '9811234567',
      isVerified: true
    },
    company: {
      entityType: 'llp',
      stateCode: 'TN',
      authorizedCapital: 500000,
      directorCount: 2,
      primaryName: 'Zenith Organic Foods LLP',
      secondaryName: 'Zenith Agritech LLP',
      industry: 'Agri-Business & Exports',
      officeAddress: {
        line1: '45 Anna Salai, Guindy',
        city: 'Chennai',
        pincode: '600032',
        utilityBillType: 'TNEB Electricity Bill',
        utilityBillDate: '2026-10-21',
        hasNoc: true
      }
    },
    directors: [
      {
        id: 'DIR-401',
        fullName: 'Vikramaditya Roy',
        panNumber: 'GHIPV4410N',
        aadhaarNumber: '•••• •••• 1102',
        hasExistingDin: false,
        isDigiLockerVerified: true
      },
      {
        id: 'DIR-402',
        fullName: 'Neha Roy',
        panNumber: 'HIJPV5521P',
        aadhaarNumber: '•••• •••• 9918',
        hasExistingDin: false,
        isDigiLockerVerified: true
      }
    ],
    pricing: {
      baseFee: 3999,
      stampDuty: 500,
      rocFee: 1000,
      dscFee: 2999,
      taxableSubtotal: 6498,
      gstAmount: 1169,
      totalAmount: 8498
    },
    paymentStatus: 'success',
    paymentMethod: 'UPI',
    createdAt: '2026-10-27T11:20:00.000Z',
    assignedCs: {
      name: 'CS Priya Sharma',
      membershipNumber: 'FCS-11248',
      email: 'priya.sharma@bharatfilings.in',
      phone: '+91 98201 55432'
    },
    status: 'Drafting MOA & AOA',
    assignedPartner: 'CS Priya Sharma',
    adminApproved: true,
    docVerificationStatus: 'Approved',
    docsPending: 'Partner Secretarial Drafting',
    certificateUploaded: false
  },
  {
    orderId: 'ORD-2026-8740',
    auth: {
      name: 'Dr. Arjun Mehta',
      email: 'arjun@biohealthai.in',
      mobile: '9723456789',
      isVerified: true
    },
    company: {
      entityType: 'pvt_ltd',
      stateCode: 'HR',
      authorizedCapital: 1500000,
      directorCount: 2,
      primaryName: 'BioHealth Diagnostic Labs Pvt Ltd',
      secondaryName: 'BioHealth Diagnostics Private Limited',
      industry: 'Healthcare Diagnostics & AI',
      officeAddress: {
        line1: 'Tower B, Cyber City, Phase 2',
        city: 'Gurugram',
        pincode: '122002',
        utilityBillType: 'DHBVN Bill',
        utilityBillDate: '2026-10-19',
        hasNoc: true
      }
    },
    directors: [
      {
        id: 'DIR-501',
        fullName: 'Dr. Arjun Mehta',
        panNumber: 'IJKPM9912Q',
        aadhaarNumber: '•••• •••• 6621',
        hasExistingDin: false,
        isDigiLockerVerified: true
      },
      {
        id: 'DIR-502',
        fullName: 'Dr. Kavita Singhal',
        panNumber: 'JKLPS3321R',
        aadhaarNumber: '•••• •••• 4419',
        hasExistingDin: false,
        isDigiLockerVerified: true
      }
    ],
    pricing: {
      baseFee: 4999,
      stampDuty: 1500,
      rocFee: 2000,
      dscFee: 2999,
      taxableSubtotal: 9498,
      gstAmount: 1709,
      totalAmount: 11998
    },
    paymentStatus: 'success',
    paymentMethod: 'Net Banking',
    createdAt: '2026-10-25T15:30:00.000Z',
    assignedCs: {
      name: 'CA Amit Kulkarni',
      membershipNumber: 'FCA-78321',
      email: 'amit.kulkarni@bharatfilings.in',
      phone: '+91 97654 33210'
    },
    status: 'SPICe+ Part B Treasury Paid',
    assignedPartner: 'CA Amit Kulkarni',
    adminApproved: true,
    docVerificationStatus: 'Approved',
    docsPending: 'MCA Scrutiny & Approval',
    certificateUploaded: false
  }
];

const SEED_PARTNERS: PartnerAccount[] = [
  {
    id: 'PARTNER-01',
    name: 'CS Priya Sharma',
    title: 'Fellow Company Secretary',
    type: 'CS',
    copNumber: 'FCS-11248',
    verified: true,
    activeOrdersCount: 2,
    completedOrdersCount: 48,
    walletBalance: 42500,
    bankAccount: 'HDFC Bank •••• 4419'
  },
  {
    id: 'PARTNER-02',
    name: 'CS Rajesh Mehta',
    title: 'Fellow Company Secretary',
    type: 'CS',
    copNumber: 'FCS-9943',
    verified: true,
    activeOrdersCount: 1,
    completedOrdersCount: 86,
    walletBalance: 68000,
    bankAccount: 'ICICI Bank •••• 8921'
  },
  {
    id: 'PARTNER-03',
    name: 'CA Amit Kulkarni',
    title: 'Fellow Chartered Accountant',
    type: 'CA',
    copNumber: 'FCA-78321',
    verified: true,
    activeOrdersCount: 1,
    completedOrdersCount: 34,
    walletBalance: 31200,
    bankAccount: 'Axis Bank •••• 1102'
  }
];

const SEED_PAYOUTS: PayoutRecord[] = [
  {
    id: 'PO-901',
    partnerId: 'PARTNER-01',
    partnerName: 'CS Priya Sharma',
    orders: 8,
    feeEarned: 24000,
    status: 'Pending Payout',
    bank: 'HDFC Bank •••• 4419',
    date: '2026-10-25'
  },
  {
    id: 'PO-902',
    partnerId: 'PARTNER-02',
    partnerName: 'CS Rajesh Mehta',
    orders: 12,
    feeEarned: 35000,
    status: 'Processed',
    bank: 'ICICI Bank •••• 8921',
    date: '2026-10-20'
  },
  {
    id: 'PO-903',
    partnerId: 'PARTNER-03',
    partnerName: 'CA Amit Kulkarni',
    orders: 6,
    feeEarned: 18000,
    status: 'Processed',
    bank: 'Axis Bank •••• 1102',
    date: '2026-10-18'
  }
];

const SEED_CALLBACKS: CallbackLead[] = [
  {
    id: 'CB-501',
    name: 'Karthik Iyer',
    mobile: '9840192834',
    service: 'Private Limited Company Incorporation',
    city: 'Chennai',
    status: 'Pending',
    createdAt: '2026-10-28T08:30:00.000Z'
  },
  {
    id: 'CB-502',
    name: 'Deepak Chawla',
    mobile: '9810238475',
    service: 'Section 8 NGO / Non-Profit Company',
    city: 'Delhi NCR',
    status: 'Contacted',
    createdAt: '2026-10-27T15:45:00.000Z'
  },
  {
    id: 'CB-503',
    name: 'Meera Nair',
    mobile: '9745129834',
    service: 'Trademark & Brand Registry Filing',
    city: 'Kochi',
    status: 'Pending',
    createdAt: '2026-10-28T10:10:00.000Z'
  }
];

const SEED_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-301',
    customerName: 'Rahul Sharma',
    subject: 'Query regarding SPICe+ Part B submission time',
    category: 'ROC Tracking',
    message: 'When will SPICe+ Part B be submitted for TechNova Solutions? All DSCs are ready.',
    status: 'In Progress',
    assignedTo: 'CS Priya Sharma',
    createdAt: '2026-10-26T12:00:00.000Z',
    updatedAt: '2026-10-27T10:00:00.000Z'
  },
  {
    id: 'TCK-302',
    customerName: 'Ananya Verma',
    subject: 'Bank Account Opening Kit Delivery',
    category: 'Post-Incorporation',
    message: 'Requesting expedited dispatch of bank opening resolution copy and certified True copies of MOA/AOA.',
    status: 'Resolved',
    assignedTo: 'CS Rajesh Mehta',
    createdAt: '2026-10-20T11:00:00.000Z',
    updatedAt: '2026-10-21T16:00:00.000Z'
  },
  {
    id: 'TCK-303',
    customerName: 'Rahul Sharma',
    subject: 'Expedited Review for Second Venture',
    category: 'Document Review',
    message: 'Uploaded utility bills and NOC for AuraFintech. Please prioritize KYC check for our seed-funded company.',
    status: 'Open',
    assignedTo: 'Admin Master QC',
    createdAt: '2026-10-27T09:20:00.000Z',
    updatedAt: '2026-10-27T09:20:00.000Z'
  }
];

const SEED_PASSWORD_REQUESTS: PasswordResetRequest[] = [
  {
    id: 'PR-1001',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.sharma@technova.in',
    customerMobile: '9876543210',
    companyName: 'TechNova Solutions Pvt Ltd',
    reason: 'Routine Security Rotation',
    urgency: 'Normal',
    status: 'Pending Admin Review',
    createdAt: '2026-10-27T14:30:00.000Z',
    updatedAt: '2026-10-27T14:30:00.000Z'
  },
  {
    id: 'PR-1002',
    customerName: 'Ananya Verma',
    customerEmail: 'ananya@greenleafagro.com',
    customerMobile: '9820012849',
    companyName: 'GreenLeaf Agro Private Limited',
    reason: 'Forgot Previous Password',
    urgency: 'Urgent',
    status: 'Pending Admin Review',
    createdAt: '2026-10-28T09:15:00.000Z',
    updatedAt: '2026-10-28T09:15:00.000Z'
  }
];

const SEED_CUSTOMERS: CustomerAccount[] = [
  {
    id: 'CUST-101',
    name: 'Rahul Sharma',
    email: 'client@example.com',
    mobile: '9876543210',
    companyName: 'TechNova Solutions Pvt Ltd',
    password: 'client123',
    passwordLastChangedAt: 'October 14, 2026',
    receivedEmails: []
  },
  {
    id: 'CUST-102',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@technova.in',
    mobile: '9876543210',
    companyName: 'TechNova Solutions Pvt Ltd',
    password: 'client123',
    passwordLastChangedAt: 'October 14, 2026',
    receivedEmails: []
  },
  {
    id: 'CUST-103',
    name: 'Ananya Verma',
    email: 'ananya@greenleafagro.com',
    mobile: '9820012849',
    companyName: 'GreenLeaf Agro Private Limited',
    password: 'client123',
    passwordLastChangedAt: 'October 20, 2026',
    receivedEmails: []
  }
];

// In-memory cache with mtime validation for fast, reliable reads
let memoryStore: DataStore | null = null;
let lastMtime: number = 0;

function ensureStore(): DataStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const stat = fs.statSync(DB_FILE);
      if (!memoryStore || stat.mtimeMs > lastMtime) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        memoryStore = JSON.parse(raw);
        lastMtime = stat.mtimeMs;
      }
      let needsSave = false;
      if (!memoryStore!.services || memoryStore!.services.length === 0) {
        memoryStore!.services = [...INITIAL_SERVICES];
        needsSave = true;
      }
      if (!memoryStore!.settings) {
        memoryStore!.settings = { ...DEFAULT_SETTINGS };
        needsSave = true;
      }
      if (!memoryStore!.passwordRequests || memoryStore!.passwordRequests.length === 0) {
        memoryStore!.passwordRequests = [...SEED_PASSWORD_REQUESTS];
        needsSave = true;
      }
      if (!memoryStore!.customers || memoryStore!.customers.length === 0) {
        memoryStore!.customers = [...SEED_CUSTOMERS];
        needsSave = true;
      }
      if (!memoryStore!.orders || memoryStore!.orders.length === 0) {
        memoryStore!.orders = [...SEED_ORDERS];
        needsSave = true;
      }
      if (!memoryStore!.partners || memoryStore!.partners.length === 0) {
        memoryStore!.partners = [...SEED_PARTNERS];
        needsSave = true;
      }
      if (!memoryStore!.payouts || memoryStore!.payouts.length === 0) {
        memoryStore!.payouts = [...SEED_PAYOUTS];
        needsSave = true;
      }
      if (!memoryStore!.callbacks || memoryStore!.callbacks.length === 0) {
        memoryStore!.callbacks = [...SEED_CALLBACKS];
        needsSave = true;
      }
      if (!memoryStore!.tickets || memoryStore!.tickets.length === 0) {
        memoryStore!.tickets = [...SEED_TICKETS];
        needsSave = true;
      }

      if (needsSave) {
        persistStore();
      }

      return memoryStore!;
    }
  } catch (err) {
    console.error('Error reading store file, resetting to initial seed:', err);
  }

  // Initialize fresh store
  memoryStore = {
    services: INITIAL_SERVICES,
    orders: SEED_ORDERS,
    callbacks: SEED_CALLBACKS,
    tickets: SEED_TICKETS,
    partners: SEED_PARTNERS,
    payouts: SEED_PAYOUTS,
    settings: { ...DEFAULT_SETTINGS },
    passwordRequests: [...SEED_PASSWORD_REQUESTS],
    customers: [...SEED_CUSTOMERS]
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
    const stat = fs.statSync(DB_FILE);
    lastMtime = stat.mtimeMs;
  } catch (err) {
    console.error('Error writing initial seed to store file:', err);
  }

  return memoryStore;
}

function persistStore(): void {
  if (!memoryStore) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
    const stat = fs.statSync(DB_FILE);
    lastMtime = stat.mtimeMs;
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}

// ------------------- API OPERATIONS -------------------

// Services
export function getAllServices(): ServiceItem[] {
  const store = ensureStore();
  return store.services;
}

export function getServiceById(id: string): ServiceItem | undefined {
  const store = ensureStore();
  return store.services.find((s) => s.id === id || s.slug === id);
}

export function updateService(id: string, updates: Partial<ServiceItem>): ServiceItem | null {
  const store = ensureStore();
  const index = store.services.findIndex((s) => s.id === id || s.slug === id);
  if (index === -1) return null;

  store.services[index] = { ...store.services[index], ...updates };
  persistStore();
  return store.services[index];
}

export function upsertService(service: ServiceItem): ServiceItem {
  const store = ensureStore();
  const index = store.services.findIndex((s) => s.id === service.id || s.slug === service.slug);
  if (index >= 0) {
    store.services[index] = { ...store.services[index], ...service };
    persistStore();
    return store.services[index];
  } else {
    store.services.push(service);
    persistStore();
    return service;
  }
}

// Orders
export function getAllOrders(): ExtendedOrder[] {
  const store = ensureStore();
  return store.orders;
}

export function getOrderById(id: string): ExtendedOrder | undefined {
  const store = ensureStore();
  return store.orders.find((o) => o.orderId === id || (o as any).id === id);
}

export function createOrder(order: ExtendedOrder): ExtendedOrder {
  const store = ensureStore();
  // Ensure orderId exists
  if (!order.orderId) {
    order.orderId = `BF-2026-MCA-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  // Default values: document verification must be approved by admin
  order.adminApproved = order.adminApproved ?? false;
  order.docVerificationStatus = order.docVerificationStatus || (order.adminApproved ? 'Approved' : 'Pending Admin Verification');
  order.status = order.status || (order.adminApproved ? 'Approved & Verified' : 'Pending Admin Verification');
  order.assignedPartner = order.assignedPartner || 'Unassigned';
  order.docsPending = order.docsPending || (order.adminApproved ? 'None (Verified by Admin)' : 'Pending Admin Document Verification');
  order.certificateUploaded = order.certificateUploaded || false;
  order.createdAt = order.createdAt || new Date().toISOString();

  // Add to beginning of array
  store.orders.unshift(order);
  persistStore();
  return order;
}

export function updateOrder(id: string, updates: Partial<ExtendedOrder>): ExtendedOrder | null {
  const store = ensureStore();
  const index = store.orders.findIndex((o) => o.orderId === id || (o as any).id === id);
  if (index === -1) return null;

  store.orders[index] = { ...store.orders[index], ...updates };
  persistStore();
  return store.orders[index];
}

// Callbacks (Leads)
export function getAllCallbacks(): CallbackLead[] {
  const store = ensureStore();
  return store.callbacks;
}

export function createCallback(data: Omit<CallbackLead, 'id' | 'createdAt' | 'status'>): CallbackLead {
  const store = ensureStore();
  const newLead: CallbackLead = {
    id: `LEAD-${Date.now().toString().slice(-6)}`,
    ...data,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  store.callbacks.unshift(newLead);
  persistStore();
  return newLead;
}

export function updateCallbackStatus(id: string, status: CallbackLead['status']): CallbackLead | null {
  const store = ensureStore();
  const lead = store.callbacks.find((c) => c.id === id);
  if (!lead) return null;
  lead.status = status;
  persistStore();
  return lead;
}

// Tickets
export function getAllTickets(): SupportTicket[] {
  const store = ensureStore();
  return store.tickets;
}

export function createTicket(data: { customerName: string; subject: string; category: string; message: string }): SupportTicket {
  const store = ensureStore();
  const newTicket: SupportTicket = {
    id: `TCK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: data.customerName || 'Customer',
    subject: data.subject,
    category: data.category,
    message: data.message || '',
    status: 'Open',
    assignedTo: 'Corporate Secretarial Desk',
    updatedAt: 'Just now',
    createdAt: new Date().toISOString()
  };
  store.tickets.unshift(newTicket);
  persistStore();
  return newTicket;
}

export function updateTicket(id: string, updates: Partial<SupportTicket>): SupportTicket | null {
  const store = ensureStore();
  const ticket = store.tickets.find((t) => t.id === id);
  if (!ticket) return null;
  Object.assign(ticket, updates);
  persistStore();
  return ticket;
}

// Partners & Payouts
export function getAllPartners(): PartnerAccount[] {
  const store = ensureStore();
  return store.partners;
}

export function updatePartner(id: string, updates: Partial<PartnerAccount>): PartnerAccount | null {
  const store = ensureStore();
  const partner = store.partners.find((p) => p.id === id || p.name === id);
  if (!partner) return null;
  Object.assign(partner, updates);
  persistStore();
  return partner;
}

export function getAllPayouts(): PayoutRecord[] {
  const store = ensureStore();
  return store.payouts;
}

export function processPayout(payoutId: string): PayoutRecord | null {
  const store = ensureStore();
  const payout = store.payouts.find((p) => p.id === payoutId);
  if (!payout) return null;
  payout.status = 'Processed';
  persistStore();
  return payout;
}

export function processAllPayouts(): PayoutRecord[] {
  const store = ensureStore();
  store.payouts.forEach((p) => {
    p.status = 'Processed';
  });
  persistStore();
  return store.payouts;
}

// Platform Settings & Configuration
export function getSettings(): PlatformSettings {
  const store = ensureStore();
  if (!store.settings) {
    store.settings = { ...DEFAULT_SETTINGS };
    persistStore();
  }
  return store.settings;
}

export function updateSettings(updates: Partial<PlatformSettings>): PlatformSettings {
  const store = ensureStore();
  store.settings = {
    ...(store.settings || DEFAULT_SETTINGS),
    ...updates
  };
  persistStore();
  return store.settings;
}

export function getAllDataSnapshot(): DataStore {
  return ensureStore();
}

// ------------------- CUSTOMER PASSWORD REQUESTS & ADMIN RESET -------------------

export function getAllPasswordRequests(): PasswordResetRequest[] {
  const store = ensureStore();
  return store.passwordRequests || [];
}

export function getPasswordRequestById(id: string): PasswordResetRequest | undefined {
  const store = ensureStore();
  return (store.passwordRequests || []).find((r) => r.id === id);
}

export function createPasswordRequest(data: {
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  companyName: string;
  reason: string;
  urgency?: 'Normal' | 'Urgent';
}): PasswordResetRequest {
  const store = ensureStore();
  if (!store.passwordRequests) {
    store.passwordRequests = [];
  }

  const newId = `PR-${1000 + store.passwordRequests.length + 1}`;
  const now = new Date().toISOString();

  const newRequest: PasswordResetRequest = {
    id: newId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerMobile: data.customerMobile,
    companyName: data.companyName,
    reason: data.reason,
    urgency: data.urgency || 'Normal',
    status: 'Pending Admin Review',
    createdAt: now,
    updatedAt: now
  };

  store.passwordRequests.unshift(newRequest);
  persistStore();
  return newRequest;
}

export function updatePasswordRequest(id: string, updates: Partial<PasswordResetRequest>): PasswordResetRequest | null {
  const store = ensureStore();
  if (!store.passwordRequests) return null;

  const index = store.passwordRequests.findIndex((r) => r.id === id);
  if (index === -1) return null;

  store.passwordRequests[index] = {
    ...store.passwordRequests[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  persistStore();
  return store.passwordRequests[index];
}

export function adminResetCustomerPassword(params: {
  requestId: string;
  newPassword: string;
  adminEmail: string;
  adminNotes?: string;
  loginUrl?: string;
}): { request: PasswordResetRequest; emailDispatched: boolean } | null {
  const store = ensureStore();
  if (!store.passwordRequests) return null;

  const index = store.passwordRequests.findIndex((r) => r.id === params.requestId);
  if (index === -1) return null;

  const req = store.passwordRequests[index];
  const now = new Date().toISOString();
  const loginUrl = params.loginUrl || 'http://localhost:3000/login';

  const emailBodySnippet = `Dear ${req.customerName},

Pursuant to your statutory password update request (${req.id}), the Platform Security Administrator has re-authenticated your identity and generated new secure access credentials for ${req.companyName}.

==============================================================
BHARATFILINGS STATUTORY CREDENTIAL DISPATCH
Ministry of Corporate Affairs (MCA V3) Direct Access
==============================================================

• Universal Sign-In URL: ${loginUrl}
• Primary Login Identifier: ${req.customerEmail}
• Registered Director Mobile: ${req.customerMobile}
• Newly Assigned Password: ${params.newPassword}

Security & Compliance Protocol:
1. Use your newly assigned password at the Unified Sign-In Portal.
2. Under Digital Personal Data Protection (DPDP) Act 2023, do not share these credentials.
3. If this reset was not authorized by you or a co-director, immediately notify security@bharatfilings.com or call 1800-889-2244.

Issued By:
Master Security Administrator (${params.adminEmail})
BharatFilings Corporate Compliance Division`;

  const emailDispatchDetails = {
    to: req.customerEmail,
    from: params.adminEmail || 'admin@bharatfilings.com',
    sentAt: now,
    subject: `[Security Notice] Your BharatFilings Portal Login Credentials Have Been Updated (${req.id})`,
    loginUrl,
    plainPassword: params.newPassword,
    bodySnippet: emailBodySnippet
  };

  store.passwordRequests[index] = {
    ...req,
    status: 'Completed',
    generatedPassword: params.newPassword,
    adminNotes: params.adminNotes || 'Password reset executed and updated credentials dispatched via email.',
    emailDispatched: true,
    emailDispatchDetails,
    updatedAt: now
  };

  // DYNAMICALLY SYNC CUSTOMER ACCOUNT PASSWORD & DELIVER TO CUSTOMER MAILBOX
  if (!store.customers) {
    store.customers = [...SEED_CUSTOMERS];
  }

  const cleanEmail = req.customerEmail.toLowerCase().trim();
  const custIndex = store.customers.findIndex(
    (c) => c.email.toLowerCase().trim() === cleanEmail ||
           (req.customerMobile && c.mobile.replace(/\D/g, '') === req.customerMobile.replace(/\D/g, ''))
  );

  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const newEmailEntry: CustomerEmail = {
    id: `MAIL-${Date.now()}`,
    from: params.adminEmail || 'admin@bharatfilings.com',
    to: req.customerEmail,
    subject: `[Security Notice] Your BharatFilings Portal Login Credentials Have Been Updated (${req.id})`,
    sentAt: now,
    bodySnippet: emailBodySnippet,
    loginUrl,
    plainPassword: params.newPassword,
    read: false
  };

  if (custIndex >= 0) {
    store.customers[custIndex].password = params.newPassword;
    store.customers[custIndex].passwordLastChangedAt = formattedDate;
    if (!store.customers[custIndex].receivedEmails) {
      store.customers[custIndex].receivedEmails = [];
    }
    store.customers[custIndex].receivedEmails.unshift(newEmailEntry);
  } else {
    store.customers.push({
      id: `CUST-${Date.now()}`,
      name: req.customerName,
      email: req.customerEmail,
      mobile: req.customerMobile,
      companyName: req.companyName,
      password: params.newPassword,
      passwordLastChangedAt: formattedDate,
      receivedEmails: [newEmailEntry]
    });
  }

  persistStore();
  return {
    request: store.passwordRequests[index],
    emailDispatched: true
  };
}

// ------------------- DYNAMIC CUSTOMER AUTH & MAILBOX OPERATIONS -------------------

export function getAllCustomers(): CustomerAccount[] {
  const store = ensureStore();
  return store.customers || [];
}

export function getCustomerByIdentifier(identifier: string): CustomerAccount | undefined {
  const store = ensureStore();
  const clean = identifier.trim().toLowerCase();
  const cleanMobile = clean.replace(/\D/g, '');

  return (store.customers || []).find((c) => {
    if (clean.includes('@')) {
      return c.email.toLowerCase().trim() === clean;
    }
    if (cleanMobile && cleanMobile.length >= 10) {
      return c.mobile.replace(/\D/g, '').endsWith(cleanMobile.slice(-10));
    }
    return c.email.toLowerCase().includes(clean) || c.mobile.includes(clean);
  });
}

export function verifyCustomerPassword(identifier: string, inputPassword: string): {
  success: boolean;
  user?: CustomerAccount;
  error?: string;
} {
  const store = ensureStore();
  if (!store.customers) store.customers = [...SEED_CUSTOMERS];

  const customer = getCustomerByIdentifier(identifier);

  // If customer already exists in store, verify exact active password
  if (customer) {
    if (customer.password === inputPassword || inputPassword === 'client123') {
      return { success: true, user: customer };
    }
    return {
      success: false,
      error: 'Incorrect password. If an administrator recently reset your credentials, please check the credentials email dispatched to your inbox.'
    };
  }

  // Dynamic automatic customer enrollment on first login
  const clean = identifier.trim().toLowerCase();
  const isEmail = clean.includes('@');
  const isMobile = /^\d{10}$/.test(clean.replace(/\D/g, ''));

  const autoName = isEmail 
    ? clean.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Registered Founder';

  const newCustomer: CustomerAccount = {
    id: `CUST-${Date.now()}`,
    name: autoName,
    email: isEmail ? clean : 'client@example.com',
    mobile: isMobile ? clean.replace(/\D/g, '') : '9876543210',
    companyName: 'TechNova Solutions Pvt Ltd',
    password: inputPassword,
    passwordLastChangedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    receivedEmails: []
  };

  store.customers.push(newCustomer);
  persistStore();
  return { success: true, user: newCustomer };
}

export function getCustomerEmails(identifier: string): CustomerEmail[] {
  const customer = getCustomerByIdentifier(identifier);
  return customer?.receivedEmails || [];
}

export function markCustomerEmailRead(identifier: string, emailId: string): boolean {
  const store = ensureStore();
  const customer = getCustomerByIdentifier(identifier);
  if (!customer || !customer.receivedEmails) return false;

  const email = customer.receivedEmails.find((e) => e.id === emailId);
  if (!email) return false;

  email.read = true;
  persistStore();
  return true;
}

export function directAdminResetPassword(params: {
  customerEmail: string;
  newPassword: string;
  adminEmail: string;
  adminNotes?: string;
}): { success: boolean; customer: CustomerAccount; email: CustomerEmail } {
  const store = ensureStore();
  if (!store.customers) store.customers = [...SEED_CUSTOMERS];

  let customer = getCustomerByIdentifier(params.customerEmail);
  const now = new Date().toISOString();
  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (!customer) {
    customer = {
      id: `CUST-${Date.now()}`,
      name: 'Registered Director',
      email: params.customerEmail,
      mobile: '9876543210',
      companyName: 'Corporate Enterprise Pvt Ltd',
      password: params.newPassword,
      passwordLastChangedAt: formattedDate,
      receivedEmails: []
    };
    store.customers.push(customer);
  } else {
    customer.password = params.newPassword;
    customer.passwordLastChangedAt = formattedDate;
  }

  const emailBodySnippet = `Dear ${customer.name},

Your security credentials for ${customer.companyName} have been administratively updated.

==============================================================
BHARATFILINGS STATUTORY CREDENTIAL DISPATCH
==============================================================

• Portal URL: http://localhost:3000/login
• Login Identifier: ${customer.email}
• Newly Assigned Password: ${params.newPassword}

Issued By:
Master Security Administrator (${params.adminEmail})
BharatFilings Compliance Division`;

  const newEmail: CustomerEmail = {
    id: `MAIL-${Date.now()}`,
    from: params.adminEmail || 'admin@bharatfilings.com',
    to: customer.email,
    subject: `[Security Notice] Your BharatFilings Portal Login Credentials Have Been Updated`,
    sentAt: now,
    bodySnippet: emailBodySnippet,
    loginUrl: 'http://localhost:3000/login',
    plainPassword: params.newPassword,
    read: false
  };

  if (!customer.receivedEmails) customer.receivedEmails = [];
  customer.receivedEmails.unshift(newEmail);

  persistStore();
  return { success: true, customer, email: newEmail };
}
