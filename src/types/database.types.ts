export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'family' | 'professional' | 'private'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type?: 'family' | 'professional' | 'private'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'family' | 'professional' | 'private'
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: TaskStatus
          priority: TaskPriority
          workspace_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: TaskStatus
          priority?: TaskPriority
          workspace_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: TaskStatus
          priority?: TaskPriority
          workspace_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
        }
      }
      projects: {
        Row: {
          id: string
          name: string
        }
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