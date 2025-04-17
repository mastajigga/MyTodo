import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

const supabase = createClientComponentClient<Database>();

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  type: 'family' | 'professional' | 'private';
  created_by: string;
  created_at: string;
  updated_at: string;
}

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

  async getWorkspace(id: string): Promise<Workspace | null> {
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

  async createWorkspace(name: string, description?: string, type: string = 'private'): Promise<Workspace> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('Utilisateur non connecté');

    // Créer le workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        name,
        description,
        type,
        created_by: user.id,
      })
      .select()
      .single();

    if (workspaceError) throw workspaceError;

    // Ajouter le créateur comme propriétaire
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: 'owner',
      });

    if (memberError) throw memberError;

    return workspace;
  },

  async updateWorkspace(id: string, input: UpdateWorkspaceInput): Promise<Workspace> {
    const { data, error } = await supabase
      .from('workspaces')
      .update(input)
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