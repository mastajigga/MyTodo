import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useWorkspace, WorkspaceType } from '@/lib/workspace/useWorkspace'
import { Label } from '@/components/ui/label'

const workspaceSchema = z.object({
  name: z.string().min(1, { message: 'Le nom est requis' }),
  description: z.string().optional(),
  type: z.enum(['family', 'professional', 'private'], {
    required_error: 'Le type est requis'
  })
})

type WorkspaceFormData = z.infer<typeof workspaceSchema>

interface CreateWorkspaceProps {
  onSuccess?: () => void
}

export function CreateWorkspace({ onSuccess }: CreateWorkspaceProps) {
  const { createWorkspace } = useWorkspace()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema)
  })

  const onSubmit = async (data: WorkspaceFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)
      await createWorkspace(data)
      reset()
      onSuccess?.()
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const workspaceTypes: { value: WorkspaceType; label: string }[] = [
    { value: 'family', label: 'Famille' },
    { value: 'professional', label: 'Professionnel' },
    { value: 'private', label: 'Privé' }
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom</Label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Mon espace de travail"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Description de l'espace de travail"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          {...register('type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="">Sélectionner un type</option>
          {workspaceTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Création...' : 'Créer'}
      </button>
    </form>
  )
} 