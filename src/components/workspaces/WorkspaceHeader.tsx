'use client';

import { Workspace } from '@/types/workspace';
import { Button } from '@/components/ui/button';
import { Edit2, Share2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DeleteWorkspaceDialog } from '@/components/workspaces/DeleteWorkspaceDialog';
import { EditWorkspaceDialog } from '@/components/workspaces/EditWorkspaceDialog';
import { ShareWorkspaceDialog } from '@/components/workspaces/ShareWorkspaceDialog';

interface WorkspaceHeaderProps {
  workspace: Workspace;
}

export function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-start justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {workspace.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {workspace.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsShareDialogOpen(true)}
            className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEditDialogOpen(true)}
            className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="bg-gradient-to-r from-rose-500/10 to-red-500/10 hover:from-rose-500/20 hover:to-red-500/20 transition-all duration-300"
          >
            <Trash2 className="h-4 w-4 text-rose-500" />
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="relative"
      >
        <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full" />
        <div className="absolute top-0 h-1 w-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-sm" />
      </motion.div>

      <DeleteWorkspaceDialog
        workspace={workspace}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
      <EditWorkspaceDialog
        workspace={workspace}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={() => setIsEditDialogOpen(false)}
      />
      <ShareWorkspaceDialog
        workspace={workspace}
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
      />
    </motion.div>
  );
} 