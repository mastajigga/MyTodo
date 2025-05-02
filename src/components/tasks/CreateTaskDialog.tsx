'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useAuth } from "@/lib/auth/useAuth";
import { toast } from "sonner";
import { taskService } from '@/services/task.service';
import { useProjects } from '@/hooks/useProjects';
import { useRouter } from 'next/navigation';
import { TaskSuccessModal } from './TaskSuccessModal';
import { useRef, useState } from 'react';
import { TaskStatus, TaskPriority } from '@/@types/task';

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().nullable(),
  status: z.enum(["todo", "in_progress", "review", "done"] as const),
  priority: z.enum(["low", "medium", "high", "urgent"] as const),
  due_date: z.string().nullable(),
  start_time: z.string().nullable(),
  estimated_time: z.number().nullable(),
  project_id: z.string().min(1, 'Le projet est requis'),
  assigned_to: z.string().nullable(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateTaskDialogProps {
  onSuccess?: (taskId: string) => void;
  onClose?: () => void;
}

export function CreateTaskDialog({ onSuccess, onClose }: CreateTaskDialogProps) {
  const { workspace } = useWorkspace();
  const { user } = useAuth();
  const { projects } = useProjects(workspace?.id || '');
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      due_date: null,
      start_time: null,
      estimated_time: null,
      project_id: projects && projects.length > 0 ? projects[0].id : '',
      assigned_to: null,
    },
  });
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const newTaskIdRef = useRef<string | null>(null);

  if (!workspace?.id) {
    return <div className="p-4 text-center text-gray-500">Aucun espace de travail sélectionné.</div>;
  }

  const onSubmit = async (data: FormData) => {
    if (!workspace?.id || !user?.id || !data.project_id) {
      toast.error("Une erreur est survenue");
      return;
    }

    try {
      const result = await taskService.createTask({
        ...data,
        description: data.description ?? '',
        due_date: data.due_date ?? null,
        start_time: data.start_time ?? null,
        workspace_id: workspace.id,
        project_id: data.project_id,
        created_by: user.id,
        assigned_to: data.assigned_to,
        position: 0,
      });
      toast.success("Tâche créée avec succès");
      form.reset();
      newTaskIdRef.current = result.id;
      setOpen(false);
      setTimeout(() => setShowSuccess(true), 200);
      if (onSuccess) onSuccess(result.id);
    } catch (error) {
      toast.error("Une erreur est survenue lors de la création de la tâche");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push('/tasks');
    setTimeout(() => {
      if (newTaskIdRef.current) {
        const el = document.getElementById(`task-${newTaskIdRef.current}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-green-400', 'transition-all');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-green-400', 'transition-all');
          }, 1500);
        }
      }
    }, 600);
  };

  const handleDialogClose = (open: boolean) => {
    setOpen(open);
    if (!open && onClose) onClose();
  };

  return (
    <>
      <TaskSuccessModal show={showSuccess} onClose={handleSuccessClose} />
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setOpen(true)}>Créer une tâche</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle tâche</DialogTitle>
            <DialogDescription>
              Ajoutez les détails de votre tâche ici. Cliquez sur sauvegarder une fois terminé.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre de la tâche" {...field} />
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
                        placeholder="Description de la tâche"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="todo">À faire</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="review">En revue</SelectItem>
                        <SelectItem value="done">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projet</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un projet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects?.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'échéance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de début</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimated_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temps estimé (en minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value ?? ''} 
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Créer la tâche</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
} 