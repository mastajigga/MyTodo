import { render, screen } from '@testing-library/react'
import WorkspaceSettingsPage from '../page'

// Mock des composants
jest.mock('@/components/workspace/WorkspaceMembers', () => ({
  WorkspaceMembers: ({ workspaceId }: { workspaceId: string }) => (
    <div data-testid="workspace-members">Membres du workspace {workspaceId}</div>
  ),
}))

// Mock de next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('WorkspaceSettingsPage', () => {
  const mockParams = { id: 'workspace-123' }

  it('affiche le titre et la description', () => {
    render(<WorkspaceSettingsPage params={mockParams} />)

    expect(screen.getByRole('heading', { name: /paramètres de l'espace de travail/i })).toBeInTheDocument()
    expect(screen.getByText(/gérez les paramètres et les membres de votre espace de travail/i)).toBeInTheDocument()
  })

  it('affiche le bouton de retour', () => {
    render(<WorkspaceSettingsPage params={mockParams} />)

    const backButton = screen.getByRole('link', { name: /retour à l'espace de travail/i })
    expect(backButton).toBeInTheDocument()
    expect(backButton).toHaveAttribute('href', '/workspaces/workspace-123')
  })

  it('affiche le composant WorkspaceMembers avec le bon ID', () => {
    render(<WorkspaceSettingsPage params={mockParams} />)
    expect(screen.getByTestId('workspace-members')).toHaveTextContent('workspace-123')
  })

  it('affiche un état de chargement dans Suspense', () => {
    render(<WorkspaceSettingsPage params={mockParams} />)
    expect(screen.getByRole('status')).toHaveClass('animate-spin')
  })

  it('génère les bonnes métadonnées', async () => {
    const { generateMetadata } = require('../page')
    const metadata = await generateMetadata({ params: mockParams })

    expect(metadata).toEqual({
      title: 'Paramètres | MyTodo',
      description: 'Gérez les paramètres et les membres de votre espace de travail',
    })
  })
}) 