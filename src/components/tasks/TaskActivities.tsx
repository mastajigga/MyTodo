'use client';

import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/lib/services/taskService';
import { TaskActivity } from '@/types/task';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskActivitiesProps {
  taskId: string;
}

export function TaskActivities({ taskId }: TaskActivitiesProps) {
  const { data: activities = [], isLoading } = useQuery<TaskActivity[]>({
    queryKey: ['taskActivities', taskId],
    queryFn: () => taskService.getTaskActivities(taskId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune activité enregistrée
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 text-sm"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user?.avatar_url || ''} />
              <AvatarFallback>
                {activity.user?.full_name?.charAt(0) || activity.user?.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">
                  {activity.user?.full_name || activity.user?.email}
                </span>{' '}
                {activity.action}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.created_at), {
                  addSuffix: true,
                  locale: fr,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
} 