'use client';

import { Users, Briefcase, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface WorkspaceStatsProps {
  totalMembers: number;
  totalProjects: number;
  totalTasks: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function WorkspaceStats({ totalMembers, totalProjects, totalTasks }: WorkspaceStatsProps) {
  const stats = [
    {
      title: 'Membres',
      value: totalMembers,
      icon: Users,
      color: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Projets',
      value: totalProjects,
      icon: Briefcase,
      color: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Tâches',
      value: totalTasks,
      icon: CheckSquare,
      color: 'bg-orange-100 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            variants={item}
            className="bg-card rounded-xl border shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.color}`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
} 