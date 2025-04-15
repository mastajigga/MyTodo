import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { ProjectMetrics } from './ProjectMetrics';
import { ProjectSidebar } from './ProjectSidebar';
import { ProjectHeader } from './ProjectHeader';
import { ProjectTimeline } from './ProjectTimeline';
import { ProjectFilters } from './ProjectFilters';
import { useProject } from '@/hooks/useProject';
import { useProjectTasks } from '@/hooks/useProjectTasks';
import { useProjectMembers } from '@/hooks/useProjectMembers';
import { Project as ProjectType } from '@/lib/types';

interface ProjectProps {
  projectId: string;
}

export const Project = ({ projectId }: ProjectProps) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const { project, isLoading: projectLoading } = useProject(projectId);
  const { tasks, isLoading: tasksLoading } = useProjectTasks(projectId);
  const { members, isLoading: membersLoading } = useProjectMembers(projectId);
  const [filters, setFilters] = useState({
    status: null,
    priority: null,
    assignee: null,
    dueDate: null
  });

  if (projectLoading || tasksLoading || membersLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!project) {
    return <div className="text-center">Project not found</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      {showSidebar && project && typeof project === 'object' && 'id' in project && (
        <ProjectSidebar
          project={project as ProjectType}
          members={members}
          onClose={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <ProjectHeader
            workspaceId={project.workspace_id}
          />

          {/* Metrics */}
          <div className="px-6 py-4">
            <ProjectMetrics project={project} tasks={tasks} />
          </div>

          {/* Filters */}
          <div className="px-6 py-2">
            <ProjectFilters
              filters={filters}
              onChange={setFilters}
              members={members}
            />
          </div>

          {/* Kanban Board */}
          <div className="flex-1 overflow-hidden px-6 py-4">
            <Card>
              <CardContent className="p-0">
                <KanbanBoard
                  projectId={projectId}
                />
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <div className="px-6 py-4">
            <ProjectTimeline projectId={projectId} />
          </div>
        </div>
      </div>
    </div>
  );
}; 