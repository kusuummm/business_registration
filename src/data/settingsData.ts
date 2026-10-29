export interface PlatformSettings {
  // General & Business Profile
  companyLegalName: string;
  cin: string;
  gstin: string;
  pan: string;
  tan: string;
  registeredAddress: string;
  supportPhone: string;
  supportEmail: string;
  whatsappSupportNumber: string;
  invoicePrefix: string;
  financialYear: string;
  timezone: string;
  currency: string;

  // Document QC & Verification Rules
  mandatoryAdminVerification: boolean;
  autoAssignCounsel: boolean;
  maxUtilityBillAgeDays: number;
  digilockerAutoValidation: boolean;
  flagRegulatedNames: boolean;
  preventDuplicateKyc: boolean;

  // Government & API Gateways
  mcaGatewayEndpoint: string;
  mcaEnvironment: 'production' | 'sandbox';
  mcaPollingIntervalMinutes: number;
  esignProvider: 'Protean (NSDL)' | 'eMudhra' | 'C-DAC';
  digilockerClientId: string;
  digilockerClientSecret: string;

  // Payment & Escrow Settlement
  razorpayKeyId: string;
  razorpayKeySecret: string;
  autoDisburseOnCoi: boolean;
  escrowHoldbackHours: number;
  minSettlementAmount: number;

  // Notifications & Webhooks
  whatsappNotificationsEnabled: boolean;
  whatsappApiToken: string;
  smsNotificationsEnabled: boolean;
  smsSenderId: string;
  emailSmtpHost: string;
  emailSmtpPort: number;
  emailSenderAddress: string;
  slackWebhookUrl: string;

  // Security & DPDP Compliance
  retentionDays: number;
  twoFactorAuth: boolean;
  dataLocalisationIndiaOnly: boolean;
  sessionTimeoutMinutes: number;
  maintenanceMode: boolean;
  maintenanceNotice: string;
}

export const DEFAULT_SETTINGS: PlatformSettings = {
  // General
  companyLegalName: 'Corporate LegalTech Services Private Limited',
  cin: 'U74999MH2026PTC394821',
  gstin: '27AAACB2026P1Z5',
  pan: 'AAACB2026P',
  tan: 'MUMB19482C',
  registeredAddress: 'Floor 14, Maker Chambers V, Nariman Point, Mumbai, Maharashtra - 400021',
  supportPhone: '+91 8000 123 456',
  supportEmail: 'support@complianceportal.in',
  whatsappSupportNumber: '+91 98200 12345',
  invoicePrefix: 'INV-2026-MCA-',
  financialYear: '2026-27',
  timezone: 'Asia/Kolkata (IST)',
  currency: 'INR (₹)',

  // Document QC & Verification
  mandatoryAdminVerification: true,
  autoAssignCounsel: true,
  maxUtilityBillAgeDays: 60,
  digilockerAutoValidation: true,
  flagRegulatedNames: true,
  preventDuplicateKyc: true,

  // Gateways
  mcaGatewayEndpoint: 'https://mca.gov.in/mcafiling/v3/api',
  mcaEnvironment: 'production',
  mcaPollingIntervalMinutes: 5,
  esignProvider: 'Protean (NSDL)',
  digilockerClientId: 'dl_live_bharatfilings_b2b',
  digilockerClientSecret: '••••••••••••••••••••••••',

  // Payment
  razorpayKeyId: 'rzp_live_sec_89201948201',
  razorpayKeySecret: '••••••••••••••••••••••••',
  autoDisburseOnCoi: true,
  escrowHoldbackHours: 0,
  minSettlementAmount: 1000,

  // Notifications
  whatsappNotificationsEnabled: true,
  whatsappApiToken: '••••••••••••••••••••••••',
  smsNotificationsEnabled: true,
  smsSenderId: 'BHRTFL',
  emailSmtpHost: 'smtp.sendgrid.net',
  emailSmtpPort: 587,
  emailSenderAddress: 'filings@complianceportal.in',
  slackWebhookUrl: '',

  // Security & DPDP
  retentionDays: 365,
  twoFactorAuth: true,
  dataLocalisationIndiaOnly: true,
  sessionTimeoutMinutes: 30,
  maintenanceMode: false,
  maintenanceNotice: 'The corporate filing desk is currently undergoing scheduled Ministry ROC synchronization. All ongoing filings are safe.'
};
