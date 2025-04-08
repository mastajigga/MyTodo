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
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { MoreVertical, Trash2 } from 'lucide-react'

interface ProjectCardProps {
  project: Project
  index: number
  onDelete: () => void
}

export function ProjectCard({ project, index, onDelete }: ProjectCardProps) {
  return (
    <Draggable draggableId={project.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="mb-4 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Link
                href={`/project/${project.id}`}
                className="font-semibold hover:underline"
              >
                {project.name}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Menu du projet</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={onDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description || 'Aucune description'}
              </p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {format(new Date(project.created_at), 'PPP', { locale: fr })}
                </span>
              </div>
              {project.color && (
                <Badge 
                  variant="outline" 
                  className="mt-2"
                  style={{ borderColor: project.color }}
                >
                  {project.color}
                </Badge>
              )}
            </CardContent>
            <CardFooter>
              <div
                data-testid="project-color"
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor: project.color
                    ? PROJECT_COLORS[project.color as keyof typeof PROJECT_COLORS]
                    : PROJECT_COLORS.indigo
                }}
              />
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