import { DroppableProvided, Draggable } from '@hello-pangea/dnd';
import { KanbanColumn as IKanbanColumn } from '@/@types/task';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';

const columnColors = {
  todo: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-500',
  in_progress: 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 text-yellow-500',
  review: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-500',
  done: 'from-green-500/10 to-green-500/5 border-green-500/20 text-green-500'
};

interface KanbanColumnProps {
  column: IKanbanColumn;
  provided: DroppableProvided;
}

export const KanbanColumn = ({ column, provided }: KanbanColumnProps) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className={cn(
        "w-full md:w-80 rounded-xl p-4 flex flex-col border backdrop-blur-sm",
        "bg-gradient-to-b shadow-lg min-h-[calc(100vh-24rem)]",
        columnColors[column.id]
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{column.title}</h3>
        <span className={cn(
          "px-2.5 py-1 rounded-full text-sm font-medium",
          "bg-white/10 backdrop-blur-sm"
        )}>
          {column.tasks.length}
        </span>
      </div>

      <div className="flex-1 space-y-3">
        {column.tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={cn(
                  'transition-all duration-200',
                  snapshot.isDragging && 'scale-105 rotate-2 opacity-90'
                )}
              >
                <TaskCard task={task} />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    </div>
  );
}; 