import { describe, it, expect, beforeEach, vi } from 'vitest';
import { workspaceService } from '@/services/workspace';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { InviteWorkspaceMemberData } from '@/types/workspace';
import type { SupabaseClient } from '@supabase/supabase-js';

// Mock Supabase
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn(),
}));

describe('Workspace Service', () => {
  const mockWorkspace = {
    id: 'test-workspace-id',
    name: 'Test Workspace',
    type: 'professional',
    created_by: 'test-user-id',
    created_at: '2025-04-09T17:39:23.341Z',
    updated_at: '2025-04-09T17:39:23.341Z',
  };

  const mockMember = {
    workspace_id: 'test-workspace-id',
    user_id: 'test-user-id',
    role: 'member',
    joined_at: '2025-04-09T17:39:23.341Z',
    profile: {
      full_name: 'Test User',
    },
  };

  const createMockSupabase = () => ({
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
      update: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
      delete: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    }),
  });

  let mockSupabase: ReturnType<typeof createMockSupabase>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = createMockSupabase();
    (createClientComponentClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
  });

  describe('createWorkspace', () => {
    it('should create a new workspace', async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        data: mockWorkspace,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        insert: mockInsert,
      });

      const result = await workspaceService.createWorkspace({
        name: 'Test Workspace',
        type: 'professional',
      });

      expect(result).toEqual(mockWorkspace);
      expect(mockSupabase.from).toHaveBeenCalledWith('workspaces');
      expect(mockInsert).toHaveBeenCalled();
    });

    it('should throw an error if creation fails', async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Creation failed' },
      });

      mockSupabase.from.mockReturnValue({
        ...mockSupabase.from(),
        insert: mockInsert,
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