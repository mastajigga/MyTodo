import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskService } from '../task.service';
import type { Task, CreateTaskData } from '@/types/task';

// Mock de supabase
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
    })),
  },
}));

const { supabase } = require('@/lib/supabase/client');

const baseTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Tâche',
  description: null,
  status: 'todo',
  priority: 'medium',
  due_date: undefined,
  start_time: '2024-06-01T10:00:00.000Z',
  estimated_time: 60,
  created_at: '2024-06-01T09:00:00.000Z',
  updated_at: '2024-06-01T09:00:00.000Z',
  user_id: 'user1',
  project_id: 'project1',
  ...overrides,
});

describe('taskService.createTask (intégration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('crée une tâche sans chevauchement', async () => {
    supabase.from().select().eq().eq.mockResolvedValueOnce({ data: [], error: null });
    supabase.from().insert().select().single.mockResolvedValueOnce({
      data: { ...baseTask({ id: '2', start_time: '2024-06-01T12:00:00.000Z' }), priority: 'medium' },
      error: null,
    });
    const data: CreateTaskData = {
      title: 'Nouvelle tâche',
      description: null,
      status: 'todo',
      priority: 'medium',
      due_date: null,
      start_time: '2024-06-01T12:00:00.000Z',
      estimated_time: 30,
      workspace_id: 'ws1',
      project_id: 'project1',
      created_by: 'user1',
      assigned_to: null,
      tags: [],
    };
    const task = await taskService.createTask(data);
    expect(task.start_time).toBe('2024-06-01T12:00:00.000Z');
    expect(task.priority).toBe('medium');
  });

  it('décale la tâche si chevauchement', async () => {
    supabase.from().select().eq().eq.mockResolvedValueOnce({
      data: [baseTask({ start_time: '2024-06-01T10:00:00.000Z', estimated_time: 60 })],
      error: null,
    });
    supabase.from().insert().select().single.mockResolvedValueOnce({
      data: { ...baseTask({ id: '3', start_time: '2024-06-01T11:00:00.000Z' }), priority: 'medium' },
      error: null,
    });
    const data: CreateTaskData = {
      title: 'Tâche chevauchante',
      description: null,
      status: 'todo',
      priority: 'medium',
      due_date: null,
      start_time: '2024-06-01T10:30:00.000Z',
      estimated_time: 30,
      workspace_id: 'ws1',
      project_id: 'project1',
      created_by: 'user1',
      assigned_to: null,
      tags: [],
    };
    const task = await taskService.createTask(data);
    expect(task.start_time).toBe('2024-06-01T11:00:00.000Z');
  });

  it('crée une tâche avec priorité urgent', async () => {
    supabase.from().select().eq().eq.mockResolvedValueOnce({ data: [], error: null });
    supabase.from().insert().select().single.mockResolvedValueOnce({
      data: { ...baseTask({ id: '4', start_time: '2024-06-01T13:00:00.000Z' }), priority: 'urgent' },
      error: null,
    });
    const data: CreateTaskData = {
      title: 'Tâche urgente',
      description: null,
      status: 'todo',
      priority: 'urgent',
      due_date: null,
      start_time: '2024-06-01T13:00:00.000Z',
      estimated_time: 45,
      workspace_id: 'ws1',
      project_id: 'project1',
      created_by: 'user1',
      assigned_to: null,
      tags: [],
    };
    const task = await taskService.createTask(data);
    expect(task.priority).toBe('urgent');
    expect(task.start_time).toBe('2024-06-01T13:00:00.000Z');
  });
}); 