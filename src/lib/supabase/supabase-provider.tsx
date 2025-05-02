'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState, useMemo } from 'react'
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
  const router = useRouter()
  
  // Créer une seule instance du client Supabase
  const supabase = useMemo(() => createClientComponentClient<Database>(), [])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    console.log('[DEBUG] Initialisation du provider Supabase');
    let mounted = true;

    const fetchUser = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!mounted) return;

        if (!sessionData?.session) {
          console.log('[CLIENT] Utilisateur non connecté');
          setUser(null);
          return;
        }

        const { data: { user }, error } = await supabase.auth.getUser();
        if (!mounted) return;
        
        if (error) throw error;
        setUser(user);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        if (mounted) {
          setUser(null);
        }
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[DEBUG] Changement d\'état d\'authentification:', event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (!session) {
          console.log('[CLIENT] Session invalide après connexion');
          if (mounted) {
            setUser(null);
            router.refresh();
          }
          return;
        }

        const { data: { user }, error } = await supabase.auth.getUser();
        if (!mounted) return;

        if (!error && user) {
          setUser(user);
          router.refresh();
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null);
          router.refresh();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    }
  }, [router, supabase]) // supabase est maintenant stable grâce à useMemo

  useEffect(() => {
    if (user) {
      console.log('[DEBUG] Utilisateur dans le provider :', {
        id: user.id,
        email: user.email
      });
    } else {
      console.log('[DEBUG] Utilisateur dans le provider : null');
    }
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