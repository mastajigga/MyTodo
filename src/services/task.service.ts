import { supabase } from '@/lib/supabase/client';
import { Task, CreateTaskData, TaskStatus } from '@/types/task';

export const TaskService = {
  async getTasks(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        created_by_user:created_by(id, email, full_name, avatar_url),
        assigned_to_user:assigned_to(id, email, full_name, avatar_url),
        project:project_id(id, name),
        subtasks(id, title, completed)
      `)
      .eq('project_id', projectId)
      .order('position');
    
    if (error) throw error;
    return data as Task[];
  },

  async createTask(task: CreateTaskData): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...task,
        position: 0, // Position par défaut
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        created_by_user:created_by(id, email, full_name, avatar_url),
        assigned_to_user:assigned_to(id, email, full_name, avatar_url),
        project:project_id(id, name)
      `)
      .single();
    
    if (error) throw error;
    return data as Task;
  },

  async updateTask(id: string, task: Partial<Omit<Task, 'id' | 'created_at' | 'created_by'>>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...task,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        created_by_user:created_by(id, email, full_name, avatar_url),
        assigned_to_user:assigned_to(id, email, full_name, avatar_url),
        project:project_id(id, name)
      `)
      .single();
    
    if (error) throw error;
    return data as Task;
  },

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async reorderTasks(projectId: string, taskIds: string[]): Promise<void> {
    const updates = taskIds.map((id, index) => ({
      id,
      position: index,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('tasks')
      .upsert(updates);
    
    if (error) throw error;
  }
}; 