import { vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

export type MockSupabaseResponse<T = any> = {
  data: T | null;
  error: { message: string } | null;
};

export type MockSupabaseQueryBuilder = {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
};

export type MockSupabaseClient = {
  from: ReturnType<typeof vi.fn>;
  auth: {
    getSession: ReturnType<typeof vi.fn>;
    signOut: ReturnType<typeof vi.fn>;
  };
} & Partial<SupabaseClient<Database>>;

export const createMockSupabaseResponse = <T>(
  data: T | null = null,
  error: { message: string } | null = null
): MockSupabaseResponse<T> => ({
  data,
  error,
});

export const createMockQueryBuilder = (): MockSupabaseQueryBuilder => {
  const mockSingle = vi.fn();
  const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
  const mockOrder = vi.fn().mockReturnValue({ single: mockSingle });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq, order: mockOrder, single: mockSingle });
  
  return {
    select: mockSelect,
    insert: vi.fn().mockReturnValue({ select: mockSelect }),
    update: vi.fn().mockReturnValue({ select: mockSelect }),
    delete: vi.fn().mockReturnValue({ eq: mockEq }),
    eq: mockEq,
    order: mockOrder,
    single: mockSingle,
  };
};

export const createMockSupabaseClient = (): MockSupabaseClient => {
  const queryBuilder = createMockQueryBuilder();
  
  return {
    from: vi.fn().mockReturnValue(queryBuilder),
    auth: {
      getSession: vi.fn(),
      signOut: vi.fn(),
    },
  } as MockSupabaseClient;
}; 