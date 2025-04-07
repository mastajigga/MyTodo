'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PageHeader } from "@/components/ui/PageHeader";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Task {
  id: string;
  title: string;
  status: string;
  due_date: string;
}

interface Workspace {
  id: string;
  name: string;
  type: string;
}

interface Activity {
  id: string;
  type: string;
  content: string;
  created_at: string;
}

export default function DashboardPage() {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        // Récupérer les tâches récentes
        const { data: tasks } = await supabase
          .from('tasks')
          .select('id, title, status, due_date')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Récupérer les espaces de travail
        const { data: workspaceData } = await supabase
          .from('workspaces')
          .select('id, name, type')
          .eq('created_by', user.id)
          .limit(5);

        // Simuler des activités (à implémenter plus tard avec une vraie table)
        const mockActivities = [
          {
            id: '1',
            type: 'task_completed',
            content: 'Tâche "Présentation projet" terminée',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'workspace_created',
            content: 'Nouvel espace "Marketing" créé',
            created_at: new Date().toISOString(),
          },
        ];

        setRecentTasks(tasks || []);
        setWorkspaces(workspaceData || []);
        setActivities(mockActivities);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: fr });
  };

  return (
    <div>
      <PageHeader
        heading="Tableau de bord"
        text="Bienvenue sur votre espace de travail personnel"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium mb-4">Tâches récentes</h3>
          {loading ? (
            <p className="text-sm text-gray-500">Chargement...</p>
          ) : recentTasks.length > 0 ? (
            <ul className="space-y-3">
              {recentTasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between">
                  <span className="text-sm">{task.title}</span>
                  <span className="text-xs text-gray-500">
                    {task.due_date && formatDate(task.due_date)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              Aucune tâche récente à afficher
            </p>
          )}
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium mb-4">Activité récente</h3>
          {loading ? (
            <p className="text-sm text-gray-500">Chargement...</p>
          ) : activities.length > 0 ? (
            <ul className="space-y-3">
              {activities.map((activity) => (
                <li key={activity.id} className="text-sm">
                  <p>{activity.content}</p>
                  <span className="text-xs text-gray-500">
                    {formatDate(activity.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              Aucune activité récente à afficher
            </p>
          )}
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium mb-4">Espaces de travail</h3>
          {loading ? (
            <p className="text-sm text-gray-500">Chargement...</p>
          ) : workspaces.length > 0 ? (
            <ul className="space-y-3">
              {workspaces.map((workspace) => (
                <li key={workspace.id} className="flex items-center justify-between">
                  <span className="text-sm">{workspace.name}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                    {workspace.type}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              Aucun espace de travail à afficher
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 