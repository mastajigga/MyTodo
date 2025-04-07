import { describe, it, expect, beforeEach, vi } from 'vitest'
import { projectService } from '../projectService'
import { mockSupabaseClient, mockProject, resetSupabaseMocks } from '@/test/mocks/supabase'

describe('projectService', () => {
  beforeEach(() => {
    resetSupabaseMocks()
  })

  describe('getProjects', () => {
    it('should fetch projects successfully', async () => {
      const mockProjects = [mockProject]
      mockSupabaseClient.from().single.mockResolvedValueOnce({ data: mockProjects, error: null })

      const result = await projectService.getProjects('workspace-1')
      expect(result).toEqual(mockProjects)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('projects')
    })

    it('should throw error when fetch fails', async () => {
      const mockError = new Error('Failed to fetch')
      mockSupabaseClient.from().single.mockResolvedValueOnce({ data: null, error: mockError })

      await expect(projectService.getProjects('workspace-1')).rejects.toThrow()
    })
  })

  describe('createProject', () => {
    it('should create project successfully', async () => {
      mockSupabaseClient.from().single.mockResolvedValueOnce({ data: mockProject, error: null })

      const result = await projectService.createProject({
        workspace_id: 'workspace-1',
        name: 'Test Project'
      })

      expect(result).toEqual(mockProject)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('projects')
    })

    it('should throw error when creation fails', async () => {
      const mockError = new Error('Failed to create')
      mockSupabaseClient.from().single.mockResolvedValueOnce({ data: null, error: mockError })

      await expect(projectService.createProject({
        workspace_id: 'workspace-1',
        name: 'Test Project'
      })).rejects.toThrow()
    })
  })

  describe('updateProject', () => {
    it('should update project successfully', async () => {
      mockSupabaseClient.from().single.mockResolvedValueOnce({ data: mockProject, error: null })

      const result = await projectService.updateProject('1', { name: 'Updated Project' })
      expect(result).toEqual(mockProject)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('projects')
    })

    it('should throw error when update fails', async () => {
      const mockError = new Error('Failed to update')
      mockSupabaseClient.from().single.mockResolvedValueOnce({ data: null, error: mockError })

      await expect(projectService.updateProject('1', { name: 'Updated Project' })).rejects.toThrow()
    })
  })

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      mockSupabaseClient.from().mockResolvedValueOnce({ error: null })

      await projectService.deleteProject('1')
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('projects')
    })

    it('should throw error when deletion fails', async () => {
      const mockError = new Error('Failed to delete')
      mockSupabaseClient.from().mockResolvedValueOnce({ error: mockError })

      await expect(projectService.deleteProject('1')).rejects.toThrow()
    })
  })

  describe('reorderProjects', () => {
    it('should reorder projects successfully', async () => {
      mockSupabaseClient.rpc.mockResolvedValueOnce({ error: null })

      await projectService.reorderProjects([mockProject])
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('reorder_projects', {
        project_ids: [mockProject.id]
      })
    })

    it('should throw error when reordering fails', async () => {
      const mockError = new Error('Failed to reorder')
      mockSupabaseClient.rpc.mockResolvedValueOnce({ error: mockError })

      await expect(projectService.reorderProjects([mockProject])).rejects.toThrow()
    })
  })

  describe('subscribeToProjects', () => {
    it('should subscribe to project changes successfully', () => {
      const callback = vi.fn()
      const subscription = projectService.subscribeToProjects('workspace-1', callback)

      expect(mockSupabaseClient.channel).toHaveBeenCalledWith('projects:workspace-1')
      expect(subscription.unsubscribe).toBeDefined()
    })
  })
}) 