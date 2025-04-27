'use client';

import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ActivityList } from "@/components/ActivityList";
import { CheckCircle, Clock, PenSquare, Users, Folder } from "lucide-react";
import { useWorkspaceContext } from "@/contexts/workspace-context";
import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/lib/services/statsService";
import { WorkspaceSelectorScreen } from '@/components/workspace/WorkspaceSelectorScreen';
import { useSupabase } from '@/lib/supabase/supabase-provider';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

const recentActivities = [
  {
    type: 'created',
    taskTitle: 'Changer la calendre',
    timestamp: '2024-04-19T13:21:00',
  },
  {
    type: 'in_progress',
    taskTitle: 'Changer les freins',
    timestamp: '2024-04-19T09:38:00',
  },
  {
    type: 'completed',
    taskTitle: 'Vérifier la pression des pneus',
    timestamp: '2024-04-18T16:45:00',
  },
  {
    type: 'updated',
    taskTitle: 'Vidange huile moteur',
    timestamp: '2024-04-18T14:20:00',
  },
] as const;

export default function Dashboard() {
  const { workspace, workspaces } = useWorkspaceContext();
  const { supabase } = useSupabase();

  // Toujours appeler le hook useQuery, même si workspace est null
  const { data: stats = { current: 0, upcoming: 0, completed: 0 }, isLoading } = useQuery({
    queryKey: ['workspace-stats', workspace?.id],
    queryFn: () => (workspace?.id ? statsService.getTaskStats(supabase, workspace.id) : Promise.resolve({ current: 0, upcoming: 0, completed: 0 })),
    enabled: !!workspace?.id,
  });

  const isLoadingWorkspaces = !workspace && workspaces.length > 0;

  // Affiche un loader tant que la sélection automatique n'est pas faite
  if (isLoadingWorkspaces) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <span>Chargement de l'espace de travail…</span>
        </div>
      </DashboardLayout>
    );
  }

  // Affiche l'invitation seulement si aucun workspace n'existe
  if (!workspace && workspaces.length === 0) {
    return (
      <DashboardLayout>
        <WorkspaceSelectorScreen hasWorkspaces={false} />
      </DashboardLayout>
    );
  }

  const activities = workspace ? [
    // Exemple d'activités - à remplacer par les vraies données
    {
      type: 'created' as const,
      taskTitle: 'Nouvelle tâche',
      timestamp: new Date().toISOString()
    }
  ] : [];

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="container mx-auto p-6"
      >
        <motion.h1
          variants={fadeInUp}
          className="mb-8 text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-purple-300 dark:to-purple-500"
        >
          Tableau de bord
        </motion.h1>

        {/* Statistiques */}
        <motion.div variants={fadeInUp}>
          <h2 className="mb-6 text-2xl font-semibold bg-gradient-to-r from-gray-900 via-purple-800 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-purple-300 dark:to-purple-500">
            Statistiques de l'espace de travail actif
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Tâches terminées"
              value={stats.completed}
              icon={CheckCircle}
            />
            <StatsCard
              title="En cours"
              value={stats.current}
              icon={Clock}
            />
            <StatsCard
              title="En révision"
              value={0}
              icon={PenSquare}
            />
            <StatsCard
              title="À faire"
              value={stats.upcoming}
              icon={Clock}
            />
          </div>
        </motion.div>

        {/* Activités récentes */}
        <motion.div variants={fadeInUp} className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold bg-gradient-to-r from-gray-900 via-purple-800 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-purple-300 dark:to-purple-500">
            Activités
          </h2>
          {workspace ? (
            <ActivityList activities={activities} />
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Sélectionnez un espace de travail pour voir les activités
            </p>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
} 