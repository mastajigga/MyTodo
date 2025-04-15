import { supabase } from '@/lib/supabase/client';
import { Task } from '@/types/task';

export const TaskService = {
  async getTasks(projectId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('position');
    
    if (error) throw error;
    return data;
  },

  async createTask(task: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTask(id: string, task: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(task)
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

  async reorderTasks(projectId: string, taskIds: string[]) {
    const updates = taskIds.map((id, index) => ({
      id,
      position: index
    }));

    const { error } = await supabase
      .from('tasks')
      .upsert(updates);
    
    if (error) throw error;
  }
}; 