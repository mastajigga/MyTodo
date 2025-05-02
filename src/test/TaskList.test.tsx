import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskList } from '../components/tasks/TaskList';
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
  }
];

const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          then: vi.fn().mockResolvedValue({ data: mockTasks, error: null })
        }))
      }))
    }))
  })),
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null })
  }
};

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabase
}));

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    render(<TaskList workspaceId="workspace-1" />);
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  it('should render tasks', async () => {
    render(<TaskList workspaceId="workspace-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('bug')).toBeInTheDocument();
  });

  it('should handle error state', async () => {
    mockSupabase.from.mockImplementationOnce(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            then: vi.fn().mockResolvedValue({ data: null, error: new Error('Failed to fetch') })
          }))
        }))
      }))
    }));

    render(<TaskList workspaceId="workspace-1" />);

    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument();
    });
  });

  it('should handle empty state', async () => {
    mockSupabase.from.mockImplementationOnce(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            then: vi.fn().mockResolvedValue({ data: [], error: null })
          }))
        }))
      }))
    }));

    render(<TaskList workspaceId="workspace-1" />);

    await waitFor(() => {
      expect(screen.getByText(/aucune tâche/i)).toBeInTheDocument();
    });
  });
}); 