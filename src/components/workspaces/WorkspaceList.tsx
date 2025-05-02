'use client';

import { workspaceService } from '@/services/workspace';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkspaceType, Workspace } from '@/types/workspace';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { useWorkspaceContext } from '@/contexts/workspace-context';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const workspaceTypeLabels: Record<WorkspaceType, string> = {
  family: 'Famille',
  professional: 'Professionnel',
  private: 'Privé'
};

const workspaceTypeColors: Record<WorkspaceType, string> = {
  family: 'text-blue-600',
  professional: 'text-green-600',
  private: 'text-purple-600'
};

export function WorkspaceList() {
  const { workspaces } = useWorkspaceContext();

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun espace de travail trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workspaces.map((workspace) => (
        <div key={workspace.id}>
          <Link href={`/workspaces/${workspace.id}`}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="line-clamp-1">{workspace.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {workspace.description || 'Aucune description'}
                    </CardDescription>
                  </div>
                  <Badge className={workspaceTypeColors[workspace.type as WorkspaceType]}>
                    {workspaceTypeLabels[workspace.type as WorkspaceType]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Créé le {new Date(workspace.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
} 