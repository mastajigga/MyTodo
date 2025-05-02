import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Database } from '@/types/database.types'

type Tables = Database['public']['Tables']
type TaskRow = Tables['tasks']['Row']
type TaskInsert = Tables['tasks']['Insert']
type TaskUpdate = Tables['tasks']['Update']

export type Task = TaskRow

export function useTask() {
  const [loading, setLoading] = useState(false)

  const getTasks = async (workspaceId: string, projectId?: string): Promise<Task[]> => {
    try {
      setLoading(true)
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('position', { ascending: true })
        .order('created_at', { ascending: false })

      if (projectId && projectId !== 'all') {
        query = query.eq('project_id', projectId)
      }

      const { data, error } = await query

      if (error) throw error

      return data as Task[]
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error)
      toast.error('Impossible de récupérer les tâches')
      return []
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: TaskInsert): Promise<Task | null> => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single()

      if (error) throw error

      toast.success('Tâche créée avec succès')
      return data as Task
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error)
      toast.error('Impossible de créer la tâche')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (id: string, taskData: TaskUpdate): Promise<Task | null> => {
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
      return data as Task
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

  const reorderTasks = async (workspaceId: string, taskIds: string[]): Promise<boolean> => {
    try {
      setLoading(true)
      
      // D'abord, récupérer les tâches existantes
      const { data: existingTasks, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .in('id', taskIds)

      if (fetchError) throw fetchError
      if (!existingTasks) throw new Error('Impossible de récupérer les tâches')

      // Créer les mises à jour en conservant toutes les propriétés existantes
      const updates = taskIds.map((id, index) => {
        const existingTask = existingTasks.find(task => task.id === id)
        if (!existingTask) throw new Error(`Tâche non trouvée: ${id}`)
        
        return {
          ...existingTask,
          position: index,
          updated_at: new Date().toISOString()
        }
      })

      const { error } = await supabase
        .from('tasks')
        .upsert(updates)

      if (error) throw error

      toast.success('Ordre des tâches mis à jour')
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
    reorderTasks
  }
} 