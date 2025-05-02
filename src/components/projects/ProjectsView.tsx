'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateProjectButton } from '@/components/projects/CreateProjectButton';
import { ProjectList } from '@/components/projects/ProjectList';
import { EmptyState } from '@/components/shared/EmptyState';
import { FolderIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  workspace_id?: string;
  status?: string;
  updated_at?: string;
}

interface ProjectsViewProps {
  projects: Project[] | null;
}

export function ProjectsView({ projects }: ProjectsViewProps) {
  if (!projects?.length) {
    return (
      <EmptyState
        icon={FolderIcon}
        title="Aucun projet"
        description="Vous n'avez pas encore créé de projet. Commencez par en créer un !"
        action={
          <Link href="/projects/new">
            <Button>Créer un projet</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
            Mes projets
          </h1>
          <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full animate-gradient-x" />
          <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm animate-gradient-x" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid gap-6">
            <Card className="backdrop-blur-sm bg-card/50 shadow-2xl border-none animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                <CardTitle>Projets</CardTitle>
                <CreateProjectButton />
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ProjectList projects={projects.map(p => ({
                  ...p,
                  workspace_id: p.workspace_id || '',
                  status: (p.status as 'in_progress' | 'completed' | 'cancelled') || 'in_progress',
                  updated_at: p.updated_at || p.created_at || '',
                }))} />
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 