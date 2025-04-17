import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MessageSquare, GitCommit, CheckCircle2 } from 'lucide-react';
import { useProjectActivities } from '@/hooks/useProjectActivities';

interface ProjectTimelineProps {
  projectId: string;
}

export const ProjectTimeline = ({ projectId }: ProjectTimelineProps) => {
  const { activities, isLoading } = useProjectActivities(projectId);

  if (isLoading) {
    return <div className="p-4 text-center">Chargement de l'historique...</div>;
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'status_change':
        return <GitCommit className="h-4 w-4" />;
      case 'completion':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <GitCommit className="h-4 w-4" />;
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Activités récentes</h3>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="p-4">
          {activities?.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Aucune activité récente
            </p>
          ) : (
            <div className="space-y-4">
              {activities?.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>{' '}
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.created_at), 'PPp', { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}; 