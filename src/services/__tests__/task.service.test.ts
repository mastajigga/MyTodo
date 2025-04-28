import { describe, it, expect } from 'vitest';
import { getNextAvailableStartTime } from '../task.service';
import type { Task } from '@/types/task';

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

describe('getNextAvailableStartTime', () => {
  it('retourne le start_time demandé si aucune tâche existante', () => {
    const result = getNextAvailableStartTime([], { start_time: '2024-06-01T12:00:00.000Z', estimated_time: 30 });
    expect(result).toBe('2024-06-01T12:00:00.000Z');
  });

  it('décale le start_time si chevauchement avec une tâche existante', () => {
    const tasks = [baseTask({ start_time: '2024-06-01T10:00:00.000Z', estimated_time: 60 })];
    const result = getNextAvailableStartTime(tasks, { start_time: '2024-06-01T10:30:00.000Z', estimated_time: 30 });
    expect(result).toBe('2024-06-01T11:00:00.000Z');
  });

  it('place la nouvelle tâche après la dernière si plusieurs chevauchements', () => {
    const tasks = [
      baseTask({ id: '1', start_time: '2024-06-01T10:00:00.000Z', estimated_time: 60 }),
      baseTask({ id: '2', start_time: '2024-06-01T11:00:00.000Z', estimated_time: 60 }),
    ];
    const result = getNextAvailableStartTime(tasks, { start_time: '2024-06-01T10:30:00.000Z', estimated_time: 30 });
    expect(result).toBe('2024-06-01T12:00:00.000Z');
  });

  it('ne décale pas si la nouvelle tâche commence avant la première existante', () => {
    const tasks = [baseTask({ start_time: '2024-06-01T10:00:00.000Z', estimated_time: 60 })];
    const result = getNextAvailableStartTime(tasks, { start_time: '2024-06-01T09:00:00.000Z', estimated_time: 30 });
    expect(result).toBe('2024-06-01T09:00:00.000Z');
  });

  it('ignore les tâches sans estimated_time', () => {
    const tasks = [baseTask({ start_time: '2024-06-01T10:00:00.000Z', estimated_time: null })];
    const result = getNextAvailableStartTime(tasks, { start_time: '2024-06-01T10:00:00.000Z', estimated_time: 30 });
    expect(result).toBe('2024-06-01T10:00:00.000Z');
  });
}); 