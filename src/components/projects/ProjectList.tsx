'use client';

import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/lib/services/projectService';
import { ProjectCard } from './ProjectCard';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProjectListProps {
  workspaceId?: string;
}

export function ProjectList({ workspaceId }: ProjectListProps) {
  const {
    data: projects,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: () => projectService.getProjects(workspaceId)
  });

  const handleEdit = (project: any) => {
    // TODO: Implémenter la modification
    console.log('Edit project:', project);
  };

  const handleDelete = async (project: any) => {
    try {
      await projectService.deleteProject(project.id);
      toast.success('Projet supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression du projet');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Une erreur est survenue lors du chargement des projets : {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!projects?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Aucun projet trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
} 