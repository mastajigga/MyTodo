import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
        <CardHeader className="flex flex-row items-center space-x-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:scale-110 transition-transform">
            <ClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium">Total des tâches</h3>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-gray-900">
        <CardHeader className="flex flex-row items-center space-x-4">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-medium">Tâches terminées</h3>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950 dark:to-gray-900">
        <CardHeader className="flex flex-row items-center space-x-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-medium">Tâches en attente</h3>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
        </CardContent>
      </Card>
    </>
  );
}; 