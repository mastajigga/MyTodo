import { Task } from '@/types/task';
import { STATUS_COLUMNS } from '@/lib/constants/task';
import { useMemo } from 'react';

/**
 * Custom hook to group tasks by their status
 * @param tasks - Array of tasks to group
 * @returns Record of tasks grouped by status
 */
export function useTasksByStatus(tasks: Task[]) {
  return useMemo(() => {
    return STATUS_COLUMNS.reduce((acc, column) => {
      acc[column.id] = tasks.filter((task) => task.status === column.id);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);
} 