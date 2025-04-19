import { motion } from "framer-motion"
import { Users2, FolderKanban, CheckCircle2, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"

interface GlobalStatsProps {
  totalWorkspaces: number
  totalProjects: number
  totalTasks: number
  tasksInProgress: number
}

const statsConfig = [
  {
    label: "Espaces de travail",
    value: (stats: GlobalStatsProps) => stats.totalWorkspaces,
    icon: Users2,
    color: "from-violet-500 to-purple-500",
    description: "Total des espaces actifs"
  },
  {
    label: "Projets",
    value: (stats: GlobalStatsProps) => stats.totalProjects,
    icon: FolderKanban,
    color: "from-blue-500 to-cyan-500",
    description: "Projets en cours"
  },
  {
    label: "Tâches",
    value: (stats: GlobalStatsProps) => stats.totalTasks,
    icon: CheckCircle2,
    color: "from-green-500 to-emerald-500",
    description: "Tâches totales"
  },
  {
    label: "En cours",
    value: (stats: GlobalStatsProps) => stats.tasksInProgress,
    icon: Clock,
    color: "from-orange-500 to-amber-500",
    description: "Tâches en cours"
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

export function GlobalStats(props: GlobalStatsProps) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
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
                    {stat.value(props)}
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
                    {stat.value(props)}
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