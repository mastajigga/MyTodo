'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { projectService } from '@/lib/services/projectService';
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
import { useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/lib/supabase/supabase-provider';

const projectSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  workspace_id: z.string().uuid('ID de l\'espace de travail invalide').optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectHeaderProps {
  workspaceId?: string;
}

export function ProjectHeader({ workspaceId }: ProjectHeaderProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      workspace_id: workspaceId,
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      await projectService.createProject(data);
      toast.success('Projet créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Erreur lors de la création du projet');
    }
  };

  return (
    <div className="flex items-center justify-end">
      <Button 
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Plus className="mr-2 h-4 w-4" />
        Nouveau projet
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-sm bg-card/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Créer un nouveau projet
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer un nouveau projet.
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
                      <Input placeholder="Mon super projet" {...field} />
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
                      <Textarea
                        placeholder="Description du projet..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Créer le projet
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 