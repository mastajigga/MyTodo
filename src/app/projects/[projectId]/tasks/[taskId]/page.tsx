'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/lib/services/taskService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskActivities } from '@/components/tasks/TaskActivities';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TASK_STATUS_MAP, Task } from '@/types/task';

export default function TaskDetailPage() {
  const { taskId } = useParams();

  const { data: task, isLoading } = useQuery<Task>({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getTask(taskId as string),
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-4 w-2/3 mb-8" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Tâche non trouvée</h1>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
        <p className="text-muted-foreground">{task.description}</p>
        <div className="flex items-center gap-4 mt-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {task.due_date ? (
              format(new Date(task.due_date), 'PPP', { locale: fr })
            ) : (
              'Pas de date limite'
            )}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            {task.assigned_to_user ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={task.assigned_to_user.avatar_url || ''} />
                  <AvatarFallback>
                    {task.assigned_to_user.full_name?.charAt(0) || task.assigned_to_user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {task.assigned_to_user.full_name || task.assigned_to_user.email}
              </div>
            ) : (
              'Non assigné'
            )}
          </Badge>
          <Badge>{TASK_STATUS_MAP[task.status]}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la tâche</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="activities">
            <TabsList>
              <TabsTrigger value="activities">Activités</TabsTrigger>
              <TabsTrigger value="comments">Commentaires</TabsTrigger>
            </TabsList>
            <TabsContent value="activities" className="mt-4">
              <TaskActivities taskId={taskId as string} />
            </TabsContent>
            <TabsContent value="comments" className="mt-4">
              {/* Composant de commentaires à venir */}
              <div className="text-center py-8 text-muted-foreground">
                Les commentaires seront bientôt disponibles
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 