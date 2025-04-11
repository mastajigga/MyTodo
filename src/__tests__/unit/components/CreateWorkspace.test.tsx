import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateWorkspace } from '../CreateWorkspace'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

// Mock des dépendances
jest.mock('@/lib/supabase/client')
jest.mock('sonner')

describe('CreateWorkspace', () => {
  const mockOnClose = jest.fn()
  const mockOnSuccess = jest.fn()
  const mockSupabase = {
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn()
  }

  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } }
    })
    mockSupabase.from.mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn()
    })
    // Espionner console.error avant chaque test
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restaurer console.error après chaque test
    consoleSpy.mockRestore()
  })

  it('affiche le formulaire de création', () => {
    render(<CreateWorkspace onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    expect(screen.getByText('Créer un espace de travail')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nom de l\'espace de travail')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Description (optionnelle)')).toBeInTheDocument()
    expect(screen.getByText('Professionnel')).toBeInTheDocument()
    expect(screen.getByText('Famille')).toBeInTheDocument()
    expect(screen.getByText('Privé')).toBeInTheDocument()
  })

  it('permet de créer un workspace avec succès', async () => {
    const mockWorkspace = {
      id: 'test-workspace-id',
      name: 'Test Workspace',
      description: 'Test Description',
      type: 'professional'
    }

    mockSupabase.from.mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockWorkspace })
    })

    render(<CreateWorkspace onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    fireEvent.change(screen.getByPlaceholderText('Nom de l\'espace de travail'), {
      target: { value: 'Test Workspace' }
    })
    fireEvent.change(screen.getByPlaceholderText('Description (optionnelle)'), {
      target: { value: 'Test Description' }
    })
    fireEvent.click(screen.getByText('Créer'))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Espace de travail créé avec succès !')
      expect(mockOnSuccess).toHaveBeenCalledWith('test-workspace-id')
      expect(mockOnClose).toHaveBeenCalled()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('affiche une erreur en cas d\'échec de création', async () => {
    const testError = new Error('Test error')
    mockSupabase.from.mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockRejectedValue(testError)
    })

    render(<CreateWorkspace onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    fireEvent.change(screen.getByPlaceholderText('Nom de l\'espace de travail'), {
      target: { value: 'Test Workspace' }
    })
    fireEvent.click(screen.getByText('Créer'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erreur lors de la création de l\'espace de travail')
      expect(mockOnSuccess).not.toHaveBeenCalled()
      expect(mockOnClose).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(testError)
    })
  })

  it('désactive le bouton pendant la création', async () => {
    mockSupabase.from.mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockImplementation(() => new Promise(() => {})) // Promise qui ne se résout jamais
    })

    render(<CreateWorkspace onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    const createButton = screen.getByText('Créer')
    fireEvent.change(screen.getByPlaceholderText('Nom de l\'espace de travail'), {
      target: { value: 'Test Workspace' }
    })
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(createButton).toBeDisabled()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })
}) 