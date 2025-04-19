'use client'

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSupabase } from "@/lib/supabase/supabase-provider"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface CreateProjectButtonProps {
  workspaceId?: string
}

export function CreateProjectButton({ workspaceId }: CreateProjectButtonProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { supabase } = useSupabase()
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const name = formData.get('name') as string
      const description = formData.get('description') as string
      const selectedWorkspaceId = formData.get('workspaceId') as string

      if (!name || !selectedWorkspaceId) {
        throw new Error("Le nom du projet et l'espace de travail sont requis")
      }

      const { error } = await supabase
        .from('projects')
        .insert({
          name,
          description: description || null,
          workspace_id: selectedWorkspaceId,
        })

      if (error) throw error

      toast.success('Projet créé avec succès')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setOpen(false)
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error("Une erreur est survenue lors de la création du projet")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Créer un nouveau projet</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau projet à votre espace de travail.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom du projet</Label>
              <Input
                id="name"
                name="name"
                placeholder="Mon super projet"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description du projet (optionnel)"
              />
            </div>
            <input 
              type="hidden" 
              name="workspaceId" 
              value={workspaceId || ''} 
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Création..." : "Créer le projet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 