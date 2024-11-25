export interface Supervision {
  id: number;
  staffId: number;
  supervisorName: string;
  date: string;
  notes: string;
  actions: string[];
  outcomes: string[];
  nextSupervisionDate: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface SupervisionFormData {
  staffId: number;
  supervisorName: string;
  date: string;
  notes: string;
  actions: string[];
  outcomes: string[];
  nextSupervisionDate: string;
}