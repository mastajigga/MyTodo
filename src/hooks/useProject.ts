import { useQuery } from '@tanstack/react-query';
import { ProjectService } from '@/services/project.service';
import { Project } from '@/types/project';
import { useSupabase } from '@/lib/supabase/supabase-provider'

export const useProject = (projectId: string) => {
  const { supabase } = useSupabase();

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