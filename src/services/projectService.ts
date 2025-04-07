import { supabase, type SupabasePayload, type SupabaseSubscription } from '@/lib/supabase/client'
import { Project, CreateProjectData, UpdateProjectData } from '@/types/project'

export const projectService = {
  async getProjects(workspaceId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createProject(projectData: CreateProjectData): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateProject(id: string, projectData: UpdateProjectData): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async reorderProjects(projects: Project[]): Promise<void> {
    const { error } = await supabase.rpc('reorder_projects', {
      project_ids: projects.map(p => p.id)
    })

    if (error) throw error
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
        callback(payload.new as Project)
      })
      .subscribe()
  }
} 