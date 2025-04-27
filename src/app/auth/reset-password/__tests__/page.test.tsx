import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import ResetPasswordPage from '../page'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

// Mock des modules
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockUpdateUser = vi.fn()

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: {
      updateUser: mockUpdateUser,
    },
  }),
}))

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('affiche le formulaire de réinitialisation de mot de passe', () => {
    render(<ResetPasswordPage />)
    expect(screen.getByLabelText(/nouveau mot de passe/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /réinitialiser/i })).toBeInTheDocument()
  })

  it('met à jour les champs de mot de passe', () => {
    render(<ResetPasswordPage />)
    const passwordInput = screen.getByLabelText(/nouveau mot de passe/i)
    const confirmInput = screen.getByLabelText(/confirmer le mot de passe/i)

    fireEvent.change(passwordInput, { target: { value: 'newPassword123!' } })
    fireEvent.change(confirmInput, { target: { value: 'newPassword123!' } })

    expect(passwordInput.getAttribute('value')).toBe('newPassword123!')
    expect(confirmInput.getAttribute('value')).toBe('newPassword123!')
  })

  it('réinitialise le mot de passe avec succès', async () => {
    mockUpdateUser.mockResolvedValueOnce({
      data: { user: { id: '123' } },
      error: null,
    })

    render(<ResetPasswordPage />)
    const passwordInput = screen.getByLabelText(/nouveau mot de passe/i)
    const confirmInput = screen.getByLabelText(/confirmer le mot de passe/i)
    const submitButton = screen.getByRole('button', { name: /réinitialiser/i })

    fireEvent.change(passwordInput, { target: { value: 'newPassword123!' } })
    fireEvent.change(confirmInput, { target: { value: 'newPassword123!' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        password: 'newPassword123!',
      })
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('mot de passe réinitialisé'))
    })
  })

  it('désactive le bouton pendant la réinitialisation', async () => {
    mockUpdateUser.mockImplementationOnce(() => new Promise(() => {}))

    render(<ResetPasswordPage />)
    const passwordInput = screen.getByLabelText(/nouveau mot de passe/i)
    const confirmInput = screen.getByLabelText(/confirmer le mot de passe/i)
    const submitButton = screen.getByRole('button', { name: /réinitialiser/i })

    fireEvent.change(passwordInput, { target: { value: 'newPassword123!' } })
    fireEvent.change(confirmInput, { target: { value: 'newPassword123!' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent(/en cours/i)
    })
  })

  it('affiche une erreur si les mots de passe ne correspondent pas', async () => {
    render(<ResetPasswordPage />)
    const passwordInput = screen.getByLabelText(/nouveau mot de passe/i)
    const confirmInput = screen.getByLabelText(/confirmer le mot de passe/i)
    const submitButton = screen.getByRole('button', { name: /réinitialiser/i })

    fireEvent.change(passwordInput, { target: { value: 'password1' } })
    fireEvent.change(confirmInput, { target: { value: 'password2' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('correspondent pas'))
    })
  })

  it('affiche une erreur si le mot de passe est trop court', async () => {
    render(<ResetPasswordPage />)
    const passwordInput = screen.getByLabelText(/nouveau mot de passe/i)
    const confirmInput = screen.getByLabelText(/confirmer le mot de passe/i)
    const submitButton = screen.getByRole('button', { name: /réinitialiser/i })

    fireEvent.change(passwordInput, { target: { value: 'short' } })
    fireEvent.change(confirmInput, { target: { value: 'short' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('8 caractères'))
    })
  })

  it('affiche les erreurs de l\'API', async () => {
    const errorMessage = 'Erreur de réinitialisation'
    mockUpdateUser.mockResolvedValueOnce({
      data: null,
      error: { message: errorMessage },
    })

    render(<ResetPasswordPage />)
    const passwordInput = screen.getByLabelText(/nouveau mot de passe/i)
    const confirmInput = screen.getByLabelText(/confirmer le mot de passe/i)
    const submitButton = screen.getByRole('button', { name: /réinitialiser/i })

    fireEvent.change(passwordInput, { target: { value: 'newPassword123!' } })
    fireEvent.change(confirmInput, { target: { value: 'newPassword123!' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage))
    })
  })
}) 