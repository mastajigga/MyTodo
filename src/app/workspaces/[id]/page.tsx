"use client"

import { useEffect, useState } from "react"
import { WorkspaceMembers } from "@/components/workspace/WorkspaceMembers"
import { WorkspaceInvite } from "@/components/workspace/WorkspaceInvite"
import { Card } from "@/components/ui/card"
import { useWorkspace } from "@/lib/workspace/useWorkspace"
import { ProjectList } from "@/components/projects/ProjectList"
import type { Workspace } from "@/types/workspace"

export default function WorkspaceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { getWorkspaceById } = useWorkspace()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const data = await getWorkspaceById(params.id)
        setWorkspace(data)
      } catch (error) {
        console.error("Erreur lors du chargement de l'espace de travail:", error)
      } finally {
        setLoading(false)
      }
    }

    loadWorkspace()
  }, [getWorkspaceById, params.id])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-lg mb-12" />
        <div className="grid gap-6">
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="container py-8">
        <Card className="p-6">
          <h1 className="text-xl font-semibold text-destructive">Espace de travail non trouvé</h1>
          <p className="text-muted-foreground">
            L&apos;espace de travail que vous recherchez n&apos;existe pas ou vous n&apos;y avez pas accès.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="relative mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
          {workspace.name}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">{workspace.description}</p>
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 backdrop-blur-sm bg-card/50">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Membres</h2>
              <p className="text-muted-foreground">
                Gérez les membres de votre espace de travail
              </p>
            </div>
            <WorkspaceMembers workspaceId={workspace.id} />
            <WorkspaceInvite workspaceId={workspace.id} />
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-sm bg-card/50">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Projets</h2>
              <p className="text-muted-foreground">
                Tous les projets de cet espace de travail
              </p>
            </div>
            <ProjectList workspaceId={workspace.id} />
          </div>
        </Card>
      </div>
    </div>
  )
} 