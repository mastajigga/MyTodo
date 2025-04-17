export interface Project {
  id: string;
  name: string;
  description: string | null;
  workspace_id: string;
  created_at: string;
  updated_at: string;
  position: number;
  created_by: string;
  is_archived: boolean;
}

export type CreateProjectData = {
  name: string;
  description?: string | null;
  workspace_id: string;
  position?: number;
  created_by?: string;
};

export type UpdateProjectData = Partial<Omit<Project, 'id' | 'created_at' | 'created_by'>>; 