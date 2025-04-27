import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import { TaskStatus, TaskPriority } from '../common';
import type { Task, CreateTaskData, UpdateTaskData } from '../task';

// Création d'un client Supabase typé
const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

describe('Types Supabase', () => {
  describe('TaskStatus', () => {
    it('devrait avoir les bonnes valeurs', () => {
      const validStatuses = ['todo', 'in_progress', 'review', 'done'] as const;
      const statusValues = Object.values(TaskStatus);
      
      expect(statusValues).toHaveLength(validStatuses.length);
      validStatuses.forEach(status => {
        expect(statusValues).toContain(status);
      });
    });
  });

  describe('TaskPriority', () => {
    it('devrait avoir les bonnes valeurs', () => {
      const validPriorities = ['low', 'medium', 'high', 'urgent'] as const;
      const priorityValues = Object.values(TaskPriority);
      
      expect(priorityValues).toHaveLength(validPriorities.length);
      validPriorities.forEach(priority => {
        expect(priorityValues).toContain(priority);
      });
    });
  });

  describe('Task Interface', () => {
    it('devrait être compatible avec la définition de la base de données', () => {
      // Test de type statique
      const task: Task = {
        id: '1',
        title: 'Test Task',
        description: null,
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        due_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        workspace_id: '1',
        project_id: null,
        created_by: '1',
        assigned_to: null,
        tags: [],
        position: 0,
      };

      // Vérification que l'objet est valide
      expect(task).toBeTruthy();
      expect(task.status).toBe(TaskStatus.TODO);
      expect(task.priority).toBe(TaskPriority.MEDIUM);
    });
  });

  describe('Supabase Client', () => {
    it('devrait pouvoir effectuer des opérations CRUD typées', async () => {
      const newTask: CreateTaskData = {
        title: 'Test Task',
        description: null,
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        due_date: null,
        workspace_id: '1',
        project_id: null,
        created_by: '1',
        assigned_to: null,
        tags: [],
      };

      // Test de type statique pour l'insertion
      const { data: insertedTask, error: insertError } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();

      // Test de type statique pour la mise à jour
      const updateData: UpdateTaskData = {
        title: 'Updated Task',
        status: TaskStatus.IN_PROGRESS,
      };

      const { data: updatedTask, error: updateError } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', insertedTask?.id || '')
        .select()
        .single();

      // Test de type statique pour la suppression
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', insertedTask?.id || '');

      // Vérifications
      expect(insertError).toBeNull();
      expect(updateError).toBeNull();
      expect(deleteError).toBeNull();
    });
  });
}); 