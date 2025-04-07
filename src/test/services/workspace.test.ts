import { describe, it, expect, vi, beforeEach } from 'vitest';
import { workspaceService } from '@/services/workspace';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
    },
  })),
}));

describe('Workspace Service', () => {
  const mockWorkspace = {
    id: 'test-workspace-id',
    name: 'Test Workspace',
    type: 'professional',
    created_by: 'test-user-id',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockSupabase = createClientComponentClient();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createWorkspace', () => {
    it('should create a new workspace', async () => {
      vi.mocked(mockSupabase.from('workspaces').single).mockResolvedValueOnce({
        data: mockWorkspace,
        error: null,
      });

      const result = await workspaceService.createWorkspace({
        name: 'Test Workspace',
        type: 'professional',
      });

      expect(result).toEqual(mockWorkspace);
      expect(mockSupabase.from).toHaveBeenCalledWith('workspaces');
    });

    it('should throw an error if creation fails', async () => {
      vi.mocked(mockSupabase.from('workspaces').single).mockResolvedValueOnce({
        data: null,
        error: new Error('Creation failed'),
      });

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
      vi.mocked(mockSupabase.from('workspaces').single).mockResolvedValueOnce({
        data: mockWorkspace,
        error: null,
      });

      const result = await workspaceService.getWorkspace('test-workspace-id');

      expect(result).toEqual(mockWorkspace);
      expect(mockSupabase.from).toHaveBeenCalledWith('workspaces');
    });
  });

  describe('updateWorkspace', () => {
    it('should update a workspace', async () => {
      const updatedWorkspace = { ...mockWorkspace, name: 'Updated Workspace' };
      vi.mocked(mockSupabase.from('workspaces').single).mockResolvedValueOnce({
        data: updatedWorkspace,
        error: null,
      });

      const result = await workspaceService.updateWorkspace('test-workspace-id', {
        name: 'Updated Workspace',
      });

      expect(result).toEqual(updatedWorkspace);
    });
  });

  describe('deleteWorkspace', () => {
    it('should delete a workspace', async () => {
      vi.mocked(mockSupabase.from('workspaces').eq).mockResolvedValueOnce({
        error: null,
      });

      await expect(
        workspaceService.deleteWorkspace('test-workspace-id')
      ).resolves.not.toThrow();
    });
  });

  describe('getUserWorkspaces', () => {
    it('should get all workspaces for the user', async () => {
      vi.mocked(mockSupabase.from('workspaces').order).mockResolvedValueOnce({
        data: [mockWorkspace],
        error: null,
      });

      const result = await workspaceService.getUserWorkspaces();

      expect(result).toEqual([mockWorkspace]);
    });
  });

  describe('workspace members', () => {
    const mockMember = {
      workspace_id: 'test-workspace-id',
      user_id: 'test-user-id',
      role: 'member',
      joined_at: new Date().toISOString(),
      profile: {
        full_name: 'Test User',
      },
    };

    it('should get workspace members', async () => {
      vi.mocked(mockSupabase.from('workspace_members').eq).mockResolvedValueOnce({
        data: [mockMember],
        error: null,
      });

      const result = await workspaceService.getWorkspaceMembers('test-workspace-id');

      expect(result).toEqual([mockMember]);
    });

    it('should invite a workspace member', async () => {
      vi.mocked(mockSupabase.from('profiles').single).mockResolvedValueOnce({
        data: { id: 'test-user-id' },
        error: null,
      });

      vi.mocked(mockSupabase.from('workspace_members').insert).mockResolvedValueOnce({
        error: null,
      });

      await expect(
        workspaceService.inviteWorkspaceMember('test-workspace-id', {
          email: 'test@example.com',
          role: 'member',
        })
      ).resolves.not.toThrow();
    });

    it('should remove a workspace member', async () => {
      vi.mocked(mockSupabase.from('workspace_members').eq).mockResolvedValueOnce({
        error: null,
      });

      await expect(
        workspaceService.removeWorkspaceMember('test-workspace-id', 'test-user-id')
      ).resolves.not.toThrow();
    });

    it('should update a member role', async () => {
      vi.mocked(mockSupabase.from('workspace_members').eq).mockResolvedValueOnce({
        error: null,
      });

      await expect(
        workspaceService.updateMemberRole('test-workspace-id', 'test-user-id', 'admin')
      ).resolves.not.toThrow();
    });
  });
}); 