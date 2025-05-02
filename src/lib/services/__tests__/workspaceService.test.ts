import { describe, it, expect, vi, beforeEach } from 'vitest'
import { workspaceService } from '../workspaceService'
import { WorkspaceType } from '@/types/supabase'

// Mock de SupabaseClient
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      order: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
        single: vi.fn(() => Promise.resolve({ data: null, error: null }))
      })),
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({
          data: {
            id: 'test-workspace-id',
            name: 'Test Workspace',
            type: WorkspaceType.Private,
            created_by: 'test-user-id'
          },
          error: null
        }))
      }))
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    }))
  }))
} as any

describe('workspaceService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createWorkspace', () => {
    it('devrait créer un workspace et ajouter le créateur comme propriétaire', async () => {
      const workspaceData = {
        name: 'Test Workspace',
        type: WorkspaceType.Private,
        created_by: 'test-user-id'
      }

      const result = await workspaceService.createWorkspace(mockSupabase, workspaceData)

      expect(result).toEqual({
        id: 'test-workspace-id',
        name: 'Test Workspace',
        type: WorkspaceType.Private,
        created_by: 'test-user-id'
      })

      // Vérifier que le workspace a été créé
      expect(mockSupabase.from).toHaveBeenCalledWith('workspaces')
      
      // Vérifier que le membre a été ajouté
      expect(mockSupabase.from).toHaveBeenCalledWith('workspace_members')
    })

    it("devrait supprimer le workspace si l'ajout du membre échoue", async () => {
      const workspaceData = {
        name: 'Test Workspace',
        type: WorkspaceType.Private,
        created_by: 'test-user-id'
      }

      // Simuler une erreur lors de l'ajout du membre
      mockSupabase.from.mockImplementationOnce(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: {
                id: 'test-workspace-id',
                ...workspaceData
              },
              error: null
            }))
          }))
        }))
      })).mockImplementationOnce(() => ({
        insert: vi.fn(() => Promise.resolve({
          error: new Error("Erreur lors de l'ajout du membre")
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null }))
        }))
      }))

      await expect(workspaceService.createWorkspace(mockSupabase, workspaceData))
        .rejects.toThrow()

      // Vérifier que le workspace a été supprimé
      expect(mockSupabase.from).toHaveBeenCalledWith('workspaces')
      expect(mockSupabase.from).toHaveBeenCalledWith('workspace_members')
    })
  })

  describe('getUserWorkspaces', () => {
    it('devrait récupérer les workspaces de l\'utilisateur', async () => {
      const mockWorkspaces = [
        {
          id: 'test-workspace-1',
          name: 'Workspace 1',
          type: WorkspaceType.Private
        },
        {
          id: 'test-workspace-2',
          name: 'Workspace 2',
          type: WorkspaceType.Professional
        }
      ]

      mockSupabase.from.mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: mockWorkspaces,
            error: null
          }))
        }))
      }))

      const result = await workspaceService.getUserWorkspaces(mockSupabase)

      expect(result).toEqual(mockWorkspaces)
      expect(mockSupabase.from).toHaveBeenCalledWith('workspaces')
    })
  })
}) 