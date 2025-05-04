import { ProjectService } from '@/services/project.service';
import { Project, CreateProjectData, UpdateProjectData } from '@/types/project';
import { createMockSupabaseClient, createMockSupabaseResponse } from '@/types/mocks/supabase';
import { vi } from 'vitest';

const mockSupabaseClient = createMockSupabaseClient();

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient: () => mockSupabaseClient
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
        updated_at: new Date().toISOString()
      };

      const queryBuilder = mockSupabaseClient.from('projects');
      queryBuilder.select.mockReturnThis();
      queryBuilder.eq.mockReturnThis();
      queryBuilder.single.mockResolvedValue(createMockSupabaseResponse(mockProject));

      const result = await ProjectService.getProject('1', mockSupabaseClient);
      expect(result).toEqual(mockProject);
    });
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const input: CreateProjectData = {
        workspace_id: 'workspace-1',
        name: 'New Project',
        description: null
      };

      const mockProject: Project = {
        id: '1',
        workspace_id: input.workspace_id,
        name: input.name,
        description: input.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const queryBuilder = mockSupabaseClient.from('projects');
      queryBuilder.insert.mockReturnThis();
      queryBuilder.select.mockReturnThis();
      queryBuilder.single.mockResolvedValue(createMockSupabaseResponse(mockProject));

      const result = await ProjectService.createProject(input);
      expect(result).toEqual(mockProject);
    });
  });

  describe('updateProject', () => {
    it('should update an existing project', async () => {
      const input: UpdateProjectData = {
        name: 'Updated Project',
        description: 'Updated description'
      };

      const mockProject: Project = {
        id: '1',
        workspace_id: 'workspace-1',
        name: 'Updated Project',
        description: 'Updated description',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const queryBuilder = mockSupabaseClient.from('projects');
      queryBuilder.update.mockReturnThis();
      queryBuilder.eq.mockReturnThis();
      queryBuilder.select.mockReturnThis();
      queryBuilder.single.mockResolvedValue(createMockSupabaseResponse(mockProject));

      const result = await ProjectService.updateProject('1', input);
      expect(result).toEqual(mockProject);
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      const queryBuilder = mockSupabaseClient.from('projects');
      queryBuilder.delete.mockReturnThis();
      queryBuilder.eq.mockResolvedValue(createMockSupabaseResponse(null));

      await ProjectService.deleteProject('1');
      expect(queryBuilder.eq).toHaveBeenCalledWith('id', '1');
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
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Project 2',
          description: null,
          workspace_id: 'workspace-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const queryBuilder = mockSupabaseClient.from('projects');
      queryBuilder.select.mockReturnThis();
      queryBuilder.eq.mockReturnThis();
      queryBuilder.order.mockResolvedValue(createMockSupabaseResponse(mockProjects));

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

      const queryBuilder = mockSupabaseClient.from('tasks');
      queryBuilder.select.mockReturnThis();
      queryBuilder.eq.mockResolvedValue(createMockSupabaseResponse(mockStats));

      const result = await ProjectService.getProjectStats('1');
      expect(result).toBeDefined();
      expect(result).toEqual({
        total: 3,
        completed: 1,
        inProgress: 1,
        todo: 1,
        progress: 33
      });
    });
  });
}); 