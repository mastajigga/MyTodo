'use client';

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ProjectService } from '@/services/project.service'
import { Project, CreateProjectData, UpdateProjectData } from '@/@types/project'
import { useSupabase } from '@/lib/supabase/useSupabase';

export function useProjects(workspaceId: string) {
  const queryClient = useQueryClient()
  const [realtimeEnabled, setRealtimeEnabled] = useState(true)
  const { supabase } = useSupabase();

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser();
  }, [supabase]);

  const {
    data: projects = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: () => ProjectService.getWorkspaceProjects(workspaceId, supabase),
    enabled: !!workspaceId && !!supabase
  })

  const createProject = useMutation({
    mutationFn: (data: CreateProjectData) => ProjectService.createProject(data, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] })
    }
  })

  const updateProject = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectData }) =>
      ProjectService.updateProject(id, data, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] })
    }
  })

  const deleteProject = useMutation({
    mutationFn: (id: string) => ProjectService.deleteProject(id, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] })
    }
  })

  const reorderProjects = useMutation({
    mutationFn: (projects: Project[]) => ProjectService.reorderProjects(projects, supabase),
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