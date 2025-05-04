import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Project, CreateProjectData, UpdateProjectData } from '@/types/project';
import type { SupabasePayload, SupabaseSubscription } from '@/lib/supabase/client';
import { supabaseRealtime } from '@/lib/supabase/realtime-client';

export const ProjectService = {
  async createProject(data: CreateProjectData, supabase: SupabaseClient): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return project;
  },

  async updateProject(id: string, data: UpdateProjectData, supabase: SupabaseClient): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return project;
  },

  async deleteProject(id: string, supabase: SupabaseClient): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getProject(id: string, supabase: SupabaseClient): Promise<Project> {
    console.log('[ProjectService.getProject] Récupération du projet avec id:', id);
    const { data: project, error } = await supabase
      .from('projects')
      .select('*, tasks(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[ProjectService.getProject] Erreur:', error);
      throw error;
    }
    console.log('[ProjectService.getProject] Projet récupéré:', project);
    return project;
  },

  async getWorkspaceProjects(workspaceId: string, supabase: SupabaseClient): Promise<Project[]> {
    console.log('[ProjectService.getWorkspaceProjects] workspaceId utilisé :', workspaceId);
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    console.log('[ProjectService.getWorkspaceProjects] projets récupérés :', projects);
    if (error) throw error;
    return projects;
  },

  async getProjectStats(id: string, supabase: SupabaseClient) {
    const { data: stats, error } = await supabase
      .from('tasks')
      .select('status')
      .eq('project_id', id);

    if (error) throw error;

    const total = stats.length;
    const completed = stats.filter(task => task.status === 'completed').length;
    const inProgress = stats.filter(task => task.status === 'in_progress').length;
    const todo = stats.filter(task => task.status === 'todo').length;

    return {
      total,
      completed,
      inProgress,
      todo,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  },

  async reorderProjects(projects: Project[], supabase: SupabaseClient): Promise<void> {
    const { error } = await supabase.rpc('reorder_projects', {
      project_ids: projects.map(p => p.id)
    });

    if (error) throw error;
  },

  subscribeToProjects(workspaceId: string, callback: (project: Project) => void): SupabaseSubscription | undefined {
    return supabaseRealtime
      .channel(`projects_realtime_${workspaceId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: `workspace_id=eq.${workspaceId}`
      }, (payload: SupabasePayload) => {
        if (payload.new) {
          callback(payload.new as Project);
        } else if (payload.old) {
          callback(payload.old as Project);
        }
      })
      .subscribe();
  },

  async getProjects(supabase: SupabaseClient) {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) throw error;
    return data;
  }
}; 