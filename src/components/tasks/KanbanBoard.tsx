import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';
import { Task, KanbanColumn, DEFAULT_KANBAN_COLUMNS, TaskStatus } from '@/types/task';
import { TaskService } from '@/services/task.service';
import { KanbanColumn as Column } from './KanbanColumn';
import { toast } from 'sonner';

interface KanbanBoardProps {
  projectId: string;
}

export const KanbanBoard = ({ projectId }: KanbanBoardProps) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(DEFAULT_KANBAN_COLUMNS);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const tasks = await TaskService.getProjectTasks(projectId);
      const updatedColumns = DEFAULT_KANBAN_COLUMNS.map(column => ({
        ...column,
        tasks: tasks.filter(task => task.status === column.id)
      }));
      setColumns(updatedColumns);
    } catch (error) {
      toast.error('Erreur lors du chargement des tâches', {
        description: 'Impossible de charger les tâches du projet'
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // Si on déplace dans la même colonne
    if (source.droppableId === destination.droppableId) {
      const column = columns.find(col => col.id === source.droppableId);
      if (!column) return;

      const newTasks = Array.from(column.tasks);
      const [moved] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, moved);

      const newColumns = columns.map(col => 
        col.id === source.droppableId ? { ...col, tasks: newTasks } : col
      );

      setColumns(newColumns);
    } else {
      // Si on déplace vers une autre colonne
      const sourceColumn = columns.find(col => col.id === source.droppableId);
      const destColumn = columns.find(col => col.id === destination.droppableId);
      if (!sourceColumn || !destColumn) return;

      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);
      const [moved] = sourceTasks.splice(source.index, 1);

      // Mise à jour du statut de la tâche
      const updatedTask = { ...moved, status: destination.droppableId as TaskStatus };
      destTasks.splice(destination.index, 0, updatedTask);

      const newColumns = columns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      });

      setColumns(newColumns);

      try {
        await TaskService.updateTaskStatus(moved.id, destination.droppableId as TaskStatus);
        toast.success('Tâche mise à jour', {
          description: 'La tâche a été déplacée avec succès'
        });
      } catch (error) {
        toast.error('Erreur lors de la mise à jour', {
          description: 'Impossible de mettre à jour la tâche'
        });
        loadTasks(); // Recharge l'état initial en cas d'erreur
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full overflow-x-auto p-4">
        {columns.map(column => (
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
}; 