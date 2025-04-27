'use client';

import { supabase } from '@/lib/supabase/client';
import { Task, CreateTaskData } from '@/types/task';
import { Database } from '@/lib/database.types';

type Tables = Database['public']['Tables'];
type TaskRow = Tables['tasks']['Row'];
type TaskInsert = Tables['tasks']['Insert'];
type TaskUpdate = Tables['tasks']['Update'];

class TaskService {
  async createTask(data: CreateTaskData): Promise<Task> {
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        position: 0,
      } as TaskInsert)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return task as Task;
  }

  async updateTask(taskId: string, data: Partial<CreateTaskData>): Promise<Task> {
    const { data: task, error } = await supabase
      .from('tasks')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      } as TaskUpdate)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return task as Task;
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
    const { data: task, error } = await supabase
      .from('tasks')
      .select()
      .eq('id', taskId)
      .single();

    if (error) {
      throw error;
    }

    return task as Task;
  }

  async getTasks(workspaceId: string, projectId?: string): Promise<Task[]> {
    let query = supabase
      .from('tasks')
      .select()
      .eq('workspace_id', workspaceId)
      .order('position');

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data: tasks, error } = await query;

    if (error) {
      throw error;
    }

    return tasks as Task[];
  }

  async reorderTasks(taskPositions: { id: string; position: number }[]): Promise<void> {
    const { error } = await supabase
      .rpc('reorder_tasks', { task_positions: taskPositions });

    if (error) {
      throw error;
    }
  }
}

export const taskService = new TaskService(); 