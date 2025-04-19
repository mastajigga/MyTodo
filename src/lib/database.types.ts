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
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          status: 'todo' | 'in_progress' | 'review' | 'done'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          project_id: string | null
          created_at: string
          updated_at: string
          due_date: string | null
          created_by: string
          assigned_to: string
          position: number
        }
        Insert: {
          id?: string
          title: string
          description: string
          status: 'todo' | 'in_progress' | 'review' | 'done'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          project_id?: string | null
          created_at?: string
          updated_at?: string
          due_date?: string | null
          created_by: string
          assigned_to: string
          position?: number
        }
        Update: {
          title?: string
          description?: string
          status?: 'todo' | 'in_progress' | 'review' | 'done'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          project_id?: string | null
          updated_at?: string
          due_date?: string | null
          assigned_to?: string
          position?: number
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
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          workspace_id: string
          status: 'in_progress' | 'completed' | 'cancelled' | null
          color: string | null
          created_by: string
          created_at: string
          updated_at: string
          is_archived: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          workspace_id: string
          status?: 'in_progress' | 'completed' | 'cancelled' | null
          color?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          is_archived?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          workspace_id?: string
          status?: 'in_progress' | 'completed' | 'cancelled' | null
          color?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          is_archived?: boolean
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'personal' | 'team'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: 'personal' | 'team'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'personal' | 'team'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
          updated_at?: string
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
