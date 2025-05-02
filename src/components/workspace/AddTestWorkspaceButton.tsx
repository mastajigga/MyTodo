import { useWorkspaceContext } from '@/contexts/workspace-context';
import { workspaceService } from '@/services/workspace';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function AddTestWorkspaceButton() {
  const { setWorkspaces } = useWorkspaceContext();

  // Ne pas afficher en prod
  if (process.env.NODE_ENV !== 'development') return null;

  const handleAddTestWorkspace = async () => {
    try {
      const workspace = await workspaceService.createWorkspace(
        'Workspace de test',
        'Espace de travail ajouté pour le debug.'
      );
      // Rafraîchir la liste
      const workspaces = await workspaceService.getUserWorkspaces();
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