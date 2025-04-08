'use client';

import { useEffect, useState } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';
import { Task } from '@/types/task';
import { useSupabase } from '@/hooks/useSupabase';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();

  useEffect(() => {
    fetchTasks();
    // Souscription aux changements en temps réel
    const channel = supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setTasks(data || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des tâches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (values: any) => {
    try {
      const { data, error } = await supabase.from('tasks').insert([
        {
          ...values,
          status: 'todo',
          created_by: (await supabase.auth.getUser()).data.user?.id,
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success('Tâche créée avec succès');
      await fetchTasks();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création de la tâche');
      throw error;
    }
  };

  const handleTaskMove = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', draggableId);

      if (error) {
        throw error;
      }

      await fetchTasks();
    } catch (error: any) {
      toast.error('Erreur lors du déplacement de la tâche');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Chargement des tâches...</h2>
          <p className="text-muted-foreground">
            Veuillez patienter un instant...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Gérez vos tâches et suivez leur progression
          </p>
        </div>
        <CreateTaskDialog onSubmit={handleCreateTask} />
      </div>

      <TaskList tasks={tasks} onTaskMove={handleTaskMove} />
    </div>
  );
} 