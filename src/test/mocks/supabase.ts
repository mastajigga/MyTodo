import { vi } from 'vitest'
import type { Database } from '../../lib/database.types'
import { SupabaseClient } from '@supabase/supabase-js'

// Type pour les réponses Supabase mockées
type MockSupabaseResponse<T> = {
  data: T | null
  error: { message: string } | null
  status: number
  statusText: string
  count: number
}

// Création d'une réponse Supabase mockée
const createMockResponse = <T>(
  data: T | null = null,
  error: { message: string } | null = null
): MockSupabaseResponse<T> => ({
  data,
  error,
  status: error ? 400 : 200,
  statusText: error ? 'Bad Request' : 'OK',
  count: data ? 1 : 0,
})

// Mock du client Supabase
export const mockSupabase = {
  from: vi.fn((table: string) => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockImplementation(() => 
      Promise.resolve(createMockResponse(null))
    ),
    match: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  })),
  
  auth: {
    getUser: vi.fn().mockResolvedValue(createMockResponse({ 
      user: { 
        id: 'test-user',
        email: 'test@example.com',
        role: 'authenticated',
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } 
    })),
    signInWithPassword: vi.fn().mockResolvedValue(createMockResponse({ 
      user: { id: 'test-user' } 
    })),
    signInWithOAuth: vi.fn().mockResolvedValue(createMockResponse({ 
      provider: 'github',
      url: 'http://localhost:3000/auth/callback'
    })),
    signOut: vi.fn().mockResolvedValue(createMockResponse(null)),
    onAuthStateChange: vi.fn().mockImplementation((callback) => {
      callback('SIGNED_IN', { user: { id: 'test-user' } })
      return { 
        data: { subscription: { unsubscribe: vi.fn() } },
        error: null 
      }
    }),
  },

  storage: {
    from: vi.fn().mockReturnValue({
      upload: vi.fn().mockResolvedValue(createMockResponse(null)),
      download: vi.fn().mockResolvedValue(createMockResponse(null)),
      remove: vi.fn().mockResolvedValue(createMockResponse(null)),
    }),
  },

  rpc: vi.fn().mockResolvedValue(createMockResponse(null)),
  
  functions: {
    invoke: vi.fn().mockResolvedValue(createMockResponse(null)),
  },
} as unknown as SupabaseClient<Database>

// Fonction pour réinitialiser tous les mocks
export const resetSupabaseMocks = () => {
  vi.clearAllMocks()
  Object.values(mockSupabase).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockClear()
    }
  })
}

// Mock du module client Supabase
vi.mock('@/lib/supabase/client', () => ({
  supabase: mockSupabase,
  getSupabaseClient: () => mockSupabase,
}))

export const mockProject = {
  id: '1',
  workspace_id: 'workspace-1',
  name: 'Test Project',
  description: 'A test project',
  color: '#FF0000',
  completed: false,
  created_at: '2024-04-07T12:00:00Z',
  updated_at: '2024-04-07T12:00:00Z'
}

export const mockNotification = {
  id: '1',
  user_id: 'user-1',
  type: 'mention',
  content: 'You were mentioned in a task',
  read: false,
  task_id: 'task-1',
  created_at: '2024-04-07T12:00:00Z'
} 