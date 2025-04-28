import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CreateWorkspaceButton } from '../CreateWorkspaceButton';
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

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } }, error: null })),
    },
    rpc: vi.fn(() => ({
      data: { id: 'test-workspace-id' },
      error: null,
    })),
  })),
}));

describe('CreateWorkspaceButton', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <CreateWorkspaceButton />
      </QueryClientProvider>
    );
  };

  it('devrait afficher le bouton de création', () => {
    renderComponent();
    expect(screen.getByText(/Nouvel espace/i)).toBeInTheDocument();
  });

  it('devrait ouvrir la boîte de dialogue lors du clic sur le bouton', async () => {
    renderComponent();
    const button = screen.getByText(/Nouvel espace/i);
    await fireEvent.click(button);
    
    expect(screen.getByText('Créer un nouvel espace de travail')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom de l'espace/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type d'espace/i)).toBeInTheDocument();
  });

  it('devrait créer un espace de travail avec succès', async () => {
    renderComponent();
    const button = screen.getByText(/Nouvel espace/i);
    await fireEvent.click(button);

    const nameInput = screen.getByLabelText(/Nom de l'espace/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const typeSelect = screen.getByLabelText(/Type d'espace/i);

    await fireEvent.change(nameInput, { target: { value: 'Mon espace test' } });
    await fireEvent.change(descriptionInput, { target: { value: 'Description test' } });
    await fireEvent.click(typeSelect);
    await fireEvent.click(screen.getByText('Personnel'));

    const submitButton = screen.getByRole('button', { name: /Créer l'espace/i });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Espace de travail créé avec succès');
    });
  });

  it('devrait gérer les erreurs lors de la création', async () => {
    const supabase = createClientComponentClient();
    vi.mocked(supabase.rpc).mockImplementationOnce(() => ({
      data: null,
      error: new Error('Erreur test'),
    }));

    renderComponent();
    const button = screen.getByText(/Nouvel espace/i);
    await fireEvent.click(button);

    const nameInput = screen.getByLabelText(/Nom de l'espace/i);
    await fireEvent.change(nameInput, { target: { value: 'Mon espace test' } });

    const submitButton = screen.getByRole('button', { name: /Créer l'espace/i });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('devrait désactiver le bouton de soumission pendant le chargement', async () => {
    renderComponent();
    const button = screen.getByText(/Nouvel espace/i);
    await fireEvent.click(button);

    const submitButton = screen.getByRole('button', { name: /Créer l'espace/i });
    await fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Création...');
  });
}); 