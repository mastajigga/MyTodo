import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
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
    queryFn: () => projectService.getProjects(workspaceId)
  })

  const createProject = useMutation({
    mutationFn: (data: CreateProjectData) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] })
    }
  })

  const updateProject = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectData }) =>
      projectService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] })
    }
  })

  const deleteProject = useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] })
    }
  })

  const reorderProjects = useMutation({
    mutationFn: (projects: Project[]) => projectService.reorderProjects(projects),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] })
    }
  })

  useEffect(() => {
    if (!realtimeEnabled) return

    const subscription = projectService.subscribeToProjects(workspaceId, () => {
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