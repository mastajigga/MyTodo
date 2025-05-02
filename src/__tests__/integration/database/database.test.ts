import { createClient } from '@supabase/supabase-js'
import { describe, it, expect, beforeAll } from 'vitest'
import { Database } from '@/types/supabase'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises')
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
)

describe('Tests de Structure de la Base de Données', () => {
  let workspace: any
  let taskList: any
  let task: any
  let tag: any
  let testUser: any

  beforeAll(async () => {
    try {
      // Supprimer l'utilisateur de test s'il existe déjà
      const { data: existingUser } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', 'testuser@gmail.com')
        .single()

      if (existingUser) {
        await supabase.auth.admin.deleteUser(existingUser.id)
      }

      // Créer un nouvel utilisateur avec la clé de service
      const { data: { user }, error: createUserError } = await supabase.auth.admin.createUser({
        email: 'testuser@gmail.com',
        password: 'testPassword123!',
        email_confirm: true
      })

      if (createUserError) {
        console.error('Erreur lors de la création de l\'utilisateur:', createUserError)
        throw createUserError
      }

      if (!user) {
        throw new Error('L\'utilisateur n\'a pas été créé')
      }

      testUser = user
      console.log('Utilisateur de test créé avec succès:', testUser.id)
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