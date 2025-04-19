'use client';

import { workspaceService } from '@/services/workspace';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkspaceType } from '@/types/workspace';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const workspaceTypeLabels: Record<WorkspaceType, string> = {
  personal: 'Personnel',
  team: 'Équipe',
};

const workspaceTypeColors: Record<WorkspaceType, string> = {
  personal: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  team: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
};

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
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

export function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const data = await workspaceService.getWorkspaces();
        setWorkspaces(data);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[200px] rounded-xl bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h3 className="text-lg font-medium text-foreground">Aucun espace de travail</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Commencez par créer votre premier espace de travail.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {workspaces.map((workspace) => (
        <motion.div
          key={workspace.id}
          variants={item}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link href={`/workspaces/${workspace.id}`}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="line-clamp-1">{workspace.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {workspace.description || 'Aucune description'}
                    </CardDescription>
                  </div>
                  <Badge className={workspaceTypeColors[workspace.type]}>
                    {workspaceTypeLabels[workspace.type]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Créé le {new Date(workspace.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
} 