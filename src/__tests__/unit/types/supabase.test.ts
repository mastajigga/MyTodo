import { Database } from '@/types/supabase';
import { WorkspaceType } from '@/types/workspace';

describe('Type Definitions', () => {
  it('should validate workspace types', () => {
    type DbWorkspaceType = Database['public']['Tables']['workspaces']['Row']['type'];
    
    // Test de compilation TypeScript pour les types de workspace
    const workspaceTypes: DbWorkspaceType[] = ['family', 'professional', 'private'];
    expect(workspaceTypes).toContain('family');
    expect(workspaceTypes).toContain('professional');
    expect(workspaceTypes).toContain('private');

    // Test de compilation TypeScript pour les types d'application
    const appWorkspaceTypes: WorkspaceType[] = ['family', 'professional', 'private'];
    expect(appWorkspaceTypes).toContain('family');
    expect(appWorkspaceTypes).toContain('professional');
    expect(appWorkspaceTypes).toContain('private');
  });

  it('should validate task types', () => {
    type TaskStatus = Database['public']['Tables']['tasks']['Row']['status'];
    type TaskPriority = Database['public']['Tables']['tasks']['Row']['priority'];

    // Test des statuts de tâche valides
    const validStatuses: TaskStatus[] = ['pending', 'in-progress', 'completed'];
    expect(validStatuses).toContain('pending');
    expect(validStatuses).toContain('in-progress');
    expect(validStatuses).toContain('completed');

    // Test des priorités de tâche valides
    const validPriorities: TaskPriority[] = ['low', 'medium', 'high'];
    expect(validPriorities).toContain('low');
    expect(validPriorities).toContain('medium');
    expect(validPriorities).toContain('high');
  });

  it('should validate workspace member roles', () => {
    type MemberRole = Database['public']['Tables']['workspace_members']['Row']['role'];

    // Test des rôles de membre valides
    const validRoles: MemberRole[] = ['owner', 'admin', 'member'];
    expect(validRoles).toContain('owner');
    expect(validRoles).toContain('admin');
    expect(validRoles).toContain('member');
  });
}); 