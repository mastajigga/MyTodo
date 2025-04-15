import { vi } from 'vitest';

export const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    single: vi.fn()
  })),
  auth: {
    getUser: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn()
  }
}; 