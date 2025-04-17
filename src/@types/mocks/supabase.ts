import { vi } from 'vitest';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase';

export type MockSupabaseResponse<T> = {
  data: T;
  error: null | Error;
};

export type MockFunction = ReturnType<typeof vi.fn>;

export interface MockSupabaseQueryBuilder {
  select: MockFunction;
  insert: MockFunction;
  update: MockFunction;
  delete: MockFunction;
  eq: MockFunction;
  order: MockFunction;
  single: MockFunction;
}

export type MockSupabaseClient = {
  from: (table: string) => MockSupabaseQueryBuilder;
  auth: {
    getUser: MockFunction;
    signInWithOAuth: MockFunction;
    signOut: MockFunction;
    signInWithPassword: MockFunction;
    signUp: MockFunction;
    getSession: MockFunction;
  };
};

export const createMockSupabaseResponse = <T>(data: T): MockSupabaseResponse<T> => ({
  data,
  error: null,
});

export const createMockQueryBuilder = (): MockSupabaseQueryBuilder => {
  return {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  };
};

export const createMockSupabaseClient = (): MockSupabaseClient => ({
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
}); 