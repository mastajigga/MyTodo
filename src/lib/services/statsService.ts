import { supabase } from '@/lib/supabase/client';

interface TaskStats {
  current: number;
  upcoming: number;
  completed: number;
}

export const statsService = {
  async getTaskStats(workspaceId: string): Promise<TaskStats> {
    if (!workspaceId) {
      return {
        current: 0,
        upcoming: 0,
        completed: 0
      };
    }

    try {
      // Vérifier que l'utilisateur a accès à cet espace de travail
      const { data: hasAccess } = await supabase
        .from('workspace_members')
        .select('user_id')
        .eq('workspace_id', workspaceId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!hasAccess) {
        return {
          current: 0,
          upcoming: 0,
          completed: 0
        };
      }

      // Récupérer les tâches uniquement si l'utilisateur a accès
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('status')
        .eq('workspace_id', workspaceId)
        .is('deleted_at', null);

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      return {
        current: tasks?.filter(task => task.status === 'in_progress').length || 0,
        upcoming: tasks?.filter(task => task.status === 'todo').length || 0,
        completed: tasks?.filter(task => task.status === 'done').length || 0
      };

    } catch (error) {
      console.error('Error in getTaskStats:', error);
      return {
        current: 0,
        upcoming: 0,
        completed: 0
      };
    }
  }
}; 