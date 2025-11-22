export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Task {
  id: string;
  title: string;
  description: string; // Used for "Notes"
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: number;
}

export type AIAssistanceType = 'EXPAND_NOTES' | 'SUGGEST_SUBTASKS' | 'IMPROVE_CLARITY';
