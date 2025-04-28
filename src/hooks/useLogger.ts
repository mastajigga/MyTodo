import { Logger } from '@/lib/logger';
import { WorkspaceStats } from '@/types/workspace';

export function useLogger() {
  const logger = Logger.getInstance();

  return {
    logProjects: (projects: any[]) => {
      logger.info('📂 Projets disponibles:', {
        context: 'projects',
        data: projects.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          workspace_id: p.workspace_id
        }))
      });
    },
    logWorkspaces: (workspaces: any[], stats?: Record<string, WorkspaceStats>) => {
      logger.info('🏢 Workspaces disponibles:', {
        context: 'workspaces',
        data: workspaces.map(w => ({
          id: w.id,
          name: w.name,
          description: w.description,
          type: w.type,
          created_at: w.created_at,
          created_by: w.created_by,
          stats: stats?.[w.id] || {
            members: 0,
            projects: 0,
            tasks: 0,
            activities: 0
          },
          members_count: w.members_count,
          projects_count: w.projects_count,
          tasks_count: w.tasks_count
        }))
      });
    },
    logUser: (user: any) => {
      logger.info('👤 Profil utilisateur:', {
        context: 'auth',
        data: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata
        }
      });
    }
  };
} 