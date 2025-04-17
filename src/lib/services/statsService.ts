import { supabase } from '@/lib/supabase/client';

interface TaskStats {
  current: number;
  upcoming: number;
  completed: number;
}

export const statsService = {
  async getTaskStats(workspaceId: string): Promise<TaskStats> {
    console.log('Fetching stats for workspace:', workspaceId);

    if (!workspaceId) {
      console.log('No workspace ID provided');
      return {
        current: 0,
        upcoming: 0,
        completed: 0
      };
    }

    try {
      // Récupérer toutes les tâches non supprimées pour ce workspace
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('status')
        .eq('workspace_id', workspaceId)
        .is('deleted_at', null);

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      console.log('Tasks fetched:', tasks);

      // Compter manuellement les tâches par statut
      const stats = {
        current: tasks?.filter(task => task.status === 'in_progress').length || 0,
        upcoming: tasks?.filter(task => task.status === 'todo').length || 0,
        completed: tasks?.filter(task => task.status === 'done').length || 0
      };

      console.log('Calculated stats:', stats);
      return stats;

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