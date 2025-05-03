import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@/lib/supabase/supabase-provider'

const { supabase } = useSupabase();

interface ProjectActivity {
  id: string;
  project_id: string;
  user_id: string;
  type: 'comment' | 'status_change' | 'completion';
  description: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export const useProjectActivities = (projectId: string) => {
  const {
    data: activities,
    isLoading,
    error
  } = useQuery<ProjectActivity[]>({
    queryKey: ['project-activities', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_activities')
        .select(`
          *,
          user:user_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return data.map(activity => ({
        ...activity,
        user: {
          id: activity.user.id,
          name: activity.user.full_name,
          avatar_url: activity.user.avatar_url
        }
      }));
    },
    enabled: !!projectId
  });

  return {
    activities: activities || [],
    isLoading,
    error
  };
}; 