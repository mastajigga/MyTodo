'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { workspaceService } from '@/lib/services/workspaceService';
import { Loader2, Users, FolderGit2 } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export function WorkspaceList() {
  const router = useRouter();

  const { data: workspaces, isLoading, error } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspaceService.getWorkspaces(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-destructive">Une erreur est survenue lors du chargement des espaces de travail</p>
      </div>
    );
  }

  if (!workspaces?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Aucun espace de travail trouvé</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {workspaces.map((workspace) => (
        <motion.div
          key={workspace.id}
          variants={item}
          className="group cursor-pointer"
          onClick={() => router.push(`/workspaces/${workspace.id}`)}
        >
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 backdrop-blur-sm border-none transition-all duration-300 hover:shadow-lg">
            <CardHeader className="p-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold tracking-tight">
                  {workspace.name}
                </CardTitle>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {workspace.type === 'personal' ? 'Personnel' : 'Équipe'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {workspace.description || 'Aucune description'}
              </p>
            </CardHeader>
            <CardContent className="p-0 mt-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{workspace._count?.members || 0} membres</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FolderGit2 className="h-4 w-4" />
                    <span>{workspace._count?.projects || 0} projets</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
} 