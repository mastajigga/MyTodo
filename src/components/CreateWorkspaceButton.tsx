import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { workspaceService } from "@/services/workspace";
import { WorkspaceType } from "@/types/workspace";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export function CreateWorkspaceButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<WorkspaceType>("personal");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await workspaceService.createWorkspace({
        name,
        type,
        description
      });
      toast.success("Espace de travail créé avec succès");
      setOpen(false);
      setName("");
      setDescription("");
      setType("personal");
    } catch (error) {
      console.error("Erreur lors de la création de l'espace de travail:", error);
      toast.error("Erreur lors de la création de l'espace de travail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-dashed border-2 hover:border-solid"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Créer un espace de travail
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouvel espace de travail</DialogTitle>
          <DialogDescription>
            Créez un nouvel espace de travail pour organiser vos projets et tâches.
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
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de l'espace de travail"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={type}
              onValueChange={(value: WorkspaceType) => setType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personnel</SelectItem>
                <SelectItem value="team">Équipe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 