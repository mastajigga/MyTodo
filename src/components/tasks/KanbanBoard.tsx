'use client';

import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';
import { Task, KanbanColumn, DEFAULT_KANBAN_COLUMNS, TaskStatus } from '@/types/task';
import { taskService } from '@/lib/services/taskService';
import { KanbanColumn as Column } from './KanbanColumn';
import { KanbanHeader } from './KanbanHeader';
import { useCreateTaskDialog } from '@/hooks/useCreateTaskDialog';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type KanbanBoardProps = {
  projectId?: string;
};

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(DEFAULT_KANBAN_COLUMNS as KanbanColumn[]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || 'all');
  const [selectedColumnId, setSelectedColumnId] = useState<TaskStatus>('todo');
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
    
    const newColumns = [...columns];
    const sourceColumn = newColumns.find((col) => col.id === source.droppableId);
    const destColumn = newColumns.find((col) => col.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return;
    
    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
    destColumn.tasks.splice(destination.index, 0, movedTask);
    
    setColumns(newColumns);
    
    try {
      await taskService.updateTaskStatus(movedTask.id, destination.droppableId as TaskStatus);
      toast.success('Statut de la tâche mis à jour');
      // Mettre à jour la colonne sélectionnée si la tâche a été déplacée vers une autre colonne
      if (source.droppableId !== destination.droppableId) {
        setSelectedColumnId(destination.droppableId as TaskStatus);
      }
    } catch (error) {
      toast.error('Impossible de mettre à jour la tâche');
      fetchTasks();
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
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Chargement du tableau...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <KanbanHeader
        selectedProjectId={projectId || selectedProjectId}
        onProjectChange={setSelectedProjectId}
        onAddTask={handleAddTask}
      />

      {/* Sélecteur de colonne pour mobile */}
      <div className="block md:hidden">
        <Select value={selectedColumnId} onValueChange={(value) => setSelectedColumnId(value as TaskStatus)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner une colonne" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column.id} value={column.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{column.title}</span>
                  <span className="ml-2 text-xs bg-muted px-2 py-1 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Vue mobile : une seule colonne à la fois */}
        <div className="block md:hidden">
          <AnimatePresence mode="wait">
            {columns.map((column) => (
              column.id === selectedColumnId && (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-muted/50 rounded-lg p-2"
                >
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <Column column={column} provided={provided} />
                    )}
                  </Droppable>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Vue desktop : toutes les colonnes */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div className="bg-muted/50 rounded-lg p-2">
                  <Column column={column} provided={provided} />
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
} 