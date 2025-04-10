import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '../SearchBar'
import { useRouter } from 'next/navigation'

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

const mockRouter = {
  push: vi.fn(),
  refresh: vi.fn()
}

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter
}))

// Ajouter le mock de ResizeObserver à window
window.ResizeObserver = ResizeObserver

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait afficher le bouton de recherche', () => {
    render(<SearchBar />)
    expect(screen.getByTestId('search-button')).toBeInTheDocument()
  })

  it('devrait ouvrir la boîte de dialogue de recherche au clic', async () => {
    render(<SearchBar />)
    const searchButton = screen.getByTestId('search-button')
    await userEvent.click(searchButton)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('devrait afficher "Aucun résultat trouvé" quand la recherche ne donne rien', async () => {
    render(<SearchBar />)
    await userEvent.click(screen.getByTestId('search-button'))
    await userEvent.type(screen.getByRole('combobox'), 'test')
    expect(screen.getByText('Aucun résultat trouvé.')).toBeInTheDocument()
  })

  it('devrait afficher les raccourcis de recherche', async () => {
    render(<SearchBar />)
    await userEvent.click(screen.getByTestId('search-button'))
    expect(screen.getByText('Suggestions')).toBeInTheDocument()
    expect(screen.getByText('Projets')).toBeInTheDocument()
    expect(screen.getByText('Espaces de travail')).toBeInTheDocument()
  })

  it('devrait naviguer vers la page correspondante quand un raccourci est sélectionné', async () => {
    render(<SearchBar />)
    await userEvent.click(screen.getByTestId('search-button'))
    await userEvent.click(screen.getByText('Projets'))
    expect(mockRouter.push).toHaveBeenCalledWith('/projects')
  })
}) 