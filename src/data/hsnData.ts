export interface HsnItem {
  code: string;
  type: 'HSN' | 'SAC';
  category: string;
  description: string;
  gstRate: number;
  compensationCess?: string;
  conditionNotes?: string;
}

export const HSN_SAC_DIRECTORY: HsnItem[] = [
  // SERVICES (SAC 99xx)
  {
    code: '998313',
    type: 'SAC',
    category: 'Information Technology',
    description: 'Information technology (IT) design and development services, SaaS cloud software, web hosting & mobile apps.',
    gstRate: 18,
    conditionNotes: 'Standard B2B/B2C rate. Export of services outside India is zero-rated under LUT.'
  },
  {
    code: '998211',
    type: 'SAC',
    category: 'Legal Services',
    description: 'Legal advisory, representation and corporate advocacy services provided by advocates or law firms.',
    gstRate: 18,
    conditionNotes: 'Payable under Reverse Charge Mechanism (RCM) by business entities with turnover > threshold.'
  },
  {
    code: '998221',
    type: 'SAC',
    category: 'Accounting & Auditing',
    description: 'Accounting, auditing, statutory tax compliance, bookkeeping and company secretarial services.',
    gstRate: 18,
    conditionNotes: 'Standard 18% forward charge with full Input Tax Credit eligibility for business clients.'
  },
  {
    code: '998311',
    type: 'SAC',
    category: 'Management Consulting',
    description: 'Management consulting, startup advisory, market strategy and operational consultancy services.',
    gstRate: 18,
    conditionNotes: 'Eligible for normal forward charge and ITC.'
  },
  {
    code: '998361',
    type: 'SAC',
    category: 'Advertising & Marketing',
    description: 'Digital marketing, SEO, social media advertising, print media placement and creative brand design.',
    gstRate: 18,
    conditionNotes: 'Standard rate; space selling in print media taxed at 5%.'
  },
  {
    code: '996331',
    type: 'SAC',
    category: 'Hospitality & Food',
    description: 'Restaurant and cloud kitchen catering services (without alcohol and without high hotel room tariff).',
    gstRate: 5,
    conditionNotes: '5% flat without Input Tax Credit (ITC). With hotel room tariff > ₹7,500, rate is 18% with ITC.'
  },
  {
    code: '996311',
    type: 'SAC',
    category: 'Hotel Accommodation',
    description: 'Room accommodation in hotels, guest houses, and commercial hospitality units with tariff up to ₹7,500/night.',
    gstRate: 12,
    conditionNotes: '12% with ITC. Tariff above ₹7,500 per day is taxed at 18% with ITC.'
  },
  {
    code: '996511',
    type: 'SAC',
    category: 'Transportation & Logistics',
    description: 'Goods Transport Agency (GTA) freight transportation services by road in goods carriages.',
    gstRate: 5,
    conditionNotes: '5% under RCM (paid by recipient) without ITC, or 12% under forward charge with ITC by GTA.'
  },
  {
    code: '997212',
    type: 'SAC',
    category: 'Real Estate & Rentals',
    description: 'Commercial property rental and leasing services for office premises, retail shops and warehouses.',
    gstRate: 18,
    conditionNotes: 'Residential dwelling rented to registered commercial entities is taxable under RCM.'
  },
  {
    code: '999210',
    type: 'SAC',
    category: 'Education & Training',
    description: 'Commercial corporate training, professional coaching and vocational skill enhancement courses.',
    gstRate: 18,
    conditionNotes: 'Formal recognized university degrees and primary/secondary schools are GST-exempt.'
  },
  {
    code: '999312',
    type: 'SAC',
    category: 'Healthcare & Clinical',
    description: 'Medical healthcare services rendered by clinical establishments, authorized medical practitioners or paramedics.',
    gstRate: 0,
    conditionNotes: 'Exempt from GST. Non-ICU hospital room rent exceeding ₹5,000/day taxed at 5% without ITC.'
  },

  // GOODS (HSN)
  {
    code: '847130',
    type: 'HSN',
    category: 'Computers & Electronics',
    description: 'Laptops, notebook computers, tablets and portable automatic data processing machines.',
    gstRate: 18,
    conditionNotes: 'Full Input Tax Credit available for commercial IT infrastructure purchases.'
  },
  {
    code: '851713',
    type: 'HSN',
    category: 'Telecommunications',
    description: 'Smartphones and handheld wireless mobile cellular telephone devices.',
    gstRate: 18,
    conditionNotes: 'Standard 18% rate across all smart cellular hardware.'
  },
  {
    code: '610910',
    type: 'HSN',
    category: 'Apparel & Textiles',
    description: 'T-shirts, singlets and other vests made of knitted or crocheted cotton fabric.',
    gstRate: 5,
    conditionNotes: '5% if sale value does not exceed ₹1,000 per piece; 12% if sale value exceeds ₹1,000.'
  },
  {
    code: '640399',
    type: 'HSN',
    category: 'Footwear',
    description: 'Footwear with outer soles of rubber, plastics, or leather and uppers of leather or synthetic fabric.',
    gstRate: 12,
    conditionNotes: '12% for sale value above ₹1,000 per pair; 5% for sale value up to ₹1,000 per pair.'
  },
  {
    code: '300490',
    type: 'HSN',
    category: 'Pharmaceuticals',
    description: 'Medicaments consisting of mixed or unmixed products for therapeutic or prophylactic uses.',
    gstRate: 12,
    conditionNotes: 'Essential life-saving formulations and vaccines are taxed at 5% or 0%.'
  },
  {
    code: '330499',
    type: 'HSN',
    category: 'Cosmetics & Personal Care',
    description: 'Beauty or make-up preparations, creams, lotions and preparations for the care of the skin.',
    gstRate: 18,
    conditionNotes: 'Standard 18% slab for skincare and beauty formulations.'
  },
  {
    code: '040299',
    type: 'HSN',
    category: 'Dairy Products',
    description: 'Dairy products, milk and cream, concentrated or containing added sugar, butter, paneer, and cheese.',
    gstRate: 5,
    conditionNotes: 'Fresh unpackaged unbranded curd and milk are 0% exempt. Pre-packaged branded is 5%.'
  },
  {
    code: '090240',
    type: 'HSN',
    category: 'Spices & Beverages',
    description: 'Black tea (fermented) and partly fermented tea in immediate packings.',
    gstRate: 5,
    conditionNotes: 'Standard 5% slab across packaged orthodox and CTC tea leaves.'
  },
  {
    code: '090121',
    type: 'HSN',
    category: 'Spices & Beverages',
    description: 'Coffee, roasted, not decaffeinated, coffee beans and ground blends.',
    gstRate: 5,
    conditionNotes: 'Instant processed coffee extracts and chicory mixtures taxed at 18%.'
  },
  {
    code: '940330',
    type: 'HSN',
    category: 'Furniture',
    description: 'Wooden furniture of a kind used in offices, ergonomic computer desks and executive chairs.',
    gstRate: 18,
    conditionNotes: 'ITC fully admissible for commercial office outfitting.'
  },
  {
    code: '730890',
    type: 'HSN',
    category: 'Building Materials',
    description: 'Structures and parts of structures of iron or steel, plates, rods, angles and structural frameworks.',
    gstRate: 18,
    conditionNotes: 'Standard 18% rate for construction steel.'
  },
  {
    code: '252329',
    type: 'HSN',
    category: 'Building Materials',
    description: 'Portland cement, aluminous cement, slag cement and similar hydraulic cements.',
    gstRate: 28,
    conditionNotes: 'Highest slab (28%) applies to all commercial hydraulic cements.'
  },
  {
    code: '870380',
    type: 'HSN',
    category: 'Automotive & EVs',
    description: 'Electric motor vehicles (EVs) powered solely by electric motor and rechargeable battery pack.',
    gstRate: 5,
    conditionNotes: 'Concessional green mobility incentive rate of 5% without compensation cess.'
  },
  {
    code: '870322',
    type: 'HSN',
    category: 'Automotive & EVs',
    description: 'Motor cars and other passenger vehicles with spark-ignition internal combustion engine > 1,000cc.',
    gstRate: 28,
    compensationCess: 'Up to 22% cess',
    conditionNotes: '28% GST plus statutory Compensation Cess based on engine capacity and ground clearance.'
  }
];
