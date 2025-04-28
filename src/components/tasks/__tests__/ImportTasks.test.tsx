import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ImportTasks } from '../ImportTasks';
import { mockSupabaseClient, mockToast, mockTask } from '../../../test/mocks';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Mock des modules
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: mockToast,
}));

describe('ImportTasks', () => {
  const defaultProps = {
    projectId: '1',
    workspaceId: '1',
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  it('devrait rendre le composant correctement', () => {
    render(<ImportTasks {...defaultProps} />);
    
    expect(screen.getByLabelText(/sélectionner un fichier/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /importer/i })).toBeDisabled();
  });

  it('devrait activer le bouton d\'import quand un fichier est sélectionné', () => {
    render(<ImportTasks {...defaultProps} />);
    
    const input = screen.getByLabelText(/sélectionner un fichier/i);
    const file = new File([JSON.stringify([mockTask])], 'tasks.json', { type: 'application/json' });
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByRole('button', { name: /importer/i })).toBeEnabled();
  });

  it('devrait importer les tâches avec succès', async () => {
    const insertMock = vi.fn().mockResolvedValue({ data: [mockTask], error: null });
    const fromMock = vi.fn().mockReturnValue({ insert: insertMock });
    vi.spyOn(mockSupabaseClient, 'from').mockImplementation(fromMock);

    render(<ImportTasks {...defaultProps} />);
    
    const input = screen.getByLabelText(/sélectionner un fichier/i);
    const file = new File([JSON.stringify([mockTask])], 'tasks.json', { type: 'application/json' });
    
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /importer/i }));

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalledWith([{
        ...mockTask,
        project_id: defaultProps.projectId,
        workspace_id: defaultProps.workspaceId,
      }]);
      expect(mockToast.success).toHaveBeenCalledWith('Tâches importées avec succès');
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('devrait gérer les erreurs lors de l\'import', async () => {
    const error = new Error('Erreur d\'import');
    const insertMock = vi.fn().mockResolvedValue({ data: null, error });
    const fromMock = vi.fn().mockReturnValue({ insert: insertMock });
    vi.spyOn(mockSupabaseClient, 'from').mockImplementation(fromMock);

    render(<ImportTasks {...defaultProps} />);
    
    const input = screen.getByLabelText(/sélectionner un fichier/i);
    const file = new File([JSON.stringify([mockTask])], 'tasks.json', { type: 'application/json' });
    
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /importer/i }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Erreur lors de l\'import des tâches');
      expect(defaultProps.onSuccess).not.toHaveBeenCalled();
    });
  });

  it('devrait gérer les erreurs de format de fichier', async () => {
    render(<ImportTasks {...defaultProps} />);
    
    const input = screen.getByLabelText(/sélectionner un fichier/i);
    const file = new File(['invalid json'], 'tasks.json', { type: 'application/json' });
    
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /importer/i }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Format de fichier invalide');
      expect(defaultProps.onSuccess).not.toHaveBeenCalled();
    });
  });
}); 