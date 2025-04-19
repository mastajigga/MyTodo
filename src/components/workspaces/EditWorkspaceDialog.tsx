import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EditWorkspaceDialogProps {
  workspace: Workspace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditWorkspaceDialog({
  workspace,
  open,
  onOpenChange,
}: EditWorkspaceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description || '');
  const router = useRouter();
  const supabase = createClientComponentClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('workspaces')
        .update({
          name,
          description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', workspace.id);

      if (error) throw error;

      toast.success("L'espace de travail a été mis à jour");
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error("Erreur lors de la mise à jour de l'espace de travail");
    } finally {
      setIsLoading(false);
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
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Modifier l'espace de travail</DialogTitle>
                  <DialogDescription>
                    Modifiez les informations de votre espace de travail ici.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 focus-visible:ring-indigo-500"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 focus-visible:ring-indigo-500 min-h-[100px]"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-gray-500/10 to-gray-600/10 hover:from-gray-500/20 hover:to-gray-600/20 transition-all duration-300"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-300"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Enregistrer'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 