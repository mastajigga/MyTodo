import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';
import { Task } from '@/@types/task';
import { useProject } from './useProject';

export const useProjectTasks = (projectId: string) => {
  const { project } = useProject(projectId);

  const {
    data,
    isLoading,
    error
  } = useQuery<Task[]>({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      if (!project?.workspace_id) {
        return [];
      }
      const tasks = await taskService.getTasks(project.workspace_id, projectId);
      return tasks ?? [];
    },
    enabled: !!projectId && !!project?.workspace_id
  });

  return {
    tasks: data ?? [],
    isLoading,
    error
  };
}; 