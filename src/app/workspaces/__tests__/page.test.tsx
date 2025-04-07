import { render, screen } from '@testing-library/react'
import WorkspacesPage from '../page'

// Mock des composants
jest.mock('@/components/workspace/WorkspaceList', () => ({
  WorkspaceList: () => <div data-testid="workspace-list">Liste des workspaces</div>,
}))

// Mock de next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('WorkspacesPage', () => {
  it('affiche le titre et la description', () => {
    render(<WorkspacesPage />)

    expect(screen.getByText('Mes espaces de travail')).toBeInTheDocument()
    expect(
      screen.getByText('Gérez vos espaces de travail et collaborez avec votre équipe')
    ).toBeInTheDocument()
  })

  it('affiche le bouton de création de workspace', () => {
    render(<WorkspacesPage />)

    const createButton = screen.getByRole('link', { name: /créer un espace/i })
    expect(createButton).toBeInTheDocument()
    expect(createButton).toHaveAttribute('href', '/workspaces/new')
  })

  it('affiche le composant WorkspaceList', () => {
    render(<WorkspacesPage />)
    expect(screen.getByTestId('workspace-list')).toBeInTheDocument()
  })

  it('affiche un état de chargement dans Suspense', () => {
    render(<WorkspacesPage />)
    expect(screen.getByRole('status')).toHaveClass('animate-spin')
  })
}) 