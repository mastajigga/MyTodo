import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { ProjectService } from '@/services/project.service';
import { toast } from 'sonner';
import { useWorkspaceContext } from '@/contexts/workspace-context';

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateProjectFormProps {
  onSuccess: () => void;
}

export function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { workspace } = useWorkspaceContext();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!workspace) {
      toast.error('Aucun espace de travail sélectionné');
      return;
    }

    try {
      setIsLoading(true);
      await ProjectService.createProject({
        name: data.name,
        description: data.description || null,
        workspace_id: workspace.id,
      });
      onSuccess();
    } catch (error) {
      toast.error('Erreur lors de la création du projet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                  placeholder="Description du projet (optionnelle)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Création...' : 'Créer le projet'}
        </Button>
      </form>
    </Form>
  );
} 