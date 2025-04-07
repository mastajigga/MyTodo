import { render, screen } from '@testing-library/react'
import WorkspacePage from '../page'

// Mock des composants
jest.mock('@/components/workspace/WorkspaceDetails', () => ({
  WorkspaceDetails: ({ workspaceId }: { workspaceId: string }) => (
    <div data-testid="workspace-details">Détails du workspace {workspaceId}</div>
  ),
}))

// Mock de next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('WorkspacePage', () => {
  const mockParams = { id: 'workspace-123' }

  it('affiche les boutons de navigation', () => {
    render(<WorkspacePage params={mockParams} />)

    const backButton = screen.getByRole('link', { name: /retour aux espaces de travail/i })
    expect(backButton).toBeInTheDocument()
    expect(backButton).toHaveAttribute('href', '/workspaces')

    const settingsButton = screen.getByRole('link', { name: /paramètres/i })
    expect(settingsButton).toBeInTheDocument()
    expect(settingsButton).toHaveAttribute('href', '/workspaces/workspace-123/settings')
  })

  it('affiche le composant WorkspaceDetails avec le bon ID', () => {
    render(<WorkspacePage params={mockParams} />)
    expect(screen.getByTestId('workspace-details')).toHaveTextContent('workspace-123')
  })

  it('affiche un état de chargement dans Suspense', () => {
    render(<WorkspacePage params={mockParams} />)
    expect(screen.getByRole('status')).toHaveClass('animate-spin')
  })

  it('génère les bonnes métadonnées', async () => {
    const { generateMetadata } = require('../page')
    const metadata = await generateMetadata({ params: mockParams })

    expect(metadata).toEqual({
      title: 'Espace de travail | MyTodo',
      description: 'Gérez votre espace de travail et collaborez avec votre équipe',
    })
  })
}) 