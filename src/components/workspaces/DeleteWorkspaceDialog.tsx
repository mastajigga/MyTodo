'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Workspace } from '@/types/workspace';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useSupabase } from '@/lib/supabase/supabase-provider'

interface DeleteWorkspaceDialogProps {
  workspace: Workspace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteWorkspaceDialog({
  workspace,
  open,
  onOpenChange,
}: DeleteWorkspaceDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { supabase } = useSupabase();

  async function handleDelete() {
    try {
      setIsDeleting(true);
      
      // Supprimer l'espace de travail
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspace.id);

      if (error) throw error;

      toast.success("L'espace de travail a été supprimé");
      router.refresh();
      router.push('/dashboard');
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression de l'espace de travail");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
          <AlertDialogContent asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Êtes-vous sûr de vouloir supprimer cet espace de travail ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Tous les projets et tâches associés
                  seront définitivement supprimés.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isDeleting}
                  className="bg-gradient-to-r from-gray-500/10 to-gray-600/10 hover:from-gray-500/20 hover:to-gray-600/20 transition-all duration-300"
                >
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white transition-all duration-300"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Supprimer'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </motion.div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </AnimatePresence>
  );
} 