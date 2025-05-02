import { Database } from '@/types/database.types'
import { createClient } from '@supabase/supabase-js'

type Tables = Database['public']['Tables']

// Types pour les tâches
export type Task = Tables['tasks']['Row']
export type TaskInsert = Tables['tasks']['Insert']
export type TaskUpdate = Tables['tasks']['Update']

// Types pour les workspaces
export type Workspace = Tables['workspaces']['Row']
export type WorkspaceInsert = Tables['workspaces']['Insert']
export type WorkspaceUpdate = Tables['workspaces']['Update']

// Types pour les projets
export type Project = Tables['projects']['Row']
export type ProjectInsert = Tables['projects']['Insert']
export type ProjectUpdate = Tables['projects']['Update']

// Types pour les membres de projet
export type ProjectMember = Tables['project_members']['Row']
export type ProjectMemberInsert = Tables['project_members']['Insert']
export type ProjectMemberUpdate = Tables['project_members']['Update']

// Énumérations
export type WorkspaceType = 'family' | 'professional' | 'private'
export type ProjectStatus = 'active' | 'archived' | 'completed'
export type ProjectRole = 'owner' | 'admin' | 'member'

// Labels et couleurs pour les types de workspace
export const workspaceTypeLabels: Record<WorkspaceType, string> = {
  family: 'Famille',
  professional: 'Professionnel',
  private: 'Privé'
}

export const workspaceTypeColors: Record<WorkspaceType, string> = {
  family: 'bg-green-100 text-green-800',
  professional: 'bg-blue-100 text-blue-800',
  private: 'bg-purple-100 text-purple-800'
}

// Labels et couleurs pour les statuts de projet
export const projectStatusLabels: Record<ProjectStatus, string> = {
  active: 'Actif',
  archived: 'Archivé',
  completed: 'Terminé'
}

export const projectStatusColors: Record<ProjectStatus, string> = {
  active: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
  completed: 'bg-blue-100 text-blue-800'
}

// Labels et couleurs pour les rôles de projet
export const projectRoleLabels: Record<ProjectRole, string> = {
  owner: 'Propriétaire',
  admin: 'Administrateur',
  member: 'Membre'
}

export const projectRoleColors: Record<ProjectRole, string> = {
  owner: 'bg-purple-100 text-purple-800',
  admin: 'bg-yellow-100 text-yellow-800',
  member: 'bg-gray-100 text-gray-800'
}

// Interface pour les statistiques de workspace
export interface WorkspaceWithStats extends Workspace {
  _count: {
    projects: number
    members: number
    tasks: number
  }
}

// Type pour les réponses de Supabase
export type SupabaseResponse<T> = {
  data: T | null
  error: Error | null
}

// Client Supabase singleton
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return supabaseClient
} 