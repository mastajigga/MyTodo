import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { InviteMembers } from '../InviteMembers'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

jest.mock('@supabase/supabase-js')
jest.mock('sonner')

const mockWorkspaceId = 'test-workspace-id'
const mockOnClose = jest.fn()

// Helper de test personnalisé
const renderAndSubmitForm = async (email: string) => {
  const utils = render(<InviteMembers workspaceId={mockWorkspaceId} onClose={mockOnClose} />)
  const form = utils.getByTestId('invite-form')
  const input = form.querySelector('input[type="email"]') as HTMLInputElement
  const submitButton = utils.getByTestId('submit-button')

  // Simuler la saisie de l'email
  await act(async () => {
    fireEvent.change(input, { target: { value: email } })
  })

  // Simuler la soumission du formulaire
  await act(async () => {
    fireEvent.submit(form)
  })

  return {
    ...utils,
    submitButton,
    input,
    form
  }
}

// Configuration des mocks Supabase avec des délais contrôlés
const setupSupabaseMocks = (config: {
  existingUser?: boolean,
  shouldFail?: boolean,
  delay?: number
}) => {
  const mockError = new Error('Test error')
  
  return {
    auth: {
      getUser: jest.fn(),
      signInWithOtp: jest.fn().mockImplementation(() =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (config.shouldFail) {
              reject(mockError)
            } else {
              resolve({ error: null })
            }
          }, config.delay || 0)
        })
      )
    },
    from: jest.fn().mockImplementation((table) => ({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockImplementation(() =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                if (config.shouldFail) {
                  reject(mockError)
                } else {
                  resolve({
                    data: config.existingUser ? { id: '123', email: 'test@example.com' } : null,
                    error: null
                  })
                }
              }, config.delay || 0)
            })
          )
        })
      }),
      insert: jest.fn().mockImplementation(() =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (config.shouldFail) {
              reject(mockError)
            } else {
              resolve({ data: { id: '456' }, error: null })
            }
          }, config.delay || 0)
        })
      )
    }))
  }
}

describe('InviteMembers', () => {
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('affiche le formulaire d\'invitation', () => {
    render(<InviteMembers workspaceId={mockWorkspaceId} onClose={mockOnClose} />)
    expect(screen.getByText('Inviter des membres')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email du membre à inviter')).toBeInTheDocument()
    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('invite un utilisateur existant avec succès', async () => {
    const mockSupabase = setupSupabaseMocks({ existingUser: true, delay: 100 })
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const { submitButton } = await renderAndSubmitForm('test@example.com')

    // Vérifier que le bouton est désactivé pendant l'envoi
    expect(submitButton).toBeDisabled()

    // Attendre la fin du processus
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    }, { timeout: 1000 })

    expect(toast.success).toHaveBeenCalledWith('Invitation envoyée avec succès !')
    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('envoie une invitation par email pour un nouvel utilisateur', async () => {
    const mockSupabase = setupSupabaseMocks({ existingUser: false, delay: 100 })
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const { submitButton } = await renderAndSubmitForm('new@example.com')

    // Vérifier que le bouton est désactivé pendant l'envoi
    expect(submitButton).toBeDisabled()

    // Attendre la fin du processus
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    }, { timeout: 1000 })

    expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith('Invitation envoyée avec succès !')
    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('gère les erreurs lors de l\'invitation', async () => {
    const mockSupabase = setupSupabaseMocks({ shouldFail: true, delay: 100 })
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const { submitButton } = await renderAndSubmitForm('test@example.com')

    // Vérifier que le bouton est désactivé pendant l'envoi
    expect(submitButton).toBeDisabled()

    // Attendre la fin du processus et la gestion de l'erreur
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
      expect(toast.error).toHaveBeenCalledWith('Erreur lors de l\'envoi de l\'invitation')
      expect(consoleSpy).toHaveBeenCalledWith('Test error')
    }, { timeout: 1000 })
  })

  it('maintient le bouton désactivé pendant l\'envoi', async () => {
    const mockSupabase = setupSupabaseMocks({ delay: 500 })
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)

    const { submitButton } = await renderAndSubmitForm('test@example.com')

    // Vérifier que le bouton reste désactivé pendant le délai
    expect(submitButton).toBeDisabled()
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    }, { timeout: 250 })

    expect(consoleSpy).not.toHaveBeenCalled()
  })
}) 