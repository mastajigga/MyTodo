import { useState, useEffect } from 'react'
import { useTaskList, TaskList } from '@/lib/hooks/useTaskList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, MoreVertical, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

type TaskListsProps = {
  workspaceId: string
}

export function TaskLists({ workspaceId }: TaskListsProps) {
  const { loading, getTaskLists, createTaskList, updateTaskList, deleteTaskList, reorderTaskLists } = useTaskList()
  const [taskLists, setTaskLists] = useState<TaskList[]>([])
  const [newListName, setNewListName] = useState('')
  const [newListDescription, setNewListDescription] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingList, setEditingList] = useState<TaskList | null>(null)

  useEffect(() => {
    loadTaskLists()
  }, [workspaceId])

  const loadTaskLists = async () => {
    const lists = await getTaskLists(workspaceId)
    setTaskLists(lists)
  }

  const handleCreateList = async () => {
    if (!newListName.trim()) return

    const newList = await createTaskList({
      name: newListName,
      description: newListDescription || undefined,
      workspace_id: workspaceId,
      position: taskLists.length,
    })

    if (newList) {
      setTaskLists([...taskLists, newList])
      setNewListName('')
      setNewListDescription('')
      setIsCreateDialogOpen(false)
    }
  }

  const handleUpdateList = async () => {
    if (!editingList || !editingList.name.trim()) return

    const updatedList = await updateTaskList(editingList.id, {
      name: editingList.name,
      description: editingList.description || undefined,
    })

    if (updatedList) {
      setTaskLists(taskLists.map(list => 
        list.id === updatedList.id ? updatedList : list
      ))
      setEditingList(null)
    }
  }

  const handleDeleteList = async (id: string) => {
    const success = await deleteTaskList(id)
    if (success) {
      setTaskLists(taskLists.filter(list => list.id !== id))
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(taskLists)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTaskLists(items)
    await reorderTaskLists(workspaceId, items.map(item => item.id))
  }

  if (loading && taskLists.length === 0) {
    return (
      <div className="flex items-center justify-center h-64" role="status">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Listes</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle liste
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle liste</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nom
                </label>
                <Input
                  id="name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Nom de la liste"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Description de la liste"
                />
              </div>
              <Button onClick={handleCreateList} disabled={!newListName.trim()}>
                Créer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="lists">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {taskLists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          {editingList?.id === list.id ? (
                            <div className="space-y-2">
                              <Input
                                value={editingList.name}
                                onChange={(e) =>
                                  setEditingList({
                                    ...editingList,
                                    name: e.target.value,
                                  })
                                }
                              />
                              <Textarea
                                value={editingList.description || ''}
                                onChange={(e) =>
                                  setEditingList({
                                    ...editingList,
                                    description: e.target.value || null,
                                  })
                                }
                              />
                              <div className="flex space-x-2">
                                <Button onClick={handleUpdateList}>
                                  Enregistrer
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingList(null)}
                                >
                                  Annuler
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h3 className="text-lg font-semibold">{list.name}</h3>
                              {list.description && (
                                <p className="text-gray-500 dark:text-gray-400 mt-1">
                                  {list.description}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setEditingList(list)}
                            >
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={() => handleDeleteList(list.id)}
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
} 