'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workspace } from '@/hooks/useWorkspace';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
  const supabase = createClientComponentClient();

  const setWorkspace = (newWorkspace: Workspace | null) => {
    setWorkspaceState(newWorkspace);
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        if (typeof window === 'undefined') {
          console.info('[SERVEUR] Utilisateur non connecté');
        } else {
          console.log('[CLIENT] Utilisateur non connecté');
        }
        setWorkspaces([]);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      console.log('[DEBUG] Utilisateur récupéré pour workspaces:', user);
      if (!user) {
        console.warn('[DEBUG] Aucun utilisateur trouvé lors de la récupération des workspaces');
        return setWorkspaces([]);
      }
      const { data, error } = await supabase
        .from('workspace_members')
        .select('workspace_id, workspaces(*)')
        .eq('user_id', user.id);
      if (error) {
        console.error('[DEBUG] Erreur lors de la récupération des workspaces:', error);
      } else {
        console.log('[DEBUG] Résultat de la requête workspaces:', data);
      }
      const userWorkspaces = (data || [])
        .map((m: any) => m.workspaces)
        .filter(Boolean);
      console.log('[DEBUG] Workspaces finaux pour utilisateur', user.id, ':', userWorkspaces);
      setWorkspaces(userWorkspaces);
    };
    fetchWorkspaces();
  }, [supabase]);

  useEffect(() => {
    if (workspaces.length > 0 && !workspace) {
      setWorkspace(workspaces[0]);
    }
  }, [workspaces, workspace]);

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace, workspaces, setWorkspaces }}>
      {children}
    </WorkspaceContext.Provider>
  );
} 