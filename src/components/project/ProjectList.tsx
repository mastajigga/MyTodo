'use client'

import { useQuery } from "@tanstack/react-query"
import { useSupabase } from "@/lib/supabase/supabase-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

interface Project {
  id: string
  name: string
  description: string | null
  workspace_id: string
  workspace: {
    name: string
  }
  created_at: string
}

interface ProjectListProps {
  workspaceId?: string
}

export function ProjectList({ workspaceId }: ProjectListProps) {
  const { supabase } = useSupabase()
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(`
          id,
          name,
          description,
          workspace_id,
          workspace:workspaces!inner (
            name
          ),
          created_at
        `)
        .order('created_at', { ascending: false })

      if (workspaceId && workspaceId !== 'all') {
        query = query.eq('workspace_id', workspaceId)
      }

      const { data, error } = await query

      if (error) throw error
      
      // Transform the data to match the Project interface
      return (data as any[]).map(project => ({
        ...project,
        workspace: project.workspace[0]
      })) as Project[]
    }
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] rounded-xl" />
        ))}
      </div>
    )
  }

  if (!projects?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Aucun projet trouvé
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Commencez par créer un projet dans {workspaceId !== 'all' ? 'cet espace de travail' : 'un espace de travail'}.
        </p>
      </div>
    )
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {projects.map((project) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {project.name}
              </h3>
              {workspaceId === 'all' && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {project.workspace.name}
                </p>
              )}
            </div>
          </div>
          {project.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {project.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(project.created_at).toLocaleDateString()}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
} 