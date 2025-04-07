import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Briefcase, Home, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const workspaceTypes = [
  { id: 'professional', icon: Briefcase, label: 'Professionnel' },
  { id: 'family', icon: Home, label: 'Famille' },
  { id: 'private', icon: User, label: 'Privé' }
] as const

interface CreateWorkspaceProps {
  onClose: () => void
  onSuccess?: (workspaceId: string) => void
}

export function CreateWorkspace({ onClose, onSuccess }: CreateWorkspaceProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<(typeof workspaceTypes)[number]['id']>('professional')
  const [creating, setCreating] = useState(false)
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !type) return

    setCreating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          name,
          description,
          type,
          created_by: user.id
        })
        .select()
        .single()

      if (workspaceError) throw workspaceError

      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspace.id,
          user_id: user.id,
          role: 'owner'
        })

      if (memberError) throw memberError

      toast.success('Espace de travail créé avec succès !')
      onSuccess?.(workspace.id)
      onClose()
    } catch (error) {
      toast.error('Erreur lors de la création de l\'espace de travail')
      console.error(error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
      >
        <h2 className="mb-4 text-xl font-semibold">Créer un espace de travail</h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom</label>
            <Input
              placeholder="Nom de l'espace de travail"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="Description (optionnelle)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {workspaceTypes.map(({ id, icon: Icon, label }) => (
                <Button
                  key={id}
                  type="button"
                  variant={type === id ? 'default' : 'outline'}
                  className="flex flex-col items-center gap-2 p-4"
                  onClick={() => setType(id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={creating}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Plus className="h-4 w-4" />
                </motion.div>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
} 