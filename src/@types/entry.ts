export interface Entry {
  id: string // UUID
  title: string
  description: string
  workspace_id: string // UUID
  created_at: string // ISO timestamp
  updated_at: string // ISO timestamp
  user_id: string // UUID
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date?: string // ISO timestamp, optional
}

// Type pour la création d'une nouvelle entrée
export type CreateEntryData = Omit<Entry, 'id' | 'created_at' | 'updated_at'>;

// Type pour la mise à jour d'une entrée existante
export type UpdateEntryData = Partial<CreateEntryData>; 