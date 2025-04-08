import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectList } from '../ProjectList';
import { ProjectService } from '@/services/project.service';
import { Project } from '@/types/project';

// Mock du service
jest.mock('@/services/project.service');

// Mock de next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('ProjectList', () => {
  const mockProjects: Project[] = [
    {
      id: '1',
      workspace_id: '1',
      name: 'Projet Test 1',
      description: 'Description du projet test 1',
      color: 'blue',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      workspace_id: '1',
      name: 'Projet Test 2',
      description: 'Description du projet test 2',
      color: 'green',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (ProjectService.getWorkspaceProjects as jest.Mock).mockResolvedValue(mockProjects);
  });

  it('devrait afficher un loader pendant le chargement', () => {
    render(<ProjectList workspaceId="1" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('devrait afficher la liste des projets', async () => {
    render(<ProjectList workspaceId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Projet Test 1')).toBeInTheDocument();
      expect(screen.getByText('Projet Test 2')).toBeInTheDocument();
    });
  });

  it('devrait afficher un message quand il n\'y a pas de projets', async () => {
    (ProjectService.getWorkspaceProjects as jest.Mock).mockResolvedValue([]);
    render(<ProjectList workspaceId="1" />);

    await waitFor(() => {
      expect(screen.getByText(/Aucun projet/)).toBeInTheDocument();
    });
  });

  it('devrait ouvrir la boîte de dialogue de création de projet', async () => {
    render(<ProjectList workspaceId="1" />);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /Nouveau projet/i });
      fireEvent.click(button);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('devrait supprimer un projet', async () => {
    render(<ProjectList workspaceId="1" />);

    await waitFor(() => {
      const menuButtons = screen.getAllByRole('button', { name: /Menu du projet/i });
      fireEvent.click(menuButtons[0]);
    });

    const deleteButton = screen.getByRole('menuitem', { name: /Supprimer/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(ProjectService.deleteProject).toHaveBeenCalledWith('1');
    });
  });

  it('devrait gérer les erreurs de chargement', async () => {
    (ProjectService.getWorkspaceProjects as jest.Mock).mockRejectedValue(
      new Error('Erreur de chargement')
    );

    render(<ProjectList workspaceId="1" />);

    await waitFor(() => {
      expect(screen.getByText(/Impossible de charger les projets/)).toBeInTheDocument();
    });
  });
}); 