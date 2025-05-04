import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mockSupabase } from '@/lib/supabase/__mocks__/mockSupabase';
import { getProject, createProject, updateProject, deleteProject } from '@/services/projectService';
import type { Tables } from '@/lib/database.types';

type Project = Tables<'projects'>;

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient: () => mockSupabase,
}));

describe('projectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProject', () => {
    it('should return a project when found', async () => {
      const mockProject: Project = {
        id: '123',
        name: 'Test Project',
        description: 'Test Description',
        color: 'blue',
        workspace_id: 'workspace-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const queryBuilder = mockSupabase.from();
      queryBuilder.select.mockReturnThis();
      queryBuilder.eq.mockReturnThis();
      queryBuilder.single.mockResolvedValue({ data: mockProject, error: null });

      const result = await getProject('123', mockSupabase);

      expect(result).toEqual(mockProject);
      expect(mockSupabase.from).toHaveBeenCalledWith('projects');
      expect(queryBuilder.eq).toHaveBeenCalledWith('id', '123');
    });

    it('should throw error when project not found', async () => {
      const queryBuilder = mockSupabase.from();
      queryBuilder.select.mockReturnThis();
      queryBuilder.eq.mockReturnThis();
      queryBuilder.single.mockResolvedValue({ data: null, error: new Error('Not found') });

      await expect(getProject('123', mockSupabase)).rejects.toThrow('Not found');
    });
  });

  describe('createProject', () => {
    it('should create a project successfully', async () => {
      const newProject: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
        name: 'New Project',
        description: 'New Description',
        color: 'red',
        workspace_id: 'workspace-123',
      };

      const mockProject: Project = {
        ...newProject,
        id: '123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const queryBuilder = mockSupabase.from();
      queryBuilder.insert.mockReturnThis();
      queryBuilder.select.mockReturnThis();
      queryBuilder.single.mockResolvedValue({ data: mockProject, error: null });

      const result = await createProject(newProject, mockSupabase);

      expect(result).toEqual(mockProject);
      expect(mockSupabase.from).toHaveBeenCalledWith('projects');
      expect(queryBuilder.insert).toHaveBeenCalledWith(newProject);
    });
  });

  describe('updateProject', () => {
    it('should update a project successfully', async () => {
      const updatedProject: Partial<Project> = {
        name: 'Updated Project',
        description: 'Updated Description',
      };

      const mockProject: Project = {
        id: '123',
        name: 'Updated Project',
        description: 'Updated Description',
        color: 'blue',
        workspace_id: 'workspace-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const queryBuilder = mockSupabase.from();
      queryBuilder.update.mockReturnThis();
      queryBuilder.eq.mockReturnThis();
      queryBuilder.select.mockReturnThis();
      queryBuilder.single.mockResolvedValue({ data: mockProject, error: null });

      const result = await updateProject('123', updatedProject, mockSupabase);

      expect(result).toEqual(mockProject);
      expect(mockSupabase.from).toHaveBeenCalledWith('projects');
      expect(queryBuilder.update).toHaveBeenCalledWith(updatedProject);
      expect(queryBuilder.eq).toHaveBeenCalledWith('id', '123');
    });

    it('should return null when update fails', async () => {
      const updatedProject: Partial<Project> = {
        name: 'Updated Project',
        description: 'Updated Description',
      };

      const queryBuilder = mockSupabase.from();
      queryBuilder.update.mockReturnThis();
      queryBuilder.eq.mockReturnThis();
      queryBuilder.select.mockReturnThis();
      queryBuilder.single.mockResolvedValue({ data: null, error: new Error('Update failed') });

      const result = await updateProject('123', updatedProject, mockSupabase);

      expect(result).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith('projects');
      expect(queryBuilder.update).toHaveBeenCalledWith(updatedProject);
      expect(queryBuilder.eq).toHaveBeenCalledWith('id', '123');
    });
  });

  describe('deleteProject', () => {
    it('should delete a project successfully', async () => {
      const queryBuilder = mockSupabase.from();
      queryBuilder.delete.mockReturnThis();
      queryBuilder.eq.mockResolvedValue({ error: null });

      const result = await deleteProject('123', mockSupabase);

      expect(result).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('projects');
      expect(queryBuilder.delete).toHaveBeenCalled();
      expect(queryBuilder.eq).toHaveBeenCalledWith('id', '123');
    });

    it('should return false when delete fails', async () => {
      const error = new Error('Delete failed');
      const queryBuilder = mockSupabase.from();
      const deleteBuilder = { eq: vi.fn().mockResolvedValue({ error }) };
      queryBuilder.delete.mockReturnValue(deleteBuilder);

      const result = await deleteProject('123', mockSupabase);

      expect(result).toBe(false);
      expect(mockSupabase.from).toHaveBeenCalledWith('projects');
      expect(queryBuilder.delete).toHaveBeenCalled();
      expect(deleteBuilder.eq).toHaveBeenCalledWith('id', '123');
    });
  });
}); 