import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Tasks } from '../Tasks'
import { useTask } from '@/lib/hooks/useTask'
import { vi } from 'vitest'

// Mock du hook useTask
vi.mock('@/lib/hooks/useTask', () => ({
  useTask: vi.fn(),
}))

// Données de test
const mockTasks = [
  {
    id: '1',
    title: 'Première tâche',
    description: 'Description de la première tâche',
    due_date: '2024-03-20',
    completed: false,
    list_id: 'list-1',
    workspace_id: 'workspace-1',
    position: 0,
    created_at: '2024-03-19T10:00:00Z',
    updated_at: '2024-03-19T10:00:00Z',
  },
  {
    id: '2',
    title: 'Deuxième tâche',
    description: null,
    due_date: null,
    completed: true,
    list_id: 'list-1',
    workspace_id: 'workspace-1',
    position: 1,
    created_at: '2024-03-19T11:00:00Z',
    updated_at: '2024-03-19T11:00:00Z',
  },
]

describe('Tasks', () => {
  const mockGetTasks = vi.fn()
  const mockCreateTask = vi.fn()
  const mockUpdateTask = vi.fn()
  const mockDeleteTask = vi.fn()
  const mockReorderTasks = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Configuration par défaut du mock
    ;(useTask as jest.Mock).mockReturnValue({
      loading: false,
      getTasks: mockGetTasks.mockResolvedValue(mockTasks),
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
      reorderTasks: mockReorderTasks,
    })
  })

  it('affiche un état de chargement', () => {
    ;(useTask as jest.Mock).mockReturnValue({
      loading: true,
      getTasks: mockGetTasks.mockResolvedValue([]),
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
      reorderTasks: mockReorderTasks,
    })

    render(<Tasks listId="list-1" workspaceId="workspace-1" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('affiche la liste des tâches', async () => {
    render(<Tasks listId="list-1" workspaceId="workspace-1" />)

    await waitFor(() => {
      expect(screen.getByText('Première tâche')).toBeInTheDocument()
      expect(screen.getByText('Description de la première tâche')).toBeInTheDocument()
      expect(screen.getByText('Deuxième tâche')).toBeInTheDocument()
    })
  })

  it('permet de créer une nouvelle tâche', async () => {
    const newTask = {
      id: '3',
      title: 'Nouvelle tâche',
      description: 'Description de la nouvelle tâche',
      due_date: '2024-03-21',
      completed: false,
      list_id: 'list-1',
      workspace_id: 'workspace-1',
      position: 2,
      created_at: '2024-03-19T12:00:00Z',
      updated_at: '2024-03-19T12:00:00Z',
    }

    mockCreateTask.mockResolvedValueOnce(newTask)

    render(<Tasks listId="list-1" workspaceId="workspace-1" />)

    // Ouvre le dialogue de création
    fireEvent.click(screen.getByText('Nouvelle tâche'))

    // Remplit le formulaire
    fireEvent.change(screen.getByLabelText('Titre'), {
      target: { value: 'Nouvelle tâche' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Description de la nouvelle tâche' },
    })
    fireEvent.change(screen.getByLabelText("Date d'échéance"), {
      target: { value: '2024-03-21' },
    })

    // Soumet le formulaire
    fireEvent.click(screen.getByText('Créer'))

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: 'Nouvelle tâche',
        description: 'Description de la nouvelle tâche',
        due_date: '2024-03-21',
        list_id: 'list-1',
        workspace_id: 'workspace-1',
        position: 2,
        completed: false,
      })
    })
  })

  it('permet de modifier une tâche existante', async () => {
    const updatedTask = {
      ...mockTasks[0],
      title: 'Tâche modifiée',
      description: 'Description modifiée',
    }

    mockUpdateTask.mockResolvedValueOnce(updatedTask)

    render(<Tasks listId="list-1" workspaceId="workspace-1" />)

    // Ouvre le menu d'actions
    const taskElement = await screen.findByText('Première tâche')
    const menuButton = taskElement.parentElement?.parentElement?.querySelector('button')
    fireEvent.click(menuButton as HTMLElement)

    // Clique sur "Modifier"
    fireEvent.click(screen.getByText('Modifier'))

    // Modifie les champs
    fireEvent.change(screen.getByDisplayValue('Première tâche'), {
      target: { value: 'Tâche modifiée' },
    })
    fireEvent.change(screen.getByDisplayValue('Description de la première tâche'), {
      target: { value: 'Description modifiée' },
    })

    // Enregistre les modifications
    fireEvent.click(screen.getByText('Enregistrer'))

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith('1', {
        title: 'Tâche modifiée',
        description: 'Description modifiée',
        due_date: '2024-03-20',
        completed: false,
      })
    })
  })

  it('permet de supprimer une tâche', async () => {
    mockDeleteTask.mockResolvedValueOnce(true)

    render(<Tasks listId="list-1" workspaceId="workspace-1" />)

    // Ouvre le menu d'actions
    const taskElement = await screen.findByText('Première tâche')
    const menuButton = taskElement.parentElement?.parentElement?.querySelector('button')
    fireEvent.click(menuButton as HTMLElement)

    // Clique sur "Supprimer"
    fireEvent.click(screen.getByText('Supprimer'))

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith('1')
    })
  })

  it('permet de marquer une tâche comme terminée', async () => {
    const completedTask = {
      ...mockTasks[0],
      completed: true,
    }

    mockUpdateTask.mockResolvedValueOnce(completedTask)

    render(<Tasks listId="list-1" workspaceId="workspace-1" />)

    // Trouve la case à cocher de la première tâche
    const checkbox = (await screen.findByText('Première tâche'))
      .parentElement
      ?.parentElement
      ?.querySelector('input[type="checkbox"]')

    // Coche la case
    fireEvent.click(checkbox as HTMLElement)

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith('1', {
        title: 'Première tâche',
        description: 'Description de la première tâche',
        due_date: '2024-03-20',
        completed: true,
      })
    })
  })
}) 