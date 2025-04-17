import { getSupabaseClient } from '@/lib/supabase/client';
import { Project, CreateProjectData, UpdateProjectData } from '@/types/project';
import { SupabasePayload, SupabaseSubscription } from '@/lib/supabase/client';

const supabase = getSupabaseClient();

export const ProjectService = {
  async createProject(data: CreateProjectData): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return project;
  },

  async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return project;
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getProject(id: string): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*, tasks(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return project;
  },

  async getWorkspaceProjects(workspaceId: string): Promise<Project[]> {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return projects;
  },

  async getProjectStats(id: string) {
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

  async reorderProjects(projects: Project[]): Promise<void> {
    const { error } = await supabase.rpc('reorder_projects', {
      project_ids: projects.map(p => p.id)
    });

    if (error) throw error;
  },

  subscribeToProjects(workspaceId: string, callback: (project: Project) => void): SupabaseSubscription {
    return supabase
      .channel(`projects:${workspaceId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: `workspace_id=eq.${workspaceId}`
      }, (payload: SupabasePayload) => {
        callback(payload.new as Project);
      })
      .subscribe();
  }
}; 