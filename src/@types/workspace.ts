export type WorkspaceType = 'personal' | 'team';
export type WorkspaceMemberRole = 'owner' | 'admin' | 'member';

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  type: WorkspaceType;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: WorkspaceMemberRole;
  joined_at: string;
  profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface CreateWorkspaceData {
  name: string;
  description?: string;
  type: WorkspaceType;
}

export interface UpdateWorkspaceData {
  name?: string;
  description?: string;
  type?: WorkspaceType;
}

export interface InviteWorkspaceMemberData {
  email: string;
  role: WorkspaceMemberRole;
} 