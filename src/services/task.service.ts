'use client';

import { supabase } from '@/lib/supabase/client';
import { Task, CreateTaskData } from '@/types/task';
import { Database } from '@/lib/database.types';

type Tables = Database['public']['Tables'];
type TaskRow = Tables['tasks']['Row'];
type TaskInsert = Tables['tasks']['Insert'];
type TaskUpdate = Tables['tasks']['Update'];

export function getNextAvailableStartTime(tasks: Task[], newTask: Partial<Task>): string | null {
  const sorted = tasks
    .filter(t => t.id !== newTask.id)
    .filter(t => t.start_time && t.estimated_time)
    .sort((a, b) => new Date(a.start_time!).getTime() - new Date(b.start_time!).getTime());

  let proposedStart = newTask.start_time ? new Date(newTask.start_time) : new Date();
  for (const task of sorted) {
    const taskStart = new Date(task.start_time!);
    const taskEnd = new Date(taskStart.getTime() + (task.estimated_time || 0) * 60000);
    if (proposedStart >= taskStart && proposedStart < taskEnd) {
      proposedStart = taskEnd;
    }
  }
  return proposedStart.toISOString();
}

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
    user_id: row.user_id ?? row.created_by ?? '',
    project_id: row.project_id,
    project: row.project ? {
      id: row.project.id,
      name: row.project.name,
    } : undefined,
  };
}

class TaskService {
  async createTask(data: CreateTaskData): Promise<Task> {
    console.log('[taskService.createTask] Appel avec :', data);
    if (data.all_project_ids) {
      console.log('[taskService.createTask] Liste complète des project_ids disponibles pour l\'utilisateur :', data.all_project_ids);
    }
    let allTasks: Task[] = [];
    if (data.project_id) {
      console.log('[taskService.createTask] project_id fourni :', data.project_id);
    } else {
      console.warn('[taskService.createTask] ATTENTION : project_id manquant !');
    }
    if (data.workspace_id) {
      console.log('[taskService.createTask] workspace_id fourni :', data.workspace_id);
    } else {
      console.warn('[taskService.createTask] ATTENTION : workspace_id manquant !');
    }
    if (data.created_by) {
      console.log('[taskService.createTask] created_by fourni :', data.created_by);
    } else {
      console.warn('[taskService.createTask] ATTENTION : created_by manquant !');
    }
    // Log Supabase user connecté
    try {
      // @ts-ignore
      const user = await supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
      if (user) {
        console.log('[taskService.createTask] Utilisateur connecté (supabase.auth.getUser) :', user.id, user.email);
      } else {
        console.warn('[taskService.createTask] Aucun utilisateur connecté (supabase.auth.getUser renvoie null)');
      }
    } catch (e) {
      console.warn('[taskService.createTask] Impossible de récupérer l\'utilisateur connecté via supabase.auth.getUser', e);
    }
    if (data.project_id) {
      console.log('[taskService.createTask] Recherche des tâches du projet', data.project_id);
      const { data: fetchedTasks, error: fetchError } = await supabase
        .from('tasks')
        .select()
        .eq('project_id', data.project_id);
      if (fetchError) {
        console.error('[taskService.createTask] Erreur lors de la récupération des tâches du projet :', fetchError);
        throw fetchError;
      }
      allTasks = (fetchedTasks as any[]).map(mapToTask);
      console.log('[taskService.createTask] Tâches du projet récupérées :', allTasks);
    }
    let start_time = data.start_time ?? null;
    const priority = typeof data.priority === 'string' ? data.priority : 'medium';
    if (data.estimated_time && data.estimated_time > 0) {
      const safeData = { ...data, priority, due_date: data.due_date ?? undefined, project_id: data.project_id ?? undefined };
      start_time = getNextAvailableStartTime(allTasks, safeData) ?? start_time;
      console.log('[taskService.createTask] Nouvelle start_time calculée :', start_time);
    }
    try {
      console.log('[taskService.createTask] Insertion de la tâche dans la base...');
      const { workspace_id, all_project_ids, ...taskDataSansWorkspace } = data;
      const { data: taskRow, error } = await supabase
        .from('tasks')
        .insert({
          ...taskDataSansWorkspace,
          priority,
          start_time,
          estimated_time: data.estimated_time ?? null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          position: 0,
        } as TaskInsert)
        .select()
        .single();
      if (error) {
        console.error('[taskService.createTask] Erreur lors de l\'insertion :', error);
        throw error;
      }
      const mapped = mapToTask(taskRow);
      console.log('[taskService.createTask] Tâche insérée et mappée :', mapped);
      return mapped;
    } catch (err) {
      console.error('[taskService.createTask] Exception attrapée :', err);
      throw err;
    }
  }

  async updateTask(taskId: string, data: Partial<CreateTaskData>): Promise<Task> {
    const { data: taskRow, error } = await supabase
      .from('tasks')
      .update({
        ...data,
        start_time: data.start_time ?? null,
        estimated_time: data.estimated_time ?? null,
        updated_at: new Date().toISOString(),
      } as TaskUpdate)
      .eq('id', taskId)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return mapToTask(taskRow);
  }

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      throw error;
    }
  }

  async getTask(taskId: string): Promise<Task> {
    const { data: taskRow, error } = await supabase
      .from('tasks')
      .select()
      .eq('id', taskId)
      .single();
    if (error) {
      throw error;
    }
    return mapToTask(taskRow);
  }

  async getTasks(workspaceId: string, projectId?: string): Promise<Task[]> {
    let query = supabase
      .from('tasks')
      .select('*, project:projects!inner(id, name, workspace_id)')
      .order('position');
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    query = query.eq('project.workspace_id', workspaceId);
    const { data: rows, error } = await query;
    if (error) {
      throw error;
    }
    return (rows as any[]).map(mapToTask);
  }

  async reorderTasks(taskPositions: { id: string; position: number }[], projectId: string): Promise<void> {
    const task_updates = taskPositions.map(tp => ({ id: tp.id, position: tp.position }));
    const { error } = await supabase
      .rpc('reorder_tasks', { task_updates, project_id_param: projectId });

    if (error) {
      throw error;
    }
  }
}

export const taskService = new TaskService(); 