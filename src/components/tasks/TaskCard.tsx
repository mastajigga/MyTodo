'use client';

import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Info } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PRIORITY_COLORS } from '@/lib/constants/task';
import { TASK_PRIORITY_MAP } from '@/types/common';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
};

/**
 * TaskCard component displays a single task with its details
 * @component
 * @param {TaskCardProps} props - Component props
 * @param {Task} props.task - Task object containing all task details
 * @returns {JSX.Element} Rendered task card
 */
export function TaskCard({ task, onClick }: TaskCardProps) {
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  // Détection d'un décalage automatique (ex: start_time existe ET estimated_time > 0)
  const isAutoShifted = !!task.start_time && typeof task.estimated_time === 'number' && task.estimated_time > 0;

  return (
    <Card 
      className="group relative mb-2 cursor-pointer border bg-card/50 hover:bg-card/80 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
      tabIndex={0}
      aria-label={`Ouvrir la tâche ${task.title}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <h3 className="font-semibold group-hover:text-primary transition-colors">
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={cn(
              "ml-2 transition-colors",
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
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {task.description && (
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {task.description}
          </p>
        )}
        {task.start_time && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <Clock className="h-4 w-4" />
            <span>
              Débute : {format(new Date(task.start_time), "d MMM yyyy HH:mm", { locale: fr })}
            </span>
          </div>
        )}
        {typeof task.estimated_time === 'number' && task.estimated_time > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Clock className="h-4 w-4" />
            <span>
              Durée estimée : {Math.floor(task.estimated_time / 60)}h{task.estimated_time % 60}m
            </span>
          </div>
        )}
        <div className="flex items-center justify-between mt-4">
          {dueDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {format(dueDate, "d MMM", { locale: fr })}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 