import { Database } from '../../lib/database.types';
// import { supabase } from '@/lib/supabase/client';
import { commitGit } from '../utils/gitUtils'
import type { SupabaseClient } from '@supabase/supabase-js';

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectFormValues = {
  name: string;
  description?: string;
  workspace_id?: string;
};
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export const projectService = {
  async getProjects(supabase: SupabaseClient, workspaceId?: string) {
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

  async getProject(supabase: SupabaseClient, id: string) {
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

  async createProject(supabase: SupabaseClient, project: ProjectFormValues) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    const projectData: Database['public']['Tables']['projects']['Insert'] = {
      name: project.name,
      description: project.description || null,
      workspace_id: project.workspace_id!,
      color: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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

    // Commit git automatique en dev
    if (data && data.name) {
      commitGit(`feat(project): création du projet "${data.name}"`)
    }

    return data;
  },

  async updateProject(supabase: SupabaseClient, id: string, project: ProjectUpdate) {
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

  async deleteProject(supabase: SupabaseClient, id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  async getProjectById(supabase: SupabaseClient, id: string) {
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