import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Tables } from '@/lib/database.types'

export type Project = Tables<'projects'>

export async function getProject(id: string, supabase: SupabaseClient): Promise<Project | null> {
  try {
    const { data, error } = await supabase.from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting project:', error)
    return null
  }
}

export async function getProjects(workspaceId: string, supabase: SupabaseClient): Promise<Project[]> {
  try {
    const { data, error } = await supabase.from('projects')
      .select('*')
      .eq('workspace_id', workspaceId)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting projects:', error)
    return []
  }
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>, supabase: SupabaseClient): Promise<Project | null> {
  try {
    const { data, error } = await supabase.from('projects')
      .insert(project)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating project:', error)
    return null
  }
}

export async function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>, supabase: SupabaseClient): Promise<Project | null> {
  try {
    const { data, error } = await supabase.from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating project:', error)
    return null
  }
}

export async function deleteProject(id: string, supabase: SupabaseClient): Promise<boolean> {
  try {
    const { error } = await supabase.from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting project:', error)
    return false
  }
}

export function subscribeToProjects(workspaceId: string, callback: (projects: Project[]) => void, supabase: SupabaseClient): () => void {
  const subscription = supabase.channel('projects_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: `workspace_id=eq.${workspaceId}`
      },
      async () => {
        const { data } = await supabase.from('projects')
          .select('*')
          .eq('workspace_id', workspaceId)
        
        if (data) {
          callback(data)
        }
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}

export const ProjectService = {
  async getProjects(supabase: SupabaseClient) {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) throw error;
    return data;
  },
  // ... refactorise les autres méthodes de la même façon ...
}; 