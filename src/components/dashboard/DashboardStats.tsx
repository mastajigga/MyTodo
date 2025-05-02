'use client';

import { useQuery } from '@tanstack/react-query';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { taskService } from '@/services/task.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Task } from '@/@types/task';
import { motion } from "framer-motion"
import { Users2, FolderKanban, CheckCircle2, Clock } from "lucide-react"

interface DashboardStatsProps {
  totalWorkspaces: number
  totalProjects: number
  totalTasks: number
  tasksInProgress: number
}

const statsConfig = [
  {
    label: "Espaces de travail",
    value: (stats: DashboardStatsProps) => stats.totalWorkspaces,
    icon: Users2,
    color: "from-violet-500 to-purple-500",
    description: "Total des espaces actifs"
  },
  {
    label: "Projets",
    value: (stats: DashboardStatsProps) => stats.totalProjects,
    icon: FolderKanban,
    color: "from-blue-500 to-cyan-500",
    description: "Projets en cours"
  },
  {
    label: "Tâches",
    value: (stats: DashboardStatsProps) => stats.totalTasks,
    icon: CheckCircle2,
    color: "from-green-500 to-emerald-500",
    description: "Tâches totales"
  },
  {
    label: "En cours",
    value: (stats: DashboardStatsProps) => stats.tasksInProgress,
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

export function DashboardStats(props: DashboardStatsProps) {
  const { workspace } = useWorkspaceContext();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['workspace-tasks', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      return taskService.getTasks(workspace.id);
    },
    enabled: !!workspace?.id,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[100px]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Une erreur est survenue lors du chargement des statistiques
        {error instanceof Error && (
          <div className="text-sm mt-2">{error.message}</div>
        )}
      </div>
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task: Task) => task.status === 'done').length;
  const inProgressTasks = tasks.filter((task: Task) => task.status === 'in_progress').length;
  const todoTasks = tasks.filter((task: Task) => task.status === 'todo').length;

  const stats = [
    {
      title: "Total des tâches",
      value: totalTasks,
      className: "bg-card",
    },
    {
      title: "Tâches terminées",
      value: completedTasks,
      className: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Tâches en cours",
      value: inProgressTasks,
      className: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      title: "Tâches à faire",
      value: todoTasks,
      className: "bg-blue-100 dark:bg-blue-900",
    },
  ];

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
  );
} 