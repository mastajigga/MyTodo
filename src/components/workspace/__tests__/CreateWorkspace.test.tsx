import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CreateWorkspace } from '../CreateWorkspace';
import { vi } from 'vitest';
import type { WorkspaceType } from '@/types/supabase';
import { useWorkspace } from '@/hooks/useWorkspace';

// Mock des dépendances
vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspace: vi.fn(),
}));

describe('CreateWorkspace', () => {
  const mockCreateWorkspace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useWorkspace as any).mockReturnValue({
      createWorkspace: mockCreateWorkspace,
    });
  });

  it('devrait rendre tous les champs du formulaire', () => {
    render(<CreateWorkspace />);

    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument();
  });

  it('devrait afficher une erreur si le nom est vide', async () => {
    render(<CreateWorkspace />);
    
    const submitButton = screen.getByRole('button', { name: /créer/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Le nom est requis')).toBeInTheDocument();
    });
  });

  it('devrait soumettre le formulaire avec succès', async () => {
    const mockWorkspace = {
      name: 'Mon espace',
      description: 'Description de l\'espace',
      type: 'private' as WorkspaceType,
    };

    mockCreateWorkspace.mockResolvedValueOnce(mockWorkspace);

    render(<CreateWorkspace />);

    // Remplir le formulaire
    await userEvent.type(screen.getByLabelText(/nom/i), mockWorkspace.name);
    await userEvent.type(screen.getByLabelText(/description/i), mockWorkspace.description);
    
    // Sélectionner le type
    const typeSelect = screen.getByRole('combobox');
    await userEvent.click(typeSelect);
    await userEvent.click(screen.getByText('Privé'));

    // Soumettre le formulaire
    const submitButton = screen.getByRole('button', { name: /créer/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateWorkspace).toHaveBeenCalledWith(mockWorkspace);
    });
  });

  it('devrait gérer les erreurs lors de la création', async () => {
    const error = new Error('Erreur de création');
    mockCreateWorkspace.mockRejectedValueOnce(error);

    render(<CreateWorkspace />);

    // Remplir et soumettre le formulaire
    await userEvent.type(screen.getByLabelText(/nom/i), 'Mon espace');
    
    // Sélectionner le type
    const typeSelect = screen.getByRole('combobox');
    await userEvent.click(typeSelect);
    await userEvent.click(screen.getByText('Privé'));
    
    const submitButton = screen.getByRole('button', { name: /créer/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Erreur lors de la création:', error);
    });
  });

  it('devrait avoir les bons types d\'espace disponibles', async () => {
    render(<CreateWorkspace />);

    const typeSelect = screen.getByRole('combobox');
    await userEvent.click(typeSelect);

    expect(screen.getByText('Famille')).toBeInTheDocument();
    expect(screen.getByText('Professionnel')).toBeInTheDocument();
    expect(screen.getByText('Privé')).toBeInTheDocument();
  });

  it('devrait réinitialiser le formulaire après une création réussie', async () => {
    mockCreateWorkspace.mockResolvedValueOnce({});
    
    render(<CreateWorkspace />);

    // Remplir le formulaire
    const nameInput = screen.getByLabelText(/nom/i);
    await userEvent.type(nameInput, 'Mon espace');
    
    // Sélectionner le type
    const typeSelect = screen.getByRole('combobox');
    await userEvent.click(typeSelect);
    await userEvent.click(screen.getByText('Privé'));
    
    // Soumettre le formulaire
    const submitButton = screen.getByRole('button', { name: /créer/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(typeSelect).toHaveTextContent('Sélectionnez un type');
    });
  });
}); 