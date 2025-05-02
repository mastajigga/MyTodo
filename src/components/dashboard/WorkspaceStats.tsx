import { useQuery } from '@tanstack/react-query'
import { useWorkspaceContext } from '@/contexts/workspace-context'
import { taskService } from '@/services/task.service'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Task } from '@/@types/task'
import { motion } from "framer-motion"
import { CheckCircle2, Clock, ListTodo } from "lucide-react"

const statsConfig = [
  {
    label: "Tâches terminées",
    value: (tasks: Task[]) => tasks.filter(task => task.status === 'done').length,
    icon: CheckCircle2,
    color: "from-green-500 to-emerald-500",
    description: "Tâches complétées"
  },
  {
    label: "En cours",
    value: (tasks: Task[]) => tasks.filter(task => task.status === 'in_progress').length,
    icon: Clock,
    color: "from-orange-500 to-amber-500",
    description: "Tâches en cours"
  },
  {
    label: "À faire",
    value: (tasks: Task[]) => tasks.filter(task => task.status === 'todo').length,
    icon: ListTodo,
    color: "from-blue-500 to-cyan-500",
    description: "Tâches à commencer"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
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

export function WorkspaceStats() {
  const { workspace } = useWorkspaceContext()

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['workspace-tasks', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return []
      return taskService.getTasks(workspace.id)
    },
    enabled: !!workspace?.id,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-[100px] mb-4" />
            <Skeleton className="h-8 w-[60px]" />
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Une erreur est survenue lors du chargement des statistiques
        {error instanceof Error && (
          <div className="text-sm mt-2">{error.message}</div>
        )}
      </div>
    )
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Version Desktop */}
          <Card className="hidden md:flex p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between w-full">
              <div className="space-y-2">
                <span className="text-muted-foreground text-sm font-medium">
                  {stat.label}
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">
                    {stat.value(tasks)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
              <div className={`rounded-full p-2.5 bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>

          {/* Version Mobile */}
          <Card className="md:hidden">
            <motion.div 
              className="flex items-center p-4 space-x-4"
              whileHover={{ backgroundColor: "var(--accent)" }}
            >
              <div className={`rounded-full p-2 bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">{stat.label}</p>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">
                    {stat.value(tasks)}
                  </span>
                </div>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
} 