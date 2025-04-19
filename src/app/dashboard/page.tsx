'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { StatsCard } from '@/components/StatsCard';
import { ActivityList } from '@/components/ActivityList';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import {
  UsersIcon,
  FolderIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

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
  return (
    <DashboardLayout>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full"
      >
        <motion.h1
          variants={fadeInUp}
          className="mb-8 text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-purple-300 dark:to-purple-500"
        >
          Tableau de bord
        </motion.h1>

        {/* Statistiques globales */}
        <motion.div
          variants={fadeInUp}
          className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <StatsCard
            title="Espaces de travail"
            value={1}
            icon={UsersIcon}
            trend={{ value: 10, isPositive: true }}
          />
          <StatsCard
            title="Projets"
            value={2}
            icon={FolderIcon}
            trend={{ value: 25, isPositive: true }}
          />
          <StatsCard
            title="Tâches totales"
            value={14}
            icon={CheckCircleIcon}
          />
          <StatsCard
            title="En cours"
            value={5}
            icon={ClockIcon}
          />
        </motion.div>

        {/* Statistiques de l'espace actif */}
        <motion.div variants={fadeInUp}>
          <h2 className="mb-6 text-2xl font-semibold bg-gradient-to-r from-gray-900 via-purple-800 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-purple-300 dark:to-purple-500">
            Statistiques de l'espace de travail actif
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Tâches terminées"
              value={3}
              icon={CheckCircleIcon}
            />
            <StatsCard
              title="En cours"
              value={5}
              icon={ClockIcon}
            />
            <StatsCard
              title="En révision"
              value={1}
              icon={PencilSquareIcon}
            />
            <StatsCard
              title="À faire"
              value={2}
              icon={ClockIcon}
            />
          </div>
        </motion.div>

        {/* Activités récentes */}
        <motion.div variants={fadeInUp} className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold bg-gradient-to-r from-gray-900 via-purple-800 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-purple-300 dark:to-purple-500">
            Activités
          </h2>
          <ActivityList activities={recentActivities} />
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
} 