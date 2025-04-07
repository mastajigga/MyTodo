import { vi } from 'vitest'

export const mockSupabaseClient = {
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  }),
  rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  channel: vi.fn().mockReturnValue({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnValue({
      unsubscribe: vi.fn()
    })
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

export function resetSupabaseMocks() {
  vi.clearAllMocks()
  Object.values(mockSupabaseClient).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockClear()
    }
  })
} 