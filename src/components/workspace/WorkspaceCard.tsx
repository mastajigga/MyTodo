import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { workspaceTypeLabels, workspaceTypeColors } from '@/lib/supabase'
import { WorkspaceWithStats } from '@/types/workspace'

interface WorkspaceCardProps {
  workspace: WorkspaceWithStats
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{workspace.name}</CardTitle>
        <CardDescription>{workspace.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{workspace.members_count} membres</Badge>
            <Badge variant="outline">{workspace.projects_count} projets</Badge>
            <Badge variant="outline">{workspace.tasks_count} tâches</Badge>
          </div>
          <Badge className={workspaceTypeColors[workspace.type]}>
            {workspaceTypeLabels[workspace.type]}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Créé le {new Date(workspace.created_at).toLocaleDateString('fr-FR')}
        </p>
      </CardFooter>
    </Card>
  )
} 