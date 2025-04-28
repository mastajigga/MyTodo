import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTaskDialog } from '../CreateTaskDialog';
import { taskService } from '@/services/task.service';
import { toast } from 'sonner';
import { useCreateTaskDialog } from '@/components/providers/CreateTaskDialogProvider';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { useProjects } from '@/hooks/useProjects';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { vi } from 'vitest';

// Mock des dépendances
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/services/task.service', () => ({
  taskService: {
    createTask: vi.fn(),
  },
}));

vi.mock('@/components/providers/CreateTaskDialogProvider', () => ({
  useCreateTaskDialog: vi.fn(),
}));

vi.mock('@/contexts/workspace-context', () => ({
  useWorkspaceContext: vi.fn(),
}));

vi.mock('@/hooks/useProjects', () => ({
  useProjects: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('CreateTaskDialog', () => {
  const mockUser = { id: 'user-123' };
  const mockWorkspace = { id: 'workspace-123', name: 'Test Workspace' };
  const mockProjects = [
    { id: 'project-1', name: 'Project 1' },
    { id: 'project-2', name: 'Project 2' },
  ];

  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  };

  beforeEach(() => {
    // Configuration des mocks
    (useCreateTaskDialog as vi.Mock).mockReturnValue({
      isOpen: true,
      projectId: 'project-1',
      onSuccess: vi.fn(),
      closeCreateTaskDialog: vi.fn(),
    });

    (useWorkspaceContext as vi.Mock).mockReturnValue({
      workspace: mockWorkspace,
      workspaces: [mockWorkspace],
      setWorkspace: vi.fn(),
    });

    (useProjects as vi.Mock).mockReturnValue({
      projects: mockProjects,
    });

    (useQueryClient as vi.Mock).mockReturnValue(mockQueryClient);

    (supabase.auth.getUser as vi.Mock).mockResolvedValue({
      data: { user: mockUser },
    });

    // Réinitialisation des mocks
    vi.clearAllMocks();
  });

  it('devrait rendre correctement le dialogue avec tous les champs', () => {
    render(<CreateTaskDialog />);

    expect(screen.getByText('Créer une nouvelle tâche')).toBeInTheDocument();
    expect(screen.getByLabelText('Titre')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Priorité')).toBeInTheDocument();
    expect(screen.getByLabelText("Date d'échéance")).toBeInTheDocument();
    expect(screen.getByLabelText('Espace de travail')).toBeInTheDocument();
    expect(screen.getByLabelText('Projet')).toBeInTheDocument();
  });

  it('devrait afficher des erreurs de validation pour les champs requis', async () => {
    render(<CreateTaskDialog />);
    
    const submitButton = screen.getByText('Créer');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Le titre est requis')).toBeInTheDocument();
      expect(screen.getByText("L'espace de travail est requis")).toBeInTheDocument();
    });
  });

  it('devrait créer une tâche avec succès', async () => {
    render(<CreateTaskDialog />);

    // Remplir le formulaire
    await userEvent.type(screen.getByLabelText('Titre'), 'Nouvelle tâche');
    await userEvent.type(screen.getByLabelText('Description'), 'Description de la tâche');
    
    // Sélectionner la priorité
    const prioritySelect = screen.getByLabelText('Priorité');
    fireEvent.click(prioritySelect);
    fireEvent.click(screen.getByText('Haute'));

    // Soumettre le formulaire
    fireEvent.click(screen.getByText('Créer'));

    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Nouvelle tâche',
        description: 'Description de la tâche',
        priority: 'high',
        workspace_id: mockWorkspace.id,
      }));
      expect(toast.success).toHaveBeenCalledWith('Tâche créée avec succès');
    });
  });

  it('devrait gérer les erreurs lors de la création', async () => {
    const error = new Error('Erreur de création');
    (taskService.createTask as vi.Mock).mockRejectedValueOnce(error);

    render(<CreateTaskDialog />);

    // Remplir et soumettre le formulaire
    await userEvent.type(screen.getByLabelText('Titre'), 'Nouvelle tâche');
    fireEvent.click(screen.getByText('Créer'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Une erreur est survenue');
    });
  });

  it('devrait fermer le dialogue et réinitialiser le formulaire après une création réussie', async () => {
    const mockCloseDialog = vi.fn();
    const mockOnSuccess = vi.fn();
    
    (useCreateTaskDialog as vi.Mock).mockReturnValue({
      isOpen: true,
      projectId: 'project-1',
      onSuccess: mockOnSuccess,
      closeCreateTaskDialog: mockCloseDialog,
    });

    render(<CreateTaskDialog />);

    // Remplir et soumettre le formulaire
    await userEvent.type(screen.getByLabelText('Titre'), 'Nouvelle tâche');
    fireEvent.click(screen.getByText('Créer'));

    await waitFor(() => {
      expect(mockCloseDialog).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(screen.getByLabelText('Titre')).toHaveValue('');
    });
  });

  it('devrait mettre à jour le projet sélectionné lors du changement d\'espace de travail', async () => {
    const mockSetWorkspace = vi.fn();
    (useWorkspaceContext as vi.Mock).mockReturnValue({
      workspace: mockWorkspace,
      workspaces: [mockWorkspace, { id: 'workspace-2', name: 'Workspace 2' }],
      setWorkspace: mockSetWorkspace,
    });

    render(<CreateTaskDialog />);

    // Changer l'espace de travail
    const workspaceSelect = screen.getByLabelText('Espace de travail');
    fireEvent.click(workspaceSelect);
    fireEvent.click(screen.getByText('Workspace 2'));

    await waitFor(() => {
      expect(mockSetWorkspace).toHaveBeenCalledWith(expect.objectContaining({
        id: 'workspace-2',
        name: 'Workspace 2',
      }));
    });
  });
}); 