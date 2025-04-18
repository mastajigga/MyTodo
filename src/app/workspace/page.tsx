"use client"

import { useWorkspaceContext } from '@/contexts/workspace-context';
import { useWorkspaceStats } from '@/hooks/useWorkspaceStats';
import { ProjectList } from '@/components/projects/ProjectList';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { WorkspaceHeader } from '@/components/workspaces/WorkspaceHeader';
import { WorkspaceStats } from '@/components/workspaces/WorkspaceStats';

export default function WorkspacePage() {
  const { workspace } = useWorkspaceContext();
  const stats = useWorkspaceStats(workspace);

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-lg text-muted-foreground">Aucun espace de travail sélectionné</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <WorkspaceHeader workspace={workspace} />
      <WorkspaceStats stats={stats} className="mt-8" />
      <div className="mt-8">
        <ProjectHeader />
        <ProjectList />
      </div>
    </div>
  );
} 