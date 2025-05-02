import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { taskService } from "@/services/task.service";
import { toast } from "sonner";
import { z as zod } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  due_date: z.string().optional(),
  start_time: z.string().optional(),
  estimated_time: z.preprocess(
    (val) => val === '' || val === null || val === undefined ? undefined : Number(val),
    z.number({ invalid_type_error: "Le temps estimé est requis" })
      .min(1, "Le temps estimé est requis")
      .or(z.literal(undefined))
      .or(z.literal(null))
  )
    .transform(val => (typeof val === 'number' && !isNaN(val) ? val : undefined))
    .refine(val => val === undefined || val === null || typeof val === 'number', { message: 'Le temps estimé doit être un nombre' }),
});

type TaskFormData = Omit<z.infer<typeof taskSchema>, 'estimated_time'> & { estimated_time?: number };

interface CreateTaskProps {
  projectId: string;
  workspaceId: string;
  onSuccess: () => void;
}

export function CreateTask({ projectId, workspaceId, onSuccess }: CreateTaskProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema as any),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      due_date: undefined,
      start_time: undefined,
      estimated_time: undefined,
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      const result = await taskService.createTask({
        ...data,
        description: data.description ?? null,
        due_date: data.due_date ?? null,
        project_id: projectId,
        status: "todo",
        workspace_id: workspaceId,
        created_by: "",
        assigned_to: null,
        tags: [],
      });
      onSuccess();
      toast.success("Tâche créée avec succès");
      form.reset({
        title: "",
        description: "",
        priority: "medium",
        due_date: undefined,
        start_time: undefined,
        estimated_time: undefined,
      });
    } catch (error) {
      toast.error("Erreur lors de la création de la tâche");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Titre</FormLabel>
              <FormControl>
                <Input id="title" placeholder="Titre de la tâche" {...field} />
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
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="Description de la tâche (optionnelle)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="priority">Priorité</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger id="priority">
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
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="due_date">Date d'échéance</FormLabel>
              <FormControl>
                <Input id="due_date" type="date" {...field} />
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
              <FormLabel htmlFor="start_time">Heure de début</FormLabel>
              <FormControl>
                <Input id="start_time" type="datetime-local" {...field} />
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
              <FormLabel htmlFor="estimated_time">Temps estimé (en minutes)</FormLabel>
              <FormControl>
                <Input id="estimated_time" type="number" min={1} {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} data-testid="submit-task-btn">
          Créer la tâche
        </Button>
      </form>
    </Form>
  );
} 