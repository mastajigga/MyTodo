export interface Project {
  id: string
  workspace_id: string
  name: string
  description?: string
  color?: string
  created_at: string
  updated_at: string
}

export interface CreateProjectData {
  workspace_id: string
  name: string
  description?: string
  color?: string
}

export interface UpdateProjectData {
  name?: string
  description?: string
  color?: string
} 