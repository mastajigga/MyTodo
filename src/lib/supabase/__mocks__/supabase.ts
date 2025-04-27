import { vi } from 'vitest';

export const createMockSupabaseClient = () => ({
  from: vi.fn(),
  rpc: vi.fn(),
  auth: {
    getUser: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
}); 