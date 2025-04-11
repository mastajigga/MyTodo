'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { CreateWorkspaceButton } from '@/components/workspace/CreateWorkspaceButton';
import { WorkspaceList } from '@/components/workspace/WorkspaceList';

export default function WorkspacesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Espaces de travail"
          description="Gérez vos espaces de travail et leurs membres."
        />
        <CreateWorkspaceButton />
      </div>
      <WorkspaceList />
    </div>
  );
} 