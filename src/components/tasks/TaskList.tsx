'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { STATUS_COLUMNS } from '@/lib/constants/task';
import { useTasksByStatus } from '@/hooks/useTasksByStatus';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PRIORITY_COLORS } from '@/lib/constants/task';
import { TASK_PRIORITY_MAP } from '@/types/common';
import { Info } from 'lucide-react';

export interface TaskListProps {
  tasks: Task[];
  onTaskMove?: (taskId: string, completed: boolean) => void;
}

/**
 * TaskList component displays tasks in a kanban board layout with drag and drop functionality
 * @component
 * @param {TaskListProps} props - Component props
 * @param {Task[]} props.tasks - Array of tasks to display
 * @param {Function} props.onTaskMove - Callback function when a task is moved
 * @returns {JSX.Element | null} Rendered task list or null if not enabled
 */
export const TaskList = ({ tasks, onTaskMove }: TaskListProps) => {
  const [enabled, setEnabled] = useState(false);
  const tasksByStatus = useTasksByStatus(tasks);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  // Enable drag and drop only on client side
  useEffect(() => {
    setEnabled(true);
  }, []);

  if (!enabled) {
    return null;
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onTaskMove?.(result.draggableId, false);
  };

  const handleTaskToggle = (taskId: string) => {
    const newCompletedTasks = new Set(completedTasks);
    if (completedTasks.has(taskId)) {
      newCompletedTasks.delete(taskId);
    } else {
      newCompletedTasks.add(taskId);
    }
    setCompletedTasks(newCompletedTasks);
    onTaskMove?.(taskId, !completedTasks.has(taskId));
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const isAutoShifted = !!task.start_time && typeof task.estimated_time === 'number' && task.estimated_time > 0;
        return (
          <Card key={task.id} className="p-4">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={completedTasks.has(task.id)}
                onCheckedChange={() => handleTaskToggle(task.id)}
                aria-label={`Marquer la tâche "${task.title}" comme ${completedTasks.has(task.id) ? 'non terminée' : 'terminée'}`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-medium ${completedTasks.has(task.id) ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      'transition-colors',
                      PRIORITY_COLORS[task.priority],
                      task.priority === 'urgent' && 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20'
                    )}
                    aria-label={`Priorité ${TASK_PRIORITY_MAP[task.priority]}`}
                  >
                    {TASK_PRIORITY_MAP[task.priority]}
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
                {task.description && (
                  <p className={`text-sm ${completedTasks.has(task.id) ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>{task.description}</p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
      {tasks.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          Aucune tâche à afficher
        </div>
      )}
    </div>
  );
}; 