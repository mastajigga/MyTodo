import { useWorkspaceContext } from '@/contexts/workspace-context';
import { workspaceService } from '@/services/workspace';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSupabase } from '@/lib/supabase/useSupabase';

export function AddTestWorkspaceButton() {
  const { setWorkspaces } = useWorkspaceContext();
  const { supabase } = useSupabase();

  // Ne pas afficher en prod
  if (process.env.NODE_ENV !== 'development') return null;

  const handleAddTestWorkspace = async () => {
    try {
      const workspace = await workspaceService.createWorkspace(
        'Workspace de test',
        'Espace de travail ajouté pour le debug.',
        supabase
      );
      // Rafraîchir la liste
      const workspaces = await workspaceService.getUserWorkspaces(supabase);
      setWorkspaces(workspaces);
      toast.success('Workspace de test ajouté !');
    } catch (e: any) {
      toast.error('Erreur lors de l\'ajout du workspace de test : ' + (e?.message || e));
    }
  };

  return (
    <Button variant="outline" onClick={handleAddTestWorkspace} className="mb-4">
      Ajouter un workspace de test
    </Button>
  );
} 