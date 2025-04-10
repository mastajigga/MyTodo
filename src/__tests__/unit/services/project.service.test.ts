import { ProjectService } from '@/services/project.service';
import { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockSupabaseClient, resetSupabaseMocks } from '@/test/mocks/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabaseClient
}));

describe('ProjectService', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  describe('getProject', () => {
    it('devrait récupérer un projet par son id', async () => {
      const mockProject = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        workspace_id: 'workspace-1'
      };

      mockSupabaseClient.from().select().eq().single.mockResolvedValueOnce({
        data: mockProject,
        error: null
      });

      const result = await ProjectService.getProject('1');
      expect(result).toEqual(mockProject);
    });
  });

  describe('createProject', () => {
    it('devrait créer un nouveau projet', async () => {
      const input = {
        name: 'New Project',
        description: 'New Description',
        workspace_id: 'workspace-1'
      };

      const mockProject = { ...input, id: '1' };

      mockSupabaseClient.from().insert().select().single.mockResolvedValueOnce({
        data: mockProject,
        error: null
      });

      const result = await ProjectService.createProject(input);
      expect(result).toEqual(mockProject);
    });
  });

  describe('updateProject', () => {
    it('should update an existing project', async () => {
      const input: UpdateProjectInput = {
        name: 'Updated Project',
        description: 'Updated Description',
        completed: true,
      };

      const mockProject: Project = {
        id: '1',
        workspace_id: '1',
        name: 'Updated Project',
        description: 'Updated Description',
        completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockSupabaseClient.single.mockResolvedValueOnce({ data: mockProject });

      const result = await ProjectService.updateProject('1', input);
      expect(result).toEqual(mockProject);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('projects');
      expect(mockSupabaseClient.update).toHaveBeenCalledWith(input);
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '1');
      expect(mockSupabaseClient.select).toHaveBeenCalled();
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({ data: null });

      await ProjectService.deleteProject('1');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('projects');
      expect(mockSupabaseClient.delete).toHaveBeenCalled();
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '1');
    });
  });

  describe('getWorkspaceProjects', () => {
    it('devrait récupérer tous les projets d\'un espace de travail', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1', workspace_id: 'workspace-1' },
        { id: '2', name: 'Project 2', workspace_id: 'workspace-1' }
      ];

      mockSupabaseClient.from().select().eq.mockResolvedValueOnce({
        data: mockProjects,
        error: null
      });

      const result = await ProjectService.getWorkspaceProjects('workspace-1');
      expect(result).toEqual(mockProjects);
    });
  });

  describe('getProjectStats', () => {
    it('devrait récupérer les statistiques d\'un projet', async () => {
      const mockStats = [
        { status: 'TODO' },
        { status: 'IN_PROGRESS' },
        { status: 'DONE' }
      ];

      mockSupabaseClient.from().select().eq.mockResolvedValueOnce({
        data: mockStats,
        error: null
      });

      const result = await ProjectService.getProjectStats('1');
      expect(result).toBeDefined();
    });
  });
}); 