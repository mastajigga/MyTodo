import type { User } from './common';
import type { Database } from '@/@types/database.types';
import { Profile } from './profile.types';
import { Project } from './project.types';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export type TaskSortOption = 'createdAt' | 'dueDate' | 'priority' | 'title';

export const TASK_STATUS_MAP: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'À faire',
  [TaskStatus.IN_PROGRESS]: 'En cours',
  [TaskStatus.DONE]: 'Terminé',
  [TaskStatus.CANCELLED]: 'Annulé'
} as const;

export const TASK_PRIORITY_MAP: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Basse',
  [TaskPriority.MEDIUM]: 'Moyenne',
  [TaskPriority.HIGH]: 'Haute',
  [TaskPriority.URGENT]: 'Urgente'
} as const;

export const PRIORITY_COLORS = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800'
} as const;

export type Task = Database['public']['Tables']['tasks']['Row'] & {
  created_by_user?: User;
  assigned_to_user?: User | null;
  project?: {
    id: string;
    name: string;
  };
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
};

export type Comment = Database['public']['Tables']['comments']['Row'];
export type Subtask = Database['public']['Tables']['subtasks']['Row'];

export type TaskWithRelations = Task & {
  assignee: Profile | null;
  project: Project;
  subtasks: Subtask[];
  comments: Comment[];
};

export type CreateTaskData = {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  workspace_id: string;
  project_id: string;
  created_by: string;
  assigned_to?: string | null;
  due_date?: string | null;
  start_time?: string | null;
  estimated_time?: number | null;
  all_project_ids?: string[];
};

export type UpdateTaskData = Partial<CreateTaskData>;

export const taskStatusLabels: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'À faire',
  [TaskStatus.IN_PROGRESS]: 'En cours',
  [TaskStatus.DONE]: 'Terminé',
  [TaskStatus.CANCELLED]: 'Annulé'
};

export const taskStatusColors: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TaskStatus.DONE]: 'bg-green-100 text-green-800',
  [TaskStatus.CANCELLED]: 'bg-red-100 text-red-800'
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Basse',
  [TaskPriority.MEDIUM]: 'Moyenne',
  [TaskPriority.HIGH]: 'Haute',
  [TaskPriority.URGENT]: 'Urgente'
};

export const taskPriorityColors: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'bg-gray-100 text-gray-800',
  [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [TaskPriority.HIGH]: 'bg-orange-100 text-orange-800',
  [TaskPriority.URGENT]: 'bg-red-100 text-red-800'
}; 