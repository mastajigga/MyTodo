import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardHeader } from '../DashboardHeader';

describe('DashboardHeader', () => {
  const mockProfile = {
    id: 'test-user-id',
    full_name: 'Test User',
    email: 'test@example.com',
    avatar_url: 'https://example.com/avatar.jpg',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
  };

  it('devrait afficher le nom de l\'utilisateur', () => {
    render(<DashboardHeader profile={mockProfile} />);
    expect(screen.getByText(`Bienvenue, ${mockProfile.full_name}`)).toBeInTheDocument();
  });

  it('devrait afficher "Utilisateur" si le nom n\'est pas défini', () => {
    const profileWithoutName = { ...mockProfile, full_name: undefined };
    render(<DashboardHeader profile={profileWithoutName} />);
    expect(screen.getByText('Bienvenue, Utilisateur')).toBeInTheDocument();
  });

  it('devrait afficher l\'avatar de l\'utilisateur', () => {
    render(<DashboardHeader profile={mockProfile} />);
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', mockProfile.avatar_url);
    expect(avatar).toHaveAttribute('alt', mockProfile.full_name);
  });

  it('devrait afficher les initiales si l\'avatar n\'est pas disponible', () => {
    const profileWithoutAvatar = { ...mockProfile, avatar_url: undefined };
    render(<DashboardHeader profile={profileWithoutAvatar} />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });
}); 