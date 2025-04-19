'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Workspace } from '@/types/workspace';
import { workspaceService } from '@/lib/services/workspaceService';
import { toast } from 'sonner';
import { Copy, Check } from 'lucide-react';

interface ShareWorkspaceDialogProps {
  workspace: Workspace;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareWorkspaceDialog({ workspace, isOpen, onClose }: ShareWorkspaceDialogProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await workspaceService.inviteToWorkspace(workspace.id, email);
      toast.success('Invitation envoyée avec succès');
      setEmail('');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const inviteLink = `${window.location.origin}/workspaces/invite/${workspace.id}`;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Lien copié dans le presse-papier');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Partager l'espace de travail</DialogTitle>
          <DialogDescription>
            Invitez des membres à rejoindre votre espace de travail.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Adresse email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemple.com"
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading || !email}>
            {isLoading ? 'Envoi...' : 'Envoyer une invitation'}
          </Button>
        </form>
        <div className="mt-6 space-y-2">
          <div className="text-sm font-medium">Ou partagez le lien d'invitation</div>
          <div className="flex space-x-2">
            <Input
              readOnly
              value={`${window.location.origin}/workspaces/invite/${workspace.id}`}
              className="bg-muted"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 