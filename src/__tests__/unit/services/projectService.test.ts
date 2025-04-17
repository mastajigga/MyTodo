import { describe, it, expect, beforeEach, vi } from 'vitest'
import { projectService } from '@/services/projectService'
import { supabase } from '@/lib/supabase/client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Project, CreateProjectData, UpdateProjectData } from '@/types/project'
import type { Database } from '@/types/supabase'

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn()
}))

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createClientComponentClient<Database>).mockReturnValue(supabase)
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
        position: 0,
        created_by: '1',
        is_archived: false
      }

      vi.mocked(supabase.from).mockReturnValueOnce({
        ...supabase.from('projects'),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: mockProject,
          error: null,
        }),
      } as any)

      const result = await projectService.getProject('1')
      expect(result).toEqual(mockProject)
    })
  })

  describe('createProject', () => {
    it('should create a new project', async () => {
      const input: CreateProjectData = {
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
        position: 0,
        created_by: '1',
        is_archived: false
      }

      vi.mocked(supabase.from).mockReturnValueOnce({
        ...supabase.from('projects'),
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: mockProject,
          error: null,
        }),
      } as any)

      const result = await projectService.createProject(input)
      expect(result).toEqual(mockProject)
    })
  })

  describe('updateProject', () => {
    it('should update an existing project', async () => {
      const input: UpdateProjectData = {
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
        position: 0,
        created_by: '1',
        is_archived: false
      }

      vi.mocked(supabase.from).mockReturnValueOnce({
        ...supabase.from('projects'),
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: mockProject,
          error: null,
        }),
      } as any)

      const result = await projectService.updateProject('1', input)
      expect(result).toEqual(mockProject)
    })
  })

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        ...supabase.from('projects'),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValueOnce({
          data: null,
          error: null,
        }),
      } as any)

      await projectService.deleteProject('1')
      expect(supabase.from).toHaveBeenCalledWith('projects')
    })
  })
}) 