import { describe, expect, it } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'
import { CreateWorkspaceData, UpdateWorkspaceData } from '@/types/workspace'
import { workspaceService } from '@/services/workspace'

const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

describe('workspaceService', () => {
  describe('createWorkspace', () => {
    it('should create a workspace', async () => {
      const data: CreateWorkspaceData = {
        name: 'Test Workspace',
        description: 'Test Description',
        type: 'private'
      }

      const workspace = await workspaceService.createWorkspace(data)

      expect(workspace).toBeDefined()
      expect(workspace.name).toBe(data.name)
      expect(workspace.description).toBe(data.description)
      expect(workspace.type).toBe(data.type)
    })
  })

  describe('getWorkspace', () => {
    it('should get a workspace by id', async () => {
      const data: CreateWorkspaceData = {
        name: 'Test Workspace',
        description: 'Test Description',
        type: 'private'
      }

      const createdWorkspace = await workspaceService.createWorkspace(data)
      const workspace = await workspaceService.getWorkspace(createdWorkspace.id)

      expect(workspace).toBeDefined()
      expect(workspace?.id).toBe(createdWorkspace.id)
    })
  })

  describe('updateWorkspace', () => {
    it('should update a workspace', async () => {
      const data: CreateWorkspaceData = {
        name: 'Test Workspace',
        description: 'Test Description',
        type: 'private'
      }

      const createdWorkspace = await workspaceService.createWorkspace(data)

      const updateData: UpdateWorkspaceData = {
        name: 'Updated Workspace',
        description: 'Updated Description',
        type: 'professional'
      }

      const updatedWorkspace = await workspaceService.updateWorkspace(createdWorkspace.id, updateData)

      expect(updatedWorkspace).toBeDefined()
      expect(updatedWorkspace.name).toBe(updateData.name)
      expect(updatedWorkspace.description).toBe(updateData.description)
      expect(updatedWorkspace.type).toBe(updateData.type)
    })
  })

  describe('deleteWorkspace', () => {
    it('should delete a workspace', async () => {
      const data: CreateWorkspaceData = {
        name: 'Test Workspace',
        description: 'Test Description',
        type: 'private'
      }

      const createdWorkspace = await workspaceService.createWorkspace(data)
      await workspaceService.deleteWorkspace(createdWorkspace.id)

      const workspace = await workspaceService.getWorkspace(createdWorkspace.id)
      expect(workspace).toBeNull()
    })
  })

  describe('getUserWorkspaces', () => {
    it('should get workspaces by user id', async () => {
      const data: CreateWorkspaceData = {
        name: 'Test Workspace',
        description: 'Test Description',
        type: 'private'
      }

      await workspaceService.createWorkspace(data)
      const workspaces = await workspaceService.getUserWorkspaces()

      expect(Array.isArray(workspaces)).toBe(true)
    })
  })
}) 