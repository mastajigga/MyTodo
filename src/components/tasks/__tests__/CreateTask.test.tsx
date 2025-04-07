import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { CreateTask } from '../CreateTask'
import { mockSupabaseClient, resetSupabaseMocks } from '@/test/mocks/supabase'

vi.mock('@/lib/auth/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}))

describe('CreateTask', () => {
  const projectId = 'test-project-id'
  const consoleSpy = vi.spyOn(console, 'error')
  
  beforeEach(() => {
    resetSupabaseMocks()
    consoleSpy.mockReset()
  })

  it('devrait afficher le formulaire de création de tâche', () => {
    render(<CreateTask projectId={projectId} />)
    
    expect(screen.getByLabelText(/titre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/priorité/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date d'échéance/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument()
  })

  it('devrait créer une tâche avec succès', async () => {
    mockSupabaseClient.from('tasks').insert.mockResolvedValue({ error: null })

    render(<CreateTask projectId={projectId} />)

    fireEvent.change(screen.getByLabelText(/titre/i), {
      target: { value: 'Nouvelle tâche' }
    })
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Description de la tâche' }
    })
    fireEvent.change(screen.getByLabelText(/priorité/i), {
      target: { value: 'high' }
    })
    fireEvent.change(screen.getByLabelText(/date d'échéance/i), {
      target: { value: '2024-12-31' }
    })

    fireEvent.click(screen.getByRole('button', { name: /créer/i }))

    await waitFor(() => {
      expect(mockSupabaseClient.from('tasks').insert).toHaveBeenCalledWith({
        project_id: projectId,
        title: 'Nouvelle tâche',
        description: 'Description de la tâche',
        priority: 'high',
        due_date: '2024-12-31',
        status: 'todo',
        created_by: 'test-user-id'
      })
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait afficher une erreur en cas d\'échec de création', async () => {
    const mockError = new Error('Failed to create task')
    mockSupabaseClient.from('tasks').insert.mockResolvedValue({ error: mockError })

    render(<CreateTask projectId={projectId} />)

    fireEvent.change(screen.getByLabelText(/titre/i), {
      target: { value: 'Nouvelle tâche' }
    })

    fireEvent.click(screen.getByRole('button', { name: /créer/i }))

    await waitFor(() => {
      expect(screen.getByText(/failed to create task/i)).toBeInTheDocument()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait valider les champs requis', async () => {
    render(<CreateTask projectId={projectId} />)

    fireEvent.click(screen.getByRole('button', { name: /créer/i }))

    await waitFor(() => {
      expect(screen.getByText(/le titre est requis/i)).toBeInTheDocument()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait désactiver le bouton pendant la soumission', async () => {
    mockSupabaseClient.from('tasks').insert.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
    )

    render(<CreateTask projectId={projectId} />)

    fireEvent.change(screen.getByLabelText(/titre/i), {
      target: { value: 'Nouvelle tâche' }
    })

    fireEvent.click(screen.getByRole('button', { name: /créer/i }))

    expect(screen.getByRole('button', { name: /création/i })).toBeDisabled()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /créer/i })).toBeEnabled()
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('devrait réinitialiser le formulaire après une création réussie', async () => {
    mockSupabaseClient.from('tasks').insert.mockResolvedValue({ error: null })

    render(<CreateTask projectId={projectId} />)

    fireEvent.change(screen.getByLabelText(/titre/i), {
      target: { value: 'Nouvelle tâche' }
    })
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Description de la tâche' }
    })

    fireEvent.click(screen.getByRole('button', { name: /créer/i }))

    await waitFor(() => {
      expect(screen.getByLabelText(/titre/i)).toHaveValue('')
      expect(screen.getByLabelText(/description/i)).toHaveValue('')
    })

    expect(consoleSpy).not.toHaveBeenCalled()
  })
}) 