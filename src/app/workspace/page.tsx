"use client"

import { WorkspaceList } from '@/components/workspaces/WorkspaceList';
import { WorkspaceStats } from "@/components/workspaces/WorkspaceStats";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Database } from "@/lib/database.types";
import { LayoutGrid } from 'lucide-react';

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

export default function WorkspacePage() {
  const supabase = createClientComponentClient<Database>();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalProjects: 0,
    totalTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer le nombre total de membres
        const { count: membersCount } = await supabase
          .from('workspace_members')
          .select('*', { count: 'exact' });

        // Récupérer le nombre total de projets
        const { count: projectsCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact' });

        // Récupérer le nombre total de tâches
        const { count: tasksCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact' });

        setStats({
          totalMembers: membersCount || 0,
          totalProjects: projectsCount || 0,
          totalTasks: tasksCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container mx-auto p-8 max-w-7xl"
    >
      <motion.div variants={item} className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20">
          <LayoutGrid className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Espaces de travail
          </h1>
          <p className="text-sm text-muted-foreground">
            Vue d'ensemble de vos espaces de travail et activités
          </p>
        </div>
      </motion.div>

      <motion.div variants={item} className="mb-8">
        <WorkspaceStats {...stats} />
      </motion.div>

      <motion.div 
        variants={item} 
        className="bg-card rounded-xl border shadow-sm p-6"
      >
        <WorkspaceList />
      </motion.div>
    </motion.div>
  );
} 