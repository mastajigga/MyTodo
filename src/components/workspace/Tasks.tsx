import { useState, useEffect } from 'react'
import { useTask, Task } from '@/lib/hooks/useTask'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, MoreVertical, Loader2, Calendar } from 'lucide-react'
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
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type TasksProps = {
  listId: string
  workspaceId: string
}

export function Tasks({ listId, workspaceId }: TasksProps) {
  const { loading, getTasks, createTask, updateTask, deleteTask, reorderTasks } = useTask()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    loadTasks()
  }, [listId])

  const loadTasks = async () => {
    const fetchedTasks = await getTasks(listId)
    setTasks(fetchedTasks)
  }

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return

    const newTask = await createTask({
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      due_date: newTaskDueDate || undefined,
      list_id: listId,
      workspace_id: workspaceId,
      position: tasks.length,
      completed: false,
    })

    if (newTask) {
      setTasks([...tasks, newTask])
      setNewTaskTitle('')
      setNewTaskDescription('')
      setNewTaskDueDate('')
      setIsCreateDialogOpen(false)
    }
  }

  const handleUpdateTask = async () => {
    if (!editingTask || !editingTask.title.trim()) return

    const updatedTask = await updateTask(editingTask.id, {
      title: editingTask.title,
      description: editingTask.description || undefined,
      due_date: editingTask.due_date || undefined,
      completed: editingTask.completed,
    })

    if (updatedTask) {
      setTasks(tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ))
      setEditingTask(null)
    }
  }

  const handleDeleteTask = async (id: string) => {
    const success = await deleteTask(id)
    if (success) {
      setTasks(tasks.filter(task => task.id !== id))
    }
  }

  const handleToggleComplete = async (task: Task) => {
    const updatedTask = await updateTask(task.id, {
      ...task,
      completed: !task.completed,
    })

    if (updatedTask) {
      setTasks(tasks.map(t => 
        t.id === updatedTask.id ? updatedTask : t
      ))
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTasks(items)
    await reorderTasks(listId, items.map(item => item.id))
  }

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-32" role="status">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tâches</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle tâche
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle tâche</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Titre
                </label>
                <Input
                  id="title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Titre de la tâche"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Description de la tâche"
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                  Date d'échéance
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateTask} disabled={!newTaskTitle.trim()}>
                Créer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn(
                        "bg-white dark:bg-gray-800 p-3 rounded-lg shadow flex items-start gap-3",
                        task.completed && "opacity-60"
                      )}
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task)}
                      />
                      <div className="flex-1 min-w-0">
                        {editingTask?.id === task.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editingTask.title}
                              onChange={(e) =>
                                setEditingTask({
                                  ...editingTask,
                                  title: e.target.value,
                                })
                              }
                            />
                            <Textarea
                              value={editingTask.description || ''}
                              onChange={(e) =>
                                setEditingTask({
                                  ...editingTask,
                                  description: e.target.value || null,
                                })
                              }
                            />
                            <Input
                              type="date"
                              value={editingTask.due_date || ''}
                              onChange={(e) =>
                                setEditingTask({
                                  ...editingTask,
                                  due_date: e.target.value || null,
                                })
                              }
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={handleUpdateTask}>
                                Enregistrer
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingTask(null)}
                              >
                                Annuler
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className={cn(
                              "font-medium truncate",
                              task.completed && "line-through"
                            )}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            {task.due_date && (
                              <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(new Date(task.due_date), 'PPP', { locale: fr })}
                                </span>
                              </div>
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
                            onClick={() => setEditingTask(task)}
                          >
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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