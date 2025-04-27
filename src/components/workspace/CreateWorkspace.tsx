import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useWorkspace } from '@/hooks/useWorkspace'
import type { WorkspaceType } from '@/types/supabase'
import { workspaceTypeLabels, workspaceTypeColors } from '@/types/supabase'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const workspaceSchema = z.object({
  name: z.string().min(1, { message: 'Le nom est requis' }),
  description: z.string().optional(),
  type: z.enum(['family', 'professional', 'private'] as const, {
    required_error: 'Le type est requis'
  }) satisfies z.ZodType<WorkspaceType>
})

type WorkspaceFormData = z.infer<typeof workspaceSchema>

export function CreateWorkspace() {
  const [isLoading, setIsLoading] = useState(false)
  const { createWorkspace } = useWorkspace()

  const form = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'private'
    }
  })

  const onSubmit = async (data: WorkspaceFormData) => {
    try {
      setIsLoading(true)
      await createWorkspace(data)
      form.reset()
    } catch (error) {
      console.error('Erreur lors de la création:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          {...form.register('name')}
          placeholder="Mon espace de travail"
          disabled={isLoading}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optionnelle)</Label>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="Description de votre espace de travail"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={form.watch('type')}
          onValueChange={(value: WorkspaceType) => form.setValue('type', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(workspaceTypeLabels).map(([type, label]) => (
              <SelectItem
                key={type}
                value={type}
                className={cn('cursor-pointer', workspaceTypeColors[type as WorkspaceType])}
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.type && (
          <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Création...' : 'Créer l\'espace de travail'}
      </Button>
    </form>
  )
} 