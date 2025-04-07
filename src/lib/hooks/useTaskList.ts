import { useState } from 'react'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { toast } from 'sonner'

export type TaskList = {
  id: string
  name: string
  description: string | null
  workspace_id: string
  created_by: string
  created_at: string
  updated_at: string
  position: number
}

export type CreateTaskListData = {
  name: string
  description?: string
  workspace_id: string
  position?: number
}

export type UpdateTaskListData = Partial<CreateTaskListData>

export const useTaskList = () => {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(false)

  const createTaskList = async (data: CreateTaskListData): Promise<TaskList | null> => {
    try {
      setLoading(true)
      const { data: taskList, error } = await supabase
        .from('task_lists')
        .insert({
          name: data.name,
          description: data.description,
          workspace_id: data.workspace_id,
          position: data.position || 0,
        })
        .select('*')
        .single()

      if (error) throw error

      toast.success('Liste créée avec succès')
      return taskList
    } catch (error) {
      toast.error('Erreur lors de la création de la liste')
      console.error('Erreur lors de la création de la liste:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getTaskLists = async (workspaceId: string): Promise<TaskList[]> => {
    try {
      setLoading(true)
      const { data: taskLists, error } = await supabase
        .from('task_lists')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('position')

      if (error) throw error

      return taskLists
    } catch (error) {
      toast.error('Erreur lors de la récupération des listes')
      console.error('Erreur lors de la récupération des listes:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  const updateTaskList = async (id: string, data: UpdateTaskListData): Promise<TaskList | null> => {
    try {
      setLoading(true)
      const { data: taskList, error } = await supabase
        .from('task_lists')
        .update(data)
        .eq('id', id)
        .select('*')
        .single()

      if (error) throw error

      toast.success('Liste mise à jour avec succès')
      return taskList
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la liste')
      console.error('Erreur lors de la mise à jour de la liste:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteTaskList = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('task_lists')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Liste supprimée avec succès')
      return true
    } catch (error) {
      toast.error('Erreur lors de la suppression de la liste')
      console.error('Erreur lors de la suppression de la liste:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const reorderTaskLists = async (workspaceId: string, orderedIds: string[]): Promise<boolean> => {
    try {
      setLoading(true)
      const updates = orderedIds.map((id, index) => ({
        id,
        position: index,
      }))

      const { error } = await supabase
        .from('task_lists')
        .upsert(updates)
        .eq('workspace_id', workspaceId)

      if (error) throw error

      return true
    } catch (error) {
      toast.error('Erreur lors de la réorganisation des listes')
      console.error('Erreur lors de la réorganisation des listes:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    createTaskList,
    getTaskLists,
    updateTaskList,
    deleteTaskList,
    reorderTaskLists,
  }
} 