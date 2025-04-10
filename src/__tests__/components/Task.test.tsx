import { render, screen, fireEvent } from '@testing-library/react';
import { Task } from '@/components/tasks/Task';
import { mockSupabase } from '../../../jest.setup';

const mockTask = {
  id: '123',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'medium',
  due_date: '2024-04-08T00:00:00Z',
  created_by: 'user-123',
  project_id: 'project-123',
  created_at: '2024-04-08T00:00:00Z',
  updated_at: '2024-04-08T00:00:00Z'
};

describe('Task Component', () => {
  beforeEach(() => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null
    });
  });

  it('renders task title correctly', () => {
    render(<Task task={mockTask} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('displays task priority', () => {
    render(<Task task={mockTask} />);
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
  });

  it('shows task description when expanded', () => {
    render(<Task task={mockTask} />);
    const expandButton = screen.getByRole('button', { name: /expand/i });
    fireEvent.click(expandButton);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('allows status update', async () => {
    const onStatusChange = jest.fn();
    render(<Task task={mockTask} onStatusChange={onStatusChange} />);
    
    const statusButton = screen.getByRole('button', { name: /change status/i });
    fireEvent.click(statusButton);
    
    const inProgressOption = screen.getByText(/in progress/i);
    fireEvent.click(inProgressOption);
    
    expect(onStatusChange).toHaveBeenCalledWith('in_progress');
  });
}); 