'use client';

import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PRIORITY_COLORS } from '@/lib/constants/task';
import { TASK_PRIORITY_MAP } from '@/types/task';
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
  const subtasksCount = task.subtasks?.length ?? 0;
  const completedSubtasksCount = task.subtasks?.filter((st) => st.completed).length ?? 0;

  return (
    <Card 
      className="group relative mb-2 cursor-pointer border bg-card/50 hover:bg-card/80 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            {task.title}
          </h3>
          {task.assigned_to_user && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 ring-2 ring-background">
                <AvatarImage src={task.assigned_to_user.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {task.assigned_to_user.full_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {task.assigned_to_user.full_name}
              </span>
            </div>
          )}
        </div>
        <Badge 
          variant="outline" 
          className={cn(
            "ml-2 transition-colors",
            PRIORITY_COLORS[task.priority]
          )}
        >
          {TASK_PRIORITY_MAP[task.priority]}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {task.description && (
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {task.description}
          </p>
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
          
          {subtasksCount > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all" 
                  style={{ 
                    width: `${(completedSubtasksCount / subtasksCount) * 100}%` 
                  }} 
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {completedSubtasksCount}/{subtasksCount}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 