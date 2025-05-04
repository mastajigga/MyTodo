import { Database } from '../../lib/database.types';
import { supabase } from '@/lib/supabase/client';
import { Task, TaskStatus, TASK_STATUS_MAP, TaskActivity } from '@/@types/task';
import { commitGit } from '../utils/gitUtils'
import type { CreateTaskData } from '@/@types/task';

export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

// Ajout du mapping strict pour Task
function mapToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    status: row.status,
    priority: row.priority,
    due_date: row.due_date ?? null,
    start_time: row.start_time ?? null,
    estimated_time: row.estimated_time ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    workspace_id: row.workspace_id ?? '',
    project_id: row.project_id,
    position: row.position ?? 0,
    deleted_at: row.deleted_at ?? null,
    created_by: row.created_by ?? '',
    assigned_to: row.assigned_to ?? null,
    tags: row.tags ?? [],
    project: row.project ? {
      id: row.project.id,
      name: row.project.name,
      workspace_id: row.project.workspace_id ?? row.workspace_id ?? '',
    } : undefined,
    assigned_to_user: row.assigned_to_user ? {
      id: row.assigned_to_user.id,
      full_name: row.assigned_to_user.full_name,
      email: row.assigned_to_user.email,
      avatar_url: row.assigned_to_user.avatar_url,
    } : undefined,
    subtasks: row.subtasks ?? [],
  };
}

function isUser(user: any): user is { id: string; email: string; full_name?: string; avatar_url?: string } {
  return user && typeof user === 'object'
    && typeof user.id === 'string'
    && typeof user.email === 'string'
    && !('message' in user);
}

export const taskService = {
  async getTasks(projectId: string) {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectId !== 'all') {
      query = query.eq('project_id', projectId);
    }

    const { data: tasks, error: tasksError } = await query;
    if (tasksError) {
      throw tasksError;
    }
    const mapped = (tasks || []).map(mapToTask);
    return mapped;
  },

  async getTask(id: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[getTask] Appel avec id:', id);
    }
    const { data, error } = await supabase
      .from('tasks')
      .select('*, subtasks(*), comments(*)')
      .eq('id', id)
      .single();
    if (process.env.NODE_ENV === 'development') {
      console.debug('[getTask] Résultat:', { data, error });
    }
    if (error) {
      throw error;
    }
    return mapToTask(data);
  },

  async createTask(task: CreateTaskData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    // D'abord, obtenir la position maximale actuelle pour ce projet
    const { data: existingTasks } = await supabase
      .from('tasks')
      .select('position')
      .eq('project_id', task.project_id || '')
      .order('position', { ascending: false })
      .limit(1);

    const newPosition = existingTasks && existingTasks.length > 0 
      ? (existingTasks[0].position + 1) 
      : 0;

    // Préparer l'objet à insérer en filtrant les champs non attendus
    const {
      tags, // on retire ce champ
      ...insertTask
    } = task;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...insertTask,
        project_id: task.project_id || '',
        workspace_id: task.workspace_id || '',
        position: newPosition,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Commit git automatique en dev
    if (data && data.title) {
      commitGit(`feat(task): ajout de la tâche "${data.title}"`)
    }

    return data;
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  async reorderTasks(projectId: string, taskIds: string[]) {
    const task_updates = taskIds.map((id, index) => ({
      id,
      position: index
    }));

    const { error } = await supabase
      .rpc('reorder_tasks', {
        task_updates,
        project_id_param: projectId
      });

    if (error) {
      throw error;
    }
  },

  async updateTaskStatus(id: string, status: TaskStatus) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select('*, project:project_id(*)')
      .single();

    if (taskError) {
      throw taskError;
    }

    // Enregistrer l'activité de la tâche
    const { error: taskActivityError } = await supabase
      .from('task_activities')
      .insert({
        task_id: id,
        task_title: task.title,
        action: status === 'done' ? 'completed' : 'updated',
        previous_status: task.status,
        new_status: status,
        user_id: user.id
      });

    if (taskActivityError) {
      console.error('Erreur lors de l\'enregistrement de l\'activité de la tâche:', taskActivityError);
    }

    // Enregistrer l'activité du projet
    const { error: projectActivityError } = await supabase.rpc('add_project_activity', {
      p_project_id: task.project_id,
      p_type: 'status_change',
      p_description: status === 'done' 
        ? `a terminé la tâche "${task.title}"`
        : `a déplacé la tâche "${task.title}" vers ${TASK_STATUS_MAP[status].toLowerCase()}`
    });

    if (projectActivityError) {
      console.error('Erreur lors de l\'enregistrement de l\'activité du projet:', projectActivityError);
    }

    return task;
  },

  async createSubtask(taskId: string, title: string) {
    const { data, error } = await supabase
      .from('subtasks')
      .insert({
        task_id: taskId,
        title,
        completed: false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateSubtask(id: string, completed: boolean) {
    const { data, error } = await supabase
      .from('subtasks')
      .update({ 
        completed, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async createComment(taskId: string, content: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        task_id: taskId,
        user_id: user.id,
        content
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async getTaskComments(taskId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:user_id (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  },

  async getTaskActivities(taskId: string): Promise<TaskActivity[]> {
    const { data, error } = await supabase
      .from('task_activities')
      .select(`
        *,
        user:user_id (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(activity => {
      let user: TaskActivity['user'] = undefined;
      if (isUser(activity.user)) {
        user = activity.user as TaskActivity['user'];
      }
      return {
        id: activity.id,
        task_id: activity.task_id,
        task_title: activity.task_title,
        action: activity.action,
        previous_status: activity.previous_status || undefined,
        new_status: activity.new_status || undefined,
        user_id: activity.user_id,
        created_at: activity.created_at,
        user,
        // updated_at: activity.updated_at ?? undefined,
      };
    });
  },

  async getWorkspaceTasks(workspaceId: string): Promise<Task[]> {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:project_id (
          id,
          name
        ),
        created_by_user:created_by (
          id,
          email,
          full_name,
          avatar_url
        ),
        assigned_to_user:assigned_to (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (tasks || []).map(mapToTask);
  }
}; 