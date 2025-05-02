'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { Task, CreateTaskData } from '@/@types/task';

function mapToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    status: row.status,
    priority: row.priority,
    project_id: row.project_id,
    workspace_id: row.workspace_id,
    position: row.position,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
    due_date: row.due_date ?? null,
    start_time: row.start_time ?? null,
    estimated_time: row.estimated_time ?? null,
    created_by: row.created_by,
    assigned_to: row.assigned_to,
    tags: row.tags ?? null,
    project: row.project ? {
      id: row.project.id,
      name: row.project.name,
      workspace_id: row.project.workspace_id,
    } : undefined,
    created_by_user: row.created_by_user,
    assigned_to_user: row.assigned_to_user,
  };
}

export const taskService = {
  async getTasks(workspaceId: string, projectId?: string): Promise<Task[]> {
    const supabase = createClientComponentClient<Database>();
    
    try {
      if (projectId) {
        const { data: rows, error } = await supabase
          .from('tasks')
          .select(`
            *,
            project:projects(id, name, workspace_id),
            created_by_user:profiles!created_by(id, email, full_name, avatar_url),
            assigned_to_user:profiles(id, email, full_name, avatar_url)
          `)
          .eq('project_id', projectId)
          .is('deleted_at', null)
          .order('position');

        if (error) {
          console.error('[TaskService] Erreur lors de la récupération des tâches:', error);
          throw error;
        }
        return (rows as any[]).map(mapToTask);
      }

      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id')
        .eq('workspace_id', workspaceId);

      if (projectsError) {
        console.error('[TaskService] Erreur lors de la récupération des projets:', projectsError);
        throw projectsError;
      }

      if (!projects || projects.length === 0) {
        return [];
      }

      const projectIds = projects.map(p => p.id);

      const { data: rows, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(id, name, workspace_id),
          created_by_user:profiles!created_by(id, email, full_name, avatar_url),
          assigned_to_user:profiles(id, email, full_name, avatar_url)
        `)
        .in('project_id', projectIds)
        .is('deleted_at', null)
        .order('position');

      if (error) {
        console.error('[TaskService] Erreur lors de la récupération des tâches:', error);
        throw error;
      }
      return (rows as any[]).map(mapToTask);
    } catch (error) {
      console.error('[TaskService] Erreur inattendue:', error);
      throw error;
    }
  },

  async getTask(id: string): Promise<Task> {
    const supabase = createClientComponentClient<Database>();
    const { data: taskRow, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(id, name),
        created_by_user:profiles!created_by(id, email, full_name, avatar_url),
        assigned_to_user:profiles(id, email, full_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapToTask(taskRow);
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    const supabase = createClientComponentClient<Database>();
    const { data: task, error } = await supabase
      .from('tasks')
      .insert(data)
      .select(`
        *,
        project:projects(id, name),
        created_by_user:profiles!created_by(id, email, full_name, avatar_url),
        assigned_to_user:profiles(id, email, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return mapToTask(task);
  },

  async updateTask(id: string, data: Partial<CreateTaskData>): Promise<Task> {
    const supabase = createClientComponentClient<Database>();
    const { data: task, error } = await supabase
      .from('tasks')
      .update(data)
      .eq('id', id)
      .select(`
        *,
        project:projects(id, name),
        created_by_user:profiles!created_by(id, email, full_name, avatar_url),
        assigned_to_user:profiles(id, email, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return mapToTask(task);
  },

  async deleteTask(id: string): Promise<void> {
    const supabase = createClientComponentClient<Database>();
    const { error } = await supabase
      .from('tasks')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }
}; 