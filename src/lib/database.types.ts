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
      comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          content?: string
          updated_at?: string
        }
      }
      subtasks: {
        Row: {
          id: string
          task_id: string
          title: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          completed?: boolean
          updated_at?: string
        }
      }
      task_activities: {
        Row: {
          id: string
          task_id: string
          task_title: string
          action: string
          previous_status: string | null
          new_status: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          task_title: string
          action: string
          previous_status?: string | null
          new_status?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          task_title?: string
          action?: string
          previous_status?: string | null
          new_status?: string | null
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role: string
          created_at?: string
        }
        Update: {
          role?: string
        }
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role: string
          created_at?: string
        }
        Update: {
          role?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          workspace_id: string
          created_by: string
          created_at: string
          updated_at: string
          position: number
          is_archived: boolean
          color: string | null
          status: 'completed' | 'in_progress' | 'cancelled' | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          workspace_id: string
          created_by: string
          created_at?: string
          updated_at?: string
          position?: number
          is_archived?: boolean
          color?: string | null
          status?: 'completed' | 'in_progress' | 'cancelled' | null
        }
        Update: {
          name?: string
          description?: string | null
          workspace_id?: string
          updated_at?: string
          position?: number
          is_archived?: boolean
          color?: string | null
          status?: 'completed' | 'in_progress' | 'cancelled' | null
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: string
          priority: string
          due_date: string | null
          project_id: string
          assigned_to: string | null
          created_by: string
          created_at: string
          updated_at: string
          position: number
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          project_id: string
          assigned_to?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          position?: number
        }
        Update: {
          title?: string
          description?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          project_id?: string
          assigned_to?: string | null
          updated_at?: string
          position?: number
        }
      }
      workspaces: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          type: 'family' | 'professional' | 'private'
          owner_id: string
          created_by: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          type: 'family' | 'professional' | 'private'
          owner_id: string
          created_by: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          type?: 'family' | 'professional' | 'private'
          owner_id?: string
          created_by?: string
          updated_at?: string
        }
      }
      todos: {
        Row: {
          id: string
          created_at: string
          title: string
          is_complete: boolean
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          is_complete?: boolean
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          is_complete?: boolean
          user_id?: string
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