import { useCallback } from 'react'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import type { CreateWorkspaceData, UpdateWorkspaceData, Workspace, WorkspaceMember } from '@/types/workspace'

export function useWorkspace() {
  const { supabase } = useSupabase()

  const getWorkspaceById = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Workspace
  }, [supabase])

  const createWorkspace = useCallback(async (workspaceData: CreateWorkspaceData) => {
    const { data, error } = await supabase.rpc('create_workspace_with_owner', {
      workspace_name: workspaceData.name,
      workspace_description: workspaceData.description || null,
      workspace_type: workspaceData.type
    })

    if (error) throw error
    return data as Workspace
  }, [supabase])

  const updateWorkspace = useCallback(async (id: string, workspaceData: UpdateWorkspaceData) => {
    const { data, error } = await supabase
      .from('workspaces')
      .update(workspaceData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Workspace
  }, [supabase])

  const deleteWorkspace = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id)

    if (error) throw error
  }, [supabase])

  const getWorkspaces = useCallback(async () => {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')

    if (error) throw error
    return data as Workspace[]
  }, [supabase])

  const inviteMember = useCallback(async (workspaceId: string, email: string, role: WorkspaceMember['role'] = 'member') => {
    const { error } = await supabase.rpc('invite_workspace_member', {
      workspace_id: workspaceId,
      member_email: email,
      role: role
    })

    if (error) throw error
  }, [supabase])

  const updateMemberRole = useCallback(async (workspaceId: string, userId: string, role: WorkspaceMember['role']) => {
    const { error } = await supabase
      .from('workspace_members')
      .update({ role })
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)

    if (error) throw error
  }, [supabase])

  return {
    getWorkspaceById,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getWorkspaces,
    inviteMember,
    updateMemberRole
  }
} 