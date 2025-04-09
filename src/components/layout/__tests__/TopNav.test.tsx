import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TopNav } from '../TopNav'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

const mockSupabaseAuth = {
  getUser: vi.fn(),
}

const mockSupabaseClient = {
  auth: mockSupabaseAuth
}

vi.mock('@/hooks/useSupabase', () => ({
  useSupabase: () => ({
    supabase: mockSupabaseClient
  })
}))

describe('TopNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseAuth.getUser.mockResolvedValue({
      data: {
        user: { 
          id: 'test-user-id',
          email: 'user@example.com'
        }
      }
    })
  })

  it('devrait afficher la barre de recherche', () => {
    render(<TopNav />)
    
    const searchInput = screen.getByTestId('search-input')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveClass('pl-8')
  })

  it('devrait afficher le bouton de notifications avec le compteur', () => {
    render(<TopNav />)
    
    const notificationButton = screen.getByTestId('notifications-button')
    expect(notificationButton).toBeInTheDocument()
    
    const notificationCount = screen.getByTestId('notifications-count')
    expect(notificationCount).toBeInTheDocument()
    expect(notificationCount).toHaveClass('bg-red-500')
    expect(notificationCount).toHaveTextContent('2')
  })

  it('devrait afficher et gérer le menu utilisateur', async () => {
    const user = userEvent.setup()
    render(<TopNav />)
    
    // Ouvrir le menu
    const avatarButton = screen.getByTestId('user-menu-button')
    await user.click(avatarButton)
    
    // Vérifier le contenu du menu
    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Utilisateur')
      expect(screen.getByTestId('user-email')).toHaveTextContent('user@example.com')
      expect(screen.getByTestId('profile-menu-item')).toBeInTheDocument()
      expect(screen.getByTestId('settings-menu-item')).toBeInTheDocument()
    })
  })
}) 