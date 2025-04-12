// TaskColumn.tsx
import { Task } from '@/lib/services/taskService';
import { DroppableProvided, DroppableStateSnapshot } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';

interface TaskColumnProps {
  status: {
    id: string;
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
      className={`p-4 rounded-lg ${status.color} min-h-[200px] ${
        snapshot.isDraggingOver ? 'bg-opacity-50' : ''
      }`}
    >
      <h3 className="font-semibold mb-4">{status.name}</h3>
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-3 rounded shadow"
          >
            <h4 className="font-medium">{task.title}</h4>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
          </motion.div>
        ))}
        {provided.placeholder}
      </div>
    </div>
  );
} 