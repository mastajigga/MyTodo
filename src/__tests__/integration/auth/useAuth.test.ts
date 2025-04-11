import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/lib/auth/useAuth'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { mockRouter, mockSupabase } from '../../../../vitest.setup'

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signIn', () => {
    it('devrait se connecter avec succès avec email/mot de passe', async () => {
      mockSupabase.auth.signInWithPassword = vi.fn().mockResolvedValue({
        data: { user: { id: '123', email: 'test@test.com' } },
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
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
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

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalled()
      expect(mockRouter.push).not.toHaveBeenCalled()
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
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
  })

  describe('OAuth', () => {
    it('devrait initialiser la connexion OAuth avec Google', async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signInWithGoogle()
      })

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google'
      })
    })

    it('devrait initialiser la connexion OAuth avec GitHub', async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signInWithGithub()
      })

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github'
      })
    })
  })

  describe('Gestion de session', () => {
    it('devrait vérifier la session au montage', async () => {
      mockSupabase.auth.getSession = vi.fn().mockResolvedValue({
        data: {
          session: { user: { id: '123', email: 'test@test.com' } }
        },
        error: null
      })

      renderHook(() => useAuth())

      expect(mockSupabase.auth.getSession).toHaveBeenCalled()
    })
  })
}) 