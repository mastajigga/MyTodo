'use client';

import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PRIORITY_COLORS } from '@/lib/constants/task';

type TaskCardProps = {
  task: Task;
};

/**
 * TaskCard component displays a single task with its details
 * @component
 * @param {TaskCardProps} props - Component props
 * @param {Task} props.task - Task object containing all task details
 * @returns {JSX.Element} Rendered task card
 */
export function TaskCard({ task }: TaskCardProps) {
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const subtasksCount = task.subtasks?.length ?? 0;
  const completedSubtasksCount = task.subtasks?.filter((st) => st.completed).length ?? 0;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{task.title}</h4>
          <Badge
            variant="secondary"
            className={PRIORITY_COLORS[task.priority]}
          >
            {task.priority}
          </Badge>
        </div>
        {task.description && (
          <p className="text-sm text-gray-500">{task.description}</p>
        )}
        {dueDate && (
          <div className="flex items-center gap-2 text-sm text-gray-500" data-testid="due-date">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDistanceToNow(dueDate, {
                addSuffix: true,
                locale: fr,
              })}
            </span>
          </div>
        )}
        {task.due_time && (
          <div className="flex items-center gap-2 text-sm text-gray-500" data-testid="due-time">
            <Clock className="h-4 w-4" />
            <span>{task.due_time}</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        {task.assigned_to ? (
          <div className="flex items-center gap-2" data-testid="assigned-user">
            <div className="h-6 w-6 rounded-full bg-gray-200" />
            <span className="text-sm">Assigné</span>
          </div>
        ) : (
          <Button variant="outline" size="sm" data-testid="assign-button">
            Assigner
          </Button>
        )}
        {subtasksCount > 0 && (
          <div className="text-sm text-gray-500" data-testid="subtasks-counter">
            {completedSubtasksCount}/{subtasksCount} sous-tâches
          </div>
        )}
      </div>
    </div>
  );
} 