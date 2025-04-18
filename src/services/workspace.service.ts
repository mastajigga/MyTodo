import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../lib/database.types';

const supabase = createClientComponentClient<Database>();

export type Workspace = Database['public']['Tables']['workspaces']['Row'];
export type WorkspaceInsert = Database['public']['Tables']['workspaces']['Insert'];
export type WorkspaceUpdate = Database['public']['Tables']['workspaces']['Update'];

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
  type: 'family' | 'professional' | 'private';
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
  type?: 'family' | 'professional' | 'private';
}

export const WorkspaceService = {
  async getWorkspaces(): Promise<Workspace[]> {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  },

  async createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const workspaceData: WorkspaceInsert = {
      name: input.name,
      description: input.description || null,
      type: input.type,
      owner_id: userId,
      created_by: userId
    };

    const { data, error } = await supabase
      .from('workspaces')
      .insert(workspaceData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateWorkspace(id: string, input: UpdateWorkspaceInput): Promise<Workspace> {
    const updateData: WorkspaceUpdate = {
      name: input.name,
      description: input.description,
      type: input.type
    };

    const { data, error } = await supabase
      .from('workspaces')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteWorkspace(id: string): Promise<void> {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  async getWorkspaceById(id: string): Promise<Workspace | null> {
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