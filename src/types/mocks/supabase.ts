import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'
import { Mock, vi } from 'vitest'

type SupabaseResponse<T> = {
  data: T | null
  error: { message: string } | null
  status: number
  statusText: string
  count: number
}

type MockFunctionExtensions = {
  mockReturnThis(): any
  mockResolvedValueOnce(value: any): any
}

export type MockFunction = Mock & MockFunctionExtensions

export interface MockSupabaseQueryBuilder {
  select: MockFunction
  insert: MockFunction
  update: MockFunction
  delete: MockFunction
  eq: MockFunction
  single: MockFunction
  upsert: MockFunction
  mockReturnThis(): MockSupabaseQueryBuilder
  mockResolvedValueOnce(value: any): MockSupabaseQueryBuilder
}

export type MockSupabaseClient = {
  from: Mock<(table: string) => MockSupabaseQueryBuilder>
} & Partial<SupabaseClient<Database>>

export const createMockSupabaseResponse = <T>(
  data: T | null = null,
  error: { message: string } | null = null
): SupabaseResponse<T> => ({
  data,
  error,
  status: error ? 400 : 200,
  statusText: error ? 'Bad Request' : 'OK',
  count: data ? 1 : 0,
})

const extendMockFunction = (mockFn: Mock): MockFunction => {
  const extended = mockFn as MockFunction
  extended.mockReturnThis = function() {
    this.mockImplementation(() => this)
    return this
  }
  extended.mockResolvedValueOnce = function(value: any) {
    this.mockImplementationOnce(() => Promise.resolve(value))
    return this
  }
  return extended
}

const createMockFunction = (): MockFunction => {
  return extendMockFunction(vi.fn())
}

export const createMockSupabaseQueryBuilder = (): MockSupabaseQueryBuilder => {
  const builder: MockSupabaseQueryBuilder = {
    select: createMockFunction(),
    insert: createMockFunction(),
    update: createMockFunction(),
    delete: createMockFunction(),
    eq: createMockFunction(),
    single: createMockFunction(),
    upsert: createMockFunction(),
    mockReturnThis() {
      Object.values(this).forEach(mock => {
        if (typeof mock === 'function' && 'mockReturnThis' in mock) {
          (mock as MockFunction).mockReturnThis()
        }
      })
      return this
    },
    mockResolvedValueOnce(value: any) {
      Object.values(this).forEach(mock => {
        if (typeof mock === 'function' && 'mockResolvedValueOnce' in mock) {
          (mock as MockFunction).mockResolvedValueOnce(value)
        }
      })
      return this
    }
  }
  return builder
}

export const createMockSupabaseClient = (): MockSupabaseClient => {
  const queryBuilder = createMockSupabaseQueryBuilder()
  const mockFrom = vi.fn().mockReturnValue(queryBuilder)
  return {
    from: mockFrom,
  }
} 