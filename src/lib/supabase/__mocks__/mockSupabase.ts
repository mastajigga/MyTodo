import { vi } from 'vitest';

type MockReturnValue = {
  data: any;
  error: Error | null;
};

type MockQueryBuilder = {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
};

const createMockQueryBuilder = (): MockQueryBuilder => ({
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  eq: vi.fn(),
  order: vi.fn(),
  single: vi.fn()
});

export const mockSupabase = {
  from: vi.fn(() => createMockQueryBuilder()),
  auth: {
    getUser: vi.fn(),
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
    session: null,
    user: null
  },
  channel: vi.fn(() => ({
    on: vi.fn(() => ({
      subscribe: vi.fn()
    })),
    unsubscribe: vi.fn()
  }))
}; 