import { describe, it, expect, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { mockSupabaseClient } from '@/test/mocks/supabase';

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabaseClient,
}));

describe('Supabase Data Tests', () => {
  const supabase = createClient('fake-url', 'fake-key');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait pouvoir se connecter et récupérer les tâches', async () => {
    mockSupabaseClient.from.mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            status: 'pending',
            priority: 'medium',
            due_date: '2024-03-20',
          },
        ],
        error: null,
      }),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      order: vi.fn(),
      single: vi.fn(),
    }));

    const { data, error } = await supabase
      .from('tasks')
      .select('*');

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data?.[0]).toHaveProperty('title');
    expect(data?.[0]).toHaveProperty('description');
    expect(data?.[0]).toHaveProperty('status');
    expect(data?.[0]).toHaveProperty('priority');
    expect(data?.[0]).toHaveProperty('due_date');
  });

  it('devrait gérer les erreurs de connexion', async () => {
    mockSupabaseClient.from.mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({
        data: null,
        error: {
          message: 'Database connection error',
        },
      }),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      order: vi.fn(),
      single: vi.fn(),
    }));

    const { data, error } = await supabase
      .from('tasks')
      .select('*');

    expect(error).toBeDefined();
    expect(error?.message).toBe('Database connection error');
    expect(data).toBeNull();
  });

  it('devrait pouvoir filtrer les tâches par statut', async () => {
    mockSupabaseClient.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            title: 'Test Task',
            status: 'completed',
          },
        ],
        error: null,
      }),
      order: vi.fn(),
      single: vi.fn(),
    }));

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'completed');

    expect(error).toBeNull();
    expect(data?.[0].status).toBe('completed');
  });
}); 