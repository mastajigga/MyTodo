import { useQuery } from '@tanstack/react-query';
import { WorkspaceMemberService, WorkspaceMember } from '@/services/workspace-member.service';
import { useProject } from './useProject';
import { Project } from '@/types/project';

export const useProjectMembers = (projectId: string) => {
  const { project } = useProject(projectId);

  const {
    data: members,
    isLoading,
    error
  } = useQuery<WorkspaceMember[]>({
    queryKey: ['project-members', project?.workspace_id],
    queryFn: () => WorkspaceMemberService.getWorkspaceMembers(project?.workspace_id || ''),
    enabled: !!project?.workspace_id
  });

  return {
    members: members || [],
    isLoading,
    error
  };
}; 