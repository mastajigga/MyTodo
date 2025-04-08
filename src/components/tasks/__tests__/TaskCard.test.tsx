import { render, screen } from '@testing-library/react';
import { TaskCard } from '../TaskCard';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

describe('TaskCard', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'high',
    project_id: 'project-1',
    created_by: 'user-1',
    due_date: '2024-04-15',
    due_time: '14:00',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  it('affiche correctement le titre de la tâche', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('affiche la description si elle existe', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('n\'affiche pas la description si elle n\'existe pas', () => {
    const taskWithoutDesc = { ...mockTask, description: undefined };
    render(<TaskCard task={taskWithoutDesc} />);
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('affiche la priorité avec le bon format', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Haute')).toBeInTheDocument();
  });

  it('affiche la date d\'échéance si elle existe', () => {
    render(<TaskCard task={mockTask} />);
    const formattedDate = format(new Date(mockTask.due_date!), 'dd MMM', { locale: fr });
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it('affiche l\'heure d\'échéance si elle existe', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('14:00')).toBeInTheDocument();
  });

  it('n\'affiche pas la date d\'échéance si elle n\'existe pas', () => {
    const taskWithoutDueDate = { ...mockTask, due_date: undefined };
    render(<TaskCard task={taskWithoutDueDate} />);
    const formattedDate = format(new Date(mockTask.due_date!), 'dd MMM', { locale: fr });
    expect(screen.queryByText(formattedDate)).not.toBeInTheDocument();
  });

  it('n\'affiche pas l\'heure d\'échéance si elle n\'existe pas', () => {
    const taskWithoutDueTime = { ...mockTask, due_time: undefined };
    render(<TaskCard task={taskWithoutDueTime} />);
    expect(screen.queryByText('14:00')).not.toBeInTheDocument();
  });
}); 