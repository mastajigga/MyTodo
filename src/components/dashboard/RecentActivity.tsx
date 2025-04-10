import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Activity, CheckCircle2, ClipboardList } from 'lucide-react';
import { Task } from '@/types/task';

interface RecentActivityProps {
  tasks?: Task[];
}

export const RecentActivity = ({ tasks = [] }: RecentActivityProps) => {
  return (
    <section>
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-5 h-5 text-gray-500" />
        <h2 className="text-xl font-semibold">Activité récente</h2>
      </div>
      <Card className="overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <CardContent className="p-6">
          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <ClipboardList className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.status === 'completed' ? 'Terminée' : 'Mise à jour'} le{' '}
                      {new Date(task.updated_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                <Activity className="w-6 h-6 text-gray-400" />
              </div>
              <p>Aucune activité récente</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}; 