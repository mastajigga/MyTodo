import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginPage from '../page'
import { supabase } from '@/lib/supabase/client'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    }
  },
}))

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}))

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('affiche le formulaire de connexion', () => {
    render(<LoginPage />)
    expect(screen.getByPlaceholderText('Adresse email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument()
  })

  it('met à jour les champs du formulaire', () => {
    render(<LoginPage />)
    const emailInput = screen.getByPlaceholderText('Adresse email')
    const passwordInput = screen.getByPlaceholderText('Mot de passe')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('soumet le formulaire avec les identifiants', async () => {
    const mockSignInWithPassword = jest.fn().mockResolvedValue({ data: {}, error: null })
    supabase.auth.signInWithPassword = mockSignInWithPassword

    render(<LoginPage />)
    const emailInput = screen.getByPlaceholderText('Adresse email')
    const passwordInput = screen.getByPlaceholderText('Mot de passe')
    const submitButton = screen.getByRole('button', { name: /se connecter/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    await act(async () => {
      fireEvent.click(submitButton)
    })

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('désactive le bouton pendant la soumission', async () => {
    const mockSignInWithPassword = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: {}, error: null })
        }, 100)
      })
    })
    supabase.auth.signInWithPassword = mockSignInWithPassword

    render(<LoginPage />)
    const emailInput = screen.getByPlaceholderText('Adresse email')
    const passwordInput = screen.getByPlaceholderText('Mot de passe')
    const submitButton = screen.getByRole('button', { name: /se connecter/i })
    const form = submitButton.closest('form')

    if (!form) {
      throw new Error('Form not found')
    }

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    await act(async () => {
      fireEvent.submit(form)
    })

    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent('Connexion...')
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
      expect(submitButton).toHaveTextContent('Se connecter')
    })
  })

  it('affiche les erreurs de connexion', async () => {
    const mockError = { message: 'Identifiants invalides' }
    const mockSignInWithPassword = jest.fn().mockRejectedValue(mockError)
    supabase.auth.signInWithPassword = mockSignInWithPassword

    render(<LoginPage />)
    const emailInput = screen.getByPlaceholderText('Adresse email')
    const passwordInput = screen.getByPlaceholderText('Mot de passe')
    const submitButton = screen.getByRole('button', { name: /se connecter/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    await act(async () => {
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Identifiants invalides')).toBeInTheDocument()
      expect(submitButton).not.toBeDisabled()
    })
  })
}) 