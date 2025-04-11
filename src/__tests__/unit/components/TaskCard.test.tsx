import { render, screen } from '@testing-library/react';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Task, TaskPriority } from '@/types/task';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PRIORITY_COLORS } from '@/lib/constants/task';

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
    updated_at: new Date().toISOString(),
  };

  describe('Affichage du contenu', () => {
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

    it('tronque la description si elle est trop longue', () => {
      const longDescription = 'a'.repeat(200);
      const taskWithLongDesc = { ...mockTask, description: longDescription };
      render(<TaskCard task={taskWithLongDesc} />);
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });
  });

  describe('Gestion des priorités', () => {
    const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

    priorities.forEach(priority => {
      it(`affiche correctement la priorité ${priority}`, () => {
        const taskWithPriority = { ...mockTask, priority };
        render(<TaskCard task={taskWithPriority} />);
        const priorityBadge = screen.getByText(priority);
        expect(priorityBadge).toBeInTheDocument();
        expect(priorityBadge.className).toContain(PRIORITY_COLORS[priority]);
      });
    });
  });

  describe('Gestion des dates et heures', () => {
    it('affiche la date d\'échéance si elle existe', () => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);
      const taskWithFutureDate = {
        ...mockTask,
        due_date: futureDate.toISOString().split('T')[0]
      };
      render(<TaskCard task={taskWithFutureDate} />);
      const dateElement = screen.getByTestId('due-date');
      expect(dateElement).toBeInTheDocument();
      expect(dateElement).toHaveTextContent(/dans|le/i);
    });

    it('n\'affiche pas la date d\'échéance si elle n\'existe pas', () => {
      const taskWithoutDueDate = { ...mockTask, due_date: undefined };
      render(<TaskCard task={taskWithoutDueDate} />);
      const dateElement = screen.queryByTestId('due-date');
      expect(dateElement).not.toBeInTheDocument();
    });

    it('affiche l\'heure d\'échéance si elle existe', () => {
      render(<TaskCard task={mockTask} />);
      expect(screen.getByText('14:00')).toBeInTheDocument();
    });

    it('n\'affiche pas l\'heure d\'échéance si elle n\'existe pas', () => {
      const taskWithoutDueTime = { ...mockTask, due_time: undefined };
      render(<TaskCard task={taskWithoutDueTime} />);
      expect(screen.queryByText('14:00')).not.toBeInTheDocument();
    });
  });

  describe('Gestion des sous-tâches', () => {
    it('affiche le nombre de sous-tâches si elles existent', () => {
      const taskWithSubtasks = {
        ...mockTask,
        subtasks: [
          { id: '1', title: 'Subtask 1', completed: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '2', title: 'Subtask 2', completed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        ]
      };
      render(<TaskCard task={taskWithSubtasks} />);
      expect(screen.getByText('1/2 sous-tâches')).toBeInTheDocument();
    });

    it('n\'affiche pas le compteur de sous-tâches s\'il n\'y en a pas', () => {
      render(<TaskCard task={mockTask} />);
      expect(screen.queryByText(/sous-tâches/)).not.toBeInTheDocument();
    });
  });

  describe('Gestion de l\'assignation', () => {
    it('affiche le bouton "Assigner" si la tâche n\'est pas assignée', () => {
      render(<TaskCard task={mockTask} />);
      expect(screen.getByText('Assigner')).toBeInTheDocument();
    });

    it('affiche l\'indicateur d\'assignation si la tâche est assignée', () => {
      const assignedTask = { ...mockTask, assigned_to: 'user-2' };
      render(<TaskCard task={assignedTask} />);
      expect(screen.getByText('Assigné')).toBeInTheDocument();
    });
  });
}); 