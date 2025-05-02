import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { taskService } from '@/lib/services/taskService';
import { Task } from '@/types/task';

interface ImportTasksProps {
  projectId: string;
  workspaceId: string;
  onSuccess: () => void;
}

export function ImportTasks({ projectId, workspaceId, onSuccess }: ImportTasksProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
    } else {
      toast.error('Veuillez sélectionner un fichier JSON valide');
      event.target.value = '';
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    setIsLoading(true);
    try {
      const fileContent = await file.text();
      const tasks = JSON.parse(fileContent) as Task[];

      // Validation du format des tâches
      const isValid = tasks.every(task => 
        task.title &&
        ['low', 'medium', 'high', 'urgent'].includes(task.priority) &&
        ['todo', 'in_progress', 'completed', 'cancelled'].includes(task.status)
      );

      if (!isValid) {
        throw new Error('Format de fichier invalide');
      }

      // Import des tâches
      for (const task of tasks) {
        await taskService.createTask({
          ...task,
          project_id: projectId,
        });
      }

      toast.success('Tâches importées avec succès');
      onSuccess();
      setFile(null);
      if (document.querySelector<HTMLInputElement>('input[type="file"]')) {
        (document.querySelector<HTMLInputElement>('input[type="file"]')!).value = '';
      }
    } catch (error) {
      toast.error('Erreur lors de l\'importation des tâches');
      console.error('Erreur d\'importation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          onClick={handleImport}
          disabled={!file || isLoading}
        >
          {isLoading ? 'Importation...' : 'Importer'}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Format accepté : fichier JSON contenant un tableau de tâches
      </p>
    </div>
  );
} 