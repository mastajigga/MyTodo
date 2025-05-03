'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/supabase/supabase-provider'
import type { Database } from '../../types/supabase';
import type { Task } from '../../types/task';

export const TaskList = ({ workspaceId }: { workspaceId: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | null>(null);
  const [prioritySort, setPrioritySort] = useState<'asc' | 'desc' | null>(null);
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*', { count: 'exact' })
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTasks(data || []);
      } catch (err) {
        setError('Erreur lors du chargement des tâches');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [workspaceId, supabase]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (tasks.length === 0) return <div>Aucune tâche disponible</div>;

  const filteredTasks = tasks
    .filter(task => 
      (!statusFilter || task.status === statusFilter) &&
      (!searchQuery || task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (!prioritySort) return 0;
      const priorityOrder: Record<Task['priority'], number> = { 
        low: 1, 
        medium: 2, 
        high: 3, 
        urgent: 4 
      };
      return prioritySort === 'asc' 
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded"
          aria-label="Rechercher une tâche"
        />
        
        <button
          onClick={() => setStatusFilter(statusFilter === 'todo' ? null : 'todo')}
          className="px-4 py-2 border rounded"
          aria-label="Filtrer par statut"
        >
          Filtrer
        </button>
        
        <button
          onClick={() => setPrioritySort(prioritySort === 'asc' ? 'desc' : 'asc')}
          className="px-4 py-2 border rounded"
          aria-label="Trier par priorité"
        >
          Trier par priorité
        </button>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task: Task) => (
          <div key={task.id} className="p-4 border rounded">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <div className="mt-2 space-y-2">
              <p>Statut: {task.status === 'todo' ? 'À faire' : task.status === 'in_progress' ? 'En cours' : 'Terminé'}</p>
              <p>Priorité: {task.priority}</p>
              {task.assignee && <p>Assigné à: {task.assignee.full_name}</p>}
              {task.due_date && <p>Date limite: {new Date(task.due_date).toLocaleDateString()}</p>}
              {task.tags.length > 0 && (
                <div className="flex gap-2">
                  {task.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 text-sm bg-gray-100 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 