import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ProjectService } from '@/services/project.service'
import { mockSupabaseClient } from '@/test/mocks/supabase'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project'
import type { Database } from '@/types/supabase'

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn()
}))

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createClientComponentClient<Database>).mockReturnValue(mockSupabaseClient)
  })

  describe('getProject', () => {
    it('should get a project by id', async () => {
      const mockProject: Project = {
        id: '1',
        name: 'Test Project',
        description: null,
        workspace_id: 'workspace-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      vi.mocked(mockSupabaseClient.from).mockReturnValueOnce({
        ...mockSupabaseClient.from('projects'),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: mockProject,
          error: null,
        }),
      } as any)

      const result = await ProjectService.getProject('1')
      expect(result).toEqual(mockProject)
    })
  })

  describe('createProject', () => {
    it('should create a new project', async () => {
      const input: CreateProjectInput = {
        workspace_id: 'workspace-1',
        name: 'New Project',
        description: null,
      }

      const mockProject: Project = {
        id: '1',
        workspace_id: input.workspace_id,
        name: input.name,
        description: input.description ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      vi.mocked(mockSupabaseClient.from).mockReturnValueOnce({
        ...mockSupabaseClient.from('projects'),
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: mockProject,
          error: null,
        }),
      } as any)

      const result = await ProjectService.createProject(input)
      expect(result).toEqual(mockProject)
    })
  })

  describe('updateProject', () => {
    it('should update an existing project', async () => {
      const input: UpdateProjectInput = {
        name: 'Updated Project',
        description: 'Updated description',
      }

      const mockProject: Project = {
        id: '1',
        workspace_id: 'workspace-1',
        name: 'Updated Project',
        description: 'Updated description',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      vi.mocked(mockSupabaseClient.from).mockReturnValueOnce({
        ...mockSupabaseClient.from('projects'),
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: mockProject,
          error: null,
        }),
      } as any)

      const result = await ProjectService.updateProject('1', input)
      expect(result).toEqual(mockProject)
    })
  })

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      vi.mocked(mockSupabaseClient.from).mockReturnValueOnce({
        ...mockSupabaseClient.from('projects'),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValueOnce({
          data: null,
          error: null,
        }),
      } as any)

      await ProjectService.deleteProject('1')
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('projects')
    })
  })
}) 