import type { Database } from '@/lib/database.types'

// Types pour les espaces de travail
export type WorkspaceType = Database['public']['Enums']['workspace_type']
export type Workspace = Database['public']['Tables']['workspaces']['Row']
export type WorkspaceInsert = Database['public']['Tables']['workspaces']['Insert']
export type WorkspaceUpdate = Database['public']['Tables']['workspaces']['Update']

// Types pour les membres d'un espace de travail
export type WorkspaceMember = Database['public']['Tables']['workspace_members']['Row']
export type WorkspaceMemberInsert = Database['public']['Tables']['workspace_members']['Insert']
export type WorkspaceMemberUpdate = Database['public']['Tables']['workspace_members']['Update']

// Interface pour les statistiques d'un espace de travail
export interface WorkspaceStats {
  members: number;
  projects: number;
  tasks: number;
}

// Interface pour un espace de travail avec ses statistiques
export interface WorkspaceWithStats extends Workspace {
  members_count: number;
  projects_count: number;
  tasks_count: number;
}

// Interface pour la création d'un espace de travail
export type CreateWorkspaceData = WorkspaceInsert

// Interface pour la mise à jour d'un espace de travail
export type UpdateWorkspaceData = WorkspaceUpdate

// Interface pour l'invitation d'un membre
export interface InviteWorkspaceMemberData {
  email: string;
  role: WorkspaceMember['role'];
} 