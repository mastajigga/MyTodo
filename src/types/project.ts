export interface Project {
  id: string;
  name: string;
  description: string | null;
  workspace_id: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export type CreateProjectData = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProjectData = Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>; 