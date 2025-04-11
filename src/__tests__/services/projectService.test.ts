import { projectService } from '@/lib/services/projectService';
import { mockSupabase } from '@/lib/supabase/__mocks__/mockSupabase';
import { vi } from 'vitest';

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase
}));

describe('projectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProjects', () => {
    it('should return all projects when no workspace id is provided', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1' },
        { id: '2', name: 'Project 2' }
      ];
      mockSupabase.from.mockReturnValue({
        select: () => ({
          order: () => Promise.resolve({ data: mockProjects, error: null })
        })
      });

      const result = await projectService.getProjects();
      expect(result).toEqual(mockProjects);
    });

    it('should filter projects by workspace id when provided', async () => {
      const workspaceId = '123';
      const mockProjects = [{ id: '1', name: 'Project 1', workspace_id: workspaceId }];
      mockSupabase.from.mockReturnValue({
        select: () => ({
          order: () => ({
            eq: () => Promise.resolve({ data: mockProjects, error: null })
          })
        })
      });

      const result = await projectService.getProjects(workspaceId);
      expect(result).toEqual(mockProjects);
    });
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const newProject = { name: 'New Project', workspace_id: '123' };
      const createdProject = { id: '1', ...newProject };
      mockSupabase.from.mockReturnValue({
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: createdProject, error: null })
          })
        })
      });

      const result = await projectService.createProject(newProject);
      expect(result).toEqual(createdProject);
    });
  });

  describe('updateProject', () => {
    it('should update an existing project', async () => {
      const projectId = '1';
      const updateData = { name: 'Updated Project' };
      const updatedProject = { id: projectId, ...updateData };
      mockSupabase.from.mockReturnValue({
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: updatedProject, error: null })
            })
          })
        })
      });

      const result = await projectService.updateProject(projectId, updateData);
      expect(result).toEqual(updatedProject);
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      const projectId = '1';
      mockSupabase.from.mockReturnValue({
        delete: () => ({
          eq: () => Promise.resolve({ error: null })
        })
      });

      await expect(projectService.deleteProject(projectId)).resolves.not.toThrow();
    });
  });

  describe('getProjectById', () => {
    it('should return a project by id', async () => {
      const projectId = '1';
      const mockProject = { id: projectId, name: 'Project 1' };
      mockSupabase.from.mockReturnValue({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockProject, error: null })
          })
        })
      });

      const result = await projectService.getProjectById(projectId);
      expect(result).toEqual(mockProject);
    });
  });
}); 