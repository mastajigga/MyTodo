import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      setUser(user)
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        await fetchUser()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchUser])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      await fetchUser()
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error
      await fetchUser()
    } catch (error) {
      console.error('Erreur lors de la création de compte:', error)
      throw error
    }
  }

  const signOut = useCallback(async () => {
    console.log('🎯 Fonction signOut du hook useAuth appelée');
    try {
      console.log('📤 Tentative de déconnexion Supabase...');
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('❌ Erreur Supabase lors de la déconnexion:', error);
        throw error;
      }
      console.log('✅ Déconnexion Supabase réussie');

      console.log('🔄 Mise à jour de l\'état local...');
      setUser(null)
      setLoading(false)
      console.log('✅ État local mis à jour');

      console.log('🔄 Redirection vers la page de connexion...');
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error)
      throw error
    }
  }, [supabase, router])

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la connexion avec Google:', error)
      throw error
    }
  }

  const signInWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la connexion avec GitHub:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGithub
  }
} 