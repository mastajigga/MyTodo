import { ProjectService } from '@/services/project.service';
import { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project';
import { createMockSupabaseClient } from '@/types/mocks/supabase';
import { vi } from 'vitest';

const mockSupabaseClient = createMockSupabaseClient();

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabaseClient,
}));

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProject', () => {
    it('should get a project by id', async () => {
      const mockProject: Project = {
        id: '1',
        name: 'Test Project',
        description: null,
        workspace_id: 'workspace-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockSupabaseClient.from('projects').select('*').eq('id', '1').single.mockResolvedValueOnce({
        data: mockProject,
        error: null,
      });

      const result = await ProjectService.getProject('1');
      expect(result).toEqual(mockProject);
    });
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const input: CreateProjectInput = {
        workspace_id: 'workspace-1',
        name: 'New Project',
        description: null,
      };

      const mockProject: Project = {
        id: '1',
        workspace_id: input.workspace_id,
        name: input.name,
        description: input.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockSupabaseClient.from('projects').insert(input).select('*').single.mockResolvedValueOnce({
        data: mockProject,
        error: null,
      });

      const result = await ProjectService.createProject(input);
      expect(result).toEqual(mockProject);
    });
  });

  describe('updateProject', () => {
    it('should update an existing project', async () => {
      const input: UpdateProjectInput = {
        name: 'Updated Project',
        description: 'Updated description',
      };

      const mockProject: Project = {
        id: '1',
        workspace_id: 'workspace-1',
        name: 'Updated Project',
        description: 'Updated description',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockSupabaseClient.from('projects').update(input).eq('id', '1').select('*').single.mockResolvedValueOnce({
        data: mockProject,
        error: null,
      });

      const result = await ProjectService.updateProject('1', input);
      expect(result).toEqual(mockProject);
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      mockSupabaseClient.from('projects').delete().eq('id', '1').mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await ProjectService.deleteProject('1');
      expect(mockSupabaseClient.from('projects').delete().eq).toHaveBeenCalled();
    });
  });

  describe('getWorkspaceProjects', () => {
    it('should get all projects for a workspace', async () => {
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'Project 1',
          description: null,
          workspace_id: 'workspace-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Project 2',
          description: null,
          workspace_id: 'workspace-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const mockSupabaseQuery = mockSupabaseClient.from('projects');
      mockSupabaseQuery.select('*').eq('workspace_id', 'workspace-1').order('created_at', { ascending: false }).mockResolvedValueOnce({
        data: mockProjects,
        error: null,
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