import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardStats } from '../DashboardStats';

describe('DashboardStats', () => {
  const mockStats = {
    total: 10,
    completed: 5,
    inProgress: 3,
    pending: 2,
  };

  it('devrait afficher tous les compteurs', () => {
    render(<DashboardStats stats={mockStats} />);
    
    expect(screen.getByText('Total des tâches')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    
    expect(screen.getByText('Tâches terminées')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    expect(screen.getByText('Tâches en attente')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('devrait gérer les valeurs nulles', () => {
    const emptyStats = {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
    };
    
    render(<DashboardStats stats={emptyStats} />);
    
    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(3);
  });

  it('devrait avoir les bonnes icônes', () => {
    const { container } = render(<DashboardStats stats={mockStats} />);
    
    expect(container.querySelector('.lucide-clipboard-list')).toBeInTheDocument();
    expect(container.querySelector('.lucide-check-circle-2')).toBeInTheDocument();
    expect(container.querySelector('.lucide-clock')).toBeInTheDocument();
  });
}); 