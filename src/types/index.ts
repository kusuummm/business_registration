export interface CustomerAuth {
  mobile: string;
  email: string;
  isVerified: boolean;
  name?: string;
}

export interface DirectorKYC {
  id: string;
  fullName: string;
  panNumber: string;
  aadhaarNumber: string; // Stored masked or raw, displayed masked
  hasExistingDin: boolean;
  dinNumber?: string;
  isDigiLockerVerified: boolean;
  panDocName?: string;
  panDocSize?: string;
  aadhaarDocName?: string;
  aadhaarDocSize?: string;
}

export interface CompanyDetails {
  entityType: string; // 'pvt_ltd' | 'opc' | 'llp'
  stateCode: string;
  authorizedCapital: number;
  directorCount: number;
  primaryName: string;
  secondaryName: string;
  industry: string;
  officeAddress: {
    line1: string;
    city: string;
    pincode: string;
    utilityBillType: string;
    utilityBillDate: string;
    utilityBillDocName?: string;
    hasNoc: boolean;
  };
}

export interface PricingBreakdown {
  baseFee: number;
  stampDuty: number;
  rocFee: number;
  dscFee: number;
  taxableSubtotal: number;
  gstAmount: number;
  totalAmount: number;
}

export interface RegistrationOrder {
  orderId: string;
  auth: CustomerAuth;
  company: CompanyDetails;
  directors: DirectorKYC[];
  pricing: PricingBreakdown;
  paymentStatus: 'pending' | 'success' | 'failed';
  paymentMethod?: string;
  paymentTransactionId?: string;
  createdAt: string;
  assignedCs: {
    name: string;
    membershipNumber: string;
    email: string;
    phone: string;
  };
  adminApproved?: boolean;
  docVerificationStatus?: 'Pending Admin Verification' | 'Approved' | 'Rejected';
  adminApprovedAt?: string;
  adminApprovedBy?: string;
  adminNotes?: string;
  docsPending?: string;
  status?: string;
  certificateUploaded?: boolean;
  assignedPartner?: string;
}
