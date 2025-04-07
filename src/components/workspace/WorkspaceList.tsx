import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CreateWorkspace } from './CreateWorkspace'
import { InviteMembers } from './InviteMembers'
import { workspaceIcons } from '@/lib/workspace-icons'
import { createClient } from '@/lib/supabase/client'

interface Workspace {
  id: string
  name: string
  description?: string
  type: string
  members: { count: number }[]
}

export function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadWorkspaces()

    const channel = supabase.channel('workspace-changes')
    if (channel) {
      channel
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'workspaces'
        }, () => {
          loadWorkspaces()
        })
        .subscribe()

      return () => {
        if (channel) {
          channel.unsubscribe()
        }
      }
    }
  }, [])

  const loadWorkspaces = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: workspaceMembers } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id)

      if (!workspaceMembers) return

      const workspaceIds = workspaceMembers.map(wm => wm.workspace_id)

      const { data: workspaces } = await supabase
        .from('workspaces')
        .select('*, members:workspace_members(count)')
        .in('id', workspaceIds)
        .order('created_at', { ascending: false })

      if (workspaces) {
        setWorkspaces(workspaces)
      }
    } catch (error) {
      console.error('Error loading workspaces:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId)
    setShowInvite(true)
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes espaces de travail</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Créer
        </Button>
      </div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="h-40 rounded-lg bg-gray-100 p-4 animate-pulse"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            />
          ))
        ) : (
          workspaces.map(workspace => {
            const Icon = workspaceIcons[workspace.type] || workspaceIcons.default
            return (
              <motion.div
                key={workspace.id}
                className="rounded-lg border bg-card p-4 shadow-sm"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <div className="mb-2 flex items-center">
                  <Icon className="mr-2 h-5 w-5" />
                  <h3 className="text-lg font-semibold">{workspace.name}</h3>
                </div>
                {workspace.description && (
                  <p className="mb-4 text-sm text-gray-600">{workspace.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {workspace.members[0]?.count || 0} membres
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleInvite(workspace.id)}
                    >
                      <Users className="mr-1 h-4 w-4" />
                      Inviter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/workspace/${workspace.id}/settings`)}
                    >
                      <Settings className="mr-1 h-4 w-4" />
                      Paramètres
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </motion.div>

      <AnimatePresence>
        {showCreate && (
          <CreateWorkspace
            onClose={() => setShowCreate(false)}
            onSuccess={() => {
              setShowCreate(false)
              loadWorkspaces()
            }}
          />
        )}
        {showInvite && selectedWorkspaceId && (
          <InviteMembers
            workspaceId={selectedWorkspaceId}
            onClose={() => {
              setShowInvite(false)
              setSelectedWorkspaceId('')
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
} 