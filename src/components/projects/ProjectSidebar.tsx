import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Project } from '@/types/project';
import { X, Calendar, Users, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProjectSidebarProps {
  project: Project;
  members: any[];
  onClose: () => void;
}

export function ProjectSidebar({ project, members, onClose }: ProjectSidebarProps) {
  const safeProject = { ...project, description: project.description ?? null };

  return (
    <div className="w-80 border-r bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Détails du projet</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {/* Project Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">À propos</h3>
            <p className="text-sm text-muted-foreground">
              {safeProject.description || 'Aucune description'}
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Créé le {format(new Date(safeProject.created_at), 'PPP', { locale: fr })}</span>
            </div>
          </div>

          {/* Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Membres</h3>
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Gérer
              </Button>
            </div>
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback>
                      {member.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.full_name || member.email}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div>
            <Button variant="outline" className="w-full" onClick={() => {}}>
              <Settings className="h-4 w-4 mr-2" />
              Paramètres du projet
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
} 