import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useWorkspace } from '../useWorkspace'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Types pour les tests
type CreateWorkspaceData = {
  name: string
  description?: string
  type: 'family' | 'professional' | 'private'
}

// Mock Supabase client
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }))
}))

// Mock WorkspaceContext
vi.mock('@/contexts/workspace-context', () => ({
  WorkspaceContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
    Consumer: ({ children }: { children: React.ReactNode }) => children
  }
}))

describe('useWorkspace hook', () => {
  const mockUser = { id: 'test-user-id' }
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = createClientComponentClient()
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
  })

  it('devrait créer un espace de travail avec un type valide', async () => {
    const validWorkspaceData: CreateWorkspaceData = {
      name: 'Test Workspace',
      type: 'family',
      description: 'Test Description'
    }

    mockSupabase.from().insert().select().single.mockResolvedValue({
      data: { ...validWorkspaceData, id: 1, created_by: mockUser.id },
      error: null
    })

    const { result } = renderHook(() => useWorkspace())

    await act(async () => {
      const workspace = await result.current.createWorkspace(validWorkspaceData)
      expect(workspace).toEqual({
        ...validWorkspaceData,
        id: 1,
        created_by: mockUser.id
      })
    })
  })

  it('devrait rejeter un type d\'espace de travail invalide', async () => {
    const invalidWorkspaceData = {
      name: 'Test Workspace',
      type: 'invalid_type',
      description: 'Test Description'
    }

    mockSupabase.from().insert().select().single.mockResolvedValue({
      data: null,
      error: {
        code: 'P0001',
        message: 'invalid workspace type'
      }
    })

    const { result } = renderHook(() => useWorkspace())

    await act(async () => {
      await expect(result.current.createWorkspace(invalidWorkspaceData as CreateWorkspaceData)).rejects.toThrow()
    })
  })

  it('devrait tester tous les types d\'espace de travail valides', async () => {
    const validTypes = ['family', 'professional', 'private'] as const

    for (const type of validTypes) {
      const workspaceData: CreateWorkspaceData = {
        name: `Test ${type} Workspace`,
        type: type,
        description: `Test ${type} Description`
      }

      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: { ...workspaceData, id: 1, created_by: mockUser.id },
        error: null
      })

      const { result } = renderHook(() => useWorkspace())

      await act(async () => {
        const workspace = await result.current.createWorkspace(workspaceData)
        expect(workspace).toEqual({
          ...workspaceData,
          id: 1,
          created_by: mockUser.id
        })
      })
    }
  })

  it('devrait rejeter si l\'utilisateur n\'est pas connecté', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

    const workspaceData: CreateWorkspaceData = {
      name: 'Test Workspace',
      type: 'family'
    }

    const { result } = renderHook(() => useWorkspace())

    await act(async () => {
      await expect(result.current.createWorkspace(workspaceData)).rejects.toThrow('Utilisateur non connecté')
    })
  })
}) 