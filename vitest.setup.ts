import '@testing-library/jest-dom/vitest'
import { expect, vi, beforeAll, afterEach, afterAll } from 'vitest'
import { TextEncoder, TextDecoder } from 'util'
import { server } from './src/mocks/server'
import React from 'react'

// Polyfills
global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder

// Mock window.matchMedia
window.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

// Mock ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// MSW Setup
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Mock de Supabase
const mockSupabase = {
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
    signOut: vi.fn().mockResolvedValue({ error: null })
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [], error: null }),
    update: vi.fn().mockResolvedValue({ data: [], error: null }),
    delete: vi.fn().mockResolvedValue({ data: [], error: null }),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis()
  })
}

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabase,
}))

// Mock next/navigation
const mockRouter = {
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
}

const mockPathname = vi.fn()
const mockSearchParams = vi.fn().mockReturnValue(new URLSearchParams())

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname(),
  useSearchParams: () => mockSearchParams(),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn().mockImplementation(() => 'div'),
    li: vi.fn().mockImplementation(() => 'li'),
  },
  AnimatePresence: vi.fn().mockImplementation(({ children }) => children),
}))

// Mock sonner
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
}

vi.mock('sonner', () => ({
  toast: mockToast,
  Toaster: vi.fn().mockImplementation(() => null),
}))

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}))

export {
  mockSupabase,
  mockRouter,
  mockPathname,
  mockSearchParams,
  mockToast,
} 