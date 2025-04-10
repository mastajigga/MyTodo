import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TaskFilters } from '../TaskFilters'
import { vi } from 'vitest'

describe('TaskFilters', () => {
  const mockOnFiltersChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('affiche un champ de recherche', () => {
    render(<TaskFilters onFiltersChange={mockOnFiltersChange} />)
    expect(screen.getByPlaceholderText('Rechercher des tâches...')).toBeInTheDocument()
  })

  it('met à jour les filtres lors de la recherche', async () => {
    render(<TaskFilters onFiltersChange={mockOnFiltersChange} />)
    
    const searchInput = screen.getByPlaceholderText('Rechercher des tâches...')
    fireEvent.change(searchInput, { target: { value: 'test' } })

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
        search: 'test',
      }))
    })
  })

  it('affiche/masque les filtres avancés au clic sur le bouton', () => {
    render(<TaskFilters onFiltersChange={mockOnFiltersChange} />)
    
    // Les filtres sont masqués par défaut
    expect(screen.queryByText('Statut')).not.toBeInTheDocument()
    expect(screen.queryByText("Date d'échéance")).not.toBeInTheDocument()

    // Affiche les filtres
    fireEvent.click(screen.getByRole('button', { name: '' }))
    expect(screen.getByText('Statut')).toBeInTheDocument()
    expect(screen.getByText("Date d'échéance")).toBeInTheDocument()

    // Masque les filtres
    fireEvent.click(screen.getByRole('button', { name: '' }))
    expect(screen.queryByText('Statut')).not.toBeInTheDocument()
    expect(screen.queryByText("Date d'échéance")).not.toBeInTheDocument()
  })

  it('met à jour les filtres lors de la sélection du statut', async () => {
    render(<TaskFilters onFiltersChange={mockOnFiltersChange} />)
    
    // Affiche les filtres
    fireEvent.click(screen.getByRole('button', { name: '' }))

    // Sélectionne le statut "Terminées"
    fireEvent.click(screen.getByText('Toutes les tâches'))
    fireEvent.click(screen.getByText('Terminées'))

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
        status: 'completed',
      }))
    })
  })

  it('met à jour les filtres lors de la sélection de la date', async () => {
    render(<TaskFilters onFiltersChange={mockOnFiltersChange} />)
    
    // Affiche les filtres
    fireEvent.click(screen.getByRole('button', { name: '' }))

    // Sélectionne "Cette semaine"
    fireEvent.click(screen.getByText('Toutes les dates'))
    fireEvent.click(screen.getByText('Cette semaine'))

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
        dueDate: 'week',
      }))
    })
  })

  it('réinitialise tous les filtres', async () => {
    render(<TaskFilters onFiltersChange={mockOnFiltersChange} />)
    
    // Configure quelques filtres
    const searchInput = screen.getByPlaceholderText('Rechercher des tâches...')
    fireEvent.change(searchInput, { target: { value: 'test' } })

    // Affiche le bouton de réinitialisation
    const resetButton = await screen.findByRole('button', { name: '' })
    fireEvent.click(resetButton)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: '',
        status: 'all',
        dueDate: 'all',
      })
    })
  })
}) 