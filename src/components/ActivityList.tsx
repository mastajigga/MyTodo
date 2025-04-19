'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { 
  PlusCircleIcon, 
  PencilSquareIcon, 
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

type ActivityType = 'created' | 'updated' | 'completed' | 'in_progress';

interface Activity {
  type: ActivityType;
  taskTitle: string;
  timestamp: string;
}

const activityConfig = {
  created: {
    icon: PlusCircleIcon,
    text: 'Nouvelle tâche',
    color: 'text-green-500',
  },
  updated: {
    icon: PencilSquareIcon,
    text: 'Mise à jour',
    color: 'text-blue-500',
  },
  completed: {
    icon: CheckCircleIcon,
    text: 'Terminée',
    color: 'text-purple-500',
  },
  in_progress: {
    icon: ClockIcon,
    text: 'En cours',
    color: 'text-orange-500',
  },
} as const;

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const config = activityConfig[activity.type];
  const Icon = config.icon;

  return (
    <motion.div
      variants={fadeInUp}
      className="flex items-center space-x-4 py-3 transition-colors duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 rounded-lg px-3"
    >
      <Icon className={`h-5 w-5 ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {activity.taskTitle}
      </span>
      <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
        {new Date(activity.timestamp).toLocaleDateString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </span>
    </motion.div>
  );
};

interface ActivityListProps {
  activities: ReadonlyArray<Activity>;
}

export const ActivityList = ({ activities }: ActivityListProps) => {
  return (
    <div className="space-y-1">
      {activities.map((activity, index) => (
        <ActivityItem key={index} activity={activity} />
      ))}
    </div>
  );
}; 