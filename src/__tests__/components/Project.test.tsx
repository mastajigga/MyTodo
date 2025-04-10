import { render, screen, fireEvent } from '@testing-library/react';
import { Project } from '@/components/projects/Project';
import { mockSupabase } from '../../../jest.setup';

const mockProject = {
  id: 'project-123',
  name: 'Test Project',
  description: 'Test Project Description',
  workspace_id: 'workspace-123',
  color: '#FF0000',
  created_at: '2024-04-08T00:00:00Z',
  updated_at: '2024-04-08T00:00:00Z'
};

const mockTasks = [
  {
    id: 'task-1',
    title: 'Task 1',
    status: 'todo',
    priority: 'high',
    project_id: 'project-123',
    created_by: 'user-123',
    created_at: '2024-04-08T00:00:00Z',
    updated_at: '2024-04-08T00:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Task 2',
    status: 'in_progress',
    priority: 'medium',
    project_id: 'project-123',
    created_by: 'user-123',
    created_at: '2024-04-08T00:00:00Z',
    updated_at: '2024-04-08T00:00:00Z'
  }
];

describe('Project Component', () => {
  beforeEach(() => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null
    });
  });

  it('renders project name correctly', () => {
    render(<Project project={mockProject} tasks={mockTasks} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('displays project description', () => {
    render(<Project project={mockProject} tasks={mockTasks} />);
    expect(screen.getByText('Test Project Description')).toBeInTheDocument();
  });

  it('shows task count', () => {
    render(<Project project={mockProject} tasks={mockTasks} />);
    expect(screen.getByText(/2 tasks/i)).toBeInTheDocument();
  });

  it('allows adding new task', () => {
    const onAddTask = jest.fn();
    render(
      <Project 
        project={mockProject} 
        tasks={mockTasks} 
        onAddTask={onAddTask} 
      />
    );
    
    const addButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(addButton);
    
    expect(onAddTask).toHaveBeenCalled();
  });

  it('filters tasks by status', () => {
    render(<Project project={mockProject} tasks={mockTasks} />);
    
    const todoFilter = screen.getByRole('button', { name: /todo/i });
    fireEvent.click(todoFilter);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });
}); 