'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { STATUS_COLUMNS } from '@/lib/constants/task';
import { useTasksByStatus } from '@/hooks/useTasksByStatus';

type TaskListProps = {
  tasks: Task[];
  onTaskMove: (result: DropResult) => void;
};

/**
 * TaskList component displays tasks in a kanban board layout with drag and drop functionality
 * @component
 * @param {TaskListProps} props - Component props
 * @param {Task[]} props.tasks - Array of tasks to display
 * @param {Function} props.onTaskMove - Callback function when a task is moved
 * @returns {JSX.Element | null} Rendered task list or null if not enabled
 */
export function TaskList({ tasks, onTaskMove }: TaskListProps) {
  const [enabled, setEnabled] = useState(false);
  const tasksByStatus = useTasksByStatus(tasks);

  // Enable drag and drop only on client side
  useEffect(() => {
    setEnabled(true);
  }, []);

  if (!enabled) {
    return null;
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onTaskMove(result);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {STATUS_COLUMNS.map((column) => (
          <div
            key={column.id}
            className="flex flex-col rounded-lg border bg-gray-50/50 p-4"
          >
            <h3 className="mb-4 font-semibold">{column.label}</h3>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'flex flex-1 flex-col gap-2',
                    snapshot.isDraggingOver && 'bg-gray-100'
                  )}
                >
                  {tasksByStatus[column.id]?.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
} 