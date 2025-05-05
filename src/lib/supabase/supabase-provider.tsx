'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { Database } from '../database.types'
import type { User } from '@supabase/auth-helpers-nextjs'
import { v4 as uuidv4 } from 'uuid'

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
  const [mountId] = useState(() => uuidv4())

  useEffect(() => {
    console.log(`[DEBUG] Initialisation du provider Supabase (mountId: ${mountId})`);
    let mounted = true;

    const fetchUser = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('[DEBUG] Session récupérée:', sessionData);
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
        console.debug('[SupabaseProvider] fetchUser - user:', user);
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
      console.log(`[DEBUG] (mountId: ${mountId}) Changement d'état d'authentification:`, event);
      console.log(`[DEBUG] (mountId: ${mountId}) Session reçue:`, session);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (!session) {
          console.log('[CLIENT] Session invalide après connexion');
          if (mounted) {
            setUser(null);
            router.refresh();
          }
          return;
        }
        const sessionCheck = await supabase.auth.getSession();
        console.log(`[DEBUG] (mountId: ${mountId}) getSession après SIGNED_IN:`, sessionCheck);
        setTimeout(async () => {
          console.log(`[DEBUG] (mountId: ${mountId}) Avant setTimeout getUser`);
          try {
            const { data: { user }, error } = await supabase.auth.getUser();
            console.log(`[DEBUG] (mountId: ${mountId}) getUser après délai SIGNED_IN:`, user, error);
            if (!mounted) return;
            if (!error && user) {
              setUser(user);
              console.debug('[SupabaseProvider] onAuthStateChange - user:', user);
              router.refresh();
            }
          } catch (err) {
            console.error(`[DEBUG] (mountId: ${mountId}) Erreur dans setTimeout getUser:`, err);
          }
        }, 300);
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
  }, [router, supabase, mountId])

  // Forcer une récupération de session après 2 secondes si user est toujours null
  useEffect(() => {
    if (user !== null) return;
    const timeout = setTimeout(() => {
      supabase.auth.getSession().then(({ data }) => {
        console.log('[DEBUG] Session forcée après délai:', data);
      });
    }, 2000);
    return () => clearTimeout(timeout);
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      console.log('[DEBUG] Utilisateur dans le provider :', {
        id: user.id,
        email: user.email
      });
      console.debug('[SupabaseProvider] useEffect user:', user);
    } else {
      console.log('[DEBUG] Utilisateur dans le provider : null');
      console.debug('[SupabaseProvider] useEffect user: null');
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