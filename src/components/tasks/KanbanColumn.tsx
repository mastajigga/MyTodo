import { DroppableProvided, Draggable } from '@hello-pangea/dnd';
import { KanbanColumn as IKanbanColumn } from '@/types/task';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: IKanbanColumn;
  provided: DroppableProvided;
}

export const KanbanColumn = ({ column, provided }: KanbanColumnProps) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className="bg-card w-80 rounded-lg p-4 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{column.title}</h3>
        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
          {column.tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {column.tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={cn(
                  'mb-3',
                  snapshot.isDragging && 'opacity-50'
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