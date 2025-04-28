'use client';

import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PRIORITY_COLORS } from '@/lib/constants/task';
import { TASK_PRIORITY_MAP } from '@/types/common';
import { Info } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Colonne Todo */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-semibold mb-4">À faire ({todoTasks.length})</h3>
        <div className="space-y-2">
          {todoTasks.map((task) => {
            const isAutoShifted = !!task.start_time && typeof task.estimated_time === 'number' && task.estimated_time > 0;
            return (
              <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm" tabIndex={0} aria-label={`Tâche ${task.title}`}> 
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{task.title}</h4>
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
                {task.project && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {task.project.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Colonne En cours */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-semibold mb-4">En cours ({inProgressTasks.length})</h3>
        <div className="space-y-2">
          {inProgressTasks.map((task) => {
            const isAutoShifted = !!task.start_time && typeof task.estimated_time === 'number' && task.estimated_time > 0;
            return (
              <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm" tabIndex={0} aria-label={`Tâche ${task.title}`}> 
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{task.title}</h4>
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
                {task.project && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {task.project.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Colonne Terminé */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-semibold mb-4">Terminé ({doneTasks.length})</h3>
        <div className="space-y-2">
          {doneTasks.map((task) => {
            const isAutoShifted = !!task.start_time && typeof task.estimated_time === 'number' && task.estimated_time > 0;
            return (
              <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm" tabIndex={0} aria-label={`Tâche ${task.title}`}> 
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{task.title}</h4>
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
                {task.project && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {task.project.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 