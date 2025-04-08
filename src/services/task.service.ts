import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Task, TaskStatus } from '@/types/task';

const supabase = createClientComponentClient();

export const TaskService = {
  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getTask(id: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, subtasks(*), comments(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getProjectTasks(projectId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateTaskStatus(id: string, status: TaskStatus) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
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

    if (error) throw error;
    return data;
  },

  async updateSubtask(id: string, completed: boolean) {
    const { data, error } = await supabase
      .from('subtasks')
      .update({ completed, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createComment(taskId: string, userId: string, content: string) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        task_id: taskId,
        user_id: userId,
        content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTaskComments(taskId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(name, avatar_url)')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}; 