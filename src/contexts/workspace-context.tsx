import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WorkspaceService } from '@/services/workspace.service';
import { toast } from 'sonner';

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface WorkspaceContextType {
  workspace: Workspace | null;
  setWorkspace: (workspace: Workspace | null) => void;
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        const workspaces = await WorkspaceService.getWorkspaces();
        if (workspaces.length > 0) {
          setWorkspace(workspaces[0]);
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
    <WorkspaceContext.Provider value={{ workspace, setWorkspace, isLoading }}>
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