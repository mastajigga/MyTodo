import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Workspace,
  WorkspaceMember,
  CreateWorkspaceData,
  UpdateWorkspaceData,
  InviteWorkspaceMemberData,
} from '@/types/workspace';

const supabase = createClientComponentClient();

export const workspaceService = {
  async createWorkspace(data: CreateWorkspaceData): Promise<Workspace> {
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert([
        {
          ...data,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        },
      ])
      .select('*')
      .single();

    if (error) throw error;
    return workspace;
  },

  async getWorkspace(id: string): Promise<Workspace> {
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return workspace;
  },

  async updateWorkspace(id: string, data: UpdateWorkspaceData): Promise<Workspace> {
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return workspace;
  },

  async deleteWorkspace(id: string): Promise<void> {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getUserWorkspaces(): Promise<Workspace[]> {
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return workspaces;
  },

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
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
    data: InviteWorkspaceMemberData
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
    userId: string
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
    role: WorkspaceMember['role']
  ): Promise<void> {
    const { error } = await supabase
      .from('workspace_members')
      .update({ role })
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);

    if (error) throw error;
  },
}; 