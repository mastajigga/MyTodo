import { Task, TaskPriority, TaskStatus } from '@/types/task.types'

export const baseTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'This is a test task',
  status: 'todo' as TaskStatus,
  priority: 'low' as TaskPriority,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  start_time: null,
  end_time: null,
  workspace_id: '1',
  project_id: null,
  created_by_user: null,
  assigned_to_user: null,
  project: null
};

export const mockTasks: Task[] = [
  {
    ...baseTask,
    id: '1',
    title: 'Task 1',
    status: 'todo' as TaskStatus,
    priority: 'high' as TaskPriority,
  },
  {
    ...baseTask,
    id: '2',
    title: 'Task 2',
    status: 'in_progress' as TaskStatus,
    priority: 'medium' as TaskPriority,
  },
  {
    ...baseTask,
    id: '3',
    title: 'Task 3',
    status: 'done' as TaskStatus,
    priority: 'low' as TaskPriority,
  }
] 