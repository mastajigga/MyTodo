import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LoginForm } from '../LoginForm'
import { useRouter } from 'next/navigation'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const mockRouter = {
  push: vi.fn(),
  refresh: vi.fn()
}

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter
}))

const mockSupabase = {
  auth: {
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
  }
}

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabase
}))

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait afficher le formulaire de connexion avec tous les champs requis', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument()
  })

  it('devrait afficher les erreurs de validation', async () => {
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: 'Se connecter' })
    fireEvent.click(submitButton)
    
    const emailError = await screen.findByText("L'email est requis")
    const passwordError = await screen.findByText('Le mot de passe est requis')
    
    expect(emailError).toBeInTheDocument()
    expect(passwordError).toBeInTheDocument()
  })

  it('devrait gérer la soumission du formulaire avec succès', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: 'user-123' } },
      error: null
    })
    
    render(<LoginForm />)
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'password')
    
    const submitButton = screen.getByRole('button', { name: 'Se connecter' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      })
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('devrait gérer la connexion avec Google', async () => {
    mockSupabase.auth.signInWithOAuth.mockResolvedValueOnce({
      data: { provider: 'google' },
      error: null
    })
    
    render(<LoginForm />)
    
    const googleButton = screen.getByRole('button', { name: 'Google' })
    fireEvent.click(googleButton)
    
    await waitFor(() => {
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback')
        }
      })
    })
  })

  it('devrait gérer la connexion avec GitHub', async () => {
    mockSupabase.auth.signInWithOAuth.mockResolvedValueOnce({
      data: { provider: 'github' },
      error: null
    })
    
    render(<LoginForm />)
    
    const githubButton = screen.getByRole('button', { name: 'GitHub' })
    fireEvent.click(githubButton)
    
    await waitFor(() => {
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: expect.stringContaining('/auth/callback')
        }
      })
    })
  })

  it('devrait afficher une erreur en cas d\'échec de connexion', async () => {
    mockSupabase.auth.signInWithPassword.mockRejectedValueOnce(
      new Error('Une erreur est survenue')
    )
    
    render(<LoginForm />)
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'password')
    
    const submitButton = screen.getByRole('button', { name: 'Se connecter' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument()
    })
  })
}) 