import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectList } from '@/components/projects/ProjectList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projets | MyTodo',
  description: 'Gérez vos projets et suivez leur progression',
};

export default function ProjectsPage() {
  return (
    <div className="container py-8">
      <div className="relative mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
          Projets
        </h1>
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
      </div>

      <div className="space-y-8">
        <ProjectHeader />
        <div className="backdrop-blur-sm bg-card/50 rounded-lg border border-border/50">
          <ProjectList />
        </div>
      </div>
    </div>
  );
} 