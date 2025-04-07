import { createClient } from '@supabase/supabase-js';
import { describe, it, expect, beforeAll } from 'vitest';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

describe('Database Tables', () => {
  const expectedTables = [
    'profiles',
    'workspaces',
    'workspace_members',
    'projects',
    'tasks',
    'subtasks',
    'comments',
    'attachments',
    'tags',
    'task_tags',
    'notifications',
    'task_dependencies'
  ];

  it('should have all required tables', async () => {
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    expect(error).toBeNull();
    expect(tables).not.toBeNull();

    const tableNames = tables!.map(t => t.table_name);
    expectedTables.forEach(tableName => {
      expect(tableNames).toContain(tableName);
    });
  });

  it('should have correct RLS policies', async () => {
    const { data: policies, error } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('schemaname', 'public');

    expect(error).toBeNull();
    expect(policies).not.toBeNull();

    // Vérifier les politiques essentielles
    const policyNames = policies!.map(p => p.policyname);
    expect(policyNames).toContain('Users can view their own profile');
    expect(policyNames).toContain('Members can view workspace');
    expect(policyNames).toContain('Admins can update workspace');
    expect(policyNames).toContain('Members can view projects');
    expect(policyNames).toContain('Members can view tasks');
  });

  it('should have correct relationships', async () => {
    // Test quelques relations clés
    const testRelations = async (tableName: string, columnName: string, referencedTable: string) => {
      const { data, error } = await supabase
        .from('information_schema.key_column_usage')
        .select('*')
        .eq('table_name', tableName)
        .eq('column_name', columnName);

      expect(error).toBeNull();
      expect(data).not.toBeNull();
      expect(data!.length).toBeGreaterThan(0);
      expect(data![0].referenced_table_name).toBe(referencedTable);
    };

    await testRelations('workspace_members', 'workspace_id', 'workspaces');
    await testRelations('tasks', 'project_id', 'projects');
    await testRelations('subtasks', 'task_id', 'tasks');
  });
}); 