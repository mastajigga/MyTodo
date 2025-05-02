import type {
  Workspace,
  WorkspaceInsert,
  WorkspaceUpdate,
  CreateWorkspaceData,
  UpdateWorkspaceData,
  WorkspaceMember,
  WorkspaceWithStats,
  WorkspaceType
} from '@/types/workspace'
import { SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { commitGit } from '../utils/gitUtils'
import { getSupabaseClient } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Fonction utilitaire pour obtenir les statistiques d'un espace de travail
async function getWorkspaceStats(workspaceId: string) {
  const supabase = getSupabaseClient()

  // Compter les membres
  const { count: members } = await supabase
    .from('workspace_members')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)

  // Compter les projets
  const { count: projects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)

  // Récupérer les IDs des projets de l'espace de travail
  const { data: projectIds } = await supabase
    .from('projects')
    .select('id')
    .eq('workspace_id', workspaceId)

  // Compter les tâches pour tous les projets de l'espace de travail
  const { count: tasks } = await supabase
    .from('tasks')
    .select('*', { count: 'exact' })
    .eq('workspace_id', workspaceId)

  return {
    members: members || 0,
    projects: projects || 0,
    tasks: tasks || 0
  }
}

// Service principal pour la gestion des espaces de travail
export const workspaceService = {
  // Récupérer tous les espaces de travail de l'utilisateur avec leurs statistiques
  async getWorkspaces(): Promise<WorkspaceWithStats[]> {
    // 1. Récupérer tous les workspaces dont l'utilisateur est membre
    const { data: memberships, error: membershipError } = await supabase
      .from('workspace_members')
      .select(`
        workspace_id,
        workspaces (
          id,
          name,
          description,
          type,
          created_at,
          updated_at,
          owner_id
        )
      `)

    if (membershipError) throw membershipError

    const workspaces = (memberships.map(m => m.workspaces).filter(w => w && typeof w === 'object' && !Array.isArray(w)) as Workspace[])

    // 2. Pour chaque workspace, récupérer les statistiques
    const workspacesWithStats = await Promise.all(
      (workspaces as any[]).map(async (workspace) => {
        // 2.1 Compter les membres
        const { count: membersCount } = await supabase
          .from('workspace_members')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', workspace.id)

        // 2.2 Récupérer tous les projets du workspace
        const { data: projects } = await supabase
          .from('projects')
          .select('id')
          .eq('workspace_id', workspace.id)

        const projectIds = projects?.map(p => p.id) || []

        // 2.3 Compter les tâches de tous les projets
        const { count: tasksCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact' })
          .eq('workspace_id', workspace.id)
          .in('project_id', projectIds)

        return {
          ...workspace,
          description: workspace.description ?? null,
          type: workspace.type as WorkspaceType,
          created_by: workspace.owner_id,
          members_count: membersCount || 0,
          projects_count: projectIds.length,
          tasks_count: tasksCount || 0
        }
      })
    )

    return workspacesWithStats
  },

  // Récupérer un espace de travail spécifique avec ses statistiques
  async getWorkspace(id: string): Promise<WorkspaceWithStats> {
    // 1. Récupérer le workspace
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    // 2. Compter les membres
    const { count: membersCount } = await supabase
      .from('workspace_members')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', id)

    // 3. Récupérer tous les projets
    const { data: projects } = await supabase
      .from('projects')
      .select('id')
      .eq('workspace_id', id)

    const projectIds = projects?.map(p => p.id) || []

    // 4. Compter les tâches de tous les projets
    const { count: tasksCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('workspace_id', id)
      .in('project_id', projectIds)

    return {
      ...workspace,
      description: workspace.description ?? null,
      type: workspace.type as WorkspaceType,
      created_by: (workspace as any).owner_id ?? '',
      members_count: membersCount || 0,
      projects_count: projectIds.length,
      tasks_count: tasksCount || 0
    }
  },

  // Créer un nouvel espace de travail
  async createWorkspace(data: CreateWorkspaceData): Promise<Workspace> {
    const workspaceData = {
      name: data.name,
      description: data.description ?? undefined,
      type: data.type as WorkspaceType,
      owner_id: data.created_by
    }
    
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert(workspaceData)
      .select()
      .single()

    if (workspaceError) {
      throw workspaceError
    }

    // Ajouter le créateur comme membre avec le rôle 'owner'
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspace.id,
        user_id: data.created_by,
        role: 'owner',
        joined_at: new Date().toISOString()
      })

    if (memberError) {
      // Si l'ajout du membre échoue, supprimer l'espace de travail créé
      await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspace.id)
      throw memberError
    }

    // Commit git automatique en dev
    if (process.env.NODE_ENV === 'development') {
      commitGit(`feat(workspace): création de l'espace "${workspace.name}"`)
    }

    return {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description || null,
      type: workspace.type as WorkspaceType,
      created_at: workspace.created_at,
      updated_at: workspace.updated_at,
      created_by: workspace.owner_id
    }
  },

  // Mettre à jour un espace de travail
  async updateWorkspace(id: string, data: UpdateWorkspaceData): Promise<Workspace> {
    const workspaceData = {
      name: data.name,
      description: data.description ?? undefined,
      type: data.type as WorkspaceType,
      updated_at: new Date().toISOString()
    }
    
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .update(workspaceData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description || null,
      type: workspace.type as WorkspaceType,
      created_at: workspace.created_at,
      updated_at: workspace.updated_at,
      created_by: workspace.owner_id
    }
  },

  // Supprimer un espace de travail
  async deleteWorkspace(id: string): Promise<void> {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  },

  // Inviter un utilisateur à rejoindre l'espace de travail
  async inviteToWorkspace(workspaceId: string, email: string): Promise<boolean> {
    const supabase = getSupabaseClient()

    // Vérifier si l'utilisateur existe
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (userError || !user) {
      throw new Error("Cet utilisateur n'existe pas")
    }

    // Vérifier si l'utilisateur est déjà membre
    const { data: existingMember, error: memberError } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single()

    if (existingMember) {
      throw new Error("Cet utilisateur est déjà membre de l'espace de travail")
    }

    // Ajouter le membre
    const { error } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspaceId,
        user_id: user.id,
        role: 'member',
        joined_at: new Date().toISOString()
      })

    if (error) throw error

    return true
  },

  // Récupérer les membres d'un espace de travail
  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const supabase = getSupabaseClient()
    
    const { data: members, error } = await supabase
      .from('workspace_members')
      .select(`
        workspace_id,
        user_id,
        role,
        joined_at,
        users (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq('workspace_id', workspaceId)

    if (error) {
      throw error
    }

    return members.map(member => ({
      workspace_id: member.workspace_id,
      user_id: member.user_id,
      role: member.role,
      joined_at: member.joined_at,
      user: member.users
    }))
  }
}

// Exporter les fonctions individuelles pour une utilisation plus simple
export const {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  inviteToWorkspace,
  getWorkspaceMembers
} = workspaceService 