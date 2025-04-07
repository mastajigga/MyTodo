import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { CreateTask } from '../CreateTask'
import { useAuth } from '@/lib/auth/useAuth'
import { createClient } from '@supabase/supabase-js'

// Mock du hook d'authentification
vi.mock('@/lib/auth/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id', email: 'test@test.com' }
  }))
}))

// Mock du client Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(),
      select: vi.fn()
    }))
  }))
}))

describe('CreateTask', () => {
  const mockProjectId = 'test-project-id'
  const mockSupabase = createClient('mock-url', 'mock-key')
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait afficher le formulaire de création de tâche', () => {
    render(<CreateTask projectId={mockProjectId} />)
    
    expect(screen.getByLabelText(/titre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/priorité/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date d'échéance/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument()
  })

  it('devrait créer une tâche avec succès', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: [{
        id: 'new-task-id',
        title: 'Nouvelle tâche',
        description: 'Description de la tâche',
        priority: 'medium',
        due_date: '2024-12-31'
      }],
      error: null
    })

    mockSupabase.from().insert = mockInsert

    render(<CreateTask projectId={mockProjectId} />)

    fireEvent.change(screen.getByLabelText(/titre/i), {
      target: { value: 'Nouvelle tâche' }
    })
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Description de la tâche' }
    })
    fireEvent.change(screen.getByLabelText(/priorité/i), {
      target: { value: 'medium' }
    })
    fireEvent.change(screen.getByLabelText(/date d'échéance/i), {
      target: { value: '2024-12-31' }
    })

    fireEvent.click(screen.getByRole('button', { name: /créer/i }))

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        project_id: mockProjectId,
        title: 'Nouvelle tâche',
        description: 'Description de la tâche',
        priority: 'medium',
        due_date: '2024-12-31',
        status: 'todo',
        created_by: 'test-user-id'
      })
    })
  })

  it('devrait afficher une erreur en cas d\'échec de création', async () => {
    const mockError = new Error('Erreur de création')
    mockSupabase.from().insert = vi.fn().mockResolvedValue({
      data: null,
      error: mockError
    })

    render(<CreateTask projectId={mockProjectId} />)

    fireEvent.change(screen.getByLabelText(/titre/i), {
      target: { value: 'Nouvelle tâche' }
    })
    fireEvent.click(screen.getByRole('button', { name: /créer/i }))

    await waitFor(() => {
      expect(screen.getByText(/erreur de création/i)).toBeInTheDocument()
    })
  })

  it('devrait valider les champs requis', async () => {
    render(<CreateTask projectId={mockProjectId} />)

    fireEvent.click(screen.getByRole('button', { name: /créer/i }))

    await waitFor(() => {
      expect(screen.getByText(/le titre est requis/i)).toBeInTheDocument()
    })
  })

  it('devrait réinitialiser le formulaire après une création réussie', async () => {
    mockSupabase.from().insert = vi.fn().mockResolvedValue({
      data: [{ id: 'new-task-id' }],
      error: null
    })

    render(<CreateTask projectId={mockProjectId} />)

    fireEvent.change(screen.getByLabelText(/titre/i), {
      target: { value: 'Nouvelle tâche' }
    })
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Description' }
    })

    fireEvent.click(screen.getByRole('button', { name: /créer/i }))

    await waitFor(() => {
      expect(screen.getByLabelText(/titre/i)).toHaveValue('')
      expect(screen.getByLabelText(/description/i)).toHaveValue('')
    })
  })
}) 