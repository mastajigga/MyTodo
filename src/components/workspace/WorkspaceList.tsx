'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useWorkspaceStats } from '@/hooks/useWorkspaceStats';
import { WorkspaceWithStats } from '@/types/workspace';
import { workspaceTypeLabels, workspaceTypeColors } from '@/lib/supabase';
import { getWorkspaces } from '@/lib/services/workspaceService';
import { WorkspaceCard } from './WorkspaceCard';

export function WorkspaceList() {
  const { toast } = useToast();

  const { data: workspaces, isLoading, error } = useQuery<WorkspaceWithStats[]>({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les espaces de travail',
        variant: 'destructive'
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-[200px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!workspaces?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun espace de travail trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
} 