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

const registerSchema = z.object({
  fullName: z.string().min(2, 'Le nom complet doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      
      // Inscription avec Supabase
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      // Création du profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: (await supabase.auth.getUser()).data.user?.id,
            full_name: data.fullName,
          },
        ])

      if (profileError) {
        throw profileError
      }

      toast.success('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.')
      router.push('/auth/login')
    } catch (error) {
      toast.error('Erreur lors de l\'inscription')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            {...register('fullName')}
            type="text"
            placeholder="Nom complet"
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            {...register('email')}
            type="email"
            placeholder="Email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            {...register('password')}
            type="password"
            placeholder="Mot de passe"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            {...register('confirmPassword')}
            type="password"
            placeholder="Confirmer le mot de passe"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Inscription...' : 'S\'inscrire'}
        </Button>
      </form>
    </div>
  )
} 