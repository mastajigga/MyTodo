import { Database } from '@/lib/types/supabase';
import { createClient } from '@/lib/supabase/client';

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

const supabase = createClient();

export const projectService = {
  async getProjects(workspaceId?: string) {
    const query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (workspaceId) {
      query.eq('workspace_id', workspaceId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  },

  async createProject(project: ProjectInsert) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateProject(id: string, project: ProjectUpdate) {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  async getProjectById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}; 