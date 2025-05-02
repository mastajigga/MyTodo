"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkspaceType, CreateWorkspaceData } from "@/types/workspace";
import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase/useSupabase";
import { useRouter } from "next/navigation";
import { workspaceService } from "@/lib/services/workspaceService";
import type { WorkspaceInsert } from "@/types/supabase";

export default function CreateWorkspacePage() {
  const [formData, setFormData] = useState<CreateWorkspaceData>({
    name: "",
    description: "",
    type: "private",
    created_by: ""
  });

  const { supabase } = useSupabase();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        setError("Erreur lors de la récupération de l'utilisateur");
        return;
      }
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!userId) {
      setError("Vous devez être connecté pour créer un espace de travail");
      setLoading(false);
      return;
    }

    try {
      const newFormData: CreateWorkspaceData = {
        ...formData,
        created_by: userId || "",
        description: formData.description?.trim() || null
      };
      await workspaceService.createWorkspace(newFormData);
      router.push("/workspaces");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de l'espace de travail");
    } finally {
      setLoading(false);
    }
  };

  const types: { value: WorkspaceType; label: string }[] = [
    { value: "private", label: "Privé" },
    { value: "professional", label: "Professionnel" },
    { value: "family", label: "Famille" }
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Créer un nouvel espace de travail</h1>
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Créer un espace de travail">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Mon espace de travail"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description de l'espace de travail"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: WorkspaceType) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <div className="text-red-600" role="alert">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading} aria-label="Créer l'espace de travail">
            {loading ? "Création..." : "Créer l'espace de travail"}
          </Button>
        </form>
      </Card>
    </div>
  );
} 