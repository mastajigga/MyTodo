'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { TaskList } from '@/components/tasks/TaskList';
import { useEffect, useState } from 'react';
import { Task } from '@/types/task';
import { TaskService } from '@/services/task.service';
import { toast } from 'sonner';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasks = await TaskService.getTasks();
      setTasks(tasks);
    } catch (error) {
      toast.error('Erreur lors du chargement des tâches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskMove = async (taskId: string, completed: boolean) => {
    try {
      await TaskService.updateTask(taskId, {
        status: completed ? 'completed' : 'pending'
      });
      await loadTasks();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la tâche');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Mes tâches"
        description="Gérez et suivez vos tâches personnelles"
      />
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <TaskList tasks={tasks} onTaskMove={handleTaskMove} />
        )}
      </div>
    </div>
  );
} 