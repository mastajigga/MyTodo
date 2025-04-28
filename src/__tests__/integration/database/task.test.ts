import { describe, it, expect, beforeEach, vi } from 'vitest';
import { taskService } from '@/services/task';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  createMockSupabaseClient,
  createMockSupabaseResponse,
  type MockSupabaseClient
} from '@/types/mocks/supabase';

// Mock Supabase
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn(),
}));

describe('Task Service', () => {
  const mockTask = {
    id: 'test-task-id',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo' as const,
    priority: 'medium' as const,
    due_date: '2025-04-09T17:39:23.341Z',
    workspace_id: 'test-workspace-id',
    project_id: 'test-project-id',
    assigned_to: 'test-user-id',
    created_by: 'test-user-id',
    created_at: '2025-04-09T17:39:23.341Z',
    updated_at: '2025-04-09T17:39:23.341Z',
  };

  let mockSupabase: MockSupabaseClient;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = createMockSupabaseClient();
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const response = createMockSupabaseResponse(mockTask);
      mockSupabase.from('tasks').insert.mockResolvedValueOnce(response);

      const result = await taskService.createTask({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'medium',
        workspace_id: 'test-workspace-id',
        project_id: 'test-project-id',
      });

      expect(result).toEqual(mockTask);
      expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
      expect(mockSupabase.from('tasks').insert).toHaveBeenCalled();
    });

    it('should throw an error if creation fails', async () => {
      const response = createMockSupabaseResponse(null, { message: 'Creation failed' });
      mockSupabase.from('tasks').insert.mockResolvedValueOnce(response);

      await expect(
        taskService.createTask({
          title: 'Test Task',
          description: 'Test Description',
          status: 'todo',
          priority: 'medium',
          workspace_id: 'test-workspace-id',
          project_id: 'test-project-id',
        })
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('getTask', () => {
    it('should get a task by id', async () => {
      const mockSelect = vi.fn().mockResolvedValue({
        data: mockTask,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        select: mockSelect,
      });

      const result = await taskService.getTask('test-task-id');

      expect(result).toEqual(mockTask);
      expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
      expect(mockSelect).toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const updatedTask = { ...mockTask, title: 'Updated Task' };
      const mockUpdate = vi.fn().mockResolvedValue({
        data: updatedTask,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        update: mockUpdate,
        eq: vi.fn().mockReturnThis(),
      });

      const result = await taskService.updateTask('test-task-id', {
        title: 'Updated Task',
      });

      expect(result).toEqual(updatedTask);
      expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const mockDelete = vi.fn().mockResolvedValue({
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        delete: mockDelete,
        eq: vi.fn().mockReturnThis(),
      });

      await taskService.deleteTask('test-task-id');

      expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
      expect(mockDelete).toHaveBeenCalled();
    });
  });

  describe('getWorkspaceTasks', () => {
    it('should get all tasks for a workspace', async () => {
      const mockSelect = vi.fn().mockResolvedValue({
        data: [mockTask],
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        select: mockSelect,
      });

      const result = await taskService.getWorkspaceTasks('test-workspace-id');

      expect(result).toEqual([mockTask]);
      expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
      expect(mockSelect).toHaveBeenCalled();
    });
  });

  describe('getProjectTasks', () => {
    it('should get all tasks for a project', async () => {
      const mockSelect = vi.fn().mockResolvedValue({
        data: [mockTask],
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        select: mockSelect,
      });

      const result = await taskService.getProjectTasks('test-project-id');

      expect(result).toEqual([mockTask]);
      expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
      expect(mockSelect).toHaveBeenCalled();
    });
  });
}); 