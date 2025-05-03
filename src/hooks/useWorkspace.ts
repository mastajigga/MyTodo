'use client';

import { useContext } from 'react';
import { WorkspaceContext } from '@/contexts/workspace-context';
import type { Workspace, CreateWorkspaceData } from '@/types/supabase';
import { useSupabase } from '@/lib/supabase/supabase-provider'

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  const { supabase } = useSupabase();
  
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }

  const createWorkspace = async (data: CreateWorkspaceData) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert({
        ...data,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return workspace;
  };
  
  return {
    ...context,
    createWorkspace
  };
}

export type { Workspace }; 