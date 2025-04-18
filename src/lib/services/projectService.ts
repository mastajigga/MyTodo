import { Database } from '../../lib/database.types';
import { supabase } from '@/lib/supabase/client';

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectFormValues = {
  name: string;
  description?: string;
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

  async createProject(project: ProjectFormValues) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    const projectData: Database['public']['Tables']['projects']['Insert'] = {
      name: project.name,
      description: project.description || null,
      workspace_id: project.workspace_id!,
      created_by: user.id,
      status: null,
      is_archived: false
    };

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