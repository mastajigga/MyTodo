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
import { useState } from 'react';
import { TopNav } from '@/components/layout/TopNav';

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

// Utilitaire pour appeler l'API d'autocommit (dev only)
const triggerGitCommit = async (message: string) => {
  const res = await fetch('/api/git-commit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Erreur lors du commit git');
  }
  return res.json();
};

export default function Dashboard() {
  const { workspace, workspaces } = useWorkspaceContext();
  const { supabase } = useSupabase();
  const [commitLoading, setCommitLoading] = useState(false);
  const [commitResult, setCommitResult] = useState<string|null>(null);

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

  const handleAutoCommit = async () => {
    setCommitLoading(true);
    setCommitResult(null);
    try {
      const result = await triggerGitCommit('feat: commit auto depuis le dashboard');
      setCommitResult('Commit réussi !\n' + result.result);
    } catch (e: any) {
      setCommitResult('Erreur commit : ' + e.message);
    } finally {
      setCommitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <TopNav />
      <div className="relative z-10 pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="p-0"
        >
          {/* Bouton d'autocommit DEV ONLY */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 flex flex-col items-start">
              <button
                onClick={handleAutoCommit}
                className="px-4 py-2 mb-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                disabled={commitLoading}
                aria-label="Commit git automatique"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleAutoCommit(); }}
              >
                {commitLoading ? 'Commit en cours...' : 'Commit git auto (dev)'}
              </button>
              {commitResult && (
                <pre className="text-xs text-gray-700 bg-gray-100 rounded p-2 max-w-xl overflow-x-auto border border-gray-200">
                  {commitResult}
                </pre>
              )}
            </div>
          )}
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
      </div>
    </div>
  );
} 