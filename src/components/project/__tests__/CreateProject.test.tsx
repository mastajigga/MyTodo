import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateProjectForm } from '@/components/projects/CreateProjectForm';
import { ProjectService } from '@/services/project.service';
import { vi } from 'vitest';
import { toast } from 'sonner';
import { useWorkspaceContext } from '@/contexts/workspace-context';

// Mock des dépendances
vi.mock('@/services/project.service', () => ({
  ProjectService: {
    createProject: vi.fn(),
  },
}));

vi.mock('@/contexts/workspace-context', () => ({
  useWorkspaceContext: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CreateProject', () => {
  const mockWorkspace = {
    id: 'workspace-123',
    name: 'Mon espace',
  };

  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useWorkspaceContext as any).mockReturnValue({
      workspace: mockWorkspace,
    });
  });

  it('devrait rendre tous les champs du formulaire', () => {
    render(<CreateProjectForm onSuccess={mockOnSuccess} />);

    expect(screen.getByLabelText(/nom du projet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer le projet/i })).toBeInTheDocument();
  });

  it('devrait afficher une erreur si le nom est vide', async () => {
    render(<CreateProjectForm onSuccess={mockOnSuccess} />);
    
    const submitButton = screen.getByRole('button', { name: /créer le projet/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Le nom est requis')).toBeInTheDocument();
    });
  });

  it('devrait soumettre le formulaire avec succès', async () => {
    const mockProject = {
      name: 'Nouveau projet',
      description: 'Description du projet',
      workspace_id: mockWorkspace.id,
    };

    (ProjectService.createProject as any).mockResolvedValueOnce(mockProject);

    render(<CreateProjectForm onSuccess={mockOnSuccess} />);

    // Remplir le formulaire
    await userEvent.type(screen.getByLabelText(/nom du projet/i), mockProject.name);
    await userEvent.type(screen.getByLabelText(/description/i), mockProject.description);

    // Soumettre le formulaire
    const submitButton = screen.getByRole('button', { name: /créer le projet/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(ProjectService.createProject).toHaveBeenCalledWith(mockProject);
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('devrait gérer les erreurs lors de la création', async () => {
    (ProjectService.createProject as any).mockRejectedValueOnce(new Error());

    render(<CreateProjectForm onSuccess={mockOnSuccess} />);

    // Remplir et soumettre le formulaire
    await userEvent.type(screen.getByLabelText(/nom du projet/i), 'Nouveau projet');
    const submitButton = screen.getByRole('button', { name: /créer le projet/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erreur lors de la création du projet');
    });
  });

  it('devrait afficher une erreur si aucun espace de travail n\'est sélectionné', async () => {
    (useWorkspaceContext as any).mockReturnValue({ workspace: null });

    render(<CreateProjectForm onSuccess={mockOnSuccess} />);

    // Remplir et soumettre le formulaire
    await userEvent.type(screen.getByLabelText(/nom du projet/i), 'Nouveau projet');
    const submitButton = screen.getByRole('button', { name: /créer le projet/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Aucun espace de travail sélectionné');
    });
  });

  it('devrait désactiver le bouton pendant la soumission', async () => {
    (ProjectService.createProject as any).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<CreateProjectForm onSuccess={mockOnSuccess} />);

    // Remplir et soumettre le formulaire
    await userEvent.type(screen.getByLabelText(/nom du projet/i), 'Nouveau projet');
    const submitButton = screen.getByRole('button', { name: /créer le projet/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
}); 