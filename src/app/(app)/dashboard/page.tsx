import { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Tableau de bord | MyTodo',
  description: 'Gérez vos tâches et vos espaces de travail',
};

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={`Bienvenue, ${profile?.full_name || 'Utilisateur'}`}
        description="Voici un aperçu de vos tâches et espaces de travail."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Statistiques */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Tâches en cours</h3>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Tâches à venir</h3>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Tâches terminées</h3>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </div>
      </div>

      {/* Activité récente */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Activité récente</h2>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 text-center text-gray-500">
            Aucune activité récente
          </div>
        </div>
      </section>
    </div>
  );
} 