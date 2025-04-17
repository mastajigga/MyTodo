import * as z from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().nullable().optional(),
  workspace_id: z.string().uuid('ID de l\'espace de travail invalide'),
});

export type ProjectFormValues = z.infer<typeof projectSchema>; 