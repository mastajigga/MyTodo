import type { Database } from '@/types/database.types'
type Task = Database['public']['Tables']['tasks']['Row']

export const baseTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'This is a test task',
  status: 'todo',
  priority: 'low',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  start_time: null,
  due_date: null,
  workspace_id: '1',
  project_id: '1',
  created_by: '1',
  assigned_to: '1',
  position: 0,
  deleted_at: null,
  estimated_time: null,
  tags: []
};

export const mockTasks: Task[] = [
  {
    ...baseTask,
    id: '1',
    title: 'Task 1',
    status: 'todo',
    priority: 'high',
  },
  {
    ...baseTask,
    id: '2',
    title: 'Task 2',
    status: 'in_progress',
    priority: 'medium',
  },
  {
    ...baseTask,
    id: '3',
    title: 'Task 3',
    status: 'done',
    priority: 'low',
  }
] 