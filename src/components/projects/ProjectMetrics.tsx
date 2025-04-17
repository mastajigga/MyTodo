import { Card, CardContent } from '@/components/ui/card';
import { Project } from '@/types/project';
import { Task } from '@/types/task';
import { CheckCircle, Clock, AlertCircle, BarChart2 } from 'lucide-react';

interface ProjectMetricsProps {
  project: Project;
  tasks: Task[];
}

export const ProjectMetrics = ({ project, tasks }: ProjectMetricsProps) => {
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const metrics = [
    {
      label: 'Tâches terminées',
      value: completedTasks,
      total: tasks.length,
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      label: 'En cours',
      value: inProgressTasks,
      total: tasks.length,
      icon: Clock,
      color: 'text-blue-500'
    },
    {
      label: 'À faire',
      value: todoTasks,
      total: tasks.length,
      icon: AlertCircle,
      color: 'text-red-500'
    },
    {
      label: 'Taux de complétion',
      value: `${completionRate}%`,
      icon: BarChart2,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`${metric.color}`}>
                <metric.icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </p>
                <h3 className="text-2xl font-bold">
                  {metric.value}
                  {metric.total && (
                    <span className="text-sm text-muted-foreground ml-1">
                      / {metric.total}
                    </span>
                  )}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 