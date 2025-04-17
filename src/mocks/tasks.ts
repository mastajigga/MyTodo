import { Task, TaskPriority, TaskStatus } from '@/types/task'

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implémenter l\'authentification',
    description: 'Ajouter l\'authentification avec Supabase',
    project_id: '1',
    status: 'todo' as TaskStatus,
    priority: 'high' as TaskPriority,
    position: 1,
    created_by: 'user-1',
    assigned_to: 'user-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    due_date: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Créer les composants UI',
    description: 'Créer les composants UI réutilisables',
    project_id: '1',
    status: 'in_progress' as TaskStatus,
    priority: 'medium' as TaskPriority,
    position: 2,
    created_by: 'user-1',
    assigned_to: 'user-2',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    due_date: '2024-01-20T00:00:00Z'
  },
  {
    id: '3',
    title: 'Configurer la base de données',
    description: 'Configurer les tables et les relations',
    project_id: '1',
    status: 'review' as TaskStatus,
    priority: 'urgent' as TaskPriority,
    position: 3,
    created_by: 'user-2',
    assigned_to: 'user-1',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    due_date: '2024-01-10T00:00:00Z'
  },
  {
    id: '4',
    title: 'Tester l\'application',
    description: 'Écrire et exécuter les tests',
    project_id: '1',
    status: 'done' as TaskStatus,
    priority: 'low' as TaskPriority,
    position: 4,
    created_by: 'user-2',
    assigned_to: 'user-2',
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
    due_date: '2024-01-25T00:00:00Z'
  }
] 