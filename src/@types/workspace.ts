export interface WorkspaceStats {
  members: number;
  projects: number;
  tasks: number;
  activities: number;
}

export type WorkspaceType = 'family' | 'professional' | 'private';

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  type: WorkspaceType;
  created_at: string;
  created_by: string;
  members_count?: number;
  projects_count?: number;
  tasks_count?: number;
}

export interface CreateWorkspaceData {
  name: string;
  description?: string;
  type: WorkspaceType;
}

export interface UpdateWorkspaceData {
  name?: string;
  description?: string | null;
  type?: WorkspaceType;
}

export type WorkspaceMemberRole = 'owner' | 'admin' | 'member';

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceMemberRole;
  created_at: string;
}

export interface InviteWorkspaceMemberData {
  email: string;
  role: WorkspaceMemberRole;
} 