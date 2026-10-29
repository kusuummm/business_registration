export interface StatePricing {
  code: string;
  name: string;
  stampDuty: number; // For standard capital <= 10L
  notes?: string;
}

export const STATE_STAMP_DUTY: Record<string, StatePricing> = {
  MH: { code: 'MH', name: 'Maharashtra', stampDuty: 1000, notes: 'Flat ₹1,000 on AOA under Bombay Stamp Act' },
  DL: { code: 'DL', name: 'Delhi', stampDuty: 860, notes: 'MOA ₹10, AOA ₹200, INC-9 ₹10' },
  KA: { code: 'KA', name: 'Karnataka', stampDuty: 2000, notes: 'Karnataka Stamp Act Art 20(2)' },
  TS: { code: 'TS', name: 'Telangana', stampDuty: 1300, notes: 'Telangana Stamp Rules' },
  TN: { code: 'TN', name: 'Tamil Nadu', stampDuty: 1500, notes: 'Tamil Nadu Stamp Act' },
  GJ: { code: 'GJ', name: 'Gujarat', stampDuty: 1000, notes: 'Gujarat Stamp Act' },
  UP: { code: 'UP', name: 'Uttar Pradesh', stampDuty: 1250, notes: 'UP Stamp Act' },
  PB: { code: 'PB', name: 'Punjab', stampDuty: 10000, notes: '1% of Authorized Capital (Punjab Stamp Rules)' },
  KL: { code: 'KL', name: 'Kerala', stampDuty: 5000, notes: 'Kerala Stamp Act Schedule' },
  WB: { code: 'WB', name: 'West Bengal', stampDuty: 1500, notes: 'West Bengal Stamp Act' },
  RJ: { code: 'RJ', name: 'Rajasthan', stampDuty: 1100, notes: 'Rajasthan Stamp Rules' },
  HR: { code: 'HR', name: 'Haryana', stampDuty: 950, notes: 'Haryana Stamp Rules' },
  MP: { code: 'MP', name: 'Madhya Pradesh', stampDuty: 1800, notes: 'MP Stamp Act' },
  AP: { code: 'AP', name: 'Andhra Pradesh', stampDuty: 1400, notes: 'AP Stamp Rules' },
  BR: { code: 'BR', name: 'Bihar', stampDuty: 1200, notes: 'Bihar Stamp Act' },
  OD: { code: 'OD', name: 'Odisha', stampDuty: 1350, notes: 'Odisha Stamp Act' },
  AS: { code: 'AS', name: 'Assam', stampDuty: 1100, notes: 'Assam Stamp Act' },
  JH: { code: 'JH', name: 'Jharkhand', stampDuty: 1200, notes: 'Jharkhand Stamp Act' },
  CT: { code: 'CT', name: 'Chhattisgarh', stampDuty: 1400, notes: 'Chhattisgarh Stamp Act' },
  UK: { code: 'UK', name: 'Uttarakhand', stampDuty: 1050, notes: 'Uttarakhand Stamp Act' },
  GA: { code: 'GA', name: 'Goa', stampDuty: 1500, notes: 'Goa Stamp Act' },
  HP: { code: 'HP', name: 'Himachal Pradesh', stampDuty: 1100, notes: 'HP Stamp Act' }
};

export interface EntityType {
  id: string;
  name: string;
  badge: string;
  description: string;
  minDirectors: number;
  baseFee: number;
}

export const ENTITY_TYPES: EntityType[] = [
  {
    id: 'pvt_ltd',
    name: 'Private Limited Company',
    badge: 'Most Popular',
    description: 'Gold standard for startups raising venture capital, hiring employees & scaling with limited liability.',
    minDirectors: 2,
    baseFee: 2499
  },
  {
    id: 'opc',
    name: 'One Person Company (OPC)',
    badge: 'Solo Founder',
    description: 'Corporate status for single entrepreneurs with limited liability protection and sole control.',
    minDirectors: 1,
    baseFee: 2199
  },
  {
    id: 'llp',
    name: 'Limited Liability Partnership (LLP)',
    badge: 'Low Compliance',
    description: 'Ideal for consulting firms, professional practices & bootstrapped businesses with zero audit mandate up to 40L turnover.',
    minDirectors: 2,
    baseFee: 1999
  }
];

export const CAPITAL_OPTIONS = [
  { value: 100000, label: '₹ 1,00,000 (Standard Startup Capital)', rocFee: 0 },
  { value: 500000, label: '₹ 5,00,000 (Medium Scale)', rocFee: 0 },
  { value: 1000000, label: '₹ 10,00,000 (High Scale)', rocFee: 0 },
  { value: 1500000, label: '₹ 15,00,000 (Govt Fee Threshold)', rocFee: 0 },
  { value: 2500000, label: '₹ 25,00,000 (Statutory ROC Fee applies)', rocFee: 4000 }
];

export const DSC_TOKEN_UNIT_PRICE = 600; // Class-3 USB Cryptographic Token (ProxKey / ePass2003)
export const GST_RATE = 0.18; // 18% GST on taxable professional components
