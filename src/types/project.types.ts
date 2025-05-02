import { Database } from './database.types'
import { Profile } from './profile.types'

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectWithStats = Project & {
  tasks_count: number
  members_count: number
}

export type CreateProjectData = {
  name: string
  description?: string
  workspace_id: string
  owner_id: string
}

export type UpdateProjectData = {
  name?: string
  description?: string
  updated_at?: string
}

export type ProjectMember = {
  id: string
  project_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  profile: Profile
  created_at: string
  updated_at: string
} 