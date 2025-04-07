import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import GoogleSignIn from '../GoogleSignIn'
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
      signInWithOAuth: jest.fn(),
    },
  },
}))

describe('GoogleSignIn', () => {
  beforeEach(() => {
    // Reset des mocks
    jest.clearAllMocks()
    // Mock de window.location
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true
    })
  })

  it('affiche le bouton de connexion Google', () => {
    render(<GoogleSignIn />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Continuer avec Google')
  })

  it('appelle signInWithOAuth avec les bons paramètres', async () => {
    const mockSignInWithOAuth = jest.fn().mockResolvedValue({ data: {}, error: null })
    supabase.auth.signInWithOAuth = mockSignInWithOAuth

    render(<GoogleSignIn />)
    
    const button = screen.getByRole('button')
    
    await act(async () => {
      fireEvent.click(button)
    })

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.stringContaining('/auth/callback'),
      },
    })
  })

  it('désactive le bouton pendant la connexion', async () => {
    const mockSignInWithOAuth = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: {}, error: null })
        }, 100)
      })
    })
    supabase.auth.signInWithOAuth = mockSignInWithOAuth

    render(<GoogleSignIn />)
    
    const button = screen.getByRole('button')
    
    await act(async () => {
      fireEvent.click(button)
    })

    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Connexion en cours...')

    await waitFor(() => {
      expect(button).not.toBeDisabled()
      expect(button).toHaveTextContent('Continuer avec Google')
    })
  })

  it('gère les erreurs de connexion', async () => {
    const mockError = new Error('Erreur de connexion')
    const mockSignInWithOAuth = jest.fn().mockRejectedValue(mockError)
    supabase.auth.signInWithOAuth = mockSignInWithOAuth

    render(<GoogleSignIn />)
    
    const button = screen.getByRole('button')
    
    await act(async () => {
      fireEvent.click(button)
    })

    await waitFor(() => {
      const errorMessage = screen.getByText('Erreur de connexion')
      expect(errorMessage).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })
  })
}) 