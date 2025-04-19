'use client';

import { WorkspaceMembers } from "@/components/workspace/WorkspaceMembers"
import { WorkspaceInvite } from "@/components/workspace/WorkspaceInvite"
import { Card } from "@/components/ui/card"
import { ProjectList } from "@/components/projects/ProjectList"
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { WorkspaceHeader } from '@/components/workspaces/WorkspaceHeader';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Database } from '@/lib/database.types';
import { Workspace } from '@/types/workspace';

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
  show: { opacity: 1, y: 0 }
};

export default function WorkspaceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const { data: workspace, error } = await supabase
          .from('workspaces')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setWorkspace(workspace);
      } catch (error) {
        console.error('Error fetching workspace:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [params.id, supabase]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container mx-auto py-8 space-y-8"
    >
      <motion.div variants={item}>
        <WorkspaceHeader workspace={workspace} />
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={item}>
          <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-primary/10 hover:via-purple-500/10 hover:to-pink-500/10">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Membres
                </h2>
                <p className="text-muted-foreground">
                  Gérez les membres de votre espace de travail
                </p>
              </div>
              <WorkspaceMembers workspaceId={workspace.id} />
              <WorkspaceInvite workspaceId={workspace.id} />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-primary/10 hover:via-purple-500/10 hover:to-pink-500/10">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Projets
                </h2>
                <p className="text-muted-foreground">
                  Tous les projets de cet espace de travail
                </p>
              </div>
              <ProjectHeader workspaceId={workspace.id} />
              <ProjectList workspaceId={workspace.id} />
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
} 