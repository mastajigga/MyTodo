import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { Task } from '@/types/task';

export const taskService = {
  async createTask(data: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'assigned_to'>) {
    const supabase = createClientComponentClient<Database>();
    const { data: task, error } = await supabase
      .from('tasks')
      .insert(data)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return task;
  },

  async getTask(id: string) {
    const supabase = createClientComponentClient<Database>();
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return task;
  },

  async updateTask(id: string, data: Partial<Task>) {
    const supabase = createClientComponentClient<Database>();
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
    const supabase = createClientComponentClient<Database>();
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async getWorkspaceTasks(workspaceId: string) {
    const supabase = createClientComponentClient<Database>();
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('workspace_id', workspaceId);

    if (error) throw new Error(error.message);
    return tasks;
  },

  async getProjectTasks(projectId: string) {
    const supabase = createClientComponentClient<Database>();
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw new Error(error.message);
    return tasks;
  }
}; 