'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Database } from '../database.types'
import type { User } from '@supabase/auth-helpers-nextjs'

type SupabaseContext = {
  supabase: ReturnType<typeof createClientComponentClient<Database>>
  user: User | null
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    console.log('[DEBUG] Initialisation du provider Supabase');
    const fetchUser = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) {
          if (typeof window === 'undefined') {
            // Serveur
            console.info('[SERVEUR] Utilisateur non connecté');
          } else {
            // Client
            console.log('[CLIENT] Utilisateur non connecté');
          }
          setUser(null);
          return;
        }
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        setUser(null);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) {
          if (typeof window === 'undefined') {
            console.info('[SERVEUR] Utilisateur non connecté');
          } else {
            console.log('[CLIENT] Utilisateur non connecté');
          }
          setUser(null);
          router.refresh();
          return;
        }
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          setUser(user);
          router.refresh();
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  useEffect(() => {
    console.log('[DEBUG] Utilisateur dans le provider :', user);
  }, [user]);

  return (
    <Context.Provider value={{ supabase, user }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }

  return context
} 