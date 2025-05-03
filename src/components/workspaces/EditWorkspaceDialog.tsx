'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Workspace } from '@/types/workspace';
import { workspaceService } from '@/lib/services/workspaceService';
import { toast } from 'sonner';
import { useSupabase } from '@/lib/supabase/supabase-provider'

interface EditWorkspaceDialogProps {
  workspace: Workspace;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditWorkspaceDialog({ workspace, isOpen, onClose, onSuccess }: EditWorkspaceDialogProps) {
  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description || '');
  const [isLoading, setIsLoading] = useState(false);

  const { supabase } = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await workspaceService.updateWorkspace(workspace.id, {
        name,
        description: description || null
      });
      toast.success('Espace de travail modifié avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la modification de l\'espace de travail');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l'espace de travail</DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre espace de travail ici.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Nom
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de l'espace de travail"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de l'espace de travail"
              disabled={isLoading}
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !name}>
              {isLoading ? 'Modification...' : 'Modifier'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 