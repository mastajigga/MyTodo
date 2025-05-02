import { render, screen } from '@testing-library/react';
import TasksPage from '@/app/tasks/page';
import { mockSupabase } from '@/test/mocks/supabase';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  cookies: () => ({
    get: () => null
  })
}));

vi.mock('@/components/tasks/KanbanBoard', () => ({
  default: () => <div data-testid="kanban-board">Kanban Board Component</div>
}));

describe('TasksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher le titre de la page', async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      order: vi.fn().mockResolvedValue({
        data: [],
        error: null
      }),
      match: vi.fn().mockReturnThis()
    }));

    render(await TasksPage());
    
    expect(screen.getByText('Mes Tâches')).toBeInTheDocument();
  });

  it('devrait afficher le KanbanBoard', async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      order: vi.fn().mockResolvedValue({
        data: [],
        error: null
      }),
      match: vi.fn().mockReturnThis()
    }));

    render(await TasksPage());
    
    expect(screen.getByTestId('kanban-board')).toBeInTheDocument();
  });
}); 