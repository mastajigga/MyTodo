'use client';

import { Task } from '@/types/task';

interface KanbanBoardProps {
  tasks: Task[];
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Colonne Todo */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-semibold mb-4">À faire ({todoTasks.length})</h3>
        <div className="space-y-2">
          {todoTasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <h4 className="font-medium">{task.title}</h4>
              {task.project && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {task.project.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Colonne En cours */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-semibold mb-4">En cours ({inProgressTasks.length})</h3>
        <div className="space-y-2">
          {inProgressTasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <h4 className="font-medium">{task.title}</h4>
              {task.project && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {task.project.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Colonne Terminé */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-semibold mb-4">Terminé ({doneTasks.length})</h3>
        <div className="space-y-2">
          {doneTasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <h4 className="font-medium">{task.title}</h4>
              {task.project && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {task.project.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 