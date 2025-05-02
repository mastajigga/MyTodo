import { useQuery } from '@tanstack/react-query';
import { ProjectService } from '@/services/project.service';
import { Project } from '@/types/project';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const useProject = (projectId: string) => {
  const supabase = createClientComponentClient();

  const {
    data: project,
    isLoading,
    error
  } = useQuery<Project | undefined>({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const result = await ProjectService.getProject(projectId, supabase);
      // Si le projet n'existe pas, retourne undefined
      return result && result.id ? result : undefined;
    },
    enabled: !!projectId
  });

  return {
    project,
    isLoading,
    error
  };
}; 