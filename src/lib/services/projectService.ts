import { Database } from '@/types/supabase';
import { supabase } from '@/lib/supabase/client';

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Omit<Database['public']['Tables']['projects']['Insert'], 'workspace_id'> & {
  workspace_id?: string;
};
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export const projectService = {
  async getProjects(workspaceId?: string) {
    let query = supabase
      .from('projects')
      .select(`
        *,
        workspace:workspaces(id, name),
        members:project_members(count)
      `);
    
    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  },

  async getProject(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        workspace:workspaces(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async createProject(project: ProjectInsert) {
    const projectData = { ...project };
    if (!projectData.workspace_id) {
      delete projectData.workspace_id;
    }

    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select(`
        *,
        workspace:workspaces(id, name)
      `)
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
      .select(`
        *,
        workspace:workspaces(id, name)
      `)
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
      .select(`
        *,
        workspace:workspaces(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}; 