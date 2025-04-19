'use client'

import { useState } from "react"
import { WorkspaceSelect } from "@/components/workspace/WorkspaceSelect"
import { ProjectList } from "@/components/project/ProjectList"
import { CreateProjectButton } from "@/components/project/CreateProjectButton"
import ProjectStats from "@/components/project/ProjectStats"

export default function ProjectsPage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState('all')

  return (
    <div className="container py-8">
      <div className="relative mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
          Projets
        </h1>
        <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
        <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
      </div>

      <ProjectStats />

      <div className="flex items-center justify-between mb-8">
        <WorkspaceSelect 
          value={selectedWorkspace} 
          onValueChange={setSelectedWorkspace} 
        />
        <CreateProjectButton workspaceId={selectedWorkspace !== 'all' ? selectedWorkspace : undefined} />
      </div>

      <ProjectList workspaceId={selectedWorkspace !== 'all' ? selectedWorkspace : undefined} />
    </div>
  )
} 