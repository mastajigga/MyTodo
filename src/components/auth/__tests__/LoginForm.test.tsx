import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LoginForm } from '../LoginForm'
import { useRouter } from 'next/navigation'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

const mockRouter = {
  push: vi.fn(),
  refresh: vi.fn()
}

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter
}))

const mockSupabaseAuth = {
  signInWithPassword: vi.fn(),
  signInWithOAuth: vi.fn()
}

const mockSupabaseClient = {
  auth: mockSupabaseAuth
}

vi.mock('@/hooks/useSupabase', () => ({
  useSupabase: () => ({
    supabase: mockSupabaseClient
  })
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
    
    const emailError = screen.getByText("L'email est requis")
    const passwordError = screen.getByText('Le mot de passe est requis')
    
    expect(emailError).toBeInTheDocument()
    expect(passwordError).toBeInTheDocument()
  })

  it('devrait gérer la soumission du formulaire avec succès', async () => {
    mockSupabaseAuth.signInWithPassword.mockResolvedValueOnce({ error: null })
    
    render(<LoginForm />)
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'password')
    
    const submitButton = screen.getByRole('button', { name: 'Se connecter' })
    fireEvent.click(submitButton)
    
    expect(submitButton).toHaveAttribute('disabled')
    expect(submitButton).toHaveTextContent('Chargement...')
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('devrait gérer la connexion avec Google', async () => {
    mockSupabaseAuth.signInWithOAuth.mockResolvedValueOnce({ error: null })
    
    render(<LoginForm />)
    
    fireEvent.click(screen.getByText('Google'))
    
    await waitFor(() => {
      expect(mockSupabaseAuth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback'
        }
      })
    })
  })

  it('devrait gérer la connexion avec GitHub', async () => {
    mockSupabaseAuth.signInWithOAuth.mockResolvedValueOnce({ error: null })
    
    render(<LoginForm />)
    
    fireEvent.click(screen.getByText('GitHub'))
    
    await waitFor(() => {
      expect(mockSupabaseAuth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback'
        }
      })
    })
  })

  it('devrait afficher une erreur en cas d\'échec de connexion', async () => {
    mockSupabaseAuth.signInWithPassword.mockRejectedValueOnce(new Error('Une erreur est survenue'))
    
    render(<LoginForm />)
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'password')
    
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }))
    
    await waitFor(() => {
      expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument()
    })
  })
}) 