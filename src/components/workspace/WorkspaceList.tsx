'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { useToast } from '@/components/ui/use-toast';
import type { Database } from '@/types/database.types';
import { useLogger } from '@/hooks/useLogger';
import { useWorkspaceStats } from '@/hooks/useWorkspaceStats';
import { Workspace, WorkspaceType } from '@/types/workspace';

interface WorkspaceWithCounts extends Workspace {
  members_count: number;
  projects_count: number;
  tasks_count: number;
}

const workspaceTypeLabels: Record<WorkspaceType, string> = {
  private: 'Personnel',
  professional: 'Équipe',
  family: 'Famille'
};

const workspaceTypeColors: Record<WorkspaceType, string> = {
  private: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  professional: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  family: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
};

export function WorkspaceList() {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const { logWorkspaces } = useLogger();
  const workspaceStats = useWorkspaceStats(null);

  const { data: workspaces, isLoading, error } = useQuery<WorkspaceWithCounts[]>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      // 1. Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // 2. Récupérer les workspace_id où il est membre
      const { data: memberships, error: membershipsError } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id);
      if (membershipsError) throw membershipsError;

      const workspaceIds = memberships?.map(m => m.workspace_id) || [];
      if (workspaceIds.length === 0) return [];

      // 3. Récupérer les workspaces correspondants
      const { data: workspacesData, error: workspacesError } = await supabase
        .from('workspaces')
        .select('*')
        .in('id', workspaceIds)
        .order('created_at', { ascending: false });

      console.log('Workspaces bruts côté client:', workspacesData); // DEBUG

      if (workspacesError) throw workspacesError;

      const workspacesWithCounts = await Promise.all(
        (workspacesData || []).map(async (workspace) => {
          const [
            { count: membersCount },
            { count: projectsCount },
            { count: tasksCount }
          ] = await Promise.all([
            supabase
              .from('workspace_members')
              .select('*', { count: 'exact', head: true })
              .eq('workspace_id', workspace.id)
              .single(),
            supabase
              .from('projects')
              .select('*', { count: 'exact', head: true })
              .eq('workspace_id', workspace.id)
              .single(),
            supabase
              .from('tasks')
              .select('*', { count: 'exact', head: true })
              .eq('workspace_id', workspace.id)
              .single()
          ]);

          return {
            ...workspace,
            type: (workspace.type || 'private') as WorkspaceType,
            members_count: membersCount || 0,
            projects_count: projectsCount || 0,
            tasks_count: tasksCount || 0
          };
        })
      );

      console.log('Workspaces après mapping:', workspacesWithCounts); // DEBUG

      // Log les workspaces avec leurs statistiques
      logWorkspaces(workspacesWithCounts);

      return workspacesWithCounts;
    }
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les espaces de travail.',
        variant: 'destructive'
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-3 w-3/4" />
          </Card>
        ))}
      </div>
    );
  }

  if (!workspaces?.length) {
    console.log('Aucun workspace à afficher, valeur de workspaces:', workspaces); // DEBUG
    return (
      <Card className="p-4 text-center text-muted-foreground">
        Aucun espace de travail trouvé.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {workspaces.map((workspace) => (
        <Card key={workspace.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{workspace.name}</h3>
              <p className="text-sm text-muted-foreground">
                {workspace.description || 'Aucune description'}
              </p>
            </div>
            <div className={`px-2 py-1 rounded text-xs ${workspaceTypeColors[workspace.type]}`}>
              {workspaceTypeLabels[workspace.type]}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">{workspace.members_count}</span> membres
            </div>
            <div>
              <span className="font-medium">{workspace.projects_count}</span> projets
            </div>
            <div>
              <span className="font-medium">{workspace.tasks_count}</span> tâches
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 