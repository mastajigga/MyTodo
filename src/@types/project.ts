import { ProjectBase } from './index';

export interface Project extends Omit<ProjectBase, 'color'> {
  color?: ProjectColor;
  workspace?: {
    id: string;
    name: string;
  };
  members?: {
    count: number;
  };
}

export type ProjectColor = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'pink' | 'orange' | 'gray';

export type CreateProjectData = {
  name: string;
  description?: string | null;
  workspace_id: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  position?: number;
  created_by?: string;
  is_archived?: boolean;
  color?: ProjectColor;
};

export type UpdateProjectData = Partial<Omit<Project, 'id' | 'created_at' | 'created_by'>>; 