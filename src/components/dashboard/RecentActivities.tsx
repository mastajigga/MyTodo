import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Activity {
  id: string
  title: string
  status: string
  date: string
}

interface RecentActivitiesProps {
  activities: Activity[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
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
                {getStatusIcon(activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors duration-300">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 group-hover:text-primary/80 transition-colors duration-300">
                  {activity.date}
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