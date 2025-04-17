import { render, screen } from '@testing-library/react';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Task, TaskPriority } from '@/types/task';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PRIORITY_COLORS } from '@/lib/constants/task';

describe('TaskCard', () => {
  const baseTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'high',
    project_id: 'project-1',
    created_by: 'user-1',
    assigned_to: 'user-1',
    position: 0,
    due_date: '2024-04-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to_user: {
      id: 'user-1',
      full_name: 'John Doe',
      avatar_url: 'https://example.com/avatar.jpg',
      email: 'john.doe@example.com'
    }
  };

  describe('Affichage du contenu', () => {
    it('affiche correctement le titre de la tâche', () => {
      render(<TaskCard task={baseTask} />);
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    it('affiche la description si elle existe', () => {
      render(<TaskCard task={baseTask} />);
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('n\'affiche pas la description si elle n\'existe pas', () => {
      const taskWithoutDesc = { ...baseTask, description: '' };
      render(<TaskCard task={taskWithoutDesc} />);
      expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
    });

    it('affiche les informations de l\'utilisateur assigné', () => {
      render(<TaskCard task={baseTask} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Gestion des priorités', () => {
    const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
    const priorityTranslations = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute',
      urgent: 'Urgente'
    };

    priorities.forEach(priority => {
      it(`affiche correctement la priorité ${priority}`, () => {
        const taskWithPriority: Task = {
          ...baseTask,
          priority
        };
        render(<TaskCard task={taskWithPriority} />);
        const priorityBadge = screen.getByText(priorityTranslations[priority]);
        expect(priorityBadge).toBeInTheDocument();
        expect(priorityBadge.className).toContain(PRIORITY_COLORS[priority]);
      });
    });
  });

  describe('Gestion des dates', () => {
    it('affiche la date d\'échéance si elle existe', () => {
      render(<TaskCard task={baseTask} />);
      expect(screen.getByText('15 avr.')).toBeInTheDocument();
    });

    it('n\'affiche pas la date d\'échéance si elle n\'existe pas', () => {
      const taskWithoutDueDate = { ...baseTask, due_date: null };
      render(<TaskCard task={taskWithoutDueDate} />);
      expect(screen.queryByText(/\d{1,2} \w+\./)).not.toBeInTheDocument();
    });
  });

  describe('Gestion des sous-tâches', () => {
    it('affiche le nombre de sous-tâches si elles existent', () => {
      const taskWithSubtasks: Task = {
        ...baseTask,
        subtasks: [
          { id: '1', title: 'Sous-tâche 1', completed: true },
          { id: '2', title: 'Sous-tâche 2', completed: false }
        ]
      };
      render(<TaskCard task={taskWithSubtasks} />);
      expect(screen.getByText('1/2')).toBeInTheDocument();
    });

    it('n\'affiche pas le compteur de sous-tâches s\'il n\'y en a pas', () => {
      render(<TaskCard task={baseTask} />);
      expect(screen.queryByText(/\d+\/\d+/)).not.toBeInTheDocument();
    });
  });
}); 