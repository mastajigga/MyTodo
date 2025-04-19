'use client'

import { useState } from "react"
import { WorkspaceSelect } from "@/components/workspace/WorkspaceSelect"
import { ProjectList } from "@/components/projects/ProjectList"
import { CreateProjectButton } from "@/components/project/CreateProjectButton"
import ProjectStats from "@/components/project/ProjectStats"

export default function ProjectsPage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState('all')

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
      <div className="relative mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
          Projets
        </h1>
        <div className="absolute -bottom-2 left-0 w-16 sm:w-24 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
        <div className="absolute -bottom-2 left-0 w-16 sm:w-24 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
      </div>

      <ProjectStats />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="w-full sm:w-auto">
          <WorkspaceSelect 
            value={selectedWorkspace} 
            onValueChange={setSelectedWorkspace}
          />
        </div>
        <div className="w-full sm:w-auto">
          <CreateProjectButton workspaceId={selectedWorkspace !== 'all' ? selectedWorkspace : undefined} />
        </div>
      </div>

      <ProjectList workspaceId={selectedWorkspace !== 'all' ? selectedWorkspace : undefined} />
    </div>
  )
} 