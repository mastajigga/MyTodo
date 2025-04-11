import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ProjectService } from '@/services/project.service'
import { Project, CreateProjectData, UpdateProjectData } from '@/types/project'

export function useProjects(workspaceId: string) {
  const queryClient = useQueryClient()
  const [realtimeEnabled, setRealtimeEnabled] = useState(true)

  const {
    data: projects = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: () => ProjectService.getWorkspaceProjects(workspaceId)
  })

  const createProject = useMutation({
    mutationFn: (data: CreateProjectData) => ProjectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] })
    }
  })

  const updateProject = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectData }) =>
      ProjectService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] })
    }
  })

  const deleteProject = useMutation({
    mutationFn: (id: string) => ProjectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] })
    }
  })

  const reorderProjects = useMutation({
    mutationFn: (projects: Project[]) => ProjectService.reorderProjects(projects),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] })
    }
  })

  useEffect(() => {
    if (!realtimeEnabled) return

    const subscription = ProjectService.subscribeToProjects(workspaceId, () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [workspaceId, queryClient, realtimeEnabled])

  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
    reorderProjects,
    realtimeEnabled,
    setRealtimeEnabled
  }
} 