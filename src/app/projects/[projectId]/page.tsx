'use client';

import { TaskBoard } from '@/components/tasks/TaskBoard';
import { useParams } from 'next/navigation';
import { ProjectDetailHeader } from '@/components/projects/ProjectDetailHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskList } from '@/components/tasks/TaskList';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/lib/services/taskService';
import { toast } from 'sonner';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { projectService } from '@/lib/services/projectService';

export default function ProjectDetailPage() {
  const { projectId } = useParams() as { projectId: string };

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProject(projectId as string),
  });

  const { data: rawTasks = [], isLoading: isLoadingTasks } = useQuery<Task[]>({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const tasks = await taskService.getTasks(projectId as string);
      // On s'assure que tags est toujours un tableau
      return tasks.map(task => ({
        ...task,
        tags: Array.isArray(task.tags) ? task.tags : [],
      }));
    },
  });
  const tasks = rawTasks;

  const handleTaskMove = async (taskId: string, completed: boolean) => {
    try {
      await taskService.updateTaskStatus(taskId, completed ? 'done' : 'todo');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      toast.error('Erreur lors de la mise à jour de la tâche');
    }
  };

  return (
    <div className="container py-8">
      <div className="relative mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent animate-fade-in">
          {project?.name || 'Chargement...'}
        </h1>
        <p className="mt-2 text-muted-foreground animate-fade-in delay-100">{project?.description}</p>
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full animate-gradient-x" />
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm animate-gradient-x" />
      </div>

      <div className="grid gap-6">
        <Card className="backdrop-blur-sm bg-card/50 shadow-2xl border-none animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle>Gestion des tâches</CardTitle>
            <ProjectDetailHeader projectId={projectId as string} />
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="board" className="w-full">
              <div className="px-6 border-b">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="board">Tableau Kanban</TabsTrigger>
                  <TabsTrigger value="list">Liste des tâches</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="board" className="m-0">
                <div className="h-[calc(100vh-24rem)] overflow-x-auto">
                  <div className="min-w-full p-6">
                    <TaskBoard projectId={projectId as string} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="m-0">
                <div className="p-6">
                  {isLoadingTasks ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <TaskList workspaceId={project?.workspace_id || ''} />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 