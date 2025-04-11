/**
 * Task status columns configuration
 */
export const STATUS_COLUMNS = [
  { id: 'todo', label: 'À faire' },
  { id: 'in_progress', label: 'En cours' },
  { id: 'completed', label: 'Terminé' },
] as const;

/**
 * Priority color mapping for task badges
 */
export const PRIORITY_COLORS = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
} as const; 