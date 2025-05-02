import { useState, useEffect } from 'react'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { Database } from '@/types/supabase'
import { PostgrestSingleResponse } from '@supabase/supabase-js'

type Workspace = Database['public']['Tables']['workspaces']['Row']

interface WorkspaceStats {
  members: number
  projects: number
  tasks: number
}

export function useWorkspaceStats(workspace: Workspace | null) {
  const { supabase } = useSupabase()
  const [stats, setStats] = useState<WorkspaceStats>({
    members: 0,
    projects: 0,
    tasks: 0
  })

  useEffect(() => {
    async function fetchStats() {
      if (!workspace) return

      try {
        // Récupérer le nombre de membres
        const { count: membersCount } = await supabase
          .from('workspace_members')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', workspace.id)

        // Récupérer le nombre de projets
        const { count: projectsCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', workspace.id)

        // Récupérer le nombre de tâches
        const { count: tasksCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', workspace.id)

        setStats({
          members: membersCount || 0,
          projects: projectsCount || 0,
          tasks: tasksCount || 0
        })
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error)
      }
    }

    fetchStats()
  }, [workspace, supabase])

  return stats
} 