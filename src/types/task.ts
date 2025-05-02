export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done' | 'review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  workspace_id: string;
  project_id: string;
  created_by: string;
  assigned_to: string | null;
  assignee?: {
    full_name: string;
  };
  deleted_at: string | null;
  due_date: string | null;
  estimated_time: number | null;
  position: number;
  start_time: string | null;
  tags: string[];
} 