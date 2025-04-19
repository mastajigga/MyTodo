'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"
    >
      {/* Cercles décoratifs en arrière-plan */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-900/20" />
        <div className="absolute left-1/4 top-1/2 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl dark:bg-indigo-900/20" />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            className="py-8"
          >
            <motion.div
              variants={fadeInUp}
              className="rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:bg-gray-800/80"
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}; 