import { render, screen } from '@testing-library/react'
import NewWorkspacePage from '../page'

// Mock des composants
jest.mock('@/components/workspace/CreateWorkspace', () => ({
  CreateWorkspace: () => <div data-testid="create-workspace-form">Formulaire de création</div>,
}))

// Mock de next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('NewWorkspacePage', () => {
  it('affiche le titre et la description', () => {
    render(<NewWorkspacePage />)

    expect(screen.getByText('Créer un espace de travail')).toBeInTheDocument()
    expect(
      screen.getByText('Créez un nouvel espace de travail pour collaborer avec votre équipe')
    ).toBeInTheDocument()
  })

  it('affiche le bouton de retour', () => {
    render(<NewWorkspacePage />)

    const backButton = screen.getByRole('link', { name: /retour aux espaces de travail/i })
    expect(backButton).toBeInTheDocument()
    expect(backButton).toHaveAttribute('href', '/workspaces')
  })

  it('affiche le formulaire de création', () => {
    render(<NewWorkspacePage />)
    expect(screen.getByTestId('create-workspace-form')).toBeInTheDocument()
  })
}) 