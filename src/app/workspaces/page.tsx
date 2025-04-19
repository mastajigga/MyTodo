'use client';

import { WorkspaceList } from "@/components/workspaces/WorkspaceList"
import { CreateWorkspaceButton } from "@/components/workspace/CreateWorkspaceButton"
import { WorkspaceStats } from "@/components/workspaces/WorkspaceStats"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

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

export default function WorkspacesPage() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalProjects: 0,
    totalTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) return;

        // Récupérer les espaces de travail de l'utilisateur
        const { data: userWorkspaces } = await supabase
          .from('workspace_members')
          .select('workspace_id')
          .eq('user_id', userId);

        if (!userWorkspaces?.length) {
          setStats({
            totalMembers: 0,
            totalProjects: 0,
            totalTasks: 0
          });
          return;
        }

        const workspaceIds = userWorkspaces.map(w => w.workspace_id);

        // Récupérer le nombre total de membres dans les espaces de travail de l'utilisateur
        const { count: membersCount } = await supabase
          .from('workspace_members')
          .select('*', { count: 'exact' })
          .in('workspace_id', workspaceIds);

        // Récupérer le nombre total de projets dans les espaces de travail de l'utilisateur
        const { count: projectsCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact' })
          .in('workspace_id', workspaceIds);

        // Récupérer le nombre total de tâches dans les espaces de travail de l'utilisateur
        const { count: tasksCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact' })
          .in('workspace_id', workspaceIds);

        setStats({
          totalMembers: membersCount || 0,
          totalProjects: projectsCount || 0,
          totalTasks: tasksCount || 0
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        setStats({
          totalMembers: 0,
          totalProjects: 0,
          totalTasks: 0
        });
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
      className="container mx-auto py-8 space-y-8"
    >
      <motion.div variants={item}>
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
            Espaces de travail
          </h1>
          <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
          <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
        </div>
      </motion.div>

      <motion.div variants={item}>
        <WorkspaceStats {...stats} />
      </motion.div>

      <motion.div variants={item}>
        <div className="flex justify-end mb-6">
          <CreateWorkspaceButton />
        </div>
      </motion.div>

      <motion.div variants={item}>
        <WorkspaceList />
      </motion.div>
    </motion.div>
  )
} 