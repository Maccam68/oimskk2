export interface TrainingModule {
  id: number;
  title: string;
  status: 'completed' | 'pending' | 'overdue';
  completionDate: string | null;
  dueDate: string;
  mandatory: boolean;
  completedBy: number;
  totalStaff: number;
  courseSource: string;
  startDate: string;
  category: string;
}

export interface TrainingAllocation {
  staffId: number;
  moduleId: number;
  status: 'not_started' | 'in_progress' | 'completed';
  startDate?: string;
  completionDate?: string;
}