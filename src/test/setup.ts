import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { TextEncoder, TextDecoder } from 'util'
import { mockSupabase, resetSupabaseMocks } from './mocks/supabase'
import { AuthError } from '@supabase/supabase-js'

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
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock de Supabase
vi.mock('@/lib/supabase/client', () => ({
  supabase: mockSupabase,
  getSupabaseClient: () => mockSupabase,
}))

// Mock des fonctions de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
};

global.localStorage = localStorageMock;

// Mock des fonctions de window qui ne sont pas implémentées dans JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

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

  // Configuration globale avant tous les tests
  vi.mock('next/headers', () => ({
    cookies: () => ({
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    }),
  }));

  // Mock de createClientComponentClient
  vi.mock('@supabase/auth-helpers-nextjs', () => ({
    createClientComponentClient: () => mockSupabase,
    createServerComponentClient: () => mockSupabase,
  }));
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  resetSupabaseMocks()
})

// Configuration de l'environnement de test
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase,
  AuthError: class extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'AuthError'
    }
  }
}))

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    register: vi.fn(),
    handleSubmit: vi.fn(),
    formState: { errors: {} },
    reset: vi.fn(),
  })),
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks()
}) 