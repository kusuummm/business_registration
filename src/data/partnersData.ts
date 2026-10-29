export interface Partner {
  id: string;
  name: string;
  title: string;
  councilNumber: string;
  experienceYears: number;
  specialization: string;
  state: string;
  completedFilings: number;
  rating: number;
  copStatus: 'Active & Verified' | 'Renewal Pending';
  status: 'Available' | 'Busy';
  contact: {
    email: string;
    phone: string;
  };
}

export const PARTNERS_DATA: Partner[] = [];
