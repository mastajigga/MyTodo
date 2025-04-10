import { PageHeader } from '@/components/shared/PageHeader';
import { TaskList } from '@/components/tasks/TaskList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mes tâches | MyTodo',
  description: 'Gérez et organisez vos tâches personnelles',
};

export default function TasksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Mes tâches"
        description="Gérez et suivez vos tâches personnelles"
      />
      <div className="mt-8">
        <TaskList />
      </div>
    </div>
  );
} 