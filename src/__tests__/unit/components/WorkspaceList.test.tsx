import { render, screen, waitFor, act } from '@testing-library/react'
import { WorkspaceList } from '../WorkspaceList'
import { createClient } from '@/lib/supabase/client'

jest.mock('@/lib/supabase/client')
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

const mockWorkspaces = [
  {
    id: '1',
    name: 'Test Workspace',
    description: 'Test Description',
    type: 'professional',
    members: [{ count: 2 }]
  }
]

const mockChannel = {
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn().mockReturnThis(),
  unsubscribe: jest.fn()
}

// Helper pour configurer les mocks de Supabase
const setupSupabaseMocks = (config: {
  workspaceMembers?: any[],
  workspaces?: any[],
  shouldFail?: boolean,
  delay?: number
}) => {
  const mockError = new Error('Test error')
  
  return {
    auth: {
      getUser: jest.fn().mockImplementation(() =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (config.shouldFail) {
              reject(mockError)
            } else {
              resolve({ data: { user: { id: 'test-user' } } })
            }
          }, config.delay || 0)
        })
      )
    },
    from: jest.fn().mockImplementation((table) => {
      if (table === 'workspace_members') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockImplementation(() =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                if (config.shouldFail) {
                  reject(mockError)
                } else {
                  resolve({ data: config.workspaceMembers || [] })
                }
              }, config.delay || 0)
            })
          )
        }
      }
      if (table === 'workspaces') {
        return {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          order: jest.fn().mockImplementation(() =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                if (config.shouldFail) {
                  reject(mockError)
                } else {
                  resolve({ data: config.workspaces || [] })
                }
              }, config.delay || 0)
            })
          )
        }
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis()
      }
    }),
    channel: jest.fn().mockReturnValue(mockChannel)
  }
}

describe('WorkspaceList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('affiche un état de chargement', async () => {
    const mockSupabase = setupSupabaseMocks({ delay: 100 })
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    await act(async () => {
      render(<WorkspaceList />)
    })

    expect(screen.getByText('Mes espaces de travail')).toBeInTheDocument()
    expect(screen.getByText('Créer')).toBeInTheDocument()
    
    // Vérifier l'état de chargement
    const loadingElements = screen.getAllByRole('generic').filter(
      element => element.className.includes('animate-pulse')
    )
    expect(loadingElements.length).toBeGreaterThan(0)
  })

  it('charge et affiche les espaces de travail', async () => {
    const mockWorkspaceMembers = [{ workspace_id: '1' }]
    const mockSupabase = setupSupabaseMocks({
      workspaceMembers: mockWorkspaceMembers,
      workspaces: mockWorkspaces,
      delay: 100
    })
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    await act(async () => {
      render(<WorkspaceList />)
    })

    // Attendre que les données soient chargées
    await waitFor(() => {
      expect(screen.getByText('Test Workspace')).toBeInTheDocument()
    }, { timeout: 1000 })

    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('2 membres')).toBeInTheDocument()
  })

  it('gère les erreurs de chargement', async () => {
    const mockSupabase = setupSupabaseMocks({ shouldFail: true, delay: 100 })
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await act(async () => {
      render(<WorkspaceList />)
    })

    // Attendre que l'erreur soit gérée
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    }, { timeout: 1000 })

    consoleSpy.mockRestore()
  })

  it('souscrit aux changements en temps réel', async () => {
    const mockSupabase = setupSupabaseMocks({})
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    await act(async () => {
      render(<WorkspaceList />)
    })

    expect(mockSupabase.channel).toHaveBeenCalledWith('workspace-changes')
    expect(mockChannel.on).toHaveBeenCalledWith(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'workspaces'
      },
      expect.any(Function)
    )
    expect(mockChannel.subscribe).toHaveBeenCalled()
  })

  it('se désinscrit du channel lors du démontage', async () => {
    const mockSupabase = setupSupabaseMocks({})
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const { unmount } = render(<WorkspaceList />)

    await act(async () => {
      unmount()
    })

    expect(mockChannel.unsubscribe).toHaveBeenCalled()
  })
}) 