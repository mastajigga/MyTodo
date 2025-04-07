import { useState } from 'react'
import { supabase } from '../supabase'
import { toast } from 'sonner'

export type TaskTag = {
  id: string
  name: string
  color: string
  workspace_id: string
  created_at: string
  updated_at: string
}

type CreateTaskTagData = {
  name: string
  color: string
  workspace_id: string
}

type UpdateTaskTagData = {
  name: string
  color: string
}

export function useTaskTag() {
  const [loading, setLoading] = useState(false)

  const getTaskTags = async (workspaceId: string): Promise<TaskTag[]> => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('task_tags')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('name')

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des étiquettes:', error)
      toast.error('Impossible de récupérer les étiquettes')
      return []
    } finally {
      setLoading(false)
    }
  }

  const createTaskTag = async (tagData: CreateTaskTagData): Promise<TaskTag | null> => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('task_tags')
        .insert([tagData])
        .select()
        .single()

      if (error) throw error

      toast.success('Étiquette créée avec succès')
      return data
    } catch (error) {
      console.error('Erreur lors de la création de l\'étiquette:', error)
      toast.error('Impossible de créer l\'étiquette')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateTaskTag = async (id: string, tagData: UpdateTaskTagData): Promise<TaskTag | null> => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('task_tags')
        .update(tagData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast.success('Étiquette mise à jour avec succès')
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'étiquette:', error)
      toast.error('Impossible de mettre à jour l\'étiquette')
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteTaskTag = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('task_tags')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Étiquette supprimée avec succès')
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'étiquette:', error)
      toast.error('Impossible de supprimer l\'étiquette')
      return false
    } finally {
      setLoading(false)
    }
  }

  const assignTagToTask = async (taskId: string, tagId: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('task_tag_assignments')
        .insert([{ task_id: taskId, tag_id: tagId }])

      if (error) throw error

      return true
    } catch (error) {
      console.error('Erreur lors de l\'assignation de l\'étiquette:', error)
      toast.error('Impossible d\'assigner l\'étiquette')
      return false
    } finally {
      setLoading(false)
    }
  }

  const removeTagFromTask = async (taskId: string, tagId: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('task_tag_assignments')
        .delete()
        .match({ task_id: taskId, tag_id: tagId })

      if (error) throw error

      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'étiquette:', error)
      toast.error('Impossible de supprimer l\'étiquette')
      return false
    } finally {
      setLoading(false)
    }
  }

  const getTaskTagsByTaskId = async (taskId: string): Promise<TaskTag[]> => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('task_tags')
        .select('*, task_tag_assignments!inner(*)')
        .eq('task_tag_assignments.task_id', taskId)

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des étiquettes:', error)
      toast.error('Impossible de récupérer les étiquettes')
      return []
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    getTaskTags,
    createTaskTag,
    updateTaskTag,
    deleteTaskTag,
    assignTagToTask,
    removeTagFromTask,
    getTaskTagsByTaskId,
  }
} 