'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { EmptyState } from '@/components/shared/EmptyState';
import { CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  project: {
    name: string;
  };
  created_at: string;
}

interface TasksViewProps {
  tasks: Task[] | null;
}

export function TasksView({ tasks }: TasksViewProps) {
  if (!tasks?.length) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="Aucune tâche"
        description="Vous n'avez pas encore créé de tâche. Commencez par en créer une !"
        action={
          <Link href="/tasks/new">
            <Button>Créer une tâche</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="relative mb-6 sm:mb-8 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
          Mes tâches
        </h1>
        <div className="absolute -bottom-2 left-0 w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
        <div className="absolute -bottom-2 left-0 w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
      </div>

      <div className="grid gap-4 sm:gap-6">
        <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle>Tableau Kanban</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-14rem)] lg:h-[calc(100vh-16rem)] overflow-x-auto">
              <div className="min-w-full p-4 sm:p-6">
                <KanbanBoard tasks={tasks} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 