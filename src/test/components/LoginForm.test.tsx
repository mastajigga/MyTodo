import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../../components/auth/LoginForm';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import '../setup';

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher tous les champs requis', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
  });

  it('devrait afficher les erreurs de validation', async () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /connexion/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/le mot de passe est requis/i)).toBeInTheDocument();
    });
  });

  it('devrait gérer la soumission du formulaire', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /connexion/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/l'email est requis/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/le mot de passe est requis/i)).not.toBeInTheDocument();
    });
  });
}); 