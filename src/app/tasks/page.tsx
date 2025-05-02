import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TasksView } from '@/components/tasks/TasksView';
import { TaskList } from '@/components/tasks/TaskList';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { Task, TaskStatus, TaskPriority } from '@/@types/task';
import { TopNav } from '@/components/layout/TopNav';
import { motion } from 'framer-motion';

export default async function TasksPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return <div>Une erreur est survenue lors du chargement de l'utilisateur.</div>;
  }

  type WorkspaceMemberWithWorkspace = { workspace: { id: string } };
  const { data: workspaces, error: workspacesError } = await supabase
    .from('workspace_members')
    .select(`workspace:workspaces!workspace_id(id)`)
    .eq('user_id', user.id)
    .eq('workspace_id', 'b5301a85-1fd2-418e-8755-2b4acb806796')
    .single<WorkspaceMemberWithWorkspace>();
  if (workspacesError) {
    return <div>Une erreur est survenue lors du chargement du workspace.</div>;
  }
  if (!workspaces?.workspace?.id) {
    return <div>Aucun workspace disponible.</div>;
  }
  const workspaceId = workspaces.workspace.id;

  type Project = { id: string; name: string };
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .returns<Project[]>();
  if (projectsError) {
    return <div>Une erreur est survenue lors du chargement des projets.</div>;
  }
  const projectIds = projects.map(project => project.id);
  if (projectIds.length === 0) {
    return (
      <div className="container py-8">
        <Header />
        <Card className="backdrop-blur-sm bg-card/50 mt-8">
          <CardHeader className="space-y-1">
            <CardTitle>Gestion des tâches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6">Aucun projet disponible.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  type TaskWithRelations = {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    project_id: string;
    position: number;
    created_by: string;
    assigned_to: string | null;
    due_date: string | null;
    created_at: string;
    updated_at: string;
    tags: string[] | null;
    deleted_at: string | null;
    start_time: string | null;
    estimated_time: number | null;
    created_by_user: {
      id: string;
      email: string;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
    assigned_to_user: {
      id: string;
      email: string;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
    project: {
      id: string;
      name: string;
      workspace_id: string;
    } | null;
  };

  const { data: tasksData, error } = await supabase
    .from('tasks')
    .select(`
      id,
      title,
      description,
      status,
      priority,
      project_id,
      position,
      created_by,
      assigned_to,
      due_date,
      created_at,
      updated_at,
      tags,
      deleted_at,
      start_time,
      estimated_time,
      created_by_user:profiles!created_by(id, email, full_name, avatar_url),
      assigned_to_user:profiles!assigned_to(id, email, full_name, avatar_url),
      project:projects!project_id(id, name, workspace_id)
    `)
    .in('project_id', projectIds)
    .is('deleted_at', null)
    .order('position')
    .returns<TaskWithRelations[]>();
  if (error) {
    return <div>Une erreur est survenue lors du chargement des tâches.</div>;
  }
  const tasks = tasksData?.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as TaskStatus,
    priority: task.priority as TaskPriority,
    project_id: task.project_id,
    workspace_id: task.project?.workspace_id || workspaceId,
    position: task.position,
    created_at: task.created_at,
    updated_at: task.updated_at,
    deleted_at: task.deleted_at,
    due_date: task.due_date,
    start_time: task.start_time,
    estimated_time: task.estimated_time,
    created_by: task.created_by,
    assigned_to: task.assigned_to,
    tags: task.tags,
    created_by_user: task.created_by_user ? {
      id: task.created_by_user.id,
      email: task.created_by_user.email,
      full_name: task.created_by_user.full_name,
      avatar_url: task.created_by_user.avatar_url
    } : undefined,
    assigned_to_user: task.assigned_to_user ? {
      id: task.assigned_to_user.id,
      email: task.assigned_to_user.email,
      full_name: task.assigned_to_user.full_name,
      avatar_url: task.assigned_to_user.avatar_url
    } : null,
    project: task.project ? {
      id: task.project.id,
      name: task.project.name,
      workspace_id: task.project.workspace_id
    } : undefined
  })) || [];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <TopNav />
      <div className="relative z-10 pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header />
          <div className="grid gap-6">
            <Card className="backdrop-blur-sm bg-card/50 shadow-2xl border-none animate-fade-in">
              <CardHeader className="space-y-1">
                <CardTitle>Gestion des tâches</CardTitle>
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
                        <TasksView tasks={tasks} />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="list" className="m-0">
                    <div className="p-6">
                      <TaskList workspaceId={workspaceId} />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="relative mb-12 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
        Mes tâches
      </h1>
      <p className="mt-2 text-muted-foreground animate-fade-in delay-100">Toutes vos tâches, organisées par projet.</p>
      <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full animate-gradient-x" />
      <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm animate-gradient-x" />
    </div>
  );
} 