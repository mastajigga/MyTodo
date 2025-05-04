// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';
import {
  Workspace,
  WorkspaceMember,
  CreateWorkspaceData,
  UpdateWorkspaceData,
  InviteWorkspaceMemberData,
} from '@/types/workspace';

// const supabase = createClientComponentClient<Database>()

export const workspaceService = {
  async createWorkspace(name: string, description: string, supabase: SupabaseClient<Database>) {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    if (!user) throw new Error('Utilisateur non authentifié')

    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert([{ name, description, owner_id: user.id }])
      .select()
      .single()

    if (error) throw error

    // Ajouter le créateur comme membre avec le rôle OWNER
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert([
        {
          workspace_id: workspace.id,
          user_id: user.id,
          role: 'OWNER'
        }
      ])

    if (memberError) throw memberError

    return workspace
  },

  async getWorkspace(id: string, supabase: SupabaseClient<Database>): Promise<Workspace> {
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return workspace;
  },

  async updateWorkspace(id: string, data: UpdateWorkspaceData, supabase: SupabaseClient<Database>): Promise<Workspace> {
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return workspace;
  },

  async deleteWorkspace(id: string, supabase: SupabaseClient<Database>): Promise<void> {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getUserWorkspaces(supabase: SupabaseClient<Database>): Promise<Workspace[]> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) return [];

    const { data, error } = await supabase
      .from('workspace_members')
      .select('workspaces(*)')
      .eq('user_id', user.id);

    if (error) throw error;
    // On mappe pour ne garder que les workspaces
    return (data || []).map((m: any) => m.workspaces).filter(Boolean);
  },

  async getWorkspaceMembers(workspaceId: string, supabase: SupabaseClient<Database>): Promise<WorkspaceMember[]> {
    const { data: members, error } = await supabase
      .from('workspace_members')
      .select(`
        *,
        profile:profiles(full_name, avatar_url)
      `)
      .eq('workspace_id', workspaceId);

    if (error) throw error;
    return members;
  },

  async inviteWorkspaceMember(
    workspaceId: string,
    data: InviteWorkspaceMemberData,
    supabase: SupabaseClient<Database>
  ): Promise<void> {
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', data.email)
      .single();

    if (!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }

    const { error } = await supabase.from('workspace_members').insert([
      {
        workspace_id: workspaceId,
        user_id: existingUser.id,
        role: data.role,
      },
    ]);

    if (error) throw error;
  },

  async removeWorkspaceMember(
    workspaceId: string,
    userId: string,
    supabase: SupabaseClient<Database>
  ): Promise<void> {
    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async updateMemberRole(
    workspaceId: string,
    userId: string,
    role: WorkspaceMember['role'],
    supabase: SupabaseClient<Database>
  ): Promise<void> {
    const { error } = await supabase
      .from('workspace_members')
      .update({ role })
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async checkWorkspaceAccess(workspaceId: string, supabase: SupabaseClient<Database>): Promise<{ exists: boolean; accessible: boolean; details: Workspace | null }> {
    try {
      const { data: workspace, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { exists: false, accessible: false, details: null };
        }
        throw error;
      }

      const { data: membership } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      return {
        exists: true,
        accessible: !!membership,
        details: workspace
      };
    } catch (error) {
      console.error('Erreur lors de la vérification du workspace:', error);
      return { exists: false, accessible: false, details: null };
    }
  },
}; 