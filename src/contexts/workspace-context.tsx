'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Database } from '../lib/database.types';
import { toast } from 'sonner';
import { WorkspaceService } from '@/services/workspace.service';

type Workspace = Database['public']['Tables']['workspaces']['Row'];

interface WorkspaceContextType {
  workspace: Workspace | null;
  workspaces: Workspace[];
  setWorkspace: (workspace: Workspace | null) => void;
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        const workspacesList = await WorkspaceService.getWorkspaces();
        setWorkspaces(workspacesList);
        if (workspacesList.length > 0) {
          setWorkspace(workspacesList[0]);
        }
      } catch (error) {
        toast.error('Erreur lors du chargement de l\'espace de travail');
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspace();
  }, []);

  return (
    <WorkspaceContext.Provider value={{ workspace, workspaces, setWorkspace, isLoading }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
} 