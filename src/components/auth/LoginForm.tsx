'use client';

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Link from 'next/link'
import { AuthError } from '@supabase/supabase-js'

const loginSchema = z.object({
  email: z.string().min(1, "L'email est requis").email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

type LoginFormData = z.infer<typeof loginSchema>

const getErrorMessage = (error: AuthError) => {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Email ou mot de passe incorrect'
    case 'Email not confirmed':
      return 'Veuillez confirmer votre email avant de vous connecter'
    case 'User not found':
      return 'Aucun compte trouvé avec cet email'
    default:
      return 'Une erreur est survenue lors de la connexion'
  }
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setErrorMessage(getErrorMessage(error))
        return
      }

      toast.success('Connexion réussie')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage(getErrorMessage(error))
      } else {
        setErrorMessage('Une erreur est survenue')
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setErrorMessage('Erreur lors de la connexion avec Google')
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage(getErrorMessage(error))
      } else {
        setErrorMessage('Une erreur est survenue')
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setErrorMessage('Erreur lors de la connexion avec GitHub')
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage(getErrorMessage(error))
      } else {
        setErrorMessage('Une erreur est survenue')
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4 rounded-md shadow-sm">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              disabled={isLoading}
              aria-invalid={errors.email ? 'true' : 'false'}
              placeholder="Email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              disabled={isLoading}
              aria-invalid={errors.password ? 'true' : 'false'}
              placeholder="Mot de passe"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4" role="alert">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
              </div>
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Chargement...' : 'Se connecter'}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Ou continuer avec</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Google
          </button>
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            GitHub
          </button>
        </div>
      </form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Pas encore de compte ?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
} 