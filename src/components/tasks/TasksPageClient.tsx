"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TasksView } from '@/components/tasks/TasksView';
import { TaskList } from '@/components/tasks/TaskList';
import { TopNav } from '@/components/layout/TopNav';
import { motion } from 'framer-motion';
import { Task } from '@/@types/task';

interface TasksPageClientProps {
  tasks: Task[];
  workspaceId: string;
}

export const TasksPageClient = ({ tasks, workspaceId }: TasksPageClientProps) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <TopNav />
      <div className="relative z-10 pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header />
          <div className="grid gap-6">
            <Card className="backdrop-blur-sm bg-card/50 shadow-2xl border-none animate-fade-in">
              <CardHeader className="space-y-1">
                <CardTitle>Gestion des tâches</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="board" className="w-full">
                  <div className="px-6 border-b">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger value="board">Tableau Kanban</TabsTrigger>
                      <TabsTrigger value="list">Liste des tâches</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="board" className="m-0">
                    <div className="h-[calc(100vh-24rem)] overflow-x-auto">
                      <div className="min-w-full p-6">
                        <TasksView tasks={tasks} />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="list" className="m-0">
                    <div className="p-6">
                      <TaskList workspaceId={workspaceId} />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

function Header() {
  return (
    <div className="relative mb-12 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
        Mes tâches
      </h1>
      <p className="mt-2 text-muted-foreground animate-fade-in delay-100">Toutes vos tâches, organisées par projet.</p>
      <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full animate-gradient-x" />
      <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm animate-gradient-x" />
    </div>
  );
} 