import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';
import { Task, KanbanColumn, DEFAULT_KANBAN_COLUMNS, TaskStatus } from '@/types/task';
import { taskService } from '@/lib/services/taskService';
import { KanbanColumn as Column } from './KanbanColumn';
import { KanbanHeader } from './KanbanHeader';
import { useCreateTaskDialog } from '@/hooks/useCreateTaskDialog';
import { toast } from 'sonner';

type KanbanBoardProps = {
  projectId?: string;
};

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(DEFAULT_KANBAN_COLUMNS as KanbanColumn[]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || 'all');
  const { openCreateTaskDialog } = useCreateTaskDialog();

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const tasks = await taskService.getTasks(projectId || selectedProjectId);
      const updatedColumns = DEFAULT_KANBAN_COLUMNS.map((column) => ({
        ...column,
        id: column.id as TaskStatus,
        tasks: tasks.filter((task) => task.status === column.id).map(task => ({
          ...task,
          title: (projectId || selectedProjectId) === 'all' ? `[${task.project?.name || 'Sans projet'}] ${task.title}` : task.title
        }))
      })) as KanbanColumn[];
      setColumns(updatedColumns);
    } catch (error) {
      toast.error('Impossible de charger les tâches');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, selectedProjectId]);

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

  const handleAddTask = useCallback(() => {
    openCreateTaskDialog({
      projectId: (projectId || selectedProjectId) === 'all' ? undefined : (projectId || selectedProjectId),
      onSuccess: () => {
        fetchTasks();
      },
    });
  }, [projectId, selectedProjectId, openCreateTaskDialog]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Chargement du tableau...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <KanbanHeader
        selectedProjectId={projectId || selectedProjectId}
        onProjectChange={setSelectedProjectId}
        onAddTask={handleAddTask}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <Column column={column} provided={provided} />
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
} 