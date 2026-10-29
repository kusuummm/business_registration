export { STATE_STAMP_DUTY } from './pricingData';

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  shortDesc: string;
  fullDesc: string;
  baseFee: number;
  govFee: number;
  caFee: number;
  dscFee: number;
  gstRate: number;
  slaDays: string;
  isActive: boolean;
  badge?: string;
  inclusions: string[];
  exclusions: string[];
  requiredDocuments: string[];
  faqs: { q: string; a: string }[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  serviceCount: number;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'incorporation',
    name: 'Company & LLP Incorporation',
    iconName: 'Building2',
    description: 'Private Limited, OPC, LLP, Public Limited & Section 8 corporate registration.',
    serviceCount: 5
  },
  {
    id: 'proprietorship',
    name: 'Proprietorship & Partnerships',
    iconName: 'Users',
    description: 'Sole Proprietorship, Partnership Firm deed registration & notarization.',
    serviceCount: 3
  },
  {
    id: 'ngo',
    name: 'NGO, Trust & Society',
    iconName: 'HeartHandshake',
    description: 'Section 8 companies, 12A & 80G tax exemptions, FCRA & Society registration.',
    serviceCount: 4
  },
  {
    id: 'tax_registrations',
    name: 'GST, PAN, MSME & IEC',
    iconName: 'Receipt',
    description: 'Statutory government tax identifiers, Udyam MSME, and Import-Export Code.',
    serviceCount: 6
  },
  {
    id: 'digital_signatures',
    name: 'DSC & Digital Signatures',
    iconName: 'KeyRound',
    description: 'Class-3 USB cryptographic hardware tokens (ProxKey / ePass2003) for MCA, e-Tenders.',
    serviceCount: 2
  },
  {
    id: 'ipr_licensing',
    name: 'Trademark, IP & Licenses',
    iconName: 'ShieldAlert',
    description: 'Trademark search, TM filing, Copyright, FSSAI Food License, Shop & Establishment.',
    serviceCount: 5
  },
  {
    id: 'accounting_tax',
    name: 'Accounting, ITR & Payroll',
    iconName: 'Calculator',
    description: 'Monthly bookkeeping, Corporate ITR, TDS filings, and employee payroll compliance.',
    serviceCount: 4
  },
  {
    id: 'annual_compliance',
    name: 'Annual ROC Compliance',
    iconName: 'CalendarCheck',
    description: 'AOC-4, MGT-7, DIR-3 KYC, Statutory Audit assistance, and Secretarial records.',
    serviceCount: 4
  },
  {
    id: 'business_legal',
    name: 'Legal Agreements & Advisory',
    iconName: 'FileCheck2',
    description: 'Founders Agreement, NDA, Terms of Service, POSH policy, and ESOP schemes.',
    serviceCount: 4
  },
  {
    id: 'consultancy',
    name: 'Startup Advisory & Consulting',
    iconName: 'Sparkles',
    description: 'Virtual CFO, DPIIT Startup India recognition, fundraising due diligence.',
    serviceCount: 3
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-pvt-ltd',
    slug: 'private-limited-company',
    name: 'Private Limited Company Registration',
    category: 'incorporation',
    categoryName: 'Company & LLP Incorporation',
    shortDesc: 'The gold standard corporate structure for tech startups, scalable businesses, and fundraising.',
    fullDesc: 'Incorporate your Private Limited company under the Companies Act, 2013 with complete SPICe+ Part A & B filings, DSC Class-3 tokens, MOA/AOA drafting, Certificate of Incorporation (COI), PAN, TAN, and EPFO/ESIC bank account opening.',
    baseFee: 2499,
    govFee: 1000, // Stamp duty MH baseline
    caFee: 1500,
    dscFee: 1200,
    gstRate: 0.18,
    slaDays: '4-6 Working Days',
    isActive: true,
    badge: 'Most Popular',
    inclusions: [
      'SPICe+ Part A Name Reservation (2 choices)',
      '2 Class-3 Digital Signature Certificates (DSC USB Tokens)',
      'Drafting of Memorandum (MOA) and Articles of Association (AOA)',
      'Govt ROC SPICe+ Part B Incorporation Filing',
      'Certificate of Incorporation (COI) with CIN number',
      'Corporate PAN and TAN allotment',
      'Zero-balance Current Bank Account opening assistance',
      'PF, ESI and Professional Tax registration numbers'
    ],
    exclusions: [
      'Authorized Capital above ₹15 Lakhs (Statutory MCA ROC fee applies)',
      'Foreign Director apostille/embassy legalization charges',
      'Physical office commercial lease registration'
    ],
    requiredDocuments: [
      'PAN Card copy of all Directors & Shareholders',
      'Identity Proof (Aadhaar Card, Passport, or Voter ID)',
      'Address Proof (Bank statement or Electricity bill < 60 days)',
      'Registered Office proof (Electricity / Water / Gas bill < 60 days)',
      'No Objection Certificate (NOC) from Property Owner',
      'Passport size photographs of all directors'
    ],
    faqs: [
      {
        q: 'What is the minimum capital required to register a Private Limited company?',
        a: 'There is zero minimum paid-up capital requirement under the Companies Act. You can start with as little as ₹1,000 or the standard ₹1,00,000 authorized capital.'
      },
      {
        q: 'Can a residential address be used as the registered office?',
        a: 'Yes, Indian corporate law allows your residential or rented home to be registered as the official corporate office as long as you provide a utility bill and landlord NOC.'
      },
      {
        q: 'Why does BharatFilings separate Government Stamp Duty from the professional fee?',
        a: 'State stamp duty varies between ₹860 (Delhi) to ₹10,000 (Punjab). We practice radical transparency so you only pay the exact statutory government fee with zero markups or GST on sovereign taxes.'
      }
    ]
  },
  {
    id: 'srv-opc',
    slug: 'one-person-company',
    name: 'One Person Company (OPC)',
    category: 'incorporation',
    categoryName: 'Company & LLP Incorporation',
    shortDesc: 'Corporate status for solo founders with 100% control and limited liability protection.',
    fullDesc: 'Start your single-founder enterprise with all corporate privileges. Enjoy limited liability, separate legal entity status, and seamless conversion into a Private Limited company as your business expands.',
    baseFee: 2199,
    govFee: 1000,
    caFee: 1200,
    dscFee: 600,
    gstRate: 0.18,
    slaDays: '4-5 Working Days',
    isActive: true,
    badge: 'Solo Founder',
    inclusions: [
      'Name Reservation on MCA CRC Portal',
      '1 Class-3 Digital Signature Certificate (DSC)',
      'Nominee Consent Drafting (INC-3 form)',
      'MOA and AOA drafting for single director',
      'COI, PAN, TAN and Bank Account assistance'
    ],
    exclusions: [
      'Foreign national as sole member (Only Indian resident allowed for OPC)'
    ],
    requiredDocuments: [
      'PAN Card and Aadhaar Card of Sole Director and Nominee',
      'Bank statement or utility bill of Director (< 60 days old)',
      'Registered office utility bill and NOC'
    ],
    faqs: [
      {
        q: 'Can an OPC have employees?',
        a: 'Yes, an OPC can employ unlimited staff and contractors; only ownership is held by 1 director.'
      }
    ]
  },
  {
    id: 'srv-llp',
    slug: 'limited-liability-partnership',
    name: 'Limited Liability Partnership (LLP)',
    category: 'incorporation',
    categoryName: 'Company & LLP Incorporation',
    shortDesc: 'Ideal for consulting practices, law firms, and bootstrapped businesses with zero audit mandate up to 40L turnover.',
    fullDesc: 'Combine the operational flexibility of a traditional partnership with limited liability protection. No mandatory statutory audit required unless turnover exceeds ₹40 Lakhs or capital contribution exceeds ₹25 Lakhs.',
    baseFee: 1999,
    govFee: 1500,
    caFee: 1000,
    dscFee: 1200,
    gstRate: 0.18,
    slaDays: '5-7 Working Days',
    isActive: true,
    badge: 'Low Compliance',
    inclusions: [
      'RUN-LLP Name Approval filing',
      '2 Designated Partner DSC Class-3 tokens',
      'FiLLiP Incorporation Form filing on MCA V3',
      'LLP Agreement drafting & Form 3 filing',
      'Certificate of Incorporation, PAN & TAN'
    ],
    exclusions: [
      'State Stamp Duty on LLP Agreement (varies by capital)'
    ],
    requiredDocuments: [
      'PAN Card and Aadhaar of at least 2 Partners',
      'Address proof of partners and registered office premises'
    ],
    faqs: [
      {
        q: 'Is audit mandatory for LLP every year?',
        a: 'No. LLPs are exempt from statutory audit if annual turnover is below ₹40 Lakhs and capital contribution is below ₹25 Lakhs.'
      }
    ]
  },
  {
    id: 'srv-gst-reg',
    slug: 'gst-registration',
    name: 'New GST Registration',
    category: 'tax_registrations',
    categoryName: 'GST, PAN, MSME & IEC',
    shortDesc: 'Mandatory Goods & Services Tax identification number (GSTIN) with Aadhaar authentication.',
    fullDesc: 'Get your 15-digit GSTIN within 3 to 7 working days. Comprehensive filing covering business activity HSN/SAC codes, state jurisdiction, bank account addition, and biometric/Aadhaar OTP authentication.',
    baseFee: 999,
    govFee: 0,
    caFee: 500,
    dscFee: 0,
    gstRate: 0.18,
    slaDays: '3-5 Working Days',
    isActive: true,
    badge: 'Essential',
    inclusions: [
      'Jurisdiction & HSN/SAC classification analysis',
      'GST REG-01 application filing on GSTN Portal',
      'Aadhaar e-KYC OTP authentication coordination',
      'Clarification drafting if tax officer issues REG-03 query',
      'Final GST Certificate (REG-06) download'
    ],
    exclusions: [
      'Physical premises verification if flagged by department'
    ],
    requiredDocuments: [
      'PAN Card of Business / Proprietor / Partners',
      'Aadhaar Card with linked mobile number',
      'Premises proof (Electricity bill + Rent Agreement/NOC)',
      'Cancelled cheque or bank account statement'
    ],
    faqs: [
      {
        q: 'When is GST registration mandatory?',
        a: 'Mandatory if turnover exceeds ₹40 Lakhs (goods) or ₹20 Lakhs (services), or for any interstate sales and e-commerce selling.'
      }
    ]
  },
  {
    id: 'srv-trademark',
    slug: 'trademark-registration',
    name: 'Trademark (TM) Application Filing',
    category: 'ipr_licensing',
    categoryName: 'Trademark, IP & Licenses',
    shortDesc: 'Protect your brand name, logo, and slogan under the Trade Marks Act, 1999.',
    fullDesc: 'Secure national intellectual property rights over your brand name, logo, or tagline. Includes deep phonetic search across Class 1 to 45, TM-A application filing with IP India, and issuance of immediate ™ symbol usage rights.',
    baseFee: 1499,
    govFee: 4500, // MSME/Individual Govt fee (₹9000 for Non-MSME)
    caFee: 1000,
    dscFee: 0,
    gstRate: 0.18,
    slaDays: '24 Hours Filing (TM Symbol)',
    isActive: true,
    badge: 'Brand Protection',
    inclusions: [
      'Comprehensive Public Trademark Search in NICE Classification',
      'Form TM-A drafting and filing on IP India portal',
      'Immediate legal right to use ™ symbol',
      'Power of Attorney drafting (Form 48)',
      'Filing receipt and application number'
    ],
    exclusions: [
      'Hearing representation or examination reply (if objected)'
    ],
    requiredDocuments: [
      'Brand Name / Logo artwork in high resolution',
      'Identity & Address proof of applicant',
      'Udyam Registration Certificate (for 50% govt fee concession)',
      'Signed Power of Attorney'
    ],
    faqs: [
      {
        q: 'How fast can I start using the ™ mark?',
        a: 'Within 24 hours of filing Form TM-A, you receive official acknowledgement and can legally use the ™ symbol.'
      }
    ]
  },
  {
    id: 'srv-udyam',
    slug: 'udyam-msme-registration',
    name: 'Udyam MSME Registration',
    category: 'tax_registrations',
    categoryName: 'GST, PAN, MSME & IEC',
    shortDesc: 'Official MSME recognition for government subsidies, collateral-free bank loans & 50% trademark fee discount.',
    fullDesc: 'Obtain lifetime valid Udyam Registration Certificate from the Ministry of MSME. Unlocks priority sector bank lending, 45-day payment protection under MSMED Act, and international trade fair subsidies.',
    baseFee: 499,
    govFee: 0,
    caFee: 200,
    dscFee: 0,
    gstRate: 0.18,
    slaDays: '24 Hours',
    isActive: true,
    inclusions: [
      'NIC Code mapping for business activities',
      'Direct filing on official Udyam Portal',
      'Instant Udyam Registration Certificate with QR Code'
    ],
    exclusions: [],
    requiredDocuments: [
      'Aadhaar Number of Entrepreneur linked with mobile',
      'PAN Card of Business / Proprietor',
      'Bank Account details (Account No. & IFSC)'
    ],
    faqs: [
      {
        q: 'Does Udyam registration have an expiry date?',
        a: 'No, Udyam certificate has lifetime validity with zero renewal fee.'
      }
    ]
  },
  {
    id: 'srv-annual-filing',
    slug: 'annual-roc-filing-compliance',
    name: 'Annual ROC Compliance & Financials',
    category: 'annual_compliance',
    categoryName: 'Annual ROC Compliance',
    shortDesc: 'Mandatory annual MCA filing: AOC-4 (Financials), MGT-7 (Annual Return) & DIR-3 KYC.',
    fullDesc: 'Fulfill all statutory compliance mandates under the Companies Act, 2013 to avoid ₹100/day penal MCA late fees. Handled end-to-end by practicing Company Secretaries and Chartered Accountants.',
    baseFee: 3999,
    govFee: 1200,
    caFee: 2000,
    dscFee: 0,
    gstRate: 0.18,
    slaDays: '7-10 Working Days',
    isActive: true,
    badge: 'Mandatory',
    inclusions: [
      'Preparation of Balance Sheet and Profit & Loss accounts',
      'Filing of Form AOC-4 (Financial Statements)',
      'Filing of Form MGT-7 / MGT-7A (Annual Return)',
      'Director DIR-3 KYC Web/e-Form filing',
      'Statutory Secretarial registers maintenance'
    ],
    exclusions: [
      'Statutory Audit fees if done by third-party CA firm'
    ],
    requiredDocuments: [
      'Bank statements for entire financial year',
      'Purchase and Sale invoices / Ledger summaries',
      'Valid DSC tokens of at least 1 Director'
    ],
    faqs: [
      {
        q: 'What is the penalty for not filing annual returns?',
        a: 'The MCA levies a statutory penalty of ₹100 per day per form with no upper cap until filed, risking director disqualification.'
      }
    ]
  },
  {
    id: 'srv-dsc-token',
    slug: 'class-3-digital-signature',
    name: 'Class-3 Digital Signature Certificate (DSC)',
    category: 'digital_signatures',
    categoryName: 'DSC & Digital Signatures',
    shortDesc: 'CCA certified Class-3 cryptographic USB hardware token with 2-year validity.',
    fullDesc: 'Get a FIPS-certified USB cryptographic token (ProxKey or ePass2003) loaded with CCA-approved Class-3 Signing Certificate. Mandatory for MCA V3, Income Tax, GST, EPFO, and e-Tendering portals.',
    baseFee: 899,
    govFee: 0,
    caFee: 200,
    dscFee: 600,
    gstRate: 0.18,
    slaDays: '4 Hours (Video KYC)',
    isActive: true,
    inclusions: [
      'Class-3 Signing Certificate with 2-Year Validity',
      'FIPS-Compliant USB Cryptographic Hardware Token',
      '2-Minute paperless Video KYC link',
      'Token courier delivery across India'
    ],
    exclusions: [],
    requiredDocuments: [
      'PAN Card & Aadhaar Card of applicant',
      'Mobile number linked to Aadhaar'
    ],
    faqs: [
      {
        q: 'Can I sign documents from my mobile phone with this DSC?',
        a: 'The cryptographic token is a USB hardware key designed for laptops/desktops with Windows/Mac drivers for maximum security.'
      }
    ]
  },
  {
    id: 'srv-fssai',
    slug: 'fssai-food-license',
    name: 'FSSAI Food Business License & Registration',
    category: 'ipr_licensing',
    categoryName: 'Trademark, IP & Licenses',
    shortDesc: 'Mandatory 14-digit food safety license for restaurants, cloud kitchens, manufacturers & D2C food brands.',
    fullDesc: 'Obtain your 14-digit FSSAI Registration or State License under the Food Safety and Standards Act, 2006. Mandatory for all food businesses, cloud kitchens, caterers, e-commerce food vendors (Zomato/Swiggy), and grocery retailers.',
    baseFee: 1499,
    govFee: 100, // Basic annual registration fee
    caFee: 500,
    dscFee: 0,
    gstRate: 0.18,
    slaDays: '3-5 Working Days',
    isActive: true,
    badge: 'Food Safety',
    inclusions: [
      'Eligibility analysis (Basic Registration vs State License)',
      'Form A / Form B application preparation on FoSCoS portal',
      'Food category mapping and hygiene affidavit drafting',
      'FoSCoS government filing and scrutiny clearance',
      '14-digit FSSAI Certificate download'
    ],
    exclusions: [
      'Medical fitness certificate of food handlers (to be self-procured)',
      'State license government fee for turnover > ₹12 Lakhs'
    ],
    requiredDocuments: [
      'Passport photo of food business operator (FBO)',
      'Government ID proof (PAN / Aadhaar / Voter ID)',
      'Premises address proof (Electricity bill + Rent Agreement/NOC)',
      'List of food products / menu items'
    ],
    faqs: [
      {
        q: 'Is FSSAI mandatory for selling food on Swiggy or Zomato?',
        a: 'Yes, both Swiggy and Zomato strictly require an active 14-digit FSSAI license before approving restaurant onboarding.'
      }
    ]
  },
  {
    id: 'srv-iec',
    slug: 'import-export-code-iec',
    name: 'Import Export Code (IEC) Registration',
    category: 'tax_registrations',
    categoryName: 'GST, PAN, MSME & IEC',
    shortDesc: '10-digit DGFT trade identifier for importing goods or exporting services/products globally.',
    fullDesc: 'Obtain lifetime valid Import Export Code (IEC) issued by the Directorate General of Foreign Trade (DGFT), Ministry of Commerce. Mandatory for international bank remittances, customs clearance, and global cross-border trade.',
    baseFee: 1299,
    govFee: 500,
    caFee: 400,
    dscFee: 0,
    gstRate: 0.18,
    slaDays: '24-48 Hours',
    isActive: true,
    badge: 'Global Trade',
    inclusions: [
      'DGFT Portal profile creation & e-KYC authentication',
      'ANF-2A application filing with Ministry of Commerce',
      'Linking of Bank Account with AD Code / PFMS',
      'Electronic Import Export Code (e-IEC) issuance with QR Code'
    ],
    exclusions: [],
    requiredDocuments: [
      'PAN Card of Business entity or Proprietor',
      'Aadhaar Card of authorized signatory',
      'Cancelled cheque or bank certificate showing Account No. & IFSC',
      'Registered premises address proof'
    ],
    faqs: [
      {
        q: 'Does an IEC require annual renewal fees?',
        a: 'No, the IEC license is valid for a lifetime with zero renewal fees. DGFT only requires a free annual online detail confirmation between April-June.'
      }
    ]
  }
];
