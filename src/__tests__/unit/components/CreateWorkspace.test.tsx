import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateWorkspace } from '@/components/workspace/CreateWorkspace'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mockSupabaseClient } from '@/test/mocks'
import { toast } from 'sonner'
import { useWorkspace } from '@/hooks/useWorkspace'

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspace: () => ({
    createWorkspace: vi.fn().mockResolvedValue({ id: 'test-workspace-id' }),
    workspace: null,
    setWorkspace: vi.fn()
  })
}))
vi.mock('sonner')

// Types de workspace disponibles
type WorkspaceType = 'private' | 'professional' | 'family'

describe('CreateWorkspace', () => {
  let consoleSpy: any
  let createWorkspaceSpy: any

  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    createWorkspaceSpy = vi.fn().mockResolvedValue({ id: 'test-workspace-id' })
    vi.mocked(useWorkspace).mockReturnValue({
      createWorkspace: createWorkspaceSpy,
      workspace: null,
      setWorkspace: vi.fn()
    })
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('affiche le formulaire de création', () => {
    render(<CreateWorkspace />)
    
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /type/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument()
  })

  describe('Tests des types de workspace', () => {
    const workspaceTypes: WorkspaceType[] = ['private', 'professional', 'family']
    
    workspaceTypes.forEach(type => {
      it(`crée un workspace de type ${type} avec succès`, async () => {
        render(<CreateWorkspace />)

        fireEvent.change(screen.getByLabelText(/nom/i), {
          target: { value: `Test ${type} Workspace` }
        })
        fireEvent.change(screen.getByLabelText(/description/i), {
          target: { value: `Test ${type} Description` }
        })
        
        const typeSelect = screen.getByRole('combobox', { name: /type/i })
        fireEvent.click(typeSelect)
        fireEvent.click(screen.getByText(type))

        fireEvent.click(screen.getByRole('button', { name: /créer/i }))

        await waitFor(() => {
          expect(createWorkspaceSpy).toHaveBeenCalledWith({
            name: `Test ${type} Workspace`,
            description: `Test ${type} Description`,
            type: type
          })
        })
      })

      it(`valide les champs requis pour le type ${type}`, async () => {
        render(<CreateWorkspace />)

        const typeSelect = screen.getByRole('combobox', { name: /type/i })
        fireEvent.click(typeSelect)
        fireEvent.click(screen.getByText(type))

        fireEvent.click(screen.getByRole('button', { name: /créer/i }))

        await waitFor(() => {
          expect(screen.getByText(/le nom est requis/i)).toBeInTheDocument()
        })
      })
    })
  })

  it('affiche une erreur en cas d\'échec de création', async () => {
    const testError = new Error('Test error')
    createWorkspaceSpy.mockRejectedValue(testError)

    render(<CreateWorkspace />)

    fireEvent.change(screen.getByLabelText(/nom/i), {
      target: { value: 'Test Workspace' }
    })
    
    const typeSelect = screen.getByRole('combobox', { name: /type/i })
    fireEvent.click(typeSelect)
    fireEvent.click(screen.getByText('private'))

    fireEvent.click(screen.getByRole('button', { name: /créer/i }))

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Erreur lors de la création:', testError)
    })
  })

  it('désactive le bouton pendant la création', async () => {
    let resolvePromise: (value: unknown) => void
    const createPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    createWorkspaceSpy.mockImplementation(() => createPromise)

    render(<CreateWorkspace />)

    fireEvent.change(screen.getByLabelText(/nom/i), {
      target: { value: 'Test Workspace' }
    })
    
    const typeSelect = screen.getByRole('combobox', { name: /type/i })
    fireEvent.click(typeSelect)
    fireEvent.click(screen.getByText('private'))

    fireEvent.click(screen.getByRole('button', { name: /créer/i }))

    expect(screen.getByRole('button', { name: /création/i })).toBeDisabled()

    resolvePromise!({ id: 'test-workspace-id' })
  })
}) 