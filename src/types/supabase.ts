import type { Database as DatabaseTypes } from './database.types'
export type { Task } from './task'

export type Tables<T extends keyof DatabaseTypes['public']['Tables']> = DatabaseTypes['public']['Tables'][T]
export type TaskInsert = Tables<'tasks'>['Insert']
export type TaskUpdate = Tables<'tasks'>['Update']

export type Workspace = Tables<'workspaces'>['Row']
export type WorkspaceInsert = Tables<'workspaces'>['Insert']
export type WorkspaceUpdate = Tables<'workspaces'>['Update']

export type WorkspaceType = 'family' | 'professional' | 'private'

export const workspaceTypeLabels: Record<WorkspaceType, string> = {
  family: 'Famille',
  professional: 'Professionnel',
  private: 'Privé'
}

export const workspaceTypeColors: Record<WorkspaceType, string> = {
  family: 'bg-blue-100 text-blue-800',
  professional: 'bg-green-100 text-green-800',
  private: 'bg-purple-100 text-purple-800'
}

export interface WorkspaceWithStats extends Workspace {
  _count: {
    members: number
    projects: number
    tasks: number
  }
  created_by: string
}

export interface CreateWorkspaceData {
  name: string
  description?: string | null
  type: WorkspaceType
}

export interface UpdateWorkspaceData {
  name?: string
  description?: string | null
  type?: WorkspaceType
}

export type SupabaseResponse<T> = {
  data: T | null
  error: Error | null
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: Tables<'tasks'>['Row']
      workspaces: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
          owner_id: string
        }
        Insert: Omit<Database['public']['Tables']['workspaces']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Database['public']['Tables']['workspaces']['Row'], 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 