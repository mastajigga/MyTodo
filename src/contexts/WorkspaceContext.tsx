import { createContext, useCallback, useState, ReactNode } from 'react';
import type { Workspace } from '@/types/supabase';

interface WorkspaceContextType {
  workspace: Workspace | null;
  setWorkspace: (workspace: Workspace | null) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
} 