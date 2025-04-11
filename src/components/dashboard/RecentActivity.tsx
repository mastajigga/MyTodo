"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Activity, CheckCircle2, Clock, Edit3, Plus, Trash2 } from "lucide-react"

interface RecentActivityProps {
  activities: {
    id: string
    type: "create" | "update" | "delete" | "complete" | "start"
    taskName: string
    timestamp: string
  }[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "create":
        return <Plus className="h-4 w-4 text-emerald-500" />
      case "update":
        return <Edit3 className="h-4 w-4 text-amber-500" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-500" />
      case "complete":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />
      case "start":
        return <Clock className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityText = (type: string, taskName: string) => {
    switch (type) {
      case "create":
        return `Nouvelle tâche créée : ${taskName}`
      case "update":
        return `Tâche modifiée : ${taskName}`
      case "delete":
        return `Tâche supprimée : ${taskName}`
      case "complete":
        return `Tâche terminée : ${taskName}`
      case "start":
        return `Tâche démarrée : ${taskName}`
      default:
        return `Action sur la tâche : ${taskName}`
    }
  }

  return (
    <Card className="p-6 backdrop-blur-sm bg-card/50">
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Activités Récentes
        </h3>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 group-hover:shadow-md transition-shadow duration-300">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{getActivityText(activity.type, activity.taskName)}</p>
              <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
} 