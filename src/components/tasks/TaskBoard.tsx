'use client';

import { Task, taskService } from '@/lib/services/taskService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { TaskColumn } from './TaskColumn';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateTaskDialog } from './CreateTaskDialog';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const TASK_STATUSES = [
  { id: 'todo', name: 'À faire', color: 'bg-slate-200' },
  { id: 'in_progress', name: 'En cours', color: 'bg-blue-200' },
  { id: 'review', name: 'En révision', color: 'bg-yellow-200' },
  { id: 'done', name: 'Terminé', color: 'bg-green-200' },
];

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

interface TaskBoardProps {
  projectId: string;
}

const MotionButton = motion(Button);

export function TaskBoard({ projectId }: TaskBoardProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => taskService.getTasks(projectId),
  });

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      try {
        await taskService.updateTaskStatus(draggableId, destination.droppableId);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        toast.success('Tâche déplacée avec succès');
      } catch (error) {
        toast.error('Erreur lors du déplacement de la tâche');
      }
    }

    if (source.index !== destination.index) {
      const column = tasks.filter(
        (task) => task.status === destination.droppableId
      );
      const newOrder = Array.from(column);
      const [removed] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, removed);

      try {
        await taskService.reorderTasks(
          projectId,
          newOrder.map((task) => task.id)
        );
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      } catch (error) {
        toast.error('Erreur lors de la réorganisation des tâches');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-8 w-8 border-b-2 border-primary"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div 
        className="flex justify-between items-center"
        variants={columnVariants}
      >
        <h2 className="text-2xl font-bold">Tableau des tâches</h2>
        <MotionButton
          onClick={() => setIsCreateDialogOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </MotionButton>
      </motion.div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={columnVariants}
        >
          <AnimatePresence>
            {TASK_STATUSES.map((status, index) => (
              <Droppable key={status.id} droppableId={status.id}>
                {(provided, snapshot) => (
                  <motion.div
                    variants={columnVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ delay: index * 0.1 }}
                  >
                    <TaskColumn
                      status={status}
                      tasks={tasks.filter((task) => task.status === status.id)}
                      provided={provided}
                      snapshot={snapshot}
                    />
                  </motion.div>
                )}
              </Droppable>
            ))}
          </AnimatePresence>
        </motion.div>
      </DragDropContext>

      <CreateTaskDialog
        projectId={projectId}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </motion.div>
  );
} 