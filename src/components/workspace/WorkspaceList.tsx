import { useEffect, useState } from 'react'
import { useWorkspace, Workspace } from '@/lib/workspace/useWorkspace'
import { Briefcase, Home, User } from 'lucide-react'

const workspaceIcons = {
  professional: Briefcase,
  family: Home,
  private: User
}

export function WorkspaceList() {
  const { getWorkspaces } = useWorkspace()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getWorkspaces()
        setWorkspaces(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspaces()
  }, [getWorkspaces])

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

  if (workspaces.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Aucun espace de travail trouvé
      </div>
    )
  }

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {workspaces.map((workspace) => {
        const Icon = workspaceIcons[workspace.type]

        return (
          <div
            key={workspace.id}
            className="group relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
          >
            <div className="mb-2 flex items-center gap-2">
              <Icon className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">{workspace.name}</h3>
            </div>

            {workspace.description && (
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                {workspace.description}
              </p>
            )}

            <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
              <span>
                Créé le {new Date(workspace.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => {/* TODO: Implémenter la navigation */}}
                className="rounded-md bg-white px-4 py-2 font-medium text-gray-900 shadow-sm hover:bg-gray-50"
              >
                Ouvrir
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
} 