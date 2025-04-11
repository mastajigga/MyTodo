'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { WorkspaceService } from '@/services/workspace.service';
import { toast } from 'sonner';

export function CreateWorkspaceButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'family' | 'professional' | 'private'>('professional');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await WorkspaceService.createWorkspace({
        name,
        type,
        description,
      });

      toast.success('Espace de travail créé avec succès');
      router.refresh();
      setOpen(false);
      setName('');
      setDescription('');
      setType('professional');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Une erreur est survenue lors de la création de l\'espace de travail.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Nouvel espace de travail
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un espace de travail</DialogTitle>
            <DialogDescription>
              Créez un nouvel espace de travail pour collaborer avec votre équipe.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mon espace de travail"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value: 'family' | 'professional' | 'private') => setType(value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professionnel</SelectItem>
                  <SelectItem value="family">Famille</SelectItem>
                  <SelectItem value="private">Privé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de l'espace de travail"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading || !name.trim()}>
                {loading ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 