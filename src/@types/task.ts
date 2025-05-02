export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Subtask = {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string;
  workspace_id: string;
  position: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  due_date: string | null;
  start_time: string | null;
  estimated_time: number | null;
  created_by: string;
  assigned_to: string | null;
  tags: string[] | null;
  created_by_user?: User;
  assigned_to_user?: User | null;
  project?: {
    id: string;
    name: string;
    workspace_id: string;
  };
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface TaskActivity {
  id: string;
  task_id: string;
  task_title: string;
  action: string;
  previous_status?: string;
  new_status?: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  user?: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export const TASK_STATUS_MAP: Record<TaskStatus, string> = {
  'todo': 'À faire',
  'in_progress': 'En cours',
  'review': 'En révision',
  'done': 'Terminé'
};

export const TASK_PRIORITY_MAP: Record<TaskPriority, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  urgent: 'Urgente'
};

export const DEFAULT_KANBAN_COLUMNS = [
  {
    id: 'todo',
    title: 'À faire',
    tasks: []
  },
  {
    id: 'in_progress',
    title: 'En cours',
    tasks: []
  },
  {
    id: 'review',
    title: 'En révision',
    tasks: []
  },
  {
    id: 'done',
    title: 'Terminé',
    tasks: []
  }
];

export type CreateTaskData = {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string;
  workspace_id: string;
  position: number;
  created_by: string;
  assigned_to?: string | null;
  due_date?: string | null;
  start_time?: string | null;
  estimated_time?: number | null;
  tags?: string[] | null;
}; 