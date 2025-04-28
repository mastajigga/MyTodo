'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateProjectButton } from '@/components/projects/CreateProjectButton';
import { ProjectList } from '@/components/projects/ProjectList';
import { EmptyState } from '@/components/shared/EmptyState';
import { FolderIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="relative mb-6 sm:mb-8 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
          Mes projets
        </h1>
        <div className="absolute -bottom-2 left-0 w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
        <div className="absolute -bottom-2 left-0 w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
      </div>

      <div className="grid gap-4 sm:gap-6">
        <Card className="backdrop-blur-sm bg-card/50">
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
    </div>
  );
} 