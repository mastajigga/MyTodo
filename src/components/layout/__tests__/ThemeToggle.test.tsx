import { render, screen } from '@testing-library/react'
import { ThemeToggle } from '../../theme/ThemeToggle'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn()
  })
}))

describe('ThemeToggle', () => {
  it('devrait afficher le bouton de changement de thème', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Basculer le thème' })).toBeInTheDocument()
  })

  it('devrait afficher le menu au clic sur le bouton', async () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: 'Basculer le thème' })
    await userEvent.click(button)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByText('Clair')).toBeInTheDocument()
    expect(screen.getByText('Sombre')).toBeInTheDocument()
    expect(screen.getByText('Système')).toBeInTheDocument()
  })
}) 