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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          full_name?: string
          avatar_url?: string | null
          updated_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'family' | 'team' | 'personal'
          owner_id: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: 'family' | 'team' | 'personal'
          owner_id: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          type?: 'family' | 'team' | 'personal'
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          workspace_id: string
          status: string
          created_at: string
          updated_at: string
          position: number
          created_by: string
          is_archived: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          workspace_id: string
          status?: string
          created_at?: string
          updated_at?: string
          position?: number
          created_by?: string
          is_archived?: boolean
        }
        Update: {
          name?: string
          description?: string | null
          workspace_id?: string
          status?: string
          updated_at?: string
          position?: number
          is_archived?: boolean
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          project_id: string
          status: 'pending' | 'in-progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          position: number
          due_date: string | null
          created_by: string
          created_at: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          project_id: string
          status?: 'pending' | 'in-progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          position?: number
          due_date?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          project_id?: string
          status?: 'pending' | 'in-progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          position?: number
          due_date?: string | null
          updated_at?: string
          workspace_id?: string | null
        }
      }
      workspace_members: {
        Row: {
          workspace_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          workspace_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
      }
    }
  }
}

export type WorkspaceType = 'family' | 'professional' | 'private'; 