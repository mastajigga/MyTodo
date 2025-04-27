import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { TasksView } from '@/components/tasks/TasksView';

export default async function TasksPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*, project:projects(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    return <div>Une erreur est survenue lors du chargement des tâches.</div>;
  }

  return <TasksView tasks={tasks} />;
} 