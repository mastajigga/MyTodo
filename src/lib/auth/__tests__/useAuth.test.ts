import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { createClient } from '@supabase/supabase-js'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn()
    }
  }))
}))

describe('useAuth', () => {
  const mockSupabase = createClient('mock-url', 'mock-key')
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signIn', () => {
    it('devrait se connecter avec succès avec email/mot de passe', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({
        data: { user: { id: '123', email: 'test@test.com' } },
        error: null
      })
      mockSupabase.auth.signInWithPassword = mockSignIn

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signIn('test@test.com', 'password')
      })

      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password'
      })
      expect(result.current.user).toEqual({ id: '123', email: 'test@test.com' })
      expect(result.current.error).toBeNull()
    })

    it('devrait gérer les erreurs de connexion', async () => {
      const mockError = new Error('Invalid credentials')
      mockSupabase.auth.signInWithPassword = vi.fn().mockResolvedValue({
        data: { user: null },
        error: mockError
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signIn('test@test.com', 'wrong-password')
      })

      expect(result.current.error).toBe(mockError)
      expect(result.current.user).toBeNull()
    })
  })

  describe('signUp', () => {
    it('devrait créer un compte avec succès', async () => {
      const mockSignUp = vi.fn().mockResolvedValue({
        data: { user: { id: '123', email: 'new@test.com' } },
        error: null
      })
      mockSupabase.auth.signUp = mockSignUp

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signUp('new@test.com', 'password')
      })

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: 'password'
      })
      expect(result.current.user).toEqual({ id: '123', email: 'new@test.com' })
      expect(result.current.error).toBeNull()
    })

    it('devrait gérer les erreurs d\'inscription', async () => {
      const mockError = new Error('Email already exists')
      mockSupabase.auth.signUp = vi.fn().mockResolvedValue({
        data: { user: null },
        error: mockError
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signUp('existing@test.com', 'password')
      })

      expect(result.current.error).toBe(mockError)
      expect(result.current.user).toBeNull()
    })
  })

  describe('signOut', () => {
    it('devrait se déconnecter avec succès', async () => {
      const mockSignOut = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.auth.signOut = mockSignOut

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signOut()
      })

      expect(mockSignOut).toHaveBeenCalled()
      expect(result.current.user).toBeNull()
      expect(result.current.error).toBeNull()
    })
  })

  describe('OAuth', () => {
    it('devrait initialiser la connexion OAuth avec Google', async () => {
      const mockOAuth = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.auth.signInWithOAuth = mockOAuth

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signInWithGoogle()
      })

      expect(mockOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
    })

    it('devrait initialiser la connexion OAuth avec GitHub', async () => {
      const mockOAuth = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.auth.signInWithOAuth = mockOAuth

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signInWithGithub()
      })

      expect(mockOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
    })
  })
}) 