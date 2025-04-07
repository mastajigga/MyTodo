import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string
    color?: string
    created_at: string
    updated_at: string
  }
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
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
              <CardTitle className="text-sm font-medium">
                {project.name}
              </CardTitle>
              <button className="hover:bg-accent hover:text-accent-foreground rounded-md p-1">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent>
              {project.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {project.description}
                </p>
              )}
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
          </Card>
        </div>
      )}
    </Draggable>
  )
} 