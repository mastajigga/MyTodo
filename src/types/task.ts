import type { User, Project } from './common';

export type TaskSortOption = 'createdAt' | 'dueDate' | 'priority' | 'title';

export const DEFAULT_KANBAN_COLUMNS = [
  { id: 'todo', title: 'À faire' },
  { id: 'in_progress', title: 'En cours' },
  { id: 'review', title: 'En revue' },
  { id: 'done', title: 'Terminé' }
] as const;

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export const TASK_STATUS_MAP: Record<TaskStatus, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  review: 'En revue',
  done: 'Terminé'
} as const;

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  start_time?: string | null;
  estimated_time?: number | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  project_id: string;
  project?: {
    id: string;
    name: string;
  };
}

export interface CreateTaskData {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  start_time?: string | null;
  estimated_time?: number | null;
  workspace_id: string;
  project_id: string | null;
  created_by: string;
  assigned_to: string | null;
  tags: string[];
}

export type UpdateTaskData = Partial<Omit<CreateTaskData, 'created_by' | 'workspace_id'>> & {
  start_time?: string | null;
  estimated_time?: number | null;
};

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'; 