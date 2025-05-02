/**
 * Task status columns configuration
 */
export const STATUS_COLUMNS = [
  { id: 'todo', label: 'À faire' },
  { id: 'in_progress', label: 'En cours' },
  { id: 'review', label: 'En revue' },
  { id: 'done', label: 'Terminé' },
] as const;

/**
 * Priority color mapping for task badges
 */
export const PRIORITY_COLORS = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
} as const; 