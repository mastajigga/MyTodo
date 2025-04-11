import { vi } from 'vitest';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase';

export type MockSupabaseResponse<T> = {
  data: T;
  error: null | Error;
};

export interface MockSupabaseQueryBuilder {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
}

export type MockSupabaseClient = Pick<SupabaseClient<Database>, 'from'> & {
  from: (table: string) => MockSupabaseQueryBuilder;
  auth: {
    getUser: ReturnType<typeof vi.fn>;
    signInWithOAuth: ReturnType<typeof vi.fn>;
    signOut: ReturnType<typeof vi.fn>;
    signInWithPassword: ReturnType<typeof vi.fn>;
    signUp: ReturnType<typeof vi.fn>;
    getSession: ReturnType<typeof vi.fn>;
  };
};

export const createMockSupabaseResponse = <T>(data: T): MockSupabaseResponse<T> => ({
  data,
  error: null,
});

export const createMockQueryBuilder = (): MockSupabaseQueryBuilder => ({
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockResolvedValue(createMockSupabaseResponse([])),
  update: vi.fn().mockResolvedValue(createMockSupabaseResponse([])),
  delete: vi.fn().mockResolvedValue(createMockSupabaseResponse([])),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
});

export const createMockSupabaseClient = () => ({
  from: vi.fn().mockReturnValue(createMockQueryBuilder()),
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      },
      error: null
    }),
    signInWithOAuth: vi.fn().mockResolvedValue({
      data: { provider: 'github', url: 'http://localhost:3000/auth/callback' },
      error: null
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
      error: null
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
      error: null
    }),
    getSession: vi.fn().mockResolvedValue({
      data: {
        session: { user: { id: 'user-123', email: 'test@example.com' } }
      },
      error: null
    })
  }
}) as MockSupabaseClient; 