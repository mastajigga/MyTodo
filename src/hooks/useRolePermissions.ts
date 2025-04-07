import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

type Role = 'owner' | 'admin' | 'member'

interface WorkspaceMember {
  workspace_id: string
  user_id: string
  role: Role
}

export function useRolePermissions(workspaceId: string) {
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setError('Utilisateur non authentifié')
          return
        }

        const { data, error } = await supabase
          .from('workspace_members')
          .select('role')
          .eq('workspace_id', workspaceId)
          .eq('user_id', user.id)
          .single()

        if (error) throw error

        setRole(data?.role || null)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRole()
  }, [workspaceId])

  const can = (action: string) => {
    if (!role) return false

    const permissions = {
      owner: ['manage_workspace', 'manage_members', 'manage_projects', 'manage_tasks', 'delete_workspace'],
      admin: ['manage_projects', 'manage_tasks', 'manage_members'],
      member: ['manage_tasks']
    }

    return permissions[role]?.includes(action) || false
  }

  return {
    role,
    loading,
    error,
    can,
    isOwner: role === 'owner',
    isAdmin: role === 'admin',
    isMember: role === 'member'
  }
} 