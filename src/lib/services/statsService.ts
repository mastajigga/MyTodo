import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

interface TaskStats {
  current: number;
  upcoming: number;
  completed: number;
}

export const statsService = {
  async getTaskStats(supabase: SupabaseClient, workspaceId: string): Promise<TaskStats> {
    console.log('[DEBUG][getTaskStats] Appel avec workspaceId:', workspaceId);
    if (!workspaceId) {
      console.warn('[DEBUG][getTaskStats] workspaceId manquant');
      return {
        current: 0,
        upcoming: 0,
        completed: 0
      };
    }

    try {
      // Vérifier que l'utilisateur a accès à cet espace de travail
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('[DEBUG][getTaskStats] Utilisateur courant:', userData?.user);
      if (userError) {
        console.error('[DEBUG][getTaskStats] Erreur getUser:', userError);
      }
      const userId = userData.user?.id;
      if (!userId) {
        console.warn('[DEBUG][getTaskStats] Aucun userId trouvé');
      }
      const { data: hasAccess, error: accessError } = await supabase
        .from('workspace_members')
        .select('user_id')
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)
        .single();
      console.log('[DEBUG][getTaskStats] Résultat accès workspace_members:', hasAccess, accessError);

      if (!hasAccess) {
        console.warn('[DEBUG][getTaskStats] Utilisateur sans accès à ce workspace');
        return {
          current: 0,
          upcoming: 0,
          completed: 0
        };
      }

      // Récupérer les tâches du workspace via la jointure sur projects
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('status, projects!inner(workspace_id)')
        .eq('projects.workspace_id', workspaceId)
        .is('deleted_at', null);
      console.log('[DEBUG][getTaskStats] Résultat requête tasks:', tasks, error);

      if (error) {
        console.error('[DEBUG][getTaskStats] Error fetching tasks:', error.message, error.details, error);
        throw error;
      }

      const current = tasks?.filter(task => task.status === 'in_progress').length || 0;
      const upcoming = tasks?.filter(task => task.status === 'todo').length || 0;
      const completed = tasks?.filter(task => task.status === 'done').length || 0;
      console.log('[DEBUG][getTaskStats] Stats calculées:', { current, upcoming, completed });

      return { current, upcoming, completed };

    } catch (error) {
      console.error('[DEBUG][getTaskStats] Error in getTaskStats:', error);
      return {
        current: 0,
        upcoming: 0,
        completed: 0
      };
    }
  }
}; 