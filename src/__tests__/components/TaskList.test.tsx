import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskList } from '../../components/tasks/TaskList';
import { createMockSupabaseClient } from '../mocks/supabase';
import type { Task } from '../../types/task';

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'todo',
      priority: 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      workspace_id: 'workspace-1',
      project_id: 'project-1',
      created_by: 'user-1',
      assigned_to: 'user-2',
      assignee: {
        full_name: 'John Doe'
      },
      deleted_at: null,
      due_date: new Date().toISOString(),
      tags: ['tag1', 'tag2'],
      estimated_time: 120,
      position: 1,
      start_time: null
    },
  ];

  const workspaceId = 'workspace-1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Flux de données', () => {
    it('charge les tâches avec un délai simulé', async () => {
      const mockSupabase = createMockSupabaseClient({ 
        tasks: mockTasks,
        delay: 1000 
      });
      
      vi.mock('@supabase/auth-helpers-nextjs', () => ({
        createClientComponentClient: () => mockSupabase,
      }));

      render(<TaskList workspaceId={workspaceId} />);
      
      // Vérifie l'état de chargement
      expect(screen.getByText('Chargement...')).toBeInTheDocument();
      
      // Attend que les données soient chargées
      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('gère la transformation des données', async () => {
      const transformResponse = (response: any) => ({
        ...response,
        data: response.data.map((task: Task) => ({
          ...task,
          title: `${task.title} (${task.status})`
        }))
      });

      const mockSupabase = createMockSupabaseClient({ 
        tasks: mockTasks,
        transformResponse 
      });
      
      vi.mock('@supabase/auth-helpers-nextjs', () => ({
        createClientComponentClient: () => mockSupabase,
      }));

      render(<TaskList workspaceId={workspaceId} />);
      
      await waitFor(() => {
        expect(screen.getByText('Task 1 (todo)')).toBeInTheDocument();
      });
    });

    it('gère la mise à jour en temps réel des tâches', async () => {
      const initialTasks = [...mockTasks];
      const updatedTasks = [
        ...initialTasks,
        {
          ...mockTasks[0],
          id: '2',
          title: 'Task 2',
          status: 'in_progress' as const
        }
      ];

      const mockSupabase = createMockSupabaseClient({ 
        tasks: initialTasks
      });

      vi.mock('@supabase/auth-helpers-nextjs', () => ({
        createClientComponentClient: () => mockSupabase,
      }));

      const { rerender } = render(<TaskList workspaceId={workspaceId} />);

      // Vérifie l'état initial
      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
      });

      // Simule une mise à jour des données
      const mockSupabaseUpdated = createMockSupabaseClient({ 
        tasks: updatedTasks
      });
      
      vi.mock('@supabase/auth-helpers-nextjs', () => ({
        createClientComponentClient: () => mockSupabaseUpdated,
      }));

      rerender(<TaskList workspaceId={workspaceId} />);

      // Vérifie que les nouvelles données sont affichées
      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
      });
    });

    it('gère les erreurs de chargement avec retry', async () => {
      let attemptCount = 0;
      const transformResponse = () => {
        attemptCount++;
        if (attemptCount === 1) {
          throw new Error('Erreur de chargement');
        }
        return { data: mockTasks, error: null };
      };

      const mockSupabase = createMockSupabaseClient({ 
        tasks: mockTasks,
        transformResponse 
      });
      
      vi.mock('@supabase/auth-helpers-nextjs', () => ({
        createClientComponentClient: () => mockSupabase,
      }));

      render(<TaskList workspaceId={workspaceId} />);

      // Vérifie l'erreur initiale
      await waitFor(() => {
        expect(screen.getByText('Erreur lors du chargement des tâches')).toBeInTheDocument();
      });

      // Clique sur le bouton de retry
      const retryButton = screen.getByText('Réessayer');
      fireEvent.click(retryButton);

      // Vérifie que les données sont chargées après le retry
      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
      });
    });

    it('gère le tri et la pagination des tâches', async () => {
      const paginatedTasks = [
        ...mockTasks,
        {
          ...mockTasks[0],
          id: '2',
          title: 'Task 2',
          position: 2
        },
        {
          ...mockTasks[0],
          id: '3',
          title: 'Task 3',
          position: 3
        }
      ];

      const mockSupabase = createMockSupabaseClient({ 
        tasks: paginatedTasks,
        transformResponse: (response) => ({
          ...response,
          data: response.data.sort((a: Task, b: Task) => a.position - b.position)
        })
      });
      
      vi.mock('@supabase/auth-helpers-nextjs', () => ({
        createClientComponentClient: () => mockSupabase,
      }));

      render(<TaskList workspaceId={workspaceId} />);

      await waitFor(() => {
        const tasks = screen.getAllByRole('listitem');
        expect(tasks).toHaveLength(3);
        expect(tasks[0]).toHaveTextContent('Task 1');
        expect(tasks[1]).toHaveTextContent('Task 2');
        expect(tasks[2]).toHaveTextContent('Task 3');
      });
    });
  });

  it('affiche la liste des tâches correctement', async () => {
    const mockSupabase = createMockSupabaseClient({ tasks: mockTasks });
    vi.mock('@supabase/auth-helpers-nextjs', () => ({
      createClientComponentClient: () => mockSupabase,
    }));

    render(<TaskList workspaceId={workspaceId} />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('medium')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('affiche un message de chargement', async () => {
    const mockSupabase = createMockSupabaseClient({
      tasks: [],
      error: null,
    });
    vi.mock('@supabase/auth-helpers-nextjs', () => ({
      createClientComponentClient: () => mockSupabase,
    }));

    render(<TaskList workspaceId={workspaceId} />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('affiche un message d\'erreur en cas d\'échec', async () => {
    const mockSupabase = createMockSupabaseClient({
      tasks: [],
      error: new Error('Erreur de chargement'),
    });
    vi.mock('@supabase/auth-helpers-nextjs', () => ({
      createClientComponentClient: () => mockSupabase,
    }));

    render(<TaskList workspaceId={workspaceId} />);

    await waitFor(() => {
      expect(screen.getByText('Erreur lors du chargement des tâches')).toBeInTheDocument();
    });
  });

  it('affiche un message quand il n\'y a pas de tâches', async () => {
    const mockSupabase = createMockSupabaseClient({ tasks: [] });
    vi.mock('@supabase/auth-helpers-nextjs', () => ({
      createClientComponentClient: () => mockSupabase,
    }));

    render(<TaskList workspaceId={workspaceId} />);

    await waitFor(() => {
      expect(screen.getByText('Aucune tâche trouvée')).toBeInTheDocument();
    });
  });

  it('should filter tasks by status', async () => {
    render(<TaskList workspaceId={workspaceId} />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const filterButton = screen.getByRole('button', { name: /filtrer/i });
    expect(filterButton).toBeInTheDocument();
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByText('À faire')).toBeInTheDocument();
    });
  });

  it('should search tasks by title', async () => {
    render(<TaskList workspaceId={workspaceId} />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/rechercher/i);
    expect(searchInput).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: 'Task 1' } });

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
  });
}); 