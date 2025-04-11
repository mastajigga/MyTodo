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

export class WorkspaceService {
  static async getWorkspaces(): Promise<Workspace[]> {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

  static async getWorkspace(id: string): Promise<Workspace | null> {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Non authentifié');
    }

    const { data, error } = await supabase
      .from('workspaces')
      .insert([{
        ...input,
        created_by: user.id,
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async updateWorkspace(id: string, input: UpdateWorkspaceInput): Promise<Workspace> {
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
  }

  static async deleteWorkspace(id: string): Promise<void> {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
} 