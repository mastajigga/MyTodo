import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { UserNav } from '../UserNav'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'

const mockRouter = {
  push: vi.fn(),
  refresh: vi.fn(),
}

const mockSupabaseAuth = {
  signOut: vi.fn(),
  getUser: vi.fn(),
}

const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => ({
          data: {
            full_name: 'John Doe',
            avatar_url: 'https://example.com/avatar.jpg'
          }
        }))
      }))
    }))
  })),
  auth: mockSupabaseAuth
}

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabaseClient,
}))

describe('UserNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseAuth.getUser.mockResolvedValue({
      data: {
        user: { id: 'test-user-id' }
      }
    })
  })

  it('devrait afficher le menu utilisateur avec avatar et nom', async () => {
    const user = userEvent.setup()
    render(<UserNav />)
    
    // Vérifier la présence du composant
    expect(screen.getByTestId('user-nav')).toBeInTheDocument()
    
    // Attendre que les données du profil soient chargées
    await waitFor(() => {
      expect(screen.getByTestId('user-avatar-fallback')).toHaveTextContent('JD')
    })
    
    // Ouvrir le menu
    const menuButton = screen.getByTestId('user-menu-button')
    await user.click(menuButton)
    
    // Attendre que le menu soit ouvert et vérifier son contenu
    await waitFor(() => {
      expect(screen.getByTestId('user-full-name')).toHaveTextContent('John Doe')
      expect(screen.getByTestId('profile-menu-item')).toBeInTheDocument()
      expect(screen.getByTestId('settings-menu-item')).toBeInTheDocument()
      expect(screen.getByTestId('logout-menu-item')).toBeInTheDocument()
    })
  })

  it('devrait gérer la déconnexion', async () => {
    const user = userEvent.setup()
    mockSupabaseAuth.signOut.mockResolvedValueOnce({ error: null })
    
    render(<UserNav />)
    
    // Ouvrir le menu
    const menuButton = screen.getByTestId('user-menu-button')
    await user.click(menuButton)
    
    // Attendre que le menu soit ouvert et cliquer sur le bouton de déconnexion
    await waitFor(async () => {
      const logoutButton = screen.getByTestId('logout-menu-item')
      await user.click(logoutButton)
    })
    
    await waitFor(() => {
      expect(mockSupabaseAuth.signOut).toHaveBeenCalled()
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/login')
      expect(mockRouter.refresh).toHaveBeenCalled()
    })
  })

  it('devrait naviguer vers la page de profil', async () => {
    const user = userEvent.setup()
    render(<UserNav />)
    
    // Ouvrir le menu
    const menuButton = screen.getByTestId('user-menu-button')
    await user.click(menuButton)
    
    // Attendre que le menu soit ouvert et cliquer sur le lien du profil
    await waitFor(async () => {
      const profileLink = screen.getByTestId('profile-menu-item')
      await user.click(profileLink)
    })
    
    expect(mockRouter.push).toHaveBeenCalledWith('/profile')
  })

  it('devrait naviguer vers la page des paramètres', async () => {
    const user = userEvent.setup()
    render(<UserNav />)
    
    // Ouvrir le menu
    const menuButton = screen.getByTestId('user-menu-button')
    await user.click(menuButton)
    
    // Attendre que le menu soit ouvert et cliquer sur le lien des paramètres
    await waitFor(async () => {
      const settingsLink = screen.getByTestId('settings-menu-item')
      await user.click(settingsLink)
    })
    
    expect(mockRouter.push).toHaveBeenCalledWith('/settings')
  })
}) 