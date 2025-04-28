import { createClient } from '@supabase/supabase-js'
import { describe, it, expect, beforeAll } from 'vitest'
import { Database } from '@/types/supabase'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

describe('Tests de Structure de la Base de Données', () => {
  let workspace: any
  let taskList: any
  let task: any
  let tag: any
  let testUser: any

  beforeAll(async () => {
    try {
      // Tentative de connexion
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'testuser@gmail.com',
        password: 'testPassword123!'
      })

      if (signInError) {
        console.log('Tentative de création d\'un nouvel utilisateur...')
        // Si la connexion échoue, créer un nouvel utilisateur
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'testuser@gmail.com',
          password: 'testPassword123!'
        })

        if (signUpError) {
          console.error('Erreur lors de la création de l\'utilisateur:', signUpError)
          throw signUpError
        }

        // Attendre que l'utilisateur soit confirmé
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Nouvelle tentative de connexion
        const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
          email: 'testuser@gmail.com',
          password: 'testPassword123!'
        })

        if (newSignInError) throw newSignInError
        testUser = newSignInData.user
      } else {
        testUser = signInData.user
      }

      if (!testUser) {
        throw new Error('Impossible d\'obtenir l\'utilisateur de test')
      }

      console.log('Utilisateur de test authentifié avec succès:', testUser.id)
    } catch (error) {
      console.error('Erreur d\'authentification détaillée:', error)
      throw error
    }
  })

  describe('Gestion des Espaces de Travail', () => {
    it('devrait créer un espace de travail', async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          name: 'Test Workspace',
          description: 'Test Description',
          created_by: testUser.id,
          type: 'private'
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toHaveProperty('id')
      expect(data?.name).toBe('Test Workspace')
      workspace = data
    })

    it('devrait empêcher les noms d\'espace de travail en double par utilisateur', async () => {
      const { error } = await supabase
        .from('workspaces')
        .insert({
          name: 'Test Workspace',
          description: 'Duplicate',
          created_by: testUser.id,
          type: 'private'
        })

      expect(error).not.toBeNull()
    })
  })

  describe('Gestion des Listes de Tâches', () => {
    it('devrait créer une liste de tâches', async () => {
      const { data, error } = await supabase
        .from('task_lists')
        .insert({
          name: 'Test List',
          description: 'Test List Description',
          workspace_id: workspace.id,
          created_by: testUser.id
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toHaveProperty('id')
      expect(data?.name).toBe('Test List')
      taskList = data
    })

    it('devrait valider la référence à l\'espace de travail', async () => {
      const { error } = await supabase
        .from('task_lists')
        .insert({
          name: 'Invalid List',
          workspace_id: '00000000-0000-0000-0000-000000000000',
          created_by: testUser.id
        })

      expect(error).not.toBeNull()
    })
  })

  describe('Gestion des Tâches', () => {
    it('devrait créer une tâche', async () => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: 'Test Task',
          description: 'Test Task Description',
          list_id: taskList.id,
          created_by: testUser.id,
          priority: 'medium',
          status: 'pending'
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toHaveProperty('id')
      expect(data?.title).toBe('Test Task')
      task = data
    })

    it('devrait valider les valeurs de statut', async () => {
      const { error } = await supabase
        .from('tasks')
        .insert({
          title: 'Invalid Status Task',
          list_id: taskList.id,
          created_by: testUser.id,
          status: 'invalid_status'
        })

      expect(error).not.toBeNull()
    })

    it('devrait valider les valeurs de priorité', async () => {
      const { error } = await supabase
        .from('tasks')
        .insert({
          title: 'Invalid Priority Task',
          list_id: taskList.id,
          created_by: testUser.id,
          priority: 'invalid_priority'
        })

      expect(error).not.toBeNull()
    })
  })

  describe('Gestion des Tags', () => {
    it('devrait créer un tag', async () => {
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: 'Test Tag',
          color: '#FF0000',
          workspace_id: workspace.id,
          created_by: testUser.id
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toHaveProperty('id')
      expect(data?.name).toBe('Test Tag')
      tag = data
    })

    it('devrait empêcher les noms de tag en double par espace de travail', async () => {
      const { error } = await supabase
        .from('tags')
        .insert({
          name: 'Test Tag',
          workspace_id: workspace.id,
          created_by: testUser.id
        })

      expect(error).not.toBeNull()
    })
  })
}) 