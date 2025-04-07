import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/lib/auth/useAuth'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { mockSupabaseClient, resetSupabaseMocks } from '@/test/mocks/supabase'

describe('useAuth', () => {
  const consoleSpy = vi.spyOn(console, 'error')
  
  beforeEach(() => {
    resetSupabaseMocks()
    consoleSpy.mockReset()
  })

  describe('signIn', () => {
    it('devrait se connecter avec succès avec email/mot de passe', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: '123', email: 'test@test.com' } },
        error: null
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signIn('test@test.com', 'password')
      })

      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password'
      })
      expect(result.current.user).toEqual({ id: '123', email: 'test@test.com' })
      expect(result.current.error).toBeNull()
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('devrait gérer les erreurs de connexion', async () => {
      const mockError = new Error('Invalid credentials')
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: mockError
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signIn('test@test.com', 'wrong-password')
      })

      expect(result.current.error).toBe(mockError)
      expect(result.current.user).toBeNull()
      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })

  describe('signUp', () => {
    it('devrait créer un compte avec succès', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: { id: '123', email: 'new@test.com' } },
        error: null
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signUp('new@test.com', 'password')
      })

      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: 'password'
      })
      expect(result.current.user).toEqual({ id: '123', email: 'new@test.com' })
      expect(result.current.error).toBeNull()
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('devrait gérer les erreurs d\'inscription', async () => {
      const mockError = new Error('Email already exists')
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: mockError
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signUp('existing@test.com', 'password')
      })

      expect(result.current.error).toBe(mockError)
      expect(result.current.user).toBeNull()
      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })

  describe('signOut', () => {
    it('devrait se déconnecter avec succès', async () => {
      mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signOut()
      })

      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
      expect(result.current.user).toBeNull()
      expect(result.current.error).toBeNull()
      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })

  describe('OAuth', () => {
    it('devrait initialiser la connexion OAuth avec Google', async () => {
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({ error: null })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signInWithGoogle()
      })

      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('devrait initialiser la connexion OAuth avec GitHub', async () => {
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({ error: null })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signInWithGithub()
      })

      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })

  describe('Gestion de session', () => {
    it('devrait vérifier la session au montage', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: {
          session: { user: { id: '123', email: 'test@test.com' } }
        },
        error: null
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        // Attendre que useEffect soit exécuté
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(mockSupabaseClient.auth.getSession).toHaveBeenCalled()
      expect(result.current.user).toEqual({ id: '123', email: 'test@test.com' })
      expect(result.current.error).toBeNull()
      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })
}) 