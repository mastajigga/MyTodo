import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WorkspaceMemberService } from "@/services/workspace-member.service"
import { toast } from "sonner"
import { useState } from "react"
import { useSupabase } from '@/lib/supabase/useSupabase'

interface InviteDialogProps {
  workspaceId: string
  isOpen: boolean
  onClose: () => void
}

interface InviteWorkspaceMemberData {
  email: string
  workspaceId: string
}

export function InviteDialog({ workspaceId, isOpen, onClose }: InviteDialogProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { supabase } = useSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const inviteData: InviteWorkspaceMemberData = {
        email,
        workspaceId
      }
      
      await WorkspaceMemberService.inviteToWorkspace(inviteData, supabase)
      toast.success("Invitation envoyée avec succès")
      onClose()
      setEmail("")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Une erreur est survenue lors de l'envoi de l'invitation")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inviter un membre</DialogTitle>
          <DialogDescription>
            Invitez un nouveau membre à rejoindre votre espace de travail en saisissant son adresse email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                placeholder="exemple@email.com"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Envoyer l'invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 