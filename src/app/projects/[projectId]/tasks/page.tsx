'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { TaskList } from '@/components/tasks/TaskList';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { projectService } from '@/lib/services/projectService';

export default function ProjectTasksPage() {
  const params = useParams() as Record<string, string>;
  const projectId = params?.projectId;
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      setLoading(true);
      try {
        const project = await projectService.getProject(projectId);
        setWorkspaceId(project?.workspace_id || null);
      } catch (error) {
        setWorkspaceId(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Tâches du projet"
        description="Gérez et suivez les tâches de ce projet"
      />
      <div className="mt-8">
        {loading || !workspaceId ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <TaskList workspaceId={workspaceId} />
        )}
      </div>
    </div>
  );
} 