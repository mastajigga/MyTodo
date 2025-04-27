import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Workspace, WorkspaceInsert, WorkspaceUpdate } from '@/types/workspace';

const supabase = createClientComponentClient();

export const workspaceService = {
  async create(workspace: WorkspaceInsert): Promise<Workspace> {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert(workspace)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw error;
    }
  },

  async update(id: string, workspace: WorkspaceUpdate): Promise<Workspace> {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .update(workspace)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating workspace:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting workspace:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Workspace | null> {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting workspace:', error);
      throw error;
    }
  },

  async getAll(): Promise<Workspace[]> {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting workspaces:', error);
      throw error;
    }
  },

  async getByUserId(userId: string): Promise<Workspace[]> {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select()
        .eq('owner_id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user workspaces:', error);
      throw error;
    }
  },

  async getWorkspaceMembers(workspaceId: string) {
    const { data, error } = await supabase
      .from('workspace_members')
      .select(`
        *,
        user:user_id (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq('workspace_id', workspaceId);

    if (error) throw error;
    return data;
  }
}; 