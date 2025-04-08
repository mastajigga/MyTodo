'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';

const statusColumns = [
  { id: 'todo', label: 'À faire' },
  { id: 'in_progress', label: 'En cours' },
  { id: 'completed', label: 'Terminé' },
];

type TaskListProps = {
  tasks: Task[];
  onTaskMove?: (result: any) => void;
};

export function TaskList({ tasks, onTaskMove }: TaskListProps) {
  const [enabled, setEnabled] = useState(false);

  // Activer le drag and drop côté client uniquement
  useState(() => {
    setEnabled(true);
  });

  const tasksByStatus = statusColumns.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.status === column.id);
    return acc;
  }, {} as Record<string, Task[]>);

  if (!enabled) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onTaskMove}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statusColumns.map((column) => (
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