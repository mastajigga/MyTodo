import { describe, it, expect, beforeEach, vi } from 'vitest';
import { workspaceService } from '@/services/workspace';
import type { InviteWorkspaceMemberData } from '@/types/workspace';
import type { Database } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  createMockSupabaseClient,
  createMockSupabaseResponse,
  type MockSupabaseClient
} from '@/types/mocks/supabase';
import { WorkspaceService } from '@/services/workspace';

// Mock Supabase
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn(),
}));

vi.mock('@/services/workspace', () => {
  const actual = vi.importActual('@/services/workspace');
  return {
    ...actual,
    workspaceService: {
      ...actual.workspaceService,
    },
  };
});

describe('Workspace Service', () => {
  const mockWorkspace = {
    id: 'test-workspace-id',
    name: 'Test Workspace',
    type: 'professional' as const,
    created_by: 'test-user-id',
    created_at: '2025-04-09T17:39:23.341Z',
    updated_at: '2025-04-09T17:39:23.341Z',
  };

  const mockMember = {
    workspace_id: 'test-workspace-id',
    user_id: 'test-user-id',
    role: 'member' as const,
    joined_at: '2025-04-09T17:39:23.341Z',
    profile: {
      full_name: 'Test User',
    },
  };

  let mockSupabase: MockSupabaseClient;
  let workspaceService: WorkspaceService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = createMockSupabaseClient();
    vi.mocked(createClientComponentClient).mockReturnValue(mockSupabase);
    workspaceService = new WorkspaceService(mockSupabase);
  });

  describe('createWorkspace', () => {
    it('should create a new workspace', async () => {
      const response = createMockSupabaseResponse(mockWorkspace);
      mockSupabase.from('workspaces').insert.mockResolvedValueOnce(response);

      const result = await workspaceService.createWorkspace({
        name: 'Test Workspace',
        type: 'professional',
      });

      expect(result).toEqual(mockWorkspace);
      expect(mockSupabase.from).toHaveBeenCalledWith('workspaces');
      expect(mockSupabase.from('workspaces').insert).toHaveBeenCalled();
    });

    it('should throw an error if creation fails', async () => {
      const response = createMockSupabaseResponse(null, { message: 'Creation failed' });
      mockSupabase.from('workspaces').insert.mockResolvedValueOnce(response);

      await expect(
        workspaceService.createWorkspace({
          name: 'Test Workspace',
          type: 'professional',
        })
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('getWorkspace', () => {
    it('should get a workspace by id', async () => {
      const mockSelect = vi.fn().mockResolvedValue({
        data: mockWorkspace,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        select: mockSelect,
      });

      const result = await workspaceService.getWorkspace('test-workspace-id');

      expect(result).toEqual(mockWorkspace);
      expect(mockSupabase.from).toHaveBeenCalledWith('workspaces');
      expect(mockSelect).toHaveBeenCalled();
    });
  });

  describe('updateWorkspace', () => {
    it('should update a workspace', async () => {
      const updatedWorkspace = { ...mockWorkspace, name: 'Updated Workspace' };
      const mockUpdate = vi.fn().mockResolvedValue({
        data: updatedWorkspace,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        update: mockUpdate,
        eq: vi.fn().mockReturnThis(),
      });

      const result = await workspaceService.updateWorkspace('test-workspace-id', {
        name: 'Updated Workspace',
      });

      expect(result).toEqual(updatedWorkspace);
      expect(mockSupabase.from).toHaveBeenCalledWith('workspaces');
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('deleteWorkspace', () => {
    it('should delete a workspace', async () => {
      const mockDelete = vi.fn().mockResolvedValue({
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        delete: mockDelete,
        eq: vi.fn().mockReturnThis(),
      });

      await workspaceService.deleteWorkspace('test-workspace-id');

      expect(mockSupabase.from).toHaveBeenCalledWith('workspaces');
      expect(mockDelete).toHaveBeenCalled();
    });
  });

  describe('getUserWorkspaces', () => {
    it('should get all workspaces for the user', async () => {
      const mockSelect = vi.fn().mockResolvedValue({
        data: [mockWorkspace],
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        select: mockSelect,
      });

      const result = await workspaceService.getUserWorkspaces();

      expect(result).toEqual([mockWorkspace]);
      expect(mockSupabase.from).toHaveBeenCalledWith('workspaces');
      expect(mockSelect).toHaveBeenCalled();
    });
  });

  describe('workspace members', () => {
    it('should get workspace members', async () => {
      const mockSelect = vi.fn().mockResolvedValue({
        data: [mockMember],
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        select: mockSelect,
      });

      const result = await workspaceService.getWorkspaceMembers('test-workspace-id');

      expect(result).toEqual([mockMember]);
      expect(mockSupabase.from).toHaveBeenCalledWith('workspace_members');
      expect(mockSelect).toHaveBeenCalled();
    });

    it('should invite a workspace member', async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        data: mockMember,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        insert: mockInsert,
      });

      const inviteData: InviteWorkspaceMemberData = {
        email: 'test@example.com',
        role: 'member',
      };

      const result = await workspaceService.inviteWorkspaceMember('test-workspace-id', inviteData);
      expect(result).toEqual(mockMember);
      expect(mockSupabase.from).toHaveBeenCalledWith('workspace_members');
      expect(mockInsert).toHaveBeenCalled();
    });

    it('should remove a workspace member', async () => {
      const mockDelete = vi.fn().mockResolvedValue({
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        delete: mockDelete,
        eq: vi.fn().mockReturnThis(),
      });

      await workspaceService.removeWorkspaceMember('test-workspace-id', 'test-user-id');

      expect(mockSupabase.from).toHaveBeenCalledWith('workspace_members');
      expect(mockDelete).toHaveBeenCalled();
    });

    it('should update a member role', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        update: mockUpdate,
        eq: vi.fn().mockReturnThis(),
      });

      await workspaceService.updateMemberRole('test-workspace-id', 'test-user-id', 'admin');

      expect(mockSupabase.from).toHaveBeenCalledWith('workspace_members');
      expect(mockUpdate).toHaveBeenCalled();
    });
  });
}); 