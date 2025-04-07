import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface InviteMembersProps {
  workspaceId: string
  onClose: () => void
}

export function InviteMembers({ workspaceId, onClose }: InviteMembersProps) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const supabase = createClient()

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setSending(true)
    try {
      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (userError) throw userError

      if (existingUser) {
        // Ajouter l'utilisateur au workspace
        const { error: memberError } = await supabase
          .from('workspace_members')
          .insert({
            workspace_id: workspaceId,
            user_id: existingUser.id,
            role: 'member'
          })

        if (memberError) throw memberError
      } else {
        // Envoyer une invitation par email
        const result = await supabase.auth.signInWithOtp({
          email,
          options: {
            data: {
              workspace_id: workspaceId,
              invitation: true
            }
          }
        })

        if (result?.error) throw result.error
      }

      toast.success('Invitation envoyée avec succès !')
      setEmail('')
      onClose()
    } catch (error: any) {
      toast.error('Erreur lors de l\'envoi de l\'invitation')
      if (error?.message) {
        console.error(error.message)
      }
    } finally {
      setSending(false)
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
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 className="mb-4 text-xl font-semibold">Inviter des membres</h2>

        <form onSubmit={handleInvite} className="space-y-4" data-testid="invite-form">
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Email du membre à inviter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
              disabled={sending}
            />
            <Button 
              type="submit" 
              disabled={sending} 
              data-testid="submit-button"
            >
              <span className="flex items-center gap-2">
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Envoyer l'invitation
                  </>
                )}
              </span>
            </Button>
          </div>
        </form>

        <AnimatePresence>
          {sending && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-md bg-blue-50 p-4 dark:bg-blue-900/20"
            >
              <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                <Check className="h-4 w-4" />
                <span>Envoi de l'invitation en cours...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
} 