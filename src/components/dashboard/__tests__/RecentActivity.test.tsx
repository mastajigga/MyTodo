import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecentActivity } from '../RecentActivity';

describe('RecentActivity', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'completed' as const,
      priority: 'high' as const,
      user_id: 'user-1',
      created_at: '2024-03-20T10:00:00Z',
      updated_at: '2024-03-20T11:00:00Z',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'in-progress' as const,
      priority: 'medium' as const,
      user_id: 'user-1',
      created_at: '2024-03-20T09:00:00Z',
      updated_at: '2024-03-20T10:30:00Z',
    },
  ];

  it('devrait afficher la liste des activités récentes', () => {
    render(<RecentActivity tasks={mockTasks} />);
    
    expect(screen.getByText('Activité récente')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('devrait afficher le message approprié pour les tâches terminées', () => {
    render(<RecentActivity tasks={mockTasks} />);
    
    expect(screen.getByText(/Terminée le/)).toBeInTheDocument();
    expect(screen.getByText(/20 mars 2024/)).toBeInTheDocument();
  });

  it('devrait afficher le message approprié pour les tâches en cours', () => {
    render(<RecentActivity tasks={mockTasks} />);
    
    expect(screen.getByText(/Mise à jour le/)).toBeInTheDocument();
  });

  it('devrait afficher un message quand il n\'y a pas d\'activités', () => {
    render(<RecentActivity tasks={[]} />);
    
    expect(screen.getByText('Aucune activité récente')).toBeInTheDocument();
  });

  it('devrait afficher les bonnes icônes selon le statut', () => {
    const { container } = render(<RecentActivity tasks={mockTasks} />);
    
    expect(container.querySelector('.text-green-500')).toBeInTheDocument(); // Pour les tâches terminées
    expect(container.querySelector('.text-blue-500')).toBeInTheDocument(); // Pour les tâches en cours
  });
}); 