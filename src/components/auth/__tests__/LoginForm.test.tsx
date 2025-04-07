import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { LoginForm } from '../LoginForm'
import { mockSupabaseClient, resetSupabaseMocks } from '@/test/mocks/supabase'

describe('LoginForm', () => {
  const consoleSpy = vi.spyOn(console, 'error')
  
  beforeEach(() => {
    resetSupabaseMocks()
    consoleSpy.mockReset()
  })

  it('devrait afficher le formulaire de connexion', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument()
  })

  it('devrait se connecter avec succès', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '123', email: 'test@test.com' } },
      error: null
    })

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' }
    })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }))

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123'
      })
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait afficher une erreur en cas d\'échec de connexion', async () => {
    const mockError = new Error('Invalid credentials')
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: mockError
    })

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' }
    })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'wrongpassword' }
    })

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait valider les champs requis', async () => {
    render(<LoginForm />)

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }))

    await waitFor(() => {
      expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument()
      expect(screen.getByText(/le mot de passe est requis/i)).toBeInTheDocument()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait se connecter avec Google', async () => {
    mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({ error: null })

    render(<LoginForm />)

    fireEvent.click(screen.getByRole('button', { name: /google/i }))

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait se connecter avec GitHub', async () => {
    mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({ error: null })

    render(<LoginForm />)

    fireEvent.click(screen.getByRole('button', { name: /github/i }))

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait désactiver le bouton pendant la soumission', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockImplementation(() =>
      new Promise(resolve => setTimeout(resolve, 100))
    )

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' }
    })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }))

    expect(screen.getByRole('button', { name: /connexion/i })).toBeDisabled()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /se connecter/i })).toBeEnabled()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })
}) 