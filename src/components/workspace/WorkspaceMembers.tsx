import { useState } from 'react'
import { useWorkspace, WorkspaceMember } from '@/lib/workspace/useWorkspace'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { UserPlus, Trash2, Shield } from 'lucide-react'

interface WorkspaceMembersProps {
  workspaceId: string
  members: WorkspaceMember[]
  onMemberUpdate: () => void
}

export function WorkspaceMembers({ workspaceId, members, onMemberUpdate }: WorkspaceMembersProps) {
  const { inviteMember, updateMemberRole, removeMember } = useWorkspace()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInvite = async () => {
    if (!email) return
    
    try {
      setLoading(true)
      setError(null)
      await inviteMember(workspaceId, email)
      setEmail('')
      onMemberUpdate()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleUpdate = async (memberId: string, newRole: string) => {
    try {
      await updateMemberRole(workspaceId, memberId, newRole)
      onMemberUpdate()
    } catch (err) {
      console.error('Erreur lors de la mise à jour du rôle:', err)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(workspaceId, memberId)
      onMemberUpdate()
    } catch (err) {
      console.error('Erreur lors de la suppression du membre:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Inviter des membres</h3>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Email du membre"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleInvite} disabled={loading || !email}>
            <UserPlus className="mr-2 h-4 w-4" />
            Inviter
          </Button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Membres ({members.length})</h3>
        <div className="divide-y rounded-md border">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <p className="font-medium">{member.user_email}</p>
                <p className="text-sm text-gray-500">
                  Ajouté le {new Date(member.joined_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={member.role}
                  onValueChange={(value) => handleRoleUpdate(member.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">
                      <div className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Propriétaire
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="member">Membre</SelectItem>
                  </SelectContent>
                </Select>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Supprimer ce membre ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Le membre perdra l'accès à ce workspace.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 