import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { supabaseTestClient } from '@/lib/supabase/test-client'

describe('Tasks API Integration Tests', () => {
  const testWorkspace = {
    id: 'test-workspace',
    name: 'Test Workspace',
    description: 'Test workspace for integration tests',
    type: 'personal',
    owner_id: 'test-user'
  }

  const testProject = {
    id: 'test-project',
    name: 'Test Project',
    description: 'Test project for integration tests',
    workspace_id: testWorkspace.id,
    owner_id: 'test-user',
    status: 'active'
  }

  beforeEach(async () => {
    // Créer un workspace et un projet de test
    await supabaseTestClient
      .from('workspaces')
      .insert(testWorkspace)

    await supabaseTestClient
      .from('projects')
      .insert(testProject)
  })

  afterEach(async () => {
    // Nettoyer les données de test
    await supabaseTestClient.from('tasks').delete().eq('project_id', testProject.id)
    await supabaseTestClient.from('projects').delete().eq('id', testProject.id)
    await supabaseTestClient.from('workspaces').delete().eq('id', testWorkspace.id)
  })

  describe('Tasks CRUD Operations', () => {
    it('should create and retrieve a task', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'Test description',
        status: 'todo' as const,
        priority: 'medium' as const,
        workspace_id: testWorkspace.id,
        project_id: testProject.id,
        created_by: 'test-user',
        position: 1,
        tags: []
      }

      const { data: createdTask, error: createError } = await supabaseTestClient
        .from('tasks')
        .insert(newTask)
        .select('*')
        .single()

      expect(createError).toBeNull()
      expect(createdTask).toMatchObject(newTask)

      if (!createdTask) throw new Error('Task not created')

      const { data: retrievedTask, error: retrieveError } = await supabaseTestClient
        .from('tasks')
        .select('*')
        .eq('id', createdTask.id)
        .single()

      expect(retrieveError).toBeNull()
      expect(retrievedTask).toMatchObject(newTask)
    })

    it('should update a task', async () => {
      const newTask = {
        title: 'Original Task',
        description: 'Original description',
        status: 'todo' as const,
        priority: 'medium' as const,
        workspace_id: testWorkspace.id,
        project_id: testProject.id,
        created_by: 'test-user',
        position: 1,
        tags: []
      }

      const { data: createdTask } = await supabaseTestClient
        .from('tasks')
        .insert(newTask)
        .select('*')
        .single()

      if (!createdTask) throw new Error('Task not created')

      const updateData = {
        title: 'Updated Task',
        status: 'in_progress' as const
      }

      const { data: updatedTask, error: updateError } = await supabaseTestClient
        .from('tasks')
        .update(updateData)
        .eq('id', createdTask.id)
        .select('*')
        .single()

      expect(updateError).toBeNull()
      expect(updatedTask).toMatchObject({
        ...newTask,
        ...updateData
      })
    })

    it('should delete a task', async () => {
      const newTask = {
        title: 'Task to Delete',
        description: 'Will be deleted',
        status: 'todo' as const,
        priority: 'medium' as const,
        workspace_id: testWorkspace.id,
        project_id: testProject.id,
        created_by: 'test-user',
        position: 1,
        tags: []
      }

      const { data: createdTask } = await supabaseTestClient
        .from('tasks')
        .insert(newTask)
        .select('*')
        .single()

      if (!createdTask) throw new Error('Task not created')

      const { error: deleteError } = await supabaseTestClient
        .from('tasks')
        .delete()
        .eq('id', createdTask.id)

      expect(deleteError).toBeNull()

      const { data: retrievedTask, error: retrieveError } = await supabaseTestClient
        .from('tasks')
        .select('*')
        .eq('id', createdTask.id)
        .single()

      expect(retrieveError).not.toBeNull()
      expect(retrievedTask).toBeNull()
    })
  })
}) 