'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/lib/services/projectService';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';
import { useCreateTaskDialog } from '@/components/providers/CreateTaskDialogProvider';
import { useSupabase } from '@/lib/supabase/useSupabase';

const projectSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectDetailHeaderProps {
  projectId: string;
}

export function ProjectDetailHeader({ projectId }: ProjectDetailHeaderProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const router = useRouter();
  const { openCreateTaskDialog } = useCreateTaskDialog();
  const { supabase } = useSupabase();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProject(supabase, projectId),
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      await projectService.updateProject(supabase, projectId, data);
      toast.success('Projet mis à jour avec succès');
      setEditDialogOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du projet');
    }
  };

  const handleDelete = async () => {
    try {
      await projectService.deleteProject(supabase, projectId);
      toast.success('Projet supprimé avec succès');
      router.push('/projects');
    } catch (error) {
      toast.error('Erreur lors de la suppression du projet');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded"></div>
        <div className="h-4 w-96 bg-muted rounded"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold">Projet non trouvé</h2>
        <p className="text-muted-foreground">
          Le projet que vous recherchez n'existe pas ou a été supprimé.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button onClick={() => openCreateTaskDialog(projectId)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle tâche
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => setEditDialogOpen(true)}>
          <Edit className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer le projet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
            <DialogDescription>
              Modifiez les informations du projet ci-dessous.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du projet</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Enregistrer les modifications
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <CreateTaskDialog />
    </div>
  );
} 