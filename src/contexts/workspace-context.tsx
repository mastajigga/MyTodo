'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Workspace } from '@/types/workspace';
import { supabase } from '@/lib/supabase/client';

interface WorkspaceContextType {
  workspace: Workspace | null;
  setWorkspace: (workspace: Workspace | null) => void;
  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  
  if (!context) {
    throw new Error('useWorkspaceContext doit être utilisé à l\'intérieur d\'un WorkspaceProvider');
  }
  
  return context;
}

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [workspace, setWorkspaceState] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const setWorkspace = (newWorkspace: Workspace | null) => {
    setWorkspaceState(newWorkspace);
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        setWorkspaces([]);
        setWorkspace(null);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setWorkspaces([]);
        setWorkspace(null);
        return;
      }

      const { data, error } = await supabase
        .from('workspace_members')
        .select('workspace_id, workspaces(*)')
        .eq('user_id', user.id);

      if (error) {
        console.error('[WorkspaceProvider] Erreur lors de la récupération des workspaces:', error);
        return;
      }

      const userWorkspaces = (data || [])
        .map((m: any) => m.workspaces)
        .filter(Boolean);
      setWorkspaces(userWorkspaces);

      // Sélectionner automatiquement le premier workspace si aucun n'est sélectionné
      if (userWorkspaces.length > 0 && !workspace) {
        setWorkspace(userWorkspaces[0]);
      }
    };

    fetchWorkspaces();

    // Souscrire aux changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setWorkspaces([]);
        setWorkspace(null);
      } else if (event === 'SIGNED_IN') {
        fetchWorkspaces();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace, workspaces, setWorkspaces }}>
      {children}
    </WorkspaceContext.Provider>
  );
} 