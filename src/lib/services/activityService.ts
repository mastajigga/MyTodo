import { supabase } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Activity {
  id: string;
  type: "create" | "update" | "delete" | "complete" | "start";
  taskName: string;
  timestamp: string;
  userName?: string;
}

export interface TaskActivity {
  id: string;
  task_id: string;
  task_title: string;
  action: 'created' | 'completed' | 'updated';
  created_at: string;
  user_id: string;
  user_name?: string;
}

interface User {
  id: string;
  full_name: string;
}

export const activityService = {
  async getRecentActivities(): Promise<Activity[]> {
    const { data: activities, error: activitiesError } = await supabase
      .from('task_activities')
      .select(`
        id,
        task_id,
        task_title,
        action,
        created_at,
        user_id
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (activitiesError) {
      throw activitiesError;
    }

    if (!activities || activities.length === 0) {
      return [];
    }

    const userIds = Array.from(new Set(activities.map(a => a.user_id)));
    const { data: users, error: usersError } = await supabase
      .rpc('get_users_by_ids', { user_ids: userIds });

    if (usersError) {
      console.error('Erreur lors de la récupération des utilisateurs:', usersError);
      return activities.map(activity => ({
        id: activity.id,
        type: activity.action === 'created' ? 'create' :
              activity.action === 'completed' ? 'complete' :
              activity.action === 'updated' ? 'update' : 'update' as Activity['type'],
        taskName: activity.task_title,
        userName: 'Utilisateur',
        timestamp: formatDistanceToNow(new Date(activity.created_at), { 
          addSuffix: true,
          locale: fr 
        })
      }));
    }

    const userMap = new Map<string, string>();
    (users || []).forEach((user: User) => {
      userMap.set(user.id, user.full_name);
    });

    return activities.map(activity => ({
      id: activity.id,
      type: activity.action === 'created' ? 'create' :
            activity.action === 'completed' ? 'complete' :
            activity.action === 'updated' ? 'update' : 'update' as Activity['type'],
      taskName: activity.task_title,
      userName: userMap.get(activity.user_id) || 'Utilisateur',
      timestamp: formatDistanceToNow(new Date(activity.created_at), { 
        addSuffix: true,
        locale: fr 
      })
    }));
  },

  async createActivity(activity: Omit<TaskActivity, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase
      .from('task_activities')
      .insert([activity]);

    if (error) {
      throw new Error(error.message);
    }
  },

  async getRecentTaskActivities(): Promise<TaskActivity[]> {
    const { data, error } = await supabase
      .from('task_activities')
      .select(`
        id,
        task_id,
        task_title,
        action,
        created_at,
        user_id
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    // On ajoute user_name si possible (optionnel)
    // Ici, on retourne les données brutes, le composant pourra faire le mapping si besoin
    return data as TaskActivity[];
  }
}; 