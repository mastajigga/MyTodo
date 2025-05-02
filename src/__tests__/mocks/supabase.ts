import { vi } from 'vitest';
import type { Database } from '../../types/supabase';
import type { Task } from '../../types/task';
import type { SupabaseClient } from '@supabase/supabase-js';

type MockData = {
  tasks?: Task[];
  error?: Error | null;
  delay?: number;
  transformResponse?: (data: any) => any;
};

type MockSupabaseClient = {
  from: SupabaseClient<Database>['from'];
  auth: Partial<SupabaseClient<Database>['auth']>;
};

export const createMockSupabaseClient = (mockData: MockData = {}): MockSupabaseClient => {
  const mockQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockImplementation((data) => ({
      ...mockQueryBuilder,
      data,
      then: vi.fn().mockImplementation(async () => {
        if (mockData.delay) {
          await new Promise(resolve => setTimeout(resolve, mockData.delay));
        }
        const response = { data: [data], error: null };
        return mockData.transformResponse ? mockData.transformResponse(response) : response;
      }),
    })),
    update: vi.fn().mockImplementation((data) => ({
      ...mockQueryBuilder,
      data,
      then: vi.fn().mockImplementation(async () => {
        if (mockData.delay) {
          await new Promise(resolve => setTimeout(resolve, mockData.delay));
        }
        const response = { data: [data], error: null };
        return mockData.transformResponse ? mockData.transformResponse(response) : response;
      }),
    })),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    then: vi.fn().mockImplementation(async () => {
      if (mockData.delay) {
        await new Promise(resolve => setTimeout(resolve, mockData.delay));
      }
      const response = {
        data: mockData.tasks || [],
        error: mockData.error || null,
      };
      return mockData.transformResponse ? mockData.transformResponse(response) : response;
    }),
  };

  return {
    from: vi.fn().mockReturnValue(mockQueryBuilder),
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'test-user-id' } } },
        error: null,
      }),
      onAuthStateChange: vi.fn().mockReturnValue({ 
        data: { subscription: { unsubscribe: vi.fn() } }, 
        error: null 
      }),
    },
  };
};

export const mockCreateClientComponentClient = vi.fn().mockImplementation(() => createMockSupabaseClient());

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createServerComponentClient: () => createMockSupabaseClient(),
}));

vi.mock('@supabase/auth-helpers-nextjs/react', () => ({
  createClientComponentClient: () => createMockSupabaseClient(),
})); 