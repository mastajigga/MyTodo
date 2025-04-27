'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Plus } from 'lucide-react';
import { WorkspaceType } from '@/@types/workspace';
import { useQueryClient } from '@tanstack/react-query';

export function CreateWorkspaceButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<WorkspaceType>('private');
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('Utilisateur non connecté');

      // Créer le workspace et ajouter l'utilisateur comme propriétaire
      const { data: workspace, error: workspaceError } = await supabase
        .rpc('create_workspace_with_owner', {
          workspace_name: name,
          workspace_description: description || null,
          workspace_type: type,
          owner_id: user.id
        });

      if (workspaceError) throw workspaceError;

      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Espace de travail créé avec succès');
      setIsOpen(false);
      setName('');
      setDescription('');
      setType('private');
    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      toast.error(error.message || 'Erreur lors de la création de l\'espace de travail');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel espace
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouvel espace de travail</DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel espace de travail pour organiser vos projets et collaborer avec votre équipe.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'espace</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mon espace de travail"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de votre espace de travail..."
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type d'espace</Label>
            <Select
              value={type}
              onValueChange={(value: WorkspaceType) => setType(value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Privé</SelectItem>
                <SelectItem value="professional">Professionnel</SelectItem>
                <SelectItem value="family">Famille</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer l\'espace'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 