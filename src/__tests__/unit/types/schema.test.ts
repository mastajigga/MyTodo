import { z } from 'zod';
import type { Database } from '@/types/supabase';

// Schéma pour le workspace
const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.enum(['family', 'team', 'personal']),
  owner_id: z.string(),
  created_by: z.string(),
  created_at: z.string(),
  updated_at: z.string()
});

// Schéma pour les tâches
const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  project_id: z.string(),
  status: z.enum(['pending', 'in-progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  position: z.number(),
  due_date: z.string().nullable(),
  created_by: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  workspace_id: z.string().nullable()
});

// Schéma pour les membres d'un workspace
const WorkspaceMemberSchema = z.object({
  workspace_id: z.string(),
  user_id: z.string(),
  role: z.enum(['owner', 'admin', 'member']),
  joined_at: z.string()
});

describe('Schema Validation', () => {
  describe('Workspace Schema', () => {
    it('should validate a valid workspace', () => {
      const mockWorkspace: Database['public']['Tables']['workspaces']['Row'] = {
        id: '123',
        name: 'Test Workspace',
        description: 'Test Description',
        type: 'family',
        owner_id: 'user-123',
        created_by: 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const result = WorkspaceSchema.safeParse(mockWorkspace);
      expect(result.success).toBe(true);
    });

    it('should reject invalid workspace type', () => {
      const mockWorkspace = {
        id: '123',
        name: 'Test Workspace',
        description: 'Test Description',
        type: 'invalid-type', // Type invalide
        owner_id: 'user-123',
        created_by: 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const result = WorkspaceSchema.safeParse(mockWorkspace);
      expect(result.success).toBe(false);
    });
  });

  describe('Task Schema', () => {
    it('should validate a valid task', () => {
      const mockTask: Database['public']['Tables']['tasks']['Row'] = {
        id: '123',
        title: 'Test Task',
        description: 'Test Description',
        project_id: 'project-123',
        status: 'pending',
        priority: 'medium',
        position: 1,
        due_date: new Date().toISOString(),
        created_by: 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        workspace_id: 'workspace-123'
      };
      
      const result = TaskSchema.safeParse(mockTask);
      expect(result.success).toBe(true);
    });

    it('should reject invalid task status', () => {
      const mockTask = {
        id: '123',
        title: 'Test Task',
        description: 'Test Description',
        project_id: 'project-123',
        status: 'invalid-status', // Statut invalide
        priority: 'medium',
        position: 1,
        due_date: new Date().toISOString(),
        created_by: 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        workspace_id: 'workspace-123'
      };
      
      const result = TaskSchema.safeParse(mockTask);
      expect(result.success).toBe(false);
    });
  });

  describe('Workspace Member Schema', () => {
    it('should validate a valid workspace member', () => {
      const mockMember: Database['public']['Tables']['workspace_members']['Row'] = {
        workspace_id: 'workspace-123',
        user_id: 'user-123',
        role: 'member',
        joined_at: new Date().toISOString()
      };
      
      const result = WorkspaceMemberSchema.safeParse(mockMember);
      expect(result.success).toBe(true);
    });

    it('should reject invalid member role', () => {
      const mockMember = {
        workspace_id: 'workspace-123',
        user_id: 'user-123',
        role: 'invalid-role', // Rôle invalide
        joined_at: new Date().toISOString()
      };
      
      const result = WorkspaceMemberSchema.safeParse(mockMember);
      expect(result.success).toBe(false);
    });
  });
}); 