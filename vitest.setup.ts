import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { TextEncoder, TextDecoder } from 'util'
import './src/test/mocks/supabase'

global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder

// Mock window.matchMedia
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
})

// Mock window.ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: () => () => ({
      children: null,
    }),
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}))

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
})) 