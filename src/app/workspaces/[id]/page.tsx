'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useWorkspace } from '@/lib/workspace/useWorkspace'
import { Workspace } from '@/types/workspace'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { WorkspaceMembers } from '@/components/workspace/WorkspaceMembers'
import { WorkspaceSettings } from '@/components/workspace/WorkspaceSettings'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

type Tab = 'overview' | 'members' | 'settings'

const tabVariants = {
  enter: {
    opacity: 0,
    y: 20,
  },
  center: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
}

export default function WorkspacePage() {
  const params = useParams()
  const { getWorkspaceById } = useWorkspace()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getWorkspaceById(params.id as string)
        setWorkspace(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchWorkspace()
    }
  }, [params.id, getWorkspaceById])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-destructive/10">
          <CardContent className="p-6">
            <p className="text-destructive">Erreur: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-muted">
          <CardContent className="p-6">
            <p>Espace de travail non trouvé</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{workspace.name}</CardTitle>
          {workspace.description && (
            <p className="text-muted-foreground">{workspace.description}</p>
          )}
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <div className="flex gap-2 border-b pb-2">
          <Button
            variant="ghost"
            onClick={() => setActiveTab('overview')}
            className={cn(
              'rounded-none border-b-2 border-transparent transition-colors duration-200',
              activeTab === 'overview' && 'border-primary'
            )}
          >
            Vue d'ensemble
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('members')}
            className={cn(
              'rounded-none border-b-2 border-transparent transition-colors duration-200',
              activeTab === 'members' && 'border-primary'
            )}
          >
            Membres
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('settings')}
            className={cn(
              'rounded-none border-b-2 border-transparent transition-colors duration-200',
              activeTab === 'settings' && 'border-primary'
            )}
          >
            Paramètres
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial="enter"
              animate="center"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Projets</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Liste des projets à implémenter */}
                  <p className="text-muted-foreground">Aucun projet pour le moment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Aucune activité récente</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'members' && (
            <motion.div
              key="members"
              initial="enter"
              animate="center"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.2 }}
            >
              <WorkspaceMembers workspaceId={workspace.id} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial="enter"
              animate="center"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.2 }}
            >
              <WorkspaceSettings workspace={workspace} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 