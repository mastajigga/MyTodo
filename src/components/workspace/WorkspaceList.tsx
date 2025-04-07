import { workspaceService } from '@/services/workspace';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkspaceType } from '@/types/workspace';
import Link from 'next/link';

const workspaceTypeLabels: Record<WorkspaceType, string> = {
  professional: 'Professionnel',
  family: 'Famille',
  private: 'Privé',
};

const workspaceTypeColors: Record<WorkspaceType, string> = {
  professional: 'bg-blue-100 text-blue-800',
  family: 'bg-green-100 text-green-800',
  private: 'bg-purple-100 text-purple-800',
};

async function getWorkspaces() {
  return await workspaceService.getUserWorkspaces();
}

export async function WorkspaceList() {
  const workspaces = await getWorkspaces();

  if (workspaces.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Aucun espace de travail</h3>
        <p className="mt-2 text-sm text-gray-600">
          Commencez par créer votre premier espace de travail.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace) => (
        <Link key={workspace.id} href={`/workspaces/${workspace.id}`}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{workspace.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {workspace.description || 'Aucune description'}
                  </CardDescription>
                </div>
                <Badge className={workspaceTypeColors[workspace.type]}>
                  {workspaceTypeLabels[workspace.type]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                Créé le {new Date(workspace.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 