export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export type Subtask = {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  user_id: string;
  workspace_id?: string;
  created_at: string;
  updated_at: string;
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

export const TASK_STATUS_MAP: Record<TaskStatus, string> = {
  'pending': 'À faire',
  'in-progress': 'En cours',
  'completed': 'Terminé'
};

export const TASK_PRIORITY_MAP: Record<TaskPriority, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  urgent: 'Urgente'
};

export const DEFAULT_KANBAN_COLUMNS = [
  {
    id: 'pending',
    title: 'À faire',
    tasks: []
  },
  {
    id: 'in-progress',
    title: 'En cours',
    tasks: []
  },
  {
    id: 'completed',
    title: 'Terminé',
    tasks: []
  }
]; 