export interface OfstedRequirement {
  id: number;
  sectionId: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'not_started';
  completedAt?: Date;
  updatedAt: Date;
  createdAt: Date;
  evidence?: string;
  notes?: string;
}

export interface OfstedSection {
  id: number;
  title: string;
  description: string;
  requirements: OfstedRequirement[];
  actions: string[];
  updatedAt: Date;
  createdAt: Date;
}

export interface OfstedEvidence {
  id: number;
  requirementId: number;
  fileUrl: string;
  description: string;
  uploadedBy: number;
  uploadedAt: Date;
}