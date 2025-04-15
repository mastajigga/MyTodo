'use client';

import { TaskBoard } from '@/components/tasks/TaskBoard';
import { useParams } from 'next/navigation';
import { ProjectHeader } from '@/components/projects/ProjectHeader';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <ProjectHeader workspaceId="default" />
      <TaskBoard projectId={projectId} />
    </div>
  );
} 