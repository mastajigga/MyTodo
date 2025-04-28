import { motion } from 'framer-motion';
import { WorkspaceList } from './WorkspaceList';
import { CreateWorkspaceButton } from './CreateWorkspaceButton';
import { FolderPlus } from 'lucide-react';

export const WorkspaceSelectorScreen = ({ hasWorkspaces }: { hasWorkspaces: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent mb-6"
      >
        Sélectionnez un espace de travail
      </motion.h2>
      {hasWorkspaces ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <WorkspaceList />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
          className="flex flex-col items-center justify-center mt-8"
        >
          <FolderPlus className="w-20 h-20 text-purple-400 animate-bounce mb-4" />
          <p className="text-lg text-muted-foreground mb-6 text-center">
            Vous n'avez encore aucun espace de travail.<br />
            Créez-en un pour commencer à organiser vos projets !
          </p>
          <CreateWorkspaceButton />
        </motion.div>
      )}
    </div>
  );
}; 