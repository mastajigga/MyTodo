import { useCallback, useState } from 'react';
import { Project } from '@/types/project';
import { ProjectService } from '@/services/project.service';
import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CreateProjectDialog } from './CreateProjectDialog';

interface ProjectListProps {
  workspaceId: string;
}

export const ProjectList = ({ workspaceId }: ProjectListProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await ProjectService.getWorkspaceProjects(workspaceId);
      setProjects(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les projets',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, toast]);

  const handleCreateProject = async (project: Project) => {
    setProjects(prev => [project, ...prev]);
    setIsCreateDialogOpen(false);
    toast({
      title: 'Succès',
      description: 'Projet créé avec succès'
    });
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await ProjectService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast({
        title: 'Succès',
        description: 'Projet supprimé avec succès'
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le projet',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projets</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Aucun projet pour le moment. Créez-en un pour commencer !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </div>
      )}

      <CreateProjectDialog
        workspaceId={workspaceId}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateProject}
      />
    </div>
  );
}; 