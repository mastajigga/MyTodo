import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/lib/auth/useAuth'
import { Label } from '@/components/ui/label'

const registerSchema = z.object({
  email: z.string().email({ message: "L'email est requis" }),
  password: z.string().min(1, { message: 'Le mot de passe est requis' }),
  confirmPassword: z.string().min(1, { message: 'La confirmation du mot de passe est requise' })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const { signUp } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)
      await signUp(data.email, data.password)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
        {isSubmitting ? 'Inscription...' : "S'inscrire"}
      </button>
    </form>
  )
} 