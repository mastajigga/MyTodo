import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/lib/auth/useAuth'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const taskSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  due_date: z.string().optional()
})

type TaskFormData = z.infer<typeof taskSchema>

interface CreateTaskProps {
  projectId: string
}

export const CreateTask = ({ projectId }: CreateTaskProps) => {
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'medium'
    }
  })

  const onSubmit = async (data: TaskFormData) => {
    if (!user) return

    setIsSubmitting(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('tasks')
        .insert({
          project_id: projectId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          due_date: data.due_date,
          status: 'todo',
          created_by: user.id
        })

      if (insertError) throw insertError

      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Titre de la tâche"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Description de la tâche"
        />
      </div>

      <div>
        <Label htmlFor="priority">Priorité</Label>
        <Select id="priority" {...register('priority')}>
          <option value="low">Basse</option>
          <option value="medium">Moyenne</option>
          <option value="high">Haute</option>
          <option value="urgent">Urgente</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="due_date">Date d'échéance</Label>
        <Input
          id="due_date"
          type="date"
          {...register('due_date')}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Création...' : 'Créer'}
      </Button>
    </form>
  )
} 