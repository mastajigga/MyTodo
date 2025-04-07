import React, { useState } from 'react'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { ProjectCard } from './ProjectCard'

interface Project {
  id: string
  name: string
  description?: string
  color?: string
  created_at: string
  updated_at: string
}

interface ProjectListProps {
  projects: Project[]
  onProjectsReorder: (projects: Project[]) => void
}

export function ProjectList({ projects, onProjectsReorder }: ProjectListProps) {
  const [orderedProjects, setOrderedProjects] = useState(projects)

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(orderedProjects)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setOrderedProjects(items)
    onProjectsReorder(items)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="projects">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {orderedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
} 