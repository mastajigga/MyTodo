import { useState, useEffect } from 'react'
import { useWorkspace, Workspace, WorkspaceMember } from '@/lib/workspace/useWorkspace'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { WorkspaceMembers } from './WorkspaceMembers'
import { Settings, Save } from 'lucide-react'

interface WorkspaceDetailsProps {
  workspaceId: string
}

export function WorkspaceDetails({ workspaceId }: WorkspaceDetailsProps) {
  const { getWorkspaceById, updateWorkspace } = useWorkspace()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedWorkspace, setEditedWorkspace] = useState<Partial<Workspace>>({})

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getWorkspaceById(workspaceId)
        if (data) {
          setWorkspace(data.workspace)
          setMembers(data.members)
          setEditedWorkspace({
            name: data.workspace.name,
            description: data.workspace.description,
            type: data.workspace.type,
          })
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspace()
  }, [workspaceId, getWorkspaceById])

  const handleSave = async () => {
    if (!workspace || !editedWorkspace.name) return

    try {
      await updateWorkspace(workspace.id, editedWorkspace)
      setWorkspace({ ...workspace, ...editedWorkspace })
      setIsEditing(false)
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Une erreur est survenue : {error.message}
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="p-4 text-center text-gray-500">
        Workspace non trouvé
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Détails du workspace</h2>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Settings className="mr-2 h-4 w-4" />
          {isEditing ? 'Annuler' : 'Modifier'}
        </Button>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={editedWorkspace.name}
                onChange={(e) =>
                  setEditedWorkspace({ ...editedWorkspace, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editedWorkspace.description}
                onChange={(e) =>
                  setEditedWorkspace({
                    ...editedWorkspace,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <Button onClick={handleSave} disabled={!editedWorkspace.name}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </>
        ) : (
          <>
            <div>
              <h3 className="font-medium">Nom</h3>
              <p className="mt-1">{workspace.name}</p>
            </div>

            {workspace.description && (
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="mt-1 whitespace-pre-wrap">{workspace.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-medium">Type</h3>
              <p className="mt-1 capitalize">{workspace.type}</p>
            </div>

            <div>
              <h3 className="font-medium">Créé le</h3>
              <p className="mt-1">
                {new Date(workspace.created_at).toLocaleDateString()}
              </p>
            </div>
          </>
        )}
      </div>

      <WorkspaceMembers
        workspaceId={workspace.id}
        members={members}
        onMemberUpdate={() => {
          // Recharger les membres
          getWorkspaceById(workspaceId).then((data) => {
            if (data) {
              setMembers(data.members)
            }
          })
        }}
      />
    </div>
  )
} 