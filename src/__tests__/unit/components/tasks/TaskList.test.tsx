import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from '@/components/tasks/TaskList';
import { vi } from 'vitest';
import type { Task } from '@/types/task';

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Description 1',
      status: 'pending',
      workspace_id: 'workspace-1',
      user_id: 'user-1',
      priority: 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Test Task 2',
      description: undefined,
      status: 'pending',
      workspace_id: 'workspace-1',
      user_id: 'user-1',
      priority: 'low',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  it('renders tasks correctly', () => {
    render(<TaskList tasks={mockTasks} />);
    
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('displays empty state when no tasks', () => {
    render(<TaskList tasks={[]} />);
    
    expect(screen.getByText('Aucune tâche à afficher')).toBeInTheDocument();
  });

  it('handles task completion toggle', () => {
    const onTaskMove = vi.fn();
    render(<TaskList tasks={mockTasks} onTaskMove={onTaskMove} />);
    
    const checkbox = screen.getByLabelText('Marquer la tâche "Test Task 1" comme terminée');
    fireEvent.click(checkbox);
    
    expect(onTaskMove).toHaveBeenCalledWith('1', true);
  });
}); 