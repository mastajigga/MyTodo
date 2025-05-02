import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { createClient } from '@supabase/supabase-js';
import { mockSupabaseClient } from './mocks/supabase';

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabaseClient,
}));

describe('Authentication Tests', () => {
  describe('LoginForm', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      render(<LoginForm />);
    });

    it('should render login form correctly', () => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
    });

    it('should show validation errors for empty fields', async () => {
      const submitButton = screen.getByRole('button', { name: /connexion/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
        expect(screen.getByText(/le mot de passe est requis/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /connexion/i });

      fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/format d'email invalide/i)).toBeInTheDocument();
      });
    });

    it('should handle successful login', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: { id: '1', email: 'test@example.com' } },
        error: null,
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /connexion/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should handle login error', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid credentials' },
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /connexion/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/identifiants invalides/i)).toBeInTheDocument();
      });
    });
  });

  describe('RegisterForm', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      render(<RegisterForm />);
    });

    it('should render register form correctly', () => {
      expect(screen.getByLabelText(/nom complet/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /inscription/i })).toBeInTheDocument();
    });

    it('should show validation errors for empty fields', async () => {
      const submitButton = screen.getByRole('button', { name: /inscription/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/le nom est requis/i)).toBeInTheDocument();
        expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
        expect(screen.getByText(/le mot de passe est requis/i)).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /inscription/i });

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/les mots de passe ne correspondent pas/i)).toBeInTheDocument();
      });
    });

    it('should handle successful registration', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
        data: { user: { id: '1', email: 'test@example.com' } },
        error: null,
      });

      const nameInput = screen.getByLabelText(/nom complet/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /inscription/i });

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          options: {
            data: {
              full_name: 'Test User',
            },
          },
        });
      });
    });

    it('should handle registration error', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Email already registered' },
      });

      const nameInput = screen.getByLabelText(/nom complet/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /inscription/i });

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email déjà enregistré/i)).toBeInTheDocument();
      });
    });
  });
}); 