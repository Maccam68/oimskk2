export interface ComplianceRequirement {
  id: number;
  category: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'compliant' | 'non-compliant' | 'pending-review' | 'in-progress';
  lastReviewDate: string;
  nextReviewDate: string;
  assignedTo: number[];
  evidence: Evidence[];
  actions: Action[];
}

export interface Evidence {
  id: number;
  title: string;
  description: string;
  dateUploaded: string;
  documentType: string;
  location: string;
}

export interface Action {
  id: number;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  assignedTo: number;
}