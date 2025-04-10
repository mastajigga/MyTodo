import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { TaskTags } from '../TaskTags'
import { useTaskTag } from '@/lib/hooks/useTaskTag'

// Mock du hook useTaskTag
vi.mock('@/lib/hooks/useTaskTag', () => ({
  useTaskTag: vi.fn(),
}))

const mockTags = [
  {
    id: '1',
    name: 'Important',
    color: '#ef4444',
    workspace_id: 'workspace-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'En cours',
    color: '#3b82f6',
    workspace_id: 'workspace-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

describe('TaskTags', () => {
  const mockGetTaskTags = vi.fn().mockResolvedValue(mockTags)
  const mockGetTaskTagsByTaskId = vi.fn().mockResolvedValue(mockTags)
  const mockCreateTaskTag = vi.fn()
  const mockDeleteTaskTag = vi.fn()
  const mockAssignTagToTask = vi.fn()
  const mockRemoveTagFromTask = vi.fn()
  const mockOnTagsChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useTaskTag as jest.Mock).mockReturnValue({
      loading: false,
      getTaskTags: mockGetTaskTags,
      getTaskTagsByTaskId: mockGetTaskTagsByTaskId,
      createTaskTag: mockCreateTaskTag,
      deleteTaskTag: mockDeleteTaskTag,
      assignTagToTask: mockAssignTagToTask,
      removeTagFromTask: mockRemoveTagFromTask,
    })
  })

  it('affiche les étiquettes du workspace', async () => {
    render(<TaskTags workspaceId="workspace-1" onTagsChange={mockOnTagsChange} />)

    await waitFor(() => {
      expect(mockGetTaskTags).toHaveBeenCalledWith('workspace-1')
    })

    expect(screen.getByText('Important')).toBeInTheDocument()
    expect(screen.getByText('En cours')).toBeInTheDocument()
  })

  it('affiche les étiquettes d\'une tâche', async () => {
    render(
      <TaskTags
        workspaceId="workspace-1"
        taskId="task-1"
        onTagsChange={mockOnTagsChange}
      />
    )

    await waitFor(() => {
      expect(mockGetTaskTagsByTaskId).toHaveBeenCalledWith('task-1')
    })

    expect(screen.getByText('Important')).toBeInTheDocument()
    expect(screen.getByText('En cours')).toBeInTheDocument()
  })

  it('permet de créer une nouvelle étiquette', async () => {
    const newTag = {
      id: '3',
      name: 'Nouvelle étiquette',
      color: '#10b981',
      workspace_id: 'workspace-1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }
    mockCreateTaskTag.mockResolvedValueOnce(newTag)

    render(<TaskTags workspaceId="workspace-1" onTagsChange={mockOnTagsChange} />)

    // Ouvrir le popover
    fireEvent.click(screen.getByText('Ajouter une étiquette'))

    // Remplir le formulaire
    fireEvent.change(screen.getByPlaceholderText('Nouvelle étiquette...'), {
      target: { value: 'Nouvelle étiquette' },
    })
    fireEvent.change(screen.getByLabelText('Couleur'), {
      target: { value: '#10b981' },
    })

    // Soumettre le formulaire
    fireEvent.click(screen.getByText('Créer l\'étiquette'))

    await waitFor(() => {
      expect(mockCreateTaskTag).toHaveBeenCalledWith({
        name: 'Nouvelle étiquette',
        color: '#10b981',
        workspace_id: 'workspace-1',
      })
    })
  })

  it('permet de supprimer une étiquette', async () => {
    mockDeleteTaskTag.mockResolvedValueOnce(true)

    render(<TaskTags workspaceId="workspace-1" onTagsChange={mockOnTagsChange} />)

    // Attendre que les étiquettes soient chargées
    await waitFor(() => {
      expect(screen.getByText('Important')).toBeInTheDocument()
    })

    // Cliquer sur le bouton de suppression de la première étiquette
    const removeButtons = screen.getAllByRole('button')
    fireEvent.click(removeButtons[0])

    await waitFor(() => {
      expect(mockDeleteTaskTag).toHaveBeenCalledWith('1')
    })
  })

  it('permet d\'assigner une étiquette à une tâche', async () => {
    mockAssignTagToTask.mockResolvedValueOnce(true)

    render(
      <TaskTags
        workspaceId="workspace-1"
        taskId="task-1"
        onTagsChange={mockOnTagsChange}
      />
    )

    // Attendre que les étiquettes soient chargées
    await waitFor(() => {
      expect(screen.getByText('Important')).toBeInTheDocument()
    })

    // Cliquer sur une étiquette pour l'assigner
    fireEvent.click(screen.getByText('Important'))

    await waitFor(() => {
      expect(mockAssignTagToTask).toHaveBeenCalledWith('task-1', '1')
    })
  })

  it('permet de retirer une étiquette d\'une tâche', async () => {
    mockRemoveTagFromTask.mockResolvedValueOnce(true)

    render(
      <TaskTags
        workspaceId="workspace-1"
        taskId="task-1"
        onTagsChange={mockOnTagsChange}
      />
    )

    // Attendre que les étiquettes soient chargées
    await waitFor(() => {
      expect(screen.getByText('Important')).toBeInTheDocument()
    })

    // Cliquer sur le bouton de suppression de la première étiquette
    const removeButtons = screen.getAllByRole('button')
    fireEvent.click(removeButtons[0])

    await waitFor(() => {
      expect(mockRemoveTagFromTask).toHaveBeenCalledWith('task-1', '1')
    })
  })
}) 