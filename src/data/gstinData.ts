export interface GstStateCode {
  code: string;
  name: string;
}

export const GST_STATE_CODES: Record<string, string> = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra & Nagar Haveli and Daman & Diu',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
  '97': 'Other Territory',
  '99': 'Centre Jurisdiction'
};

export interface GstinValidationResult {
  isValid: boolean;
  gstin: string;
  stateCode: string;
  stateName: string;
  pan: string;
  panEntityType: string;
  entityNumber: string;
  checksum: string;
  taxpayerStatus: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'INVALID';
  filingCadence: 'Monthly (GSTR-1/3B)' | 'Quarterly (QRMP)' | 'Composition';
  reasons: string[];
}

export function validateAndDecodeGSTIN(input: string): GstinValidationResult {
  const gstin = input.trim().toUpperCase();
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  
  if (!gstin) {
    return {
      isValid: false,
      gstin: '',
      stateCode: '',
      stateName: '',
      pan: '',
      panEntityType: '',
      entityNumber: '',
      checksum: '',
      taxpayerStatus: 'INVALID',
      filingCadence: 'Monthly (GSTR-1/3B)',
      reasons: ['Please enter a 15-character GSTIN.']
    };
  }

  const reasons: string[] = [];

  if (gstin.length !== 15) {
    reasons.push(`GSTIN must be exactly 15 characters long. Current length is ${gstin.length}.`);
  }

  const stateCode = gstin.substring(0, 2);
  const stateName = GST_STATE_CODES[stateCode] || 'Unknown / Unrecognized State Code';

  if (!GST_STATE_CODES[stateCode]) {
    reasons.push(`State Code "${stateCode}" is not a recognized Indian GST State Jurisdiction.`);
  }

  const pan = gstin.substring(2, 12);
  const panLetter4 = pan.charAt(3);
  let panEntityType = 'Unknown Entity';
  switch (panLetter4) {
    case 'C': panEntityType = 'Company (Private Ltd / Public Ltd)'; break;
    case 'P': panEntityType = 'Individual / Sole Proprietorship'; break;
    case 'H': panEntityType = 'Hindu Undivided Family (HUF)'; break;
    case 'F': panEntityType = 'Partnership Firm / LLP'; break;
    case 'A': panEntityType = 'Association of Persons (AOP)'; break;
    case 'T': panEntityType = 'Trust / Section 8'; break;
    case 'B': panEntityType = 'Body of Individuals (BOI)'; break;
    case 'L': panEntityType = 'Local Authority'; break;
    case 'J': panEntityType = 'Artificial Juridical Person'; break;
    case 'G': panEntityType = 'Government Agency'; break;
  }

  const entityNum = gstin.charAt(12);
  const zChar = gstin.charAt(13);
  const checksum = gstin.charAt(14);

  if (zChar !== 'Z') {
    reasons.push(`Character 14 must be 'Z' by statutory GSTN mandate.`);
  }

  const isValidFormat = regex.test(gstin) && !!GST_STATE_CODES[stateCode];

  return {
    isValid: isValidFormat,
    gstin,
    stateCode,
    stateName,
    pan,
    panEntityType,
    entityNumber: entityNum,
    checksum,
    taxpayerStatus: isValidFormat ? 'ACTIVE' : 'INVALID',
    filingCadence: panEntityType === 'Individual / Sole Proprietorship' ? 'Quarterly (QRMP)' : 'Monthly (GSTR-1/3B)',
    reasons
  };
}
