import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { LoginForm } from "@/components/auth/LoginForm"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { mockRouter } from '../../../test/mocks/next'

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn(),
}))

describe('LoginForm', () => {
  const consoleSpy = vi.spyOn(console, 'error')
  const mockSupabaseClient = {
    auth: {
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
  }
  
  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy.mockReset()
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabaseClient)
  })

  it('should render login form correctly', () => {
    render(<LoginForm />)
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument()
  })

  it('should handle successful login', async () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123',
    }

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: '123' } },
      error: null,
    })

    render(<LoginForm />)
    
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: mockCredentials.email } })
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: mockCredentials.password } })
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith(mockCredentials)
    })
  })

  it('should handle Google login', async () => {
    render(<LoginForm />)
    
    fireEvent.click(screen.getByRole('button', { name: 'Google' }))

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      })
    })
  })

  it('should handle GitHub login', async () => {
    render(<LoginForm />)
    
    fireEvent.click(screen.getByRole('button', { name: 'GitHub' }))

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      })
    })
  })

  it('should disable submit button during form submission', async () => {
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: 'Se connecter' })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password123' } })
    
    fireEvent.click(submitButton)
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent(/chargement/i)

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
      expect(submitButton).toHaveTextContent(/se connecter/i)
    })
  })

  it('should show validation errors for empty fields', async () => {
    render(<LoginForm />)
    
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    await waitFor(() => {
      expect(screen.getByText('L\'email est requis')).toBeInTheDocument()
      expect(screen.getByText('Le mot de passe est requis')).toBeInTheDocument()
    })
  })

  it('devrait afficher une erreur en cas d\'échec de connexion', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Invalid credentials' },
    })

    render(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), {
      target: { value: 'wrongpassword' },
    })

    fireEvent.click(screen.getByText('Se connecter'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /Une erreur est survenue lors de la connexion/i
      )
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })
}) 