import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/lib/auth/useAuth'
import { createClient } from '@supabase/supabase-js'
import { Label } from '@/components/ui/label'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const taskSchema = z.object({
  title: z.string().min(1, { message: 'Le titre est requis' }),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  due_date: z.string().optional()
})

type TaskFormData = z.infer<typeof taskSchema>

interface CreateTaskProps {
  projectId: string
}

export function CreateTask({ projectId }: CreateTaskProps) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema)
  })

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const { error: insertError } = await supabase.from('tasks').insert({
        project_id: projectId,
        title: data.title,
        description: data.description,
        priority: data.priority,
        due_date: data.due_date,
        status: 'todo',
        created_by: user?.id
      })

      if (insertError) throw insertError

      reset()
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Titre</Label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <Label htmlFor="priority">Priorité</Label>
        <select
          id="priority"
          {...register('priority')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="low">Basse</option>
          <option value="medium">Moyenne</option>
          <option value="high">Haute</option>
          <option value="urgent">Urgente</option>
        </select>
      </div>

      <div>
        <Label htmlFor="due_date">Date d'échéance</Label>
        <input
          id="due_date"
          type="date"
          {...register('due_date')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Création...' : 'Créer'}
      </button>
    </form>
  )
} 