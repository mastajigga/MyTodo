import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { WorkspaceType, CreateWorkspaceData, UpdateWorkspaceData, Workspace } from '@/types/workspace';

export class WorkspaceService {
  static async getWorkspaces(): Promise<Workspace[]> {
    const supabase = createClientComponentClient<Database>();
    
    // Récupérer l'ID de l'utilisateur connecté
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Non authentifié');
    }

    // Récupérer les espaces de travail personnels de l'utilisateur
    const { data: personalWorkspaces, error: personalError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('type', 'personal')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (personalError) throw personalError;

    // Récupérer les espaces de travail d'équipe dont l'utilisateur est membre
    const { data: teamWorkspaces, error: teamError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('type', 'team')
      .in('id', (
        await supabase
          .from('workspace_members')
          .select('workspace_id')
          .eq('user_id', user.id)
      ).data?.map(wm => wm.workspace_id) || [])
      .order('created_at', { ascending: false });

    if (teamError) throw teamError;

    // Combiner et trier les résultats
    return [...(personalWorkspaces || []), ...(teamWorkspaces || [])]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async createWorkspace(workspaceData: CreateWorkspaceData): Promise<Workspace> {
    const supabase = createClientComponentClient<Database>();
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name: workspaceData.name,
        description: workspaceData.description || null,
        type: workspaceData.type
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateWorkspace(id: string, workspaceData: UpdateWorkspaceData): Promise<Workspace> {
    const supabase = createClientComponentClient<Database>();
    const { data, error } = await supabase
      .from('workspaces')
      .update({
        name: workspaceData.name,
        description: workspaceData.description || null,
        type: workspaceData.type
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteWorkspace(id: string): Promise<void> {
    const supabase = createClientComponentClient<Database>();
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getWorkspace(id: string): Promise<Workspace | null> {
    const supabase = createClientComponentClient<Database>();
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting workspace:', error);
      return null;
    }

    return workspace;
  }

  static async getWorkspaceMembers(workspaceId: string) {
    const supabase = createClientComponentClient<Database>();
    const { data, error } = await supabase
      .from('workspace_members')
      .select(`
        *,
        user:user_id (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq('workspace_id', workspaceId);

    if (error) throw error;
    return data;
  }
} 