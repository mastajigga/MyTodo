import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../ThemeProvider'
import { ThemeToggle } from '../ThemeToggle'
import { vi } from 'vitest'
import { useTheme } from 'next-themes'

vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({
    theme: 'light',
    setTheme: vi.fn(),
  })),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('ThemeToggle', () => {
  it('devrait rendre le bouton de thème', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /basculer le thème/i })).toBeInTheDocument()
  })

  it('devrait ouvrir le menu au clic', async () => {
    render(<ThemeToggle />)
    
    // Cliquer sur le bouton de thème
    const toggleButton = screen.getByRole('button', { name: /basculer le thème/i })
    fireEvent.click(toggleButton)

    // Vérifier que les options sont disponibles
    expect(screen.getByRole('menuitem', { name: /clair/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /sombre/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /système/i })).toBeInTheDocument()
  })

  it('devrait changer le thème au clic sur une option', async () => {
    const mockSetTheme = vi.fn()
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    // Ouvrir le menu
    const toggleButton = screen.getByRole('button', { name: /basculer le thème/i })
    fireEvent.click(toggleButton)

    // Cliquer sur l'option sombre
    const darkOption = screen.getByRole('menuitem', { name: /sombre/i })
    fireEvent.click(darkOption)

    // Vérifier que setTheme a été appelé avec 'dark'
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })
}) 