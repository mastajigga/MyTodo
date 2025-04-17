'use client';

import { Project } from '@/lib/services/projectService';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project & {
    members: { count: number };
    workspace: { id: string; name: string };
  };
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(project);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(project);
  };

  return (
    <div className="group/card relative">
      <Link 
        href={`/projects/${project.id}`} 
        className="absolute inset-0 z-0 cursor-pointer"
        aria-label={`Voir les détails du projet ${project.name}`}
      />
      <Card className="relative z-10 w-full overflow-hidden backdrop-blur-sm bg-card/50 border border-border/50 group-hover/card:border-primary/50 group-hover/card:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight group-hover/card:text-primary transition-colors">
              {project.name}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description || 'Aucune description'}
            </p>
          </div>
          <div className="relative z-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-8 w-8 p-0 cursor-pointer"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem 
                  onClick={handleEdit}
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline"
              className={cn(
                "transition-colors",
                project.status === 'completed' && "bg-green-500/10 text-green-500",
                project.status === 'in_progress' && "bg-blue-500/10 text-blue-500",
                project.status === 'cancelled' && "bg-red-500/10 text-red-500",
                !project.status && "bg-primary/10 text-primary"
              )}
            >
              {project.status || 'En cours'}
            </Badge>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {project.members.count} membre{project.members.count > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 