import { useState } from 'react'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { toast } from 'sonner'
import { Database } from '@/types/database.types'

type Tables = Database['public']['Tables']
type TaskTagRow = Tables['task_tags']['Row']
type TaskTagInsert = Tables['task_tags']['Insert']
type TaskTagUpdate = Tables['task_tags']['Update']

export type TaskTag = TaskTagRow

type CreateTaskTagData = Omit<TaskTagInsert, 'id' | 'created_at' | 'updated_at'>
type UpdateTaskTagData = Omit<TaskTagUpdate, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>

export function useTaskTag() {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(false)

  const getTaskTags = async (workspaceId: string): Promise<TaskTag[]> => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('task_tags')
        .select()
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
        .insert([{
          ...tagData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
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
        .update({
          ...tagData,
          updated_at: new Date().toISOString()
        })
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
      // Mettre à jour le tableau tags de la tâche
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('tags')
        .eq('id', taskId)
        .single()

      if (taskError) throw taskError

      const currentTags = task.tags || []
      if (!currentTags.includes(tagId)) {
        const { error: updateError } = await supabase
          .from('tasks')
          .update({ tags: [...currentTags, tagId] })
          .eq('id', taskId)

        if (updateError) throw updateError
      }

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
      // Retirer le tag du tableau tags de la tâche
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('tags')
        .eq('id', taskId)
        .single()

      if (taskError) throw taskError

      const currentTags = task.tags || []
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ tags: currentTags.filter(id => id !== tagId) })
        .eq('id', taskId)

      if (updateError) throw updateError

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
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('tags')
        .eq('id', taskId)
        .single()

      if (taskError) throw taskError

      if (!task.tags || task.tags.length === 0) return []

      const { data: tags, error: tagsError } = await supabase
        .from('task_tags')
        .select()
        .in('id', task.tags)

      if (tagsError) throw tagsError

      return tags || []
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