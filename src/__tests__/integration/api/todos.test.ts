import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

describe('Todos API Integration Tests', () => {
  let supabase: ReturnType<typeof createClient<Database>>
  let testUser: { id: string; email: string }

  beforeEach(async () => {
    // Créer un client Supabase pour les tests
    supabase = createClient<Database>(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    )

    // Créer un utilisateur de test
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `test-${Date.now()}@example.com`,
      password: 'testPassword123!'
    })

    if (authError) throw authError
    testUser = { id: authData.user!.id, email: authData.user!.email! }
  })

  afterEach(async () => {
    // Nettoyer les données de test
    if (testUser?.id) {
      await supabase.from('todos').delete().eq('user_id', testUser.id)
      await supabase.auth.admin.deleteUser(testUser.id)
    }
  })

  describe('GET /todos', () => {
    it('should return empty array when no todos exist', async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', testUser.id)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('should return all todos for the authenticated user', async () => {
      // Créer un todo de test
      const newTodo = {
        title: 'Test Todo',
        completed: false,
        user_id: testUser.id
      }

      await supabase.from('todos').insert(newTodo)

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', testUser.id)

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data![0]).toMatchObject({
        title: newTodo.title,
        completed: newTodo.completed,
        user_id: testUser.id
      })
    })
  })

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const newTodo = {
        title: 'New Test Todo',
        completed: false,
        user_id: testUser.id
      }

      const { data, error } = await supabase
        .from('todos')
        .insert(newTodo)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toMatchObject(newTodo)
    })

    it('should not create todo with empty title', async () => {
      const invalidTodo = {
        title: '',
        completed: false,
        user_id: testUser.id
      }

      const { error } = await supabase
        .from('todos')
        .insert(invalidTodo)

      expect(error).not.toBeNull()
    })
  })

  describe('PUT /todos/:id', () => {
    it('should update todo status', async () => {
      // Créer un todo pour le test
      const { data: newTodo } = await supabase
        .from('todos')
        .insert({
          title: 'Update Test Todo',
          completed: false,
          user_id: testUser.id
        })
        .select()
        .single()

      expect(newTodo).not.toBeNull()

      // Mettre à jour le statut
      const { data: updatedTodo, error } = await supabase
        .from('todos')
        .update({ completed: true })
        .eq('id', newTodo!.id)
        .select()
        .single()

      expect(error).toBeNull()
      expect(updatedTodo).toMatchObject({
        ...newTodo,
        completed: true
      })
    })

    it('should update todo title', async () => {
      // Créer un todo pour le test
      const { data: newTodo } = await supabase
        .from('todos')
        .insert({
          title: 'Original Title',
          completed: false,
          user_id: testUser.id
        })
        .select()
        .single()

      expect(newTodo).not.toBeNull()

      const updatedTitle = 'Updated Title'
      const { data: updatedTodo, error } = await supabase
        .from('todos')
        .update({ title: updatedTitle })
        .eq('id', newTodo!.id)
        .select()
        .single()

      expect(error).toBeNull()
      expect(updatedTodo).toMatchObject({
        ...newTodo,
        title: updatedTitle
      })
    })
  })

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      // Créer un todo pour le test
      const { data: newTodo } = await supabase
        .from('todos')
        .insert({
          title: 'Todo to Delete',
          completed: false,
          user_id: testUser.id
        })
        .select()
        .single()

      expect(newTodo).not.toBeNull()

      // Supprimer le todo
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('id', newTodo!.id)

      expect(deleteError).toBeNull()

      // Vérifier que le todo a été supprimé
      const { data: checkTodo, error: checkError } = await supabase
        .from('todos')
        .select()
        .eq('id', newTodo!.id)
        .single()

      expect(checkError).not.toBeNull()
      expect(checkTodo).toBeNull()
    })

    it('should not delete todos of other users', async () => {
      // Créer un deuxième utilisateur
      const { data: otherAuthData } = await supabase.auth.signUp({
        email: `other-${Date.now()}@example.com`,
        password: 'testPassword123!'
      })

      // Créer un todo pour l'autre utilisateur
      const { data: otherTodo } = await supabase
        .from('todos')
        .insert({
          title: 'Other User Todo',
          completed: false,
          user_id: otherAuthData.user!.id
        })
        .select()
        .single()

      // Essayer de supprimer le todo de l'autre utilisateur
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('id', otherTodo!.id)
        .eq('user_id', testUser.id)

      expect(deleteError).toBeNull()

      // Vérifier que le todo existe toujours
      const { data: checkTodo } = await supabase
        .from('todos')
        .select()
        .eq('id', otherTodo!.id)
        .single()

      expect(checkTodo).not.toBeNull()

      // Nettoyer les données de l'autre utilisateur
      await supabase.from('todos').delete().eq('user_id', otherAuthData.user!.id)
      await supabase.auth.admin.deleteUser(otherAuthData.user!.id)
    })
  })
}) 