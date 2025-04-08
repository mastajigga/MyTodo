import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { KanbanBoard } from '../KanbanBoard';
import { TaskService } from '@/services/task.service';
import { Task } from '@/types/task';

// Mock des dépendances
vi.mock('@/services/task.service', () => ({
  TaskService: {
    getProjectTasks: vi.fn(),
    updateTaskStatus: vi.fn()
  }
}));

// Mock de @hello-pangea/dnd car il ne fonctionne pas bien en environnement de test
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => children,
  Droppable: ({ children }: { children: Function }) => children({
    droppableProps: {},
    innerRef: () => {},
    placeholder: null
  }),
  Draggable: ({ children }: { children: Function }) => children({
    draggableProps: {},
    dragHandleProps: {},
    innerRef: () => {}
  })
}));

describe('KanbanBoard', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Tâche 1',
      status: 'todo',
      priority: 'medium',
      project_id: 'project-1',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Tâche 2',
      status: 'in_progress',
      priority: 'high',
      project_id: 'project-1',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche un loader pendant le chargement', () => {
    vi.mocked(TaskService.getProjectTasks).mockResolvedValue([]);
    render(<KanbanBoard projectId="project-1" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('charge et affiche les tâches correctement', async () => {
    vi.mocked(TaskService.getProjectTasks).mockResolvedValue(mockTasks);
    render(<KanbanBoard projectId="project-1" />);

    await waitFor(() => {
      expect(screen.getByText('Tâche 1')).toBeInTheDocument();
      expect(screen.getByText('Tâche 2')).toBeInTheDocument();
    });

    expect(TaskService.getProjectTasks).toHaveBeenCalledWith('project-1');
  });

  it('affiche un message d\'erreur si le chargement échoue', async () => {
    vi.mocked(TaskService.getProjectTasks).mockRejectedValue(new Error('Erreur de chargement'));
    render(<KanbanBoard projectId="project-1" />);

    await waitFor(() => {
      expect(screen.getByText('Impossible de charger les tâches')).toBeInTheDocument();
    });
  });
}); 