'use client';

import { motion } from 'framer-motion';
import { cardHover } from '@/lib/animations';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface TaskCardProps {
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'cancelled';
  dueDate?: string;
}

const statusConfig = {
  completed: {
    icon: CheckCircleIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  pending: {
    icon: ClockIcon,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  cancelled: {
    icon: XCircleIcon,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
  },
};

export const TaskCard = ({ title, description, status, dueDate }: TaskCardProps) => {
  const { icon: StatusIcon, color, bgColor, borderColor } = statusConfig[status];

  return (
    <motion.div
      {...cardHover}
      className={`group relative overflow-hidden rounded-xl border bg-white/90 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800/90 ${borderColor}`}
    >
      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-3">
            <StatusIcon className={`h-6 w-6 ${color}`} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
      
      <div className="relative mt-6 flex items-center justify-between">
        <div className={`rounded-full ${bgColor} px-3 py-1.5`}>
          <span className={`text-sm font-medium ${color}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        {dueDate && (
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <ClockIcon className="h-4 w-4" />
            <span>
              {new Date(dueDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}; 