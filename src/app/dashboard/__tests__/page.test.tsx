import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import DashboardPage from '../page';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

// Mock des dépendances
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createServerComponentClient: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('DashboardPage', () => {
  const mockUser = {
    id: 'test-user-id',
    full_name: 'Test User',
    email: 'test@example.com',
  };

  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      status: 'completed',
      updated_at: '2024-03-20T10:00:00Z',
      user_id: 'test-user-id',
    },
    {
      id: '2',
      title: 'Task 2',
      status: 'in-progress',
      updated_at: '2024-03-20T09:00:00Z',
      user_id: 'test-user-id',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    const mockSupabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { user: mockUser } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockUser,
          error: null,
        }),
      }),
    };
    (createServerComponentClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);
  });

  it('devrait rediriger vers la page de connexion si non authentifié', async () => {
    const mockSupabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
      },
    };
    (createServerComponentClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    await DashboardPage();
    expect(redirect).toHaveBeenCalledWith('/auth/signin');
  });

  it('devrait afficher les informations du tableau de bord', async () => {
    const mockSupabase = {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { user: mockUser } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockUser,
          error: null,
        }),
      }),
    };
    (createServerComponentClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    const { container } = await render(await DashboardPage());

    expect(screen.getByText(`Bienvenue, ${mockUser.full_name}`)).toBeInTheDocument();
    expect(container.querySelector('.dashboard-stats')).toBeInTheDocument();
    expect(container.querySelector('.recent-activity')).toBeInTheDocument();
  });

  it('devrait afficher le squelette de chargement', async () => {
    const { container } = await render(
      <Suspense fallback={<DashboardSkeleton />}>
        {await DashboardPage()}
      </Suspense>
    );

    expect(container.querySelector('.skeleton')).toBeInTheDocument();
  });
}); 