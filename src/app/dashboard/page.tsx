import { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ClipboardList, CalendarDays, CheckCircle2, Activity, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { TaskCounter } from '@/components/dashboard/TaskCounter';
import { RecentActivities } from '@/components/dashboard/RecentActivities';

export const metadata: Metadata = {
  title: 'Tableau de bord | MyTodo',
  description: 'Gérez vos tâches et suivez votre progression',
};

// Types
type Task = {
  id: string;
  title: string;
  completed: boolean;
  due_date: string;
  updated_at: string;
  user_id: string;
  workspace_id?: string;
};

type Profile = {
  id: string;
  full_name: string;
};

// Composant de fallback pour le chargement
function LoadingCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/auth/login');
    }

    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id);

    if (tasksError) throw tasksError;

    const now = new Date();
    const currentTasks = tasks?.filter(
      (task) =>
        !task.completed &&
        new Date(task.due_date) <= now
    ).length || 0;

    const upcomingTasks = tasks?.filter(
      (task) =>
        !task.completed &&
        new Date(task.due_date) > now
    ).length || 0;

    const completedTasks = tasks?.filter((task) => task.completed).length || 0;

    const { data: recentActivities, error: activitiesError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(5);

    if (activitiesError) throw activitiesError;

    const stats = {
      total: tasks?.length || 0,
      completed: tasks?.filter((task) => task.status === 'completed').length || 0,
      inProgress: tasks?.filter((task) => task.status === 'in-progress').length || 0,
      pending: tasks?.filter((task) => task.status === 'pending').length || 0,
    };

    const recentTasks = tasks
      ?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5);

    return (
      <div className="container mx-auto py-6">
        <PageHeader
          heading="Tableau de bord"
          text="Bienvenue sur votre tableau de bord personnel"
        />

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
          <TaskCounter
            title="Tâches actuelles"
            value={currentTasks}
            description="Tâches en cours ou en retard"
          />
          <TaskCounter
            title="Tâches à venir"
            value={upcomingTasks}
            description="Tâches prévues pour plus tard"
          />
          <TaskCounter
            title="Tâches terminées"
            value={completedTasks}
            description="Tâches accomplies"
          />
        </div>

        <div className="mt-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Activités récentes</h2>
            {recentActivities && recentActivities.length > 0 ? (
              <RecentActivities
                activities={recentActivities.map((activity) => ({
                  id: activity.id,
                  title: activity.title,
                  status: activity.status,
                  date: format(new Date(activity.updated_at), 'PPP', {
                    locale: fr,
                  }),
                }))}
              />
            ) : (
              <p className="text-muted-foreground">
                Aucune activité récente à afficher
              </p>
            )}
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erreur lors du chargement du tableau de bord:', error);
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Une erreur est survenue lors du chargement du tableau de bord. Veuillez
            réessayer plus tard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
} 