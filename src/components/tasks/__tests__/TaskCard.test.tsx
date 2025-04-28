import { render, screen } from '@testing-library/react';
import { TaskCard } from '../TaskCard';
import type { Task } from '@/types/task';

describe('TaskCard', () => {
  const baseTask: Task = {
    id: '1',
    title: 'Tâche test',
    description: 'Description de test',
    status: 'todo',
    priority: 'medium',
    due_date: undefined,
    start_time: '2024-06-01T10:00:00.000Z',
    estimated_time: 60,
    created_at: '2024-06-01T09:00:00.000Z',
    updated_at: '2024-06-01T09:00:00.000Z',
    user_id: 'user1',
    project_id: 'project1',
    project: { id: 'project1', name: 'Projet Test' },
    assigned_user: {
      id: 'user1',
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      avatar_url: '',
    },
  };

  it('affiche le badge de priorité', () => {
    render(<TaskCard task={{ ...baseTask, priority: 'high' }} />);
    expect(screen.getByLabelText(/priorité/i)).toHaveTextContent(/haute/i);
  });

  it('affiche le badge urgent en rouge', () => {
    render(<TaskCard task={{ ...baseTask, priority: 'urgent' }} />);
    const badge = screen.getByLabelText(/priorité/i);
    expect(badge).toHaveTextContent(/urgente/i);
    expect(badge.className).toMatch(/red/);
  });

  it('affiche le badge Décalée si la tâche est auto-décalée', () => {
    render(<TaskCard task={{ ...baseTask, estimated_time: 30, start_time: '2024-06-01T11:00:00.000Z' }} />);
    expect(screen.getByLabelText(/décalée/i)).toBeInTheDocument();
  });

  it('affiche le start_time et le estimated_time', () => {
    render(<TaskCard task={baseTask} />);
    expect(screen.getByText(/débute/i)).toBeInTheDocument();
    expect(screen.getByText(/durée estimée/i)).toBeInTheDocument();
  });

  it('a un aria-label sur la carte', () => {
    render(<TaskCard task={baseTask} />);
    expect(screen.getByLabelText(/ouvrir la tâche/i)).toBeInTheDocument();
  });

  it("affiche les informations de l'utilisateur assigné", () => {
    render(<TaskCard task={baseTask} />);
    screen.debug();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  describe('Gestion des priorités', () => {
    const priorityTranslations = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute',
      urgent: 'Urgente',
    };
    const PRIORITY_COLORS = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    (['low', 'medium', 'high', 'urgent'] as const).forEach(priority => {
      it(`affiche correctement la priorité ${priority}` , () => {
        render(<TaskCard task={{ ...baseTask, priority }} />);
        const priorityBadge = screen.getByText(priorityTranslations[priority]);
        expect(priorityBadge).toBeInTheDocument();
        expect(priorityBadge.className).toContain(PRIORITY_COLORS[priority]);
      });
    });
  });
}); 