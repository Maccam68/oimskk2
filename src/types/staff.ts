export interface StaffMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  startDate: string;
  emergencyContact: string;
  dbs: string;
  qualifications: Qualification[];
  employmentHistory: Employment[];
  references: Reference[];
}

export interface Qualification {
  id: number;
  title: string;
  institution: string;
  dateAchieved: string;
  expiryDate?: string;
  certificateNumber?: string;
}

export interface Employment {
  id: number;
  employer: string;
  position: string;
  startDate: string;
  endDate: string;
  reasonForLeaving: string;
  contactDetails: string;
}

export interface Reference {
  id: number;
  name: string;
  position: string;
  organization: string;
  email: string;
  phone: string;
  relationship: string;
  verified: boolean;
  verificationDate?: string;
  verificationNotes?: string;
}