import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Workspace } from '@/types/workspace';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Copy, Check } from 'lucide-react';

interface ShareWorkspaceDialogProps {
  workspace: Workspace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareWorkspaceDialog({
  workspace,
  open,
  onOpenChange,
}: ShareWorkspaceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const supabase = createClientComponentClient();

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      // Vérifier si l'utilisateur existe
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !users) {
        toast.error("Cet utilisateur n'existe pas");
        return;
      }

      // Vérifier si l'utilisateur est déjà membre
      const { data: existingMember, error: memberError } = await supabase
        .from('workspace_members')
        .select('id')
        .eq('workspace_id', workspace.id)
        .eq('user_id', users.id)
        .single();

      if (existingMember) {
        toast.error("Cet utilisateur est déjà membre de l'espace de travail");
        return;
      }

      // Ajouter le membre
      const { error } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspace.id,
          user_id: users.id,
          role: 'member'
        });

      if (error) throw error;

      toast.success("L'invitation a été envoyée");
      setEmail('');
    } catch (error) {
      console.error('Erreur lors de l\'invitation:', error);
      toast.error("Erreur lors de l'envoi de l'invitation");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyInviteLink() {
    const inviteLink = `${window.location.origin}/workspaces/join/${workspace.id}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('Lien copié dans le presse-papier');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erreur lors de la copie du lien');
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="sm:max-w-[425px]"
            >
              <DialogHeader>
                <DialogTitle>Partager l'espace de travail</DialogTitle>
                <DialogDescription>
                  Invitez des membres à rejoindre votre espace de travail.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleInvite} className="space-y-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email du membre</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="membre@example.com"
                      className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 focus-visible:ring-indigo-500"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-300"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Inviter'
                      )}
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Lien d'invitation</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={`${window.location.origin}/workspaces/join/${workspace.id}`}
                      className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 focus-visible:ring-indigo-500"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={copyInviteLink}
                      className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-300"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </form>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="bg-gradient-to-r from-gray-500/10 to-gray-600/10 hover:from-gray-500/20 hover:to-gray-600/20 transition-all duration-300"
                >
                  Fermer
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 