import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { Card } from '@/components/ui/card';
import { Loader2, Users, FolderGit2, Clock, CheckCircle2 } from 'lucide-react';

interface ProjectStats {
  totalProjects: number;
  totalMembers: number;
  activeProjects: number;
  completedProjects: number;
}

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

export default function ProjectStats() {
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    totalMembers: 0,
    activeProjects: 0,
    completedProjects: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();

  useEffect(() => {
    async function fetchStats() {
      try {
        // Récupérer le nombre total de projets
        const { count: totalProjects } = await supabase
          .from('projects')
          .select('*', { count: 'exact' });

        // Récupérer le nombre de membres uniques
        const { count: totalMembers } = await supabase
          .from('project_members')
          .select('user_id', { count: 'exact', head: true });

        // Récupérer le nombre de projets actifs
        const { count: activeProjects } = await supabase
          .from('projects')
          .select('*', { count: 'exact' })
          .eq('status', 'in_progress');

        // Récupérer le nombre de projets terminés
        const { count: completedProjects } = await supabase
          .from('projects')
          .select('*', { count: 'exact' })
          .eq('status', 'completed');

        setStats({
          totalProjects: totalProjects || 0,
          totalMembers: totalMembers || 0,
          activeProjects: activeProjects || 0,
          completedProjects: completedProjects || 0
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      <motion.div variants={item}>
        <Card className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border-none">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/20 rounded-full">
              <FolderGit2 className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Projets</p>
              <h3 className="text-2xl font-bold text-foreground">{stats.totalProjects}</h3>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border-none">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Membres</p>
              <h3 className="text-2xl font-bold text-foreground">{stats.totalMembers}</h3>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-sm border-none">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-pink-500/20 rounded-full">
              <Clock className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Projets Actifs</p>
              <h3 className="text-2xl font-bold text-foreground">{stats.activeProjects}</h3>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="p-6 bg-gradient-to-br from-rose-500/10 to-orange-500/10 backdrop-blur-sm border-none">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-rose-500/20 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Projets Terminés</p>
              <h3 className="text-2xl font-bold text-foreground">{stats.completedProjects}</h3>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
} 