'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { EmptyState } from '@/components/shared/EmptyState';
import { CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useProjects } from '@/hooks/useProjects';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo, useRef } from 'react';
import { CreateTaskDialog } from './CreateTaskDialog';
import { Task, TaskPriority } from '@/@types/task';

interface TasksViewProps {
  tasks: Task[] | null;
}

export function TasksView({ tasks }: TasksViewProps) {
  const { workspace } = useWorkspace();
  const { projects } = useProjects(workspace?.id || '');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const newTaskIdRef = useRef<string | null>(null);

  // Filtrage des tâches selon le projet sélectionné
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    if (selectedProjectId === 'all') {
      return tasks;
    }
    return tasks.filter(task => task.project_id === selectedProjectId);
  }, [tasks, selectedProjectId]);

  // Gestion du surlignage de la nouvelle tâche
  const handleTaskCreated = (taskId: string) => {
    setShowCreateTask(false);
    setTimeout(() => {
      newTaskIdRef.current = taskId;
      const el = document.getElementById(`task-${taskId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-green-400', 'transition-all');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-green-400', 'transition-all');
          newTaskIdRef.current = null;
        }, 5000);
      }
    }, 600);
  };

  if (!tasks?.length) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="Aucune tâche"
        description="Vous n'avez pas encore créé de tâche. Commencez par en créer une !"
        action={
          <Button onClick={() => setShowCreateTask(true)}>Créer une tâche</Button>
        }
      />
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 lg:mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
            Mes tâches
          </h1>
          <div className="relative">
            <div className="absolute -bottom-2 left-0 w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
            <div className="absolute -bottom-2 left-0 w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Filtrer par projet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les projets</SelectItem>
              {projects && projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowCreateTask(true)}>
            Ajouter une nouvelle tâche
          </Button>
        </div>
      </div>
      <div className="grid gap-4 sm:gap-6">
        <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle>Tableau Kanban</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-14rem)] lg:h-[calc(100vh-16rem)] overflow-x-auto">
              <div className="min-w-full p-4 sm:p-6">
                <KanbanBoard tasks={filteredTasks} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {showCreateTask && (
        <CreateTaskDialog onSuccess={handleTaskCreated} onClose={() => setShowCreateTask(false)} />
      )}
    </div>
  );
} 