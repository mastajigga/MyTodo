import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Task } from '@/components/tasks/Task';
import { Plus } from 'lucide-react';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';

interface ProjectProps {
  project: {
    id: string;
    name: string;
    description: string;
    workspace_id: string;
    color: string;
    created_at: string;
    updated_at: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    project_id: string;
    created_by: string;
    created_at: string;
    updated_at: string;
  }>;
  onAddTask?: () => void;
}

export const Project = ({ project, tasks, onAddTask }: ProjectProps) => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredTasks = tasks.map(task => ({
    ...task,
    status: task.status as "todo" | "completed" | "in_progress" | "cancelled",
    priority: task.priority as "low" | "medium" | "high" | "urgent"
  }));

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-muted-foreground mt-1">{project.description}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {tasks.length} tasks
          </p>
        </div>
        <Button onClick={onAddTask} aria-label="add task">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <ToggleGroup type="single" onValueChange={setStatusFilter}>
            <ToggleGroupItem value="todo" aria-label="todo">
              To Do
            </ToggleGroupItem>
            <ToggleGroupItem value="in_progress" aria-label="in progress">
              In Progress
            </ToggleGroupItem>
            <ToggleGroupItem value="completed" aria-label="completed">
              Completed
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 