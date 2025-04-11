import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TaskLists } from '../TaskLists'
import { useTaskList } from '@/lib/hooks/useTaskList'

// Mock du hook useTaskList
jest.mock('@/lib/hooks/useTaskList', () => ({
  useTaskList: jest.fn(),
}))

const mockTaskLists = [
  {
    id: '1',
    name: 'Liste 1',
    description: 'Description 1',
    workspace_id: 'workspace-1',
    created_by: 'user-1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    position: 0,
  },
  {
    id: '2',
    name: 'Liste 2',
    description: 'Description 2',
    workspace_id: 'workspace-1',
    created_by: 'user-1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    position: 1,
  },
]

describe('TaskLists', () => {
  beforeEach(() => {
    // Reset des mocks
    jest.clearAllMocks()

    // Configuration du mock par défaut
    ;(useTaskList as jest.Mock).mockReturnValue({
      loading: false,
      getTaskLists: jest.fn().mockResolvedValue(mockTaskLists),
      createTaskList: jest.fn().mockResolvedValue(mockTaskLists[0]),
      updateTaskList: jest.fn().mockResolvedValue(mockTaskLists[0]),
      deleteTaskList: jest.fn().mockResolvedValue(true),
      reorderTaskLists: jest.fn().mockResolvedValue(true),
    })
  })

  it('affiche un état de chargement', () => {
    ;(useTaskList as jest.Mock).mockReturnValue({
      loading: true,
      getTaskLists: jest.fn().mockResolvedValue([]),
      createTaskList: jest.fn(),
      updateTaskList: jest.fn(),
      deleteTaskList: jest.fn(),
      reorderTaskLists: jest.fn(),
    })

    render(<TaskLists workspaceId="workspace-1" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('affiche la liste des tâches', async () => {
    render(<TaskLists workspaceId="workspace-1" />)

    await waitFor(() => {
      expect(screen.getByText('Liste 1')).toBeInTheDocument()
      expect(screen.getByText('Liste 2')).toBeInTheDocument()
      expect(screen.getByText('Description 1')).toBeInTheDocument()
      expect(screen.getByText('Description 2')).toBeInTheDocument()
    })
  })

  it('permet de créer une nouvelle liste', async () => {
    const createTaskList = jest.fn().mockResolvedValue(mockTaskLists[0])
    ;(useTaskList as jest.Mock).mockReturnValue({
      loading: false,
      getTaskLists: jest.fn().mockResolvedValue(mockTaskLists),
      createTaskList,
      updateTaskList: jest.fn(),
      deleteTaskList: jest.fn(),
      reorderTaskLists: jest.fn(),
    })

    render(<TaskLists workspaceId="workspace-1" />)

    // Ouvre le dialogue de création
    fireEvent.click(screen.getByText('Nouvelle liste'))

    // Remplit le formulaire
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Nouvelle liste' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Description de la nouvelle liste' },
    })

    // Soumet le formulaire
    fireEvent.click(screen.getByText('Créer'))

    await waitFor(() => {
      expect(createTaskList).toHaveBeenCalledWith({
        name: 'Nouvelle liste',
        description: 'Description de la nouvelle liste',
        workspace_id: 'workspace-1',
        position: 2,
      })
    })
  })

  it('permet de modifier une liste', async () => {
    const updateTaskList = jest.fn().mockResolvedValue({
      ...mockTaskLists[0],
      name: 'Liste modifiée',
      description: 'Description modifiée',
    })
    ;(useTaskList as jest.Mock).mockReturnValue({
      loading: false,
      getTaskLists: jest.fn().mockResolvedValue(mockTaskLists),
      createTaskList: jest.fn(),
      updateTaskList,
      deleteTaskList: jest.fn(),
      reorderTaskLists: jest.fn(),
    })

    render(<TaskLists workspaceId="workspace-1" />)

    // Ouvre le menu d'actions
    const buttons = await screen.findAllByRole('button', { name: /more vertical/i })
    fireEvent.click(buttons[0])

    // Clique sur modifier
    fireEvent.click(screen.getByText('Modifier'))

    // Modifie les champs
    fireEvent.change(screen.getByDisplayValue('Liste 1'), {
      target: { value: 'Liste modifiée' },
    })
    fireEvent.change(screen.getByDisplayValue('Description 1'), {
      target: { value: 'Description modifiée' },
    })

    // Enregistre les modifications
    fireEvent.click(screen.getByText('Enregistrer'))

    await waitFor(() => {
      expect(updateTaskList).toHaveBeenCalledWith('1', {
        name: 'Liste modifiée',
        description: 'Description modifiée',
      })
    })
  })

  it('permet de supprimer une liste', async () => {
    const deleteTaskList = jest.fn().mockResolvedValue(true)
    ;(useTaskList as jest.Mock).mockReturnValue({
      loading: false,
      getTaskLists: jest.fn().mockResolvedValue(mockTaskLists),
      createTaskList: jest.fn(),
      updateTaskList: jest.fn(),
      deleteTaskList,
      reorderTaskLists: jest.fn(),
    })

    render(<TaskLists workspaceId="workspace-1" />)

    // Ouvre le menu d'actions
    const buttons = await screen.findAllByRole('button', { name: /more vertical/i })
    fireEvent.click(buttons[0])

    // Clique sur supprimer
    fireEvent.click(screen.getByText('Supprimer'))

    await waitFor(() => {
      expect(deleteTaskList).toHaveBeenCalledWith('1')
    })
  })
}) 