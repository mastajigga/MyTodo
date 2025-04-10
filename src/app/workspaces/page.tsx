import { Suspense } from 'react';
import { WorkspaceList } from '@/components/workspace/WorkspaceList';
import { CreateWorkspaceButton } from '@/components/workspace/CreateWorkspaceButton';
import { PageHeader } from '@/components/ui/PageHeader';

export default function WorkspacesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Espaces de travail"
        description="Gérez vos espaces de travail et leurs membres."
        action={<CreateWorkspaceButton />}
      />
      
      <Suspense fallback={<div>Chargement des espaces de travail...</div>}>
        <WorkspaceList />
      </Suspense>
    </div>
  );
} 