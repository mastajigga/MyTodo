"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Clock, Plus, Trash2 } from "lucide-react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { toast } from "sonner"

interface Task {
  id: string
  title: string
  description: string
  dueDate: Date | null
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  estimatedTime: number // en minutes
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: null,
    status: 'todo',
    priority: 'medium',
    estimatedTime: 30
  })
  const [showCalendar, setShowCalendar] = useState(false)
  const [showTimeInput, setShowTimeInput] = useState(false)

  const handleAddTask = () => {
    if (!newTask.title) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      description: newTask.description || '',
      dueDate: newTask.dueDate,
      status: newTask.status as Task['status'],
      priority: newTask.priority as Task['priority'],
      estimatedTime: newTask.estimatedTime || 30
    }

    setTasks([...tasks, task])
    setNewTask({
      title: '',
      description: '',
      dueDate: null,
      status: 'todo',
      priority: 'medium',
      estimatedTime: 30
    })
    toast.success("Tâche ajoutée avec succès")
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    toast.success("Tâche supprimée avec succès")
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    
    // Mettre à jour le statut en fonction de la colonne de destination
    reorderedItem.status = result.destination.droppableId as Task['status']
    
    items.splice(result.destination.index, 0, reorderedItem)
    setTasks(items)
    toast.success("Tâche déplacée avec succès")
  }

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Nouvelle tâche</h2>
        <div className="space-y-4">
          <Input
            placeholder="Titre de la tâche"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <div className="flex gap-2">
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {newTask.dueDate ? format(newTask.dueDate, 'dd/MM/yyyy', { locale: fr }) : 'Date d\'échéance'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newTask.dueDate || undefined}
                  onSelect={(date) => {
                    setNewTask({ ...newTask, dueDate: date })
                    setShowCalendar(false)
                  }}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
            <Popover open={showTimeInput} onOpenChange={setShowTimeInput}>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  {`${Math.floor(newTask.estimatedTime! / 60)}h${newTask.estimatedTime! % 60}m`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-4">
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Heures"
                    value={Math.floor(newTask.estimatedTime! / 60)}
                    onChange={(e) => {
                      const hours = parseInt(e.target.value) || 0
                      const minutes = newTask.estimatedTime! % 60
                      setNewTask({ ...newTask, estimatedTime: hours * 60 + minutes })
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Minutes"
                    value={newTask.estimatedTime! % 60}
                    onChange={(e) => {
                      const hours = Math.floor(newTask.estimatedTime! / 60)
                      const minutes = parseInt(e.target.value) || 0
                      setNewTask({ ...newTask, estimatedTime: hours * 60 + minutes })
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={handleAddTask} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Ajouter la tâche
          </Button>
        </div>
      </Card>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['todo', 'in-progress', 'completed'] as const).map((status) => (
            <div key={status} className="space-y-4">
              <h3 className="font-semibold text-lg">
                {status === 'todo' && 'À faire'}
                {status === 'in-progress' && 'En cours'}
                {status === 'completed' && 'Terminé'}
              </h3>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px]"
                  >
                    {getTasksByStatus(status).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 mb-2"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{task.title}</h4>
                                <p className="text-sm text-gray-500">{task.description}</p>
                                {task.dueDate && (
                                  <p className="text-sm text-gray-500">
                                    Échéance : {format(task.dueDate, 'dd/MM/yyyy', { locale: fr })}
                                  </p>
                                )}
                                <p className="text-sm text-gray-500">
                                  Temps estimé : {Math.floor(task.estimatedTime / 60)}h{task.estimatedTime % 60}m
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
} 