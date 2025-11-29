export type TaskStatus = 'OPEN' | 'DONE' | 'IN_PROGRESS' | 'BLOCKED';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  dueDate?: string | null;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
