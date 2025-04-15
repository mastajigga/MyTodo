import { CheckCircle2, Clock, AlertCircle, Plus, Edit } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { activityService, TaskActivity } from '@/lib/services/activityService'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export function RecentActivities() {
  const { data: activities, isLoading, error } = useQuery<TaskActivity[]>({
    queryKey: ['recentActivities'],
    queryFn: () => activityService.getRecentTaskActivities(),
  })

  const getActionIcon = (action: TaskActivity['action']) => {
    switch (action) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'created':
        return <Plus className="h-4 w-4 text-blue-500" />
      case 'updated':
        return <Edit className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getActionText = (activity: TaskActivity) => {
    switch (activity.action) {
      case 'completed':
        return `Tâche terminée : ${activity.task_title}`
      case 'created':
        return `Nouvelle tâche créée : ${activity.task_title}`
      case 'updated':
        return `Tâche modifiée : ${activity.task_title}`
      default:
        return activity.task_title
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-4 rounded-lg border border-primary/10 p-4">
              <div className="h-4 w-4 rounded-full bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted"></div>
                <div className="h-3 w-1/2 rounded bg-muted"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        Erreur lors du chargement des activités récentes
      </div>
    )
  }

  if (!activities?.length) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        Aucune activité récente
      </div>
    )
  }

  return (
    <AnimatePresence>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-center space-x-4 rounded-lg border border-primary/10 p-4 backdrop-blur-sm bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg">
              <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                {getActionIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors duration-300">
                  {getActionText(activity)}
                </p>
                <p className="text-xs text-muted-foreground mt-1 group-hover:text-primary/80 transition-colors duration-300">
                  {activity.user_name && `par ${activity.user_name} • `}
                  {formatDistanceToNow(new Date(activity.created_at), { 
                    addSuffix: true,
                    locale: fr 
                  })}
                </p>
              </div>
              <div className="h-full w-1 bg-gradient-to-b from-primary/50 to-purple-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
} 