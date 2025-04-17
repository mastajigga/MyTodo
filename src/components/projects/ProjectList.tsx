'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/lib/services/projectService';
import { ProjectCard } from './ProjectCard';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectFormValues, projectSchema } from '@/lib/validations/project';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { stagger, scale, listItem } from '@/lib/animations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

interface ProjectListProps {
  workspaceId?: string;
}

export function ProjectList({ workspaceId }: ProjectListProps) {
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });

  const {
    data: projects,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: () => projectService.getProjects(workspaceId),
    enabled: true
  });

  const handleEdit = (project: any) => {
    setEditingProject(project);
    form.reset({
      name: project.name,
      description: project.description,
      workspace_id: project.workspace_id,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (data: ProjectFormValues) => {
    try {
      await projectService.updateProject(editingProject.id, data);
      toast.success('Projet modifié avec succès');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsEditDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      toast.error('Erreur lors de la modification du projet');
    }
  };

  const handleDelete = async (project: any) => {
    try {
      await projectService.deleteProject(project.id);
      toast.success('Projet supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      toast.error('Erreur lors de la suppression du projet');
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-48 flex items-center justify-center"
      >
        <motion.div 
          animate={{ 
            rotate: 360,
            transition: { duration: 1, repeat: Infinity, ease: "linear" }
          }}
          className="rounded-full h-8 w-8 border-b-2 border-primary"
        />
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Une erreur est survenue lors du chargement des projets : {error.message}
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (!projects?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center py-10"
      >
        <p className="text-muted-foreground">Aucun projet trouvé</p>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence mode="sync">
        <motion.div
          key="project-grid"
          variants={stagger}
          initial="initial"
          animate="animate"
          exit="exit"
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
        >
          {projects.map((project, index) => {
            const safeProject = { ...project, description: project.description ?? null };
            return (
              <motion.div
                key={safeProject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                layout
                className="group relative h-[250px]"
              >
                <Card className="backdrop-blur-sm bg-card/50 hover:shadow-xl transition-all duration-300 border-none h-full flex flex-col transform hover:scale-[1.02] hover:-translate-y-1">
                  <Link href={`/projects/${safeProject.id}`} className="flex-grow">
                    <CardHeader className="flex-grow">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent line-clamp-1">
                          {safeProject.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              handleEdit(safeProject);
                            }}
                            className="hover:bg-primary/20"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(safeProject.id);
                            }}
                            className="hover:bg-destructive/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="line-clamp-3 mt-2 h-[60px]">
                        {safeProject.description || "Aucune description"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(safeProject.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {safeProject.members?.length || 0} membres
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isEditDialogOpen && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px] backdrop-blur-sm bg-card/50">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  Modifier le projet
                </DialogTitle>
                <DialogDescription>
                  Modifiez les informations du projet ci-dessous.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du projet</FormLabel>
                        <FormControl>
                          <Input {...field} className="backdrop-blur-sm bg-card/50" />
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
                          <Textarea {...field} value={field.value ?? ''} className="backdrop-blur-sm bg-card/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Enregistrer les modifications
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
} 