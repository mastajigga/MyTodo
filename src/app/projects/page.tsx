import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ProjectsView } from '@/components/projects/ProjectsView';
import { Logger } from '@/lib/logger';

export default async function ProjectsPage() {
  const supabase = createServerComponentClient({ cookies });
  const logger = Logger.getInstance();
  
  // Récupération des projets
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  // Récupération des workspaces
  const { data: workspaces, error: workspacesError } = await supabase
    .from('workspaces')
    .select('*')
    .order('created_at', { ascending: false });

  // Récupération du profil utilisateur
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // Logs
  if (user) {
    logger.info('👤 Profil utilisateur connecté:', {
      context: 'auth',
      data: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      }
    });
  }

  if (workspaces) {
    logger.info('🏢 Workspaces disponibles:', {
      context: 'workspaces',
      data: workspaces.map(w => ({
        id: w.id,
        name: w.name,
        description: w.description
      }))
    });
  }

  if (projects) {
    logger.info('📂 Projets disponibles:', {
      context: 'projects',
      data: projects.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        workspace_id: p.workspace_id
      }))
    });
  }

  if (projectsError) {
    logger.error('Erreur lors de la récupération des projets:', {
      context: 'projects',
      data: projectsError
    });
    return <div>Une erreur est survenue lors du chargement des projets.</div>;
  }

  return <ProjectsView projects={projects} />;
} 