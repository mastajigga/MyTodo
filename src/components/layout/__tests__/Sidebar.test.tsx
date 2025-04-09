import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Sidebar } from '../Sidebar'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

const mockPathname = vi.fn()
const mockToast = { success: vi.fn(), error: vi.fn() }

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

const mockSupabaseAuth = {
  signOut: vi.fn(),
}

const mockSupabaseClient = {
  auth: mockSupabaseAuth
}

vi.mock('@/hooks/useSupabase', () => ({
  useSupabase: () => ({
    supabase: mockSupabaseClient
  })
}))

vi.mock('sonner', () => ({
  toast: mockToast
}))

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname.mockReturnValue('/dashboard')
  })

  it('devrait afficher le titre de l\'application', () => {
    render(<Sidebar />)
    expect(screen.getByTestId('sidebar-title')).toHaveTextContent('MyTodo')
  })

  it('devrait afficher tous les liens de navigation', () => {
    render(<Sidebar />)
    
    expect(screen.getByTestId('nav-link-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-link-tâches')).toBeInTheDocument()
    expect(screen.getByTestId('nav-link-équipe')).toBeInTheDocument()
    expect(screen.getByTestId('nav-link-paramètres')).toBeInTheDocument()
  })

  it('devrait mettre en évidence le lien actif', () => {
    render(<Sidebar />)
    
    const dashboardLink = screen.getByTestId('nav-link-dashboard')
    expect(dashboardLink).toHaveClass('bg-gray-800', 'text-white')
    
    const tasksLink = screen.getByTestId('nav-link-tâches')
    expect(tasksLink).not.toHaveClass('bg-gray-800', 'text-white')
  })

  it('devrait gérer la déconnexion avec succès', async () => {
    const user = userEvent.setup()
    mockSupabaseAuth.signOut.mockResolvedValueOnce({ error: null })
    
    render(<Sidebar />)
    
    const logoutButton = screen.getByTestId('logout-button')
    await user.click(logoutButton)
    
    await waitFor(() => {
      expect(mockSupabaseAuth.signOut).toHaveBeenCalled()
      expect(mockToast.success).toHaveBeenCalledWith('Déconnexion réussie')
    })
  })

  it('devrait gérer les erreurs de déconnexion', async () => {
    const user = userEvent.setup()
    mockSupabaseAuth.signOut.mockRejectedValueOnce(new Error('Erreur de déconnexion'))
    
    render(<Sidebar />)
    
    const logoutButton = screen.getByTestId('logout-button')
    await user.click(logoutButton)
    
    await waitFor(() => {
      expect(mockSupabaseAuth.signOut).toHaveBeenCalled()
      expect(mockToast.error).toHaveBeenCalledWith('Erreur lors de la déconnexion')
    })
  })
}) 