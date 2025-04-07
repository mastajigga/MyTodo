import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/lib/auth/useAuth'
import { Label } from '@/components/ui/label'

const loginSchema = z.object({
  email: z.string().email({ message: "L'email est requis" }),
  password: z.string().min(1, { message: 'Le mot de passe est requis' })
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { signIn, signInWithGoogle, signInWithGithub } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)
      await signIn(data.email, data.password)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      await signInWithGoogle()
    } catch (err) {
      setError(err as Error)
    }
  }

  const handleGithubSignIn = async () => {
    try {
      setError(null)
      await signInWithGithub()
    } catch (err) {
      setError(err as Error)
    }
  }

  return (
    <div className="space-y-6">
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

        {error && (
          <p className="text-sm text-red-600">{error.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div className="flex flex-col space-y-2">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Continuer avec Google
        </button>

        <button
          type="button"
          onClick={handleGithubSignIn}
          className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Continuer avec GitHub
        </button>
      </div>
    </div>
  )
} 