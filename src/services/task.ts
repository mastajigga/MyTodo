import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { Task } from '@/types/task';
import { supabaseTestClient } from '@/lib/supabase/test-client';

type CreateTaskInput = {
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done' | 'review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  workspace_id: string;
  project_id: string;
  created_by: string;
  assigned_to?: string | null;
  deleted_at?: string | null;
  due_date?: string | null;
  estimated_time?: number | null;
  position: number;
  start_time?: string | null;
  tags: string[];
};

const getClient = () => {
  if (process.env.NODE_ENV === 'test') {
    return supabaseTestClient;
  }
  return createClientComponentClient<Database>();
};

export const taskService = {
  async createTask(data: CreateTaskInput) {
    const supabase = getClient();
    const { data: task, error } = await supabase
      .from('tasks')
      .insert(data)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return task;
  },

  async getTask(id: string) {
    const supabase = getClient();
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return task;
  },

  async updateTask(id: string, data: Partial<Task>) {
    const supabase = getClient();
    const { data: task, error } = await supabase
      .from('tasks')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return task;
  },

  async deleteTask(id: string) {
    const supabase = getClient();
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async getWorkspaceTasks(workspaceId: string) {
    const supabase = getClient();
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('workspace_id', workspaceId);

    if (error) throw new Error(error.message);
    return tasks;
  },

  async getProjectTasks(projectId: string) {
    const supabase = getClient();
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw new Error(error.message);
    return tasks;
  }
}; 