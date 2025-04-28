import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { mockSupabase, resetSupabaseMocks } from '@/test/mocks/supabase'

vi.mock("@supabase/auth-helpers-nextjs")

const mockUser = {
  id: "123",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString()
}

const mockSession = {
  access_token: "mock_access_token",
  refresh_token: "mock_refresh_token",
  expires_in: 3600,
  expires_at: 3600,
  token_type: "bearer",
  user: mockUser
}

describe('RegisterForm', () => {
  const consoleSpy = vi.spyOn(console, 'error')
  
  beforeEach(() => {
    resetSupabaseMocks()
    consoleSpy.mockReset()
  })

  it('devrait afficher le formulaire d\'inscription', () => {
    render(<RegisterForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument()
  })

  it('devrait créer un compte avec succès', async () => {
    const mockedSignUp = vi.mocked(mockSupabase.auth.signUp)
    mockedSignUp.mockResolvedValue({ 
      data: { 
        user: mockUser,
        session: mockSession
      },
      error: null
    })
    
    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }))

    await waitFor(() => {
      expect(mockedSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait afficher une erreur si les mots de passe ne correspondent pas', async () => {
    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' }
    })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'differentpassword' }
    })

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }))

    await waitFor(() => {
      expect(screen.getByText(/les mots de passe ne correspondent pas/i)).toBeInTheDocument()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait afficher une erreur en cas d\'échec d\'inscription', async () => {
    const mockedSignUp = vi.mocked(mockSupabase.auth.signUp)
    mockedSignUp.mockRejectedValue(new Error('Registration failed'))

    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }))

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait valider les champs requis', async () => {
    render(<RegisterForm />)

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }))

    await waitFor(() => {
      expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument()
      expect(screen.getByText(/le mot de passe est requis/i)).toBeInTheDocument()
      expect(screen.getByText(/la confirmation du mot de passe est requise/i)).toBeInTheDocument()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait désactiver le bouton pendant la soumission', async () => {
    const mockedSignUp = vi.mocked(mockSupabase.auth.signUp)
    mockedSignUp.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({
        data: { 
          user: mockUser,
          session: mockSession
        },
        error: null
      }), 100))
    )
    
    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' }
    })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }))

    expect(screen.getByRole('button', { name: /inscription/i })).toBeDisabled()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeEnabled()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })
}) 