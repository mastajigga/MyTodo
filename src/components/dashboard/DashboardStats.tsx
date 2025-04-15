import { TaskCounter } from '@/components/dashboard/TaskCounter';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { useEntries } from '@/hooks/useEntries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Workspace } from '@/services/workspace.service';

export const DashboardStats = () => {
  const { workspace, workspaces, setWorkspace } = useWorkspaceContext();
  const { stats, isLoading, error } = useEntries(workspace?.id || '');

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded">
        <h3 className="font-bold text-red-800">Erreur de chargement</h3>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <Select
          value={workspace?.id || ''}
          onValueChange={(value) => {
            const selectedWorkspace = workspaces?.find((w: Workspace) => w.id === value);
            if (selectedWorkspace) {
              setWorkspace(selectedWorkspace);
            }
          }}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Sélectionner un workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces?.map((w: Workspace) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TaskCounter
            title="Tâches en cours"
            value={stats?.inProgress || 0}
            description="Tâches actives nécessitant votre attention"
            type="current"
          />
          <TaskCounter
            title="Tâches à faire"
            value={stats?.todo || 0}
            description="Tâches en attente de traitement"
            type="upcoming"
          />
          <TaskCounter
            title="Tâches terminées"
            value={stats?.done || 0}
            description="Tâches accomplies avec succès"
            type="completed"
          />
        </div>
      </div>
    </div>
  );
}; 