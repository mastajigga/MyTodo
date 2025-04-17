'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useSupabase } from '@/lib/supabase/supabase-provider'

interface WorkspaceMember {
  user_id: string
  workspace_id: string
  role: 'owner' | 'admin' | 'member'
  user: {
    email: string
    full_name?: string
  }
}

interface WorkspaceMembersProps {
  workspaceId: string
  members?: WorkspaceMember[]
  onMemberUpdate?: () => void
}

export function WorkspaceMembers({ workspaceId, members: initialMembers, onMemberUpdate }: WorkspaceMembersProps) {
  const [members, setMembers] = useState<WorkspaceMember[]>(initialMembers || [])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { supabase } = useSupabase()

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('workspace_members')
          .select(`
            user_id,
            workspace_id,
            role,
            user:user_id (
              email,
              full_name
            )
          `)
          .eq('workspace_id', workspaceId)
          .order('role', { ascending: false })

        if (error) throw error
        
        const formattedMembers = (data || []).map((member: any) => ({
          user_id: member.user_id,
          workspace_id: member.workspace_id,
          role: member.role,
          user: {
            email: member.user?.email || 'Unknown',
            full_name: member.user?.full_name || 'Unknown User'
          }
        }))
        
        setMembers(formattedMembers)
        onMemberUpdate?.()
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (!initialMembers?.length) {
      fetchMembers()
    }
  }, [workspaceId, supabase, initialMembers, onMemberUpdate])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Membres</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Chargement des membres...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-destructive/10">
        <CardContent className="p-6">
          <p className="text-destructive">Erreur: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membres ({members.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={`${member.user_id}-${member.workspace_id}`}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${member.user.email}`}
                    alt={member.user.full_name || member.user.email}
                  />
                  <AvatarFallback>
                    {member.user.full_name?.[0] ||
                      member.user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {member.user.full_name || member.user.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>
              </div>
              <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                {member.role}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 