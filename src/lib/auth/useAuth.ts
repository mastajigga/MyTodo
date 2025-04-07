import { useState, useEffect } from 'react'
import { createClient, User, AuthError } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<AuthError | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifie la session actuelle
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setError(error)
      setLoading(false)
    }

    checkSession()

    // Écoute les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setError(null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      setUser(data.user)
    } catch (err) {
      setError(err as AuthError)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error
      setUser(data.user)
    } catch (err) {
      setError(err as AuthError)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (err) {
      setError(err as AuthError)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (err) {
      setError(err as AuthError)
    }
  }

  const signInWithGithub = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (err) {
      setError(err as AuthError)
    }
  }

  return {
    user,
    error,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGithub
  }
} 