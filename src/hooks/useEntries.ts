import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { EntryService } from '@/services/entry.service'
import { Entry } from '@/@types/entry'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { SupabasePayload } from '@/lib/supabase/client'

export function useEntries(workspaceId: string) {
  const queryClient = useQueryClient()
  const [realtimeEnabled, setRealtimeEnabled] = useState(true)
  const { supabase } = useSupabase()

  const {
    data: entries = [],
    isLoading,
    error,
    refetch
  } = useQuery<Entry[]>({
    queryKey: ['entries', workspaceId],
    queryFn: async () => {
      console.log('Requête pour le workspace:', workspaceId);
      const data = await EntryService.getWorkspaceEntries(supabase, workspaceId)
      console.log('Données brutes des entrées:', data)
      console.log('Détails des entrées:', data.map(entry => ({
        id: entry.id,
        title: entry.title,
        status: entry.status,
        workspace_id: entry.workspace_id
      })))
      return data
    },
    enabled: !!workspaceId
  })

  // Mise en place de la synchronisation en temps réel
  useEffect(() => {
    if (!realtimeEnabled || !workspaceId) return

    const subscription = EntryService.subscribeToEntries(supabase, workspaceId, (payload: Entry) => {
      console.log('Changement détecté:', payload)
      queryClient.invalidateQueries({ queryKey: ['entries', workspaceId] })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [workspaceId, queryClient, realtimeEnabled])

  // Statistiques pour les KPIs
  const doneEntries = entries.filter(entry => entry.status === 'done');
  console.log('Entrées terminées:', doneEntries);
  
  const stats = {
    total: entries.length,
    todo: entries.filter(entry => entry.status === 'todo').length,
    inProgress: entries.filter(entry => entry.status === 'in_progress').length,
    done: doneEntries.length,
  }

  console.log('Statistiques détaillées:', {
    totalEntries: entries,
    doneEntries,
    stats
  });

  return {
    entries,
    stats,
    isLoading,
    error,
    refetch,
    realtimeEnabled,
    setRealtimeEnabled
  }
} 