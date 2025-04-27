'use client';

import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log('📤 Tentative de déconnexion avec Supabase...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }

      console.log('✅ Déconnexion réussie, redirection...');
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      toast.error('Une erreur est survenue lors de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full px-2 py-1.5 text-sm text-left text-red-600 hover:bg-red-100 dark:hover:bg-red-900/10 rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      disabled={isLoading}
      type="button"
      role="menuitem"
    >
      <div className="flex items-center w-full">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="mr-2 h-4 w-4" />
        )}
        <span>{isLoading ? 'Déconnexion...' : 'Se déconnecter'}</span>
      </div>
    </button>
  );
} 