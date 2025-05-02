// TaskColumn.tsx
import { Task, TaskStatus } from '@/@types/task';
import { DroppableProvided, DroppableStateSnapshot } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface TaskColumnProps {
  status: {
    id: TaskStatus;
    name: string;
    color: string;
  };
  tasks: Task[];
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
}

export function TaskColumn({ status, tasks, provided, snapshot }: TaskColumnProps) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className={`p-4 rounded-lg ${status.color} min-h-[300px] transition-colors duration-200 ease-in-out ${
        snapshot.isDraggingOver ? 'bg-opacity-50 ring-2 ring-primary/20' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{status.name}</h3>
        <Badge variant="secondary" className="text-xs">
          {tasks.length}
        </Badge>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.2,
                type: "spring",
                stiffness: 500,
                damping: 25
              }}
              className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h4 className="font-medium line-clamp-2">{task.title}</h4>
              {task.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{task.description}</p>
              )}
              {task.due_date && (
                <div className="mt-2 text-xs text-gray-500">
                  Échéance : {new Date(task.due_date).toLocaleDateString('fr-FR')}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {provided.placeholder}
      </div>
    </div>
  );
} 