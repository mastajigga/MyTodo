'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSupabase } from '@/lib/supabase/supabase-provider'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface Workspace {
  id: string
  name: string
  description: string | null
  type: 'personal' | 'team'
}

export function WorkspaceSettings({ workspace }: { workspace: Workspace }) {
  const [name, setName] = useState(workspace.name)
  const [description, setDescription] = useState(workspace.description || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { supabase } = useSupabase()
  const router = useRouter()

  const handleUpdate = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('workspaces')
        .update({
          name,
          description,
        })
        .eq('id', workspace.id)

      if (error) throw error

      router.refresh()
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspace.id)

      if (error) throw error

      router.push('/workspaces')
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres généraux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Nom
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de l'espace de travail"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de l'espace de travail"
              rows={4}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error.message}</p>
          )}
          <Button
            onClick={handleUpdate}
            disabled={loading || !name}
            className="w-full"
          >
            Mettre à jour
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zone de danger</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Supprimer l'espace de travail
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Êtes-vous sûr de vouloir supprimer cet espace de travail ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Toutes les données associées à cet
                  espace de travail seront définitivement supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
} 