'use client';

import { motion } from 'framer-motion';
import { scaleIn } from '@/lib/animations';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const getGradient = (index: number) => {
  const gradients = [
    'from-indigo-500/10 to-purple-500/10',
    'from-purple-500/10 to-pink-500/10',
    'from-pink-500/10 to-rose-500/10',
    'from-rose-500/10 to-orange-500/10'
  ];
  return gradients[index % gradients.length];
};

export const StatsCard = ({ title, value, icon: Icon, trend }: StatsCardProps) => {
  const randomIndex = Math.floor(Math.random() * 4);
  const gradient = getGradient(randomIndex);
  const iconColorClass = gradient.split(' ')[0].replace('from-', '').replace('/10', '');

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 backdrop-blur-sm border-none transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:bg-gray-800/30`}
    >
      {/* Effet de brillance au survol */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileHover={{ opacity: 1, x: 100 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
      />
      {/* Icône en arrière-plan */}
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 transform">
        <div className="absolute inset-0 opacity-[0.15] transition-opacity duration-300 group-hover:opacity-[0.2]">
          <Icon className={`h-32 w-32 text-${iconColorClass}`} />
        </div>
      </div>
      <div className="relative">
        <h3 className="text-base font-medium text-gray-700 dark:text-gray-200">{title}</h3>
        <div className="mt-4 flex items-baseline space-x-4">
          <motion.p 
            className="text-4xl font-bold text-gray-800 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {value}
          </motion.p>
          {trend && (
            <motion.div
              className={`flex items-center rounded-full ${
                trend.isPositive 
                  ? 'bg-green-100/80 dark:bg-green-800/50' 
                  : 'bg-red-100/80 dark:bg-red-800/50'
              } px-3 py-1`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <span className={`text-sm font-semibold ${
                trend.isPositive 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 