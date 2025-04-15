import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectList } from '@/components/projects/ProjectList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projets | MyTodo',
  description: 'Gérez vos projets et suivez leur progression',
};

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8">
      <ProjectHeader workspaceId="default" />
      <ProjectList />
    </div>
  );
} 