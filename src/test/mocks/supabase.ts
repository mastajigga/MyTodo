import { vi } from 'vitest'
import { SupabaseClient } from '@supabase/supabase-js'

type MockSupabaseClient = {
  from: (table: string) => {
    select: (query?: string) => {
      eq: (column: string, value: any) => {
        single: () => Promise<{ data: any; error: null | Error }>
        data: any[]
        error: null | Error
      }
      data: any[]
      error: null | Error
    }
    insert: (data: any) => {
      select: (query?: string) => {
        single: () => Promise<{ data: any; error: null | Error }>
      }
    }
    update: (data: any) => {
      eq: (column: string, value: any) => {
        single: () => Promise<{ data: any; error: null | Error }>
      }
    }
    delete: () => {
      eq: (column: string, value: any) => {
        data: any
        error: null | Error
      }
    }
  }
  auth: {
    getUser: () => Promise<{ data: { user: any }; error: null | Error }>
    signInWithPassword: (credentials: { email: string; password: string }) => Promise<{ data: any; error: null | Error }>
    signInWithOAuth: (options: any) => Promise<{ data: any; error: null | Error }>
    signOut: () => Promise<{ error: null | Error }>
  }
}

export const mockSupabaseClient: MockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({
          data: null,
          error: null
        })),
        data: null,
        error: null
      })),
      data: null,
      error: null
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({
          data: null,
          error: null
        }))
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({
          data: null,
          error: null
        }))
      }))
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => ({
        data: null,
        error: null
      }))
    }))
  })),
  auth: {
    getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    signInWithPassword: vi.fn(() => Promise.resolve({ data: null, error: null })),
    signInWithOAuth: vi.fn(() => Promise.resolve({ data: null, error: null })),
    signOut: vi.fn(() => Promise.resolve({ error: null }))
  }
}

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