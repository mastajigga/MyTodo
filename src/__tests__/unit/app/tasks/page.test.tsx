import { render, screen } from '@testing-library/react';
import TasksPage from '@/app/tasks/page';

vi.mock('@/components/tasks/TaskList', () => ({
  TaskList: () => <div data-testid="task-list">Task List Component</div>,
}));

describe('TasksPage', () => {
  it('renders page header with correct title and description', () => {
    render(<TasksPage />);
    
    expect(screen.getByText('Mes tâches')).toBeInTheDocument();
    expect(screen.getByText('Gérez et suivez vos tâches personnelles')).toBeInTheDocument();
  });

  it('renders TaskList component', () => {
    render(<TasksPage />);
    
    expect(screen.getByTestId('task-list')).toBeInTheDocument();
  });
}); 