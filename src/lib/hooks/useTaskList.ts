import { useState } from 'react'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { toast } from 'sonner'
import { Database } from '@/types/database.types'

type Tables = Database['public']['Tables']
type ProjectRow = Tables['projects']['Row']
type ProjectInsert = Tables['projects']['Insert']
type ProjectUpdate = Tables['projects']['Update']

export type TaskList = ProjectRow
export type CreateTaskListData = {
  name: string
  description?: string | null
  workspace_id: string
  position?: number
  color?: string | null
  status?: string | null
}

export type UpdateTaskListData = Partial<CreateTaskListData>

export const useTaskList = () => {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(false)

  const createTaskList = async (data: CreateTaskListData): Promise<TaskList | null> => {
    try {
      setLoading(true)
      const { data: taskList, error } = await supabase
        .from('projects')
        .insert({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: data.status || 'active'
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Liste créée avec succès')
      return taskList as TaskList
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
        .from('projects')
        .select()
        .eq('workspace_id', workspaceId)
        .order('created_at')

      if (error) throw error

      return (taskLists || []) as TaskList[]
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
        .from('projects')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
          status: data.status || 'active'
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast.success('Liste mise à jour avec succès')
      return taskList as TaskList
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
        .from('projects')
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
      
      // Récupérer les projets existants
      const { data: existingProjects, error: fetchError } = await supabase
        .from('projects')
        .select()
        .in('id', orderedIds)

      if (fetchError) throw fetchError
      if (!existingProjects) throw new Error('Impossible de récupérer les projets')

      // Créer les mises à jour en conservant toutes les propriétés existantes
      const updates = orderedIds.map((id, index) => {
        const existingProject = existingProjects.find(project => project.id === id) as TaskList
        if (!existingProject) throw new Error(`Projet non trouvé: ${id}`)
        
        return {
          ...existingProject,
          updated_at: new Date().toISOString(),
          status: existingProject.status || 'active'
        }
      })

      const { error } = await supabase
        .from('projects')
        .upsert(updates)

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