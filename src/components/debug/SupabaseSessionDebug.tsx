import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Session } from '@supabase/supabase-js';

const SupabaseSessionDebug = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setError(error.message);
        setSession(null);
        console.error('[SupabaseSessionDebug] Erreur récupération session:', error);
      } else {
        setSession(data.session);
        console.log('[SupabaseSessionDebug] Session récupérée:', data.session);
        if (data.session) {
          console.log('[SupabaseSessionDebug] UID:', data.session.user?.id);
          console.log('[SupabaseSessionDebug] Access token:', data.session.access_token);
          console.log('[SupabaseSessionDebug] Expiration:', data.session.expires_at);
        }
      }
    } catch (e: any) {
      setError(e.message);
      setSession(null);
      console.error('[SupabaseSessionDebug] Exception:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
      console.log('[SupabaseSessionDebug] Changement de session:', session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    console.log('[SupabaseSessionDebug] Déconnexion effectuée');
  };

  return (
    <div className="p-4 bg-gray-100 rounded border border-gray-300 max-w-xl mx-auto mt-8">
      <h2 className="text-lg font-bold mb-2">Debug Session Supabase</h2>
      {loading && <div>Chargement de la session...</div>}
      {error && <div className="text-red-500">Erreur: {error}</div>}
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded mr-2"
        onClick={fetchSession}
        aria-label="Rafraîchir la session"
      >
        Rafraîchir
      </button>
      <button
        className="px-3 py-1 bg-red-500 text-white rounded"
        onClick={handleLogout}
        aria-label="Déconnexion"
      >
        Déconnexion
      </button>
      <div className="mt-4 text-sm">
        <div><b>user.id</b>: {session?.user?.id || <span className="text-gray-400">Aucun</span>}</div>
        <div><b>access_token</b>: <span className="break-all">{session?.access_token || <span className="text-gray-400">Aucun</span>}</span></div>
        <div><b>expires_at</b>: {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : <span className="text-gray-400">Aucune</span>}</div>
        <div className="mt-2">
          <b>Session complète :</b>
          <pre className="bg-gray-200 p-2 rounded overflow-x-auto max-h-64">{JSON.stringify(session, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSessionDebug; 