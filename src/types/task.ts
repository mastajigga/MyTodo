export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  due_time?: string;
  created_by: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  subtasks?: Subtask[];
};

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
  todo: 'À faire',
  in_progress: 'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé'
};

export const TASK_PRIORITY_MAP: Record<TaskPriority, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  urgent: 'Urgente'
};

export const DEFAULT_KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'todo',
    title: TASK_STATUS_MAP.todo,
    tasks: []
  },
  {
    id: 'in_progress',
    title: TASK_STATUS_MAP.in_progress,
    tasks: []
  },
  {
    id: 'completed',
    title: TASK_STATUS_MAP.completed,
    tasks: []
  }
]; 