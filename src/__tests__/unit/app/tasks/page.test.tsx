import { render, screen } from '@testing-library/react';
import TasksPage from '@/app/tasks/page';

vi.mock('@/components/tasks/KanbanBoard', () => ({
  KanbanBoard: () => <div data-testid="kanban-board">Kanban Board Component</div>,
}));

describe('TasksPage', () => {
  it('renders page header with correct title', () => {
    render(<TasksPage />);
    expect(screen.getByText('Mes tâches')).toBeInTheDocument();
  });

  it('renders KanbanBoard component', () => {
    render(<TasksPage />);
    expect(screen.getByTestId('kanban-board')).toBeInTheDocument();
  });
}); 