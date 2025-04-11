import { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateProjectForm } from './CreateProjectForm';

interface ProjectListProps {
  projects: Array<{
    id: string;
    name: string;
    description: string | null;
    workspace_id: string;
    created_at: string;
    updated_at: string;
  }>;
}

function CreateProjectDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau projet</DialogTitle>
        </DialogHeader>
        <CreateProjectForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}

export function ProjectList({ projects }: ProjectListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projets</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau projet
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <CreateProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          setIsDialogOpen(false);
          toast.success('Projet créé avec succès');
        }}
      />
    </div>
  );
} 