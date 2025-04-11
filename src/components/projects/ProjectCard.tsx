import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Project, PROJECT_COLORS } from '@/types/project'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { MoreVertical, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ProjectService } from '@/services/project.service'

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    workspace_id: string;
    created_at: string;
    updated_at: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await ProjectService.deleteProject(project.id)
      toast.success('Projet supprimé avec succès')
      router.refresh()
    } catch (error) {
      toast.error('Erreur lors de la suppression du projet')
    }
  }

  return (
    <Draggable draggableId={project.id} index={0}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="mb-4 hover:shadow-md transition-shadow">
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <Link
                  href={`/projects/${project.id}`}
                  className="font-semibold hover:underline"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold">{project.name}</span>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    )}
                  </div>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">Ouvrir le menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/projects/${project.id}`)}
                    >
                      Voir le projet
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push(`/projects/${project.id}/edit`)}
                    >
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={handleDelete}
                    >
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {format(new Date(project.created_at), 'PPP', { locale: fr })}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-muted-foreground">
                Créé le {new Date(project.created_at).toLocaleDateString('fr-FR')}
              </span>
            </CardFooter>
          </Card>
        </div>
      )}
    </Draggable>
  )
} 