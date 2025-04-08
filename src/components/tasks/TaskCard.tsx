import { Task, TASK_PRIORITY_MAP } from '@/types/task';
import { cn } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

export const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <h4 className="font-medium mb-2 line-clamp-2">{task.title}</h4>
      
      {task.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          priorityColors[task.priority]
        )}>
          {TASK_PRIORITY_MAP[task.priority]}
        </span>

        {task.due_date && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>
              {format(new Date(task.due_date), 'dd MMM', { locale: fr })}
            </span>
          </div>
        )}

        {task.due_time && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{task.due_time}</span>
          </div>
        )}
      </div>
    </div>
  );
}; 