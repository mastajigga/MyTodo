import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspaceContext } from "@/contexts/workspace-context";
import { Workspace } from "@/services/workspace.service";
import { Plus } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

interface KanbanHeaderProps {
  onAddTask: () => void;
  selectedProjectId: string;
  onProjectChange: (projectId: string) => void;
}

export function KanbanHeader({ onAddTask, selectedProjectId, onProjectChange }: KanbanHeaderProps) {
  const { workspace, workspaces, setWorkspace } = useWorkspaceContext();
  const { projects } = useProjects(workspace?.id || '');

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Select
          value={workspace?.id || ''}
          onValueChange={(value) => {
            const selectedWorkspace = workspaces?.find((w: Workspace) => w.id === value);
            if (selectedWorkspace) {
              setWorkspace(selectedWorkspace);
            }
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sélectionner un espace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces?.map((w: Workspace) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedProjectId}
          onValueChange={onProjectChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sélectionner un projet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les projets</SelectItem>
            {projects?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onAddTask} size="sm">
        <Plus className="w-4 h-4 mr-2" />
        Nouvelle tâche
      </Button>
    </div>
  );
} 