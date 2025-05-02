import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = 'https://eahjdvmpmqwnupsqnxjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaGpkdm1wbXF3bnVwc3FueGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NjMzMTksImV4cCI6MjA1OTUzOTMxOX0.Vx-9AwjbT_hTPOzBQPi8wt5j5EDZYRiCiT85rm2_nPA';

describe('Tests de Connexion Supabase', () => {
  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  it('devrait se connecter à Supabase avec succès', async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('count')
      .limit(1)
      .single();

    expect(error).toBeNull();
    expect(data).not.toBeNull();
  });

  it('devrait pouvoir récupérer les tâches', async () => {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .limit(5);

    expect(error).toBeNull();
    expect(Array.isArray(tasks)).toBe(true);
    
    if (tasks && tasks.length > 0) {
      const task = tasks[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('description');
      expect(task).toHaveProperty('status');
      expect(task).toHaveProperty('priority');
    }
  });

  it('devrait pouvoir filtrer les tâches par statut', async () => {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'pending')
      .limit(5);

    expect(error).toBeNull();
    expect(Array.isArray(tasks)).toBe(true);
    tasks?.forEach(task => {
      expect(task.status).toBe('pending');
    });
  });
}); 