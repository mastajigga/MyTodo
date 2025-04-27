import type {
  Workspace,
  WorkspaceInsert,
  WorkspaceUpdate,
  CreateWorkspaceData,
  UpdateWorkspaceData,
  WorkspaceMember,
  InviteWorkspaceMemberData
} from '@/types/supabase'
import { SupabaseClient } from '@supabase/auth-helpers-nextjs'

export const workspaceService = {
  async getUserWorkspaces(supabase: SupabaseClient): Promise<Workspace[]> {
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return workspaces;
  },

  async createWorkspace(supabase: SupabaseClient, workspace: WorkspaceInsert) {
    const { data, error } = await supabase
      .from('workspaces')
      .insert(workspace)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateWorkspace(supabase: SupabaseClient, id: string, workspace: WorkspaceUpdate) {
    const { data, error } = await supabase
      .from('workspaces')
      .update(workspace)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteWorkspace(supabase: SupabaseClient, id: string) {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  async getWorkspaceById(supabase: SupabaseClient, id: string) {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async inviteToWorkspace(supabase: SupabaseClient, workspaceId: string, email: string) {
    // Vérifier si l'utilisateur existe
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !user) {
      throw new Error("Cet utilisateur n'existe pas");
    }

    // Vérifier si l'utilisateur est déjà membre
    const { data: existingMember, error: memberError } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      throw new Error("Cet utilisateur est déjà membre de l'espace de travail");
    }

    // Ajouter le membre
    const { error } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspaceId,
        user_id: user.id,
        role: 'member'
      });

    if (error) throw error;

    return true;
  }
}; 