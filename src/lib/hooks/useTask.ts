import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export type Task = {
  id: string
  title: string
  description: string | null
  due_date: string | null
  completed: boolean
  list_id: string
  workspace_id: string
  position: number
  created_at: string
  updated_at: string
}

type CreateTaskData = {
  title: string
  description?: string
  due_date?: string
  list_id: string
  workspace_id: string
  position: number
  completed: boolean
}

type UpdateTaskData = {
  title: string
  description?: string
  due_date?: string
  completed: boolean
}

export function useTask() {
  const [loading, setLoading] = useState(false)

  const getTasks = async (listId: string): Promise<Task[]> => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('list_id', listId)
        .order('position')

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error)
      toast.error('Impossible de récupérer les tâches')
      return []
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: CreateTaskData): Promise<Task | null> => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single()

      if (error) throw error

      toast.success('Tâche créée avec succès')
      return data
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error)
      toast.error('Impossible de créer la tâche')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (id: string, taskData: UpdateTaskData): Promise<Task | null> => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast.success('Tâche mise à jour avec succès')
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error)
      toast.error('Impossible de mettre à jour la tâche')
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Tâche supprimée avec succès')
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error)
      toast.error('Impossible de supprimer la tâche')
      return false
    } finally {
      setLoading(false)
    }
  }

  const reorderTasks = async (listId: string, taskIds: string[]): Promise<boolean> => {
    try {
      setLoading(true)
      const updates = taskIds.map((id, index) => ({
        id,
        position: index,
      }))

      const { error } = await supabase.rpc('reorder_tasks', {
        task_updates: updates,
        list_id_param: listId,
      })

      if (error) throw error

      return true
    } catch (error) {
      console.error('Erreur lors de la réorganisation des tâches:', error)
      toast.error('Impossible de réorganiser les tâches')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
  }
} 