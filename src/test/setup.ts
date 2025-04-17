import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { TextEncoder, TextDecoder } from 'util'
import { mockSupabase } from './mocks/supabase'

expect.extend(matchers)

// Mock des API du navigateur
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder

// Mock de fetch
global.fetch = vi.fn()

// Mock de Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock de Supabase
vi.mock('@/lib/supabase/client', () => ({
  supabase: mockSupabase,
  getSupabaseClient: () => mockSupabase,
}))

// Nettoie le DOM après chaque test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Suppression des avertissements de console pendant les tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: useLayoutEffect does nothing on the server') ||
       args[0].includes('Warning: Invalid hook call'))
    ) {
      return
    }
    originalConsoleError.call(console, ...args)
  }

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: useLayoutEffect does nothing on the server')
    ) {
      return
    }
    originalConsoleWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
}); 