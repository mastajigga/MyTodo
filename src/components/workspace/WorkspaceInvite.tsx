'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { toast } from 'sonner'

interface WorkspaceInviteProps {
  workspaceId: string
}

export function WorkspaceInvite({ workspaceId }: WorkspaceInviteProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [loading, setLoading] = useState(false)
  const { supabase } = useSupabase()

  const handleInvite = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.rpc('invite_workspace_member', {
        workspace_id: workspaceId,
        member_email: email,
        role: role
      })

      if (error) {
        toast.error('Erreur lors de l\'invitation', {
          description: error.message
        })
        return
      }

      toast.success('Invitation envoyée', {
        description: `Un email d'invitation a été envoyé à ${email}`
      })
      setEmail('')
      setRole('member')
    } catch (error) {
      toast.error('Erreur lors de l\'invitation', {
        description: 'Une erreur inattendue s\'est produite'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inviter des membres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Adresse e-mail
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemple@email.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="role">
            Rôle
          </label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Propriétaire</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
              <SelectItem value="member">Membre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleInvite}
          disabled={loading || !email}
          className="w-full"
        >
          {loading ? 'Envoi en cours...' : 'Inviter'}
        </Button>
      </CardContent>
    </Card>
  )
} 