import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export interface WorkspaceMember {
  id: string;
  user_id: string;
  workspace_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  updated_at: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
}

export const WorkspaceMemberService = {
  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const { data: members, error } = await supabase
      .from('workspace_members')
      .select(`
        *,
        users:user_id (
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('workspace_id', workspaceId);

    if (error) throw error;

    return members.map(member => ({
      ...member,
      full_name: member.users?.full_name,
      email: member.users?.email,
      avatar_url: member.users?.avatar_url
    }));
  },

  async addWorkspaceMember(workspaceId: string, email: string, role: WorkspaceMember['role']): Promise<WorkspaceMember> {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError) throw userError;

    const { data: member, error } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspaceId,
        user_id: user.id,
        role
      })
      .select()
      .single();

    if (error) throw error;
    return member;
  },

  async updateMemberRole(memberId: string, role: WorkspaceMember['role']): Promise<WorkspaceMember> {
    const { data: member, error } = await supabase
      .from('workspace_members')
      .update({ role })
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    return member;
  },

  async removeWorkspaceMember(memberId: string): Promise<void> {
    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;
  }
}; 