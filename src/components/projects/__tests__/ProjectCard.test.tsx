import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from '../ProjectCard';
import { Project } from '@/types/project';

// Mock de next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('ProjectCard', () => {
  const mockProject: Project = {
    id: '1',
    workspace_id: '1',
    name: 'Projet Test',
    description: 'Description du projet test',
    color: 'blue',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait afficher les informations du projet', () => {
    render(<ProjectCard project={mockProject} index={0} onDelete={mockOnDelete} />);

    expect(screen.getByText(mockProject.name)).toBeInTheDocument();
    expect(screen.getByText(mockProject.description!)).toBeInTheDocument();
    expect(screen.getByText(/Créé le/)).toBeInTheDocument();
  });

  it('devrait avoir un lien vers la page du projet', () => {
    render(<ProjectCard project={mockProject} index={0} onDelete={mockOnDelete} />);

    const link = screen.getByRole('link', { name: mockProject.name });
    expect(link).toHaveAttribute('href', `/project/${mockProject.id}`);
  });

  it('devrait appeler onDelete lors du clic sur le bouton supprimer', () => {
    render(<ProjectCard project={mockProject} index={0} onDelete={mockOnDelete} />);

    // Ouvrir le menu
    const menuButton = screen.getByRole('button', { name: /Menu du projet/i });
    fireEvent.click(menuButton);

    // Cliquer sur Supprimer
    const deleteButton = screen.getByRole('menuitem', { name: /Supprimer/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('devrait afficher "Aucune description" si la description est vide', () => {
    const projectSansDescription = {
      ...mockProject,
      description: undefined,
    };

    render(
      <ProjectCard
        project={projectSansDescription}
        index={0}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Aucune description')).toBeInTheDocument();
  });

  it('devrait afficher la couleur du projet', () => {
    render(<ProjectCard project={mockProject} index={0} onDelete={mockOnDelete} />);

    const colorIndicator = screen.getByTestId('project-color');
    expect(colorIndicator).toHaveStyle({
      backgroundColor: expect.any(String),
    });
  });
}); 