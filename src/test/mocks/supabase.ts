import { SupabaseClient } from '@supabase/supabase-js'
import { vi } from 'vitest'

export const mockSupabaseClient = {
  supabaseUrl: 'http://localhost:54321',
  supabaseKey: 'dummy-key',
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue({ data: [], error: null }),
  }),
  auth: {
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  storage: {
    from: vi.fn(),
  },
} as unknown as SupabaseClient

export const resetSupabaseMocks = () => {
  vi.clearAllMocks()
  Object.values(mockSupabaseClient).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockClear()
    }
  })
}

vi.mock('@/lib/supabase/client', () => ({
  supabase: mockSupabaseClient
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