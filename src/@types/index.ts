import { Database } from '../lib/database.types';

export type ProjectBase = Database['public']['Tables']['projects']['Row'];

export interface Project extends Omit<ProjectBase, 'color'> {
  color?: ProjectColor;
  workspace?: {
    id: string;
    name: string;
  };
  members?: {
    count: number;
  };
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  project_id: string;
  status: TaskStatus;
  priority: TaskPriority;
  order: number;
  created_at: string;
  updated_at: string;
}

export type CreateProjectData = {
  name: string;
  description?: string | null;
  workspace_id: string;
  position?: number;
  created_by?: string;
  color?: ProjectColor;
};

export type UpdateProjectData = Partial<Omit<Project, 'id' | 'created_at' | 'created_by'>>;

export const PROJECT_COLORS = {
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
} as const;

export type ProjectColor = keyof typeof PROJECT_COLORS; 