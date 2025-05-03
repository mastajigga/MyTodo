import { useQuery } from '@tanstack/react-query'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { useAuth } from '@/lib/auth/useAuth'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Task, TaskStatus } from '@/@types/task'

const statusMap = {
  todo: { label: 'À faire', color: 'bg-blue-500' },
  in_progress: { label: 'En cours', color: 'bg-orange-500' },
  review: { label: 'En révision', color: 'bg-yellow-500' },
  done: { label: 'Terminé', color: 'bg-green-500' }
} as const

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

const getStatusConfig = (status: TaskStatus) => {
  return statusMap[status] || { label: 'Inconnu', color: 'bg-gray-500' }
}

export function RecentTasksTable() {
  const { supabase } = useSupabase()
  const { user } = useAuth()

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['recent-tasks'],
    queryFn: async () => {
      if (!user) return []

      // Récupérer d'abord les IDs des workspaces de l'utilisateur
      const { data: workspaceIds } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id)

      if (!workspaceIds?.length) return []

      // Récupérer les IDs des projets dans ces workspaces
      const { data: projectIds } = await supabase
        .from('projects')
        .select('id')
        .in('workspace_id', workspaceIds.map(w => w.workspace_id))

      if (!projectIds?.length) return []

      // Récupérer les 5 dernières tâches mises à jour
      const { data: recentTasks } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          project_id,
          created_at,
          updated_at,
          due_date,
          created_by,
          assigned_to,
          position,
          projects!project_id (
            id,
            name
          )
        `)
        .in('project_id', projectIds.map(p => p.id))
        .order('updated_at', { ascending: false })
        .limit(5)

      // Transformer les données pour correspondre au type Task
      return (recentTasks || []).map(task => ({
        ...task,
        project: task.projects?.[0] || null,
        projects: undefined // Supprimer la propriété projects
      })) as unknown as Task[]
    },
    enabled: !!user
  })

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-[200px]" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          Une erreur est survenue lors du chargement des tâches récentes
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      variants={tableVariants}
      initial="hidden"
      animate="show"
    >
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Dernières mises à jour</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tâche</TableHead>
                <TableHead>Projet</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Mise à jour</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks?.map((task) => {
                const status = getStatusConfig(task.status)
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.project?.name}</TableCell>
                    <TableCell>
                      <Badge 
                        className={`${status.color} text-white`}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(task.updated_at), "d MMMM à HH:mm", { locale: fr })}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </motion.div>
  )
} 