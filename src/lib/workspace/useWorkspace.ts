import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@/lib/auth/useAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type WorkspaceType = 'family' | 'professional' | 'private'

export interface Workspace {
  id: string
  name: string
  description?: string
  type: WorkspaceType
  created_by: string
  created_at: string
  updated_at: string
}

export interface CreateWorkspaceData {
  name: string
  description?: string
  type: WorkspaceType
}

export type WorkspaceMember = {
  id: string
  workspace_id: string
  user_id: string
  user_email: string
  role: 'owner' | 'admin' | 'member'
  joined_at: string
}

export function useWorkspace() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createWorkspace = async (data: CreateWorkspaceData) => {
    try {
      setLoading(true)
      setError(null)

      // Créer le workspace
      const { data: workspace, error: createError } = await supabase
        .from('workspaces')
        .insert({
          name: data.name,
          description: data.description,
          type: data.type,
          created_by: user?.id
        })
        .select()
        .single()

      if (createError) throw createError

      // Ajouter le créateur comme propriétaire
      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspace.id,
          user_id: user?.id,
          role: 'owner'
        })

      if (memberError) throw memberError

      return workspace
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getWorkspaces = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('workspaces')
        .select(`
          *,
          workspace_members!inner (
            user_id,
            role
          )
        `)
        .eq('workspace_members.user_id', user?.id)

      if (error) throw error

      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getWorkspaceById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('workspaces')
        .select(`
          *,
          workspace_members (
            user_id,
            role,
            profiles (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateWorkspace = async (id: string, data: Partial<CreateWorkspaceData>) => {
    try {
      setLoading(true)
      setError(null)

      const { data: workspace, error } = await supabase
        .from('workspaces')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return workspace
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteWorkspace = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const inviteMember = async (workspaceId: string, email: string, role: WorkspaceMember['role'] = 'member') => {
    try {
      setLoading(true)
      setError(null)

      // Vérifier si l'utilisateur existe
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (userError) throw new Error('Utilisateur non trouvé')

      // Ajouter le membre
      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspaceId,
          user_id: userData.id,
          role
        })

      if (memberError) throw memberError
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMemberRole = async (workspaceId: string, userId: string, role: WorkspaceMember['role']) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('workspace_members')
        .update({ role })
        .match({ workspace_id: workspaceId, user_id: userId })

      if (error) throw error
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeMember = async (workspaceId: string, userId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .match({ workspace_id: workspaceId, user_id: userId })

      if (error) throw error
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createWorkspace,
    getWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace,
    inviteMember,
    updateMemberRole,
    removeMember
  }
} 