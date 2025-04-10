import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DashboardSkeleton } from '../DashboardSkeleton';

describe('DashboardSkeleton', () => {
  it('devrait rendre tous les éléments du squelette', () => {
    const { container } = render(<DashboardSkeleton />);
    
    // En-tête
    expect(container.querySelector('.h-16.w-16.rounded-full')).toBeInTheDocument();
    expect(container.querySelector('.h-8.w-48')).toBeInTheDocument();
    expect(container.querySelector('.h-4.w-72')).toBeInTheDocument();
    
    // Cartes de statistiques
    const statCards = container.querySelectorAll('.h-10.w-10.rounded-lg');
    expect(statCards).toHaveLength(3);
    
    // Activités récentes
    const activityItems = container.querySelectorAll('.space-y-4 > div');
    expect(activityItems).toHaveLength(5);
  });

  it('devrait avoir la structure correcte', () => {
    const { container } = render(<DashboardSkeleton />);
    
    expect(container.querySelector('.space-y-8')).toBeInTheDocument();
    expect(container.querySelector('.grid')).toBeInTheDocument();
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('devrait avoir les bonnes classes Tailwind', () => {
    const { container } = render(<DashboardSkeleton />);
    
    expect(container.querySelector('.mb-8')).toBeInTheDocument();
    expect(container.querySelector('.p-6')).toBeInTheDocument();
    expect(container.querySelector('.gap-6')).toBeInTheDocument();
  });
}); 