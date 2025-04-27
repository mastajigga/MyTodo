import { Database } from './database.types'

// Types de base générés par Supabase
export type Tables = Database['public']['Tables']

// Workspace types
export enum WorkspaceType {
  Family = 'family',
  Professional = 'professional',
  Private = 'private'
}

export type Workspace = Database['public']['Tables']['workspaces']['Row']

// Workspace member types
export type WorkspaceMember = Database['public']['Tables']['workspace_members']['Row']

// Constantes pour l'interface utilisateur
export const workspaceTypeLabels: Record<WorkspaceType, string> = {
  [WorkspaceType.Family]: 'Famille',
  [WorkspaceType.Professional]: 'Professionnel',
  [WorkspaceType.Private]: 'Privé'
}

export const workspaceTypeColors: Record<WorkspaceType, string> = {
  [WorkspaceType.Family]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [WorkspaceType.Professional]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [WorkspaceType.Private]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
}

// Types pour les opérations CRUD
export interface CreateWorkspaceData {
  name: string
  description?: string
  type: WorkspaceType
}

export interface UpdateWorkspaceData {
  name?: string
  description?: string
  type?: WorkspaceType
}

export type WorkspaceInsert = Database['public']['Tables']['workspaces']['Insert']
export type WorkspaceUpdate = Database['public']['Tables']['workspaces']['Update']

// Type utilitaire pour les réponses Supabase
export type SupabaseResponse<T> = {
  data: T | null
  error: Error | null
} 