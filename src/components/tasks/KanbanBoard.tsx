'use client';

import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task, TaskPriority, TaskStatus } from '@/@types/task';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PRIORITY_COLORS, STATUS_COLUMNS } from '@/lib/constants/task';
import { TASK_PRIORITY_MAP } from '@/types/common';
import { Info } from 'lucide-react';
import { taskService } from '@/services/task.service';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface KanbanBoardProps {
  tasks: Task[];
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  // Regrouper les tâches par statut dans un état local pour le drag & drop
  const [columns, setColumns] = useState<Record<string, Task[]>>({});

  useEffect(() => {
    const grouped = STATUS_COLUMNS.reduce((acc, column) => {
      acc[column.id] = tasks.filter(task => task.status === column.id);
      return acc;
    }, {} as Record<string, Task[]>);
    setColumns(grouped);
  }, [tasks]);

  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (!columns[source.droppableId] || !columns[destination.droppableId]) return;

    // Copier les colonnes
    const newColumns = { ...columns };
    const sourceTasks = Array.from(newColumns[source.droppableId]);
    const destTasks = Array.from(newColumns[destination.droppableId]);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    // Mettre à jour le statut si la colonne change
    if (source.droppableId !== destination.droppableId) {
      movedTask.status = destination.droppableId as TaskStatus;
    }
    destTasks.splice(destination.index, 0, movedTask);
    newColumns[source.droppableId] = sourceTasks;
    newColumns[destination.droppableId] = destTasks;
    setColumns(newColumns);

    try {
      await taskService.updateTask(movedTask.id, {
        status: movedTask.status,
        position: destination.index,
      });
      toast.success('Tâche déplacée !');
    } catch (error) {
      toast.error('Erreur lors du déplacement de la tâche');
    }
  }, [columns]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <AnimatePresence initial={false}>
          {STATUS_COLUMNS.map((column, colIdx) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided, snapshot) => (
                <motion.div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 30 }}
                  className={cn(
                    'relative bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 rounded-2xl p-4 min-h-[300px] shadow-lg border border-primary/10 overflow-hidden',
                    snapshot.isDraggingOver && 'ring-2 ring-primary/40 scale-[1.01] z-10',
                    'transition-all duration-200'
                  )}
                >
                  {/* Effet de brillance au survol */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
                  <h3 className="font-semibold mb-4 text-lg bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
                    {column.label} <span className="text-xs text-muted-foreground">({columns[column.id]?.length || 0})</span>
                  </h3>
                  <div className="space-y-2">
                    <AnimatePresence initial={false}>
                      {columns[column.id]?.map((task, idx) => {
                        const isAutoShifted = !!task.start_time && typeof task.estimated_time === 'number' && task.estimated_time > 0;
                        return (
                          <Draggable draggableId={task.id} index={idx} key={task.id}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                  animate={{ opacity: 1, scale: snapshot.isDragging ? 1.05 : 1, y: 0, boxShadow: snapshot.isDragging ? '0 8px 32px 0 rgba(124,58,237,0.15)' : '0 2px 8px 0 rgba(124,58,237,0.05)' }}
                                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                  transition={{ duration: 0.18, type: 'spring', stiffness: 400, damping: 30 }}
                                  className={cn(
                                    'bg-white/90 dark:bg-gray-800/80 rounded-xl p-3 shadow-sm transition-all duration-200 group cursor-pointer border border-transparent hover:border-primary/30 hover:shadow-lg',
                                    snapshot.isDragging && 'scale-105 ring-2 ring-primary/40 opacity-90 z-20',
                                    'focus:outline-none focus:ring-2 focus:ring-primary/60'
                                  )}
                                  tabIndex={0}
                                  aria-label={`Tâche ${task.title}`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium group-hover:text-primary transition-colors">
                                      {task.title}
                                    </h4>
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        'transition-colors',
                                        PRIORITY_COLORS[task.priority as TaskPriority],
                                        task.priority === 'urgent' && 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20'
                                      )}
                                      aria-label={`Priorité ${TASK_PRIORITY_MAP[task.priority as TaskPriority]}`}
                                    >
                                      {TASK_PRIORITY_MAP[task.priority as TaskPriority]}
                                    </Badge>
                                    {isAutoShifted && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-1 flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200"
                                        aria-label="Tâche automatiquement décalée pour éviter un chevauchement"
                                        title="Cette tâche a été automatiquement décalée pour éviter un chevauchement."
                                      >
                                        <Info className="h-3 w-3" />
                                        Décalée
                                      </Badge>
                                    )}
                                  </div>
                                  {task.start_time && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Débute : {new Date(task.start_time).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                                    </p>
                                  )}
                                  {typeof task.estimated_time === 'number' && task.estimated_time > 0 && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Durée estimée : {Math.floor(task.estimated_time / 60)}h{task.estimated_time % 60}m
                                    </p>
                                  )}
                                  {task.project && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {task.project.name}
                                    </span>
                                  )}
                                </motion.div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </Droppable>
          ))}
        </AnimatePresence>
      </div>
    </DragDropContext>
  );
} 