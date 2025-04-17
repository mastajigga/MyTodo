import { useQuery } from '@tanstack/react-query';
import { TaskService } from '@/services/task.service';
import { Task } from '@/types/task';

export const useProjectTasks = (projectId: string) => {
  const {
    data,
    isLoading,
    error
  } = useQuery<Task[]>({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const tasks = await TaskService.getTasks(projectId);
      return tasks ?? [];
    },
    enabled: !!projectId
  });

  return {
    tasks: data ?? [],
    isLoading,
    error
  };
}; 