import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MainNav } from '../MainNav'
import { describe, it, expect, vi } from 'vitest'

const mockPathname = '/dashboard'

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}))

describe('MainNav', () => {
  it('devrait afficher le logo et tous les liens de navigation', () => {
    render(<MainNav />)
    
    // Vérifie la présence du composant nav
    expect(screen.getByTestId('main-nav')).toBeInTheDocument()
    
    // Vérifie le logo
    const logo = screen.getByTestId('logo-link')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveTextContent('MyTodo')
    
    // Vérifie les liens de navigation
    expect(screen.getByTestId('nav-link-dashboard')).toHaveTextContent('Tableau de bord')
    expect(screen.getByTestId('nav-link-workspaces')).toHaveTextContent('Espaces de travail')
    expect(screen.getByTestId('nav-link-tasks')).toHaveTextContent('Mes tâches')
  })

  it('devrait appliquer la classe active sur le lien courant', () => {
    render(<MainNav />)
    
    const activeLink = screen.getByTestId('nav-link-dashboard')
    const inactiveLink = screen.getByTestId('nav-link-workspaces')
    
    expect(activeLink.className).toContain('text-primary')
    expect(inactiveLink.className).toContain('text-muted-foreground')
  })

  it('devrait avoir des liens fonctionnels avec les bons href', () => {
    render(<MainNav />)
    
    expect(screen.getByTestId('logo-link')).toHaveAttribute('href', '/dashboard')
    expect(screen.getByTestId('nav-link-dashboard')).toHaveAttribute('href', '/dashboard')
    expect(screen.getByTestId('nav-link-workspaces')).toHaveAttribute('href', '/workspaces')
    expect(screen.getByTestId('nav-link-tasks')).toHaveAttribute('href', '/tasks')
  })
}) 