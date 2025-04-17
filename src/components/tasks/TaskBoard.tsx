'use client';

import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';
import { Task, KanbanColumn, DEFAULT_KANBAN_COLUMNS, TaskStatus } from '@/types/task';
import { taskService } from '@/lib/services/taskService';
import { KanbanColumn as Column } from './KanbanColumn';
import { toast } from 'sonner';

interface TaskBoardProps {
  projectId: string;
}

export function TaskBoard({ projectId }: TaskBoardProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(DEFAULT_KANBAN_COLUMNS as KanbanColumn[]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const tasks = await taskService.getTasks(projectId);
      const updatedColumns = DEFAULT_KANBAN_COLUMNS.map((column) => ({
        ...column,
        id: column.id as TaskStatus,
        tasks: tasks.filter((task) => task.status === column.id)
      })) as KanbanColumn[];
      setColumns(updatedColumns);
    } catch (error) {
      toast.error('Impossible de charger les tâches');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // Copie des colonnes actuelles
    const newColumns = [...columns];
    
    // Trouve la tâche à déplacer
    const sourceColumn = newColumns.find((col) => col.id === source.droppableId);
    const destColumn = newColumns.find((col) => col.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return;
    
    // Déplace la tâche
    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
    destColumn.tasks.splice(destination.index, 0, movedTask);
    
    setColumns(newColumns);
    
    try {
      // Met à jour le statut de la tâche dans la base de données
      await taskService.updateTaskStatus(movedTask.id, destination.droppableId as TaskStatus);
      toast.success('Statut de la tâche mis à jour');
    } catch (error) {
      toast.error('Impossible de mettre à jour la tâche');
      fetchTasks(); // Recharge l'état initial en cas d'erreur
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 min-h-[calc(100vh-12rem)] transition-all duration-200">
        {columns.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <Column 
                column={column} 
                provided={provided} 
              />
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
} 