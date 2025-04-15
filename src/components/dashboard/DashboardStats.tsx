import { TaskCounter } from '@/components/dashboard/TaskCounter';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Workspace } from '@/services/workspace.service';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/lib/services/taskService';

export const DashboardStats = () => {
  const { workspace, workspaces, setWorkspace } = useWorkspaceContext();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      return taskService.getWorkspaceTasks(workspace.id);
    },
    enabled: !!workspace?.id
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    done: tasks.filter(task => task.status === 'done').length,
  };

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded">
        <h3 className="font-bold text-red-800">Erreur de chargement</h3>
        <p className="text-red-600">{(error as Error).message}</p>
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
            value={stats.inProgress}
            description="Tâches actives nécessitant votre attention"
            type="current"
          />
          <TaskCounter
            title="Tâches à faire"
            value={stats.todo}
            description="Tâches en attente de traitement"
            type="upcoming"
          />
          <TaskCounter
            title="Tâches terminées"
            value={stats.done}
            description="Tâches accomplies avec succès"
            type="completed"
          />
        </div>
      </div>
    </div>
  );
}; 