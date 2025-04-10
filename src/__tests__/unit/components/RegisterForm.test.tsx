import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { RegisterForm } from '../RegisterForm'
import { mockSupabaseClient, resetSupabaseMocks } from '@/test/mocks/supabase'

describe('RegisterForm', () => {
  const consoleSpy = vi.spyOn(console, 'error')
  
  beforeEach(() => {
    resetSupabaseMocks()
    consoleSpy.mockReset()
  })

  it('devrait afficher le formulaire d\'inscription', () => {
    render(<RegisterForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument()
  })

  it('devrait créer un compte avec succès', async () => {
    mockSupabaseClient.auth.signUp.mockResolvedValue({
      data: { user: { id: '123', email: 'test@test.com' } },
      error: null
    })

    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' }
    })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }))

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123'
      })
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait afficher une erreur si les mots de passe ne correspondent pas', async () => {
    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' }
    })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'differentpassword' }
    })

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }))

    await waitFor(() => {
      expect(screen.getByText(/les mots de passe ne correspondent pas/i)).toBeInTheDocument()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait afficher une erreur en cas d\'échec d\'inscription', async () => {
    const mockError = new Error('Email already exists')
    mockSupabaseClient.auth.signUp.mockResolvedValue({
      data: { user: null },
      error: mockError
    })

    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@test.com' }
    })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }))

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait valider les champs requis', async () => {
    render(<RegisterForm />)

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }))

    await waitFor(() => {
      expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument()
      expect(screen.getByText(/le mot de passe est requis/i)).toBeInTheDocument()
      expect(screen.getByText(/la confirmation du mot de passe est requise/i)).toBeInTheDocument()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait désactiver le bouton pendant la soumission', async () => {
    mockSupabaseClient.auth.signUp.mockImplementation(() =>
      new Promise(resolve => setTimeout(resolve, 100))
    )

    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' }
    })
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }))

    expect(screen.getByRole('button', { name: /inscription/i })).toBeDisabled()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeEnabled()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })
}) 