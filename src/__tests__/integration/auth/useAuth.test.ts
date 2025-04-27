import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/lib/auth/useAuth'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const mockUser = { id: '123', email: 'test@test.com' }

const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null
    }),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    signInWithOAuth: vi.fn(),
    onAuthStateChange: vi.fn().mockImplementation((callback) => {
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })
  }
}

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabase
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait charger l\'utilisateur au montage', async () => {
    const { result } = renderHook(() => useAuth())

    expect(mockSupabase.auth.getUser).toHaveBeenCalled()
    expect(result.current.loading).toBe(true)

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.loading).toBe(false)
  })

  it('devrait gérer les erreurs de chargement de l\'utilisateur', async () => {
    mockSupabase.auth.getUser.mockRejectedValueOnce(new Error('Erreur de chargement'))

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  describe('signIn', () => {
    it('devrait se connecter avec succès', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signIn('test@test.com', 'password')
      })

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password'
      })
    })

    it('devrait gérer les erreurs de connexion', async () => {
      mockSupabase.auth.signInWithPassword.mockRejectedValueOnce(
        new Error('Erreur de connexion')
      )

      const { result } = renderHook(() => useAuth())

      await expect(
        act(async () => {
          await result.current.signIn('test@test.com', 'password')
        })
      ).rejects.toThrow('Erreur de connexion')
    })
  })

  describe('signUp', () => {
    it('devrait créer un compte avec succès', async () => {
      mockSupabase.auth.signUp = vi.fn().mockResolvedValue({
        data: { user: { id: '123', email: 'new@test.com' } },
        error: null
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signUp('new@test.com', 'password')
      })

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: 'password'
      })
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

      expect(mockSupabase.auth.signUp).toHaveBeenCalled()
    })
  })

  describe('signOut', () => {
    it('devrait se déconnecter avec succès', async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signOut()
      })

      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('OAuth', () => {
    it('devrait initialiser la connexion OAuth avec Google', async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signInWithGoogle()
      })

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
    })

    it('devrait initialiser la connexion OAuth avec GitHub', async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signInWithGithub()
      })

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
    })
  })
}) 