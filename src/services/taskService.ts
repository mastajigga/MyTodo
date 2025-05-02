import { getSupabaseClient } from '@/lib/supabase'
import { Task } from '@/types/supabase'
import { SupabaseResponse } from '@/lib/supabase'

/**
 * Service pour la gestion des tâches
 */
export const taskService = {
  /**
   * Récupère toutes les tâches d'un workspace
   * @param workspaceId - L'identifiant du workspace
   * @returns Une promesse contenant la liste des tâches
   */
  getTasks: async (workspaceId: string): Promise<SupabaseResponse<Task[]>> => {
    try {
      console.log('🔍 Début de la récupération des tâches pour le workspace:', workspaceId)
      const supabase = getSupabaseClient()
      
      console.log('📡 Envoi de la requête à Supabase...')
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

      console.log('📥 Réponse reçue:', { data, error })

      if (error) {
        console.error('❌ Erreur Supabase:', error)
        throw error
      }

      console.log('✅ Tâches récupérées avec succès:', data)
      return { data: data as Task[], error: null }
    } catch (error) {
      console.error('🚨 Erreur lors de la récupération des tâches:', error)
      console.error('Stack trace:', (error as Error).stack)
      return { data: null, error: error as Error }
    }
  },

  /**
   * Crée une nouvelle tâche
   * @param title - Le titre de la tâche
   * @param workspaceId - L'identifiant du workspace
   * @param projectId - L'identifiant du projet
   * @param userId - L'identifiant de l'utilisateur
   * @returns Une promesse contenant la tâche créée
   */
  createTask: async (
    title: string,
    workspaceId: string,
    projectId: string,
    userId: string
  ): Promise<SupabaseResponse<Task>> => {
    try {
      console.log('📝 Début de la création de la tâche:', { title, workspaceId, projectId, userId })
      const supabase = getSupabaseClient()

      console.log('📡 Envoi de la requête à Supabase...')
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          workspace_id: workspaceId,
          project_id: projectId,
          created_by: userId,
          status: 'todo',
          priority: 'medium',
          position: 0,
          description: '',
          assigned_to: null,
          deleted_at: null,
          due_date: null,
          start_time: null,
          estimated_time: null,
          tags: []
        })
        .select()
        .single()

      console.log('📥 Réponse reçue:', { data, error })

      if (error) {
        console.error('❌ Erreur Supabase:', error)
        throw error
      }

      console.log('✅ Tâche créée avec succès:', data)
      return { data: data as Task, error: null }
    } catch (error) {
      console.error('🚨 Erreur lors de la création de la tâche:', error)
      console.error('Stack trace:', (error as Error).stack)
      return { data: null, error: error as Error }
    }
  },

  /**
   * Met à jour une tâche existante
   * @param taskId - L'identifiant de la tâche à mettre à jour
   * @param status - Le nouveau statut de la tâche
   * @returns Une promesse contenant la tâche mise à jour
   */
  updateTask: async (taskId: string, status: 'todo' | 'in_progress' | 'review' | 'done' | 'completed'): Promise<SupabaseResponse<Task>> => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId)
        .select()
        .single()

      if (error) throw error
      return { data: data as Task, error: null }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error)
      return { data: null, error: error as Error }
    }
  },

  /**
   * Supprime une tâche
   * @param taskId - L'identifiant de la tâche à supprimer
   * @returns Une promesse indiquant le succès de la suppression
   */
  deleteTask: async (taskId: string): Promise<SupabaseResponse<null>> => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error
      return { data: null, error: null }
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error)
      return { data: null, error: error as Error }
    }
  }
} 