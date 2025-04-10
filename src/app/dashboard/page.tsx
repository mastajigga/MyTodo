import { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ClipboardList, CalendarDays, CheckCircle2, Activity, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

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
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', session.user.id);

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
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardHeader profile={profile} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardStats stats={stats} />
          <div className="md:col-span-2 lg:col-span-3">
            <RecentActivity tasks={recentTasks} />
          </div>
        </div>
      </Suspense>
    </div>
  );
} 