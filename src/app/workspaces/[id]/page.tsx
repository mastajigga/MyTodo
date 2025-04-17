import { WorkspaceMembers } from "@/components/workspace/WorkspaceMembers"
import { WorkspaceInvite } from "@/components/workspace/WorkspaceInvite"
import { Card } from "@/components/ui/card"
import { ProjectList } from "@/components/projects/ProjectList"
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { WorkspaceHeader } from '@/components/workspaces/WorkspaceHeader';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function WorkspaceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth');
  }

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!workspace) {
    redirect('/workspaces');
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <WorkspaceHeader workspace={workspace} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 backdrop-blur-sm bg-card/50">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Membres</h2>
              <p className="text-muted-foreground">
                Gérez les membres de votre espace de travail
              </p>
            </div>
            <WorkspaceMembers workspaceId={workspace.id} />
            <WorkspaceInvite workspaceId={workspace.id} />
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-sm bg-card/50">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Projets</h2>
              <p className="text-muted-foreground">
                Tous les projets de cet espace de travail
              </p>
            </div>
            <ProjectHeader workspaceId={workspace.id} />
            <ProjectList workspaceId={workspace.id} />
          </div>
        </Card>
      </div>
    </div>
  );
} 