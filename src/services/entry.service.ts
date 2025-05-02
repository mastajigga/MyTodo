import { SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Entry, CreateEntryData, UpdateEntryData } from '@/@types/entry'
import { SupabasePayload, SupabaseSubscription } from '@/lib/supabase/client'

export const EntryService = {
  async getWorkspaceEntries(supabase: SupabaseClient, workspaceId: string): Promise<Entry[]> {
    const { data: entries, error } = await supabase
      .from('entries')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des entrées:', error)
      throw error
    }

    console.log('Entrées récupérées:', entries)
    return entries || []
  },

  async createEntry(supabase: SupabaseClient, data: CreateEntryData): Promise<Entry> {
    const { data: entry, error } = await supabase
      .from('entries')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return entry
  },

  async updateEntry(supabase: SupabaseClient, id: string, data: UpdateEntryData): Promise<Entry> {
    const { data: entry, error } = await supabase
      .from('entries')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return entry
  },

  async deleteEntry(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  subscribeToEntries(supabase: SupabaseClient, workspaceId: string, callback: (entry: Entry) => void): SupabaseSubscription {
    return supabase
      .channel(`entries:${workspaceId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'entries',
        filter: `workspace_id=eq.${workspaceId}`
      }, (payload: SupabasePayload) => {
        console.log('Changement détecté:', payload)
        callback(payload.new as Entry)
      })
      .subscribe()
  }
} 