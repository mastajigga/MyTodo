import { vi } from 'vitest'

export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn()
}

export const mockPathname = vi.fn()

export const mockSearchParams = {
  get: vi.fn(),
  getAll: vi.fn(),
  has: vi.fn(),
  toString: vi.fn()
}

export const resetNextMocks = () => {
  vi.clearAllMocks()
  mockRouter.push.mockReset()
  mockRouter.replace.mockReset()
  mockRouter.back.mockReset()
  mockRouter.forward.mockReset()
  mockRouter.refresh.mockReset()
  mockRouter.prefetch.mockReset()
  mockPathname.mockReset()
  mockSearchParams.get.mockReset()
  mockSearchParams.getAll.mockReset()
  mockSearchParams.has.mockReset()
  mockSearchParams.toString.mockReset()
} 