import { render, screen } from '@testing-library/react';
import { TaskCard } from '@/components/tasks/TaskCard';
import '@testing-library/jest-dom';

const baseTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'high',
  due_date: '2024-04-15',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  project_id: 'project-1',
  assigned_to: 'user-1',
  assigned_user: {
    id: 'user-1',
    full_name: 'John Doe',
    email: 'john@example.com'
  }
};

describe('TaskCard', () => {
  describe('Affichage du contenu', () => {
    it('affiche le titre et la description', () => {
      render(<TaskCard task={baseTask} />);
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('affiche le badge de priorité avec la bonne classe', () => {
      render(<TaskCard task={baseTask} />);
      const priorityBadge = screen.getByText(/haute/i);
      expect(priorityBadge).toBeInTheDocument();
      expect(priorityBadge).toHaveClass('bg-red-100', 'text-red-800');
    });

    it('affiche le badge de statut avec la bonne classe', () => {
      render(<TaskCard task={baseTask} />);
      const statusBadge = screen.getByText(/à faire/i);
      expect(statusBadge).toBeInTheDocument();
      expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-800');
    });

    it('affiche la date d\'échéance', () => {
      render(<TaskCard task={baseTask} />);
      expect(screen.getByText(/15 avril 2024/i)).toBeInTheDocument();
    });

    it('affiche l\'utilisateur assigné', () => {
      render(<TaskCard task={baseTask} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Variations des badges', () => {
    it('affiche le badge de priorité moyenne avec les bonnes classes', () => {
      render(<TaskCard task={{ ...baseTask, priority: 'medium' }} />);
      const priorityBadge = screen.getByText(/moyenne/i);
      expect(priorityBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('affiche le badge de priorité basse avec les bonnes classes', () => {
      render(<TaskCard task={{ ...baseTask, priority: 'low' }} />);
      const priorityBadge = screen.getByText(/basse/i);
      expect(priorityBadge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('affiche le badge de statut en cours avec les bonnes classes', () => {
      render(<TaskCard task={{ ...baseTask, status: 'in_progress' }} />);
      const statusBadge = screen.getByText(/en cours/i);
      expect(statusBadge).toHaveClass('bg-blue-100', 'text-blue-800');
    });

    it('affiche le badge de statut terminé avec les bonnes classes', () => {
      render(<TaskCard task={{ ...baseTask, status: 'done' }} />);
      const statusBadge = screen.getByText(/terminé/i);
      expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');
    });
  });
}); 