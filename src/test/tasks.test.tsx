import React from 'react';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskList } from '../components/tasks/TaskList';
import type { Database } from '../types/supabase';
import type { Task } from '../types/task';

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
    estimated_time: 120,
    position: 1,
    start_time: null,
    tags: ['frontend', 'bug']
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    status: 'in_progress',
    priority: 'high',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_id: 'workspace-1',
    project_id: 'project-1',
    created_by: 'user-1',
    assigned_to: 'user-3',
    assignee: {
      full_name: 'Jane Smith'
    },
    deleted_at: null,
    due_date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    estimated_time: 60,
    position: 2,
    start_time: null,
    tags: ['urgent']
  }
];

type MockSupabaseClient = {
  from: (table: keyof Database['public']['Tables']) => {
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    then: ReturnType<typeof vi.fn>;
  };
  auth: {
    getSession: ReturnType<typeof vi.fn>;
  };
};

const mockSupabaseClient: MockSupabaseClient = {
  from: (table: keyof Database['public']['Tables']) => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    then: vi.fn().mockResolvedValue({ data: mockTasks, error: null })
  }),
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null })
  }
};

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabaseClient
}));

describe('Tasks Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TaskList', () => {
    beforeEach(() => {
      mockSupabaseClient.from().then.mockResolvedValue({
        data: [],
        error: null
      });
    });

    it('should render task list correctly', async () => {
      render(<TaskList workspaceId="workspace-1" />);

      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
      });
    });

    it('should display task priorities correctly', async () => {
      render(<TaskList workspaceId="workspace-1" />);

      await waitFor(() => {
        expect(screen.getByText('medium')).toBeInTheDocument();
        expect(screen.getByText('high')).toBeInTheDocument();
      });
    });

    it('should display task statuses correctly', async () => {
      render(<TaskList workspaceId="workspace-1" />);

      await waitFor(() => {
        expect(screen.getByText('À faire')).toBeInTheDocument();
        expect(screen.getByText('En cours')).toBeInTheDocument();
      });
    });

    it('should handle empty task list', async () => {
      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: [],
          error: null
        })
      }));

      render(<TaskList workspaceId="workspace-1" />);

      await waitFor(() => {
        expect(screen.getByText(/aucune tâche disponible/i)).toBeInTheDocument();
      });
    });

    it('should handle loading state', async () => {
      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation(() => new Promise(() => {})) // Never resolves to simulate loading
      }));

      render(<TaskList workspaceId="workspace-1" />);

      expect(screen.getByText(/chargement/i)).toBeInTheDocument();
    });

    it('should handle error state', async () => {
      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Erreur lors du chargement des tâches' }
        })
      }));

      render(<TaskList workspaceId="workspace-1" />);

      await waitFor(() => {
        expect(screen.getByText(/erreur lors du chargement des tâches/i)).toBeInTheDocument();
      });
    });

    it('should handle pagination correctly', async () => {
      const paginatedTasks = Array.from({ length: 15 }, (_, i) => ({
        id: `task-${i + 1}`,
        title: `Task ${i + 1}`,
        description: `Description for task ${i + 1}`,
        status: 'todo',
        priority: 'medium',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        workspace_id: 'workspace-1',
        created_by: 'user-1',
        project_id: 'project-1',
        assigned_to: null,
        deleted_at: null,
        due_date: null,
        estimated_time: null,
        position: i,
        start_time: null,
        tags: []
      }));

      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: paginatedTasks.slice(0, 10),
          error: null
        })
      }));

      render(<TaskList workspaceId="workspace-1" />);

      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 10')).toBeInTheDocument();
      });

      // Simuler le clic sur le bouton "Page suivante"
      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: paginatedTasks.slice(10, 15),
          error: null
        })
      }));

      fireEvent.click(screen.getByText(/suivant/i));

      await waitFor(() => {
        expect(screen.getByText('Task 11')).toBeInTheDocument();
        expect(screen.getByText('Task 15')).toBeInTheDocument();
        expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      });

      // Vérifier le nombre total de pages
      expect(screen.getByText('2')).toBeInTheDocument(); // Nombre total de pages
      expect(screen.getByText('Page 2')).toBeInTheDocument();

      // Simuler le retour à la première page
      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: paginatedTasks.slice(0, 10),
          error: null
        })
      }));

      fireEvent.click(screen.getByText(/précédent/i));

      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 10')).toBeInTheDocument();
        expect(screen.queryByText('Task 11')).not.toBeInTheDocument();
        expect(screen.getByText('Page 1')).toBeInTheDocument();
      });
    });

    it('should handle sorting by priority', async () => {
      const sortedTasks = [
        {
          id: 'task-1',
          title: 'High Priority Task',
          description: 'Description',
          status: 'todo',
          priority: 'high',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          workspace_id: 'workspace-1',
          created_by: 'user-1',
          project_id: 'project-1',
          assigned_to: null,
          deleted_at: null,
          due_date: null,
          estimated_time: null,
          position: 0,
          start_time: null,
          tags: []
        },
        {
          id: 'task-2',
          title: 'Low Priority Task',
          description: 'Description',
          status: 'todo',
          priority: 'low',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          workspace_id: 'workspace-1',
          created_by: 'user-1',
          project_id: 'project-1',
          assigned_to: null,
          deleted_at: null,
          due_date: null,
          estimated_time: null,
          position: 1,
          start_time: null,
          tags: []
        }
      ];

      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: sortedTasks,
          error: null
        })
      }));

      render(<TaskList workspaceId="workspace-1" />);

      // Cliquer sur le bouton de tri par priorité
      fireEvent.click(screen.getByText(/trier par priorité/i));

      await waitFor(() => {
        const tasks = screen.getAllByTestId('task-item');
        expect(tasks[0]).toHaveTextContent(/high priority task/i);
        expect(tasks[1]).toHaveTextContent(/low priority task/i);
      });
    });

    it('should filter tasks by status', async () => {
      const filteredTasks = mockTasks.filter(task => task.status === 'in_progress');
      
      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: filteredTasks,
          error: null
        })
      }));

      render(<TaskList workspaceId="workspace-1" />);

      // Simuler le filtrage par statut
      fireEvent.click(screen.getByRole('button', { name: /filtrer/i }));
      fireEvent.click(screen.getByText(/en cours/i));

      await waitFor(() => {
        expect(screen.queryByText('Task 1')).not.toBeInTheDocument(); // Tâche avec status 'todo'
        expect(screen.getByText('Task 2')).toBeInTheDocument(); // Tâche avec status 'in_progress'
      });
    });

    it('should sort tasks by priority', async () => {
      const priorityOrder: Record<string, number> = { low: 0, medium: 1, high: 2 };
      const sortedTasks = [...mockTasks].sort((a, b) => {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: sortedTasks,
          error: null
        })
      }));

      render(<TaskList workspaceId="workspace-1" />);

      // Simuler le tri par priorité
      fireEvent.click(screen.getByRole('button', { name: /trier/i }));
      fireEvent.click(screen.getByText(/priorité/i));

      await waitFor(() => {
        const taskElements = screen.getAllByTestId('task-item');
        expect(taskElements[0]).toHaveTextContent('high');
        expect(taskElements[1]).toHaveTextContent('medium');
      });
    });

    it('should search tasks by title', async () => {
      const searchQuery = 'Task 1';
      const searchResults = mockTasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: searchResults,
          error: null
        })
      }));

      render(<TaskList workspaceId="workspace-1" />);

      // Simuler la recherche
      const searchInput = screen.getByPlaceholderText(/rechercher/i);
      fireEvent.change(searchInput, { target: { value: searchQuery } });

      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
      });
    });

    it('should handle tasks with tags', async () => {
      const tasksWithTags = [
        {
          ...mockTasks[0],
          tags: ['important', 'urgent']
        },
        {
          ...mockTasks[1],
          tags: ['feature']
        }
      ];

      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: tasksWithTags,
          error: null
        })
      }));

      render(<TaskList workspaceId="workspace-1" />);

      await waitFor(() => {
        expect(screen.getByText('important')).toBeInTheDocument();
        expect(screen.getByText('urgent')).toBeInTheDocument();
        expect(screen.getByText('feature')).toBeInTheDocument();
      });
    });

    it('should handle tasks with due dates', async () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);

      const tasksWithDueDates = [
        {
          ...mockTasks[0],
          due_date: now.toISOString()
        },
        {
          ...mockTasks[1],
          due_date: tomorrow.toISOString()
        }
      ];

      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: tasksWithDueDates,
          error: null
        })
      }));

      render(<TaskList workspaceId="workspace-1" />);

      await waitFor(() => {
        expect(screen.getByText(now.toLocaleDateString())).toBeInTheDocument();
        expect(screen.getByText(tomorrow.toLocaleDateString())).toBeInTheDocument();
      });
    });

    it('should handle tasks with assignees', async () => {
      const tasksWithAssignees = [
        {
          ...mockTasks[0],
          assigned_to: 'user-1',
          assignee: {
            full_name: 'John Doe'
          }
        },
        {
          ...mockTasks[1],
          assigned_to: 'user-2',
          assignee: {
            full_name: 'Jane Smith'
          }
        }
      ];

      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: tasksWithAssignees,
          error: null
        })
      }));

      render(<TaskList workspaceId="workspace-1" />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    it('should handle network timeout errors', async () => {
      mockSupabaseClient.from.mockImplementation((table: keyof Database['public']['Tables']) => ({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        then: vi.fn().mockRejectedValue(new Error('Network timeout'))
      }));

      render(<TaskList workspaceId="workspace-1" />);

      await waitFor(() => {
        expect(screen.getByText(/erreur lors du chargement des tâches/i)).toBeInTheDocument();
      });
    });

    it('should handle state transitions during loading', async () => {
      let resolvePromise!: (value: any) => void;
      const loadingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockReturnValue(loadingPromise)
      }));

      render(<TaskList workspaceId="workspace-1" />);

      // Vérifier l'état de chargement initial
      expect(screen.getByText(/chargement/i)).toBeInTheDocument();

      // Simuler la réponse de l'API
      resolvePromise({
        data: mockTasks,
        error: null
      });

      // Vérifier que les tâches sont affichées
      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
      });
    });

    it('should validate Supabase query parameters', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockReturnThis();
      const mockThen = vi.fn().mockResolvedValue({
        data: mockTasks,
        error: null
      });

      mockSupabaseClient.from.mockImplementation((table) => ({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
        then: mockThen
      }));

      render(<TaskList workspaceId="workspace-1" />);

      await waitFor(() => {
        // Vérifier que la requête est construite correctement
        expect(mockSupabaseClient.from).toHaveBeenCalledWith('tasks');
        expect(mockSelect).toHaveBeenCalledWith('*', { count: 'exact' });
        expect(mockEq).toHaveBeenCalledWith('workspace_id', 'workspace-1');
        expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      });
    });

    it('should handle concurrent filter changes', async () => {
      const mockResponses = {
        status: {
          data: mockTasks.filter(task => task.status === 'todo'),
          error: null
        },
        priority: {
          data: mockTasks.filter(task => task.priority === 'high'),
          error: null
        }
      };

      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: vi.fn()
          .mockResolvedValueOnce(mockResponses.status)
          .mockResolvedValueOnce(mockResponses.priority)
      }));

      render(<TaskList workspaceId="workspace-1" />);

      // Appliquer les filtres rapidement
      fireEvent.click(screen.getByText(/à faire/i));
      fireEvent.click(screen.getByText(/haute/i));

      await waitFor(() => {
        // Vérifier que seules les tâches correspondant aux deux filtres sont affichées
        const taskElements = screen.getAllByTestId('task-item');
        taskElements.forEach(element => {
          expect(element).toHaveTextContent(/todo.*high|high.*todo/i);
        });
      });
    });

    it('should preserve filter state between page navigation', async () => {
      const filteredTasks = Array.from({ length: 15 }, (_, i) => ({
        ...mockTasks[0],
        id: `task-${i + 1}`,
        title: `Task ${i + 1}`,
        status: 'todo'
      }));

      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: filteredTasks.slice(0, 10),
          error: null
        })
      }));

      render(<TaskList workspaceId="workspace-1" />);

      // Appliquer un filtre
      fireEvent.click(screen.getByText(/à faire/i));

      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
      });

      // Naviguer vers la page suivante
      mockSupabaseClient.from.mockImplementation((table) => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue({
          data: filteredTasks.slice(10),
          error: null
        })
      }));

      fireEvent.click(screen.getByText(/suivant/i));

      await waitFor(() => {
        // Vérifier que le filtre est toujours appliqué
        const taskElements = screen.getAllByTestId('task-item');
        taskElements.forEach(element => {
          expect(element).toHaveTextContent(/todo/i);
        });
      });
    });
  });
}); 