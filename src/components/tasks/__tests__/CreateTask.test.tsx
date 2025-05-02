import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTask } from '../CreateTask';
import { TaskService } from '@/services/task.service';
import { vi } from 'vitest';
import { toast } from 'sonner';

// Mock des dépendances
vi.mock('@/services/task.service', () => ({
  TaskService: {
    createTask: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CreateTask', () => {
  const mockProps = {
    projectId: 'project-123',
    workspaceId: 'workspace-123',
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre tous les champs du formulaire', () => {
    render(<CreateTask {...mockProps} />);

    expect(screen.getByLabelText(/titre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priorité/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date d'échéance/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer la tâche/i })).toBeInTheDocument();
  });

  it('devrait afficher une erreur si le titre est vide', async () => {
    render(<CreateTask {...mockProps} />);
    
    const submitButton = screen.getByRole('button', { name: /créer la tâche/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Le titre est requis')).toBeInTheDocument();
    });
  });

  it('devrait soumettre le formulaire avec succès', async () => {
    const mockTask = {
      title: 'Nouvelle tâche',
      description: 'Description de la tâche',
      priority: 'medium',
      due_date: '2024-04-22',
    };

    (TaskService.createTask as any).mockResolvedValueOnce(mockTask);

    render(<CreateTask {...mockProps} />);

    // Remplir le formulaire
    await userEvent.type(screen.getByLabelText(/titre/i), mockTask.title);
    await userEvent.type(screen.getByLabelText(/description/i), mockTask.description);
    
    // Sélectionner la priorité
    const prioritySelect = screen.getByLabelText(/priorité/i);
    fireEvent.click(prioritySelect);
    const mediumOption = screen.getByText('Moyenne');
    fireEvent.click(mediumOption);

    // Définir la date d'échéance
    const dueDateInput = screen.getByLabelText(/date d'échéance/i);
    fireEvent.change(dueDateInput, { target: { value: mockTask.due_date } });

    // Soumettre le formulaire
    const submitButton = screen.getByRole('button', { name: /créer la tâche/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(TaskService.createTask).toHaveBeenCalledWith({
        ...mockTask,
        project_id: mockProps.projectId,
        workspace_id: mockProps.workspaceId,
        status: 'todo',
      });
      expect(toast.success).toHaveBeenCalledWith('Tâche créée avec succès');
      expect(mockProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('devrait gérer les erreurs lors de la création de la tâche', async () => {
    const error = new Error('Erreur de création');
    (TaskService.createTask as any).mockRejectedValueOnce(error);

    render(<CreateTask {...mockProps} />);

    // Remplir et soumettre le formulaire
    await userEvent.type(screen.getByLabelText(/titre/i), 'Nouvelle tâche');
    const submitButton = screen.getByRole('button', { name: /créer la tâche/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erreur lors de la création de la tâche');
    });
  });

  it('devrait avoir les bonnes options de priorité', () => {
    render(<CreateTask {...mockProps} />);

    const prioritySelect = screen.getByLabelText(/priorité/i);
    fireEvent.click(prioritySelect);

    expect(screen.getByText('Basse')).toBeInTheDocument();
    expect(screen.getByText('Moyenne')).toBeInTheDocument();
    expect(screen.getByText('Haute')).toBeInTheDocument();
    expect(screen.getByText('Urgente')).toBeInTheDocument();
  });

  it('devrait avoir une priorité moyenne par défaut', () => {
    render(<CreateTask {...mockProps} />);

    const prioritySelect = screen.getByLabelText(/priorité/i);
    expect(prioritySelect).toHaveValue('medium');
  });
}); 