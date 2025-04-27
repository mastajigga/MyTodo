import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CreateProjectButton } from '../CreateProjectButton';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock des dépendances
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockSupabaseClient = {
  rpc: vi.fn().mockResolvedValue({
    data: { id: 'test-project-id' },
    error: null,
  }),
  supabaseUrl: 'https://test.supabase.co',
  supabaseKey: 'test-key',
  realtimeUrl: 'https://test.supabase.co/realtime/v1',
  authUrl: 'https://test.supabase.co/auth/v1',
  storageUrl: 'https://test.supabase.co/storage/v1',
  functionsUrl: 'https://test.supabase.co/functions/v1',
  auth: {
    onAuthStateChange: vi.fn(),
    getSession: vi.fn(),
    getUser: vi.fn(),
    signOut: vi.fn(),
  },
  realtime: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    removeAllChannels: vi.fn(),
  },
  channel: () => ({ subscribe: vi.fn() }),
  removeChannel: vi.fn(),
  removeAllChannels: vi.fn(),
  getChannels: vi.fn(),
  rest: {},
  schema: 'public',
  from: vi.fn(),
  storage: { from: vi.fn() },
  functions: { invoke: vi.fn() },
  queryBuilder: vi.fn(),
  headers: {},
} as any; // Utilisation temporaire de 'any' pour éviter les erreurs de typage complexes

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn(() => mockSupabaseClient),
}));

describe('CreateProjectButton', () => {
  let queryClient: QueryClient;
  const workspaceId = 'test-workspace-id';

  beforeEach(() => {
    queryClient = new QueryClient();
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <CreateProjectButton workspaceId={workspaceId} />
      </QueryClientProvider>
    );
  };

  it('devrait afficher le bouton de création', () => {
    renderComponent();
    expect(screen.getByText(/Nouveau projet/i)).toBeInTheDocument();
  });

  it('devrait ouvrir la boîte de dialogue lors du clic sur le bouton', async () => {
    renderComponent();
    const button = screen.getByText(/Nouveau projet/i);
    await fireEvent.click(button);
    
    expect(screen.getByText('Créer un nouveau projet')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom du projet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  it('devrait créer un projet avec succès', async () => {
    renderComponent();
    const button = screen.getByText(/Nouveau projet/i);
    await fireEvent.click(button);

    const nameInput = screen.getByLabelText(/Nom du projet/i);
    const descriptionInput = screen.getByLabelText(/Description/i);

    await fireEvent.change(nameInput, { target: { value: 'Mon projet test' } });
    await fireEvent.change(descriptionInput, { target: { value: 'Description test' } });

    const submitButton = screen.getByRole('button', { name: /Créer le projet/i });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Projet créé avec succès');
    });
  });

  it('devrait gérer les erreurs lors de la création', async () => {
    const errorMockClient = {
      ...mockSupabaseClient,
      rpc: vi.fn().mockResolvedValueOnce({
        data: null,
        error: new Error('Erreur test'),
      }),
    };

    vi.mocked(createClientComponentClient).mockImplementationOnce(() => errorMockClient);

    renderComponent();
    const button = screen.getByText(/Nouveau projet/i);
    await fireEvent.click(button);

    const nameInput = screen.getByLabelText(/Nom du projet/i);
    await fireEvent.change(nameInput, { target: { value: 'Mon projet test' } });

    const submitButton = screen.getByRole('button', { name: /Créer le projet/i });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('devrait désactiver le bouton de soumission pendant le chargement', async () => {
    renderComponent();
    const button = screen.getByText(/Nouveau projet/i);
    await fireEvent.click(button);

    const submitButton = screen.getByRole('button', { name: /Créer le projet/i });
    await fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Création...');
  });

  it('devrait valider les champs requis', async () => {
    renderComponent();
    const button = screen.getByText(/Nouveau projet/i);
    await fireEvent.click(button);

    const submitButton = screen.getByRole('button', { name: /Créer le projet/i });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Le nom du projet est requis')).toBeInTheDocument();
    });
  });
}); 