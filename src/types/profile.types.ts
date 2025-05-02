import { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']

export type UpdateProfileData = {
  full_name?: string
  avatar_url?: string | null
  updated_at?: string
} 