import { vi } from 'vitest'
import type { Database } from '@/@types/supabase'

export const mockSupabase = {
  from: vi.fn((table: string) => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  })),
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
    signInWithOAuth: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn().mockImplementation((callback) => {
      callback('SIGNED_IN', { user: { id: 'test-user' } });
      return { data: { subscription: { unsubscribe: vi.fn() } }, error: null };
    }),
  },
  rpc: vi.fn().mockReturnThis(),
} as unknown as ReturnType<typeof import('@supabase/supabase-js').createClient<Database>>

export const resetSupabaseMocks = () => {
  vi.clearAllMocks()
  Object.values(mockSupabase).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockClear()
    }
  })
}

vi.mock('@/lib/supabase/client', () => ({
  supabase: mockSupabase
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