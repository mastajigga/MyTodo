import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import ForgotPasswordPage from '../page'
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

const mockResetPasswordForEmail = vi.fn()

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: {
      resetPasswordForEmail: mockResetPasswordForEmail,
    },
  }),
}))

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('affiche le formulaire de réinitialisation de mot de passe', () => {
    render(<ForgotPasswordPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /réinitialiser/i })).toBeInTheDocument()
  })

  it('met à jour le champ email', () => {
    render(<ForgotPasswordPage />)
    const emailInput = screen.getByLabelText(/email/i)

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(emailInput.getAttribute('value')).toBe('test@example.com')
  })

  it('envoie un email de réinitialisation avec succès', async () => {
    mockResetPasswordForEmail.mockResolvedValueOnce({
      data: {},
      error: null,
    })

    render(<ForgotPasswordPage />)
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /réinitialiser/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockResetPasswordForEmail).toHaveBeenCalledWith('test@example.com', {
        redirectTo: expect.stringContaining('/auth/reset-password'),
      })
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('email de réinitialisation'))
    })
  })

  it('désactive le bouton pendant l\'envoi', async () => {
    mockResetPasswordForEmail.mockImplementationOnce(() => new Promise(() => {}))

    render(<ForgotPasswordPage />)
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /réinitialiser/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent(/en cours/i)
    })
  })

  it('affiche les erreurs', async () => {
    const errorMessage = 'Email invalide'
    mockResetPasswordForEmail.mockResolvedValueOnce({
      data: null,
      error: { message: errorMessage },
    })

    render(<ForgotPasswordPage />)
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /réinitialiser/i })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage))
    })
  })
}) 